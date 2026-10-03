package workflow

import (
	"context"
	"fmt"
	"os"
	"os/exec"
	"strings"
	"time"

	"gopkg.in/yaml.v3"
)

type Step struct {
	Name            string            `yaml:"name"`
	Command         string            `yaml:"command"`
	WorkingDir      string            `yaml:"working_dir"`
	Env             map[string]string `yaml:"env"`
	ContinueOnError bool              `yaml:"continue_on_error"`
	Timeout         string            `yaml:"timeout"`
}

type Workflow struct {
	Name        string            `yaml:"name"`
	Description string            `yaml:"description"`
	Env         map[string]string `yaml:"env"`
	Steps       []Step            `yaml:"steps"`
}

func LoadWorkflow(filePath string) (*Workflow, error) {
	data, err := os.ReadFile(filePath)
	if err != nil {
		return nil, err
	}

	wf := &Workflow{}
	if err := yaml.Unmarshal(data, wf); err != nil {
		return nil, err
	}

	return wf, nil
}

func ExecuteStep(step Step, defaultEnv map[string]string, dryRun bool) (string, error) {
	if dryRun {
		return fmt.Sprintf("[DRY-RUN] Would run: %s", step.Command), nil
	}

	cmdTimeout := 60 * time.Second
	if step.Timeout != "" {
		if d, err := time.ParseDuration(step.Timeout); err == nil {
			cmdTimeout = d
		}
	}

	ctx, cancel := context.WithTimeout(context.Background(), cmdTimeout)
	defer cancel()

	parts := strings.Fields(step.Command)
	if len(parts) == 0 {
		return "", fmt.Errorf("empty command")
	}

	cmd := exec.CommandContext(ctx, parts[0], parts[1:]...)
	if step.WorkingDir != "" {
		cmd.Dir = step.WorkingDir
	}

	// Environment
	cmd.Env = os.Environ()
	for k, v := range defaultEnv {
		cmd.Env = append(cmd.Env, fmt.Sprintf("%s=%s", k, v))
	}
	for k, v := range step.Env {
		cmd.Env = append(cmd.Env, fmt.Sprintf("%s=%s", k, v))
	}

	out, err := cmd.CombinedOutput()
	return string(out), err
}
