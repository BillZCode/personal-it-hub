package filesystem

import (
	"bufio"
	"fmt"
	"io/fs"
	"os"
	"path/filepath"
	"regexp"
	"sort"
	"strings"
	"unicode"

	"github.com/sabbil/devkit-cli/internal/scanner"
)

type MatchResult struct {
	File    string `json:"file"`
	Line    int    `json:"line"`
	Column  int    `json:"column"`
	Content string `json:"content"`
}

type LargeFileResult struct {
	Path      string `json:"path"`
	Size      int64  `json:"size"`
	SizeHuman string `json:"size_human"`
}

func FindInFiles(rootDir, pattern string, extensions []string, excludeDirs []string) ([]MatchResult, error) {
	var results []MatchResult
	re, err := regexp.Compile(pattern)
	if err != nil {
		return nil, fmt.Errorf("invalid regex pattern: %w", err)
	}

	extMap := make(map[string]bool)
	for _, ext := range extensions {
		if ext != "" {
			if !strings.HasPrefix(ext, ".") {
				ext = "." + ext
			}
			extMap[strings.ToLower(ext)] = true
		}
	}

	exclMap := make(map[string]bool)
	for _, ed := range excludeDirs {
		exclMap[ed] = true
	}
	exclMap[".git"] = true

	err = filepath.WalkDir(rootDir, func(path string, d fs.DirEntry, err error) error {
		if err != nil {
			return nil
		}

		if d.IsDir() {
			if exclMap[d.Name()] {
				return filepath.SkipDir
			}
			return nil
		}

		if len(extMap) > 0 {
			ext := strings.ToLower(filepath.Ext(path))
			if !extMap[ext] {
				return nil
			}
		}

		// Don't search large binary files (> 5MB)
		info, err := d.Info()
		if err != nil || info.Size() > 5*1024*1024 {
			return nil
		}

		file, err := os.Open(path)
		if err != nil {
			return nil
		}
		defer file.Close()

		scanner := bufio.NewScanner(file)
		lineNum := 0
		rel, _ := filepath.Rel(rootDir, path)

		for scanner.Scan() {
			lineNum++
			text := scanner.Text()
			loc := re.FindStringIndex(text)
			if loc != nil {
				results = append(results, MatchResult{
					File:    rel,
					Line:    lineNum,
					Column:  loc[0] + 1,
					Content: strings.TrimSpace(text),
				})
			}
		}

		return nil
	})

	return results, err
}

func FindLargeFiles(rootDir string, minSizeBytes int64) ([]LargeFileResult, error) {
	var results []LargeFileResult

	err := filepath.WalkDir(rootDir, func(path string, d fs.DirEntry, err error) error {
		if err != nil {
			return nil
		}
		if d.IsDir() {
			if d.Name() == ".git" {
				return filepath.SkipDir
			}
			return nil
		}

		info, err := d.Info()
		if err == nil && info.Size() >= minSizeBytes {
			rel, _ := filepath.Rel(rootDir, path)
			results = append(results, LargeFileResult{
				Path:      rel,
				Size:      info.Size(),
				SizeHuman: scanner.FormatSize(info.Size()),
			})
		}
		return nil
	})

	sort.Slice(results, func(i, j int) bool {
		return results[i].Size > results[j].Size
	})

	return results, err
}

// Rename & Case Conversions
func ToKebabCase(s string) string {
	s = strings.ReplaceAll(s, "_", "-")
	var result strings.Builder
	for i, r := range s {
		if unicode.IsUpper(r) {
			if i > 0 && s[i-1] != '-' {
				result.WriteRune('-')
			}
			result.WriteRune(unicode.ToLower(r))
		} else {
			result.WriteRune(r)
		}
	}
	return result.String()
}

func ToSnakeCase(s string) string {
	s = strings.ReplaceAll(s, "-", "_")
	var result strings.Builder
	for i, r := range s {
		if unicode.IsUpper(r) {
			if i > 0 && s[i-1] != '_' {
				result.WriteRune('_')
			}
			result.WriteRune(unicode.ToLower(r))
		} else {
			result.WriteRune(r)
		}
	}
	return result.String()
}

func ToCamelCase(s string) string {
	parts := strings.FieldsFunc(s, func(r rune) bool {
		return r == '-' || r == '_' || r == ' '
	})
	if len(parts) == 0 {
		return s
	}
	result := strings.ToLower(parts[0])
	for _, p := range parts[1:] {
		if len(p) > 0 {
			result += strings.ToUpper(p[:1]) + strings.ToLower(p[1:])
		}
	}
	return result
}
