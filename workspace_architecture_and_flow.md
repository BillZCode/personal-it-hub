# Diagram Arsitektur & Alur Kerja Personal IT Hub (Fixed & Verified)

Dokumen ini memuat kumpulan diagram teknis murni Mermaid yang telah diverifikasi sintaksnya agar dapat dirender dengan sempurna di semua renderer Mermaid (GitHub, VS Code, Antigravity, dan Mermaid Live Editor).

---

## 1. Topologi Arsitektur Ekosistem & Multi-Port (Fixed)

```mermaid
graph TB
    subgraph ClientLayer["Klien dan Pengguna"]
        WebUser["Web Browser Klien (Desktop / Mobile)"]
        DevTerminal["Terminal CLI (DevKit CLI / cURL)"]
    end

    subgraph GatewayLayer["Gateway Reverse Proxy"]
        NginxCore["Nginx Gateway (:80 / :443)"]
    end

    subgraph ServiceMesh["Layanan Aplikasi Lokal"]
        FE["Frontend SPA (:3000)<br/>React 18 + Vite + TypeScript"]
        BE["Backend Core API (:3001)<br/>Express.js + TypeScript"]
        OmniAI["Omni AI Service (:3002)<br/>Google Gemini AI Gateway"]
        CyberLab["CyberLab LKS Toolkit (:3003)<br/>Cybersecurity and Network Tools"]
        DevKitWeb["DevKit Suite (:3004)<br/>Go + TS CLI Engine & Web GUI<br/>(Scaffolding: Go, TS, Python, PHP 8+)"]
    end

    subgraph StorageLayer["Data and Persistence Layer"]
        PrismaORM["Prisma Client ORM"]
        RelationalDB[("Database Server<br/>MySQL 8 / PostgreSQL 16")]
        FileVault["Physical File Storage<br/>storage/drive/ (Maks 5GB)"]
        HostOS["Host OS Telemetry<br/>systeminformation Engine"]
    end

    WebUser -->|"HTTP / HTTPS / WS"| NginxCore
    DevTerminal -->|"HTTP / REST API"| NginxCore

    NginxCore -->|"Path: / (Default)"| FE
    NginxCore -->|"Path: /api/*"| BE
    NginxCore -->|"Host: cybertool / Path: /cyberlab"| CyberLab

    FE -.->|"Integrasi Iframe / API"| OmniAI
    FE -.->|"Integrasi Iframe / Tool"| DevKitWeb

    BE -->|"ORM Query"| PrismaORM
    PrismaORM --> RelationalDB
    BE -->|"Raw Stream I/O"| FileVault
    BE -->|"Polling Tiap 5 Menit"| HostOS
```

---

## 2. Diagram Alur Routing & Pemilahan Request Nginx (Fixed)

```mermaid
flowchart TD
    Req["Request Masuk ke Nginx :80/:443"] --> RouteCheck{"Evaluasi Domain dan Path"}

    RouteCheck -->|"Host: cybertool.* atau Path: /cyberlab"| ToCyber["Proxy ke CyberLab :3003"]
    RouteCheck -->|"Path: /api/*"| ToBE["Proxy ke Express Backend :3001"]
    RouteCheck -->|"Default / Rute Web Lainnya"| ToFE["Proxy ke React Frontend :3000"]

    subgraph BackendPath["Express Backend Modules (:3001)"]
        ToBE --> Auth["/api/auth (JWT Cookie)"]
        ToBE --> Drive["/api/drive (Storage Stream)"]
        ToBE --> Admin["/api/admin (Protected CRUD)"]
        ToBE --> Public["/api/* (Notes, Projects, Metrics, Tools)"]
    end

    subgraph FrontendPath["React Router 6 (:3000)"]
        ToFE --> PortalRoute["/ & /portal (Standalone Navigation Portal)"]
        ToFE --> StandaloneModules["/tools, /notes, /system, /personal, /gallery (Standalone Modules)"]
        ToFE --> DashboardRoute["/dashboard, /about, /projects, /contact (Portfolio Telemetry)"]
        ToFE --> DriveRoute["/drive/* (Cloud Drive Workspace)"]
        ToFE --> AdminRoute["/admin/* (Protected Admin Panel)"]
        ToFE --> SubAppRoute["/ai, /cyberlab, /devkit (Subdomain Gateways)"]
    end
```

---

## 3. Diagram Hirarki Tata Letak Frontend (Fixed)

```mermaid
graph TD
    AppRoot["App.tsx (Root Provider & ErrorBoundary)"] --> Router["React Router 6 (Lazy Loading)"]

    subgraph LayoutShells["Layout Shells"]
        PortalShell["Standalone Portal Shell (/ & /portal)<br/>Top Header + Hero Anime Banner + Directory"]
        StandaloneModuleLayout["StandaloneModuleLayout<br/>Independent Top Bar + Back to Portal + Clean View"]
        DashboardLayout["DashboardLayout<br/>Collapsible Sidebar + Header + Portfolio Views"]
        AdminLayout["AdminLayout<br/>Sidebar Admin + Breadcrumb + CRUD Workstations"]
        DriveLayout["DriveLayout<br/>Drive Sidebar + Toolbar + File Grid + Quota"]
        AuthLayout["AuthLayout<br/>Centered Secure Dark Shell"]
    end

    Router -->|"Root Gateway /"| PortalShell
    Router -->|"Modul Independen"| StandaloneModuleLayout
    Router -->|"Portofolio & Telemetri"| DashboardLayout
    Router -->|"Rute Admin /admin/*"| AdminLayout
    Router -->|"Rute Drive /drive/*"| DriveLayout
    Router -->|"Rute Auth /admin/login"| AuthLayout

    subgraph ViewsStandalone["Modul Independen Portal"]
        StandaloneModuleLayout --> UnifiedTools["Unified Tools & Network Diagnostics (/tools)"]
        StandaloneModuleLayout --> NotesView["Technical Notes & Guides (/notes)"]
        StandaloneModuleLayout --> SystemView["System Telemetry & Specs (/system, /status)"]
        StandaloneModuleLayout --> MediaView["Personal Media (/personal) & Visual Gallery (/gallery)"]
        StandaloneModuleLayout --> LinuxView["Linux Rice & Dotfiles Setup (/linux-setup)"]
    end

    subgraph ViewsPublik["Halaman Portofolio & Dashboard"]
        DashboardLayout --> PortfolioHome["Dashboard Overview (/dashboard)"]
        DashboardLayout --> ProjectsView["Showcase Proyek (/projects)"]
        DashboardLayout --> CertsView["Sertifikasi & Lisensi (/certificates)"]
        DashboardLayout --> GuestbookView["Buku Tamu Interaktif (/guestbook)"]
    end

    subgraph ViewsDrive["Halaman Cloud Drive"]
        DriveLayout --> MyDrivePage["MyDrive (/drive) - Folder Explorer"]
        DriveLayout --> TrashPage["Trash (/drive/trash) - Tempat Sampah"]
    end

    subgraph ViewsAdmin["Halaman Admin"]
        AdminLayout --> AdminDashboard["Admin Dashboard (Telemetry & Analytics)"]
        AdminLayout --> AdminCRUD["CRUD Projects, Notes, Gallery, Changelog, Tools"]
        AdminLayout --> AdminGuestbook["Moderasi Guestbook (Approve/Reject)"]
    end
```

---

## 4. Diagram Siklus Hidup Berkas Cloud Drive (Fixed)

```mermaid
flowchart TD
    subgraph UploadFlow["Alur Upload Berkas"]
        UserFile["Pengguna Pilih Berkas / Drag & Drop"] --> ValidateFile{"Validasi Tipe dan Nama"}
        ValidateFile -->|"Valid"| StreamUpload["POST /api/drive/upload (Multipart)"]
        StreamUpload --> ProxyPass["Nginx Forward Chunk Stream ke Backend"]
        ProxyPass --> WriteDisk["Backend Tulis Stream ke storage/drive/userId/"]
        WriteDisk --> CreateMeta["Prisma Simpan Record DriveItem di Database"]
        CreateMeta --> UploadSuccess["Respons 201 Created & Perbarui UI"]
    end

    subgraph TrashLifecycle["Alur Penghapusan dan Pemulihan"]
        ItemAction{"Aksi Pengguna"} -->|"Hapus Sementara"| SoftDelete["PUT /api/drive/:id/trash (isTrash: true)"]
        SoftDelete --> MoveToTrash["Pindah ke Tampilan Trash"]

        MoveToTrash --> TrashAction{"Aksi di Trash"}
        TrashAction -->|"Pulihkan"| RestoreItem["PUT /api/drive/:id/restore (isTrash: false)"]
        RestoreItem --> ReturnToActive["Kembali ke Folder Asal"]

        TrashAction -->|"Hapus Permanen"| HardDelete["DELETE /api/drive/:id atau /trash/empty"]
        HardDelete --> UnlinkDisk["Hapus Berkas Fisik: fs.unlinkSync"]
        UnlinkDisk --> DeleteMeta["Prisma: Hapus Record dari Database"]
    end
```

---

## 5. Pipeline Moderasi & Anti-Spam Guestbook (Fixed)

```mermaid
sequenceDiagram
    autonumber
    actor Visitor as Pengunjung Publik
    participant FE as Frontend UI (:3000)
    participant BE as Express API (:3001)
    participant DB as Prisma / Database
    actor Admin as Administrator

    Note over Visitor,DB: 1. Pengiriman Pesan oleh Pengunjung
    Visitor->>FE: Isi Form Buku Tamu (Nama & Pesan)
    FE->>BE: POST /api/guestbook { name, message }
    BE->>BE: Ekstraksi IP Client & User-Agent
    BE->>BE: Hashing IP menggunakan SHA-256 (ipHash)
    BE->>DB: INSERT INTO GuestbookEntry (approved = false)
    DB-->>BE: Record Berhasil Dibuat
    BE-->>FE: 201 Created
    FE-->>Visitor: Info: Pesan menunggu persetujuan admin

    Note over Visitor,DB: 2. Query Publik Hanya Menampilkan yang Disetujui
    Visitor->>FE: Buka Halaman /guestbook
    FE->>BE: GET /api/guestbook
    BE->>DB: SELECT WHERE approved = true ORDER BY createdAt DESC
    DB-->>BE: Daftar Pesan yang Disetujui
    BE-->>FE: Tampilkan ke Pengunjung

    Note over Admin,DB: 3. Moderasi di Panel Admin (/admin/guestbook)
    Admin->>FE: Buka Halaman Moderasi
    FE->>BE: GET /api/admin/guestbook (Dengan Cookie JWT)
    BE->>DB: SELECT Semua Pesan (Pending & Approved)
    DB-->>BE: Daftar Lengkap
    BE-->>FE: Render Tab Pending dan Approved
    Admin->>FE: Klik Setujui atau Hapus
    FE->>BE: PUT /api/admin/guestbook/:id/approve atau DELETE
    BE->>DB: UPDATE approved = true atau DELETE Record
    DB-->>BE: Sukses
    BE-->>FE: Perbarui UI Real-Time
```

---

## 6. Diagram Relasi Entitas Basis Data Prisma / ERD (Fixed)

```mermaid
erDiagram
    User ||--o{ DriveItem : "owns"
    DriveItem ||--o{ DriveItem : "parent_children"

    User {
        string id PK
        string email UK
        string passwordHash
        string name
        string role
        datetime createdAt
        datetime updatedAt
    }

    DriveItem {
        string id PK
        string name
        string type
        string mimeType
        bigint size
        string storagePath
        string parentId FK
        boolean isTrash
        datetime trashedAt
        string userId FK
        datetime createdAt
        datetime updatedAt
    }

    Project {
        string id PK
        string title
        string slug UK
        string description
        string content
        string image
        json technologies
        string demoUrl
        string repoUrl
        string status
        boolean featured
        datetime startDate
        datetime endDate
        datetime createdAt
        datetime updatedAt
    }

    TechnicalNote {
        string id PK
        string title
        string slug UK
        string category
        json tags
        string summary
        string content
        int readingTime
        boolean published
        datetime publishedAt
        datetime createdAt
        datetime updatedAt
    }

    Certificate {
        string id PK
        string name
        string provider
        datetime issueDate
        datetime expiryDate
        string credentialId
        string verificationUrl
        string imageUrl
        datetime createdAt
        datetime updatedAt
    }

    GuestbookEntry {
        string id PK
        string name
        string message
        string ipHash
        string userAgent
        boolean approved
        datetime createdAt
    }

    ServerMetric {
        string id PK
        float cpuUsage
        float ramUsage
        float diskUsage
        float cpuTemp
        float networkDown
        float networkUp
        bigint uptime
        int processCount
        datetime recordedAt
    }

    Statistics {
        string id PK
        datetime date UK
        int visitors
        int pageViews
        json toolUsage
        json articleViews
        datetime createdAt
        datetime updatedAt
    }

    ChangelogEntry {
        string id PK
        string version UK
        datetime date
        json added
        json changed
        json fixed
        json improved
        datetime createdAt
        datetime updatedAt
    }

    GalleryItem {
        string id PK
        string title
        string description
        string category
        string imageUrl
        string thumbnailUrl
        json tags
        datetime createdAt
        datetime updatedAt
    }

    PersonalMedia {
        string id PK
        string type
        string title
        string artist
        string album
        string platform
        string coverUrl
        string status
        float rating
        int progress
        json metadata
        datetime createdAt
        datetime updatedAt
    }

    LinuxSetup {
        string id PK
        string distribution
        string desktopEnv
        string windowManager
        string terminal
        string shell
        string editor
        json tools
        json hardware
        string dotfilesUrl
        datetime createdAt
        datetime updatedAt
    }
```

---

## 7. Tabel Rinci Skema Entitas Basis Data (Prisma ORM)

| Model / Entitas | Deskripsi Fungsional | Kunci Utama (PK) / Relasi | Indeks & Constraint |
| :--- | :--- | :--- | :--- |
| **`User`** | Akun autentikasi pemilik/admin workspace | `id` (CUID) → 1:N `DriveItem` | `email` (UNIQUE), Role: `ADMIN` |
| **`DriveItem`** | Berkas fisik & direktori Cloud Drive | `id` (CUID), FK: `userId`, `parentId` (Self-relation) | `@@index([parentId])`, `@@index([userId])`, `@@index([isTrash])` |
| **`Project`** | Portofolio proyek teknologi | `id` (CUID) | `slug` (UNIQUE), `status` (Enum: PLANNING, IN_PROGRESS, COMPLETED, ARCHIVED) |
| **`TechnicalNote`** | Catatan teknis & dokumentasi panduan | `id` (CUID) | `slug` (UNIQUE), `@@index([category])`, `@@index([published])` |
| **`Certificate`** | Sertifikasi & lisensi kompetensi | `id` (CUID) | `credentialId`, `verificationUrl` |
| **`GuestbookEntry`** | Buku tamu interaktif dengan anti-spam | `id` (CUID) | `ipHash` (SHA-256), `@@index([approved])`, `@@index([createdAt])` |
| **`ServerMetric`** | Riwayat telemetri performa mesin host | `id` (CUID) | `recordedAt` (DateTime), `@@index([recordedAt])` |
| **`Statistics`** | Agregasi analitik kunjungan & penggunaan tool | `id` (CUID) | `date` (UNIQUE) |
| **`ChangelogEntry`** | Catatan rilis pembaruan ekosistem | `id` (CUID) | `version` (UNIQUE) |
| **`GalleryItem`** | Arsip aset visual & fotografi | `id` (CUID) | `@@index([category])` |
| **`PersonalMedia`** | Tracker media (Anime, Musik, Game, Movie) | `id` (CUID) | `type` (Enum: GAME, MUSIC, ANIME, MOVIE) |
| **`LinuxSetup`** | Dokumentasi lingkungan OS Debian / Dotfiles | `id` (CUID) | Konfigurasi hardware, WM, shell, editor |

---

## 8. Matriks Bahasa Pemrograman & Modul Ekosistem

| Bahasa Pemrograman / Format | Modul / Komponen Workspace | Peran & Lingkup Implementasi | Tooling / Runtime |
| :--- | :--- | :--- | :--- |
| **TypeScript (`.ts`, `.tsx`)** | `frontend/`, `backend/`, `devkit-cli/src/` | Aplikasi SPA (React 18), REST API Server (Express.js), CLI TS Runner | Node.js v20+, Vite, `tsx`, `tsc` |
| **Go / Golang (`.go`)** | `devkit-cli/` (`main.go`, `cmd/`, `internal/`) | Engine CLI biner independen dengan Cobra & Go Standard Library | Go 1.22+ (`bin/devkit`) |
| **PHP (`.php`)** | `devkit-cli/templates/php/` (`public/`, `src/`) | Template starter OOP modern PHP 8+ (PSR-4 autoload, micro-API), didukung penuh oleh generator & analyzer `devkit` | PHP 8.4 CLI, Composer 2.10+ |
| **JavaScript (`.js`, `.mjs`)** | `omni-ai/`, `cyberlab/`, `scripts/`, `ecosystem` | Micro-servers standalone, vanilla web components, runner PM2 | Node.js ES Modules |
| **Prisma Schema (`.prisma`)** | `backend/prisma/schema.prisma` | Pemodelan skema database relasional & migrasi | Prisma ORM Client |
| **SQL** | Database Engine | Structured query persistence layer | MySQL 8 / PostgreSQL 16 |
| **HTML5 & CSS3** | `frontend/`, `cyberlab/`, `omni-ai/`, `web-devkit/` | Antarmuka pengguna (Glassmorphism, Tailwind CSS, Cyberpunk themes) | Web Browsers |
| **Bash (`.sh`) & Makefile** | `scripts/`, `Makefile` | Otomasi task runner dan konfigurasi DNS/jaringan | Bash / GNU Make |

---

## 9. Diagram Alur Scaffolding Proyek Multi-Language (DevKit CLI)

```mermaid
flowchart TD
    Start["devkit init &lt;project-name&gt; -t &lt;template&gt;"] --> SwitchTpl{"Pilihan Template"}

    SwitchTpl -->|"Go (-t go)"| TplGo["Scaffold Go Module<br/>cmd/, internal/, pkg/, configs/, tests/, go.mod"]
    SwitchTpl -->|"Node / TS (-t ts)"| TplTS["Scaffold TypeScript App<br/>src/, tests/, package.json, tsconfig.json"]
    SwitchTpl -->|"Python (-t py)"| TplPy["Scaffold Python App<br/>src/main.py, requirements.txt, .venv gitignore"]
    SwitchTpl -->|"PHP (-t php)"| TplPHP["Scaffold Modern PHP 8+ App<br/>public/index.php, src/App.php, config/, composer.json"]
    SwitchTpl -->|"Generic / Other"| TplGen["Scaffold Generic Project<br/>src/, docs/, README.md, .gitignore"]

    TplGo --> GitCheck{"Flag --git=true ?"}
    TplTS --> GitCheck
    TplPy --> GitCheck
    TplPHP --> GitCheck
    TplGen --> GitCheck

    GitCheck -->|"Ya"| GitInit["Inisialisasi Git Repository (git init)"]
    GitCheck -->|"Tidak"| Done["Proyek Siap Digunakan!"]
    GitInit --> Done
```
