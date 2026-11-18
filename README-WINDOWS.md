# Panduan Menjalankan Personal IT Hub di Windows Boot

Dokumen ini memandu langkah-langkah menjalankan seluruh ekosistem Personal IT Hub (Frontend, Backend, Omni AI, CyberLab, DevKit, dan Cloudflare Tunnel) saat Anda berada di sistem operasi **Windows**.

---

## 1. Persiapan Sebelum Keluar dari Linux (PENTING)

Karena partisi Linux (`/media/sabbil/DebianServ` / `ext4`) tidak bisa dibaca langsung oleh Windows Explorer, lakukan 2 hal berikut sebelum reboot:

### A. Salin File Kredensial Cloudflare Tunnel
Jalankan perintah ini di terminal Linux agar kunci tunnel tersimpan di folder proyek:
```bash
sudo cp /etc/cloudflared/f3669dad-e89a-41de-be62-ff7760d2ad9d.json .cloudflared/credentials.json
sudo chown $USER:$USER .cloudflared/credentials.json
```
*(File `.cloudflared/` sudah dimasukkan ke `.gitignore` sehingga aman dan tidak akan ter-push ke publik).*

### B. Push Perubahan atau Salin Folder ke Partisi Windows
Pilih salah satu cara:
- **Cara 1 (Rekomendasi - via Git):**
  ```bash
  git add .
  git commit -m "feat: add Windows automation and cross-platform config"
  git push
  ```
- **Cara 2 (Langsung Salin ke Partisi NTFS):**
  Mount partisi Windows Anda (misal `TgsTKJ` di `/dev/nvme0n1p4`), lalu salin seluruh folder proyek ke sana.

---

## 2. Kebutuhan di Lingkungan Windows

Pastikan software berikut sudah terpasang di Windows Anda:
1. **Node.js LTS (v20+)** – Unduh dari [nodejs.org](https://nodejs.org/)
2. **Git for Windows** – Unduh dari [git-scm.com](https://git-scm.com/)
3. **Database MySQL** – Bisa menggunakan:
   - **XAMPP / Laragon** (Pastikan service MySQL aktif di port `3306`), ATAU
   - **Docker Desktop for Windows** (`npm run docker:up`)

Pastikan file `.env` di root sudah berisi konfigurasi database yang sesuai di Windows.

---

## 3. Menjalankan Server di Windows (1-Klik)

Semua script otomatisasi sudah disiapkan di root folder:

### A. Menjalankan Seluruh 5 Layanan Server
Cukup **klik dua kali** file:
> `start-all.bat`

Script ini akan:
1. Mengecek apakah Node.js sudah terinstal.
2. Menginstal `node_modules` secara otomatis jika belum ada.
3. Menjalankan 5 layanan bersamaan via `concurrently`:
   - **Frontend:** http://localhost:3000
   - **Backend API:** http://localhost:3001
   - **Omni AI Gateway:** http://localhost:3002
   - **CyberLab LKS:** http://localhost:3003
   - **DevKit Suite:** http://localhost:3004

*(Alternatif: Jika ingin dijalankan sebagai background daemon di Windows, klik dua kali `start-with-pm2.bat`).*

---

## 4. Mengaktifkan Cloudflare Tunnel Publik di Windows

Agar domain `sabbilferdyansyah.my.id`, `ai...`, dan `cybertool...` dapat diakses dari internet saat Anda berada di Windows:

Cukup **klik dua kali** file:
> `start-tunnel.bat`

Fitur otomatis `start-tunnel.bat`:
- Otomatis mengecek file `.cloudflared\credentials.json`.
- Jika `cloudflared.exe` belum terpasang di Windows, script akan **mengunduhnya secara otomatis** ke dalam folder `.cloudflared\`.
- Mengaktifkan ingress routing ke seluruh port (3000, 3001, 3002, 3003).

---

## 5. Ringkasan File Otomatisasi yang Dibuat

| File | Fungsi |
|---|---|
| `start-all.bat` | Script 1-klik menjalankan semua 5 service di Windows (Terminal view). |
| `start-with-pm2.bat` | Script 1-klik menjalankan service via PM2 di Windows (Background daemon). |
| `start-tunnel.bat` | Script 1-klik konektor Cloudflare Tunnel untuk Windows. |
| `.cloudflared/config-windows.yml` | Konfigurasi ingress Cloudflare Tunnel khusus Windows. |
| `ecosystem.config.cjs` | Sudah diperbarui menjadi cross-platform (kompatibel Linux & Windows). |
