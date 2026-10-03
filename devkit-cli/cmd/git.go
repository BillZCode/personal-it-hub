package cmd

import (
	"fmt"
	"strings"

	"github.com/sabbil/devkit-cli/internal/git"
	"github.com/sabbil/devkit-cli/internal/output"
	"github.com/spf13/cobra"
)

var (
	gitCmd = &cobra.Command{
		Use:   "git",
		Short: "Git workflow automation and branch hygiene",
	}

	gitSummaryCmd = &cobra.Command{
		Use:   "summary [dir]",
		Short: "Comprehensive git status overview (branch, commit, tracking, changes)",
		Args:  cobra.MaximumNArgs(1),
		RunE: func(cmd *cobra.Command, args []string) error {
			dir := "."
			if len(args) > 0 {
				dir = args[0]
			}

			summary, err := git.GetSummary(dir)
			if err != nil {
				output.Error("Git error: %v", err)
				return err
			}

			if !summary.IsRepo {
				output.Warning("Directory is not a git repository.")
				return nil
			}

			if output.JSONMode {
				return output.PrintJSON(summary)
			}

			output.Header("Git Repository Summary")
			fmt.Printf("Branch:        %s\n", summary.CurrentBranch)
			fmt.Printf("Status:        %s\n", summary.AheadBehind)
			fmt.Printf("Remote:        %s\n", summary.RemoteURL)
			fmt.Printf("Last Commit:   %s\n", summary.LastCommit)
			fmt.Printf("Clean Tree:    %t\n", summary.WorkingClean)

			if len(summary.ChangedFiles) > 0 {
				fmt.Printf("\nModified files (%d):\n", len(summary.ChangedFiles))
				for _, f := range summary.ChangedFiles {
					fmt.Printf("  ~ %s\n", f)
				}
			}

			if len(summary.UntrackedFiles) > 0 {
				fmt.Printf("\nUntracked files (%d):\n", len(summary.UntrackedFiles))
				for _, f := range summary.UntrackedFiles {
					fmt.Printf("  ? %s\n", f)
				}
			}

			return nil
		},
	}

	gitCleanupCmd = &cobra.Command{
		Use:   "cleanup [dir]",
		Short: "Delete local branches that have been merged into main/master",
		Args:  cobra.MaximumNArgs(1),
		RunE: func(cmd *cobra.Command, args []string) error {
			dir := "."
			if len(args) > 0 {
				dir = args[0]
			}

			output.Header("Git Merged Branch Cleanup")
			candidates, err := git.CleanupMergedBranches(dir, true)
			if err != nil {
				output.Error("Branch audit failed: %v", err)
				return err
			}

			if len(candidates) == 0 {
				output.Success("No stale merged branches detected.")
				return nil
			}

			fmt.Println("Merged branch candidates:")
			for _, b := range candidates {
				fmt.Printf("  - %s\n", b)
			}

			if dryRunFlag {
				output.Info("Dry-run mode: no branches were deleted.")
				return nil
			}

			if !yesFlag {
				if !output.Confirm(fmt.Sprintf("Delete %d merged branch(es)?", len(candidates)), false) {
					output.Info("Aborted branch deletion.")
					return nil
				}
			}

			_, err = git.CleanupMergedBranches(dir, false)
			if err != nil {
				output.Error("Failed to delete branches: %v", err)
				return err
			}

			output.Success("Deleted %d merged branch(es): %s", len(candidates), strings.Join(candidates, ", "))
			return nil
		},
	}
)

func init() {
	gitCmd.AddCommand(gitSummaryCmd)
	gitCmd.AddCommand(gitCleanupCmd)
}
