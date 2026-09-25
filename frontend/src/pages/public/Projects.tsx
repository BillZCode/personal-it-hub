import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { animate, stagger } from 'animejs';
import { projectsApi } from '../../services/api';
import { Card, CardContent, Badge, Button, Input, Select, Modal } from '../../components/ui';
import { SkeletonCard } from '../../components/feedback/LoadingStates';
import { Github, ExternalLink, Star, Code2, Search, Eye } from 'lucide-react';
import { Project, ProjectStatus } from '../../types';

const statusColors: Record<ProjectStatus, 'warning' | 'info' | 'success' | 'neutral'> = {
  PLANNING: 'warning',
  IN_PROGRESS: 'info',
  COMPLETED: 'success',
  ARCHIVED: 'neutral',
};

const sabbilProjects: Project[] = [
  {
    id: 'proj-cyberlab-lks',
    title: 'CyberLab LKS - Cybersecurity Toolkit & CTF Analysis Workspace',
    slug: 'cyberlab-lks',
    description: 'All-in-one cybersecurity toolkit & dynamic investigation workspace untuk persiapan LKS Cyber Security & CTF (Cryptography, Digital Forensics, Steganography, Web Exploitation, Reverse Engineering, Pwn, OSINT, Miscellaneous).',
    content: 'Platform workstation investigasi keamanan siber dan CTF mandiri dengan 8 modul taktis lengkap: Cryptography (Classical Ciphers, Encoders, XOR Helper, RSA Toolkit, Hash Integrity), Digital Forensics (File Magic Analyzer, Hex/ASCII Viewer, Regex Strings, Entropy Blocks, Archive & SQLite Explorer), Steganography (LSB Bit-plane visualizer, PNG/JPEG chunk inspector, Audio Spectrogram, File Carving), Web Exploitation CTF (HTTP/CURL Analyzer, Cookie & JWT parser, Vulnerability knowledge matrices), Reverse Engineering (ELF/PE parser, Header & Sections, Opcodes Disassembler, Assembly manual), Pwn/Binary (Security Mitigations Checksec, Endianness, Cyclic De Bruijn pattern, Stack layout visualizer), OSINT (Domain/DNS/WHOIS analyzer, IP CIDR subnetting, Metadata investigator, Google Dork matrix), dan Miscellaneous (Text cleaners, Regex debugger, Unix timestamps, Format converter, Bitwise calc, QR tools, Hash verifiers). Dapat diakses via rute internal /cyberlab atau subdomain cybertool-sabbilferdyansyah.my.id.',
    technologies: ['TypeScript', 'JavaScript WebCrypto', 'Hex Analyzer', 'Stego Bitplane', 'ELF/PE Parser', 'CTF Toolkit', 'Tailwind CSS'],
    image: '/images/gallery/cyberlab_lks_preview.jpg',
    demoUrl: '/cyberlab',
    repoUrl: 'https://github.com/BillZCode',
    status: 'COMPLETED',
    featured: true,
    startDate: '2026-09-24',
    endDate: '2026-09-25',
    createdAt: '2026-09-25',
    updatedAt: '2026-09-25'
  },
  {
    id: 'proj-omni-ai',
    title: 'Omni AI Intelligent Chatbot & Multimodal Assistant',
    slug: 'omni-ai-chatbot',
    description: 'Aplikasi web chatbot AI modern bersistem multi-model yang mengintegrasikan model open weights Gemma 4, Flash 3 Preview, reasoning agentic ER-2, dan analisis gambar multimodal secara streaming.',
    content: 'Aplikasi asisten cerdas full-stack yang memanfaatkan arsitektur Server-Sent Events (SSE) untuk menghasilkan respons teks real-time tanpa latensi berlebih. Dilengkapi selector engine multi-model (Flash 3 Preview, Embodied Agentic ER-2, Gemma 4 26B Open Weights), kemampuan multimodal vision untuk analisis gambar yang diunggah pengguna, dukungan penuh Markdown formatting, syntax highlighter kode dengan tombol salin instan, multi-sesi riwayat percakapan lokal, dan panel konfigurasi System Prompt.',
    technologies: ['JavaScript', 'Node.js', 'Multimodal Vision', 'Gemma 4 Open Weights', 'Flash 3 AI', 'Server-Sent Events', 'Tailwind CSS'],
    image: '/images/gallery/gemini_ai_chatbot_preview.jpg',
    demoUrl: '/ai',
    repoUrl: 'https://github.com/BillZCode',
    status: 'COMPLETED',
    featured: true,
    startDate: '2026-09-24',
    endDate: '2026-09-25',
    createdAt: '2026-09-25',
    updatedAt: '2026-09-25'
  },
  {
    id: 'proj-1',
    title: 'Personal IT Hub & Infrastructure Dashboard',
    slug: 'personal-it-hub',
    description: 'Sistem web portal IT terintegrasi dengan pemantauan server waktu nyata (CPU, RAM, Disk), pelacakan analitik pengunjung Cloudflare via GraphQL, dan panduan teknis.',
    content: 'Aplikasi full-stack komprehensif yang dibangun menggunakan React, TypeScript, Express, Prisma ORM, dan MariaDB. Dilengkapi sistem autentikasi JWT, rate limiting, pelacak visitor Cloudflare, dan antarmuka bertema gelap futuristik.',
    technologies: ['React', 'TypeScript', 'Node.js', 'Express', 'MariaDB', 'Prisma', 'Tailwind CSS', 'Cloudflare API'],
    image: '/images/gallery/dashboard_dark_theme.png',
    demoUrl: '/',
    repoUrl: 'https://github.com/BillZCode',
    status: 'COMPLETED',
    featured: true,
    startDate: '2026-08-01',
    endDate: '2026-09-09',
    createdAt: '2026-09-09',
    updatedAt: '2026-09-09'
  },
  {
    id: 'proj-2',
    title: 'Universal Media & File Downloader Suite',
    slug: 'universal-media-downloader',
    description: 'Aplikasi downloader media serbaguna yang mampu mengekstrak streaming video MP4 asli TikTok & YouTube tanpa watermark, melewati proteksi CORS, dan unduhan berkas langsung.',
    content: 'Layanan downloader cerdas yang terintegrasi dengan yt-dlp binary engine di backend server Linux. Mendukung streaming byte langsung ke browser, parsing OpenGraph, dan unduhan file multi-format.',
    technologies: ['TypeScript', 'Express', 'yt-dlp', 'Linux Bash', 'Stream API', 'React'],
    image: '/images/gallery/universal_downloader_tool.png',
    demoUrl: '/tools',
    repoUrl: 'https://github.com/BillZCode',
    status: 'COMPLETED',
    featured: true,
    startDate: '2026-09-01',
    endDate: '2026-09-09',
    createdAt: '2026-09-09',
    updatedAt: '2026-09-09'
  },
  {
    id: 'proj-3',
    title: 'Topologi Jaringan Enterprise Multi-Area OSPF',
    slug: 'cisco-ospf-routing',
    description: 'Perancangan arsitektur jaringan enterprise berbasis protokol routing dinamis OSPF pada multi-router dan multi-subnet dengan konvergensi cepat di Cisco Packet Tracer.',
    content: 'Simulasi topologi jaringan berskala menengah yang mencakup pembagian area OSPF, rute agregasi, cost metrics, dan verifikasi tabel routing untuk memastikan ketersediaan jalur antar segmen kantor pusat dan cabang.',
    technologies: ['Cisco IOS', 'Packet Tracer', 'OSPF', 'Subnetting', 'Routing Tables'],
    image: '/images/gallery/cisco_ospf_topology.png',
    demoUrl: '/gallery',
    repoUrl: 'https://github.com/BillZCode',
    status: 'COMPLETED',
    featured: true,
    startDate: '2026-08-15',
    endDate: '2026-08-30',
    createdAt: '2026-09-09',
    updatedAt: '2026-09-09'
  },
  {
    id: 'proj-4',
    title: 'Perancangan Inter-VLAN Routing & Static Routing',
    slug: 'cisco-vlan-static-routing',
    description: 'Implementasi segmentasi jaringan menggunakan VLAN (Virtual Local Area Network), konfigurasi port trunking 802.1Q, serta routing statis redundan.',
    content: 'Pemisahan domain broadcast untuk meningkatkan efisiensi dan keamanan jaringan lokal menggunakan switch Catalyst 2960 dan router Cisco. Dilengkapi pengujian konektivitas end-to-end antar departemen.',
    technologies: ['Cisco Packet Tracer', 'VLAN', 'IEEE 802.1Q', 'Static Routing', 'Switching'],
    image: '/images/gallery/cisco_vlan_static_routing.png',
    demoUrl: '/gallery',
    repoUrl: 'https://github.com/BillZCode',
    status: 'COMPLETED',
    featured: true,
    startDate: '2026-08-01',
    endDate: '2026-08-20',
    createdAt: '2026-09-09',
    updatedAt: '2026-09-09'
  },
  {
    id: 'proj-5',
    title: 'Arsitektur Cloud AWS VPC-CloudKita (Multi-AZ)',
    slug: 'aws-vpc-cloudkita',
    description: 'Desain arsitektur cloud skala produksi dengan VPC terisolasi, Public Subnet untuk EC2 WebServer Apache MariaDB, dan Private Subnet multi-AZ untuk RDS MySQL serta S3 bucket.',
    content: 'Rancangan infrastruktur cloud berstandar AWS Well-Architected Framework mencakup pengaturan Internet Gateway (IGW), Route Table, Security Group bertingkat (Port 80/22 dan DB Port 3306), dan penyimpanan statis terdistribusi.',
    technologies: ['AWS Cloud', 'VPC', 'Amazon EC2', 'Amazon RDS', 'AWS S3', 'Security Groups', 'Linux'],
    image: '/images/gallery/aws_vpc_cloudkita_architecture.jpg',
    demoUrl: '/gallery',
    repoUrl: 'https://github.com/BillZCode',
    status: 'COMPLETED',
    featured: true,
    startDate: '2026-08-10',
    endDate: '2026-09-01',
    createdAt: '2026-09-09',
    updatedAt: '2026-09-09'
  },
  {
    id: 'proj-6',
    title: 'Debian 13 Trixie KDE Plasma Workstation',
    slug: 'debian-workstation-setup',
    description: 'Kustomisasi lingkungan kerja pengembang berbasis Debian GNU/Linux 13 (Trixie) dengan KDE Plasma 6, Noctalia Shell, kernel Linux 6.12, dan stack administrasi sistem lokal.',
    content: 'Dokumentasi dan skrip konfigurasi workstation Linux mandiri mencakup setup LAMP/LEMP lokal, Docker containerization, Hyprland/KDE Plasma ricing, dan shell scripting untuk otomasi sistem.',
    technologies: ['Debian 13', 'KDE Plasma', 'Bash 5.2', 'Linux 6.12', 'Docker', 'Systemd'],
    image: '/images/gallery/desktop_overview_wednesday.png',
    demoUrl: '/linux-setup',
    repoUrl: 'https://github.com/BillZCode',
    status: 'COMPLETED',
    featured: false,
    startDate: '2026-07-01',
    endDate: '2026-09-09',
    createdAt: '2026-09-09',
    updatedAt: '2026-09-09'
  },
];

export function Projects() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'ALL'>('ALL');
  const [techFilter, setTechFilter] = useState('');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: () => projectsApi.getAll(),
    placeholderData: { data: sabbilProjects, total: sabbilProjects.length, page: 1, limit: 20, totalPages: 1 },
  });

  const projects = (data?.data && data.data.length > 0) ? data.data : sabbilProjects;
  const allTechs = [...new Set(projects.flatMap(p => p.technologies))].sort();

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.title.toLowerCase().includes(search.toLowerCase()) ||
      project.description.toLowerCase().includes(search.toLowerCase()) ||
      project.technologies.some(t => t.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = statusFilter === 'ALL' || project.status === statusFilter;
    const matchesTech = !techFilter || project.technologies.includes(techFilter);
    return matchesSearch && matchesStatus && matchesTech;
  });

  // Staggered Anime.js card entrance
  useEffect(() => {
    animate('.project-grid-card', {
      opacity: [0, 1],
      translateY: [18, 0],
      delay: stagger(45, { start: 40 }),
      duration: 400,
      ease: 'outCubic',
    });
  }, [search, statusFilter, techFilter, filteredProjects.length]);

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-dark-800/80 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-dark-100 tracking-tight font-sans">Projects</h1>
          <p className="text-dark-400 text-sm mt-1">Showcase of technical developments, network designs, and experiments</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="primary" dot>Featured: {projects.filter(p => p.featured).length}</Badge>
          <Badge variant="success" dot>Completed: {projects.filter(p => p.status === 'COMPLETED').length}</Badge>
          <Badge variant="info" dot>In Progress: {projects.filter(p => p.status === 'IN_PROGRESS').length}</Badge>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-dark-900/40 border border-dark-800 flex flex-col sm:flex-row gap-4">
        <Input
          placeholder="Cari proyek atau teknologi..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          leftIcon={<Search className="h-4 w-4" />}
          className="flex-1 max-w-xs"
        />
        <Select
          placeholder="Filter berdasarkan status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as ProjectStatus | 'ALL')}
          options={[
            { value: 'ALL', label: 'Semua Status' },
            { value: 'COMPLETED', label: 'Completed' },
            { value: 'IN_PROGRESS', label: 'In Progress' },
            { value: 'PLANNING', label: 'Planning' },
            { value: 'ARCHIVED', label: 'Archived' },
          ]}
          className="w-full sm:w-48"
        />
        <Select
          placeholder="Filter teknologi"
          value={techFilter}
          onChange={(e) => setTechFilter(e.target.value)}
          options={[
            { value: '', label: 'Semua Teknologi' },
            ...allTechs.map(t => ({ value: t, label: t })),
          ]}
          className="w-full sm:w-48"
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-dark-400">Tidak ada proyek yang sesuai dengan kriteria pencarian.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <Card key={project.id} className="project-grid-card card-hover overflow-hidden flex flex-col border border-dark-800/90 bg-dark-900/60 hover:border-emerald-500/50 hover:shadow-[0_12px_28px_-6px_rgba(16,185,129,0.18)] transition-all duration-300 group">
              {project.image ? (
                <div 
                  className="w-full h-44 bg-dark-950 overflow-hidden cursor-pointer relative border-b border-dark-800"
                  onClick={() => setSelectedProject(project)}
                >
                  <img 
                    src={project.image} 
                    alt={project.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-950/80 via-transparent to-transparent" />
                  <div className="absolute top-3 right-3 flex items-center gap-1.5">
                    {project.featured && (
                      <span className="p-1.5 bg-yellow-500/20 backdrop-blur-md rounded-lg border border-yellow-500/30 text-yellow-400">
                        <Star className="h-3.5 w-3.5 fill-yellow-400" />
                      </span>
                    )}
                  </div>
                  <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-xs text-dark-300">
                    <span className="flex items-center gap-1 bg-dark-900/90 px-2 py-0.5 rounded border border-dark-700 font-mono text-2xs text-emerald-400">
                      <Eye className="h-3 w-3" /> Klik Detail
                    </span>
                    <Badge variant={statusColors[project.status]} className="text-2xs capitalize">
                      {project.status.toLowerCase().replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
              ) : (
                <div 
                  className="w-full h-24 bg-dark-950/60 border-b border-dark-800 flex items-center justify-center cursor-pointer"
                  onClick={() => setSelectedProject(project)}
                >
                  <Code2 className="h-8 w-8 text-dark-600" />
                </div>
              )}
              <CardContent className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 
                    className="font-semibold text-dark-100 mb-2 group-hover:text-emerald-400 transition-colors cursor-pointer text-base line-clamp-1 font-mono"
                    onClick={() => setSelectedProject(project)}
                  >
                    {project.title}
                  </h3>
                  <p className="text-dark-400 text-xs sm:text-sm mb-4 line-clamp-2 leading-relaxed">{project.description}</p>
                  
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.technologies.slice(0, 4).map((tech) => (
                      <span key={tech} className="text-2xs font-mono px-2 py-0.5 rounded bg-dark-850 text-dark-300 border border-dark-750/70">
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 4 && (
                      <span className="text-2xs font-mono px-1.5 py-0.5 rounded bg-dark-850 text-dark-400 border border-dark-750/70">
                        +{project.technologies.length - 4}
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-dark-800/80 flex items-center justify-between gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setSelectedProject(project)}
                    className="text-xs text-dark-300 hover:text-white px-2.5 h-8"
                  >
                    <Eye className="h-3.5 w-3.5 mr-1.5 text-emerald-400" /> Detail
                  </Button>
                  <div className="flex items-center gap-1.5">
                    {project.demoUrl && (
                      <a 
                        href={project.demoUrl} 
                        target={project.demoUrl.startsWith('http') ? '_blank' : undefined} 
                        rel="noopener noreferrer" 
                        className="btn-primary text-xs py-1.5 px-3 h-8 flex items-center gap-1.5 shadow-sm"
                        aria-label="Akses Proyek"
                      >
                        Buka Akses <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                    {project.repoUrl && (
                      <a 
                        href={project.repoUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="p-2 rounded-lg bg-dark-850 text-dark-400 hover:text-white hover:bg-dark-800 transition-colors border border-dark-750" 
                        aria-label="GitHub Repository"
                      >
                        <Github className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    
      {/* Modal Detail & Akses Proyek */}
      <Modal isOpen={!!selectedProject} onClose={() => setSelectedProject(null)} title={selectedProject?.title} size="xl">
        {selectedProject && (
          <div className="space-y-4">
            {selectedProject.image && (
              <div className="w-full rounded-xl overflow-hidden border border-dark-700 bg-dark-950 shadow-2xl flex items-center justify-center p-1">
                <img 
                  src={selectedProject.image} 
                  alt={selectedProject.title} 
                  className="max-w-full max-h-[50vh] object-contain mx-auto rounded-lg" 
                />
              </div>
            )}
            
            <p className="text-dark-200 text-sm leading-relaxed">
              {selectedProject.content || selectedProject.description}
            </p>

            <div className="p-4 bg-dark-950/80 rounded-xl border border-dark-800 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-dark-400">Status Pengembangan:</span>
                <Badge variant={statusColors[selectedProject.status]} className="text-xs capitalize">
                  {selectedProject.status.toLowerCase().replace('_', ' ')}
                </Badge>
              </div>
              <div>
                <p className="text-xs text-dark-400 mb-1.5">Teknologi & Tools yang Digunakan:</p>
                <div className="flex flex-wrap gap-1.5">
                  {selectedProject.technologies.map((tech) => (
                    <span key={tech} className="text-xs font-mono px-2 py-0.5 rounded bg-dark-800 text-emerald-400 border border-dark-700">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              {selectedProject.repoUrl && (
                <a 
                  href={selectedProject.repoUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn-secondary text-sm py-2 px-4 flex items-center gap-2"
                >
                  <Github className="h-4 w-4" /> Repository Kode
                </a>
              )}
              {selectedProject.demoUrl && (
                <a 
                  href={selectedProject.demoUrl} 
                  target={selectedProject.demoUrl.startsWith('http') ? '_blank' : undefined} 
                  rel="noopener noreferrer"
                  className="btn-primary text-sm py-2 px-5 flex items-center gap-2"
                >
                  Buka Proyek Sekarang <ExternalLink className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default Projects;