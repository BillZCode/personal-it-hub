package cmd

import (
	"fmt"

	"github.com/sabbil/devkit-cli/internal/docker"
	"github.com/sabbil/devkit-cli/internal/output"
	"github.com/spf13/cobra"
)

var (
	dockerContainersFlag bool
	dockerImagesFlag     bool
	dockerVolumesFlag    bool
	dockerCacheFlag      bool

	dockerCmd = &cobra.Command{
		Use:   "docker",
		Short: "Docker development workflow and hygiene utilities",
	}

	dockerCleanCmd = &cobra.Command{
		Use:   "clean",
		Short: "Clean stopped containers, dangling images, volumes, and builder cache",
		RunE: func(cmd *cobra.Command, args []string) error {
			output.Header("Docker Cleanup Audit")

			report, err := docker.InspectDocker()
			if err != nil {
				output.Error("Docker error: %v", err)
				return err
			}

			if output.JSONMode {
				return output.PrintJSON(report)
			}

			fmt.Println("Docker cleanup preview:")
			fmt.Printf("  Stopped containers: %d\n", report.Containers)
			fmt.Printf("  Dangling images:    %d\n", report.Images)
			fmt.Printf("  Dangling volumes:   %d (WARNING: Volume removal must be explicitly flagged)\n", report.Volumes)

			allFlags := !dockerContainersFlag && !dockerImagesFlag && !dockerVolumesFlag && !dockerCacheFlag
			doContainers := dockerContainersFlag || allFlags
			doImages := dockerImagesFlag || allFlags
			doVolumes := dockerVolumesFlag // Never delete volumes by default unless flag provided!
			doCache := dockerCacheFlag || allFlags

			if dryRunFlag {
				output.Info("Dry-run mode: Docker assets preserved.")
				return nil
			}

			if !yesFlag {
				if doVolumes {
					output.Warning("You have flagged Docker volumes for deletion. Data inside unused volumes will be permanently lost.")
				}
				if !output.Confirm("Proceed with Docker cleanup?", false) {
					output.Info("Docker cleanup aborted.")
					return nil
				}
			}

			result, err := docker.Prune(doContainers, doImages, doVolumes, doCache, false)
			if err != nil {
				output.Error("Docker prune failed: %v", err)
				return err
			}

			output.Success("Docker cleanup executed successfully.")
			if output.VerboseMode {
				fmt.Println(result)
			}
			return nil
		},
	}
)

func init() {
	dockerCleanCmd.Flags().BoolVar(&dockerContainersFlag, "containers", false, "Clean stopped containers")
	dockerCleanCmd.Flags().BoolVar(&dockerImagesFlag, "images", false, "Clean dangling images")
	dockerCleanCmd.Flags().BoolVar(&dockerVolumesFlag, "volumes", false, "Clean dangling volumes (Cautious)")
	dockerCleanCmd.Flags().BoolVar(&dockerCacheFlag, "build-cache", false, "Clean Docker builder cache")

	dockerCmd.AddCommand(dockerCleanCmd)
}
