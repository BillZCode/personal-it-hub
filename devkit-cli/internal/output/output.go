package output

import (
	"encoding/json"
	"fmt"
	"io"
	"os"
	"strings"
)

var (
	JSONMode    bool
	QuietMode   bool
	VerboseMode bool
	NoColor     bool
)

const (
	ColorReset  = "\033[0m"
	ColorRed    = "\033[31m"
	ColorGreen  = "\033[32m"
	ColorYellow = "\033[33m"
	ColorBlue   = "\033[34m"
	ColorPurple = "\033[35m"
	ColorCyan   = "\033[36m"
	ColorWhite  = "\033[37m"
	ColorBold   = "\033[1m"
	ColorDim    = "\033[2m"
)

func init() {
	if os.Getenv("NO_COLOR") != "" {
		NoColor = true
	}
}

func colorize(color, text string) string {
	if NoColor {
		return text
	}
	return color + text + ColorReset
}

func Success(format string, a ...interface{}) {
	if QuietMode || JSONMode {
		return
	}
	msg := fmt.Sprintf(format, a...)
	fmt.Printf("%s %s\n", colorize(ColorGreen, "✓"), msg)
}

func Error(format string, a ...interface{}) {
	if JSONMode {
		return
	}
	msg := fmt.Sprintf(format, a...)
	fmt.Fprintf(os.Stderr, "%s %s\n", colorize(ColorRed, "✗"), msg)
}

func Warning(format string, a ...interface{}) {
	if QuietMode || JSONMode {
		return
	}
	msg := fmt.Sprintf(format, a...)
	fmt.Printf("%s %s\n", colorize(ColorYellow, "⚠"), msg)
}

func Info(format string, a ...interface{}) {
	if QuietMode || JSONMode {
		return
	}
	msg := fmt.Sprintf(format, a...)
	fmt.Printf("%s %s\n", colorize(ColorCyan, "ℹ"), msg)
}

func Header(title string) {
	if QuietMode || JSONMode {
		return
	}
	bar := strings.Repeat("━", len(title)+10)
	fmt.Printf("\n%s %s\n%s\n", colorize(ColorBold+ColorYellow, "◆"), colorize(ColorBold+ColorWhite, strings.ToUpper(title)), colorize(ColorDim, bar))
}

func Banner() {
	if QuietMode || JSONMode {
		return
	}
	logo := `
   ___           __ ___ __       ________   ____
  / _ \___ _  __/ //_//_/ /_    / ___/ / /  /  _/
 / // / -_) |/ / ,<  / / __/   / /__/ / /___/ /  
/____/\__/|___/_/|_|/_/\__/    \___/_/____/___/  
`
	fmt.Printf("%s\n", colorize(ColorBold+ColorYellow, strings.TrimPrefix(logo, "\n")))
	fmt.Printf(" %s  %s\n\n", colorize(ColorCyan, "⚡ DevKit Automation Suite"), colorize(ColorDim, "v1.0.0 CLI Core"))
}

func PrintJSON(data interface{}) error {
	b, err := json.MarshalIndent(data, "", "  ")
	if err != nil {
		return err
	}
	fmt.Println(string(b))
	return nil
}

func Confirm(prompt string, defVal bool) bool {
	if QuietMode {
		return defVal
	}
	choices := "[y/N]"
	if defVal {
		choices = "[Y/n]"
	}
	fmt.Printf("%s %s %s: ", colorize(ColorCyan, "?"), prompt, colorize(ColorDim, choices))
	var response string
	_, err := fmt.Scanln(&response)
	if err != nil {
		return defVal
	}
	response = strings.TrimSpace(strings.ToLower(response))
	if response == "" {
		return defVal
	}
	return response == "y" || response == "yes"
}

func PrintTable(w io.Writer, rows [][]string) {
	if len(rows) == 0 {
		return
	}
	colWidths := make([]int, len(rows[0]))
	for _, row := range rows {
		for i, col := range row {
			if len(col) > colWidths[i] {
				colWidths[i] = len(col)
			}
		}
	}
	for idx, row := range rows {
		for i, col := range row {
			pad := colWidths[i] - len(col) + 2
			if idx == 0 {
				fmt.Fprintf(w, "%s%s", colorize(ColorBold+ColorWhite, col), strings.Repeat(" ", pad))
			} else {
				fmt.Fprintf(w, "%s%s", col, strings.Repeat(" ", pad))
			}
		}
		fmt.Fprintln(w)
		if idx == 0 {
			var divParts []string
			for _, w := range colWidths {
				divParts = append(divParts, strings.Repeat("─", w))
			}
			fmt.Fprintf(w, "%s\n", colorize(ColorDim, strings.Join(divParts, "  ")))
		}
	}
}
