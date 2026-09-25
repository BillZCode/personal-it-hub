import { useRef } from 'react';
import { StellarHeroParallax } from '../../components/parallax';
import { gsap, useGSAP } from '../../hooks';
import {
  FileText, Terminal, Gamepad2, Music, Sparkles, ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { cn, formatRelativeTime } from '../../utils';
import { Link } from 'react-router-dom';

const latestNotes = [
  { title: 'Konfigurasi Runtime PHP, PHP-FPM, Ekstensi & Hardening Keamanan di Linux', category: 'Server', date: '2026-09-12', slug: 'php-runtime-fpm-configuration' },
  { title: 'Pemrograman Backend PHP Modern: PDO Database, REST API & Sanitasi Keamanan', category: 'Backend', date: '2026-09-12', slug: 'php-modern-backend-development' },
  { title: 'Arsitektur Web Server Dinamis (LAMP Stack + BIND9 DNS + MariaDB)', category: 'Architecture', date: '2026-09-10', slug: 'integrated-dynamic-web-server' },
  { title: 'Instalasi, Hardening Keamanan & Manajemen SQL MariaDB di Linux', category: 'Database', date: '2026-09-10', slug: 'mariadb-database-configuration' },
];

const latestChangelog = [
  { version: 'v2.6.2', date: '2026-09-12', highlights: ['Added PHP & PHP-FPM runtime modules', 'Modern PHP 8+ PDO & REST API guides', 'Hardening security benchmarks'] },
  { version: 'v2.6.0', date: '2026-09-11', highlights: ['Next-Gen Dynamic Animations & Progressive UI', 'Multi-zone BIND9 DNS support', 'Private Cloud Drive streaming'] },
];

const currently = [
  { icon: Terminal, label: 'Daily Driver', value: 'Arch + Hyprland / Debian Serv', status: 'Active Workspace', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  { icon: Gamepad2, label: 'Gaming', value: 'Strinova / Arknights: Endfield', status: 'Playing', color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
  { icon: Music, label: 'Listening', value: 'Synthwave & Lo-Fi Beats', status: 'Now Playing', color: 'text-purple-400', bg: 'bg-purple-500/10' },
];

export function Dashboard() {
  const dashboardRef = useRef<HTMLDivElement>(null);

  // GSAP smooth entrance animations across Dashboard sections
  useGSAP(() => {
    // 1. Technical Knowledge Notes & Changelog items reveal
    gsap.fromTo(
      '.dashboard-note-item',
      { opacity: 0, x: -16 },
      { opacity: 1, x: 0, stagger: 0.06, duration: 0.5, ease: 'power2.out' }
    );

    gsap.fromTo(
      '.dashboard-changelog-item',
      { opacity: 0, x: 16 },
      { opacity: 1, x: 0, stagger: 0.06, duration: 0.5, ease: 'power2.out' }
    );

    // 2. Current Workspace Environment cards
    gsap.fromTo(
      '.dashboard-env-card',
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, stagger: 0.08, duration: 0.5, ease: 'power2.out' }
    );
  }, { scope: dashboardRef });

  return (
    <div ref={dashboardRef} className="space-y-10 animate-in pb-16">
      {/* Interactive Stellar Space Parallax Hero (StellarX Inspiration) */}
      <StellarHeroParallax />





      {/* Two-Column Section: Latest Knowledge Notes & Changelog */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Latest Notes */}
        <section className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-emerald-500 dark:text-emerald-400" />
              <h2 className="text-base sm:text-lg font-bold font-mono text-dark-100 uppercase tracking-wide">
                TECHNICAL KNOWLEDGE NOTES
              </h2>
            </div>
            <Link
              to="/notes"
              className="text-2xs font-mono text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 flex items-center gap-1 transition-colors font-semibold"
            >
              <span>View All</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {latestNotes.map((note) => (
              <Link
                key={note.slug}
                to={`/notes/${note.slug}`}
                className="dashboard-note-item block p-4 rounded-xl bg-dark-900/80 dark:bg-dark-900/60 backdrop-blur-md border border-dark-750/80 shadow-console hover:shadow-card-hover hover:border-emerald-500/40 group transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm sm:text-base text-dark-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition-colors line-clamp-1">
                      {note.title}
                    </h3>
                    <div className="flex items-center gap-2.5 mt-2">
                      <span className="text-2xs font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 font-semibold">
                        {note.category}
                      </span>
                      <span className="text-xs text-dark-500 font-mono">
                        {formatRelativeTime(note.date)}
                      </span>
                    </div>
                  </div>
                  <div className="p-2 rounded-lg bg-dark-800 dark:bg-dark-850 text-dark-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 border border-dark-700/60 transition-colors shadow-sm">
                    <ChevronRight className="h-4 w-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Latest Changelog */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-cyan-500 dark:text-cyan-400" />
              <h2 className="text-base sm:text-lg font-bold font-mono text-dark-100 uppercase tracking-wide">
                CHANGELOG
              </h2>
            </div>
            <Link
              to="/changelog"
              className="text-2xs font-mono text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 flex items-center gap-1 transition-colors font-semibold"
            >
              <span>History</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {latestChangelog.map((cl) => (
              <div
                key={cl.version}
                className="dashboard-changelog-item p-4 rounded-xl bg-dark-900/80 dark:bg-dark-900/60 backdrop-blur-md border border-dark-750/80 shadow-console"
              >
                <div className="flex items-center justify-between mb-2.5">
                  <span className="font-mono text-xs font-bold text-cyan-700 dark:text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                    {cl.version}
                  </span>
                  <span className="text-xs text-dark-500 font-mono">
                    {formatRelativeTime(cl.date)}
                  </span>
                </div>
                <ul className="space-y-1.5 text-xs text-dark-300 font-sans">
                  {cl.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold leading-none mt-0.5">+</span>
                      <span className="leading-tight">{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Currently Active Setup & Daily Driver */}
      <section className="space-y-4">
        <h2 className="text-base sm:text-lg font-bold font-mono text-dark-100 uppercase tracking-wide flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-emerald-500 dark:text-emerald-400" />
          CURRENT WORKSPACE ENVIRONMENT
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {currently.map((item) => (
            <div
              key={item.label}
              className="dashboard-env-card p-4 rounded-xl bg-dark-900/80 dark:bg-dark-900/60 backdrop-blur-md border border-dark-750/80 shadow-console flex items-center justify-between group hover:border-emerald-500/30 hover:shadow-card-hover transition-all"
            >
              <div className="flex items-center gap-3">
                <div className={cn('p-2.5 rounded-xl border border-dark-700/60 dark:border-white/5 group-hover:scale-105 transition-transform shadow-sm', item.bg)}>
                  <item.icon className={cn('h-5 w-5', item.color)} />
                </div>
                <div>
                  <p className="text-2xs text-dark-400 uppercase font-mono tracking-wider font-semibold">
                    {item.label}
                  </p>
                  <p className="font-semibold text-xs sm:text-sm text-dark-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition-colors">
                    {item.value}
                  </p>
                </div>
              </div>
              <span className="text-2xs font-mono px-2.5 py-1 rounded-full bg-dark-800 dark:bg-dark-850 text-dark-300 border border-dark-750/80 shadow-sm">
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Dashboard;