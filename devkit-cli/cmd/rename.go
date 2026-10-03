package cmd

import (
	"fmt"
	"os"
	"path/filepath"
	"strings"

	"github.com/sabbil/devkit-cli/internal/filesystem"
	"github.com/sabbil/devkit-cli/internal/output"
	"github.com/spf13/cobra"
)

var (
	renameFromCase string
	renameToCase   string
	renamePrefix   string
	renameSuffix   string

	renameCmd = &cobra.Command{
		Use:   "rename [files/directory]",
		Short: "Batch rename files (casing: kebab, snake, camel; prefix/suffix)",
		Args:  cobra.MaximumNArgs(1),
		RunE: func(cmd *cobra.Command, args []string) error {
			dir := "."
			if len(args) > 0 {
				dir = args[0]
			}

			output.Header("File Renaming Batch Utility")

			entries, err := os.ReadDir(dir)
			if err != nil {
				return err
			}

			type RenamePlan struct {
				OldPath string
				NewPath string
			}

			var plans []RenamePlan

			for _, e := range entries {
				oldName := e.Name()
				if strings.HasPrefix(oldName, ".") {
					continue
				}

				ext := filepath.Ext(oldName)
				base := strings.TrimSuffix(oldName, ext)
				newName := base

				switch renameToCase {
				case "kebab":
					newName = filesystem.ToKebabCase(base)
				case "snake":
					newName = filesystem.ToSnakeCase(base)
				case "camel":
					newName = filesystem.ToCamelCase(base)
				case "lower":
					newName = strings.ToLower(base)
				case "upper":
					newName = strings.ToUpper(base)
				}

				if renamePrefix != "" {
					newName = renamePrefix + newName
				}
				if renameSuffix != "" {
					newName = newName + renameSuffix
				}

				newName = newName + ext
				if newName != oldName {
					plans = append(plans, RenamePlan{
						OldPath: filepath.Join(dir, oldName),
						NewPath: filepath.Join(dir, newName),
					})
				}
			}

			if len(plans) == 0 {
				output.Info("No filenames matched rename criteria.")
				return nil
			}

			fmt.Println("Planned renames:")
			for _, p := range plans {
				fmt.Printf("  %s -> %s\n", filepath.Base(p.OldPath), filepath.Base(p.NewPath))
			}

			if dryRunFlag {
				output.Info("Dry-run mode: no filenames modified.")
				return nil
			}

			if !yesFlag {
				if !output.Confirm(fmt.Sprintf("Proceed with renaming %d files?", len(plans)), false) {
					output.Info("Renaming cancelled.")
					return nil
				}
			}

			for _, p := range plans {
				_ = os.Rename(p.OldPath, p.NewPath)
			}

			output.Success("Successfully renamed %d files.", len(plans))
			return nil
		},
	}
)

func init() {
	renameCmd.Flags().StringVar(&renameToCase, "to", "", "Target casing: kebab, snake, camel, lower, upper")
	renameCmd.Flags().StringVar(&renameFromCase, "from", "", "Source casing")
	renameCmd.Flags().StringVar(&renamePrefix, "prefix", "", "Add prefix to filename")
	renameCmd.Flags().StringVar(&renameSuffix, "suffix", "", "Add suffix to filename")
}
