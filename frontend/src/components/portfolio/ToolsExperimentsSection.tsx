import React from 'react';
import {
  Wrench,
  Shield,
  Bot,
  Activity,
  Server,
  HardDrive,
  ExternalLink,
  ArrowRight,
  Terminal,
  Cpu,
  Layers,
  Sparkles,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../../utils';

interface ToolItem {
  id: string;
  title: string;
  badge: string;
  badgeColor: string;
  desc: string;
  path: string;
  features: string[];
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  borderColor: string;
  bgGlow: string;
}

const toolsData: ToolItem[] = [
  {
    id: 'devkit',
    title: 'DevKit CLI Studio',
    badge: 'DEV TOOL',
    badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    desc: 'Toolbox developer modern untuk kalkulasi subnet CIDR, inspeksi token JWT, generator hash kriptografi, format JSON, dan HTTP probe.',
    path: '/devkit',
    features: ['Subnet CIDR Calc', 'JWT Token Inspector', 'SHA/MD5 Hasher', 'JSON Validator & Path'],
    icon: Wrench,
    accentColor: 'text-amber-400',
    borderColor: 'hover:border-amber-500/30',
    bgGlow: 'bg-amber-500/[0.03]',
  },
  {
    id: 'cyberlab',
    title: 'CyberLab CTF Workstation',
    badge: 'SECOPS LAB',
    badgeColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    desc: 'Workbench investigasi keamanan siber dengan 8 modul taktis: Classical/Modern Ciphers, File Magic Forensics, Steganografi LSB, dan ELF/PE binary analysis.',
    path: '/cyberlab',
    features: ['Vigenere & RSA Ciphers', 'Magic Byte Inspector', 'LSB Bit-plane Visualizer', 'ELF/PE Header Parser'],
    icon: Shield,
    accentColor: 'text-cyan-400',
    borderColor: 'hover:border-cyan-500/30',
    bgGlow: 'bg-cyan-500/[0.03]',
  },
  {
    id: 'network-tools',
    title: 'Tools & Network Diagnostics',
    badge: 'DIAGNOSTICS',
    badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    desc: 'Pengujian konektivitas online (Ping latency, DNS lookup resolver), kalkulator IP, format konversi data, serta media downloader serbaguna.',
    path: '/tools',
    features: ['Online Ping Latency', 'DNS Record Lookup', 'IP Subnetting Tool', 'yt-dlp Media Downloader'],
    icon: Activity,
    accentColor: 'text-emerald-400',
    borderColor: 'hover:border-emerald-500/30',
    bgGlow: 'bg-emerald-500/[0.03]',
  },
  {
    id: 'omni-ai',
    title: 'Omni AI Multimodal Studio',
    badge: 'AI INFERENCE',
    badgeColor: 'text-violet-400 bg-violet-500/10 border-violet-500/20',
    desc: 'Asisten cerdas berbasis model open-weights Gemma 4 & Flash 3 dengan streaming SSE real-time, penalaran kode pemrograman, dan analisis gambar visual.',
    path: '/ai',
    features: ['Real-time Streaming', 'Syntax Code Highlighter', 'Multimodal Vision', 'Custom System Prompt'],
    icon: Bot,
    accentColor: 'text-violet-400',
    borderColor: 'hover:border-violet-500/30',
    bgGlow: 'bg-violet-500/[0.03]',
  },
  {
    id: 'system-overview',
    title: 'System & Infrastructure Center',
    badge: 'TELEMETRY',
    badgeColor: 'text-sky-400 bg-sky-500/10 border-sky-500/20',
    desc: 'Pusat telemetri terpadu: status layanan server Debian, monitoring hardware (CPU/RAM/Disk), dokumentasi dotfiles Linux, dan analitik pengunjung.',
    path: '/system',
    features: ['Live Server Telemetry', 'Service Health Check', 'Debian & Arch Configs', 'Cloudflare Analytics'],
    icon: Server,
    accentColor: 'text-sky-400',
    borderColor: 'hover:border-sky-500/30',
    bgGlow: 'bg-sky-500/[0.03]',
  },
  {
    id: 'drive',
    title: 'Private Cloud Drive',
    badge: 'STORAGE NODE',
    badgeColor: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
    desc: 'Penyimpanan cloud mandiri terenkripsi dengan pembaca PDF responsif mobile, pemutar streaming video HTML5, dan manajemen file berbasis web.',
    path: '/drive',
    features: ['Virtual Storage Engine', 'Mobile PDF Reader', 'HTML5 Media Player', 'Secure File Sharing'],
    icon: HardDrive,
    accentColor: 'text-rose-400',
    borderColor: 'hover:border-rose-500/30',
    bgGlow: 'bg-rose-500/[0.03]',
  },
];

export const ToolsExperimentsSection: React.FC = () => {
  return (
    <section id="tools-section" className="space-y-8" aria-labelledby="tools-heading">
      {/* Section Header Tycami Style */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <span className="text-xs sm:text-sm font-mono text-cyan-400 font-semibold tracking-widest">// 05</span>
          <h2 id="tools-heading" className="text-xs sm:text-sm font-mono uppercase tracking-[0.2em] text-white font-bold">
            Tools & Technical Experiments
          </h2>
        </div>

        <span className="text-2xs font-mono text-slate-500 uppercase tracking-widest hidden sm:inline">
          Live Interactive Workstations
        </span>
      </div>

      {/* Grid of Interactive Tool Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {toolsData.map((tool) => {
          const Icon = tool.icon;
          return (
            <div
              key={tool.id}
              className={cn(
                "group p-6 rounded-2xl bg-[#0d121f] border border-white/10 transition-all duration-300 flex flex-col justify-between space-y-5 shadow-sm hover:shadow-xl",
                tool.borderColor,
                tool.bgGlow
              )}
            >
              <div className="space-y-4">
                {/* Card Top: Icon & Badge */}
                <div className="flex items-center justify-between gap-2">
                  <div className={cn("p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08]", tool.accentColor)}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={cn("px-2.5 py-0.5 rounded-md text-[10px] font-mono font-semibold border", tool.badgeColor)}>
                    {tool.badge}
                  </span>
                </div>

                {/* Title & Description */}
                <div className="space-y-1.5">
                  <h3 className="text-base sm:text-lg font-bold text-white tracking-tight group-hover:text-white transition-colors">
                    {tool.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-sans line-clamp-3">
                    {tool.desc}
                  </p>
                </div>

                {/* Feature Chips */}
                <div className="pt-1 flex flex-wrap gap-1.5">
                  {tool.features.map((feat) => (
                    <span
                      key={feat}
                      className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/[0.03] text-slate-300 border border-white/[0.05]"
                    >
                      {feat}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-3 border-t border-white/[0.06]">
                <Link
                  to={tool.path}
                  className="inline-flex items-center justify-between w-full px-3.5 py-2 rounded-xl text-xs font-mono font-semibold bg-white/[0.04] group-hover:bg-white text-slate-300 group-hover:text-slate-950 border border-white/[0.08] group-hover:border-white transition-all shadow-sm"
                >
                  <span>Buka Workstation</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
