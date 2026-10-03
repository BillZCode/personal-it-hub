package cmd

import (
	"fmt"
	"strings"

	"github.com/sabbil/devkit-cli/internal/config"
	"github.com/sabbil/devkit-cli/internal/output"
	"github.com/spf13/cobra"
)

var (
	configCmd = &cobra.Command{
		Use:   "config",
		Short: "Manage devkit-cli persistent configuration settings",
	}

	configListCmd = &cobra.Command{
		Use:   "list",
		Short: "Display current configuration parameters",
		RunE: func(cmd *cobra.Command, args []string) error {
			cfg, err := config.LoadConfig()
			if err != nil {
				return err
			}

			if output.JSONMode {
				return output.PrintJSON(cfg)
			}

			output.Header("DevKit Configuration")
			fmt.Printf("Config File:        %s\n\n", config.GetConfigPath())
			fmt.Printf("Default Exclusions: %s\n", strings.Join(cfg.DefaultExclusions, ", "))
			fmt.Printf("Default Timeout:    %s\n", cfg.DefaultTimeout)
			fmt.Printf("Output Format:      %s\n", cfg.OutputFormat)
			fmt.Printf("Backup Directory:   %s\n", cfg.BackupDir)
			fmt.Printf("Default Editor:     %s\n", cfg.Editor)
			fmt.Printf("Color Enabled:      %t\n", cfg.Color)

			return nil
		},
	}

	configSetCmd = &cobra.Command{
		Use:   "set <key> <value>",
		Short: "Update a configuration setting (timeout, format, backup_dir, editor, color)",
		Args:  cobra.ExactArgs(2),
		RunE: func(cmd *cobra.Command, args []string) error {
			key, val := args[0], args[1]
			err := config.SetValue(key, val)
			if err != nil {
				output.Error("Config update failed: %v", err)
				return err
			}
			output.Success("Configuration '%s' set to '%s'.", key, val)
			return nil
		},
	}

	configResetCmd = &cobra.Command{
		Use:   "reset",
		Short: "Reset configuration back to default values",
		RunE: func(cmd *cobra.Command, args []string) error {
			err := config.SaveConfig(config.DefaultConfig())
			if err != nil {
				return err
			}
			output.Success("Configuration reset to defaults.")
			return nil
		},
	}
)

func init() {
	configCmd.AddCommand(configListCmd)
	configCmd.AddCommand(configSetCmd)
	configCmd.AddCommand(configResetCmd)
}
