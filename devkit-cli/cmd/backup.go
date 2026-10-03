package cmd

import (
	"github.com/sabbil/devkit-cli/internal/backup"
	"github.com/sabbil/devkit-cli/internal/config"
	"github.com/sabbil/devkit-cli/internal/output"
	"github.com/spf13/cobra"
)

var (
	backupFormatFlag         string
	backupIncludeNodeModules bool
	backupDestFlag           string

	backupCmd = &cobra.Command{
		Use:   "backup [directory]",
		Short: "Create compressed archives (.tar.gz or .zip) excluding node_modules and caches",
		Args:  cobra.MaximumNArgs(1),
		RunE: func(cmd *cobra.Command, args []string) error {
			src := "."
			if len(args) > 0 {
				src = args[0]
			}

			cfg, _ := config.LoadConfig()
			dest := cfg.BackupDir
			if backupDestFlag != "" {
				dest = backupDestFlag
			}

			output.Header("Workspace Archive Backup")
			output.Info("Source:      %s", src)
			output.Info("Destination: %s", dest)
			output.Info("Format:      %s", backupFormatFlag)

			outPath, err := backup.CreateBackup(src, dest, backupFormatFlag, backupIncludeNodeModules)
			if err != nil {
				output.Error("Backup failed: %v", err)
				return err
			}

			output.Success("Backup created successfully:\n  %s", outPath)
			return nil
		},
	}
)

func init() {
	backupCmd.Flags().StringVarP(&backupFormatFlag, "format", "f", "tar.gz", "Archive format: tar.gz or zip")
	backupCmd.Flags().StringVarP(&backupDestFlag, "dest", "d", "", "Destination directory for backup file")
	backupCmd.Flags().BoolVar(&backupIncludeNodeModules, "include-node-modules", false, "Include node_modules in archive")
}
