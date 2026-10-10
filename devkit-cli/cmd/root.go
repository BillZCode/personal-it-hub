package cmd

import (
	"fmt"
	"os"

	"github.com/sabbil/devkit-cli/internal/output"
	"github.com/spf13/cobra"
)

var (
	version = "1.0.0"

	jsonFlag    bool
	quietFlag   bool
	verboseFlag bool
	noColorFlag bool
	dryRunFlag  bool
	yesFlag     bool

	rootCmd = &cobra.Command{
		Use:   "devkit",
		Short: "devkit - Automate your everyday development workflow",
		Long: `
   ___           __ ___ __       ________   ____
  / _ \___ _  __/ //_//_/ /_    / ___/ / /  /  _/
 / // / -_) |/ / ,<  / / __/   / /__/ / /___/ /  
/____/\__/|___/_/|_|/_/\__/    \___/_/____/___/  
  ⚡ DevKit Automation Suite - Modern Developer CLI

devkit-cli is a fast, cross-platform, modular developer automation CLI 
built to automate tedious tasks across project scaffolding, directory cleaning, 
docker hygiene, markdown link integrity, git workflows, backups, search, and diagnostics.`,
		PersistentPreRun: func(cmd *cobra.Command, args []string) {
			output.JSONMode = jsonFlag
			output.QuietMode = quietFlag
			output.VerboseMode = verboseFlag
			output.NoColor = noColorFlag
		},
	}
)

func Execute() {
	if err := rootCmd.Execute(); err != nil {
		fmt.Fprintf(os.Stderr, "Error: %v\n", err)
		os.Exit(1)
	}
}

func init() {
	rootCmd.PersistentFlags().BoolVar(&jsonFlag, "json", false, "Output results in JSON format")
	rootCmd.PersistentFlags().BoolVarP(&quietFlag, "quiet", "q", false, "Suppress non-essential output")
	rootCmd.PersistentFlags().BoolVarP(&verboseFlag, "verbose", "v", false, "Enable verbose output")
	rootCmd.PersistentFlags().BoolVar(&noColorFlag, "no-color", false, "Disable colorized terminal output")
	rootCmd.PersistentFlags().BoolVar(&dryRunFlag, "dry-run", false, "Simulate execution without modifying files")
	rootCmd.PersistentFlags().BoolVarP(&yesFlag, "yes", "y", false, "Skip confirmation prompts")

	rootCmd.Version = version

	// Register subcommands
	rootCmd.AddCommand(initCmd)
	rootCmd.AddCommand(cleanCmd)
	rootCmd.AddCommand(dockerCmd)
	rootCmd.AddCommand(markdownCmd)
	rootCmd.AddCommand(projectCmd)
	rootCmd.AddCommand(gitCmd)
	rootCmd.AddCommand(depsCmd)
	rootCmd.AddCommand(backupCmd)
	rootCmd.AddCommand(findCmd)
	rootCmd.AddCommand(renameCmd)
	rootCmd.AddCommand(doctorCmd)
	rootCmd.AddCommand(batchCmd)
	rootCmd.AddCommand(configCmd)
}
