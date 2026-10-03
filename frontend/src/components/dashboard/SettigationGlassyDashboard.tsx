import React, { useState, useMemo } from 'react';
import {
  Bell, CheckCircle2, Calendar, ArrowUpRight, Shield, Bot, HardDrive,
  FolderKanban, Sparkles, ExternalLink, Activity, Terminal, ChevronRight,
  TrendingUp, Layers, Plus, Search, GitBranch, Cpu,
  Server, Wrench, X, Radio, ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../../utils';

interface TaskProgress {
  title: string;
  category: string;
  progress: number;
  color: string;
  glow: string;
}

const activeTasks: TaskProgress[] = [
  { title: 'Frontend V7 Re-architecture', category: 'Web Ecosystem', progress: 85, color: 'bg-gradient-to-r from-amber-400 to-yellow-500', glow: 'shadow-[0_0_12px_rgba(245,158,11,0.5)]' },
  { title: 'CyberLab CTF Cryptography Engine', category: 'Security Tools', progress: 92, color: 'bg-gradient-to-r from-cyan-400 to-blue-500', glow: 'shadow-[0_0_12px_rgba(6,182,212,0.5)]' },
  { title: 'Omni AI Multimodal Gemma Vision', category: 'AI Inference', progress: 78, color: 'bg-gradient-to-r from-yellow-400 to-amber-500', glow: 'shadow-[0_0_12px_rgba(234,179,8,0.5)]' },
  { title: 'Linux BIND9 DNS & Apache VirtualHosts', category: 'Sysadmin Infrastructure', progress: 100, color: 'bg-gradient-to-r from-emerald-400 to-teal-500', glow: 'shadow-[0_0_12px_rgba(52,211,153,0.5)]' },
];

const timelineDates = [
  { day: 'Wed', date: '23', active: false },
  { day: 'Thu', date: '24', active: false },
  { day: 'Fri', date: '25', active: false },
  { day: 'Sat', date: '26', active: false },
  { day: 'Sun', date: '27', active: true },
  { day: 'Mon', date: '28', active: false },
  { day: 'Tue', date: '29', active: false },
];

const workstationsData = [
  {
    title: 'DevKit CLI Studio',
    desc: 'Modular Developer CLI & System Utilities Suite featuring API testers, encoders, JWT decoders, and shell tools.',
    icon: Wrench,
    badge: 'DEV TOOL',
    accent: 'text-amber-400',
    border: 'border-amber-500/30',
    bg: 'bg-amber-500/10',
    subdomain: 'devkit.local',
    internalPath: '/devkit',
    externalUrl: '/devkit/',
    features: ['API Client Tester', 'Base64 & Hash Tool', 'JWT Token Inspector', 'Unix Timestamp Calc'],
    status: 'Operational',
  },
  {
    title: 'CyberLab CTF Lab',
    desc: 'Offensive & Defensive cybersecurity workbench with real-time ciphers, steganography, hash cracking, and forensic tools.',
    icon: Shield,
    badge: 'CTF LAB',
    accent: 'text-cyan-400',
    border: 'border-cyan-500/30',
    bg: 'bg-cyan-500/10',
    subdomain: 'cybertool.sabbilferdyansyah.my.id',
    internalPath: '/cyberlab',
    externalUrl: 'https://cybertool.sabbilferdyansyah.my.id',
    features: ['Vigenere & Caesar Ciphers', 'SHA / MD5 Hash Tool', 'Morse Code Translator', 'Hex Dump Inspector'],
    status: 'Nominal',
  },
  {
    title: 'Omni AI Studio',
    desc: 'Next-generation multimodal reasoning agent powered by Flash & Gemma models with streaming responses.',
    icon: Bot,
    badge: 'AI ENGINE',
    accent: 'text-yellow-400',
    border: 'border-yellow-500/30',
    bg: 'bg-yellow-500/10',
    subdomain: 'ai.sabbilferdyansyah.my.id',
    internalPath: '/ai',
    externalUrl: 'https://ai.sabbilferdyansyah.my.id',
    features: ['Real-time Streaming', 'Code Generation & Fix', 'Document Synthesis', 'Voice & Multimodal'],
    status: 'Nominal',
  },
  {
    title: 'Private Cloud Drive',
    desc: 'Self-hosted encrypted virtual storage with mobile-optimized PDF reading, video streaming, and playlist navigation.',
    icon: HardDrive,
    badge: 'CLOUD NODE',
    accent: 'text-emerald-400',
    border: 'border-emerald-500/30',
    bg: 'bg-emerald-500/10',
    subdomain: 'drive.sabbilferdyansyah.my.id',
    internalPath: '/drive',
    externalUrl: 'http://drive.sabbilferdyansyah.my.id',
    features: ['AES-256 Storage', 'In-Browser PDF Viewer', 'HTML5 Media Player', 'Drag & Drop Batch Upload'],
    status: 'Encrypted',
  },
  {
    title: 'Linux Sysadmin Lab',
    desc: 'High-availability Debian & Arch infrastructure running BIND9 authoritative DNS and Apache2 VirtualHosts.',
    icon: Terminal,
    badge: 'NETWORK',
    accent: 'text-purple-400',
    border: 'border-purple-500/30',
    bg: 'bg-purple-500/10',
    subdomain: 'sabbilaf.network',
    internalPath: '/server',
    externalUrl: 'http://sabbilaf.network',
    features: ['Primary BIND9 DNS', 'Apache2 Reverse Proxy', 'Kernel 6.6 Telemetry', 'UFW Firewall Rules'],
    status: 'Active',
  },
];

export function SettigationGlassyDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'workspaces' | 'analytics'>('overview');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter workstations & tasks by search
  const filteredWorkstations = useMemo(() => {
    if (!searchQuery.trim()) return workstationsData;
    const q = searchQuery.toLowerCase().trim();
    return workstationsData.filter(
      (w) =>
        w.title.toLowerCase().includes(q) ||
        w.desc.toLowerCase().includes(q) ||
        w.subdomain.toLowerCase().includes(q) ||
        w.features.some((f) => f.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  const filteredTasks = useMemo(() => {
    if (!searchQuery.trim()) return activeTasks;
    const q = searchQuery.toLowerCase().trim();
    return activeTasks.filter(
      (t) => t.title.toLowerCase().includes(q) || t.category.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  return (
    <div className="space-y-6">
      {/* Top Glassmorphic App Bar (Settigation V7 Style) */}
      <div className="glass-card p-3 sm:p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left: Tab Switchers */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-dark-800/40 dark:bg-dark-950/60 border border-dark-700/60 dark:border-white/5 w-full md:w-auto">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={cn(
              'px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all',
              activeTab === 'overview'
                ? 'glass-pill-active'
                : 'text-dark-400 hover:text-dark-100 hover:bg-dark-800/60 dark:hover:bg-white/5'
            )}
          >
            Dashboard
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('workspaces')}
            className={cn(
              'px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all',
              activeTab === 'workspaces'
                ? 'glass-pill-active'
                : 'text-dark-400 hover:text-dark-100 hover:bg-dark-800/60 dark:hover:bg-white/5'
            )}
          >
            Workstations ({workstationsData.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('analytics')}
            className={cn(
              'px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all',
              activeTab === 'analytics'
                ? 'glass-pill-active'
                : 'text-dark-400 hover:text-dark-100 hover:bg-dark-800/60 dark:hover:bg-white/5'
            )}
          >
            Telemetry
          </button>
        </div>

        {/* Center: Search / Filter input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-dark-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter workstations, nodes, tasks..."
            className="w-full pl-9 pr-8 py-1.5 rounded-xl bg-dark-800/30 dark:bg-dark-950/50 border border-dark-700/60 dark:border-white/5 text-xs text-dark-100 placeholder-dark-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 font-sans transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-dark-400 hover:text-dark-100"
              aria-label="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Right: Quick Navigation Actions */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <Link
            to="/contact"
            className="px-3.5 py-1.5 rounded-xl bg-dark-800/60 dark:bg-dark-900/90 border border-dark-700/70 dark:border-white/10 hover:border-amber-500/40 text-xs font-mono font-semibold text-dark-200 hover:text-amber-500 dark:hover:text-amber-400 transition-all flex items-center gap-1.5 shadow-sm"
          >
            <span>Hire / Collab</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
          <Link
            to="/projects"
            className="v7-btn-gold px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold text-dark-950 flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="h-3.5 w-3.5 text-dark-950" />
            <span>Explore Works</span>
          </Link>
        </div>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: OVERVIEW (3-COLUMN BENTO GRID) */}
      {/* ========================================================= */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 animate-in fade-in duration-300">
          {/* COLUMN 1: Profile Welcome, Live Notifications & Task Progress (4 Cols) */}
          <div className="lg:col-span-4 space-y-5">
            {/* Welcome User Card */}
            <div className="glass-card p-5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold">
                    Sabbil Abdillah Ferdyansyah
                  </span>
                  <h3 className="text-xl font-black text-dark-100 mt-0.5 tracking-tight">
                    Welcome to IT-Hub
                  </h3>
                </div>
                <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                  <Sparkles className="h-5 w-5" />
                </div>
              </div>
              <p className="text-xs text-dark-400 mt-2 leading-relaxed">
                Curated portfolio hub & autonomous workstation network. All systems are operational under luxury V7 Obsidian glass aesthetics.
              </p>
            </div>

            {/* Notifications / Activity Feed */}
            <div className="glass-card p-5 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4 text-amber-400" />
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-dark-200">
                    System Notifications
                  </h4>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-semibold">
                  3 New
                </span>
              </div>

              <div className="space-y-2.5">
                <div className="glass-subcard p-3 flex items-start gap-3">
                  <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 mt-0.5">
                    <Shield className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-dark-200 truncate">CyberLab Subdomain Live</p>
                    <p className="text-[11px] text-dark-400">cybertool.sabbilferdyansyah.my.id</p>
                    <span className="text-[9px] font-mono text-dark-500">2h ago • 8 CTF Modules</span>
                  </div>
                </div>

                <div className="glass-subcard p-3 flex items-start gap-3">
                  <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 mt-0.5">
                    <Bot className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-dark-200 truncate">Omni AI Multi-Model Updated</p>
                    <p className="text-[11px] text-dark-400">ai.sabbilferdyansyah.my.id</p>
                    <span className="text-[9px] font-mono text-dark-500">Gemma 4 + Flash 3 Stream</span>
                  </div>
                </div>

                <div className="glass-subcard p-3 flex items-start gap-3">
                  <div className="p-1.5 rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-400 mt-0.5">
                    <Terminal className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-dark-200 truncate">DNS BIND9 Zone Reloaded</p>
                    <p className="text-[11px] text-dark-400">sabbilaf.network</p>
                    <span className="text-[9px] font-mono text-dark-500">Local Cache OK • 100% Health</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Today Tasks Progress (Settigation Stack Meters) */}
            <div className="glass-card p-5 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-amber-400" />
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-dark-200">
                    Key Sprint Tasks
                  </h4>
                </div>
                <span className="text-xs font-mono text-dark-400 font-bold">{filteredTasks.length} Modules</span>
              </div>

              <div className="space-y-3.5">
                {filteredTasks.map((t) => (
                  <div key={t.title} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-dark-200 truncate pr-2">{t.title}</span>
                      <span className="font-mono text-amber-400 font-bold">{t.progress}%</span>
                    </div>
                    <div className="h-1.5 w-full progress-track-glass">
                      <div
                        style={{ width: `${t.progress}%` }}
                        className={cn('h-full rounded-full transition-all duration-500', t.color, t.glow)}
                      />
                    </div>
                    <span className="text-[10px] font-mono text-dark-500">{t.category}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* COLUMN 2: Central Hub Workstations, Stats & Code Snippet (4 Cols) */}
          <div className="lg:col-span-4 space-y-5">
            {/* Key Stat Cards (Settigation Framer Motion Style) */}
            <div className="grid grid-cols-2 gap-3">
              <div className="glass-card p-4 hover:-translate-y-1 transition-all">
                <div className="flex items-center justify-between text-dark-400 mb-2">
                  <span className="text-xs font-mono text-dark-400">Completed Works</span>
                  <FolderKanban className="h-4 w-4 text-amber-400" />
                </div>
                <p className="text-2xl font-black text-dark-100 font-mono">18+</p>
                <div className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 mt-1">
                  <TrendingUp className="h-3 w-3" />
                  <span>Production Ready</span>
                </div>
              </div>

              <div className="glass-card p-4 hover:-translate-y-1 transition-all">
                <div className="flex items-center justify-between text-dark-400 mb-2">
                  <span className="text-xs font-mono text-dark-400">Sys Uptime</span>
                  <Activity className="h-4 w-4 text-cyan-400" />
                </div>
                <p className="text-2xl font-black text-dark-100 font-mono">99.98%</p>
                <div className="flex items-center gap-1 text-[11px] font-mono text-cyan-400 mt-1">
                  <CheckCircle2 className="h-3 w-3" />
                  <span>Debian Enterprise</span>
                </div>
              </div>
            </div>

            {/* Flagship Standalone Platform Highlight: CyberLab LKS */}
            <div className="glass-card p-5 relative overflow-hidden group">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                  CYBER SECURITY CTF WORKSTATION
                </span>
                <span className="text-[10px] font-mono text-dark-400">8 Modules</span>
              </div>

              <h3 className="text-lg font-bold text-dark-100 group-hover:text-amber-400 transition-colors">
                CyberLab Toolkit
              </h3>
              <p className="text-xs font-mono text-cyan-400/90 mt-1">
                cybertool.sabbilferdyansyah.my.id
              </p>
              <p className="text-xs text-dark-300 mt-2 leading-relaxed">
                Tactical forensic, cryptography, and reverse engineering workbench decoupled from the portfolio layout.
              </p>

              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                <Link
                  to="/cyberlab"
                  className="text-xs font-mono font-semibold text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1"
                >
                  <span>Embedded View</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
                <a
                  href="https://cybertool.sabbilferdyansyah.my.id"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="v7-btn-gold text-[11px] font-mono font-bold px-3 py-1.5 rounded-xl text-dark-950 flex items-center gap-1.5 shadow-sm"
                >
                  <span>Launch App</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>

            {/* Settigation Signature Code Snippet Card (Terminal IDE Style) */}
            <div className="p-4 font-mono text-xs overflow-hidden rounded-2xl bg-[#0b0f19] text-slate-200 border border-slate-800 shadow-md">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                </div>
                <span className="text-[10px] text-slate-400">DashboardGlass.tsx</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold">
                  JSX
                </span>
              </div>

              <pre className="text-[11px] leading-relaxed text-slate-300 overflow-x-auto">
                <code>
                  <span className="text-purple-400">import</span> &#123; motion &#125; <span className="text-purple-400">from</span> <span className="text-cyan-300">'framer-motion'</span>;<br />
                  <span className="text-purple-400">import</span> &#123; Shield, Bot, Terminal &#125; <span className="text-purple-400">from</span> <span className="text-cyan-300">'lucide-react'</span>;<br />
                  <br />
                  <span className="text-purple-400">const</span> <span className="text-amber-300">StatsCard</span> = (&#123; title, value, change &#125;) =&gt; (<br />
                  &nbsp;&nbsp;&lt;<span className="text-cyan-400">motion.div</span> <span className="text-amber-400">whileHover</span>=&#123;&#123; y: -5 &#125;&#125; <span className="text-amber-400">className</span>=<span className="text-cyan-300">"glass-card p-5 rounded-2xl"</span>&gt;<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;&lt;<span className="text-cyan-400">p</span> <span className="text-amber-400">className</span>=<span className="text-cyan-300">"text-xs text-white/60"</span>&gt;&#123;title&#125;&lt;/<span className="text-cyan-400">p</span>&gt;<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;&lt;<span className="text-cyan-400">h2</span> <span className="text-amber-400">className</span>=<span className="text-cyan-300">"text-2xl font-bold text-white font-mono"</span>&gt;&#123;value&#125;&lt;/<span className="text-cyan-400">h2</span>&gt;<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;&lt;<span className="text-cyan-400">span</span> <span className="text-amber-400">className</span>=<span className="text-cyan-300">"text-emerald-400 font-mono text-xs"</span>&gt;&#123;change&#125;%&lt;/<span className="text-cyan-400">span</span>&gt;<br />
                  &nbsp;&nbsp;&lt;/<span className="text-cyan-400">motion.div</span>&gt;<br />
                  );
                </code>
              </pre>
            </div>

            {/* Quick Commit & Deployment Activity */}
            <div className="glass-card p-4 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <GitBranch className="h-4 w-4 text-amber-400" />
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-dark-200">
                    Continuous Delivery Stream
                  </h4>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                  Auto Deployed
                </span>
              </div>

              <div className="space-y-2 text-xs font-mono">
                <div className="glass-subcard p-2.5 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-400 shrink-0" />
                    <span className="text-dark-200 truncate font-sans text-xs">feat(drive): mobile pdf & playlist modal</span>
                  </div>
                  <span className="text-[10px] text-amber-400 shrink-0">v2.6.4</span>
                </div>

                <div className="glass-subcard p-2.5 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" />
                    <span className="text-dark-200 truncate font-sans text-xs">feat(devkit): modular cli toolkit</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 shrink-0">v1.0.0</span>
                </div>

                <div className="glass-subcard p-2.5 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shrink-0" />
                    <span className="text-dark-200 truncate font-sans text-xs">feat(omni-ai): gemma-4 stream</span>
                  </div>
                  <span className="text-[10px] text-cyan-400 shrink-0">v2.4.1</span>
                </div>
              </div>
            </div>
          </div>

          {/* COLUMN 3: Calendar Timeline, Circular Analytics & Host Environment (4 Cols) */}
          <div className="lg:col-span-4 space-y-5">
            {/* Calendar Strip (Settigation Video Top-Right Widget) */}
            <div className="glass-card p-5 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-amber-400" />
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-dark-200">
                    Sprint Calendar • Sep 2026
                  </h4>
                </div>
                <span className="text-[10px] font-mono text-dark-400">Week 39</span>
              </div>

              <div className="grid grid-cols-7 gap-1.5 text-center">
                {timelineDates.map((item) => (
                  <div
                    key={item.day}
                    className={cn(
                      'p-2 rounded-xl transition-all',
                      item.active
                        ? 'glass-pill-active font-bold scale-105 shadow-md'
                        : 'glass-subcard hover:bg-white/5 text-dark-400'
                    )}
                  >
                    <p className="text-[9px] font-mono uppercase">{item.day}</p>
                    <p className="text-xs font-bold font-mono mt-0.5">{item.date}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Circular Progress Meters (Settigation Dual Dials Widget) */}
            <div className="glass-card p-5">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/5">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-dark-200">
                  Core Metrics Efficiency
                </span>
                <span className="text-[10px] font-mono text-amber-400 font-semibold">Real-Time</span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-center">
                {/* Dial 1: Security Shield */}
                <div className="glass-subcard p-4 flex flex-col items-center">
                  <div className="relative w-16 h-16 flex items-center justify-center">
                    <svg className="w-16 h-16 -rotate-90">
                      <circle cx="32" cy="32" r="26" stroke="currentColor" strokeWidth="5" className="text-dark-800" fill="transparent" />
                      <circle
                        cx="32"
                        cy="32"
                        r="26"
                        stroke="#06b6d4"
                        strokeWidth="5"
                        strokeDasharray="163"
                        strokeDashoffset="24"
                        strokeLinecap="round"
                        className="filter drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]"
                        fill="transparent"
                      />
                    </svg>
                    <span className="absolute font-mono text-xs font-bold text-dark-100">85%</span>
                  </div>
                  <p className="text-xs font-semibold text-dark-200 mt-2">Cyber Defense</p>
                  <span className="text-[10px] font-mono text-cyan-400 mt-0.5">Strict Hardening</span>
                </div>

                {/* Dial 2: Fullstack Velocity */}
                <div className="glass-subcard p-4 flex flex-col items-center">
                  <div className="relative w-16 h-16 flex items-center justify-center">
                    <svg className="w-16 h-16 -rotate-90">
                      <circle cx="32" cy="32" r="26" stroke="currentColor" strokeWidth="5" className="text-dark-800" fill="transparent" />
                      <circle
                        cx="32"
                        cy="32"
                        r="26"
                        stroke="#f59e0b"
                        strokeWidth="5"
                        strokeDasharray="163"
                        strokeDashoffset="12"
                        strokeLinecap="round"
                        className="filter drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]"
                        fill="transparent"
                      />
                    </svg>
                    <span className="absolute font-mono text-xs font-bold text-dark-100">92%</span>
                  </div>
                  <p className="text-xs font-semibold text-dark-200 mt-2">Dev Velocity</p>
                  <span className="text-[10px] font-mono text-amber-400 mt-0.5">Optimal Latency</span>
                </div>
              </div>
            </div>

            {/* Host Setup & Quick Collab CTA */}
            <div className="glass-card p-5 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <Terminal className="h-4 w-4 text-amber-400" />
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-dark-200">
                    Production Node
                  </h4>
                </div>
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-white/5 font-mono">
                  <span className="text-dark-400">Host OS:</span>
                  <span className="text-dark-200 font-semibold">Arch + Debian Linux</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5 font-mono">
                  <span className="text-dark-400">Runtime:</span>
                  <span className="text-dark-200 font-semibold">Node.js 20 + PHP 8.2</span>
                </div>
                <div className="flex justify-between py-1 font-mono">
                  <span className="text-dark-400">VHost Gateway:</span>
                  <span className="text-amber-400 font-semibold">Apache2 + BIND9 DNS</span>
                </div>
              </div>

              <Link
                to="/contact"
                className="mt-2 w-full py-2.5 rounded-xl bg-dark-950/80 border border-amber-500/30 hover:border-amber-500 text-xs font-mono font-bold text-amber-400 hover:text-amber-300 transition-all flex items-center justify-center gap-1.5"
              >
                <span>Initiate Project Consultation</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* Edge Telemetry & Cloudflare Shield Status */}
            <div className="glass-card p-4 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-cyan-400" />
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-dark-200">
                    Global Edge Status
                  </h4>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-semibold">
                  Cloudflare Argo
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center font-mono">
                <div className="glass-subcard p-2.5">
                  <span className="text-[10px] text-dark-400 block">Edge Latency</span>
                  <span className="text-sm font-bold text-emerald-400">18ms</span>
                </div>
                <div className="glass-subcard p-2.5">
                  <span className="text-[10px] text-dark-400 block">SSL Protocol</span>
                  <span className="text-sm font-bold text-amber-400">TLS 1.3</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: WORKSPACES (INTERACTIVE WORKSTATION HUB) */}
      {/* ========================================================= */}
      {activeTab === 'workspaces' && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="flex items-center justify-between px-1">
            <div>
              <h3 className="text-lg font-bold text-dark-100 flex items-center gap-2 font-mono">
                <span>Autonomous Workstation Network</span>
              </h3>
              <p className="text-xs text-dark-400 font-mono mt-0.5">
                Decoupled subdomains & production engineering suites
              </p>
            </div>
            <span className="text-xs font-mono text-amber-400 font-semibold">
              {filteredWorkstations.length} Active Nodes
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredWorkstations.map((w) => (
              <div
                key={w.title}
                className="glass-card p-5 flex flex-col justify-between hover:border-amber-500/40 hover:-translate-y-1 transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={cn('p-2.5 rounded-xl border', w.bg, w.border)}>
                      <w.icon className={cn('h-5 w-5', w.accent)} />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-dark-800 text-dark-300 border border-dark-700">
                        {w.badge}
                      </span>
                      <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                        {w.status}
                      </span>
                    </div>
                  </div>

                  <h4 className="text-base font-bold text-dark-100 group-hover:text-amber-400 transition-colors">
                    {w.title}
                  </h4>
                  <p className="text-xs font-mono text-dark-400 mt-0.5 truncate">
                    {w.subdomain}
                  </p>
                  <p className="text-xs text-dark-300 mt-2.5 leading-relaxed">
                    {w.desc}
                  </p>

                  <div className="mt-4 pt-3 border-t border-white/5 space-y-1.5">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-dark-500 font-semibold">
                      Core Features:
                    </span>
                    <ul className="grid grid-cols-2 gap-1 text-[11px] text-dark-300 font-mono">
                      {w.features.map((f) => (
                        <li key={f} className="flex items-center gap-1.5 truncate">
                          <span className="h-1 w-1 rounded-full bg-amber-400 flex-shrink-0" />
                          <span className="truncate">{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between gap-2">
                  <Link
                    to={w.internalPath}
                    className="text-xs font-mono font-semibold text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1"
                  >
                    <span>Embedded</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Link>

                  <a
                    href={w.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="v7-btn-gold text-xs font-mono font-bold px-3 py-1.5 rounded-xl text-dark-950 inline-flex items-center gap-1.5 shadow-sm"
                  >
                    <span>Launch</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: TELEMETRY & SYSTEM ANALYTICS */}
      {/* ========================================================= */}
      {activeTab === 'analytics' && (
        <div className="space-y-5 animate-in fade-in duration-300">
          <div className="glass-card p-5">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/5">
              <div className="flex items-center gap-2.5">
                <Cpu className="h-5 w-5 text-amber-400" />
                <h3 className="text-base font-bold font-mono text-dark-100 uppercase tracking-wide">
                  Server Telemetry & Infrastructure Health
                </h3>
              </div>
              <span className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-semibold">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                All Daemons Active
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="glass-subcard p-4 space-y-1">
                <span className="text-[11px] font-mono text-dark-400">CPU Architecture</span>
                <p className="text-xl font-bold font-mono text-dark-100">x86_64 8 Cores</p>
                <div className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 mt-1">
                  <Activity className="h-3 w-3" />
                  <span>Load Avg: 0.18, 0.22, 0.19</span>
                </div>
              </div>

              <div className="glass-subcard p-4 space-y-1">
                <span className="text-[11px] font-mono text-dark-400">Memory Allocation</span>
                <p className="text-xl font-bold font-mono text-dark-100">3.4 GB / 16 GB</p>
                <div className="flex items-center gap-1 text-[10px] font-mono text-cyan-400 mt-1">
                  <Radio className="h-3 w-3" />
                  <span>21.25% Utilization</span>
                </div>
              </div>

              <div className="glass-subcard p-4 space-y-1">
                <span className="text-[11px] font-mono text-dark-400">DNS Query Latency</span>
                <p className="text-xl font-bold font-mono text-dark-100">1.2ms (Local)</p>
                <div className="flex items-center gap-1 text-[10px] font-mono text-amber-400 mt-1">
                  <CheckCircle2 className="h-3 w-3" />
                  <span>BIND9 Authoritative</span>
                </div>
              </div>

              <div className="glass-subcard p-4 space-y-1">
                <span className="text-[11px] font-mono text-dark-400">Security Cipher</span>
                <p className="text-xl font-bold font-mono text-dark-100">ChaCha20-Poly1305</p>
                <div className="flex items-center gap-1 text-[10px] font-mono text-purple-400 mt-1">
                  <Shield className="h-3 w-3" />
                  <span>TLS 1.3 Strict Mode</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SettigationGlassyDashboard;
