package cmd

import (
	"fmt"

	"github.com/sabbil/devkit-cli/internal/output"
	"github.com/sabbil/devkit-cli/internal/project"
	"github.com/spf13/cobra"
)

var (
	projectCmd = &cobra.Command{
		Use:   "project",
		Short: "Project inspection and metrics analyzer",
	}

	projectInfoCmd = &cobra.Command{
		Use:   "info [path]",
		Short: "Display project language, framework, dependencies, and size metrics",
		Args:  cobra.MaximumNArgs(1),
		RunE: func(cmd *cobra.Command, args []string) error {
			dir := "."
			if len(args) > 0 {
				dir = args[0]
			}

			info, err := project.AnalyzeProject(dir)
			if err != nil {
				output.Error("Failed to analyze project: %v", err)
				return err
			}

			if output.JSONMode {
				return output.PrintJSON(info)
			}

			output.Header("Project Information")
			fmt.Printf("Type:             %s\n", info.Type)
			fmt.Printf("Language:         %s\n", info.Language)
			fmt.Printf("Framework:        %s\n", info.Framework)
			fmt.Printf("Package Manager:  %s\n", info.PackageManager)
			fmt.Printf("Git Repository:   %t\n", info.GitInitialized)
			fmt.Printf("Directories:      %d\n", info.TotalDirs)
			fmt.Printf("Files:            %d\n", info.TotalFiles)
			fmt.Printf("Total Size:       %s\n", info.TotalSizeHuman)

			if len(info.LargestFiles) > 0 {
				fmt.Println("\nLargest files:")
				for _, lf := range info.LargestFiles {
					fmt.Printf("  %-40s %10s\n", lf.Path, lf.SizeHuman)
				}
			}

			return nil
		},
	}
)

func init() {
	projectCmd.AddCommand(projectInfoCmd)
}
