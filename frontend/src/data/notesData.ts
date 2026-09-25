export interface FullNote {
  id: string;
  slug: string;
  title: string;
  category: string;
  tags: string[];
  summary: string;
  readingTime: number;
  published: boolean;
  publishedAt: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export const allNotesMap: Record<string, FullNote> = {
  'installing-ssh-debian': {
    id: 'note-1',
    slug: 'installing-ssh-debian',
    title: 'Instalasi dan Hardening Keamanan SSH di Debian',
    category: 'Linux',
    tags: ['debian', 'ssh', 'security', 'linux', 'sysadmin'],
    summary: 'Panduan lengkap langkah demi langkah instalasi OpenSSH Server, konfigurasi port kustom, disable root login, dan autentikasi SSH Key di Debian 11/12/13.',
    readingTime: 6,
    published: true,
    publishedAt: '2026-09-01',
    createdAt: '2026-09-01',
    updatedAt: '2026-09-01',
    content: `# Instalasi dan Hardening Keamanan SSH di Debian

OpenSSH (Open Secure Shell) adalah paket utilitas jaringan terenkripsi standar yang digunakan untuk mengelola server Linux dari jarak jauh secara aman.

## 1. Prasyarat Sistem
Sebelum memulai instalasi, pastikan sistem Anda memenuhi ketentuan berikut:
- Server dengan sistem operasi Debian 11 (Bullseye), Debian 12 (Bookworm), atau Debian 13 (Trixie).
- Akun pengguna dengan hak akses \`sudo\` atau akses langsung sebagai \`root\`.
- Koneksi internet yang stabil untuk mengunduh paket repositori.

## 2. Langkah Instalasi OpenSSH Server
Perbarui indeks paket repositori lokal terlebih dahulu agar paket yang diunduh adalah versi stabil terbaru:

\`\`\`bash
sudo apt update && sudo apt upgrade -y
\`\`\`

Pasang paket \`openssh-server\` menggunakan manajer paket APT:

\`\`\`bash
sudo apt install openssh-server -y
\`\`\`

Setelah proses instalasi selesai, periksa status layanan SSH untuk memastikan service sudah aktif:

\`\`\`bash
sudo systemctl status ssh
\`\`\`

Pastikan output menampilkan status **active (running)**. Agar SSH otomatis berjalan saat server dinyalakan (booting), jalankan perintah:

\`\`\`bash
sudo systemctl enable ssh
\`\`\`

## 3. Langkah Hardening (Pengamanan) SSH
Konfigurasi bawaan SSH rentan terhadap serangan *brute-force* karena menggunakan port default 22 dan mengizinkan login langsung user root. 

Buat salinan cadangan (*backup*) file konfigurasi asli sebelum melakukan perubahan:

\`\`\`bash
sudo cp /etc/ssh/sshd_config /etc/ssh/sshd_config.bak
\`\`\`

Buka file konfigurasi menggunakan teks editor:

\`\`\`bash
sudo nano /etc/ssh/sshd_config
\`\`\`

Cari dan sesuaikan parameter berikut:

\`\`\`ssh
# 1. Ganti port standar 22 ke port kustom tinggi (misal: 2222 atau 49152-65535)
Port 2222

# 2. Nonaktifkan login langsung akun root demi keamanan hak akses
PermitRootLogin no

# 3. Wajibkan penggunaan SSH Key dan nonaktifkan autentikasi kata sandi (Password)
PubkeyAuthentication yes
PasswordAuthentication no

# 4. Batasi percobaan login gagal sebelum koneksi diputus
MaxAuthTries 3

# 5. Putus otomatis sesi yang idle / tidak aktif
ClientAliveInterval 300
ClientAliveCountMax 2
\`\`\`

Simpan perubahan dengan menekan \`Ctrl + O\`, lalu keluar dengan \`Ctrl + X\`.

## 4. Validasi Sintaks dan Restart Layanan
Sebelum me-restart layanan, lakukan pengujian sintaks konfigurasi terlebih dahulu untuk mencegah server terkunci akibat kesalahan ketik:

\`\`\`bash
sudo sshd -t
\`\`\`

Jika tidak muncul pesan error, muat ulang layanan SSH:

\`\`\`bash
sudo systemctl restart ssh
\`\`\`

## 5. Pengujian Koneksi dari Komputer Klien
Buka terminal pada komputer klien Anda dan uji koneksi menggunakan port baru:

\`\`\`bash
ssh -p 2222 nama_user@alamat_ip_server
\`\`\`
`
  },
  'dhcp-server-configuration': {
    id: 'note-2',
    slug: 'dhcp-server-configuration',
    title: 'Konfigurasi DHCP Server Lengkap dengan ISC-DHCP di Debian/Ubuntu',
    category: 'Networking',
    tags: ['dhcp', 'isc-dhcp', 'networking', 'debian', 'tkj'],
    summary: 'Panduan konfigurasi ISC-DHCP Server: pengaturan interface, alokasi rentang IP Pool, opsi Gateway/DNS, dan reservasi IP statis berdasarkan MAC Address.',
    readingTime: 8,
    published: true,
    publishedAt: '2026-08-28',
    createdAt: '2026-08-28',
    updatedAt: '2026-08-28',
    content: `# Konfigurasi DHCP Server Lengkap dengan ISC-DHCP

Dynamic Host Configuration Protocol (DHCP) adalah layanan jaringan yang secara otomatis mendistribusikan konfigurasi TCP/IP (IP Address, Subnet Mask, Gateway, dan DNS) kepada perangkat klien di dalam jaringan lokal.

## 1. Topologi Jaringan yang Digunakan
- **Interface Server**: \`eth0\` atau \`enp3s0\`
- **IP Statis Server**: \`192.168.10.1/24\`
- **Rentang IP Klien (Pool)**: \`192.168.10.100\` s/d \`192.168.10.200\`
- **DNS Server**: \`1.1.1.1\`, \`8.8.8.8\`

## 2. Instalasi Paket ISC DHCP Server
Jalankan pembaruan sistem dan pasang paket \`isc-dhcp-server\`:

\`\`\`bash
sudo apt update
sudo apt install isc-dhcp-server -y
\`\`\`

> *Catatan: Saat instalasi selesai, layanan mungkin menampilkan error karena file konfigurasi belum disesuaikan dengan interface jaringan lokal.*

## 3. Menentukan Interface Jaringan yang Mendengarkan Request
Buka file konfigurasi default interface:

\`\`\`bash
sudo nano /etc/default/isc-dhcp-server
\`\`\`

Arahkan ke baris \`INTERFACESv4\` dan isi nama interface ethernet jaringan lokal Anda:

\`\`\`bash
INTERFACESv4="eth0"
\`\`\`

## 4. Konfigurasi Subnet dan Pool IP
Cadangkan file konfigurasi bawaan, lalu buka file konfigurasi utama:

\`\`\`bash
sudo nano /etc/dhcp/dhcpd.conf
\`\`\`

Tambahkan atau sesuaikan blok deklarasi subnet berikut:

\`\`\`dhcp
# Pengaturan waktu sewa IP (dalam detik)
default-lease-time 600;       # 10 menit
max-lease-time 7200;          # 2 jam
ddns-update-style none;
authoritative;                # Server resmi untuk jaringan ini

# Blok konfigurasi subnet jaringan lokal
subnet 192.168.10.0 netmask 255.255.255.0 {
  range 192.168.10.100 192.168.10.200;               # Rentang IP otomatis
  option routers 192.168.10.1;                       # Default Gateway
  option subnet-mask 255.255.255.0;
  option domain-name-servers 1.1.1.1, 8.8.8.8;       # DNS Server
  option domain-name "personal-it-hub.lan";
}

# Contoh Reservasi IP Statis (Static Lease berdasarkan MAC Address)
host server-nas-lokal {
  hardware ethernet 00:11:22:33:44:55;
  fixed-address 192.168.10.50;
}
\`\`\`

## 5. Menjalankan dan Memvalidasi Layanan
Restart layanan DHCP server:

\`\`\`bash
sudo systemctl restart isc-dhcp-server
sudo systemctl enable isc-dhcp-server
\`\`\`

Periksa status layanan untuk memastikan tidak ada kesalahan konfigurasi:

\`\`\`bash
sudo systemctl status isc-dhcp-server
\`\`\`

Untuk memantau pemberian IP kepada klien secara langsung (*real-time*), pantau log DHCP dengan perintah:

\`\`\`bash
sudo journalctl -u isc-dhcp-server -f
\`\`\`
`
  },
  'dns-server-configuration': {
    id: 'note-3',
    slug: 'dns-server-configuration',
    title: 'Membangun Server DNS Authoritative & Recursive Menggunakan BIND9',
    category: 'Networking',
    tags: ['bind9', 'dns', 'zone', 'networking', 'linux'],
    summary: 'Langkah instalasi BIND9, pembuatan Forward Zone & Reverse Zone, pengaturan DNS Recursive Caching, dan uji coba menggunakan dig/nslookup.',
    readingTime: 10,
    published: true,
    publishedAt: '2026-08-25',
    createdAt: '2026-08-25',
    updatedAt: '2026-08-25',
    content: `# Membangun Server DNS Authoritative & Recursive Menggunakan BIND9

Domain Name System (DNS) adalah layanan protokol internet fundamental yang menerjemahkan nama domain yang mudah dibaca manusia (seperti \`sabbil.lan\`) menjadi alamat IP numerik (seperti \`192.168.10.10\`).

## 1. Instalasi BIND9
Install paket BIND9 beserta utilitas pendukungnya:

\`\`\`bash
sudo apt update
sudo apt install bind9 bind9utils bind9-doc dnsutils -y
\`\`\`

## 2. Pengaturan Opsi Server (\`named.conf.options\`)
Buka file pengaturan opsi:

\`\`\`bash
sudo nano /etc/bind/named.conf.options
\`\`\`

Sesuaikan konfigurasi agar server melayani rekursi untuk jaringan lokal dan meneruskan request internet ke DNS publik:

\`\`\`named
options {
  directory "/var/cache/bind";

  # Meneruskan query domain luar ke Cloudflare & Google DNS
  forwarders {
    1.1.1.1;
    8.8.8.8;
  };

  # Izinkan query hanya dari localhost dan subnet LAN
  allow-query { localhost; 192.168.10.0/24; };

  recursion yes;
  dnssec-validation auto;
  listen-on { 127.0.0.1; 192.168.10.1; };
  listen-on-v6 { none; };
};
\`\`\`

## 3. Mendefinisikan Zona Forward dan Reverse (\`named.conf.local\`)
Buka file zona lokal:

\`\`\`bash
sudo nano /etc/bind/named.conf.local
\`\`\`

Tambahkan konfigurasi zona forward (nama domain ke IP) dan reverse (IP ke nama domain):

\`\`\`named
# Forward Zone
zone "sabbil.lan" {
  type master;
  file "/etc/bind/db.sabbil.lan";
};

# Reverse Zone untuk subnet 192.168.10.0/24
zone "10.168.192.in-addr.arpa" {
  type master;
  file "/etc/bind/db.192.168.10";
};
\`\`\`

## 4. Membuat File Database Rekaman DNS
Salin template database bawaan:

\`\`\`bash
sudo cp /etc/bind/db.local /etc/bind/db.sabbil.lan
sudo nano /etc/bind/db.sabbil.lan
\`\`\`

Isi dengan data rekaman A, CNAME, dan NS:

\`\`\`named
$TTL    604800
@       IN      SOA     ns1.sabbil.lan. admin.sabbil.lan. (
                              2026090901 ; Serial
                                  604800 ; Refresh
                                   86400 ; Retry
                                 2419200 ; Expire
                                  604800 ) ; Negative Cache TTL
;
@       IN      NS      ns1.sabbil.lan.
ns1     IN      A       192.168.10.1
router  IN      A       192.168.10.1
server  IN      A       192.168.10.10
hub     IN      CNAME   server
\`\`\`

## 5. Pemeriksaan Syntax dan Uji Coba Resolusi
Validasi seluruh syntax konfigurasi sebelum menjalankan service:

\`\`\`bash
sudo named-checkconf
sudo named-checkzone sabbil.lan /etc/bind/db.sabbil.lan
\`\`\`

Jika output menunjukkan \`OK\`, restart layanan BIND9:

\`\`\`bash
sudo systemctl restart bind9
\`\`\`

Uji resolusi DNS menggunakan perintah \`dig\` atau \`nslookup\`:

\`\`\`bash
dig @localhost server.sabbil.lan
nslookup hub.sabbil.lan 127.0.0.1
\`\`\`
`
  },
  'vlan-configuration': {
    id: 'note-4',
    slug: 'vlan-configuration',
    title: 'Konfigurasi VLAN & Inter-VLAN Routing pada Switch dan Router Cisco',
    category: 'Networking',
    tags: ['vlan', 'cisco', 'trunk', 'switch', 'routing', 'packet-tracer'],
    summary: 'Panduan implementasi Virtual LAN (VLAN), mode akses port, 802.1Q trunking, dan Router-on-a-Stick untuk menghubungkan antar subnet VLAN yang terpisah.',
    readingTime: 7,
    published: true,
    publishedAt: '2026-08-20',
    createdAt: '2026-08-20',
    updatedAt: '2026-08-20',
    content: `# Konfigurasi VLAN & Inter-VLAN Routing pada Switch dan Router Cisco

Virtual Local Area Network (VLAN) memungkinkan administrator jaringan untuk memecah satu switch fisik menjadi beberapa domain siaran (*broadcast domain*) logis yang terisolasi demi alasan efisiensi dan keamanan.

## 1. Skenario Topologi
- **VLAN 10 (MANAJEMEN)**: Subnet \`192.168.10.0/24\` (Port Fa0/1 - Fa0/10)
- **VLAN 20 (SERVER)**: Subnet \`192.168.20.0/24\` (Port Fa0/11 - Fa0/20)
- **Trunk Link**: Port \`Gig0/1\` (Menghubungkan Switch ke Router)

## 2. Langkah Konfigurasi pada Switch Cisco
Masuk ke mode konfigurasi global pada switch:

\`\`\`cisco
Switch> enable
Switch# configure terminal

! Membuat database VLAN
Switch(config)# vlan 10
Switch(config-vlan)# name MANAJEMEN
Switch(config-vlan)# vlan 20
Switch(config-vlan)# name SERVER
Switch(config-vlan)# exit

! Menetapkan port ke VLAN 10 (Mode Access)
Switch(config)# interface range fastEthernet 0/1 - 10
Switch(config-if-range)# switchport mode access
Switch(config-if-range)# switchport access vlan 10
Switch(config-if-range)# exit

! Menetapkan port ke VLAN 20 (Mode Access)
Switch(config)# interface range fastEthernet 0/11 - 20
Switch(config-if-range)# switchport mode access
Switch(config-if-range)# switchport access vlan 20
Switch(config-if-range)# exit
\`\`\`

## 3. Konfigurasi Port Trunk ke Router
Port penghubung antara switch dan router harus dikonfigurasi sebagai **Trunk** dengan enkapsulasi standar IEEE 802.1Q:

\`\`\`cisco
Switch(config)# interface gigabitEthernet 0/1
Switch(config-if)# switchport mode trunk
Switch(config-if)# switchport trunk allowed vlan 10,20
Switch(config-if)# exit
\`\`\`

## 4. Konfigurasi Inter-VLAN Routing (Router-on-a-Stick)
Pada router, port fisik utama diaktifkan tanpa IP, kemudian dibuat sub-interface logis untuk setiap ID VLAN:

\`\`\`cisco
Router> enable
Router# configure terminal

! Mengaktifkan interface fisik utama
Router(config)# interface gigabitEthernet 0/0
Router(config-if)# no shutdown
Router(config-if)# exit

! Konfigurasi Sub-Interface VLAN 10
Router(config)# interface gigabitEthernet 0/0.10
Router(config-subif)# encapsulation dot1Q 10
Router(config-subif)# ip address 192.168.10.1 255.255.255.0
Router(config-subif)# exit

! Konfigurasi Sub-Interface VLAN 20
Router(config)# interface gigabitEthernet 0/0.20
Router(config-subif)# encapsulation dot1Q 20
Router(config-subif)# ip address 192.168.20.1 255.255.255.0
Router(config-subif)# exit
\`\`\`

## 5. Verifikasi Status Jaringan
Jalankan perintah berikut untuk memeriksa status:

\`\`\`cisco
Switch# show vlan brief
Switch# show interfaces trunk
Router# show ip route
\`\`\`

Uji coba ping antar PC di VLAN 10 ke PC di VLAN 20. Traffic sekarang berhasil dirutekan melalui Router.
`
  },
  'ospf-basic-configuration': {
    id: 'note-5',
    slug: 'ospf-basic-configuration',
    title: 'Panduan Konfigurasi Protokol Routing Dinamis OSPF Single Area',
    category: 'Networking',
    tags: ['ospf', 'routing', 'cisco', 'dynamic-routing', 'ccna'],
    summary: 'Konsep protokol routing link-state OSPF, penetapan Router ID, konfigurasi wildcard mask, passive interface, dan pemantauan tabel routing.',
    readingTime: 12,
    published: true,
    publishedAt: '2026-08-15',
    createdAt: '2026-08-15',
    updatedAt: '2026-08-15',
    content: `# Panduan Konfigurasi Protokol Routing Dinamis OSPF Single Area

Open Shortest Path First (OSPF) adalah protokol perutean dinamis berbasis link-state (Interior Gateway Protocol) yang menggunakan algoritma Dijkstra SPF (*Shortest Path First*) untuk menentukan jalur terpendek dan tercepat menuju tujuan.

## 1. Konsep Dasar OSPF
- **Metric**: *Cost* (berdasarkan kapasitas bandwidth link).
- **Administrative Distance**: 110.
- **Area 0 (Backbone Area)**: Area utama wajib pada topologi OSPF.
- **Wildcard Mask**: Kebalikan dari subnet mask standar (misal \`255.255.255.0\` menjadi \`0.0.0.255\`).

## 2. Langkah Konfigurasi OSPF pada Router Cisco
Masuk ke terminal konfigurasi router:

\`\`\`cisco
Router-A> enable
Router-A# configure terminal

! Mengaktifkan proses OSPF dengan Process ID 1
Router-A(config)# router ospf 1

! Menetapkan identitas unik router (Router ID)
Router-A(config-router)# router-id 1.1.1.1

! Mendaftarkan jaringan yang terhubung ke dalam Area 0
Router-A(config-router)# network 10.0.0.0 0.0.0.3 area 0
Router-A(config-router)# network 192.168.1.0 0.0.0.255 area 0

! Menghentikan pengiriman paket OSPF hello yang tidak perlu ke arah klien LAN
Router-A(config-router)# passive-interface fastEthernet 0/0
Router-A(config-router)# exit
\`\`\`

## 3. Konfigurasi pada Router Tetangga (Router-B)
\`\`\`cisco
Router-B> enable
Router-B# configure terminal
Router-B(config)# router ospf 1
Router-B(config-router)# router-id 2.2.2.2
Router-B(config-router)# network 10.0.0.0 0.0.0.3 area 0
Router-B(config-router)# network 192.168.2.0 0.0.0.255 area 0
Router-B(config-router)# passive-interface fastEthernet 0/0
Router-B(config-router)# exit
\`\`\`

## 4. Verifikasi dan Troubleshooting OSPF
Periksa apakah hubungan ketetanggaan (*neighbor adjacency*) sudah terbentuk:

\`\`\`cisco
Router-A# show ip ospf neighbor
\`\`\`
*(Pastikan status tetangga menunjukkan **FULL/BDR** atau **FULL/DR**).*

Periksa tabel routing untuk melihat rute yang dipelajari melalui kode \`O\`:

\`\`\`cisco
Router-A# show ip route ospf
\`\`\`
`
  },
  'static-routing': {
    id: 'note-6',
    slug: 'static-routing',
    title: 'Memahami dan Mengonfigurasi Static Routing & Default Route',
    category: 'Networking',
    tags: ['routing', 'static', 'gateway', 'cisco', 'jaringan'],
    summary: 'Prinsip dasar rute statis, format penulisan next-hop IP vs exit-interface, default route, dan floating static route untuk cadangan link otomatis.',
    readingTime: 6,
    published: true,
    publishedAt: '2026-08-10',
    createdAt: '2026-08-10',
    updatedAt: '2026-08-10',
    content: `# Memahami dan Mengonfigurasi Static Routing & Default Route

Routing statis adalah metode perutean di mana tabel rute ditentukan dan dimasukkan secara manual oleh administrator jaringan. Metode ini sangat hemat penggunaan CPU dan memori router karena tidak ada pertukaran paket update routing secara berkala.

## 1. Format Perintah Penulisan
Sintaks umum pada Cisco IOS:

\`\`\`cisco
Router(config)# ip route <network_tujuan> <subnet_mask> <ip_next_hop | exit_interface> [administrative_distance]
\`\`\`

## 2. Contoh Kasus Implementasi
Bayangkan Router-A ingin menjangkau jaringan kantor cabang di subnet \`192.168.20.0/24\` melalui IP interface router cabang \`10.10.10.2\`:

\`\`\`cisco
Router-A(config)# ip route 192.168.20.0 255.255.255.0 10.10.10.2
\`\`\`

## 3. Konfigurasi Default Route (Gateway of Last Resort)
Default route digunakan untuk meneruskan seluruh paket yang tujuannya tidak terdapat di dalam tabel routing (misalnya seluruh traffic menuju Internet publik):

\`\`\`cisco
Router-A(config)# ip route 0.0.0.0 0.0.0.0 203.0.113.1
\`\`\`

## 4. Floating Static Route (Rute Cadangan Otomatis)
Anda dapat membuat rute alternatif yang hanya akan aktif jika jalur utama terputus, dengan cara memberikan nilai *Administrative Distance* yang lebih besar daripada rute utama (nilai default adalah 1):

\`\`\`cisco
! Rute utama melalui jalur ISP 1 (AD default = 1)
Router(config)# ip route 0.0.0.0 0.0.0.0 203.0.113.1

! Rute cadangan melalui jalur ISP 2 (AD = 10)
Router(config)# ip route 0.0.0.0 0.0.0.0 198.51.100.1 10
\`\`\`

## 5. Pemeriksaan Tabel Routing
\`\`\`cisco
Router# show ip route static
\`\`\`
`
  },
  'linux-systemd-basics': {
    id: 'note-7',
    slug: 'linux-systemd-basics',
    title: 'Dasar-Dasar Linux systemd: Manajemen Layanan, Unit File, dan Journalctl',
    category: 'Linux',
    tags: ['systemd', 'service', 'unit', 'linux', 'devops'],
    summary: 'Pengenalan lengkap sistem inisialisasi systemd di Linux: perintah systemctl, pembuatan file unit service aplikasi kustom, dan analisis log sistem dengan journalctl.',
    readingTime: 9,
    published: true,
    publishedAt: '2026-08-05',
    createdAt: '2026-08-05',
    updatedAt: '2026-08-05',
    content: `# Dasar-Dasar Linux systemd: Manajemen Layanan, Unit File, dan Journalctl

**systemd** adalah sistem inisialisasi (*init system*) dan manajer layanan standar industri yang bertanggung jawab untuk memulai sistem operasi Linux dan mengelola seluruh proses background (*daemon*) di Debian, Ubuntu, Red Hat, Arch Linux, dan distro modern lainnya.

## 1. Perintah Esensial Manajemen Service (\`systemctl\`)
Berikut adalah perintah utama yang sering digunakan sehari-hari:

\`\`\`bash
# Menjalankan layanan
sudo systemctl start nginx

# Menghentikan layanan
sudo systemctl stop nginx

# Me-restart layanan
sudo systemctl restart nginx

# Memuat ulang konfigurasi tanpa menghentikan koneksi yang sedang aktif
sudo systemctl reload nginx

# Mengaktifkan layanan agar otomatis jalan saat sistem booting
sudo systemctl enable nginx

# Memeriksa status kesehatan dan ringkasan log layanan
sudo systemctl status nginx
\`\`\`

## 2. Membuat Custom Unit Service untuk Aplikasi Kustom
Misalnya Anda memiliki aplikasi Node.js / Go / Python yang ingin dijalankan terus menerus sebagai background daemon.

Buat file unit baru di direktori \`/etc/systemd/system/\`:

\`\`\`bash
sudo nano /etc/systemd/system/it-hub.service
\`\`\`

Isi file dengan struktur berikut:

\`\`\`ini
[Unit]
Description=Personal IT Hub Backend Service
After=network.target mysql.service

[Service]
Type=simple
User=sabbil
WorkingDirectory=/home/sabbil/Dokumen/TKJ/personal-it-hub-run/backend
ExecStart=/usr/bin/node dist/server.js
Restart=always
RestartSec=5
Environment=NODE_ENV=production PORT=3001

[Install]
WantedBy=multi-user.target
\`\`\`

Muat ulang daemon systemd dan aktifkan layanan baru:

\`\`\`bash
sudo systemctl daemon-reload
sudo systemctl enable --now it-hub.service
\`\`\`

## 3. Investigasi Log dengan \`journalctl\`
systemd mencatat seluruh output dan error proses secara terpusat melalui \`journald\`:

\`\`\`bash
# Pantau log service secara langsung (live stream)
journalctl -u it-hub.service -f

# Lihat 100 baris log terakhir
journalctl -u it-hub.service -n 100

# Lihat log sejak 30 menit yang lalu
journalctl -u it-hub.service --since "30 min ago"
\`\`\`
`
  },
  'aws-vpc-fundamentals': {
    id: 'note-8',
    slug: 'aws-vpc-fundamentals',
    title: 'Fundamental AWS Virtual Private Cloud (VPC): Subnet, Route Table & Gateway',
    category: 'Cloud',
    tags: ['aws', 'vpc', 'cloud', 'networking', 'architecture'],
    summary: 'Panduan arsitektur jaringan cloud Amazon VPC: perancangan CIDR Block, Public vs Private Subnet, Internet Gateway (IGW), dan NAT Gateway untuk keamanan tingkat tinggi.',
    readingTime: 15,
    published: true,
    publishedAt: '2026-07-28',
    createdAt: '2026-07-28',
    updatedAt: '2026-07-28',
    content: `# Fundamental AWS Virtual Private Cloud (VPC): Subnet, Route Table & Gateway

Amazon Virtual Private Cloud (AWS VPC) memungkinkan Anda meluncurkan sumber daya AWS (seperti server EC2, database RDS, dan load balancer) di dalam jaringan virtual terisolasi yang Anda kendalikan sepenuhnya.

## 1. Komponen Inti Arsitektur VPC
- **CIDR Block**: Alokasi blok IP internal (contoh standar: \`10.0.0.0/16\` menyediakan 65.536 alamat IP).
- **Public Subnet**: Subnet yang terhubung langsung ke internet melalui Internet Gateway (IGW). Biasa digunakan untuk web server publik dan Load Balancer.
- **Private Subnet**: Subnet terisolasi tanpa akses publik langsung dari luar. Digunakan untuk database dan server aplikasi internal.
- **Internet Gateway (IGW)**: Komponen VPC berkecepatan tinggi yang menghubungkan jaringan VPC Anda ke Internet publik.
- **NAT Gateway**: Berada di Public Subnet untuk meneruskan koneksi keluar dari server di Private Subnet (misalnya untuk mengunduh update paket \`apt update\`) tanpa mengekspos server ke internet luar.

## 2. Praktik Terbaik Topologi 2-Tier / 3-Tier
\`\`\`
[ Internet ]
     │
     ▼
[ Internet Gateway ]
     │
     ├─► [ Public Subnet (10.0.1.0/24) ] ──► Load Balancer & Nginx Reverse Proxy
     │         │
     │     [ NAT Gateway ]
     │         │
     └─► [ Private Subnet (10.0.2.0/24) ] ──► Aplikasi Backend & Basis Data (MySQL)
\`\`\`

## 3. Konfigurasi Route Table
1. **Public Route Table**:
   - \`10.0.0.0/16\` -> \`local\`
   - \`0.0.0.0/0\` -> \`igw-xxxxxxxxx\` (Internet Gateway)
2. **Private Route Table**:
   - \`10.0.0.0/16\` -> \`local\`
   - \`0.0.0.0/0\` -> \`nat-xxxxxxxxx\` (NAT Gateway)
`
  },
  'aws-ec2': {
    id: 'note-9',
    slug: 'aws-ec2',
    title: 'Panduan Praktis AWS EC2: Siklus Hidup Instance, Penyimpanan EBS, dan User Data',
    category: 'Cloud',
    tags: ['aws', 'ec2', 'compute', 'cloud', 'sysadmin'],
    summary: 'Eksplorasi layanan komputasi cloud Amazon EC2: klasifikasi tipe instance (T/C/R/M), penyimpanan blok EBS, SSH Key Pairs, dan skrip otomasi User Data saat boot pertama.',
    readingTime: 11,
    published: true,
    publishedAt: '2026-07-20',
    createdAt: '2026-07-20',
    updatedAt: '2026-07-20',
    content: `# Panduan Praktis AWS EC2: Siklus Hidup Instance, Penyimpanan EBS, dan User Data

Amazon Elastic Compute Cloud (Amazon EC2) adalah tulang punggung komputasi awan AWS yang menyediakan server virtual (*Virtual Machines*) yang dapat disesuaikan kapasitas CPU, RAM, dan kapasitas penyimpanannya sesuai kebutuhan.

## 1. Klasifikasi Tipe Instance EC2
- **T-Series / M-Series (General Purpose)**: Seimbang antara CPU dan memori RAM. Cocok untuk web server standar, development, dan repository (contoh: \`t3.micro\`, \`t4g.medium\`).
- **C-Series (Compute Optimized)**: Rasio CPU per RAM tinggi. Ideal untuk komputasi berat, rendering, dan batch processing (contoh: \`c6i.large\`).
- **R-Series (Memory Optimized)**: Rasio RAM per CPU tinggi. Khusus dirancang untuk pemrosesan data dalam memori seperti Redis, Elasticsearch, dan basis data berkinerja tinggi.

## 2. Penyimpanan Persistent dengan Elastic Block Store (EBS)
- **General Purpose SSD (gp3)**: Pilihan standar terbaik dengan baseline 3000 IOPS dan 125 MB/s throughput independen dari ukuran kapasitas disk.
- **Provisioned IOPS SSD (io2)**: Dirancang untuk beban I/O mission-critical dengan latensi sub-milidetik.

## 3. Skrip Otomasi User Data Saat Booting Pertama
Fitur **User Data** memungkinkan Anda mengeksekusi skrip bash secara otomatis saat mesin pertama kali dihidupkan:

\`\`\`bash
#!/bin/bash
apt-get update -y
apt-get install -y nginx nodejs npm git

# Buat halaman web statis selamat datang
echo "<h1>Deployed via AWS EC2 User Data Automation</h1>" > /var/www/html/index.html

systemctl enable --now nginx
\`\`\`
`
  },
  'aws-security-groups': {
    id: 'note-10',
    slug: 'aws-security-groups',
    title: 'AWS Security Groups: Stateful Virtual Firewall & Defense in Depth',
    category: 'Cloud',
    tags: ['aws', 'security', 'firewall', 'cloud', 'devsecops'],
    summary: 'Implementasi firewall virtual AWS Security Groups: karakteristik stateful, perancangan aturan Inbound/Outbound, dan relasi referensi antar Security Group.',
    readingTime: 8,
    published: true,
    publishedAt: '2026-07-15',
    createdAt: '2026-07-15',
    updatedAt: '2026-07-15',
    content: `# AWS Security Groups: Stateful Virtual Firewall & Defense in Depth

Security Group adalah komponen firewall virtual tingkat host yang beroperasi di lapisan Elastic Network Interface (ENI) untuk mengontrol dan menyaring lalu lintas data yang diizinkan masuk (*inbound*) dan keluar (*outbound*) dari instans AWS EC2.

## 1. Karakteristik Stateful (Keunggulan Utama)
- **Stateful Nature**: Jika Anda mengizinkan paket request masuk melalui suatu port (misalnya port \`443\` HTTPS), maka paket respon balasan dari server otomatis diizinkan keluar tanpa memerlukan aturan outbound tambahan.
- Secara default, seluruh traffic inbound **ditolak** kecuali dibuatkan aturan izin eksplisit (*allow-list only*).

## 2. Perbedaan Security Group vs Network ACL (NACL)
| Fitur | Security Group | Network ACL (NACL) |
| :--- | :--- | :--- |
| **Tingkat Operasi** | Instance / ENI level | Subnet level |
| **Sifat Aturan** | **Stateful** | **Stateless** |
| **Jenis Aturan** | Hanya *Allow* | *Allow* dan *Deny* |
| **Evaluasi Urutan**| Semua aturan dievaluasi bersamaan | Dievaluasi berurutan berdasarkan nomor aturan |

## 3. Praktik Terbaik: Chaining & Referencing Security Group
Jangan pernah membuka port basis data (seperti MySQL 3306) ke IP publik atau \`0.0.0.0/0\`. Cukup referensikan ID Security Group milik server aplikasi:

- **Security Group Web Server (\`sg-web\`)**:
  - Inbound: Port 80 & 443 dari \`0.0.0.0/0\`
- **Security Group Database (\`sg-database\`)**:
  - Inbound: Port 3306 -> **Source**: \`sg-web\` *(Hanya menerima koneksi dari instance yang menggunakan kelompok keamanan Web Server)*.
`
  },
  'web-server-apache-debian': {
    id: 'note-11',
    slug: 'web-server-apache-debian',
    title: 'Konfigurasi Web Server Apache2 & Virtual Host di Debian',
    category: 'Server',
    tags: ['web-server', 'apache', 'debian', 'http', 'linux', 'sysadmin'],
    summary: 'Panduan komprehensif instalasi Web Server Apache2 di Debian, konfigurasi Virtual Host multi-domain, optimasi modul, dan pengamanan HTTPS.',
    readingTime: 8,
    published: true,
    publishedAt: '2026-09-08',
    createdAt: '2026-09-08',
    updatedAt: '2026-09-08',
    content: "# Konfigurasi Web Server Apache2 & Virtual Host di Debian\n\nApache HTTP Server (Apache2) adalah salah satu perangkat lunak web server sumber terbuka paling populer dan andal di dunia yang bertanggung jawab melayani konten web statis maupun dinamis ke browser klien melalui protokol HTTP/HTTPS.\n\n## 1. Konsep & Arsitektur Apache2 di Debian\nPada distribusi Debian, struktur direktori Apache2 dirancang dengan rapi dan modular:\n- `/etc/apache2/apache2.conf`: File konfigurasi utama server Apache.\n- `/etc/apache2/ports.conf`: Mengatur port pendengar (default port 80 untuk HTTP dan 443 untuk HTTPS).\n- `/etc/apache2/sites-available/`: Direktori penyimpanan file konfigurasi Virtual Host yang tersedia.\n- `/etc/apache2/sites-enabled/`: Direktori symlink dari situs yang aktif dan dimuat oleh Apache.\n- `/var/www/html/`: Lokasi default berkas root web (*DocumentRoot*).\n\n## 2. Langkah Instalasi Apache2\nPerbarui repositori lokal dan instal paket Apache2:\n\n```bash\nsudo apt update && sudo apt install apache2 -y\n```\n\nPastikan service Apache2 aktif dan berjalan:\n\n```bash\nsudo systemctl status apache2\nsudo systemctl enable apache2\n```\n\nUji akses melalui browser dengan mengetikkan IP server atau domain: `http://IP-SERVER/`. Halaman default *Apache2 Debian Default Page* akan muncul.\n\n## 3. Konfigurasi Virtual Host Multi-Domain\nVirtual Host memungkinkan satu server fisik/mesin untuk melayani banyak website atau nama domain yang berbeda secara bersamaan.\n\n### Contoh Skenario: Menyiapkan Domain `web.lokal`\n1. Buat direktori root dokumen untuk website:\n```bash\nsudo mkdir -p /var/www/web.lokal/html\nsudo chown -R $USER:$USER /var/www/web.lokal/html\nsudo chmod -R 755 /var/www/web.lokal\n```\n\n2. Buat halaman beranda contoh `index.html`:\n```bash\ncat << 'INDEX' > /var/www/web.lokal/html/index.html\n<!DOCTYPE html>\n<html>\n<head>\n    <title>Selamat Datang di Web Lokal</title>\n    <style>\n        body { font-family: sans-serif; background: #0f172a; color: #f8fafc; text-align: center; padding-top: 100px; }\n        h1 { color: #38bdf8; }\n    </style>\n</head>\n<body>\n    <h1>Apache2 Virtual Host Berjalan Sukses!</h1>\n    <p>Domain: <strong>web.lokal</strong></p>\n</body>\n</html>\nINDEX\n```\n\n3. Buat file konfigurasi Virtual Host baru:\n```bash\nsudo nano /etc/apache2/sites-available/web.lokal.conf\n```\n\nIsikan konfigurasi berikut:\n```apache\n<VirtualHost *:80>\n    ServerAdmin admin@web.lokal\n    ServerName web.lokal\n    ServerAlias www.web.lokal\n\n    DocumentRoot /var/www/web.lokal/html\n\n    <Directory /var/www/web.lokal/html>\n        Options -Indexes +FollowSymLinks\n        AllowOverride All\n        Require all granted\n    </Directory>\n\n    ErrorLog \\${APACHE_LOG_DIR}/web.lokal_error.log\n    CustomLog \\${APACHE_LOG_DIR}/web.lokal_access.log combined\n</VirtualHost>\n```\n\n4. Aktifkan Virtual Host dan Modul Rewrite:\n```bash\nsudo a2ensite web.lokal.conf\nsudo a2enmod rewrite\nsudo apache2ctl configtest\nsudo systemctl reload apache2\n```\n\n## 4. Perintah Penting Pengelolaan Apache\n- `a2ensite <nama_file>.conf` : Mengaktifkan Virtual Host.\n- `a2dissite <nama_file>.conf` : Menonaktifkan Virtual Host.\n- `a2enmod <nama_modul>` : Mengaktifkan modul Apache (seperti `ssl`, `rewrite`, `headers`).\n- `apache2ctl configtest` : Memeriksa validitas sintaks konfigurasi sebelum reload/restart.\n- `sudo systemctl reload apache2` : Memuat ulang konfigurasi tanpa menghentikan koneksi aktif.\n"
  },
  'mariadb-database-configuration': {
    id: 'note-12',
    slug: 'mariadb-database-configuration',
    title: 'Instalasi, Hardening Keamanan & Manajemen SQL MariaDB di Linux',
    category: 'Database',
    tags: ['database', 'mariadb', 'mysql', 'sql', 'linux', 'sysadmin'],
    summary: 'Tutorial lengkap instalasi RDBMS MariaDB Server, pengamanan mariadb-secure-installation, pembuatan database, user hak akses, backup mysqldump, dan optimasi query SQL.',
    readingTime: 9,
    published: true,
    publishedAt: '2026-09-09',
    createdAt: '2026-09-09',
    updatedAt: '2026-09-09',
    content: "# Instalasi, Hardening Keamanan & Manajemen SQL MariaDB di Linux\n\nMariaDB adalah sistem manajemen basis data relasional (RDBMS) sumber terbuka berkinerja tinggi yang merupakan *drop-in replacement* biner untuk MySQL, dikembangkan oleh pengembang asli MySQL.\n\n## 1. Instalasi MariaDB Server\nPada Debian dan Ubuntu, pasang MariaDB Server dan client menggunakan manajer paket:\n\n```bash\nsudo apt update\nsudo apt install mariadb-server mariadb-client -y\n```\n\nVerifikasi status layanan:\n```bash\nsudo systemctl status mariadb\nsudo systemctl enable mariadb\n```\n\n## 2. Hardening Keamanan dengan `mariadb-secure-installation`\nSangat penting menjalankan skrip hardening keamanan bawaan untuk menghapus akun anonim, mengunci login root jarak jauh, dan menghapus basis data tes:\n\n```bash\nsudo mariadb-secure-installation\n```\nRekomendasi pilihan saat dialog interaktif:\n- *Switch to unix_socket authentication* -> **Y** (atau N jika ingin password root biasa)\n- *Change the root password?* -> **Y** (buat password root yang kuat)\n- *Remove anonymous users?* -> **Y**\n- *Disallow root login remotely?* -> **Y**\n- *Remove test database and access to it?* -> **Y**\n- *Reload privilege tables now?* -> **Y**\n\n## 3. Manajemen Akun Pengguna & Hak Akses (Privileges)\nPraktik keamanan terbaik melarang aplikasi web menggunakan akun `root`. Buat basis data khusus dan pengguna terisolasi:\n\nMasuk ke konsol SQL MariaDB:\n```bash\nsudo mariadb -u root -p\n```\n\nEksekusi perintah SQL berikut:\n```sql\n-- Membuat Database Baru dengan Collation UTF-8\nCREATE DATABASE it_hub_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;\n\n-- Membuat Pengguna Baru dengan Autentikasi Password\nCREATE USER 'it_user'@'localhost' IDENTIFIED BY 'PasswordKuat123#';\n\n-- Memberikan Hak Akses Penuh Hanya Pada Database Tersebut\nGRANT ALL PRIVILEGES ON it_hub_db.* TO 'it_user'@'localhost';\n\n-- Menerapkan Perubahan Hak Akses\nFLUSH PRIVILEGES;\n\n-- Memeriksa Daftar Database dan Pengguna\nSHOW DATABASES;\nSELECT user, host FROM mysql.user;\n\nEXIT;\n```\n\n## 4. Perintah Dasar Manipulasi Data SQL\nContoh perintah dasar DDL dan DML di MariaDB:\n\n```sql\n-- Menggunakan Database\nUSE it_hub_db;\n\n-- Membuat Tabel\nCREATE TABLE users (\n    id INT AUTO_INCREMENT PRIMARY KEY,\n    username VARCHAR(50) NOT NULL UNIQUE,\n    email VARCHAR(100) NOT NULL UNIQUE,\n    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n);\n\n-- Memasukkan Data (Insert)\nINSERT INTO users (username, email) VALUES \n('sabbil', 'sabbil@example.lokal'),\n('admin', 'admin@example.lokal');\n\n-- Menampilkan Data (Select)\nSELECT * FROM users WHERE username = 'sabbil';\n\n-- Memperbarui Data (Update)\nUPDATE users SET email = 'sabbil.baru@example.lokal' WHERE username = 'sabbil';\n\n-- Menghapus Data (Delete)\nDELETE FROM users WHERE id = 2;\n```\n\n## 5. Backup & Restore Basis Data (`mysqldump`)\nUntuk menjaga integritas dan ketersediaan data, lakukan pencadangan rutin:\n\n### Ekspor (Backup) Database:\n```bash\nmysqldump -u it_user -p it_hub_db > backup_it_hub_\\$(date +%Y%m%d).sql\n```\n\n### Impor (Restore) Database:\n```bash\nmariadb -u it_user -p it_hub_db < backup_it_hub_20260909.sql\n```\n\n## 6. Mengizinkan Koneksi Jarak Jauh (Remote Access)\nSecara bawaan, MariaDB hanya mendengarkan loopback `127.0.0.1`. Jika server web berada di mesin lain dan perlu terhubung ke MariaDB:\n\n1. Buka file konfigurasi:\n```bash\nsudo nano /etc/mysql/mariadb.conf.d/50-server.cnf\n```\n2. Ubah baris `bind-address`:\n```ini\nbind-address = 0.0.0.0\n```\n3. Berikan hak akses user untuk IP klien atau wildcard `%`:\n```sql\nGRANT ALL PRIVILEGES ON it_hub_db.* TO 'it_user'@'192.168.1.%' IDENTIFIED BY 'PasswordKuat123#';\nFLUSH PRIVILEGES;\n```\n4. Muat ulang layanan:\n```bash\nsudo systemctl restart mariadb\n```\n"
  },
  'integrated-dynamic-web-server': {
    id: 'note-13',
    slug: 'integrated-dynamic-web-server',
    title: 'Arsitektur Web Server Dinamis: Integrasi BIND9 DNS, Apache & Database MariaDB',
    category: 'Architecture',
    tags: ['web-server', 'apache', 'bind9', 'dns', 'mariadb', 'sql', 'php', 'lamp', 'sysadmin'],
    summary: 'Implementasi menyeluruh sistem web server dinamis (LAMP Stack) yang terintegrasi dengan Name Server BIND9 lokal dan basis data SQL MariaDB.',
    readingTime: 12,
    published: true,
    publishedAt: '2026-09-10',
    createdAt: '2026-09-10',
    updatedAt: '2026-09-10',
    content: "# Arsitektur Web Server Dinamis: Integrasi BIND9 DNS, Apache & Database MariaDB\n\nPanduan arsitektur end-to-end membangun sistem web server dinamis (LAMP Stack: Linux, Apache, MariaDB/MySQL, PHP/Backend) yang terhubung langsung dengan Name Server BIND9 lokal dan basis data relasional.\n\n```\n                       ALUR PERJALANAN REQUEST CLIENT\n+-----------------+      1. Query Domain       +-----------------+\n|     Browser     | -------------------------> |   BIND9 Server  |\n|  (Client PC/HP) | <------------------------- |  (127.0.0.1:53) |\n+-----------------+      2. IP: 192.168.1.8     +-----------------+\n         |\n         | 3. HTTP Request (Host: app.lokal)\n         v\n+-----------------+      4. Eksekusi Script    +-----------------+\n|  Apache2 Server | -------------------------> |  PHP-FPM Engine |\n|  (Port 80/443)  | <------------------------- | (Dynamic Script)|\n+-----------------+      7. HTML Response      +-----------------+\n                                                        |\n                                                        | 5. Query SQL\n                                                        v\n                                               +-----------------+\n                                               | MariaDB Server  |\n                                               |   (Port 3306)   |\n                                               +-----------------+\n```\n\n---\n\n## 1. Konfigurasi DNS di BIND9\nAgar web server dinamis dapat diakses menggunakan domain kustom (misal: `app.lokal`), kita daftarkan zona baru di BIND9.\n\n1. Buka file `/etc/bind/named.conf.local` dan tambahkan:\n```bind\nzone \"app.lokal\" {\n    type master;\n    file \"/etc/bind/db.app.lokal\";\n};\n```\n\n2. Buat file zona `/etc/bind/db.app.lokal`:\n```bind\n$TTL    604800\n@       IN      SOA     ns1.app.lokal. admin.app.lokal. (\n                        2026091001 ; Serial\n                        604800     ; Refresh\n                        86400      ; Retry\n                        2419200    ; Expire\n                        604800 )   ; Negative Cache TTL\n;\n@       IN      NS      ns1.app.lokal.\nns1     IN      A       192.168.1.8\n@       IN      A       192.168.1.8\nwww     IN      A       192.168.1.8\n```\n\n3. Muat ulang service BIND9:\n```bash\nsudo rndc reload\n# atau\nsudo systemctl reload bind9\n```\n\nUji resolusi DNS dari terminal:\n```bash\ndig @127.0.0.1 app.lokal +short\n# Output: 192.168.1.8\n```\n\n---\n\n## 2. Menyiapkan Basis Data MariaDB\nBuat database dan tabel untuk menampung data dinamis aplikasi web:\n\nMasuk ke console MariaDB:\n```bash\nsudo mariadb -u root -p\n```\n\nEksekusi perintah SQL berikut:\n```sql\n-- Buat Database\nCREATE DATABASE app_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;\n\n-- Buat User Khusus\nCREATE USER 'app_user'@'localhost' IDENTIFIED BY 'KatasandiRahasia123!';\nGRANT ALL PRIVILEGES ON app_db.* TO 'app_user'@'localhost';\nFLUSH PRIVILEGES;\n\n-- Gunakan Database & Buat Tabel\nUSE app_db;\n\nCREATE TABLE guest_messages (\n    id INT AUTO_INCREMENT PRIMARY KEY,\n    sender_name VARCHAR(100) NOT NULL,\n    message TEXT NOT NULL,\n    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n);\n\n-- Insert Data Dummy Contoh\nINSERT INTO guest_messages (sender_name, message) VALUES \n('Sabbil', 'Sistem Web Server Dinamis + BIND9 berjalan lancar!'),\n('Admin IT', 'Database MariaDB berhasil terintegrasi dengan Apache.');\n```\n\n---\n\n## 3. Instalasi PHP & Ekstensi MySQL di Apache\nWeb server Apache memerlukan modul PHP untuk memproses kode dinamis sebelum mengirimkan respon HTML ke browser klien:\n\n```bash\nsudo apt update\nsudo apt install apache2 php libapache2-mod-php php-mysql -y\n```\n\n---\n\n## 4. Pembuatan Aplikasi Web Dinamis\nBuat direktori root web untuk domain `app.lokal`:\n```bash\nsudo mkdir -p /var/www/app.lokal/html\nsudo chown -R $USER:$USER /var/www/app.lokal/html\nsudo chmod -R 755 /var/www/app.lokal\n```\n\nBuat script PHP dinamis `/var/www/app.lokal/html/index.php`:\n```php\n<?php\n$host = '127.0.0.1';\n$db   = 'app_db';\n$user = 'app_user';\n$pass = 'KatasandiRahasia123!';\n$charset = 'utf8mb4';\n\n$dsn = \"mysql:host=$host;dbname=$db;charset=$charset\";\n$options = [\n    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,\n    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,\n];\n\ntry {\n    $pdo = new PDO($dsn, $user, $pass, $options);\n} catch (PDOException $e) {\n    die(\"Koneksi Basis Data Gagal: \" . $e->getMessage());\n}\n\n// Proses Form Input Baru\nif ($_SERVER['REQUEST_METHOD'] === 'POST' && !empty($_POST['sender_name']) && !empty($_POST['message'])) {\n    $stmt = $pdo->prepare(\"INSERT INTO guest_messages (sender_name, message) VALUES (?, ?)\");\n    $stmt->execute([htmlspecialchars($_POST['sender_name']), htmlspecialchars($_POST['message'])]);\n    header(\"Location: \" . $_SERVER['PHP_SELF']);\n    exit;\n}\n\n// Ambil Seluruh Data\n$stmt = $pdo->query(\"SELECT * FROM guest_messages ORDER BY id DESC\");\n$messages = $stmt->fetchAll();\n?>\n<!DOCTYPE html>\n<html lang=\"id\">\n<head>\n    <meta charset=\"UTF-8\">\n    <title>Web Dinamis - app.lokal</title>\n    <style>\n        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #0b0f19; color: #f3f4f6; margin: 0; padding: 40px 20px; }\n        .container { max-width: 700px; margin: 0 auto; background: #111827; padding: 30px; border-radius: 12px; border: 1px solid #1f2937; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }\n        h1 { color: #38bdf8; font-size: 24px; border-bottom: 2px solid #1e293b; padding-bottom: 12px; }\n        .badge { background: #0284c7; color: #fff; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-family: monospace; }\n        input, textarea { width: 100%; padding: 10px; margin-top: 6px; margin-bottom: 14px; background: #1f2937; border: 1px solid #374151; border-radius: 6px; color: #fff; box-sizing: border-box; }\n        button { background: #0284c7; color: #fff; border: none; padding: 10px 20px; border-radius: 6px; font-weight: bold; cursor: pointer; }\n        button:hover { background: #0369a1; }\n        .card { background: #1f2937; border-left: 4px solid #38bdf8; padding: 14px; margin-top: 14px; border-radius: 4px; }\n        .time { font-size: 12px; color: #9ca3af; }\n    </style>\n</head>\n<body>\n<div class=\"container\">\n    <h1>Web Server Dinamis Terintegrasi</h1>\n    <p>Domain: <span class=\"badge\">app.lokal</span> | Status DB: <strong style=\"color: #4ade80;\">Terhubung (MariaDB)</strong></p>\n    \n    <form method=\"POST\">\n        <label>Nama Anda:</label>\n        <input type=\"text\" name=\"sender_name\" required placeholder=\"Masukkan nama...\">\n        <label>Pesan:</label>\n        <textarea name=\"message\" rows=\"3\" required placeholder=\"Tulis pesan dinamis...\"></textarea>\n        <button type=\"submit\">Simpan ke Database</button>\n    </form>\n\n    <h2 style=\"margin-top: 30px; font-size: 18px; color: #94a3b8;\">Data dari Database Realtime:</h2>\n    <?php foreach ($messages as $msg): ?>\n        <div class=\"card\">\n            <strong><?= htmlspecialchars($msg['sender_name']) ?></strong>\n            <p style=\"margin: 6px 0;\"><?= htmlspecialchars($msg['message']) ?></p>\n            <span class=\"time\"><?= $msg['created_at'] ?></span>\n        </div>\n    <?php endforeach; ?>\n</div>\n</body>\n</html>\n```\n\n---\n\n## 5. Konfigurasi Virtual Host Apache\nBuat berkas konfigurasi Virtual Host Apache untuk mengikat domain `app.lokal` ke root dokumen web:\n\n```bash\nsudo nano /etc/apache2/sites-available/app.lokal.conf\n```\n\nIsikan:\n```apache\n<VirtualHost *:80>\n    ServerAdmin admin@app.lokal\n    ServerName app.lokal\n    ServerAlias www.app.lokal\n\n    DocumentRoot /var/www/app.lokal/html\n    DirectoryIndex index.php index.html\n\n    <Directory /var/www/app.lokal/html>\n        Options -Indexes +FollowSymLinks\n        AllowOverride All\n        Require all granted\n    </Directory>\n\n    ErrorLog ${APACHE_LOG_DIR}/app.lokal_error.log\n    CustomLog ${APACHE_LOG_DIR}/app.lokal_access.log combined\n</VirtualHost>\n```\n\nAktifkan konfigurasi Virtual Host dan restart Apache:\n```bash\nsudo a2ensite app.lokal.conf\nsudo apache2ctl configtest\nsudo systemctl reload apache2\n```\n\n---\n\n## 6. Verifikasi & Pengujian Integrasi Penuh\n1. **Verifikasi DNS**:\n   Pastikan klien meresolusi `app.lokal` ke IP server:\n   ```bash\n   nslookup app.lokal\n   ```\n2. **Uji di Browser**:\n   Buka `http://app.lokal` di browser.\n3. **Uji Dinamis**:\n   Kirimkan pesan melalui formulir web, data akan tersimpan ke dalam tabel MariaDB dan halaman akan langsung menampilkan data tersebut secara real-time.\n"
  },
  'php-runtime-fpm-configuration': {
    id: 'note-14',
    slug: 'php-runtime-fpm-configuration',
    title: 'Konfigurasi Runtime PHP, PHP-FPM, Ekstensi & Hardening Keamanan di Linux',
    category: 'Server',
    tags: ['php', 'php-fpm', 'backend', 'linux', 'apache', 'nginx', 'sysadmin', 'performance'],
    summary: 'Panduan komprehensif instalasi multi-version PHP 8.x, tuning pool worker PHP-FPM, integrasi FastCGI di Apache & Nginx, akselerasi OPcache, dan hardening keamanan php.ini untuk server produksi.',
    readingTime: 11,
    published: true,
    publishedAt: '2026-09-12',
    createdAt: '2026-09-12',
    updatedAt: '2026-09-12',
    content: `# Konfigurasi Runtime PHP, PHP-FPM, Ekstensi & Hardening Keamanan di Linux

PHP (Hypertext Preprocessor) adalah bahasa skrip server-side paling banyak digunakan di dunia yang mentenagai web modern. Dalam arsitektur server Linux profesional, PHP tidak lagi dijalankan sebagai modul monolitik di dalam web server, melainkan melalui runtime terisolasi berkecepatan tinggi: **PHP-FPM (FastCGI Process Manager)**.

## 1. Arsitektur Runtime PHP di Linux: SAPI & FastCGI
SAPI (*Server Application Programming Interface*) adalah mekanisme antarmuka antara mesin interpreter PHP dengan lingkungan eksekusi:
- **CLI (Command Line Interface)**: Menjalankan skrip PHP langsung dari terminal Linux, cron jobs, skrip artisan/composer.
- **Apache Module (\`mod_php\`)**: Metode lawas di mana interpreter PHP disematkan langsung di dalam proses worker Apache (Prefork MPM). Metode ini memboroskan RAM karena setiap request file statis (CSS, JS, gambar) tetap memuat seluruh modul PHP.
- **PHP-FPM (FastCGI Process Manager)**: Standar modern produksi. PHP berjalan sebagai daemon service independen di sistem operasi (\`systemd\`). Web server (Apache atau Nginx) hanya bertindak sebagai reverse proxy yang meneruskan request skrip dinamis ke PHP-FPM melalui socket UNIX berkecepatan tinggi.

\`\`\`
                  ALUR PEMROSESAN FASTCGI PHP-FPM
+-------------------+      1. Request HTTP       +--------------------+
|  Klien / Browser  | -------------------------> | Web Server (Proxy) |
|   (Internet/LAN)  | <------------------------- |   (Apache / Nginx) |
+-------------------+      4. HTML Terproses     +--------------------+
                                                           |
                                  2. FastCGI Protocol      | UNIX Socket
                                     (Non-blocking)        v (/run/php/php8.2-fpm.sock)
                                                 +--------------------+
                                                 |  PHP-FPM Master    |
                                                 |  Process (PID 1)   |
                                                 +--------------------+
                                                           |
                                      Spawn / Scale        | Process Pool
                                                           v
                                                 +--------------------+
                                                 | PHP-FPM Worker #1  |
                                                 | PHP-FPM Worker #2  |
                                                 | PHP-FPM Worker #N  |
                                                 +--------------------+
\`\`\`

## 2. Instalasi PHP 8.x & Ekstensi Penting di Debian
Distribusi Debian 12 (Bookworm) menyertakan PHP 8.2 secara default. Untuk versi terbaru (PHP 8.3 / 8.4) atau multi-versi, kita dapat memanfaatkan repositori PPA Ondřej Surý.

### Instalasi Repositori & Paket Inti:
\`\`\`bash
# Perbarui indeks paket
sudo apt update && sudo apt install -y curl lsb-release ca-certificates apt-transport-https software-properties-common

# Pasang PHP-FPM, PHP-CLI, dan modul umum
sudo apt install -y php-cli php-fpm php-common
\`\`\`

### Instalasi Ekstensi Database, Web & Pemrosesan Data:
Aplikasi PHP modern membutuhkan modul ekstensi untuk berkomunikasi dengan database dan memanipulasi media:
\`\`\`bash
sudo apt install -y \\
  php-mysql \\
  php-pgsql \\
  php-curl \\
  php-gd \\
  php-mbstring \\
  php-xml \\
  php-zip \\
  php-intl \\
  php-bcmath \\
  php-opcache
\`\`\`

### Memeriksa Versi & Ekstensi Aktif:
\`\`\`bash
# Cek versi PHP CLI
php -v

# Cek daftar ekstensi yang terpasang
php -m

# Cek status daemon PHP-FPM
sudo systemctl status php8.2-fpm
\`\`\`

## 3. Hardening Keamanan \`php.ini\` untuk Server Produksi
Secara default, konfigurasi PHP dirancang ramah untuk tahap pengembangan (*development*). Di server produksi, file konfigurasi utama wajib diamankan guna mencegah kebocoran informasi (*information disclosure*) dan serangan injeksi sistem.

File konfigurasi PHP-FPM berada di \`/etc/php/8.2/fpm/php.ini\`. Lakukan backup sebelum mengedit:
\`\`\`bash
sudo cp /etc/php/8.2/fpm/php.ini /etc/php/8.2/fpm/php.ini.bak
sudo nano /etc/php/8.2/fpm/php.ini
\`\`\`

Terapkan parameter keamanan berikut:

\`\`\`ini
; Sembunyikan versi PHP dari header HTTP Response (X-Powered-By)
expose_php = Off

; Nonaktifkan tampilan error ke layar publik (cegah kebocoran struktur file/SQL)
display_errors = Off
display_startup_errors = Off

; Wajibkan pencatatan error ke file log terisolasi
log_errors = On
error_log = /var/log/php_errors.log
error_reporting = E_ALL & ~E_DEPRECATED & ~E_STRICT

; Batasi alokasi memori dan batas waktu eksekusi skrip
memory_limit = 256M
max_execution_time = 30
max_input_time = 60

; Batasi ukuran berkas upload
upload_max_filesize = 20M
post_max_size = 25M

; Cegah serangan Remote File Inclusion (RFI)
allow_url_fopen = Off
allow_url_include = Off

; Nonaktifkan fungsi shell Linux berbahaya yang kerap disalahgunakan web-shell / malware
disable_functions = exec,passthru,shell_exec,system,proc_open,popen,curl_multi_exec,parse_ini_file,show_source

; Pengamanan Cookie Session
session.cookie_httponly = 1
session.cookie_secure = 1
session.cookie_samesite = "Strict"
session.use_strict_mode = 1
\`\`\`

Buat file log dan berikan hak akses ke user web server \`www-data\`:
\`\`\`bash
sudo touch /var/log/php_errors.log
sudo chown www-data:www-data /var/log/php_errors.log
sudo chmod 660 /var/log/php_errors.log
\`\`\`

## 4. Konfigurasi Pool Worker PHP-FPM (\`pool.d/www.conf\`)
Konfigurasi worker pool PHP-FPM menentukan bagaimana proses PHP dialokasikan untuk melayani permintaan koneksi konkuren. Berkas konfigurasi pool default berada di \`/etc/php/8.2/fpm/pool.d/www.conf\`.

### 1. Pemilihan Socket: UNIX Domain Socket vs TCP
UNIX Domain Socket (\`/run/php/php8.2-fpm.sock\`) tidak memiliki overhead protokol TCP/IP, memberikan performa 15-20% lebih cepat untuk setup lokal:
\`\`\`ini
listen = /run/php/php8.2-fpm.sock
listen.owner = www-data
listen.group = www-data
listen.mode = 0660
\`\`\`

### 2. Tuning Process Manager (\`pm\`) & Formula Kalkulasi RAM
Mode \`pm = dynamic\` adalah opsi paling stabil untuk menangani beban dinamis:

\`\`\`ini
pm = dynamic
pm.max_children = 50
pm.start_servers = 10
pm.min_spare_servers = 5
pm.max_spare_servers = 15
pm.max_requests = 1000
\`\`\`

> **Formula Menghitung \`pm.max_children\`:**
> \`max_children = (Total RAM Server dialokasikan untuk PHP) / (Rata-rata penggunaan RAM per worker PHP)\`
>
> Contoh: Server memiliki RAM 4 GB (4096 MB). Alokasikan 2.5 GB (2560 MB) untuk PHP-FPM, sisakan untuk OS dan MariaDB. Jika rata-rata 1 worker PHP memakan 35 MB RAM:
> \`max_children = 2560 / 35 ≈ 73\` -> Set \`pm.max_children = 70\`.

Parameter \`pm.max_requests = 1000\` mendaur ulang proses worker setelah melayani 1000 request, mencegah kebocoran memori (*memory leak*).

## 5. Integrasi PHP-FPM dengan Web Server

### A. Konfigurasi di Web Server Apache2
Gunakan modul \`proxy_fcgi\` bawaan Apache:
\`\`\`bash
sudo a2enmod proxy proxy_fcgi setenvif
sudo a2enconf php8.2-fpm
\`\`\`

Tambahkan handler FastCGI pada file Virtual Host \`/etc/apache2/sites-available/app.lokal.conf\`:
\`\`\`apache
<VirtualHost *:80>
    ServerName app.lokal
    DocumentRoot /var/www/app.lokal/html

    <Directory /var/www/app.lokal/html>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>

    # Teruskan seluruh berkas .php ke PHP-FPM UNIX Socket
    <FilesMatch \\.php$>
        SetHandler "proxy:unix:/run/php/php8.2-fpm.sock|fcgi://localhost"
    </FilesMatch>

    ErrorLog \${APACHE_LOG_DIR}/app.lokal_error.log
    CustomLog \${APACHE_LOG_DIR}/app.lokal_access.log combined
</VirtualHost>
\`\`\`

### B. Konfigurasi di Web Server Nginx
Pada Nginx, FastCGI dikonfigurasi melalui blok \`location ~ \\.php$\`:
\`\`\`nginx
server {
    listen 80;
    server_name app.lokal;
    root /var/www/app.lokal/html;
    index index.php index.html;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \\.php$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\\.ht {
        deny all;
    }
}
\`\`\`

## 6. Akselerasi Performa dengan Zend OPcache & JIT Compiler
Zend OPcache menyimpan hasil kompilasi skrip PHP (*bytecode*) di dalam memori RAM (Shared Memory), meniadakan proses parsing dan kompilasi ulang pada setiap request pengunjung.

Buka konfigurasi OPcache di \`/etc/php/8.2/fpm/conf.d/10-opcache.ini\` atau \`php.ini\`:
\`\`\`ini
[opcache]
opcache.enable = 1
opcache.enable_cli = 0
opcache.memory_consumption = 128
opcache.interned_strings_buffer = 16
opcache.max_accelerated_files = 10000
opcache.validate_timestamps = 0 ; Set 0 untuk produksi (maksimum performa), set 1 untuk development
opcache.revalidate_freq = 60

; Pengaktifan PHP 8+ JIT Compiler (Tracing JIT)
opcache.jit_buffer_size = 64M
opcache.jit = tracing
\`\`\`

## 7. Verifikasi, Uji Sintaks & Troubleshooting
Sebelum me-restart layanan, selalu periksa keabsahan sintaks konfigurasi:

\`\`\`bash
# Validasi sintaks berkas konfigurasi PHP-FPM
sudo php-fpm8.2 -t

# Muat ulang konfigurasi tanpa menghentikan koneksi yang sedang berjalan
sudo systemctl reload php8.2-fpm

# Uji eksekusi PHP melalui CLI
php -r 'echo "PHP Runtime OK. Versi: " . PHP_VERSION . "\\n";'

# Pantau log error PHP-FPM real-time
sudo tail -f /var/log/php8.2-fpm.log
\`\`\`
`
  },
  'php-modern-backend-development': {
    id: 'note-15',
    slug: 'php-modern-backend-development',
    title: 'Pemrograman Backend PHP Modern: PDO Database, REST API & Sanitasi Keamanan',
    category: 'Backend',
    tags: ['php', 'backend', 'pdo', 'mysql', 'mariadb', 'api', 'security', 'crud'],
    summary: 'Panduan arsitektur pengembangan aplikasi PHP modern: fitur PHP 8+, interaksi database MariaDB/MySQL dengan PDO Prepared Statements, pembuatan REST API JSON, autentikasi session aman, dan pencegahan OWASP Top 10.',
    readingTime: 13,
    published: true,
    publishedAt: '2026-09-12',
    createdAt: '2026-09-12',
    updatedAt: '2026-09-12',
    content: `# Pemrograman Backend PHP Modern: PDO Database, REST API & Sanitasi Keamanan

PHP telah berevolusi menjadi bahasa pemrograman backend modern dengan sistem tipe yang kuat (*type-safe*), paradigma berorientasi objek yang matang, serta ekosistem dependensi yang solid.

## 1. Fitur Esensial PHP 8+ Modern
Pengembangan PHP modern mewajibkan penulisan kode yang bersih, terdokumentasi tipe datanya, dan aman sejak baris pertama.

\`\`\`php
<?php
declare(strict_types=1); // Wajibkan validasi tipe data ketat

namespace App\\Models;

class User {
    // Constructor Property Promotion & Type Declarations
    public function __construct(
        public readonly int $id,
        public string $name,
        public string $email,
        public ?string $role = 'member', // Nullable type
        public \\DateTimeImmutable $createdAt = new \\DateTimeImmutable()
    ) {}

    // Match Expression (Pengganti switch-case yang type-safe & mengembalikan nilai)
    public function getPermissionsBadge(): string {
        return match ($this->role) {
            'admin'  => 'badge-danger',
            'editor' => 'badge-warning',
            default  => 'badge-primary',
        };
    }
}
\`\`\`

## 2. Koneksi MariaDB/MySQL Aman Menggunakan PDO (PHP Data Objects)
PDO adalah antarmuka konsisten dan aman untuk berinteraksi dengan database relasional. PDO mendukung **Prepared Statements native**, yang memisahkan instruksi SQL dari data masukan pengguna, secara tuntas mengeliminasi risiko **SQL Injection**.

### Singleton Database Connection Handler:
\`\`\`php
<?php
declare(strict_types=1);

namespace App\\Database;

use PDO;
use PDOException;

class Database {
    private static ?PDO $instance = null;

    public static function getConnection(): PDO {
        if (self::$instance === null) {
            $host    = '127.0.0.1';
            $db      = 'it_hub_db';
            $user    = 'it_user';
            $pass    = 'PasswordKuat123#';
            $port    = 3306;
            $charset = 'utf8mb4';

            $dsn = "mysql:host={$host};port={$port};dbname={$db};charset={$charset}";
            
            $options = [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false, // WAJIB false: gunakan native prepared statement
                PDO::ATTR_TIMEOUT            => 5,
            ];

            try {
                self::$instance = new PDO($dsn, $user, $pass, $options);
            } catch (PDOException $e) {
                // Jangan pernah menampilkan error database sensitif langsung ke layar publik
                error_log("Database Error: " . $e->getMessage());
                http_response_code(500);
                echo json_encode(['error' => 'Koneksi ke basis data bermasalah.']);
                exit;
            }
        }
        return self::$instance;
    }
}
\`\`\`

## 3. Implementasi Operasi CRUD Aman dengan Parameterized Queries

### A. Menyimpan Data (Create):
\`\`\`php
$pdo = Database::getConnection();

$sql = "INSERT INTO users (username, email, role, created_at) VALUES (:username, :email, :role, NOW())";
$stmt = $pdo->prepare($sql);

$stmt->execute([
    ':username' => 'sabbil',
    ':email'    => 'sabbil@example.lokal',
    ':role'     => 'admin',
]);

$newUserId = (int)$pdo->lastInsertId();
\`\`\`

### B. Mengambil Data dengan Paginasi (Read):
\`\`\`php
$page   = max(1, (int)($_GET['page'] ?? 1));
$limit  = 10;
$offset = ($page - 1) * $limit;

$stmt = $pdo->prepare("SELECT id, username, email, role, created_at FROM users ORDER BY id DESC LIMIT :limit OFFSET :offset");
// Ikat parameter integer secara eksplisit untuk LIMIT dan OFFSET
$stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
$stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
$stmt->execute();

$users = $stmt->fetchAll();
\`\`\`

### C. Transaksi Database (Atomic Operation):
\`\`\`php
try {
    $pdo->beginTransaction();

    $stmt1 = $pdo->prepare("UPDATE accounts SET balance = balance - :amount WHERE id = :from_id");
    $stmt1->execute([':amount' => 50000, ':from_id' => 1]);

    $stmt2 = $pdo->prepare("UPDATE accounts SET balance = balance + :amount WHERE id = :to_id");
    $stmt2->execute([':amount' => 50000, ':to_id' => 2]);

    $pdo->commit(); // Eksekusi berhasil, simpan permanen
} catch (\\Throwable $e) {
    $pdo->rollBack(); // Terjadi kegagalan, batalkan seluruh transaksi
    error_log("Transaksi gagal: " . $e->getMessage());
    throw $e;
}
\`\`\`

## 4. Membangun RESTful API Endpoint Standar JSON di PHP
API modern merespons data dalam format JSON murni dengan status code HTTP yang presisi:

\`\`\`php
<?php
declare(strict_types=1);

require_once __DIR__ . '/Database.php';
use App\\Database\\Database;

// Set Header Response JSON & Security Headers
header('Content-Type: application/json; charset=UTF-8');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$pdo = Database::getConnection();

function jsonResponse(int $statusCode, array $data): void {
    http_response_code($statusCode);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}

switch ($method) {
    case 'GET':
        $stmt = $pdo->query("SELECT id, username, email, role, created_at FROM users");
        jsonResponse(200, ['status' => 'success', 'data' => $stmt->fetchAll()]);
        break;

    case 'POST':
        // Baca payload JSON dari body request
        $rawInput = file_get_contents('php://input');
        $body = json_decode($rawInput, true);

        if (!is_array($body) || empty($body['username']) || empty($body['email'])) {
            jsonResponse(400, ['status' => 'error', 'message' => 'Field username dan email wajib diisi.']);
        }

        // Sanitasi dan Validasi Email
        $username = trim((string)$body['username']);
        $email    = filter_var(trim((string)$body['email']), FILTER_VALIDATE_EMAIL);

        if (!$email) {
            jsonResponse(422, ['status' => 'error', 'message' => 'Format email tidak valid.']);
        }

        $stmt = $pdo->prepare("INSERT INTO users (username, email) VALUES (?, ?)");
        $stmt->execute([$username, $email]);

        jsonResponse(201, [
            'status'  => 'created',
            'id'      => (int)$pdo->lastInsertId(),
            'message' => 'User berhasil dibuat.'
        ]);
        break;

    default:
        header('Allow: GET, POST');
        jsonResponse(405, ['status' => 'error', 'message' => "Method {$method} tidak diizinkan."]);
        break;
}
\`\`\`

## 5. Pertahanan Terhadap OWASP Top 10 Security Risks

### A. Pencegahan XSS (Cross-Site Scripting)
Gunakan \`htmlspecialchars\` dengan flag \`ENT_QUOTES | ENT_SUBSTITUTE\` saat menampilkan data input user ke dalam template HTML:
\`\`\`php
function escape(string $value): string {
    return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

// Dalam template:
echo "Halo, " . escape($_GET['name'] ?? 'Tamu');
\`\`\`

### B. Proteksi CSRF (Cross-Site Request Forgery)
Buat token acak yang disimpan di dalam sesi:
\`\`\`php
// Pembuatan Token
if (empty($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}

// Validasi Token saat form di-submit
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $submittedToken = $_POST['csrf_token'] ?? '';
    if (!hash_equals($_SESSION['csrf_token'], $submittedToken)) {
        http_response_code(403);
        die('Validasi CSRF Token Gagal!');
    }
}
\`\`\`

### C. Hashing Kata Sandi Standar Industri (Bcrypt / Argon2id)
Jangan pernah menggunakan \`md5()\` atau \`sha1()\`. Gunakan fungsi bawaan PHP:
\`\`\`php
// Hashing password saat registrasi
$hash = password_hash($plainPassword, PASSWORD_BCRYPT, ['cost' => 12]);

// Verifikasi password saat login
if (password_verify($inputPassword, $hashFromDb)) {
    // Login berhasil
    session_regenerate_id(true); // Cegah session fixation
    $_SESSION['user_id'] = $user['id'];
} else {
    // Password salah
}
\`\`\`

## 6. Autoloading Standar PSR-4 & Composer
Aplikasi PHP modern menggunakan Composer untuk manajemen paket dan pemuatan otomatis (*autoloading*) berkas tanpa perlu menuliskan puluhan \`require\` manual.

File \`composer.json\`:
\`\`\`json
{
  "name": "sabbil/it-hub-backend",
  "description": "Backend API Service for Personal IT Hub",
  "require": {
    "php": ">=8.2"
  },
  "autoload": {
    "psr-4": {
      "App\\\\": "src/"
    }
  }
}
\`\`\`

Jalankan perintah Composer di terminal:
\`\`\`bash
composer install
composer dump-autoload -o
\`\`\`

Cukup muat satu berkas autoloader di titik masuk aplikasi (\`index.php\`):
\`\`\`php
<?php
require_once __DIR__ . '/vendor/autoload.php';

use App\\Database\\Database;
use App\\Models\\User;

$pdo = Database::getConnection();
// Class App\\Models\\User otomatis dimuat oleh autoloader
\`\`\`
`
  }
};

export const allNotesList: FullNote[] = Object.values(allNotesMap);
