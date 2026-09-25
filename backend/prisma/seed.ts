import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const passwordHash = await bcrypt.hash('password123', 12);
  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      passwordHash,
      name: 'Admin User',
      role: 'ADMIN',
    },
  });
  console.log('✅ Admin user created');

  // Create sample projects
  const projects = [
    {
      title: 'Server Monitoring Dashboard',
      slug: 'server-monitoring',
      description: 'Real-time server monitoring with metrics collection, alerting, and visualization.',
      content: '# Server Monitoring Dashboard\n\nA comprehensive monitoring solution built with Node.js, React, and InfluxDB.',
      technologies: ['Node.js', 'React', 'TypeScript', 'WebSocket', 'InfluxDB', 'Grafana'],
      demoUrl: 'https://demo.example.com',
      repoUrl: 'https://github.com/user/server-monitor',
      status: 'COMPLETED',
      featured: true,
      startDate: new Date('2026-01-15'),
      endDate: new Date('2026-03-20'),
    },
    {
      title: 'Network Tools Suite',
      slug: 'network-tools',
      description: 'Collection of network diagnostic tools including ping, traceroute, DNS lookup, and subnet calculator.',
      content: '# Network Tools Suite\n\nA suite of network diagnostic tools for system administrators.',
      technologies: ['Go', 'React', 'TypeScript', 'WebSocket'],
      demoUrl: 'https://tools.example.com',
      repoUrl: 'https://github.com/user/net-tools',
      status: 'COMPLETED',
      featured: true,
      startDate: new Date('2026-02-01'),
      endDate: new Date('2026-04-10'),
    },
    {
      title: 'Personal Portfolio Website',
      slug: 'portfolio-website',
      description: 'Modern, responsive portfolio with dark mode, blog, and project showcase.',
      content: '# Portfolio Website\n\nBuilt with React, TypeScript, Vite, and Tailwind CSS.',
      technologies: ['React', 'TypeScript', 'Vite', 'Tailwind CSS'],
      demoUrl: 'https://portfolio.example.com',
      repoUrl: 'https://github.com/user/portfolio',
      status: 'COMPLETED',
      featured: true,
      startDate: new Date('2025-11-01'),
      endDate: new Date('2026-01-15'),
    },
    {
      title: 'Linux Server Hardening',
      slug: 'linux-hardening',
      description: 'Automated hardening scripts and Ansible playbooks for securing Linux servers.',
      content: '# Linux Server Hardening\n\nSecurity hardening automation for Linux servers.',
      technologies: ['Ansible', 'Bash', 'Linux', 'SSH', 'Fail2Ban', 'UFW'],
      repoUrl: 'https://github.com/user/linux-hardening',
      status: 'COMPLETED',
      featured: false,
      startDate: new Date('2026-03-01'),
      endDate: new Date('2026-05-01'),
    },
    {
      title: 'File Downloader Service',
      slug: 'file-downloader',
      description: 'Multi-threaded download manager with resume support, queue management, and web UI.',
      content: '# File Downloader Service\n\nA download manager with web interface.',
      technologies: ['Python', 'FastAPI', 'React', 'Redis', 'Celery'],
      repoUrl: 'https://github.com/user/downloader',
      status: 'IN_PROGRESS',
      featured: false,
      startDate: new Date('2026-06-01'),
    },
  ];

  for (const project of projects) {
    await prisma.project.upsert({
      where: { slug: project.slug },
      update: {},
      create: project,
    });
  }
  console.log('✅ Projects created');

  // Create sample certificates
  const certificates = [
    { name: 'AWS Certified Solutions Architect - Associate', provider: 'Amazon Web Services', issueDate: new Date('2026-03-15'), expiryDate: new Date('2029-03-15'), credentialId: 'AWS-SAA-123456', verificationUrl: 'https://aws.amazon.com/verification' },
    { name: 'CKA: Certified Kubernetes Administrator', provider: 'Linux Foundation', issueDate: new Date('2026-01-20'), expiryDate: new Date('2029-01-20'), credentialId: 'CKA-789012', verificationUrl: 'https://www.credly.com/badges/cka' },
    { name: 'CCNA: Cisco Certified Network Associate', provider: 'Cisco', issueDate: new Date('2025-11-10'), expiryDate: new Date('2028-11-10'), credentialId: 'CCNA-345678', verificationUrl: 'https://www.cisco.com/verification' },
    { name: 'LPIC-2: Linux Professional Institute Certification Level 2', provider: 'LPI', issueDate: new Date('2025-08-05'), credentialId: 'LPIC2-901234', verificationUrl: 'https://www.lpi.org/verify' },
    { name: 'HashiCorp Certified: Terraform Associate', provider: 'HashiCorp', issueDate: new Date('2026-05-01'), expiryDate: new Date('2028-05-01'), credentialId: 'TF-ASSOC-567890', verificationUrl: 'https://www.hashicorp.com/certification' },
  ];

  for (const cert of certificates) {
    await prisma.certificate.upsert({
      where: { id: 'temp' },
      update: {},
      create: cert,
    });
  }
  console.log('✅ Certificates created');

  // Create sample technical notes
  const notes = [
    { title: 'Installing SSH on Debian', slug: 'installing-ssh-debian', category: 'Linux', tags: ['debian', 'ssh', 'security'], summary: 'Step-by-step guide to install and configure OpenSSH server on Debian.', content: '# Installing SSH on Debian\n\n## Installation\n```bash\nsudo apt update\nsudo apt install openssh-server\n```', readingTime: 5, published: true, publishedAt: new Date('2026-09-01') },
    { title: 'DHCP Server Configuration', slug: 'dhcp-server-configuration', category: 'Networking', tags: ['dhcp', 'isc-dhcp', 'network'], summary: 'Complete guide to setting up ISC DHCP server with multiple scopes and failover.', content: '# DHCP Server Configuration\n\n## Installation\n```bash\nsudo apt update\nsudo apt install isc-dhcp-server\n```', readingTime: 8, published: true, publishedAt: new Date('2026-08-28') },
    { title: 'DNS Server Configuration', slug: 'dns-server-configuration', category: 'Networking', tags: ['bind9', 'dns', 'zone'], summary: 'Configure BIND9 as authoritative and recursive DNS server with DNSSEC.', content: '# DNS Server Configuration\n\n## BIND9 Setup\n```bash\nsudo apt install bind9\n```', readingTime: 10, published: true, publishedAt: new Date('2026-08-25') },
    { title: 'VLAN Configuration', slug: 'vlan-configuration', category: 'Networking', tags: ['vlan', 'cisco', 'trunk'], summary: 'Configure VLANs, trunk ports, and inter-VLAN routing on Cisco switches.', content: '# VLAN Configuration\n\n## Basic VLAN Setup\n```cisco\nvlan 10\n name Management\nvlan 20\n name Servers\n```', readingTime: 7, published: true, publishedAt: new Date('2026-08-20') },
    { title: 'OSPF Basic Configuration', slug: 'ospf-basic-configuration', category: 'Networking', tags: ['ospf', 'routing', 'cisco'], summary: 'Basic OSPF configuration including areas, authentication, and route redistribution.', content: '# OSPF Basic Configuration\n\n## OSPF Process\n```cisco\nrouter ospf 1\n network 10.0.0.0 0.255.255.255 area 0\n```', readingTime: 12, published: true, publishedAt: new Date('2026-08-15') },
    { title: 'Static Routing', slug: 'static-routing', category: 'Networking', tags: ['routing', 'static', 'gateway'], summary: 'Understanding and implementing static routes for simple network topologies.', content: '# Static Routing\n\n## Adding Static Routes\n```cisco\nip route 192.168.2.0 255.255.255.0 10.0.0.2\n```', readingTime: 6, published: true, publishedAt: new Date('2026-08-10') },
    { title: 'Linux systemd Basics', slug: 'linux-systemd-basics', category: 'Linux', tags: ['systemd', 'service', 'unit'], summary: 'Introduction to systemd: units, targets, journalctl, and service management.', content: '# Linux systemd Basics\n\n## Service Management\n```bash\nsystemctl start nginx\nsystemctl enable nginx\n```', readingTime: 9, published: true, publishedAt: new Date('2026-08-05') },
    { title: 'AWS VPC Fundamentals', slug: 'aws-vpc-fundamentals', category: 'Cloud', tags: ['aws', 'vpc', 'networking'], summary: 'Core concepts of AWS VPC: subnets, route tables, IGW, NAT, and security groups.', content: '# AWS VPC Fundamentals\n\n## VPC Components\n- Subnets\n- Route Tables\n- Internet Gateway\n- NAT Gateway\n- Security Groups', readingTime: 15, published: true, publishedAt: new Date('2026-07-28') },
    { title: 'AWS EC2', slug: 'aws-ec2', category: 'Cloud', tags: ['aws', 'ec2', 'compute'], summary: 'Comprehensive guide to EC2 instances, AMIs, storage, and lifecycle management.', content: '# AWS EC2 Guide\n\n## Instance Types\n- General Purpose\n- Compute Optimized\n- Memory Optimized\n- Storage Optimized', readingTime: 11, published: true, publishedAt: new Date('2026-07-20') },
    { title: 'AWS Security Groups', slug: 'aws-security-groups', category: 'Cloud', tags: ['aws', 'security', 'firewall'], summary: 'Deep dive into Security Groups: rules, references, and best practices.', content: '# AWS Security Groups\n\n## Security Group Rules\n- Inbound Rules\n- Outbound Rules\n- Rule References', readingTime: 8, published: true, publishedAt: new Date('2026-07-15') },
    { title: 'Konfigurasi Web Server Apache2 & Virtual Host di Debian', slug: 'web-server-apache-debian', category: 'Server', tags: ['web-server', 'apache', 'debian', 'http', 'linux', 'sysadmin'], summary: 'Panduan komprehensif instalasi Web Server Apache2 di Debian, konfigurasi Virtual Host multi-domain, optimasi modul, dan pengamanan HTTPS.', content: '# Konfigurasi Web Server Apache2 & Virtual Host di Debian\n\nPanduan komprehensif instalasi Web Server Apache2 di Debian, konfigurasi Virtual Host multi-domain, optimasi modul, dan pengamanan HTTPS.', readingTime: 8, published: true, publishedAt: new Date('2026-09-08') },
    { title: 'Instalasi, Hardening Keamanan & Manajemen SQL MariaDB di Linux', slug: 'mariadb-database-configuration', category: 'Database', tags: ['database', 'mariadb', 'mysql', 'sql', 'linux', 'sysadmin'], summary: 'Tutorial lengkap instalasi RDBMS MariaDB Server, pengamanan mariadb-secure-installation, pembuatan database, user hak akses, backup mysqldump, dan optimasi query SQL.', content: '# Instalasi, Hardening Keamanan & Manajemen SQL MariaDB di Linux\n\nTutorial lengkap instalasi RDBMS MariaDB Server, pengamanan mariadb-secure-installation, pembuatan database, user hak akses, backup mysqldump, dan optimasi query SQL.', readingTime: 9, published: true, publishedAt: new Date('2026-09-09') },
    { title: 'Arsitektur Web Server Dinamis: Integrasi BIND9 DNS, Apache & Database MariaDB', slug: 'integrated-dynamic-web-server', category: 'Architecture', tags: ['web-server', 'apache', 'bind9', 'dns', 'mariadb', 'sql', 'php', 'lamp', 'sysadmin'], summary: 'Implementasi menyeluruh sistem web server dinamis (LAMP Stack) yang terintegrasi dengan Name Server BIND9 lokal dan basis data SQL MariaDB.', content: '# Arsitektur Web Server Dinamis: Integrasi BIND9 DNS, Apache & Database MariaDB\n\nImplementasi menyeluruh sistem web server dinamis (LAMP Stack) yang terintegrasi dengan Name Server BIND9 lokal dan basis data SQL MariaDB.', readingTime: 12, published: true, publishedAt: new Date('2026-09-10') },
    { title: 'Konfigurasi Runtime PHP, PHP-FPM, Ekstensi & Hardening Keamanan di Linux', slug: 'php-runtime-fpm-configuration', category: 'Server', tags: ['php', 'php-fpm', 'backend', 'linux', 'apache', 'nginx', 'sysadmin', 'performance'], summary: 'Panduan komprehensif instalasi multi-version PHP 8.x, tuning pool worker PHP-FPM, integrasi FastCGI di Apache & Nginx, akselerasi OPcache, dan hardening keamanan php.ini untuk server produksi.', content: '# Konfigurasi Runtime PHP, PHP-FPM, Ekstensi & Hardening Keamanan di Linux\n\nPanduan komprehensif instalasi multi-version PHP 8.x, tuning pool worker PHP-FPM, integrasi FastCGI di Apache & Nginx, akselerasi OPcache, dan hardening keamanan php.ini untuk server produksi.', readingTime: 11, published: true, publishedAt: new Date('2026-09-12') },
    { title: 'Pemrograman Backend PHP Modern: PDO Database, REST API & Sanitasi Keamanan', slug: 'php-modern-backend-development', category: 'Backend', tags: ['php', 'backend', 'pdo', 'mysql', 'mariadb', 'api', 'security', 'crud'], summary: 'Panduan arsitektur pengembangan aplikasi PHP modern: fitur PHP 8+, interaksi database MariaDB/MySQL dengan PDO Prepared Statements, pembuatan REST API JSON, autentikasi session aman, dan pencegahan OWASP Top 10.', content: '# Pemrograman Backend PHP Modern: PDO Database, REST API & Sanitasi Keamanan\n\nPanduan arsitektur pengembangan aplikasi PHP modern: fitur PHP 8+, interaksi database MariaDB/MySQL dengan PDO Prepared Statements, pembuatan REST API JSON, autentikasi session aman, dan pencegahan OWASP Top 10.', readingTime: 13, published: true, publishedAt: new Date('2026-09-12') },
  ];

  for (const note of notes) {
    await prisma.technicalNote.upsert({
      where: { slug: note.slug },
      update: {},
      create: note,
    });
  }
  console.log('✅ Technical notes created');

  // Create sample changelog
  const changelog = [
    { version: 'v2.4.0', date: new Date('2026-09-09'), added: ['Server monitoring dashboard', 'Network tools suite', 'Guestbook spam protection', 'Dark mode toggle'], changed: ['Improved dashboard layout', 'Updated navigation structure'], fixed: ['Mobile sidebar toggle', 'Chart rendering on Safari'], improved: ['Performance optimization', 'Accessibility improvements', 'TypeScript strict mode'] },
    { version: 'v2.3.0', date: new Date('2026-08-15'), added: ['File downloader tool', 'Base64 encoder/decoder', 'Hash generator', 'JSON formatter'], changed: ['Refactored tools page', 'Updated dependencies'], fixed: ['Timestamp converter edge cases', 'QR code generation'], improved: ['Bundle size reduction', 'Build performance'] },
    { version: 'v2.2.0', date: new Date('2026-07-20'), added: ['Technical notes section', 'Markdown rendering', 'Syntax highlighting', 'Table of contents'], changed: ['Redesigned notes page', 'Category filtering'], fixed: ['Code block copy button', 'Reading time calculation'], improved: ['SEO meta tags', 'Search functionality'] },
    { version: 'v2.1.0', date: new Date('2026-06-10'), added: ['Projects showcase', 'Certificates page', 'Gallery with lightbox', 'Contact form'], changed: ['New design system', 'Tailwind CSS v3.4'], fixed: ['Image lazy loading', 'Modal focus trap'], improved: ['Responsive breakpoints', 'Animation performance'] },
    { version: 'v2.0.0', date: new Date('2026-05-01'), added: ['Complete rewrite with React 18', 'TypeScript strict mode', 'Vite 5', 'TanStack Query'], changed: ['New routing structure', 'State management with Zustand'], fixed: ['Hydration mismatches', 'SSR compatibility'], improved: ['Developer experience', 'Build times', 'Bundle analysis'] },
    { version: 'v1.5.0', date: new Date('2026-03-15'), added: ['Admin panel', 'JWT authentication', 'Project CRUD', 'Notes management'], changed: ['Protected routes', 'Role-based access'], fixed: ['Token refresh logic', 'Form validation'], improved: ['Security headers', 'Rate limiting'] },
    { version: 'v1.4.0', date: new Date('2026-02-01'), added: ['Network tools (DNS, WHOIS, Ping)', 'IP calculator', 'Subnet calculator'], changed: ['Backend API structure', 'Database schema'], fixed: ['CORS configuration', 'API error handling'], improved: ['API response times', 'Input validation'] },
    { version: 'v1.3.0', date: new Date('2026-01-10'), added: ['System status page', 'Server metrics', 'Statistics dashboard', 'Chart.js integration'], changed: ['Real-time data polling', 'WebSocket preparation'], fixed: ['Memory leaks in charts', 'Timezone handling'], improved: ['Data visualization', 'Export functionality'] },
    { version: 'v1.2.0', date: new Date('2025-12-01'), added: ['Guestbook', 'Personal section', 'Linux setup page', 'Search across content'], changed: ['Content structure', 'Navigation groups'], fixed: ['Mobile menu', 'Scroll restoration'], improved: ['Content editing workflow', 'Image optimization'] },
    { version: 'v1.1.0', date: new Date('2025-11-01'), added: ['About page', 'Skills matrix', 'Technology stack', 'Learning goals'], changed: ['Profile layout', 'Social links'], fixed: ['Avatar generation', 'Contact form'], improved: ['Accessibility', 'Color contrast'] },
  ];

  for (const entry of changelog) {
    await prisma.changelogEntry.upsert({
      where: { version: entry.version },
      update: {},
      create: entry,
    });
  }
  console.log('✅ Changelog entries created');

  // Create sample gallery items
  const gallery = [
    { title: 'Server Rack', description: 'Homelab server rack setup', category: 'Homelab', imageUrl: 'https://picsum.photos/seed/server-rack/800/600', thumbnailUrl: 'https://picsum.photos/seed/server-rack/400/300', tags: ['rack', 'server', 'homelab'] },
    { title: 'Network Diagram', description: 'Home network topology', category: 'Networking', imageUrl: 'https://picsum.photos/seed/network-diagram/800/600', thumbnailUrl: 'https://picsum.photos/seed/network-diagram/400/300', tags: ['network', 'diagram', 'topology'] },
    { title: 'Terminal Setup', description: 'Kitty + Zsh + Neovim', category: 'Linux', imageUrl: 'https://picsum.photos/seed/terminal/800/600', thumbnailUrl: 'https://picsum.photos/seed/terminal/400/300', tags: ['terminal', 'linux', 'dotfiles'] },
    { title: 'Dashboard Preview', description: 'Monitoring dashboard', category: 'Projects', imageUrl: 'https://picsum.photos/seed/dashboard/800/600', thumbnailUrl: 'https://picsum.photos/seed/dashboard/400/300', tags: ['dashboard', 'monitoring', 'grafana'] },
    { title: 'Cable Management', description: 'Clean cable routing', category: 'Homelab', imageUrl: 'https://picsum.photos/seed/cable-mgmt/800/600', thumbnailUrl: 'https://picsum.photos/seed/cable-mgmt/400/300', tags: ['cable', 'management', 'clean'] },
    { title: 'VLAN Config', description: 'Switch VLAN configuration', category: 'Networking', imageUrl: 'https://picsum.photos/seed/vlan/800/600', thumbnailUrl: 'https://picsum.photos/seed/vlan/400/300', tags: ['vlan', 'cisco', 'config'] },
    { title: 'Code Editor', description: 'Neovim configuration', category: 'Screenshots', imageUrl: 'https://picsum.photos/seed/editor/800/600', thumbnailUrl: 'https://picsum.photos/seed/editor/400/300', tags: ['nvim', 'editor', 'coding'] },
    { title: 'Monitoring Stack', description: 'Prometheus + Grafana', category: 'Projects', imageUrl: 'https://picsum.photos/seed/monitoring/800/600', thumbnailUrl: 'https://picsum.photos/seed/monitoring/400/300', tags: ['prometheus', 'grafana', 'monitoring'] },
  ];

  for (const item of gallery) {
    await prisma.galleryItem.upsert({
      where: { id: 'temp' },
      update: {},
      create: item,
    });
  }
  console.log('✅ Gallery items created');

  // Create sample guestbook entries
  const guestbook = [
    { name: 'Alice Chen', message: 'Great portfolio! The network tools are super useful.', ipHash: 'abc123def', approved: true },
    { name: 'Bob Smith', message: 'Love the dark theme and terminal aesthetic. Keep it up!', ipHash: 'def456ghi', approved: true },
    { name: 'Carol Davis', message: 'The DHCP configuration guide helped me a lot. Thanks!', ipHash: 'ghi789jkl', approved: true },
    { name: 'David Wilson', message: 'Impressive homelab setup. What switch are you using?', ipHash: 'jkl012mno', approved: true },
    { name: 'Eva Martinez', message: 'Your Linux notes are gold. Bookmarked for future reference.', ipHash: 'mno345pqr', approved: true },
  ];

  for (const entry of guestbook) {
    await prisma.guestbookEntry.upsert({
      where: { id: 'temp' },
      update: {},
      create: entry,
    });
  }
  console.log('✅ Guestbook entries created');

  // Create sample personal media
  const media = [
    { type: 'GAME', title: 'Cyberpunk 2077', platform: 'PC (Steam)', status: 'playing', progress: 67, rating: 4.5, coverUrl: 'https://picsum.photos/seed/cyberpunk/300/400' },
    { type: 'GAME', title: 'Elden Ring', platform: 'PC (Steam)', status: 'completed', progress: 100, rating: 5, coverUrl: 'https://picsum.photos/seed/eldenring/300/400' },
    { type: 'GAME', title: "Baldur's Gate 3", platform: 'PC (Steam)', status: 'planned', progress: 0, coverUrl: 'https://picsum.photos/seed/bg3/300/400' },
    { type: 'MUSIC', title: 'Midnight City', artist: 'M83', album: 'Hurry Up, We\'re Dreaming', status: 'now_playing', coverUrl: 'https://picsum.photos/seed/m83/300/300' },
    { type: 'MUSIC', title: 'Blinding Lights', artist: 'The Weeknd', album: 'After Hours', status: 'recent', coverUrl: 'https://picsum.photos/seed/weeknd/300/300' },
    { type: 'ANIME', title: 'Cyberpunk: Edgerunners', status: 'completed', rating: 5, progress: 10, coverUrl: 'https://picsum.photos/seed/edgerunners/300/400' },
    { type: 'ANIME', title: 'Ghost in the Shell: SAC_2045', status: 'watching', rating: 4, progress: 12, coverUrl: 'https://picsum.photos/seed/gits/300/400' },
    { type: 'MOVIE', title: 'The Matrix Resurrections', status: 'completed', rating: 3.5, progress: 1, coverUrl: 'https://picsum.photos/seed/matrix/300/400' },
    { type: 'MOVIE', title: 'Blade Runner 2049', status: 'planned', coverUrl: 'https://picsum.photos/seed/bladerunner/300/400' },
  ];

  for (const item of media) {
    await prisma.personalMedia.upsert({
      where: { id: 'temp' },
      update: {},
      create: item,
    });
  }
  console.log('✅ Personal media created');

  // Create Linux setup
  await prisma.linuxSetup.upsert({
    where: { id: 'temp' },
    update: {},
    create: {
      distribution: 'Arch Linux',
      windowManager: 'Hyprland',
      terminal: 'Kitty',
      shell: 'Zsh',
      editor: 'Neovim',
      tools: ['btop', 'fzf', 'ripgrep', 'fd', 'eza', 'zoxide', 'lazygit', 'docker', 'kubectl', 'terraform', 'ansible'],
      hardware: { cpu: 'AMD Ryzen 9 7950X', ram: '64GB DDR5-6000', gpu: 'RTX 4090', storage: ['2TB NVMe', '4TB NVMe', '8TB HDD'] },
      dotfilesUrl: 'https://github.com/user/dotfiles',
    },
  });
  console.log('✅ Linux setup created');

  console.log('🎉 Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });