import React from 'react';
import {
  Compass,
  FolderKanban,
  Award,
  BookOpen,
  Wrench,
  Shield,
  Bot,
  Activity,
  Server,
  Image,
  MessageSquare,
  GitBranch,
  Mail,
  ArrowRight,
  ExternalLink,
  Layers,
  Sparkles,
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../utils';

interface NavModule {
  title: string;
  desc: string;
  path: string;
  badge: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navModules: NavModule[] = [
  {
    title: 'Navigation Portal',
    desc: 'Indeks gerbang utama seluruh modul ekosistem web sabbilferdyansyah.my.id.',
    path: '/portal',
    badge: 'PORTAL',
    icon: Compass,
  },
  {
    title: 'Featured Projects',
    desc: 'Koleksi lengkap seluruh proyek implementasi jaringan, CLI suite, dan arsitektur web.',
    path: '/projects',
    badge: 'ARCHIVE',
    icon: FolderKanban,
  },
  {
    title: 'Certifications',
    desc: 'Daftar sertifikasi resmi Cisco Networking Academy, KOMDIGI, dan kurikulum Mimo.',
    path: '/certificates',
    badge: 'CREDENTIAL',
    icon: Award,
  },
  {
    title: 'Technical Notes',
    desc: 'Panduan konfigurasi mendalam Linux, database MariaDB, dan web server dinamis.',
    path: '/notes',
    badge: 'BLOG/WIKI',
    icon: BookOpen,
  },
  {
    title: 'DevKit CLI Studio',
    desc: 'Toolbox developer modular: CIDR subnetting, JWT inspector, dan kriptografi.',
    path: '/devkit',
    badge: 'DEV TOOLS',
    icon: Wrench,
  },
  {
    title: 'CyberLab Workstation',
    desc: 'Platform investigasi keamanan siber, analisis kriptografi, dan modul CTF.',
    path: '/cyberlab',
    badge: 'CTF LAB',
    icon: Shield,
  },
  {
    title: 'Omni AI Studio',
    desc: 'Chatbot asisten cerdas multimodal bertenaga model Gemma 4 & Flash 3.',
    path: '/ai',
    badge: 'AI CORE',
    icon: Bot,
  },
  {
    title: 'Tools & Network Probe',
    desc: 'Pengujian konektivitas online (Ping, DNS), utilitas data, dan media downloader.',
    path: '/tools',
    badge: 'DIAGNOSTICS',
    icon: Activity,
  },
  {
    title: 'System & Server Status',
    desc: 'Monitoring hardware server realtime (CPU, RAM, Disk) dan dotfiles Linux.',
    path: '/system',
    badge: 'STATUS',
    icon: Server,
  },
  {
    title: 'Visual Gallery',
    desc: 'Dokumentasi visual konfigurasi rig workstation, diagram, dan media terpilih.',
    path: '/gallery',
    badge: 'GALLERY',
    icon: Image,
  },
  {
    title: 'Guestbook',
    desc: 'Papan pesan publik untuk meninggalkan komentar dan apresiasi pengunjung.',
    path: '/guestbook',
    badge: 'FEEDBACK',
    icon: MessageSquare,
  },
  {
    title: 'Changelog',
    desc: 'Riwayat pembaruan versi rilis fitur, optimasi performa, dan audit keamanan.',
    path: '/changelog',
    badge: 'UPDATES',
    icon: GitBranch,
  },
];

export const PortfolioNavHub: React.FC = () => {
  const location = useLocation();

  return (
    <section className="space-y-6 pt-4 border-t border-white/10" aria-labelledby="hub-directory-heading">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <span className="text-2xs font-mono text-slate-500 uppercase tracking-widest">// ECOSYSTEM DIRECTORY</span>
          <h2 id="hub-directory-heading" className="text-xs sm:text-sm font-mono uppercase tracking-[0.2em] text-white font-bold mt-1">
            Navigasi Terintegrasi Ke Seluruh Halaman
          </h2>
        </div>
        <p className="text-xs font-mono text-slate-400">
          Akses instan ke setiap route dan fitur aktif dalam hub
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
        {navModules.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "p-4 rounded-xl border transition-all duration-200 flex flex-col justify-between space-y-3 group",
                isActive
                  ? "bg-violet-500/10 border-violet-500/40 text-white shadow-[0_0_15px_rgba(139,92,246,0.2)]"
                  : "bg-[#0d121f] hover:bg-[#13192b] border-white/[0.06] hover:border-white/20 text-slate-300 hover:text-white"
              )}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className={cn(
                    "p-2 rounded-lg",
                    isActive ? "bg-violet-500/20 text-violet-300" : "bg-white/[0.04] text-slate-400 group-hover:text-white"
                  )}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className={cn(
                    "text-[10px] font-mono px-2 py-0.5 rounded border",
                    isActive ? "bg-violet-500/20 text-violet-300 border-violet-500/30 font-bold" : "bg-white/[0.02] text-slate-500 border-white/[0.04]"
                  )}>
                    {item.badge}
                  </span>
                </div>

                <div>
                  <h3 className="text-xs sm:text-sm font-bold tracking-tight text-white group-hover:text-amber-300 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-[11px] text-slate-400 font-sans leading-relaxed mt-1 line-clamp-2">
                    {item.desc}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-white/[0.04] flex items-center justify-between text-2xs font-mono text-slate-400 group-hover:text-white">
                <span>{isActive ? 'Halaman Aktif' : 'Buka Halaman'}</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};
