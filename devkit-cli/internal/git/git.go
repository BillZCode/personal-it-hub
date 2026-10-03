package git

import (
	"context"
	"fmt"
	"os/exec"
	"strings"
	"time"
)

type GitSummary struct {
	IsRepo         bool     `json:"is_repo"`
	CurrentBranch  string   `json:"current_branch"`
	WorkingClean   bool     `json:"working_clean"`
	ChangedFiles   []string `json:"changed_files"`
	UntrackedFiles []string `json:"untracked_files"`
	LastCommit     string   `json:"last_commit"`
	RemoteURL      string   `json:"remote_url"`
	AheadBehind    string   `json:"ahead_behind"`
}

func IsGitInstalled() bool {
	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
	defer cancel()
	return exec.CommandContext(ctx, "git", "--version").Run() == nil
}

func GetSummary(dir string) (*GitSummary, error) {
	if !IsGitInstalled() {
		return nil, fmt.Errorf("git is not installed")
	}

	summary := &GitSummary{}

	// Check if in repo
	cmd := exec.Command("git", "rev-parse", "--is-inside-work-tree")
	cmd.Dir = dir
	if err := cmd.Run(); err != nil {
		summary.IsRepo = false
		return summary, nil
	}
	summary.IsRepo = true

	// Current branch
	cmd = exec.Command("git", "branch", "--show-current")
	cmd.Dir = dir
	if out, err := cmd.Output(); err == nil {
		summary.CurrentBranch = strings.TrimSpace(string(out))
	}

	// Status (porcelain)
	cmd = exec.Command("git", "status", "--porcelain")
	cmd.Dir = dir
	if out, err := cmd.Output(); err == nil {
		lines := strings.Split(strings.TrimSpace(string(out)), "\n")
		summary.WorkingClean = len(strings.TrimSpace(string(out))) == 0
		for _, line := range lines {
			line = strings.TrimSpace(line)
			if len(line) < 3 {
				continue
			}
			if strings.HasPrefix(line, "??") {
				summary.UntrackedFiles = append(summary.UntrackedFiles, strings.TrimSpace(line[3:]))
			} else {
				summary.ChangedFiles = append(summary.ChangedFiles, strings.TrimSpace(line[3:]))
			}
		}
	}

	// Last commit
	cmd = exec.Command("git", "log", "-1", "--pretty=format:%h - %s (%cr) <%an>")
	cmd.Dir = dir
	if out, err := cmd.Output(); err == nil {
		summary.LastCommit = strings.TrimSpace(string(out))
	}

	// Remote
	cmd = exec.Command("git", "remote", "get-url", "origin")
	cmd.Dir = dir
	if out, err := cmd.Output(); err == nil {
		summary.RemoteURL = strings.TrimSpace(string(out))
	} else {
		summary.RemoteURL = "none"
	}

	// Ahead/Behind
	cmd = exec.Command("git", "rev-list", "--left-right", "--count", "HEAD...@{upstream}")
	cmd.Dir = dir
	if out, err := cmd.Output(); err == nil {
		parts := strings.Fields(strings.TrimSpace(string(out)))
		if len(parts) == 2 {
			summary.AheadBehind = fmt.Sprintf("ahead %s, behind %s", parts[0], parts[1])
		}
	} else {
		summary.AheadBehind = "no tracking branch"
	}

	return summary, nil
}

func CleanupMergedBranches(dir string, dryRun bool) ([]string, error) {
	if !IsGitInstalled() {
		return nil, fmt.Errorf("git is not installed")
	}

	// Get current branch
	cmd := exec.Command("git", "branch", "--show-current")
	cmd.Dir = dir
	currOut, err := cmd.Output()
	if err != nil {
		return nil, err
	}
	currentBranch := strings.TrimSpace(string(currOut))

	// Get merged branches
	cmd = exec.Command("git", "branch", "--merged")
	cmd.Dir = dir
	out, err := cmd.Output()
	if err != nil {
		return nil, err
	}

	var candidates []string
	lines := strings.Split(strings.TrimSpace(string(out)), "\n")
	for _, l := range lines {
		b := strings.TrimSpace(strings.TrimPrefix(l, "*"))
		if b == "" || b == currentBranch || b == "main" || b == "master" || b == "develop" {
			continue
		}
		candidates = append(candidates, b)
	}

	if dryRun || len(candidates) == 0 {
		return candidates, nil
	}

	for _, b := range candidates {
		delCmd := exec.Command("git", "branch", "-d", b)
		delCmd.Dir = dir
		_ = delCmd.Run()
	}

	return candidates, nil
}
