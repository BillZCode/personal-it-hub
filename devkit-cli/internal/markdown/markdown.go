package markdown

import (
	"bufio"
	"context"
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"regexp"
	"strings"
	"sync"
	"time"
)

type LinkCheckResult struct {
	SourceFile string `json:"source_file"`
	Line       int    `json:"line"`
	Target     string `json:"target"`
	IsExternal bool   `json:"is_external"`
	Valid      bool   `json:"valid"`
	Status     string `json:"status"`
	Error      string `json:"error,omitempty"`
}

type MarkdownReport struct {
	FilesChecked int               `json:"files_checked"`
	LinksChecked int               `json:"links_checked"`
	BrokenCount  int               `json:"broken_count"`
	Results      []LinkCheckResult `json:"results"`
}

var (
	mdLinkRegex = regexp.MustCompile(`\[([^\]]*)\]\(([^)]+)\)`)
)

func CheckMarkdownPath(targetPath string, checkExternal, checkInternal bool, timeout time.Duration) (*MarkdownReport, error) {
	report := &MarkdownReport{}
	var files []string

	info, err := os.Stat(targetPath)
	if err != nil {
		return nil, err
	}

	if info.IsDir() {
		_ = filepath.Walk(targetPath, func(path string, d os.FileInfo, err error) error {
			if err == nil && !d.IsDir() && strings.HasSuffix(strings.ToLower(d.Name()), ".md") {
				files = append(files, path)
			}
			return nil
		})
	} else {
		files = append(files, targetPath)
	}

	report.FilesChecked = len(files)

	var allLinks []LinkCheckResult
	for _, file := range files {
		links, err := extractLinks(file)
		if err == nil {
			allLinks = append(allLinks, links...)
		}
	}

	client := &http.Client{
		Timeout: timeout,
	}

	// Filter links based on flags
	var filtered []LinkCheckResult
	for _, link := range allLinks {
		if link.IsExternal && !checkExternal {
			continue
		}
		if !link.IsExternal && !checkInternal {
			continue
		}
		filtered = append(filtered, link)
	}

	report.LinksChecked = len(filtered)

	// Worker pool for checking links
	var wg sync.WaitGroup
	semaphore := make(chan struct{}, 10)
	var mu sync.Mutex

	for i := range filtered {
		wg.Add(1)
		go func(idx int) {
			defer wg.Done()
			semaphore <- struct{}{}
			defer func() { <-semaphore }()

			item := &filtered[idx]
			if item.IsExternal {
				ctx, cancel := context.WithTimeout(context.Background(), timeout)
				defer cancel()

				req, err := http.NewRequestWithContext(ctx, "HEAD", item.Target, nil)
				if err != nil {
					item.Valid = false
					item.Error = err.Error()
					item.Status = "Invalid URL"
					return
				}
				req.Header.Set("User-Agent", "DevKit-CLI-LinkChecker/1.0")

				resp, err := client.Do(req)
				if err != nil {
					// Fallback to GET for sites that block HEAD
					req, _ = http.NewRequestWithContext(ctx, "GET", item.Target, nil)
					req.Header.Set("User-Agent", "DevKit-CLI-LinkChecker/1.0")
					resp, err = client.Do(req)
				}

				if err != nil {
					item.Valid = false
					item.Error = err.Error()
					item.Status = "Connection error"
				} else {
					defer resp.Body.Close()
					if resp.StatusCode >= 200 && resp.StatusCode < 400 {
						item.Valid = true
						item.Status = fmt.Sprintf("HTTP %d", resp.StatusCode)
					} else {
						item.Valid = false
						item.Status = fmt.Sprintf("HTTP %d", resp.StatusCode)
						item.Error = fmt.Sprintf("Server returned %d", resp.StatusCode)
					}
				}
			} else {
				// Internal file / anchor
				target := item.Target
				// Strip anchors
				anchorIdx := strings.Index(target, "#")
				if anchorIdx == 0 {
					// Pure anchor in same file
					item.Valid = true
					item.Status = "Anchor"
					return
				}
				if anchorIdx > 0 {
					target = target[:anchorIdx]
				}

				dir := filepath.Dir(item.SourceFile)
				resolved := filepath.Join(dir, target)
				if _, err := os.Stat(resolved); err == nil {
					item.Valid = true
					item.Status = "File exists"
				} else {
					item.Valid = false
					item.Status = "Missing file"
					item.Error = fmt.Sprintf("File not found: %s", target)
				}
			}

			mu.Lock()
			if !item.Valid {
				report.BrokenCount++
			}
			mu.Unlock()
		}(i)
	}

	wg.Wait()
	report.Results = filtered
	return report, nil
}

func extractLinks(filePath string) ([]LinkCheckResult, error) {
	file, err := os.Open(filePath)
	if err != nil {
		return nil, err
	}
	defer file.Close()

	var results []LinkCheckResult
	scanner := bufio.NewScanner(file)
	lineNum := 0

	for scanner.Scan() {
		lineNum++
		line := scanner.Text()
		matches := mdLinkRegex.FindAllStringSubmatch(line, -1)
		for _, m := range matches {
			if len(m) >= 3 {
				target := strings.TrimSpace(m[2])
				isExt := strings.HasPrefix(target, "http://") || strings.HasPrefix(target, "https://")
				results = append(results, LinkCheckResult{
					SourceFile: filePath,
					Line:       lineNum,
					Target:     target,
					IsExternal: isExt,
				})
			}
		}
	}

	return results, scanner.Err()
}
