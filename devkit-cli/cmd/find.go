package cmd

import (
	"fmt"
	"strings"

	"github.com/sabbil/devkit-cli/internal/filesystem"
	"github.com/sabbil/devkit-cli/internal/output"
	"github.com/spf13/cobra"
)

var (
	findExtsFlag    string
	findExcludeFlag string
	findMinSizeFlag int64

	findCmd = &cobra.Command{
		Use:   "find <pattern>",
		Short: "Search for code patterns, TODOs, or large disk files",
		Args:  cobra.MaximumNArgs(1),
		RunE: func(cmd *cobra.Command, args []string) error {
			if len(args) == 0 {
				return cmd.Help()
			}

			pattern := args[0]
			var exts []string
			if findExtsFlag != "" {
				exts = strings.Split(findExtsFlag, ",")
			}

			var excludes []string
			if findExcludeFlag != "" {
				excludes = strings.Split(findExcludeFlag, ",")
			}

			matches, err := filesystem.FindInFiles(".", pattern, exts, excludes)
			if err != nil {
				output.Error("Search error: %v", err)
				return err
			}

			if output.JSONMode {
				return output.PrintJSON(matches)
			}

			output.Header(fmt.Sprintf("Find Matches for: %s", pattern))
			if len(matches) == 0 {
				output.Info("No matches found.")
				return nil
			}

			for _, m := range matches {
				fmt.Printf("%s:%d:%d\n  %s\n", m.File, m.Line, m.Column, m.Content)
			}
			fmt.Printf("\nTotal matches: %d\n", len(matches))
			return nil
		},
	}

	findLargeCmd = &cobra.Command{
		Use:   "large",
		Short: "Locate large files across the workspace",
		RunE: func(cmd *cobra.Command, args []string) error {
			output.Header("Large File Locator")

			minBytes := findMinSizeFlag * 1024 * 1024
			files, err := filesystem.FindLargeFiles(".", minBytes)
			if err != nil {
				return err
			}

			if output.JSONMode {
				return output.PrintJSON(files)
			}

			if len(files) == 0 {
				output.Info("No files found exceeding %d MB.", findMinSizeFlag)
				return nil
			}

			for _, f := range files {
				fmt.Printf("  %-50s %10s\n", f.Path, f.SizeHuman)
			}
			return nil
		},
	}
)

func init() {
	findCmd.Flags().StringVar(&findExtsFlag, "ext", "", "Comma-separated extensions to search (e.g. go,ts,js)")
	findCmd.Flags().StringVar(&findExcludeFlag, "exclude", "node_modules,dist,build", "Directories to exclude")

	findLargeCmd.Flags().Int64Var(&findMinSizeFlag, "min-size", 10, "Minimum file size in megabytes")
	findCmd.AddCommand(findLargeCmd)
}
