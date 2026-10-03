package cmd

import (
	"fmt"
	"time"

	"github.com/sabbil/devkit-cli/internal/markdown"
	"github.com/sabbil/devkit-cli/internal/output"
	"github.com/spf13/cobra"
)

var (
	mdExternalFlag bool
	mdInternalFlag bool
	mdTimeoutFlag  string

	markdownCmd = &cobra.Command{
		Use:   "markdown",
		Short: "Markdown validation and link integrity tools",
	}

	markdownLinksCmd = &cobra.Command{
		Use:   "links <file-or-dir>",
		Short: "Audit all internal, external, and anchor links within Markdown documentation",
		Args:  cobra.ExactArgs(1),
		RunE: func(cmd *cobra.Command, args []string) error {
			target := args[0]
			timeout, err := time.ParseDuration(mdTimeoutFlag)
			if err != nil {
				timeout = 10 * time.Second
			}

			output.Header("Markdown Link Integrity Audit")

			// If neither flag specified, check both
			checkExt := mdExternalFlag
			checkInt := mdInternalFlag
			if !checkExt && !checkInt {
				checkExt = true
				checkInt = true
			}

			report, err := markdown.CheckMarkdownPath(target, checkExt, checkInt, timeout)
			if err != nil {
				output.Error("Markdown audit failed: %v", err)
				return err
			}

			if output.JSONMode {
				return output.PrintJSON(report)
			}

			fmt.Printf("Files checked: %d\n", report.FilesChecked)
			fmt.Printf("Links checked: %d\n", report.LinksChecked)
			fmt.Printf("Broken links:  %d\n\n", report.BrokenCount)

			for _, link := range report.Results {
				if link.Valid {
					if output.VerboseMode {
						output.Success("%s:%d -> %s (%s)", link.SourceFile, link.Line, link.Target, link.Status)
					}
				} else {
					output.Error("%s:%d -> %s", link.SourceFile, link.Line, link.Target)
					fmt.Printf("    Reason: %s\n", link.Error)
				}
			}

			if report.BrokenCount > 0 {
				return fmt.Errorf("%d broken links detected", report.BrokenCount)
			}

			output.Success("All links verified successfully!")
			return nil
		},
	}
)

func init() {
	markdownLinksCmd.Flags().BoolVar(&mdExternalFlag, "external", false, "Validate external HTTP/HTTPS URLs")
	markdownLinksCmd.Flags().BoolVar(&mdInternalFlag, "internal", false, "Validate local file and relative paths")
	markdownLinksCmd.Flags().StringVar(&mdTimeoutFlag, "timeout", "10s", "HTTP request timeout")

	markdownCmd.AddCommand(markdownLinksCmd)
}
