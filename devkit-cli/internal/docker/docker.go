package docker

import (
	"context"
	"fmt"
	"os/exec"
	"strings"
	"time"
)

type DockerReport struct {
	Available        bool   `json:"available"`
	Containers       int    `json:"containers"`
	Images           int    `json:"images"`
	Volumes          int    `json:"volumes"`
	EstimatedReclaim string `json:"estimated_reclaim"`
}

func IsDockerAvailable() bool {
	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
	defer cancel()
	cmd := exec.CommandContext(ctx, "docker", "info")
	return cmd.Run() == nil
}

func InspectDocker() (*DockerReport, error) {
	if !IsDockerAvailable() {
		return &DockerReport{Available: false}, fmt.Errorf("docker is not installed or daemon is not running")
	}

	report := &DockerReport{Available: true}

	// Count stopped containers
	out, err := exec.Command("docker", "ps", "-a", "--filter", "status=exited", "-q").Output()
	if err == nil && len(strings.TrimSpace(string(out))) > 0 {
		report.Containers = len(strings.Split(strings.TrimSpace(string(out)), "\n"))
	}

	// Count dangling images
	out, err = exec.Command("docker", "images", "-f", "dangling=true", "-q").Output()
	if err == nil && len(strings.TrimSpace(string(out))) > 0 {
		report.Images = len(strings.Split(strings.TrimSpace(string(out)), "\n"))
	}

	// Count dangling volumes
	out, err = exec.Command("docker", "volume", "ls", "-f", "dangling=true", "-q").Output()
	if err == nil && len(strings.TrimSpace(string(out))) > 0 {
		report.Volumes = len(strings.Split(strings.TrimSpace(string(out)), "\n"))
	}

	report.EstimatedReclaim = "Reclaimable storage calculated during prune"
	return report, nil
}

func Prune(cleanContainers, cleanImages, cleanVolumes, cleanBuildCache, dryRun bool) (string, error) {
	if !IsDockerAvailable() {
		return "", fmt.Errorf("docker is not installed or daemon is not running")
	}

	if dryRun {
		return "Dry run: No docker assets were removed.", nil
	}

	var results []string

	if cleanContainers {
		out, err := exec.Command("docker", "container", "prune", "-f").CombinedOutput()
		if err == nil {
			results = append(results, string(out))
		}
	}
	if cleanImages {
		out, err := exec.Command("docker", "image", "prune", "-f").CombinedOutput()
		if err == nil {
			results = append(results, string(out))
		}
	}
	if cleanVolumes {
		out, err := exec.Command("docker", "volume", "prune", "-f").CombinedOutput()
		if err == nil {
			results = append(results, string(out))
		}
	}
	if cleanBuildCache {
		out, err := exec.Command("docker", "builder", "prune", "-f").CombinedOutput()
		if err == nil {
			results = append(results, string(out))
		}
	}

	return strings.Join(results, "\n"), nil
}
