package project

import (
	"encoding/json"
	"fmt"
	"io/fs"
	"os"
	"os/exec"
	"path/filepath"
	"sort"
	"strings"

	"github.com/sabbil/devkit-cli/internal/scanner"
)

type FileSizeEntry struct {
	Path      string `json:"path"`
	Size      int64  `json:"size"`
	SizeHuman string `json:"size_human"`
}

type ProjectInfo struct {
	Type           string          `json:"type"`
	Language       string          `json:"language"`
	Framework      string          `json:"framework"`
	PackageManager string          `json:"package_manager"`
	GitInitialized bool            `json:"git_initialized"`
	TotalFiles     int             `json:"total_files"`
	TotalDirs      int             `json:"total_dirs"`
	TotalSize      int64           `json:"total_size"`
	TotalSizeHuman string          `json:"total_size_human"`
	LargestFiles   []FileSizeEntry `json:"largest_files"`
}

func AnalyzeProject(rootDir string) (*ProjectInfo, error) {
	info := &ProjectInfo{
		Type:           "Generic Project",
		Language:       "Unknown",
		Framework:      "None detected",
		PackageManager: "None",
	}

	// Git check
	if _, err := os.Stat(filepath.Join(rootDir, ".git")); err == nil {
		info.GitInitialized = true
	}

	// Detect Node / TS / React / Next
	if pkgData, err := os.ReadFile(filepath.Join(rootDir, "package.json")); err == nil {
		info.Type = "Node.js Application"
		info.Language = "JavaScript"
		info.PackageManager = "npm"

		if _, err := os.Stat(filepath.Join(rootDir, "pnpm-lock.yaml")); err == nil {
			info.PackageManager = "pnpm"
		} else if _, err := os.Stat(filepath.Join(rootDir, "yarn.lock")); err == nil {
			info.PackageManager = "yarn"
		} else if _, err := os.Stat(filepath.Join(rootDir, "bun.lockb")); err == nil {
			info.PackageManager = "bun"
		}

		if _, err := os.Stat(filepath.Join(rootDir, "tsconfig.json")); err == nil {
			info.Language = "TypeScript"
		}

		var pkgMap map[string]interface{}
		if json.Unmarshal(pkgData, &pkgMap) == nil {
			deps, _ := pkgMap["dependencies"].(map[string]interface{})
			devDeps, _ := pkgMap["devDependencies"].(map[string]interface{})

			hasDep := func(dep string) bool {
				if deps != nil && deps[dep] != nil {
					return true
				}
				if devDeps != nil && devDeps[dep] != nil {
					return true
				}
				return false
			}

			if hasDep("next") {
				info.Framework = "Next.js"
			} else if hasDep("react") {
				info.Framework = "React"
			} else if hasDep("vue") {
				info.Framework = "Vue.js"
			} else if hasDep("express") {
				info.Framework = "Express"
			} else if hasDep("fastify") {
				info.Framework = "Fastify"
			}
		}
	} else if _, err := os.Stat(filepath.Join(rootDir, "go.mod")); err == nil {
		info.Type = "Go Module"
		info.Language = "Go"
		info.PackageManager = "go mod"
		info.Framework = "Standard Library / Go Modules"
	} else if _, err := os.Stat(filepath.Join(rootDir, "requirements.txt")); err == nil || hasFileSuffix(rootDir, ".py") {
		info.Type = "Python Project"
		info.Language = "Python"
		info.PackageManager = "pip"
		if _, err := os.Stat(filepath.Join(rootDir, "pyproject.toml")); err == nil {
			info.PackageManager = "poetry / pip"
		}
	} else if _, err := os.Stat(filepath.Join(rootDir, "composer.json")); err == nil || hasFileSuffix(rootDir, ".php") {
		info.Type = "PHP Application"
		info.Language = "PHP"
		info.PackageManager = "composer"
		info.Framework = "Vanilla PHP"

		if compData, err := os.ReadFile(filepath.Join(rootDir, "composer.json")); err == nil {
			var compMap map[string]interface{}
			if json.Unmarshal(compData, &compMap) == nil {
				req, _ := compMap["require"].(map[string]interface{})
				if req != nil {
					if req["laravel/framework"] != nil {
						info.Framework = "Laravel"
					} else if req["slim/slim"] != nil {
						info.Framework = "Slim"
					} else if req["symfony/framework-bundle"] != nil {
						info.Framework = "Symfony"
					}
				}
			}
		}
	} else if _, err := os.Stat(filepath.Join(rootDir, "Cargo.toml")); err == nil {
		info.Type = "Rust Crate"
		info.Language = "Rust"
		info.PackageManager = "cargo"
	}

	// File metrics
	var allFiles []FileSizeEntry
	err := filepath.WalkDir(rootDir, func(path string, d fs.DirEntry, err error) error {
		if err != nil {
			return nil
		}
		name := d.Name()
		if d.IsDir() {
			if name == ".git" || name == "node_modules" || name == "vendor" {
				return filepath.SkipDir
			}
			info.TotalDirs++
		} else {
			info.TotalFiles++
			fInfo, err := d.Info()
			if err == nil {
				sz := fInfo.Size()
				info.TotalSize += sz
				rel, _ := filepath.Rel(rootDir, path)
				allFiles = append(allFiles, FileSizeEntry{
					Path:      rel,
					Size:      sz,
					SizeHuman: scanner.FormatSize(sz),
				})
			}
		}
		return nil
	})

	sort.Slice(allFiles, func(i, j int) bool {
		return allFiles[i].Size > allFiles[j].Size
	})

	if len(allFiles) > 5 {
		info.LargestFiles = allFiles[:5]
	} else {
		info.LargestFiles = allFiles
	}

	info.TotalSizeHuman = scanner.FormatSize(info.TotalSize)
	return info, err
}

func hasFileSuffix(dir, suffix string) bool {
	entries, err := os.ReadDir(dir)
	if err != nil {
		return false
	}
	for _, e := range entries {
		if !e.IsDir() && strings.HasSuffix(e.Name(), suffix) {
			return true
		}
	}
	return false
}

// Scaffold templates
func InitProject(name, templateType, destDir string, gitInit bool) error {
	target := filepath.Join(destDir, name)
	if _, err := os.Stat(target); err == nil {
		return fmt.Errorf("target directory %s already exists", name)
	}

	if err := os.MkdirAll(target, 0755); err != nil {
		return err
	}

	switch strings.ToLower(templateType) {
	case "go":
		_ = os.MkdirAll(filepath.Join(target, "cmd", name), 0755)
		_ = os.MkdirAll(filepath.Join(target, "internal"), 0755)
		_ = os.MkdirAll(filepath.Join(target, "pkg"), 0755)
		_ = os.MkdirAll(filepath.Join(target, "configs"), 0755)
		_ = os.MkdirAll(filepath.Join(target, "scripts"), 0755)
		_ = os.MkdirAll(filepath.Join(target, "tests"), 0755)

		_ = os.WriteFile(filepath.Join(target, "go.mod"), []byte(fmt.Sprintf("module %s\n\ngo 1.22\n", name)), 0644)
		_ = os.WriteFile(filepath.Join(target, "cmd", name, "main.go"), []byte(fmt.Sprintf(`package main

import "fmt"

func main() {
	fmt.Println("Welcome to %s")
}
`, name)), 0644)
		_ = os.WriteFile(filepath.Join(target, ".gitignore"), []byte("bin/\ndist/\n*.exe\n.env\n"), 0644)
		_ = os.WriteFile(filepath.Join(target, "README.md"), []byte(fmt.Sprintf("# %s\n\nA modern Go project scaffolded with devkit-cli.\n", name)), 0644)

	case "node", "typescript", "ts":
		_ = os.MkdirAll(filepath.Join(target, "src"), 0755)
		_ = os.MkdirAll(filepath.Join(target, "tests"), 0755)
		_ = os.MkdirAll(filepath.Join(target, "public"), 0755)

		pkgJson := fmt.Sprintf(`{
  "name": "%s",
  "version": "1.0.0",
  "description": "Scaffolded with devkit-cli",
  "main": "src/index.ts",
  "scripts": {
    "start": "ts-node src/index.ts",
    "build": "tsc",
    "test": "vitest"
  },
  "keywords": [],
  "author": "",
  "license": "MIT"
}
`, name)
		_ = os.WriteFile(filepath.Join(target, "package.json"), []byte(pkgJson), 0644)
		_ = os.WriteFile(filepath.Join(target, "src", "index.ts"), []byte(`console.log("Hello from devkit-cli scaffolded app!");`), 0644)
		_ = os.WriteFile(filepath.Join(target, ".gitignore"), []byte("node_modules/\ndist/\n.env\n"), 0644)
		_ = os.WriteFile(filepath.Join(target, "README.md"), []byte(fmt.Sprintf("# %s\n\nA modern TypeScript project.\n", name)), 0644)

	case "python", "py":
		_ = os.MkdirAll(filepath.Join(target, "src"), 0755)
		_ = os.MkdirAll(filepath.Join(target, "tests"), 0755)
		_ = os.WriteFile(filepath.Join(target, "requirements.txt"), []byte("# Add project dependencies here\n"), 0644)
		_ = os.WriteFile(filepath.Join(target, "src", "main.py"), []byte("def main():\n    print(\"Hello from Python app!\")\n\nif __name__ == \"__main__\":\n    main()\n"), 0644)
		_ = os.WriteFile(filepath.Join(target, ".gitignore"), []byte("__pycache__/\n*.pyc\n.venv/\n.env\n"), 0644)
		_ = os.WriteFile(filepath.Join(target, "README.md"), []byte(fmt.Sprintf("# %s\n\nA Python project created with devkit-cli.\n", name)), 0644)

	case "php":
		_ = os.MkdirAll(filepath.Join(target, "public"), 0755)
		_ = os.MkdirAll(filepath.Join(target, "src"), 0755)
		_ = os.MkdirAll(filepath.Join(target, "config"), 0755)

		composerJson := fmt.Sprintf(`{
  "name": "devkit/%s",
  "description": "Modern PHP project scaffolded with devkit-cli",
  "type": "project",
  "license": "MIT",
  "autoload": {
    "psr-4": {
      "App\\": "src/"
    }
  },
  "scripts": {
    "start": "php -S 0.0.0.0:8000 -t public"
  },
  "require": {
    "php": ">=8.1"
  }
}
`, name)
		_ = os.WriteFile(filepath.Join(target, "composer.json"), []byte(composerJson), 0644)

		indexPhp := fmt.Sprintf(`<?php
declare(strict_types=1);

require_once __DIR__ . '/../src/App.php';

use App\App;

$app = new App();
$app->run('%s');
`, name)
		_ = os.WriteFile(filepath.Join(target, "public", "index.php"), []byte(indexPhp), 0644)

		appPhp := `<?php
declare(strict_types=1);

namespace App;

class App
{
    public function run(string $appName): void
    {
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode([
            'status' => 'success',
            'message' => "Welcome to {$appName}!",
            'runtime' => 'PHP ' . PHP_VERSION,
            'timestamp' => time()
        ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    }
}
`
		_ = os.WriteFile(filepath.Join(target, "src", "App.php"), []byte(appPhp), 0644)
		_ = os.WriteFile(filepath.Join(target, ".gitignore"), []byte("vendor/\n.env\n*.log\n"), 0644)
		_ = os.WriteFile(filepath.Join(target, "README.md"), []byte(fmt.Sprintf("# %s\n\nA modern PHP 8+ project scaffolded with devkit-cli.\n\n## Quick Start\n```bash\n# Run development built-in server\ncomposer run start\n# or\nphp -S 0.0.0.0:8000 -t public\n```\n", name)), 0644)

	default:
		// Generic empty project
		_ = os.MkdirAll(filepath.Join(target, "src"), 0755)
		_ = os.MkdirAll(filepath.Join(target, "docs"), 0755)
		_ = os.WriteFile(filepath.Join(target, ".gitignore"), []byte(".env\n"), 0644)
		_ = os.WriteFile(filepath.Join(target, "README.md"), []byte(fmt.Sprintf("# %s\n\nScaffolded with devkit-cli.\n", name)), 0644)
	}

	if gitInit {
		cmd := exec.Command("git", "init", target)
		_ = cmd.Run()
	}

	return nil
}
