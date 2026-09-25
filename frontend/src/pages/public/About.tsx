import { useEffect } from 'react';
import { Card } from '../../components/ui';
import { User, Code2, Globe, Server, Terminal, Cpu, Gamepad2, BookOpen, Users, GitBranch, Sparkles } from 'lucide-react';
import { animate, stagger } from 'animejs';
import { cn } from '../../utils';

const skills = [
  { category: 'Networking', items: ['Cisco Packet Tracer', 'Inter-VLAN Routing', 'Multi-Area OSPF', 'Static Routing', 'NAT', 'DHCP Server', 'BIND9 DNS', 'Subnetting'], icon: Globe },
  { category: 'Linux & Sysadmin', items: ['Debian', 'Arch Linux', 'Kali Linux', 'KDE Plasma', 'Hyprland', 'systemd', 'SSH/FTP Hardening', 'LAMP / LEMP Stack'], icon: Terminal },
  { category: 'Development & Automation', items: ['Python', 'Automation Scripts', 'Web Scraping', 'EPUB Processing', 'Flask Backend', 'React', 'TypeScript', 'Node.js'], icon: Code2 },
  { category: 'Container & Server', items: ['Docker', 'Apache', 'Nginx', 'MariaDB', 'MySQL', 'Local Server Lab', 'Security Hardening', 'Git Version Control'], icon: Server },
  { category: 'Hardware & Rig', items: ['PC Building', 'AIO & Airflow Cooling', 'CPU & GPU Architecture', 'NVMe SSD', 'Diagnostics & Troubleshooting'], icon: Cpu },
  { category: 'DevOps & Git', items: ['Git', 'GitHub', 'CI/CD Pipelines', 'Linux Shell Scripting', 'Bash', 'Zsh', 'Vim / Neovim'], icon: GitBranch },
];

const technologies = [
  'Debian', 'Arch Linux', 'Kali Linux', 'Cisco', 'Docker', 'Python', 'Flask', 'MariaDB', 'MySQL', 'Apache', 'Nginx', 'BIND9', 'ISC-DHCP',
  'Git', 'GitHub', 'Bash', 'React', 'TypeScript', 'Node.js', 'KDE Plasma'
];

const interestsDetailed = [
  {
    title: 'Hardware PC & Teknologi',
    desc: 'Mengikuti perkembangan komponen komputer, mulai dari perakitan sistem, manajemen pendinginan (AIO & airflow), hingga evaluasi performa arsitektur CPU dan GPU.',
    icon: Cpu,
  },
  {
    title: 'Media Interaktif & Game',
    desc: 'Aktif mengikuti perkembangan dan memainkan game taktis serta bertema anime, seperti Strinova, Arknights / Endfield, Honkai: Star Rail, Wuthering Waves, hingga RPG populer lainnya.',
    icon: Gamepad2,
  },
  {
    title: 'Media Kreatif & Hiburan',
    desc: 'Menggemari karya sastra visual seperti light novel, manga, dan komik dengan fokus pada alur cerita romansa, serta menikmati produksi media kreatif digital.',
    icon: BookOpen,
  },
  {
    title: 'Kreativitas & Kolaborasi',
    desc: 'Aktif berpartisipasi dalam berbagai proyek kelompok sekolah, mulai dari penyusunan proposal kegiatan teknis, kolaborasi pertunjukan seni, hingga produksi konten media interaktif.',
    icon: Users,
  },
];

export function About() {
  // Staggered Anime.js entrance animations
  useEffect(() => {
    animate('.about-anim-card', {
      opacity: [0, 1],
      translateY: [16, 0],
      delay: stagger(40, { start: 60 }),
      duration: 400,
      ease: 'outCubic',
    });

    animate('.about-tech-chip', {
      opacity: [0, 1],
      scale: [0.9, 1],
      delay: stagger(20, { start: 150 }),
      duration: 350,
      ease: 'outBack',
    });
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in pb-16">
      {/* Header with Cyberpunk Status Tag */}
      <div className="space-y-1 border-b border-dark-800/80 pb-6">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-2xs font-mono font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 shadow-[0_0_10px_rgba(52,211,153,0.15)]">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            BIOGRAFI & PROFIL
          </span>
          <span className="text-2xs font-mono text-dark-500">SABBIL / SMKN 1 DENPASAR / TKJ</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-dark-100 tracking-tight font-sans">
          About Me
        </h1>
        <p className="text-sm text-dark-400 max-w-2xl leading-relaxed">
          Mengenal lebih dekat sosok di balik terminal: latar belakang pendidikan, spesialisasi teknis, dan portofolio keahlian.
        </p>
      </div>

      {/* Profil & Biografi Utama (Concentric Cyber Glassmorphic Card) */}
      <section>
        <div className="rounded-2xl bg-dark-900/40 p-1.5 border border-dark-800/80 shadow-2xl hover:border-emerald-500/30 transition-all duration-300">
          <div className="rounded-xl bg-dark-950/80 p-6 sm:p-8 border border-dark-800/60 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-dark-800">
              <div className="flex items-center gap-4">
                <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/25 rounded-2xl text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                  <User className="h-8 w-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-dark-100 tracking-tight flex items-center gap-2">
                    <span>Sabbil Abdillah Ferdyansyah</span>
                  </h2>
                  <p className="text-xs font-mono text-emerald-400 mt-0.5">SMKN 1 Denpasar • Teknik Komputer dan Jaringan (TKJ)</p>
                </div>
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-dark-900 border border-dark-750 text-2xs font-mono text-dark-300 shadow-inner">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>DENPASAR, BALI</span>
              </div>
            </div>

            <div className="space-y-6 text-dark-300 leading-relaxed text-sm sm:text-base">
              <p className="text-base sm:text-lg text-dark-200 font-medium leading-relaxed">
                Sabbil Abdillah Ferdyansyah adalah seorang pelajar dan praktisi muda di bidang teknologi informasi asal Denpasar, Bali. Saat ini, ia menempuh pendidikan di <span className="text-emerald-400 font-semibold">SMKN 1 Denpasar</span> pada jurusan <span className="text-emerald-400 font-semibold">Teknik Komputer dan Jaringan (TKJ)</span>.
              </p>

              <div className="bg-dark-900/60 p-5 rounded-xl border border-dark-800/90 space-y-4 hover:border-dark-700 transition-colors">
                <h3 className="text-base font-semibold text-dark-100 flex items-center gap-2 font-mono">
                  <Globe className="h-5 w-5 text-emerald-400" />
                  Pendidikan dan Keahlian Teknis
                </h3>
                <p className="text-sm sm:text-base text-dark-300">
                  Sabbil memiliki ketertarikan mendalam pada infrastruktur jaringan, administrasi sistem, dan pengembangan perangkat lunak. Dalam bidang jaringan, ia terbiasa merancang serta mengonfigurasi topologi kompleks menggunakan Cisco Packet Tracer, mencakup pengolahan inter-VLAN routing, multi-area OSPF, static routing, NAT, DHCP, hingga DNS server.
                </p>
                <p className="text-sm sm:text-base text-dark-300">
                  Di lini administrasi sistem, Sabbil aktif mengoperasikan berbagai distribusi Linux seperti Debian, Arch Linux (dengan pemanfaatan Hyprland), Kali Linux, serta KDE Plasma. Ia berpengalaman dalam mengelola lingkungan server lokal menggunakan skema LAMP/LEMP stack (Apache, MariaDB, PHP), BIND9 DNS, layanan SSH/FTP, serta kontainerisasi menggunakan Docker. Selain itu, ia juga mampu mengadaptasikan bahasa pemrograman Python untuk kebutuhan otomatisasi, web scraping, pemrosesan berkas EPUB, hingga pembuatan backend aplikasi web sederhana berbasis Flask.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Minat dan Aktivitas */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 border-b border-dark-800/80 pb-3">
          <Code2 className="h-5 w-5 text-emerald-400" />
          <h2 className="text-lg font-bold font-mono text-dark-100 uppercase tracking-wide">
            Minat dan Aktivitas
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {interestsDetailed.map((item) => (
            <div
              key={item.title}
              className="about-anim-card group p-5 rounded-xl bg-dark-900/40 border border-dark-800 hover:border-emerald-500/40 hover:bg-dark-900/70 hover:translate-y-[-2px] transition-all duration-200 flex gap-4 shadow-sm hover:shadow-[0_8px_20px_-6px_rgba(16,185,129,0.12)]"
            >
              <div className="p-3 bg-dark-850 border border-dark-750 rounded-xl text-emerald-400 h-fit flex-shrink-0 group-hover:scale-110 group-hover:border-emerald-500/30 transition-all">
                <item.icon className="h-6 w-6" />
              </div>
              <div className="space-y-1.5 min-w-0">
                <h3 className="font-semibold text-dark-100 text-sm sm:text-base group-hover:text-emerald-300 transition-colors">
                  {item.title}
                </h3>
                <p className="text-dark-400 text-xs sm:text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Keahlian & Bidang Kompetensi */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 border-b border-dark-800/80 pb-3">
          <Server className="h-5 w-5 text-emerald-400" />
          <h2 className="text-lg font-bold font-mono text-dark-100 uppercase tracking-wide">
            Keahlian & Bidang Kompetensi
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {skills.map((skill) => (
            <div
              key={skill.category}
              className="about-anim-card p-4 rounded-xl bg-dark-900/40 border border-dark-800 hover:border-emerald-500/30 hover:bg-dark-900/70 transition-all space-y-3 shadow-sm"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-dark-850 border border-dark-750 text-emerald-400">
                  <skill.icon className="h-4 w-4" />
                </div>
                <h3 className="font-mono text-xs font-bold text-dark-100 uppercase tracking-wider">
                  {skill.category}
                </h3>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {skill.items.map((item) => (
                  <span
                    key={item}
                    className="text-2xs font-mono px-2 py-1 rounded-md bg-dark-850 text-dark-300 border border-dark-750/80 hover:text-emerald-300 hover:border-emerald-500/30 transition-colors"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Teknologi & Tools yang Dikuasai */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 border-b border-dark-800/80 pb-3">
          <Sparkles className="h-5 w-5 text-emerald-400" />
          <h2 className="text-lg font-bold font-mono text-dark-100 uppercase tracking-wide">
            Teknologi & Tools yang Dikuasai
          </h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {technologies.map((tech) => (
            <span
              key={tech}
              className="about-tech-chip text-xs font-mono px-3.5 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium hover:border-emerald-500/50 hover:bg-emerald-500/20 hover:scale-105 active:scale-95 transition-all shadow-sm cursor-default"
            >
              {tech}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}

export default About;