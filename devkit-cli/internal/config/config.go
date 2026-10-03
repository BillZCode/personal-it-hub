package config

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
)

type Config struct {
	DefaultExclusions []string `json:"default_exclusions"`
	DefaultTimeout    string   `json:"default_timeout"`
	Color             bool     `json:"color"`
	OutputFormat      string   `json:"output_format"`
	BackupDir         string   `json:"backup_dir"`
	Editor            string   `json:"editor"`
}

func DefaultConfig() *Config {
	home, _ := os.UserHomeDir()
	return &Config{
		DefaultExclusions: []string{"node_modules", ".git", "dist", "build", "target", ".cache"},
		DefaultTimeout:    "10s",
		Color:             true,
		OutputFormat:      "text",
		BackupDir:         filepath.Join(home, ".devkit", "backups"),
		Editor:            "nano",
	}
}

func GetConfigPath() string {
	configDir, err := os.UserConfigDir()
	if err != nil {
		home, _ := os.UserHomeDir()
		return filepath.Join(home, ".devkit", "config.json")
	}
	return filepath.Join(configDir, "devkit-cli", "config.json")
}

func LoadConfig() (*Config, error) {
	cfg := DefaultConfig()
	path := GetConfigPath()

	data, err := os.ReadFile(path)
	if err != nil {
		if os.IsNotExist(err) {
			_ = SaveConfig(cfg)
			return cfg, nil
		}
		return cfg, err
	}

	if err := json.Unmarshal(data, cfg); err != nil {
		return cfg, err
	}
	return cfg, nil
}

func SaveConfig(cfg *Config) error {
	path := GetConfigPath()
	if err := os.MkdirAll(filepath.Dir(path), 0755); err != nil {
		return err
	}
	data, err := json.MarshalIndent(cfg, "", "  ")
	if err != nil {
		return err
	}
	return os.WriteFile(path, data, 0644)
}

func SetValue(key, value string) error {
	cfg, err := LoadConfig()
	if err != nil {
		cfg = DefaultConfig()
	}

	switch key {
	case "default_timeout", "timeout":
		cfg.DefaultTimeout = value
	case "output_format", "format":
		cfg.OutputFormat = value
	case "backup_dir":
		cfg.BackupDir = value
	case "editor":
		cfg.Editor = value
	case "color":
		cfg.Color = (value == "true" || value == "1" || value == "yes")
	default:
		return fmt.Errorf("unknown configuration key: %s", key)
	}

	return SaveConfig(cfg)
}
