import { useRef, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { StellarHeroParallax } from '../../components/parallax';
import { SettigationGlassyDashboard } from '../../components/dashboard/SettigationGlassyDashboard';
import { notesApi, changelogApi } from '../../services/api';
import { gsap, useGSAP, useDocumentTitle } from '../../hooks';
import {
  Terminal, Gamepad2, Music, Sparkles, ShieldCheck,
  ChevronRight, ArrowUpRight, BookOpen, Layers, Activity,
  CheckCircle2, Radio
} from 'lucide-react';
import { cn, formatRelativeTime } from '../../utils';
import { Link } from 'react-router-dom';
import type { TechnicalNote, ChangelogEntry } from '../../types';

interface DisplayNote {
  title: string;
  category: string;
  date: string;
  slug: string;
  badgeClass: string;
}

interface DisplayChangelog {
  version: string;
  date: string;
  status: string;
  highlights: string[];
}

const defaultLatestNotes: DisplayNote[] = [
  { 
    title: 'Konfigurasi Runtime PHP, PHP-FPM, Ekstensi & Hardening Keamanan di Linux', 
    category: 'Server', 
    date: '2026-09-12', 
    slug: 'php-runtime-fpm-configuration',
    badgeClass: 'text-cyan-700 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-500/10 border-cyan-200 dark:border-cyan-500/20'
  },
  { 
    title: 'Pemrograman Backend PHP Modern: PDO Database, REST API & Sanitasi Keamanan', 
    category: 'Backend', 
    date: '2026-09-12', 
    slug: 'php-modern-backend-development',
    badgeClass: 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20'
  },
  { 
    title: 'Arsitektur Web Server Dinamis (LAMP Stack + BIND9 DNS + MariaDB)', 
    category: 'Architecture', 
    date: '2026-09-10', 
    slug: 'integrated-dynamic-web-server',
    badgeClass: 'text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-500/10 border-purple-200 dark:border-purple-500/20'
  },
  { 
    title: 'Instalasi, Hardening Keamanan & Manajemen SQL MariaDB di Linux', 
    category: 'Database', 
    date: '2026-09-10', 
    slug: 'mariadb-database-configuration',
    badgeClass: 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20'
  },
];

const defaultLatestChangelog = [
  { 
    version: 'v2.6.4', 
    date: '2026-09-13', 
    status: 'Stable Release',
    highlights: [
      'Virtual Cloud Drive: Mobile PDF viewer & playlist modal', 
      'Settigation Glassy Dashboard interactive workstations & telemetry', 
      'Security audit: Recursive storage cleanup & query token streaming'
    ] 
  },
  { 
    version: 'v2.6.2', 
    date: '2026-09-12', 
    status: 'Maintenance',
    highlights: [
      'Added PHP & PHP-FPM runtime modules', 
      'Modern PHP 8+ PDO & REST API guides', 
      'Hardening security benchmarks'
    ] 
  },
];

const currently = [
  { 
    icon: Terminal, 
    label: 'Daily Driver', 
    value: 'Arch + Hyprland / Debian Serv', 
    status: 'Active Workspace', 
    detail: 'Wayland Compositor & Linux Kernel 6.6',
    color: 'text-emerald-600 dark:text-emerald-400', 
    bg: 'bg-emerald-50 dark:bg-emerald-500/10',
    border: 'border-emerald-200 dark:border-emerald-500/20',
    hoverGlow: 'hover:border-emerald-500/40 hover:shadow-[0_12px_28px_-6px_rgba(16,185,129,0.16)]'
  },
  { 
    icon: Layers, 
    label: 'Primary Stack', 
    value: 'React 18 + Vite + Tailwind CSS', 
    status: 'Production Core', 
    detail: 'TypeScript & High Performance Motion',
    color: 'text-cyan-600 dark:text-cyan-400', 
    bg: 'bg-cyan-50 dark:bg-cyan-500/10',
    border: 'border-cyan-200 dark:border-cyan-500/20',
    hoverGlow: 'hover:border-cyan-500/40 hover:shadow-[0_12px_28px_-6px_rgba(6,182,212,0.16)]'
  },
  { 
    icon: Gamepad2, 
    label: 'Tactical Gaming', 
    value: 'Strinova / Arknights: Endfield', 
    status: 'Recreation', 
    detail: 'Anime Third-Person Shooter & Tactical RPG',
    color: 'text-purple-600 dark:text-purple-400', 
    bg: 'bg-purple-50 dark:bg-purple-500/10',
    border: 'border-purple-200 dark:border-purple-500/20',
    hoverGlow: 'hover:border-purple-500/40 hover:shadow-[0_12px_28px_-6px_rgba(168,85,247,0.16)]'
  },
  { 
    icon: Music, 
    label: 'Focus Soundscape', 
    value: 'Synthwave & Lo-Fi Beats', 
    status: 'Now Streaming', 
    detail: 'Deep Immersion Coding Sessions',
    color: 'text-amber-600 dark:text-amber-400', 
    bg: 'bg-amber-50 dark:bg-amber-500/10',
    border: 'border-amber-200 dark:border-amber-500/20',
    hoverGlow: 'hover:border-amber-500/40 hover:shadow-[0_12px_28px_-6px_rgba(245,158,11,0.16)]'
  },
];

export function Dashboard() {
  const dashboardRef = useRef<HTMLDivElement>(null);
  useDocumentTitle('Dashboard — Portfolio & Infrastructure');


  // Live queries with resilient fallback
  const { data: notesData } = useQuery({
    queryKey: ['notes', 'dashboard'],
    queryFn: () => notesApi.getAll({ limit: 4, published: true }),
    staleTime: 60000,
  });

  const { data: changelogData } = useQuery({
    queryKey: ['changelog', 'dashboard'],
    queryFn: () => changelogApi.getAll(),
    staleTime: 60000,
  });

  const displayNotes: DisplayNote[] = useMemo(() => {
    if (notesData?.data && Array.isArray(notesData.data) && notesData.data.length > 0) {
      return notesData.data.slice(0, 4).map((n: TechnicalNote) => ({
        title: n.title,
        category: n.category || 'Tech',
        date: n.createdAt || n.updatedAt,
        slug: n.slug,
        badgeClass: 'text-cyan-700 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-500/10 border-cyan-200 dark:border-cyan-500/20',
      }));
    }
    return defaultLatestNotes;
  }, [notesData]);

  const displayChangelog: DisplayChangelog[] = useMemo(() => {
    if (changelogData && Array.isArray(changelogData) && changelogData.length > 0) {
      return changelogData.slice(0, 2).map((c: ChangelogEntry) => {
        const highlights: string[] = [
          ...(c.added || []),
          ...(c.improved || []),
          ...(c.fixed || []),
          ...(c.changed || []),
        ].slice(0, 3);

        return {
          version: c.version || 'v2.6.4',
          date: c.date || c.createdAt || '2026-09-13',
          status: 'Release',
          highlights: highlights.length > 0 ? highlights : ['System stability and performance enhancements'],
        };
      });
    }
    return defaultLatestChangelog;
  }, [changelogData]);

  // GSAP entrance animations with smooth physics
  useGSAP(() => {
    // 1. System Telemetry Bar Reveal
    gsap.fromTo(
      '.dashboard-telemetry-bar',
      { opacity: 0, y: -12 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
    );

    // 2. Technical Notes & Changelog Stagger Reveal
    gsap.fromTo(
      '.dashboard-note-item',
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, stagger: 0.08, duration: 0.55, ease: 'power2.out' }
    );

    gsap.fromTo(
      '.dashboard-changelog-item',
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, stagger: 0.08, duration: 0.55, ease: 'power2.out' }
    );

    // 3. Workspace Environment Bento Cards
    gsap.fromTo(
      '.dashboard-env-card',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, stagger: 0.07, duration: 0.6, ease: 'power2.out' }
    );
  }, { scope: dashboardRef, dependencies: [displayNotes, displayChangelog] });

  return (
    <div ref={dashboardRef} className="space-y-12 sm:space-y-16 animate-in pb-20">
      {/* 1. Sleek Cyber Telemetry Header Bar */}
      <div 
        className="dashboard-telemetry-bar w-full p-3.5 sm:p-4 rounded-2xl bg-white/80 dark:bg-[#0d121f]/70 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs font-mono shadow-sm dark:shadow-none transition-colors"
        role="region"
        aria-label="System Telemetry Status"
      >
        <div className="flex items-center gap-3">
          <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
          </span>
          <span className="text-slate-800 dark:text-slate-200 font-bold uppercase tracking-wider">
            System Node: Nominal
          </span>
          <span className="hidden md:inline text-slate-300 dark:text-white/20" aria-hidden="true">|</span>
          <span className="hidden md:inline text-slate-500 dark:text-slate-400">
            Debian Enterprise + Arch Linux
          </span>
        </div>

        <div className="flex items-center gap-4 sm:gap-6 text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5" title="Network ping latency">
            <Radio className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" aria-hidden="true" />
            <span className="text-slate-800 dark:text-slate-200 font-semibold">18ms</span>
            <span className="text-slate-400 dark:text-slate-500 text-2xs">Cloudflare</span>
          </div>
          <div className="flex items-center gap-1.5" title="Cluster uptime guarantee">
            <Activity className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
            <span className="text-slate-800 dark:text-slate-200 font-semibold">99.98%</span>
            <span className="text-slate-400 dark:text-slate-500 text-2xs">Uptime</span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5" title="TLS encryption protocol">
            <CheckCircle2 className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" aria-hidden="true" />
            <span className="text-slate-800 dark:text-slate-200 font-semibold">TLS 1.3</span>
          </div>
        </div>
      </div>

      {/* 2. Interactive Stellar Space Parallax Hero */}
      <StellarHeroParallax />

      {/* 3. Glassy Dashboard Hub & Workstations Bento */}
      <SettigationGlassyDashboard />

      {/* 4. Two-Column Section: Technical Knowledge Notes & Changelog */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Latest Technical Notes */}
        <section className="lg:col-span-2 space-y-5" aria-labelledby="tech-notes-heading">
          <div className="flex items-center justify-between pb-1">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400">
                <BookOpen className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <h2 id="tech-notes-heading" className="text-base sm:text-lg font-bold font-mono text-slate-900 dark:text-slate-100 uppercase tracking-wide">
                  Technical Knowledge Notes
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-mono hidden sm:block">
                  Linux administration, server architecture & backend guides
                </p>
              </div>
            </div>
            
            <Link
              to="/notes"
              aria-label="View all technical notes"
              className="text-xs font-mono font-semibold text-slate-600 hover:text-cyan-600 dark:text-slate-300 dark:hover:text-cyan-400 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/70 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/10 hover:border-cyan-500/40 transition-all group shadow-sm dark:shadow-none"
            >
              <span>View All</span>
              <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {displayNotes.map((note) => (
              <Link
                key={note.slug}
                to={`/notes/${note.slug}`}
                aria-label={`Read note: ${note.title}`}
                className="dashboard-note-item flex flex-col justify-between p-5 rounded-2xl bg-white/90 dark:bg-[#0d121f]/80 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 hover:border-cyan-500/40 hover:bg-slate-50/90 dark:hover:bg-[#111726]/90 shadow-sm hover:shadow-md dark:shadow-none dark:hover:shadow-[0_12px_32px_-8px_rgba(6,182,212,0.18)] group transition-all duration-300"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className={cn(
                      "text-2xs font-mono px-2.5 py-0.5 rounded-full border font-semibold tracking-wider uppercase",
                      note.badgeClass
                    )}>
                      {note.category}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                      {formatRelativeTime(note.date)}
                    </span>
                  </div>

                  <h3 className="font-semibold text-sm sm:text-base text-slate-900 dark:text-slate-100 group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors line-clamp-2 leading-snug">
                    {note.title}
                  </h3>
                </div>

                <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs font-mono text-slate-500 dark:text-slate-400 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                  <span className="text-2xs font-semibold">Read Documentation</span>
                  <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/5 group-hover:border-cyan-500/30 group-hover:bg-cyan-500/10 transition-colors">
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Latest Changelog */}
        <section className="space-y-5" aria-labelledby="changelog-heading">
          <div className="flex items-center justify-between pb-1">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400">
                <Sparkles className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <h2 id="changelog-heading" className="text-base sm:text-lg font-bold font-mono text-slate-900 dark:text-slate-100 uppercase tracking-wide">
                  Changelog
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-mono hidden sm:block">
                  Continuous updates & deployments
                </p>
              </div>
            </div>

            <Link
              to="/changelog"
              aria-label="View changelog history"
              className="text-xs font-mono font-semibold text-slate-600 hover:text-amber-600 dark:text-slate-300 dark:hover:text-amber-400 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/70 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/10 hover:border-amber-500/40 transition-all group shadow-sm dark:shadow-none"
            >
              <span>History</span>
              <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="space-y-4">
            {displayChangelog.map((cl) => (
              <div
                key={cl.version}
                className="dashboard-changelog-item p-5 rounded-2xl bg-white/90 dark:bg-[#0d121f]/80 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 hover:border-amber-500/40 hover:bg-slate-50/90 dark:hover:bg-[#111726]/90 shadow-sm hover:shadow-md dark:shadow-none dark:hover:shadow-[0_12px_32px_-8px_rgba(245,158,11,0.15)] transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-200 dark:border-amber-500/25">
                      {cl.version}
                    </span>
                    <span className="text-2xs font-mono text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-500/20 font-semibold">
                      {cl.status}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                    {formatRelativeTime(cl.date)}
                  </span>
                </div>

                <ul className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-sans" role="list">
                  {cl.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2.5" role="listitem">
                      <span className="text-amber-600 dark:text-amber-400 font-mono font-bold leading-none mt-1" aria-hidden="true">›</span>
                      <span className="leading-snug">{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* 5. Currently Active Setup & Daily Driver Bento Grid */}
      <section className="space-y-5" aria-labelledby="workspace-env-heading">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <h2 id="workspace-env-heading" className="text-base sm:text-lg font-bold font-mono text-slate-900 dark:text-slate-100 uppercase tracking-wide">
                Current Workspace Environment
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                Active operating systems, development toolchains & streaming services
              </p>
            </div>
          </div>
          <span className="text-2xs font-mono px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 font-semibold self-start sm:self-auto">
            All Systems Healthy
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5" role="list">
          {currently.map((item) => (
            <div
              key={item.label}
              tabIndex={0}
              role="listitem"
              className={cn(
                "dashboard-env-card p-5 rounded-2xl bg-white/90 dark:bg-[#0d121f]/80 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 hover:bg-slate-50/90 dark:hover:bg-[#111726]/90 shadow-sm hover:shadow-md dark:shadow-none transition-all duration-300 flex flex-col justify-between group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50",
                item.hoverGlow
              )}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className={cn('p-2.5 rounded-xl border group-hover:scale-105 transition-transform shadow-sm', item.bg, item.border)}>
                    <item.icon className={cn('h-5 w-5', item.color)} aria-hidden="true" />
                  </div>
                  <span className="text-2xs font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/[0.04] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10">
                    {item.status}
                  </span>
                </div>

                <p className="text-2xs text-slate-500 dark:text-slate-400 uppercase font-mono tracking-wider font-semibold">
                  {item.label}
                </p>
                <p className="font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100 group-hover:text-slate-950 dark:group-hover:text-white transition-colors mt-1">
                  {item.value}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/5">
                <p className="text-2xs text-slate-500 dark:text-slate-400 font-mono leading-relaxed">
                  {item.detail}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Dashboard;