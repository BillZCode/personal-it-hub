#!/usr/bin/env bash
# ==============================================================================
# Script Pembersihan Sistem & Migrasi Docker ke Partisi AI (/mnt/ai_models)
# Aman dijalankan dengan: sudo bash scripts/system-disk-cleanup.sh
# ==============================================================================

set -e

if [ "$EUID" -ne 0 ]; then
  echo "[-] Harap jalankan skrip ini dengan hak akses sudo/root: sudo bash $0"
  exit 1
fi

echo "=========================================================="
echo " [1/4] PEMBERSIHAN JOURNAL LOG & CRASH LOGS (SYSTEMD)"
echo "=========================================================="
CURRENT_JOURNAL=$(journalctl --disk-usage 2>/dev/null || echo "Tidak terdeteksi")
echo "[*] Penggunaan journal saat ini: $CURRENT_JOURNAL"
echo "[*] Memangkas journal systemd hingga maksimal 50MB..."
journalctl --vacuum-size=50M
echo "[+] Journal log berhasil dirampingkan."

echo ""
echo "=========================================================="
echo " [2/4] PEMBERSIHAN APT CACHE & PAKET TIDAK TERPAKAI"
echo "=========================================================="
echo "[*] Membersihkan arsip instalasi .deb (/var/cache/apt/archives)..."
apt-get clean
echo "[*] Menghapus dependensi paket yatim (autoremove)..."
apt-get autoremove --purge -y
echo "[+] Cache APT dibersihkan."

echo ""
echo "=========================================================="
echo " [3/4] CEK DATA LEFTOVER DI /root"
echo "=========================================================="
if [ -d "/root/.ollama" ]; then
    echo "[!] Ditemukan /root/.ollama:"
    du -sh /root/.ollama
    read -p "Apakah Anda ingin menghapus /root/.ollama lama (karena model sudah di /mnt/ai_models/ollama)? [y/N]: " RESP_OLLAMA
    if [[ "$RESP_OLLAMA" =~ ^[Yy]$ ]]; then
        rm -rf /root/.ollama
        echo "[+] /root/.ollama dihapus."
    fi
else
    echo "[+] Tidak ada direktori /root/.ollama lama."
fi

if [ -d "/root/.cache" ]; then
    echo "[*] Ukuran /root/.cache:"
    du -sh /root/.cache
    read -p "Apakah Anda ingin membersihkan /root/.cache? [y/N]: " RESP_CACHE
    if [[ "$RESP_CACHE" =~ ^[Yy]$ ]]; then
        rm -rf /root/.cache/*
        echo "[+] /root/.cache dibersihkan."
    fi
fi

echo ""
echo "=========================================================="
echo " [4/4] MIGRASI DOCKER DATA-ROOT KE /mnt/ai_models/docker"
echo "=========================================================="
if command -v docker >/dev/null 2>&1 && [ -d "/var/lib/docker" ]; then
    DOCKER_SIZE=$(du -sh /var/lib/docker 2>/dev/null | awk '{print $1}' || echo "Tidak diketahui")
    echo "[*] Ukuran Docker di partisi utama (/var/lib/docker): $DOCKER_SIZE"
    read -p "Pindahkan data Docker ke /mnt/ai_models/docker? [y/N]: " RESP_DOCKER
    if [[ "$RESP_DOCKER" =~ ^[Yy]$ ]]; then
        echo "[*] Menghentikan service Docker..."
        systemctl stop docker.socket docker 2>/dev/null || true
        
        echo "[*] Menyiapkan target /mnt/ai_models/docker..."
        mkdir -p /mnt/ai_models/docker
        
        if command -v rsync >/dev/null 2>&1; then
            echo "[*] Menyalin data lama dengan rsync..."
            rsync -aP /var/lib/docker/ /mnt/ai_models/docker/
        else
            echo "[*] Menyalin data lama dengan cp..."
            cp -a /var/lib/docker/* /mnt/ai_models/docker/ 2>/dev/null || true
        fi
        
        echo "[*] Mengatur /etc/docker/daemon.json..."
        mkdir -p /etc/docker
        cat <<EOFJSON > /etc/docker/daemon.json
{
  "data-root": "/mnt/ai_models/docker"
}
EOFJSON
        
        echo "[*] Menghapus data lama di /var/lib/docker untuk melegakan partisi utama..."
        rm -rf /var/lib/docker/*
        
        echo "[*] Memulai kembali service Docker..."
        systemctl start docker
        echo "[+] Migrasi Docker selesai! Data baru akan disimpan di /mnt/ai_models/docker."
    else
        echo "[*] Migrasi Docker dilewati."
    fi
else
    echo "[*] Docker tidak aktif atau tidak ditemukan."
fi

echo ""
echo "=========================================================="
echo " HASIL RUANG PENYIMPANAN TERAKHIR:"
echo "=========================================================="
df -h / /mnt/ai_models
echo "=========================================================="
echo "Selesai!"
