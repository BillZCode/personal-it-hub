import React, { useState } from 'react';
import {
  Terminal,
  Network,
  Shield,
  Cloud,
  Code2,
  CheckCircle2,
  Layers,
  Sparkles,
  Server,
  Cpu,
  Lock,
  Globe,
  Database,
  Search,
} from 'lucide-react';
import { cn } from '../../utils';

interface SkillItem {
  name: string;
  level: string;
  detail: string;
  tags?: string[];
}

interface SkillCategory {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  badgeBg: string;
  badgeBorder: string;
  skills: SkillItem[];
}

const skillCategories: SkillCategory[] = [
  {
    id: 'linux',
    title: 'Linux & System Administration',
    subtitle: 'Pengelolaan kernel, distro, layanan background, dan hardening server Linux',
    icon: Terminal,
    accentColor: 'text-emerald-400',
    badgeBg: 'bg-emerald-500/10',
    badgeBorder: 'border-emerald-500/20',
    skills: [
      { name: 'Debian 12 / 13 (Trixie)', level: 'Primary Server OS', detail: 'Distro utama untuk server lab lokal, VirtualHosts Apache, dan MariaDB' },
      { name: 'Arch Linux + Hyprland', level: 'Daily Driver', detail: 'Lingkungan desktop workstation Wayland dengan ricing efisien dan performa tinggi' },
      { name: 'Kali Linux', level: 'Security Tools', detail: 'Pengujian penetrasi, pemindaian port, dan analisis kerentanan keamanan' },
      { name: 'systemd Services', level: 'Init System', detail: 'Pembuatan custom systemd unit, daemon control, logging journalctl, dan autorun' },
      { name: 'SSH & Access Hardening', level: 'Security Hardened', detail: 'Autentikasi public-key ED25519, port alteration, root login restriction, dan fail2ban' },
      { name: 'LAMP / LEMP Stack', level: 'Full Stack Service', detail: 'Konfigurasi Apache2, Nginx reverse proxy, PHP-FPM runtime, dan MariaDB' },
      { name: 'Docker Containers', level: 'Containerization', detail: 'Deployment aplikasi terisolasi, Dockerfile, docker-compose, dan image management' },
      { name: 'Bash & Zsh Scripting', level: 'Automation', detail: 'Pembuatan skrip otomasi backup, maintenance server, dan monitoring log' },
    ],
  },
  {
    id: 'networking',
    title: 'Networking & Telecommunications',
    subtitle: 'Arsitektur jaringan enterprise, routing dinamis, switching, dan protokol internet',
    icon: Network,
    accentColor: 'text-sky-400',
    badgeBg: 'bg-sky-500/10',
    badgeBorder: 'border-sky-500/20',
    skills: [
      { name: 'Cisco IOS & Packet Tracer', level: 'Certified Academy', detail: 'Perancangan simulasi topologi jaringan menengah hingga enterprise' },
      { name: 'Inter-VLAN Routing (802.1Q)', level: 'Layer 3 Switching', detail: 'Segmentasi broadcast domain departemen dengan router-on-a-stick dan trunking' },
      { name: 'Multi-Area OSPF Routing', level: 'Dynamic Routing', detail: 'Protokol routing link-state dengan konvergensi cepat, area border router, dan cost metrics' },
      { name: 'Static Routing & Redundancy', level: 'Routing Tables', detail: 'Konfigurasi next-hop manual, floating static route, dan gateway redundansi' },
      { name: 'Subnetting (CIDR & VLSM)', level: 'IP Planning', detail: 'Perhitungan efisien alokasi subnet IPv4 kelas A, B, C untuk penghematan host' },
      { name: 'NAT & Port Forwarding', level: 'Address Translation', detail: 'Konfigurasi Static NAT, Dynamic NAT, dan PAT (Overload) untuk akses internet publik' },
      { name: 'BIND9 DNS Server', level: 'Domain Resolution', detail: 'Server nama domain otoritatif, forwarder cache, zona forward dan reverse' },
      { name: 'ISC-DHCP Server', level: 'IP Automation', detail: 'Alokasi IP otomatis, leasing time, subnet pool, dan binding alamat MAC tetap' },
    ],
  },
  {
    id: 'cybersecurity',
    title: 'Cybersecurity & Defense',
    subtitle: 'Praktik keamanan endpoint, investigasi digital, kriptografi, dan analisis CTF',
    icon: Shield,
    accentColor: 'text-violet-400',
    badgeBg: 'bg-violet-500/10',
    badgeBorder: 'border-violet-500/20',
    skills: [
      { name: 'Cisco Introduction to Cybersecurity', level: 'Verified Credential', detail: 'Pemahaman ancaman siber, prinsip CIA Triad, malware vectors, dan proteksi dasar' },
      { name: 'Cisco Endpoint Security', level: 'Verified Credential', detail: 'Manajemen integritas endpoint, pencegahan intrusi, antivirus, dan policy audit' },
      { name: 'Cryptography & Ciphers', level: 'Applied Crypto', detail: 'Klasik (Vigenere, Caesar, Playfair) hingga modern (RSA, SHA-256/512, MD5, AES)' },
      { name: 'Digital Forensics Investigation', level: 'CyberLab Suite', detail: 'Analisis file magic bytes, hex inspection, regex string extraction, dan metadata' },
      { name: 'Steganography Analysis', level: 'Data Hiding', detail: 'Ekstraksi hidden payload pada berkas gambar (LSB bitplane) dan audio' },
      { name: 'Reverse Engineering & Binary', level: 'Binary Analysis', detail: 'Pemeriksaan header format ELF/PE, section headers, opcodes, dan checksec mitigations' },
    ],
  },
  {
    id: 'cloud',
    title: 'Cloud Computing & Infrastructure',
    subtitle: 'Perancangan jaringan cloud AWS terisolasi, compute, database, dan proteksi edge',
    icon: Cloud,
    accentColor: 'text-amber-400',
    badgeBg: 'bg-amber-500/10',
    badgeBorder: 'border-amber-500/20',
    skills: [
      { name: 'AWS Virtual Private Cloud (VPC)', level: 'Multi-AZ Design', detail: 'Perancangan isolated network, subnet publik & privat di multi availability zones' },
      { name: 'Amazon EC2 Instances', level: 'Cloud Compute', detail: 'Deployment server virtual Linux (Debian/Ubuntu), key pairs, dan provisioning' },
      { name: 'Amazon RDS MySQL', level: 'Managed Database', detail: 'Database relasional terkelola di private subnet dengan akses terproteksi' },
      { name: 'Amazon S3 Buckets', level: 'Object Storage', detail: 'Penyimpanan berkas statis, bucket policies, dan integrasi aset media terdistribusi' },
      { name: 'Security Groups & NACLs', level: 'Network Firewalls', detail: 'Filtering lalu lintas port masuk (22 SSH, 80 HTTP, 443 HTTPS, 3306 MySQL)' },
      { name: 'Cloudflare Edge CDN & DNS', level: 'Global Edge', detail: 'Optimasi DNS proxy, SSL/TLS 1.3 Full Strict, dan proteksi DDoS gratis' },
    ],
  },
  {
    id: 'webdev',
    title: 'Web Development & Tooling',
    subtitle: 'Pembuatan aplikasi web modern, dashboard telemetri, dan peralatan developer',
    icon: Code2,
    accentColor: 'text-cyan-400',
    badgeBg: 'bg-cyan-500/10',
    badgeBorder: 'border-cyan-500/20',
    skills: [
      { name: 'React 18 & TypeScript', level: 'Core Frontend', detail: 'Pembuatan UI komponen tipe aman, hooks reaktif, state management, dan routing' },
      { name: 'Tailwind CSS & Vanilla CSS', level: 'Styling System', detail: 'Desain antarmuka modern, dark mode ergonomis, glassmorphism, dan fluid layout' },
      { name: 'Node.js & Express REST API', level: 'Backend Core', detail: 'Arsitektur backend modular, JWT authentication, rate limiting, dan CORS handling' },
      { name: 'Python & Automation Scripts', level: 'Scripting & Tools', detail: 'Otomatisasi pengolahan berkas EPUB, web scraper, dan backend microservices Flask' },
      { name: 'Prisma ORM & MariaDB', level: 'Data Persistence', detail: 'Skema pemodelan database relasional, migrasi skema, dan query teroptimasi' },
      { name: 'Interactive Developer Suites', level: 'devkit-cli & CyberLab', detail: 'Kalkulator subnet CIDR, JSON formatters, JWT decoders, dan web probe tools' },
    ],
  },
];

export const SkillsSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredCategories = skillCategories.map((category) => {
    if (activeTab !== 'all' && category.id !== activeTab) {
      return null;
    }

    if (!searchQuery.trim()) {
      return category;
    }

    const q = searchQuery.toLowerCase();
    const matchesCategory = category.title.toLowerCase().includes(q) || category.subtitle.toLowerCase().includes(q);
    const matchingSkills = category.skills.filter(
      (s) => s.name.toLowerCase().includes(q) || s.detail.toLowerCase().includes(q) || s.level.toLowerCase().includes(q)
    );

    if (matchesCategory || matchingSkills.length > 0) {
      return {
        ...category,
        skills: matchingSkills.length > 0 ? matchingSkills : category.skills,
      };
    }

    return null;
  }).filter(Boolean) as SkillCategory[];

  return (
    <section id="skills-section" className="space-y-8" aria-labelledby="skills-heading">
      {/* Section Header Tycami Style */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <span className="text-xs sm:text-sm font-mono text-sky-400 font-semibold tracking-widest">// 02</span>
          <h2 id="skills-heading" className="text-xs sm:text-sm font-mono uppercase tracking-[0.2em] text-white font-bold">
            Technical Skills
          </h2>
        </div>

        {/* Search input for skills */}
        <div className="relative max-w-xs w-full">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari skill (misal: Cisco, OSPF, Debian)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-mono text-white placeholder:text-slate-500 focus:outline-none focus:border-sky-400/50 transition-colors"
          />
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setActiveTab('all')}
          className={cn(
            "px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer",
            activeTab === 'all'
              ? "bg-white text-slate-950 font-bold shadow-md"
              : "bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.08] border border-white/[0.06]"
          )}
        >
          All Categories (5)
        </button>

        {skillCategories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeTab === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={cn(
                "inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer",
                isActive
                  ? "bg-white text-slate-950 font-bold shadow-md"
                  : "bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.08] border border-white/[0.06]"
              )}
            >
              <Icon className={cn("w-3.5 h-3.5", isActive ? "text-slate-900" : cat.accentColor)} />
              <span>{cat.title.split(' ')[0]}</span>
            </button>
          );
        })}
      </div>

      {/* Grouped Skills Display */}
      <div className="space-y-6">
        {filteredCategories.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-[#0d121f] border border-white/10 text-slate-400 text-xs font-mono">
            Tidak ada keahlian yang cocok dengan pencarian "{searchQuery}".
          </div>
        ) : (
          filteredCategories.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.id}
                className="p-6 sm:p-7 rounded-2xl bg-[#0d121f] border border-white/10 hover:border-white/20 transition-all duration-300 space-y-5"
              >
                {/* Category Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/[0.06]">
                  <div className="flex items-center gap-3">
                    <div className={cn("p-2.5 rounded-xl border", cat.badgeBg, cat.badgeBorder, cat.accentColor)}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                        {cat.title}
                      </h3>
                      <p className="text-xs text-slate-400 font-sans mt-0.5">
                        {cat.subtitle}
                      </p>
                    </div>
                  </div>

                  <span className="text-2xs font-mono text-slate-500">
                    {cat.skills.length} Competencies
                  </span>
                </div>

                {/* Skills Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                  {cat.skills.map((skill) => (
                    <div
                      key={skill.name}
                      className="p-3.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.05] hover:border-white/15 transition-all group flex flex-col justify-between space-y-2"
                    >
                      <div className="space-y-1">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-xs font-bold text-white tracking-tight group-hover:text-white transition-colors">
                            {skill.name}
                          </h4>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-relaxed font-sans line-clamp-3">
                          {skill.detail}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-white/[0.04] flex items-center justify-between">
                        <span className={cn("text-[10px] font-mono font-medium px-2 py-0.5 rounded-md border", cat.badgeBg, cat.badgeBorder, cat.accentColor)}>
                          {skill.level}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
};
