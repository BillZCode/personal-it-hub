#!/bin/bash
set -e

# Pastikan script dijalankan dengan sudo / root
if [ "$EUID" -ne 0 ]; then
    echo "[-] Harap jalankan script ini dengan sudo:"
    echo "    sudo $0"
    exit 1
fi

echo "=== Menerapkan Hardening Timeout & Mitigasi DDoS pada Cloudflare Tunnel ==="

# 1. Perbaiki hostname resolver di /etc/hosts (menghilangkan error 'tidak bisa mengurai host mail.sabbil.lan')
HOSTNAME_VAL=$(hostname 2>/dev/null || cat /etc/hostname 2>/dev/null || echo "mail.sabbil.lan")
if ! grep -q "$HOSTNAME_VAL" /etc/hosts; then
    echo "[+] Menambahkan $HOSTNAME_VAL ke /etc/hosts..."
    sed -i "/127\.0\.1\.1/d" /etc/hosts
    echo "127.0.1.1	$HOSTNAME_VAL mail Sabbil" >> /etc/hosts
    echo "[✓] Hostname $HOSTNAME_VAL berhasil disinkronkan ke /etc/hosts."
fi

# 2. Hardening Cloudflare Tunnel
CONFIG_FILE="/etc/cloudflared/config.yml"

if [ ! -f "$CONFIG_FILE" ]; then
    echo "[-] File $CONFIG_FILE tidak ditemukan!"
    exit 1
fi

# Backup konfigurasi lama
cp "$CONFIG_FILE" "${CONFIG_FILE}.bak.$(date +%Y%m%d%H%M%S)"
echo "[+] Backup disimpan di ${CONFIG_FILE}.bak"

# Tulis konfigurasi baru dengan originRequest timeout hardening
cat << 'INNER_EOF' > "$CONFIG_FILE"
tunnel: f3669dad-e89a-41de-be62-ff7760d2ad9d
credentials-file: /etc/cloudflared/f3669dad-e89a-41de-be62-ff7760d2ad9d.json

originRequest:
  connectTimeout: 10s
  keepAliveTimeout: 15s
  keepAliveConnections: 100
  tcpKeepAlive: 15s

ingress:
  # Rute Subdomain CyberLab ke port 3003
  - hostname: cybertool.sabbilferdyansyah.my.id
    service: http://localhost:3003
  - hostname: cybertool-sabbilferdyansyah.my.id
    service: http://localhost:3003

  # Rute Subdomain Omni AI ke port 3002
  - hostname: ai.sabbilferdyansyah.my.id
    service: http://localhost:3002

  # Rute API backend ke port 3001
  - hostname: sabbilferdyansyah.my.id
    path: ^/api
    service: http://localhost:3001
  - hostname: www.sabbilferdyansyah.my.id
    path: ^/api
    service: http://localhost:3001

  # Rute Frontend Website ke port 3000
  - hostname: sabbilferdyansyah.my.id
    service: http://localhost:3000
  - hostname: www.sabbilferdyansyah.my.id
    service: http://localhost:3000

  # Fallback 404
  - service: http_status:404
INNER_EOF

# Validasi sintaks ingress
cloudflared tunnel --config "$CONFIG_FILE" ingress validate

# Restart cloudflared service jika aktif
if systemctl is-active --quiet cloudflared; then
    echo "[+] Me-restart layanan cloudflared..."
    systemctl restart cloudflared
    echo "[✓] Cloudflare Tunnel berhasil di-restart dengan konfigurasi hardened!"
else
    echo "[!] Layanan cloudflared tidak aktif. Silakan jalankan manual: sudo systemctl restart cloudflared"
fi
