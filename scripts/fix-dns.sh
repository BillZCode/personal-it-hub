#!/bin/bash
set -e

# Pastikan script dijalankan sebagai root / sudo
if [ "$EUID" -ne 0 ]; then
    echo "[-] Harap jalankan script ini dengan sudo:"
    echo "    sudo $0"
    exit 1
fi

echo "=== Sinkronisasi DNS BIND9 & Apache VirtualHost: SabbilAF.Network ==="

# 1. Filter jika dipanggil oleh NetworkManager Dispatcher
# NetworkManager memanggil script dengan: $1 = interface, $2 = aksi (up, down, dll)
DISPATCHER_IFACE=""
if [ -n "$1" ] && [ -n "$2" ]; then
    DISPATCHER_IFACE="$1"
    DISPATCHER_ACTION="$2"
    # Abaikan interface virtual seperti docker, bridge, veth, lo, tailscale
    if [[ "$DISPATCHER_IFACE" =~ ^(docker|br-|veth|lo|tailscale) ]]; then
        exit 0
    fi
    # Hanya tangani aksi 'up'
    if [ "$DISPATCHER_ACTION" != "up" ]; then
        exit 0
    fi
fi

# 2. Deteksi IP jaringan lokal yang valid
DETECTED_IP=""

# Coba cari IP rute keluar
DETECTED_IP=$(ip route get 1.1.1.1 2>/dev/null | awk '{print $7}' | head -n1)

# Jika belum dapat, cari dari interface default
if [ -z "$DETECTED_IP" ]; then
    DEFAULT_IFACE=$(ip route show default 2>/dev/null | awk '{print $5}' | head -n1)
    if [ -n "$DEFAULT_IFACE" ]; then
        DETECTED_IP=$(ip -4 addr show dev "$DEFAULT_IFACE" 2>/dev/null | grep -oP '(?<=inet\s)\d+(\.\d+){3}' | head -n1)
    fi
fi

# Fallback ke interface ethernet / wifi fisik
if [ -z "$DETECTED_IP" ]; then
    DETECTED_IP=$(ip -4 addr show scope global 2>/dev/null | grep -oP '(?<=inet\s)\d+(\.\d+){3}' | grep -vE '^(172\.|127\.|100\.)' | head -n1)
fi

# Fallback terakhir
if [ -z "$DETECTED_IP" ]; then
    DETECTED_IP="192.168.1.8"
fi

# Validasi manual override jika diberikan IP sebagai argumen
CURRENT_IP="$DETECTED_IP"
if [ -n "$1" ] && [[ "$1" =~ ^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
    CURRENT_IP="$1"
fi

echo "[+] IP Server aktif : $CURRENT_IP"
echo ""

# 3. Update BIND9 Zones (/etc/bind/named.conf.local)
# Domain baru: sabbilaf.network (menggantikan sabbil.lokal)
echo "[1/6] Mengonfigurasi zona BIND9 di /etc/bind/named.conf.local..."
cat << 'INNER_EOF' > /etc/bind/named.conf.local
zone "sabbilaf.network" {
    type master;
    file "/etc/bind/db.sabbilaf.network";
};

zone "hub.lokal" {
    type master;
    file "/etc/bind/db.hub.lokal";
};

zone "web.lokal" {
    type master;
    file "/etc/bind/db.web.lokal";
};
INNER_EOF

# 4. Buat / Update File Zone BIND9
echo "[2/6] Memperbarui file zone BIND9 (sabbilaf.network, hub.lokal, web.lokal)..."
SERIAL=$(date +%Y%m%d%H)

cat << INNER_EOF > /etc/bind/db.sabbilaf.network
\$TTL    604800
@       IN      SOA     ns1.sabbilaf.network. admin.sabbilaf.network. (
                        $SERIAL ; Serial
                        604800
                        86400
                        2419200
                        604800 )

@       IN      NS      ns1.sabbilaf.network.
ns1     IN      A       $CURRENT_IP
@       IN      A       $CURRENT_IP
www     IN      A       $CURRENT_IP
api     IN      A       $CURRENT_IP
INNER_EOF

cat << INNER_EOF > /etc/bind/db.hub.lokal
\$TTL    604800
@       IN      SOA     hub.lokal. root.hub.lokal. (
                        $SERIAL ; Serial
                        604800
                        86400
                        2419200
                        604800 )

@       IN      NS      hub.lokal.
@       IN      A       $CURRENT_IP
www     IN      A       $CURRENT_IP
api     IN      A       $CURRENT_IP
INNER_EOF

cat << INNER_EOF > /etc/bind/db.web.lokal
\$TTL    604800
@       IN      SOA     web.lokal. root.web.lokal. (
                        $SERIAL ; Serial
                        604800
                        86400
                        2419200
                        604800 )

@       IN      NS      web.lokal.
@       IN      A       $CURRENT_IP
www     IN      A       $CURRENT_IP
INNER_EOF

# Hapus zona usang db.sabbil.lokal jika ada
rm -f /etc/bind/db.sabbil.lokal

# Set permissions untuk BIND
chown -R root:bind /etc/bind/db.* /etc/bind/named.conf.local 2>/dev/null || true
chmod 644 /etc/bind/db.* /etc/bind/named.conf.local 2>/dev/null || true

# 5. Update /etc/hosts
echo "[3/6] Memperbarui /etc/hosts dengan domain SabbilAF.Network & cybertool..."
sed -i '/sabbil\.lokal/d' /etc/hosts
sed -i '/sabbilaf\.network/d' /etc/hosts
sed -i '/br-d0cfcb410df2/d' /etc/hosts
sed -i '/hub\.lokal/d' /etc/hosts
sed -i '/web\.lokal/d' /etc/hosts
sed -i '/cybertool/d' /etc/hosts

cat << INNER_EOF >> /etc/hosts
$CURRENT_IP sabbilaf.network www.sabbilaf.network api.sabbilaf.network cybertool.sabbilaf.network
$CURRENT_IP hub.lokal www.hub.lokal api.hub.lokal
$CURRENT_IP web.lokal www.web.lokal
$CURRENT_IP cybertool-sabbilferdyansyah.my.id
INNER_EOF

# 6. Perbaiki /etc/resolv.conf
echo "[4/6] Menyesuaikan DNS Resolver /etc/resolv.conf..."
cat << INNER_EOF > /etc/resolv.conf
nameserver 127.0.0.1
nameserver $CURRENT_IP
nameserver 1.1.1.1
nameserver 8.8.8.8
INNER_EOF

# 7. Konfigurasi Apache VirtualHost untuk SabbilAF.Network & CyberTool
echo "[5/6] Mengonfigurasi VirtualHost Apache untuk sabbilaf.network & cybertool..."
cat << 'INNER_EOF' > /etc/apache2/sites-available/sabbilaf.network.conf
<VirtualHost *:80>
    ServerName sabbilaf.network
    ServerAlias SabbilAF.Network www.sabbilaf.network www.SabbilAF.Network

    ProxyPreserveHost On

    # Rute API Backend ke port 3001
    ProxyPass /api http://127.0.0.1:3001/api
    ProxyPassReverse /api http://127.0.0.1:3001/api

    # Rute CyberLab LKS ke port 3003
    ProxyPass /cyberlab http://127.0.0.1:3003
    ProxyPassReverse /cyberlab http://127.0.0.1:3003

    # Rute Frontend Website ke port 3000
    ProxyPass / http://127.0.0.1:3000/
    ProxyPassReverse / http://127.0.0.1:3000/

    ErrorLog ${APACHE_LOG_DIR}/sabbilaf_network_error.log
    CustomLog ${APACHE_LOG_DIR}/sabbilaf_network_access.log combined
</VirtualHost>

# VirtualHost Khusus Subdomain cybertool-sabbilferdyansyah.my.id & cybertool.sabbilaf.network
<VirtualHost *:80>
    ServerName cybertool-sabbilferdyansyah.my.id
    ServerAlias cybertool.sabbilaf.network

    ProxyPreserveHost On

    ProxyPass / http://127.0.0.1:3003/
    ProxyPassReverse / http://127.0.0.1:3003/

    ErrorLog ${APACHE_LOG_DIR}/cyberlab_error.log
    CustomLog ${APACHE_LOG_DIR}/cyberlab_access.log combined
</VirtualHost>
INNER_EOF

a2enmod proxy proxy_http rewrite headers 2>/dev/null || true
a2ensite sabbilaf.network.conf 2>/dev/null || true
a2ensite hub.lokal.conf 2>/dev/null || true

# 8. Reload / Restart Services
echo "[6/6] Reload konfigurasi BIND9 & Apache2..."
named-checkconf /etc/bind/named.conf 2>/dev/null || true
named-checkzone sabbilaf.network /etc/bind/db.sabbilaf.network 2>/dev/null || true
named-checkzone hub.lokal /etc/bind/db.hub.lokal 2>/dev/null || true

systemctl restart named 2>/dev/null || systemctl restart bind9 2>/dev/null || true
systemctl reload apache2 2>/dev/null || systemctl restart apache2 2>/dev/null || true

# 9. Update NetworkManager Dispatcher agar otomatis tersinkronisasi saat IP berubah
DISPATCHER_DIR="/etc/NetworkManager/dispatcher.d"
if [ -d "$DISPATCHER_DIR" ]; then
    echo "[+] Sinkronisasi ke NetworkManager dispatcher..."
    cp "$0" "$DISPATCHER_DIR/99-sync-bind9-ip.sh"
    chmod +x "$DISPATCHER_DIR/99-sync-bind9-ip.sh"
fi

echo ""
echo "============================================================"
echo "SUKSES! DNS & Web Server telah disesuaikan:"
echo "1. Domain Baru (DNS Lokal) : http://sabbilaf.network"
echo "                             http://SabbilAF.Network"
echo "2. Domain Alternatif Lokal : http://hub.lokal"
echo "3. Akses Langsung Port     : http://$CURRENT_IP:3000 (Frontend)"
echo "                             http://$CURRENT_IP:3001 (Backend API)"
echo "                             http://$CURRENT_IP:3003 (CyberLab LKS)"
echo "4. Domain Publik Asli      : https://sabbilferdyansyah.my.id"
echo "5. Domain CyberTool Sub    : http://cybertool-sabbilferdyansyah.my.id"
echo "============================================================"
