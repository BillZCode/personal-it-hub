package backup

import (
	"archive/tar"
	"archive/zip"
	"compress/gzip"
	"fmt"
	"io"
	"os"
	"path/filepath"
	"strings"
	"time"
)

var DefaultIgnored = []string{
	".git",
	"node_modules",
	"dist",
	"build",
	"target",
	".cache",
	"__pycache__",
	".venv",
}

func CreateBackup(srcDir, destDir, format string, includeNodeModules bool) (string, error) {
	if _, err := os.Stat(srcDir); err != nil {
		return "", err
	}

	if err := os.MkdirAll(destDir, 0755); err != nil {
		return "", err
	}

	baseName := filepath.Base(filepath.Clean(srcDir))
	timestamp := time.Now().Format("2006-01-02-150405")

	if format == "zip" {
		fileName := fmt.Sprintf("%s-%s.zip", baseName, timestamp)
		outPath := filepath.Join(destDir, fileName)
		err := archiveZip(srcDir, outPath, includeNodeModules)
		return outPath, err
	}

	fileName := fmt.Sprintf("%s-%s.tar.gz", baseName, timestamp)
	outPath := filepath.Join(destDir, fileName)
	err := archiveTarGz(srcDir, outPath, includeNodeModules)
	return outPath, err
}

func shouldSkip(path, base string, includeNodeModules bool) bool {
	rel, err := filepath.Rel(base, path)
	if err != nil {
		return false
	}
	parts := strings.Split(rel, string(filepath.Separator))
	for _, p := range parts {
		if !includeNodeModules && p == "node_modules" {
			return true
		}
		for _, ign := range DefaultIgnored {
			if ign != "node_modules" && p == ign {
				return true
			}
		}
	}
	return false
}

func archiveTarGz(srcDir, outPath string, includeNodeModules bool) error {
	outFile, err := os.Create(outPath)
	if err != nil {
		return err
	}
	defer outFile.Close()

	gw := gzip.NewWriter(outFile)
	defer gw.Close()

	tw := tar.NewWriter(gw)
	defer tw.Close()

	return filepath.Walk(srcDir, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return nil
		}
		if shouldSkip(path, srcDir, includeNodeModules) {
			if info.IsDir() {
				return filepath.SkipDir
			}
			return nil
		}

		rel, _ := filepath.Rel(srcDir, path)
		if rel == "." {
			return nil
		}

		header, err := tar.FileInfoHeader(info, info.Name())
		if err != nil {
			return err
		}
		header.Name = filepath.ToSlash(rel)

		if err := tw.WriteHeader(header); err != nil {
			return err
		}

		if info.IsDir() {
			return nil
		}

		file, err := os.Open(path)
		if err != nil {
			return err
		}
		defer file.Close()

		_, err = io.Copy(tw, file)
		return err
	})
}

func archiveZip(srcDir, outPath string, includeNodeModules bool) error {
	outFile, err := os.Create(outPath)
	if err != nil {
		return err
	}
	defer outFile.Close()

	zw := zip.NewWriter(outFile)
	defer zw.Close()

	return filepath.Walk(srcDir, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return nil
		}
		if shouldSkip(path, srcDir, includeNodeModules) {
			if info.IsDir() {
				return filepath.SkipDir
			}
			return nil
		}

		rel, _ := filepath.Rel(srcDir, path)
		if rel == "." {
			return nil
		}

		header, err := zip.FileInfoHeader(info)
		if err != nil {
			return err
		}
		header.Name = filepath.ToSlash(rel)
		if info.IsDir() {
			header.Name += "/"
		} else {
			header.Method = zip.Deflate
		}

		writer, err := zw.CreateHeader(header)
		if err != nil {
			return err
		}

		if info.IsDir() {
			return nil
		}

		file, err := os.Open(path)
		if err != nil {
			return err
		}
		defer file.Close()

		_, err = io.Copy(writer, file)
		return err
	})
}
