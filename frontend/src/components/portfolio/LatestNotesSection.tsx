import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { BookOpen, ArrowRight, ChevronRight, Calendar, Tag, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';
import { notesApi } from '../../services/api';
import { TechnicalNote } from '../../types';
import { formatDate } from '../../utils';

interface NoteItem {
  title: string;
  category: string;
  date: string;
  slug: string;
  excerpt: string;
}

const fallbackNotes: NoteItem[] = [
  {
    title: 'Konfigurasi Runtime PHP, PHP-FPM, Ekstensi & Hardening Keamanan di Linux',
    category: 'Server & Linux',
    date: '2026-09-12',
    slug: 'php-runtime-fpm-configuration',
    excerpt: 'Panduan lengkap konfigurasi pool PHP-FPM, alokasi memori process manager, isolasi user systemd, dan hardening php.ini untuk keamanan lingkungan produksi.',
  },
  {
    title: 'Pemrograman Backend PHP Modern: PDO Database, REST API & Sanitasi Keamanan',
    category: 'Backend Dev',
    date: '2026-09-12',
    slug: 'php-modern-backend-development',
    excerpt: 'Penerapan prepared statements PDO terhadap serangan SQL Injection, sanitasi input payload, struktur RESTful API controller, dan response JSON terstandarisasi.',
  },
  {
    title: 'Arsitektur Web Server Dinamis (LAMP Stack + BIND9 DNS + MariaDB)',
    category: 'Architecture',
    date: '2026-09-10',
    slug: 'integrated-dynamic-web-server',
    excerpt: 'Integrasi arsitektur web server terpadu di Debian Linux: name server BIND9 otoritatif lokal, VirtualHosts Apache2, dan persistence database MariaDB.',
  },
  {
    title: 'Instalasi, Hardening Keamanan & Manajemen SQL MariaDB di Linux',
    category: 'Database',
    date: '2026-09-10',
    slug: 'mariadb-database-configuration',
    excerpt: 'Benchmark konfigurasi mariadb-secure-installation, manajemen hak akses privilege database, tuning buffer pool InnoDB, dan pencadangan otomatis mysqldump.',
  },
];

export const LatestNotesSection: React.FC = () => {
  const { data: notesData } = useQuery({
    queryKey: ['notes', 'portfolio-latest'],
    queryFn: () => notesApi.getAll({ limit: 4, published: true }),
    staleTime: 60000,
  });

  const displayNotes: NoteItem[] = useMemo(() => {
    if (notesData?.data && Array.isArray(notesData.data) && notesData.data.length > 0) {
      return notesData.data.slice(0, 4).map((n: TechnicalNote) => ({
        title: n.title,
        category: n.category || 'Tech',
        date: n.createdAt || n.updatedAt || '2026-09-12',
        slug: n.slug,
        excerpt: n.summary || (n.content ? n.content.replace(/[#*`]/g, '').slice(0, 140) + '...' : 'Panduan teknis konfigurasi sistem dan server Linux.'),
      }));
    }
    return fallbackNotes;
  }, [notesData]);

  return (
    <section id="notes-section" className="space-y-8" aria-labelledby="notes-heading">
      {/* Section Header Tycami Style */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <span className="text-xs sm:text-sm font-mono text-purple-400 font-semibold tracking-widest">// 06</span>
          <h2 id="notes-heading" className="text-xs sm:text-sm font-mono uppercase tracking-[0.2em] text-white font-bold">
            Technical Knowledge Notes
          </h2>
        </div>

        <Link
          to="/notes"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-white transition-colors group"
        >
          <span>View All Knowledge Notes</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Grid of Notes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {displayNotes.map((note) => (
          <Link
            key={note.slug}
            to={`/notes/${note.slug}`}
            className="group p-6 rounded-2xl bg-[#0d121f] border border-white/10 hover:border-purple-500/30 transition-all duration-300 flex flex-col justify-between space-y-4 shadow-sm hover:shadow-xl"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/20 uppercase tracking-wider">
                  {note.category}
                </span>
                <span className="text-2xs font-mono text-slate-500">
                  {formatDate(note.date)}
                </span>
              </div>

              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight group-hover:text-purple-300 transition-colors line-clamp-2">
                {note.title}
              </h3>

              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-sans line-clamp-3">
                {note.excerpt}
              </p>
            </div>

            <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono text-purple-400 group-hover:text-purple-300">
              <span className="font-semibold">Baca Panduan Lengkap</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
