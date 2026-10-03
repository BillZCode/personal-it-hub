package scanner

import (
	"fmt"
	"io/fs"
	"os"
	"path/filepath"
	"strings"
)

type CleanupItem struct {
	Path        string `json:"path"`
	RelPath     string `json:"relative_path"`
	Type        string `json:"type"`
	Size        int64  `json:"size"`
	SizeHuman   string `json:"size_human"`
	Description string `json:"description"`
}

type CleanupReport struct {
	Items      []CleanupItem `json:"items"`
	TotalSize  int64         `json:"total_size"`
	TotalHuman string        `json:"total_human"`
}

var CommonArtifacts = map[string]string{
	"node_modules":  "Node.js dependencies",
	"dist":          "Build output directory",
	"build":         "Compiled binaries/assets",
	"coverage":      "Test coverage reports",
	".cache":        "Tooling cache",
	".tmp":          "Temporary files",
	"__pycache__":   "Python bytecode cache",
	"target":        "Rust / Java compilation target",
	".pytest_cache": "Pytest cache",
	".turbo":        "Turborepo cache",
	".next":         "Next.js build cache",
	".nuxt":         "Nuxt.js build cache",
	".dart_tool":    "Dart build cache",
}

func FormatSize(bytes int64) string {
	const unit = 1024
	if bytes < unit {
		return fmt.Sprintf("%d B", bytes)
	}
	div, exp := int64(unit), 0
	for n := bytes / unit; n >= unit; n /= unit {
		div *= unit
		exp++
	}
	return fmt.Sprintf("%.2f %cB", float64(bytes)/float64(div), "KMGTPE"[exp])
}

func DirSize(path string) (int64, error) {
	var size int64
	err := filepath.WalkDir(path, func(_ string, d fs.DirEntry, err error) error {
		if err != nil {
			return nil
		}
		if !d.IsDir() {
			info, err := d.Info()
			if err == nil {
				size += info.Size()
			}
		}
		return nil
	})
	return size, err
}

func ScanCleanable(rootDir string, deep bool) (*CleanupReport, error) {
	report := &CleanupReport{}

	err := filepath.WalkDir(rootDir, func(path string, d fs.DirEntry, err error) error {
		if err != nil {
			return nil
		}

		name := d.Name()
		rel, _ := filepath.Rel(rootDir, path)

		// Don't recurse into .git
		if d.IsDir() && name == ".git" {
			return filepath.SkipDir
		}

		if d.IsDir() {
			if desc, ok := CommonArtifacts[name]; ok {
				sz, _ := DirSize(path)
				report.Items = append(report.Items, CleanupItem{
					Path:        path,
					RelPath:     rel,
					Type:        "directory",
					Size:        sz,
					SizeHuman:   FormatSize(sz),
					Description: desc,
				})
				report.TotalSize += sz
				return filepath.SkipDir
			}
		} else {
			// Log files
			if strings.HasSuffix(name, ".log") || strings.HasSuffix(name, ".tmp") {
				info, err := d.Info()
				if err == nil {
					sz := info.Size()
					report.Items = append(report.Items, CleanupItem{
						Path:        path,
						RelPath:     rel,
						Type:        "file",
						Size:        sz,
						SizeHuman:   FormatSize(sz),
						Description: "Log/temporary file",
					})
					report.TotalSize += sz
				}
			}
		}

		if !deep && strings.Count(rel, string(filepath.Separator)) > 3 {
			if d.IsDir() {
				return filepath.SkipDir
			}
		}

		return nil
	})

	report.TotalHuman = FormatSize(report.TotalSize)
	return report, err
}

func ExecuteCleanup(report *CleanupReport, dryRun bool) (int64, error) {
	var freed int64
	for _, item := range report.Items {
		if !dryRun {
			err := os.RemoveAll(item.Path)
			if err != nil {
				return freed, fmt.Errorf("failed to remove %s: %w", item.RelPath, err)
			}
		}
		freed += item.Size
	}
	return freed, nil
}
