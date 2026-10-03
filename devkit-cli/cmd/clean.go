package cmd

import (
	"fmt"

	"github.com/sabbil/devkit-cli/internal/output"
	"github.com/sabbil/devkit-cli/internal/scanner"
	"github.com/spf13/cobra"
)

var (
	deepCleanFlag bool

	cleanCmd = &cobra.Command{
		Use:   "clean [path]",
		Short: "Detect and clean unnecessary build artifacts and dependencies",
		Args:  cobra.MaximumNArgs(1),
		RunE: func(cmd *cobra.Command, args []string) error {
			targetDir := "."
			if len(args) > 0 {
				targetDir = args[0]
			}

			output.Header("Workspace Artifact Scanner")
			report, err := scanner.ScanCleanable(targetDir, deepCleanFlag)
			if err != nil {
				return err
			}

			if output.JSONMode {
				return output.PrintJSON(report)
			}

			if len(report.Items) == 0 {
				output.Success("Workspace is completely clean! No build artifacts found.")
				return nil
			}

			fmt.Println("Potential cleanup:")
			for _, item := range report.Items {
				fmt.Printf("  %-30s %10s  (%s)\n", item.RelPath, item.SizeHuman, item.Description)
			}
			fmt.Printf("\nTotal reclaimable: %s\n\n", report.TotalHuman)

			if dryRunFlag {
				output.Info("Dry-run active: no files were removed.")
				return nil
			}

			if !yesFlag {
				if !output.Confirm("Do you want to permanently remove these files?", false) {
					output.Info("Cleanup cancelled by user.")
					return nil
				}
			}

			freed, err := scanner.ExecuteCleanup(report, false)
			if err != nil {
				output.Error("Cleanup encountered error: %v", err)
				return err
			}

			output.Success("Cleanup complete! Reclaimed %s of disk space.", scanner.FormatSize(freed))
			return nil
		},
	}
)

func init() {
	cleanCmd.Flags().BoolVar(&deepCleanFlag, "deep", false, "Perform deep recursive scan across sub-projects")
}
