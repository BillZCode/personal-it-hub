package cmd

import (
	"fmt"

	"github.com/sabbil/devkit-cli/internal/output"
	"github.com/sabbil/devkit-cli/internal/workflow"
	"github.com/spf13/cobra"
)

var (
	batchCmd = &cobra.Command{
		Use:   "batch",
		Short: "Batch workflow automation pipeline runner",
	}

	batchRunCmd = &cobra.Command{
		Use:   "run <workflow.yaml>",
		Short: "Execute sequential commands defined in a workflow manifest",
		Args:  cobra.ExactArgs(1),
		RunE: func(cmd *cobra.Command, args []string) error {
			wfPath := args[0]
			output.Header("Batch Workflow Execution")

			wf, err := workflow.LoadWorkflow(wfPath)
			if err != nil {
				output.Error("Failed to parse workflow: %v", err)
				return err
			}

			output.Info("Workflow Name: %s", wf.Name)
			if wf.Description != "" {
				output.Info("Description:   %s", wf.Description)
			}
			fmt.Printf("Steps to execute: %d\n\n", len(wf.Steps))

			for i, step := range wf.Steps {
				stepName := step.Name
				if stepName == "" {
					stepName = step.Command
				}
				fmt.Printf("[%d/%d] %s\n", i+1, len(wf.Steps), stepName)

				out, err := workflow.ExecuteStep(step, wf.Env, dryRunFlag)
				if err != nil {
					output.Error("Step failed: %v", err)
					if out != "" {
						fmt.Println(out)
					}
					if !step.ContinueOnError {
						return fmt.Errorf("workflow aborted on step: %s", stepName)
					}
					output.Warning("Continuing on error as requested in step config.")
				} else {
					output.Success("Step passed.")
					if output.VerboseMode && out != "" {
						fmt.Println(out)
					}
				}
			}

			output.Success("Batch workflow finished successfully!")
			return nil
		},
	}
)

func init() {
	batchCmd.AddCommand(batchRunCmd)
}
