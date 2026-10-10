import React, { useState } from 'react';
import {
  ExternalLink,
  Github,
  FolderKanban,
  Layers,
  Sparkles,
  ArrowRight,
  Eye,
  CheckCircle2,
  X,
  Calendar,
  Code2,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../../utils';

export interface PortfolioProject {
  id: string;
  title: string;
  slug: string;
  category: 'network' | 'security' | 'web' | 'cloud';
  categoryLabel: string;
  description: string;
  content: string;
  technologies: string[];
  image: string;
  demoUrl: string;
  repoUrl: string;
  featured: boolean;
  period: string;
}

export const featuredProjectsData: PortfolioProject[] = [
  {
    id: 'proj-devkit-cli',
    title: 'devkit-cli - Modular Developer Toolbox & CLI Suite',
    slug: 'devkit-cli',
    category: 'security',
    categoryLabel: 'Developer Suite & CLI',
    description: 'Toolbox developer modern untuk terminal dan web: Subnet CIDR calculators, JWT token inspectors, Cryptographic entropy & password generator, JSON formatters, serta HTTP network probes.',
    content: 'Aplikasi Developer CLI Toolkit modern, modular, production-ready, dan open-source yang menggabungkan kumpulan utilities developer harian dalam satu interface terpadu. Fitur utama mencakup Subnet CIDR Calculator (Network, wildcard, usable hosts, broadcast), Cryptographic Suite (SHA-256/512, MD5, secure random password), JWT Inspector, dan System Diagnostics.',
    technologies: ['TypeScript', 'Node.js', 'CIDR Engine', 'WebCrypto', 'Commander.js', 'Vitest'],
    image: '/images/gallery/dashboard_dark_theme.png',
    demoUrl: '/devkit',
    repoUrl: 'https://github.com/BillZCode',
    featured: true,
    period: '2026',
  },
  {
    id: 'proj-cyberlab-lks',
    title: 'CyberLab - Cybersecurity Toolkit & CTF Analysis Workspace',
    slug: 'cyberlab',
    category: 'security',
    categoryLabel: 'Cybersecurity & CTF',
    description: 'All-in-one cybersecurity toolkit & dynamic investigation workspace untuk analisis keamanan siber & tantangan CTF (Cryptography, Digital Forensics, Steganography, Reverse Engineering).',
    content: 'Platform investigasi keamanan siber dan CTF mandiri dengan modul taktis lengkap: Cryptography (Classical Ciphers, Encoders, RSA Toolkit, Hash Integrity), Digital Forensics (File Magic Analyzer, Hex/ASCII Viewer, Regex Strings, Entropy), Steganography (LSB Bit-plane visualizer, Chunk inspector), dan Reverse Engineering (ELF/PE header & sections parser).',
    technologies: ['TypeScript', 'WebCrypto API', 'Hex Analyzer', 'Stego Bitplane', 'ELF/PE Parser', 'Tailwind CSS'],
    image: '/images/gallery/dashboard_dark_theme.png',
    demoUrl: '/cyberlab',
    repoUrl: 'https://github.com/BillZCode',
    featured: true,
    period: '2026',
  },
  {
    id: 'proj-omni-ai',
    title: 'Omni AI Intelligent Chatbot & Multimodal Assistant',
    slug: 'omni-ai-chatbot',
    category: 'web',
    categoryLabel: 'AI & Full-Stack',
    description: 'Aplikasi web chatbot cerdas multi-model yang mengintegrasikan model open-weights Gemma 4, Flash 3, agentic reasoning, dan analisis gambar multimodal secara streaming.',
    content: 'Aplikasi asisten cerdas full-stack yang memanfaatkan arsitektur Server-Sent Events (SSE) untuk menghasilkan respons teks streaming real-time tanpa latensi berlebih. Dilengkapi selector engine multi-model, vision understanding untuk gambar, Markdown syntax highlighter kode, dan riwayat percakapan lokal.',
    technologies: ['JavaScript', 'Node.js', 'Multimodal Vision', 'Gemma 4', 'Flash 3 AI', 'Server-Sent Events'],
    image: '/images/gallery/gemini_ai_chatbot_preview.jpg',
    demoUrl: '/ai',
    repoUrl: 'https://github.com/BillZCode',
    featured: true,
    period: '2026',
  },
  {
    id: 'proj-1',
    title: 'Personal IT Hub & Infrastructure Dashboard',
    slug: 'personal-it-hub',
    category: 'web',
    categoryLabel: 'Infrastructure Hub',
    description: 'Sistem web portal IT terintegrasi dengan pemantauan server waktu nyata (CPU, RAM, Disk), pelacakan analitik pengunjung Cloudflare via GraphQL, dan panduan teknis.',
    content: 'Aplikasi full-stack komprehensif yang dibangun menggunakan React, TypeScript, Express, Prisma ORM, dan MariaDB. Dilengkapi sistem autentikasi JWT, rate limiting, pelacak visitor Cloudflare, dan antarmuka dark mode berstandar industri.',
    technologies: ['React 18', 'TypeScript', 'Express', 'MariaDB', 'Prisma ORM', 'Cloudflare API', 'Tailwind CSS'],
    image: '/images/gallery/dashboard_dark_theme.png',
    demoUrl: '/dashboard',
    repoUrl: 'https://github.com/BillZCode',
    featured: true,
    period: '2026',
  },
  {
    id: 'proj-2',
    title: 'Universal Media & File Downloader Suite',
    slug: 'universal-media-downloader',
    category: 'web',
    categoryLabel: 'Utility Service',
    description: 'Aplikasi downloader media serbaguna yang mengekstrak streaming video MP4 asli TikTok & YouTube tanpa watermark, melewati proteksi CORS, dan unduhan berkas langsung.',
    content: 'Layanan downloader cerdas yang terintegrasi dengan engine yt-dlp di backend server Linux. Mendukung streaming byte langsung ke browser, parsing OpenGraph, dan unduhan file multi-format secara aman.',
    technologies: ['TypeScript', 'Express', 'yt-dlp Engine', 'Linux Bash', 'Stream API', 'React'],
    image: '/images/gallery/universal_downloader_tool.png',
    demoUrl: '/tools',
    repoUrl: 'https://github.com/BillZCode',
    featured: true,
    period: '2026',
  },
  {
    id: 'proj-3',
    title: 'Topologi Jaringan Enterprise Multi-Area OSPF',
    slug: 'cisco-ospf-routing',
    category: 'network',
    categoryLabel: 'Enterprise Network',
    description: 'Perancangan arsitektur jaringan enterprise berbasis protokol routing dinamis OSPF pada multi-router dan multi-subnet dengan konvergensi cepat di Cisco Packet Tracer.',
    content: 'Simulasi topologi jaringan berskala menengah yang mencakup pembagian area OSPF, rute agregasi, cost metrics, dan verifikasi tabel routing untuk memastikan ketersediaan jalur antar segmen kantor pusat dan cabang secara optimal.',
    technologies: ['Cisco IOS', 'Packet Tracer', 'Multi-Area OSPF', 'CIDR Subnetting', 'Routing Tables'],
    image: '/images/gallery/cisco_ospf_topology.png',
    demoUrl: '/gallery',
    repoUrl: 'https://github.com/BillZCode',
    featured: true,
    period: '2026',
  },
  {
    id: 'proj-5',
    title: 'Arsitektur Cloud AWS VPC-CloudKita (Multi-AZ)',
    slug: 'aws-vpc-cloudkita',
    category: 'cloud',
    categoryLabel: 'Cloud Architecture',
    description: 'Desain arsitektur cloud skala produksi dengan VPC terisolasi, Public Subnet untuk EC2 WebServer Apache MariaDB, dan Private Subnet multi-AZ untuk RDS MySQL serta S3 bucket.',
    content: 'Rancangan infrastruktur cloud berstandar AWS Well-Architected Framework mencakup Internet Gateway (IGW), Route Table, Security Group bertingkat (Port 80/22 dan DB Port 3306), dan penyimpanan statis terdistribusi Amazon S3.',
    technologies: ['AWS Cloud', 'Amazon VPC', 'Amazon EC2', 'Amazon RDS', 'Amazon S3', 'Security Groups'],
    image: '/images/gallery/aws_vpc_cloudkita_architecture.jpg',
    demoUrl: '/gallery',
    repoUrl: 'https://github.com/BillZCode',
    featured: true,
    period: '2026',
  },
];

export const FeaturedProjectsSection: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'network' | 'security' | 'web' | 'cloud'>('all');
  const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(null);

  const filtered = featuredProjectsData.filter((p) => {
    if (activeFilter === 'all') return true;
    return p.category === activeFilter;
  });

  return (
    <section id="projects-section" className="space-y-8" aria-labelledby="projects-heading">
      {/* Section Header Tycami Style */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <span className="text-xs sm:text-sm font-mono text-amber-400 font-semibold tracking-widest">// 03</span>
          <h2 id="projects-heading" className="text-xs sm:text-sm font-mono uppercase tracking-[0.2em] text-white font-bold">
            Featured Projects
          </h2>
        </div>

        <Link
          to="/projects"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-white transition-colors group"
        >
          <span>View All Projects Archive</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setActiveFilter('all')}
          className={cn(
            "px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer",
            activeFilter === 'all'
              ? "bg-white text-slate-950 font-bold shadow-md"
              : "bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.08] border border-white/[0.06]"
          )}
        >
          All Featured ({featuredProjectsData.length})
        </button>

        <button
          onClick={() => setActiveFilter('network')}
          className={cn(
            "px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer",
            activeFilter === 'network'
              ? "bg-white text-slate-950 font-bold shadow-md"
              : "bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.08] border border-white/[0.06]"
          )}
        >
          Networking (1)
        </button>

        <button
          onClick={() => setActiveFilter('security')}
          className={cn(
            "px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer",
            activeFilter === 'security'
              ? "bg-white text-slate-950 font-bold shadow-md"
              : "bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.08] border border-white/[0.06]"
          )}
        >
          Security & CLI (2)
        </button>

        <button
          onClick={() => setActiveFilter('web')}
          className={cn(
            "px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer",
            activeFilter === 'web'
              ? "bg-white text-slate-950 font-bold shadow-md"
              : "bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.08] border border-white/[0.06]"
          )}
        >
          Web & AI (3)
        </button>

        <button
          onClick={() => setActiveFilter('cloud')}
          className={cn(
            "px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer",
            activeFilter === 'cloud'
              ? "bg-white text-slate-950 font-bold shadow-md"
              : "bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.08] border border-white/[0.06]"
          )}
        >
          Cloud (1)
        </button>
      </div>

      {/* Modern Grid of Project Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((project) => (
          <div
            key={project.id}
            className="group flex flex-col justify-between rounded-2xl bg-[#0d121f] border border-white/10 hover:border-white/25 overflow-hidden transition-all duration-300 shadow-md hover:shadow-2xl"
          >
            {/* Card Thumbnail Image Area */}
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#121727]">
              <img
                src={project.image}
                alt={project.title}
                loading="lazy"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
              <div 
                className="absolute inset-0 bg-gradient-to-t from-[#0d121f] via-transparent to-transparent opacity-80" 
                aria-hidden="true" 
              />

              {/* Floating Badge */}
              <div className="absolute top-3 left-3 flex items-center gap-1.5">
                <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-semibold bg-black/70 backdrop-blur-md text-white border border-white/15">
                  {project.categoryLabel}
                </span>
              </div>

              {/* Period Pill */}
              <div className="absolute top-3 right-3">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-mono text-slate-400 bg-black/70 backdrop-blur-md border border-white/10">
                  {project.period}
                </span>
              </div>
            </div>

            {/* Card Content */}
            <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2.5">
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight group-hover:text-amber-300 transition-colors line-clamp-2">
                  {project.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-sans line-clamp-3">
                  {project.description}
                </p>
              </div>

              {/* Technology Tags */}
              <div className="space-y-4 pt-2">
                <div className="flex flex-wrap gap-1.5">
                  {project.technologies.slice(0, 4).map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/[0.04] text-slate-300 border border-white/[0.06]"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 4 && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono text-slate-500">
                      +{project.technologies.length - 4}
                    </span>
                  )}
                </div>

                {/* Action Buttons pinned at bottom */}
                <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {/* Internal / External Demo Link */}
                    {project.demoUrl.startsWith('/') ? (
                      <Link
                        to={project.demoUrl}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold bg-white/10 hover:bg-white text-white hover:text-slate-950 transition-all"
                      >
                        <span>Open Live</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    ) : (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold bg-white/10 hover:bg-white text-white hover:text-slate-950 transition-all"
                      >
                        <span>Open Live</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}

                    {/* Quick Preview Modal Trigger */}
                    <button
                      onClick={() => setSelectedProject(project)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
                      title="Lihat detail lengkap proyek"
                      aria-label="View detail"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>

                  {/* GitHub Repo */}
                  <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
                    title="Source repository"
                    aria-label="Source code"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* Project Detail Modal */}
      {selectedProject && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in"
          onClick={() => setSelectedProject(null)}
          role="dialog"
          aria-modal="true"
        >
          <div 
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#0c101b] border border-white/20 p-6 sm:p-8 space-y-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/10">
              <div className="space-y-1">
                <span className="text-2xs font-mono font-semibold uppercase text-amber-400 tracking-wider">
                  {selectedProject.categoryLabel}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {selectedProject.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedProject(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer"
                aria-label="Tutup modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Image */}
            <div className="rounded-2xl overflow-hidden aspect-[16/9] bg-[#111624] border border-white/10">
              <img
                src={selectedProject.image}
                alt={selectedProject.title}
                className="w-full h-full object-cover object-center"
              />
            </div>

            {/* Modal Content Description */}
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">Deskripsi Arsitektur</h4>
                <p className="text-sm text-slate-300 leading-relaxed font-sans">
                  {selectedProject.content}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">Teknologi & Modul</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.technologies.map((t) => (
                    <span
                      key={t}
                      className="px-2.5 py-1 rounded-lg text-xs font-mono bg-white/[0.05] text-white border border-white/10"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer Links */}
            <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                {selectedProject.demoUrl.startsWith('/') ? (
                  <Link
                    to={selectedProject.demoUrl}
                    onClick={() => setSelectedProject(null)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-semibold bg-white text-slate-950 hover:bg-slate-200 transition-all shadow-md"
                  >
                    <span>Buka Aplikasi</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                ) : (
                  <a
                    href={selectedProject.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-semibold bg-white text-slate-950 hover:bg-slate-200 transition-all shadow-md"
                  >
                    <span>Buka Link</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}

                <a
                  href={selectedProject.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-semibold bg-white/[0.06] hover:bg-white/[0.12] text-white border border-white/10 transition-all"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>GitHub Repository</span>
                </a>
              </div>

              <span className="text-2xs font-mono text-slate-500">
                Period: {selectedProject.period}
              </span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
