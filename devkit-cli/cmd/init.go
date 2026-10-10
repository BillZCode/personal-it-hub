package cmd

import (
	"fmt"
	"os"

	"github.com/sabbil/devkit-cli/internal/output"
	"github.com/sabbil/devkit-cli/internal/project"
	"github.com/spf13/cobra"
)

var (
	templateFlag string
	gitInitFlag  bool

	initCmd = &cobra.Command{
		Use:   "init [project-name]",
		Short: "Initialize and scaffold a new project workspace",
		Args:  cobra.MaximumNArgs(1),
		RunE: func(cmd *cobra.Command, args []string) error {
			projectName := "my-app"
			if len(args) > 0 {
				projectName = args[0]
			}

			output.Header("Scaffolding New Project")
			output.Info("Project Name: %s", projectName)
			output.Info("Template: %s", templateFlag)

			cwd, err := os.Getwd()
			if err != nil {
				return err
			}

			err = project.InitProject(projectName, templateFlag, cwd, gitInitFlag)
			if err != nil {
				output.Error("Failed to initialize project: %v", err)
				return err
			}

			output.Success("Project %s successfully initialized with %s template!", projectName, templateFlag)
			fmt.Printf("\nNext steps:\n  cd %s\n", projectName)
			return nil
		},
	}
)

func init() {
	initCmd.Flags().StringVarP(&templateFlag, "template", "t", "go", "Project template (go, node, typescript, python, php, generic)")
	initCmd.Flags().BoolVar(&gitInitFlag, "git", true, "Initialize git repository")
}
