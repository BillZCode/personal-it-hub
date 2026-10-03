# devkit-cli

> **"Automate your everyday development workflow."**

`devkit-cli` is a high-performance, modular, cross-platform developer automation CLI built in **Go** and powered by **Cobra**. It unifies everyday developer operations—from project scaffolding, directory cleaning, Docker hygiene, and markdown link auditing, to git automation, backups, smart code search, and diagnostic audits—into a single binary.

---

## ⚡ Key Features

1. **Project Scaffolding (`devkit init`)**
   - Interactive generator supporting Go, Node.js/TypeScript, Python, and generic templates.
   - Creates clean, production-ready enterprise project structures.
2. **Safe Workspace Cleaner (`devkit clean`)**
   - Audits and calculates disk space consumed by `node_modules`, `dist`, `build`, `target`, `.cache`, and logs.
   - Built-in dry-run mode and interactive user confirmation safeguards.
3. **Docker Hygiene (`devkit docker clean`)**
   - Discovers stopped containers, dangling images, build caches, and unused volumes.
   - Safeguards prevent accidental volume deletion unless explicitly requested.
4. **Markdown Link Integrity (`devkit markdown links`)**
   - Concurrently validates internal relative links, anchors, and external HTTP/HTTPS URLs.
5. **Project Analyzer (`devkit project info`)**
   - Identifies project type, language, framework, git status, file metrics, and top largest files.
6. **Git Automation (`devkit git summary`, `devkit git cleanup`)**
   - Instant repository overview and safe batch deletion of stale merged local branches.
7. **Smart Code Find (`devkit find`, `devkit find large`)**
   - Regex-based pattern finder with column accuracy and large file locator.
8. **Automated Backups (`devkit backup`)**
   - Creates compressed `.tar.gz` or `.zip` snapshots while automatically ignoring bulky dependencies.
9. **Environment Diagnostic (`devkit doctor`)**
   - Comprehensive audit of developer tools (Go, Git, Docker, Node.js, Python, Rust, SSH, cURL).
10. **Batch Automation (`devkit batch run`)**
    - Orchestrates declarative workflow pipelines defined in YAML.
11. **DevKit Web Studio**
    - Companion Obsidian Glassmorphism web workstation at `/devkit`.

---

## 🚀 Quick Start

### Installation

```bash
# Build from source
git clone https://github.com/sabbil/personal-it-hub.git
cd personal-it-hub/devkit-cli
go build -o bin/devkit main.go

# Run
./bin/devkit --help
./bin/devkit doctor
```

### Examples

```bash
# Initialize a new Go microservice
devkit init my-service --template go

# Safe cleanup simulation
devkit clean --dry-run

# Audit documentation links
devkit markdown links README.md

# Inspect workspace metrics
devkit project info .

# Locate files larger than 10MB
devkit find large --min-size 10

# Create compressed project backup
devkit backup . -f tar.gz
```

---

## 📂 Architecture

```
devkit-cli/
├── cmd/               # CLI layer and Cobra command definitions
│   ├── root.go
│   ├── init.go
│   ├── clean.go
│   ├── docker.go
│   ├── markdown.go
│   ├── project.go
│   ├── git.go
│   ├── deps.go
│   ├── backup.go
│   ├── find.go
│   ├── rename.go
│   ├── doctor.go
│   ├── batch.go
│   └── config.go
├── internal/          # Business logic and system subsystems
│   ├── backup/
│   ├── config/
│   ├── docker/
│   ├── executor/
│   ├── filesystem/
│   ├── git/
│   ├── markdown/
│   ├── output/
│   ├── project/
│   ├── scanner/
│   └── workflow/
├── tests/             # Go unit & integration test suites
├── web-devkit/        # Obsidian Glassmorphic Web Studio
├── bin/devkit         # Compiled Go executable binary
├── main.go
└── go.mod
```

---

## 🧪 Testing

```bash
cd devkit-cli
go test -v ./...
```

---

## 📜 License

MIT License © 2026 Sabbil Ferdyansyah. Open-source friendly.
