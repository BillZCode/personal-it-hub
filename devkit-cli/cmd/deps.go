package cmd

import (
	"context"
	"fmt"
	"os"
	"os/exec"
	"time"

	"github.com/sabbil/devkit-cli/internal/output"
	"github.com/spf13/cobra"
)

var (
	depsCmd = &cobra.Command{
		Use:   "deps",
		Short: "Dependency inspection and auditing helper",
	}

	depsListCmd = &cobra.Command{
		Use:   "list",
		Short: "List dependencies across Go, Node, or Python projects",
		RunE: func(cmd *cobra.Command, args []string) error {
			output.Header("Project Dependencies")

			if _, err := os.Stat("go.mod"); err == nil {
				output.Info("Detected Go module, running 'go list -m all'...")
				c := exec.Command("go", "list", "-m", "all")
				out, err := c.CombinedOutput()
				if err != nil {
					return err
				}
				fmt.Println(string(out))
				return nil
			}

			if _, err := os.Stat("package.json"); err == nil {
				output.Info("Detected Node.js project, running 'npm list --depth=0'...")
				c := exec.Command("npm", "list", "--depth=0")
				out, _ := c.CombinedOutput()
				fmt.Println(string(out))
				return nil
			}

			if _, err := os.Stat("requirements.txt"); err == nil {
				output.Info("Detected Python requirements.txt:")
				data, err := os.ReadFile("requirements.txt")
				if err != nil {
					return err
				}
				fmt.Println(string(data))
				return nil
			}

			output.Warning("No recognized dependency manifest found (go.mod, package.json, requirements.txt).")
			return nil
		},
	}

	depsAuditCmd = &cobra.Command{
		Use:   "audit",
		Short: "Audit dependencies for known security vulnerabilities",
		RunE: func(cmd *cobra.Command, args []string) error {
			output.Header("Security Audit")

			if _, err := os.Stat("package.json"); err == nil {
				output.Info("Running npm audit...")
				c := exec.Command("npm", "audit")
				out, _ := c.CombinedOutput()
				fmt.Println(string(out))
				return nil
			}

			if _, err := os.Stat("go.mod"); err == nil {
				ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
				defer cancel()
				if exec.CommandContext(ctx, "govulncheck", "--version").Run() == nil {
					output.Info("Running govulncheck ./...")
					c := exec.Command("govulncheck", "./...")
					out, _ := c.CombinedOutput()
					fmt.Println(string(out))
					return nil
				}
				output.Info("govulncheck not installed. Install via: go install golang.org/x/vuln/cmd/govulncheck@latest")
				return nil
			}

			output.Warning("Audit not supported for this project manifest.")
			return nil
		},
	}
)

func init() {
	depsCmd.AddCommand(depsListCmd)
	depsCmd.AddCommand(depsAuditCmd)
}
