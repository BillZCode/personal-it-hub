package main

import (
	"os"
	"path/filepath"
	"testing"

	"github.com/sabbil/devkit-cli/internal/config"
	"github.com/sabbil/devkit-cli/internal/filesystem"
	"github.com/sabbil/devkit-cli/internal/project"
	"github.com/sabbil/devkit-cli/internal/scanner"
)

func TestFormatSize(t *testing.T) {
	tests := []struct {
		bytes    int64
		expected string
	}{
		{500, "500 B"},
		{1024, "1.00 KB"},
		{1048576, "1.00 MB"},
	}

	for _, tt := range tests {
		res := scanner.FormatSize(tt.bytes)
		if res != tt.expected {
			t.Errorf("FormatSize(%d) = %s, expected %s", tt.bytes, res, tt.expected)
		}
	}
}

func TestCasingConversions(t *testing.T) {
	if filesystem.ToKebabCase("hello_world") != "hello-world" {
		t.Errorf("expected hello-world")
	}
	if filesystem.ToSnakeCase("hello-world") != "hello_world" {
		t.Errorf("expected hello_world")
	}
	if filesystem.ToCamelCase("hello-world") != "helloWorld" {
		t.Errorf("expected helloWorld")
	}
}

func TestProjectScaffoldAndAnalyze(t *testing.T) {
	tmpDir, err := os.MkdirTemp("", "devkit-test-*")
	if err != nil {
		t.Fatal(err)
	}
	defer os.RemoveAll(tmpDir)

	err = project.InitProject("test-app", "go", tmpDir, false)
	if err != nil {
		t.Fatalf("InitProject failed: %v", err)
	}

	info, err := project.AnalyzeProject(filepath.Join(tmpDir, "test-app"))
	if err != nil {
		t.Fatalf("AnalyzeProject failed: %v", err)
	}

	if info.Language != "Go" {
		t.Errorf("expected language Go, got %s", info.Language)
	}

	// Test PHP scaffolding & detection
	err = project.InitProject("test-php", "php", tmpDir, false)
	if err != nil {
		t.Fatalf("InitProject php failed: %v", err)
	}

	phpInfo, err := project.AnalyzeProject(filepath.Join(tmpDir, "test-php"))
	if err != nil {
		t.Fatalf("AnalyzeProject php failed: %v", err)
	}

	if phpInfo.Language != "PHP" {
		t.Errorf("expected language PHP, got %s", phpInfo.Language)
	}
	if phpInfo.PackageManager != "composer" {
		t.Errorf("expected package manager composer, got %s", phpInfo.PackageManager)
	}
}

func TestConfigDefaults(t *testing.T) {
	cfg := config.DefaultConfig()
	if cfg.DefaultTimeout != "10s" {
		t.Errorf("expected 10s default timeout")
	}
	if cfg.Editor != "nano" {
		t.Errorf("expected nano editor")
	}
}
