package executor

import (
	"context"
	"fmt"
	"os/exec"
	"runtime"
	"strings"
	"time"
)

type DiagnosticItem struct {
	Name      string `json:"name"`
	Installed bool   `json:"installed"`
	Version   string `json:"version,omitempty"`
	Status    string `json:"status"`
	Details   string `json:"details,omitempty"`
}

type DoctorReport struct {
	OS          string           `json:"os"`
	Arch        string           `json:"arch"`
	CPUs        int              `json:"cpus"`
	GoVersion   string           `json:"go_version"`
	Diagnostics []DiagnosticItem `json:"diagnostics"`
}

func RunDoctor() *DoctorReport {
	report := &DoctorReport{
		OS:        runtime.GOOS,
		Arch:      runtime.GOARCH,
		CPUs:      runtime.NumCPU(),
		GoVersion: runtime.Version(),
	}

	tools := []struct {
		name string
		cmd  string
		args []string
		hint string
	}{
		{"Go", "go", []string{"version"}, "Install Go from https://go.dev/dl/"},
		{"Git", "git", []string{"--version"}, "Install Git from https://git-scm.com/"},
		{"Docker", "docker", []string{"--version"}, "Install Docker Engine / Desktop from https://docker.com"},
		{"Node.js", "node", []string{"--version"}, "Install Node.js from https://nodejs.org/"},
		{"npm", "npm", []string{"--version"}, "Installed alongside Node.js"},
		{"pnpm", "pnpm", []string{"--version"}, "Install pnpm via npm install -g pnpm"},
		{"Python", "python3", []string{"--version"}, "Install Python from https://python.org"},
		{"Rust / Cargo", "cargo", []string{"--version"}, "Install Rust via https://rustup.rs"},
		{"SSH", "ssh", []string{"-V"}, "Install OpenSSH client"},
		{"cURL", "curl", []string{"--version"}, "Install cURL package"},
		{"Wget", "wget", []string{"--version"}, "Install wget package"},
	}

	for _, t := range tools {
		ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
		cmd := exec.CommandContext(ctx, t.cmd, t.args...)
		out, err := cmd.CombinedOutput()
		cancel()

		if err == nil {
			v := strings.TrimSpace(string(out))
			if len(v) > 60 {
				v = v[:60] + "..."
			}
			report.Diagnostics = append(report.Diagnostics, DiagnosticItem{
				Name:      t.name,
				Installed: true,
				Version:   v,
				Status:    "OK",
			})
		} else {
			report.Diagnostics = append(report.Diagnostics, DiagnosticItem{
				Name:      t.name,
				Installed: false,
				Status:    "Missing",
				Details:   fmt.Sprintf("%s (%s)", t.hint, err.Error()),
			})
		}
	}

	return report
}
