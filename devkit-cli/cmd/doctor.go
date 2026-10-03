package cmd

import (
	"fmt"

	"github.com/sabbil/devkit-cli/internal/executor"
	"github.com/sabbil/devkit-cli/internal/output"
	"github.com/spf13/cobra"
)

var (
	doctorCmd = &cobra.Command{
		Use:   "doctor",
		Short: "Perform system and development environment diagnostic audit",
		RunE: func(cmd *cobra.Command, args []string) error {
			output.Header("DEVKIT DOCTOR - Environment Diagnostic")

			report := executor.RunDoctor()

			if output.JSONMode {
				return output.PrintJSON(report)
			}

			fmt.Printf("OS: %s | Arch: %s | CPUs: %d | Host Go: %s\n\n", report.OS, report.Arch, report.CPUs, report.GoVersion)

			allOk := true
			for _, diag := range report.Diagnostics {
				if diag.Installed {
					output.Success("%-14s %s", diag.Name, diag.Version)
				} else {
					allOk = false
					output.Error("%-14s %s", diag.Name, diag.Status)
					if diag.Details != "" {
						fmt.Printf("   Fix: %s\n", diag.Details)
					}
				}
			}

			fmt.Println()
			if allOk {
				output.Success("Your developer workstation is fully operational!")
			} else {
				output.Warning("Some optional tools are missing. Review the instructions above to install them.")
			}

			return nil
		},
	}
)
