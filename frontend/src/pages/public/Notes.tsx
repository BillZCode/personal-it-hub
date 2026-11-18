import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { notesApi } from '../../services/api';
import { Input, Select } from '../../components/ui';
import { BookOpen, Tag, Search, ChevronRight, X } from 'lucide-react';
import { cn, formatRelativeTime } from '../../utils';
import { TechnicalNote } from '../../types';
import { Link } from 'react-router-dom';
import { allNotesList } from '../../data/notesData';
import { useDocumentTitle } from '../../hooks';

const titleCollator = new Intl.Collator('id-ID', { sensitivity: 'base' });

const SEMANTIC_BADGES = [
  'bg-[#5B8DEF]/15 text-[#5B8DEF] border-[#5B8DEF]/40',
  'bg-[#4ED69E]/15 text-[#4ED69E] border-[#4ED69E]/40',
  'bg-[#F7C95C]/15 text-[#F7C95C] border-[#F7C95C]/40',
  'bg-[#F26676]/15 text-[#F26676] border-[#F26676]/40',
];

export function Notes() {
  useDocumentTitle('Technical Notes & Systems Documentation');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [tagFilter, setTagFilter] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'title'>('date');

  const { data } = useQuery({
    queryKey: ['notes'],
    queryFn: () => notesApi.getAll(),
    placeholderData: {
      data: allNotesList as TechnicalNote[],
      total: allNotesList.length,
      page: 1,
      limit: 20,
      totalPages: 1,
    },
  });

  const notes = useMemo(() => {
    return data?.data && data.data.length > 0
      ? (data.data as TechnicalNote[])
      : (allNotesList as TechnicalNote[]);
  }, [data]);

  const categories = useMemo(() => {
    return [...new Set(notes.map((n) => n.category))].sort();
  }, [notes]);

  const allTags = useMemo(() => {
    return [...new Set(notes.flatMap((n) => n.tags))].sort();
  }, [notes]);

  const filteredNotes = useMemo(() => {
    const searchLower = search.toLowerCase().trim();
    return notes
      .filter((note) => {
        const matchesSearch =
          !searchLower ||
          note.title.toLowerCase().includes(searchLower) ||
          note.summary.toLowerCase().includes(searchLower) ||
          note.tags.some((t) => t.toLowerCase().includes(searchLower));
        const matchesCategory = !categoryFilter || note.category === categoryFilter;
        const matchesTag = !tagFilter || note.tags.includes(tagFilter);
        return matchesSearch && matchesCategory && matchesTag;
      })
      .sort((a, b) => {
        if (sortBy === 'date')
          return (
            new Date(b.publishedAt || b.createdAt).getTime() -
            new Date(a.publishedAt || a.createdAt).getTime()
          );
        return titleCollator.compare(a.title, b.title);
      });
  }, [notes, search, categoryFilter, tagFilter, sortBy]);

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in pb-16">
      {/* Mega Project Nocturne Header */}
      <div className="border-b border-white/[0.06] pb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-medium text-[#F4F3F8] tracking-tight">
            Technical{' '}
            <span className="italic font-normal text-[#D2D8F0]">Notes</span>
          </h1>
          <p className="text-[#8E9AB5] text-sm mt-2">
            Documentation, cheatsheets, and network/Linux engineering guides
          </p>
        </div>

        <span className="px-3.5 py-1.5 rounded-full bg-[#0D101A] border border-white/[0.08] text-xs font-mono text-[#A3ADC4] shrink-0">
          {filteredNotes.length} Artikel Tersedia
        </span>
      </div>

      {/* Filter Surface */}
      <div className="p-5 rounded-2xl space-y-4 bg-[#0D101A] border border-white/[0.08] shadow-nocturneCard">
        <div className="flex flex-col sm:flex-row gap-4">
          <Input
            placeholder="Cari artikel, konfigurasi command, atau topik..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="h-4 w-4 text-[#5B8DEF]" />}
            aria-label="Cari artikel, konfigurasi command, atau topik"
            className="flex-1"
          />
          <Select
            placeholder="Semua Kategori"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            options={[
              { value: '', label: 'Semua Kategori' },
              ...categories.map((c) => ({ value: c, label: c })),
            ]}
            aria-label="Filter kategori"
            className="w-full sm:w-48"
          />
          <Select
            placeholder="Urutkan Berdasarkan"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'date' | 'title')}
            options={[
              { value: 'date', label: 'Terbaru' },
              { value: 'title', label: 'Judul (A-Z)' },
            ]}
            aria-label="Urutkan catatan"
            className="w-full sm:w-40"
          />
          {(search || categoryFilter || tagFilter || sortBy !== 'date') && (
            <button
              onClick={() => {
                setSearch('');
                setCategoryFilter('');
                setTagFilter('');
                setSortBy('date');
              }}
              className="px-4 py-2 rounded-full bg-[#F4F3F8] hover:bg-white text-[#080A10] text-xs font-sans font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-glowPill"
              title="Reset semua filter catatan"
              aria-label="Reset semua filter catatan"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Reset</span>
            </button>
          )}
        </div>

        <div
          className="flex flex-wrap items-center gap-1.5 pt-3.5 border-t border-white/[0.06]"
          role="group"
          aria-label="Filter tag populer"
        >
          <span className="text-xs font-mono text-[#8E9AB5] mr-2 flex items-center gap-1.5">
            <Tag className="h-3.5 w-3.5 text-[#5B8DEF]" aria-hidden="true" /> Tag Populer:
          </span>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setTagFilter(tagFilter === tag ? '' : tag)}
              aria-pressed={tagFilter === tag}
              className={cn(
                'px-3 py-1 rounded-full text-[11px] font-mono transition-all border',
                tagFilter === tag
                  ? 'bg-[#F4F3F8] text-[#080A10] border-white font-semibold shadow-glowPill'
                  : 'bg-[#080A10] text-[#8E9AB5] border-white/[0.08] hover:border-white/25 hover:text-[#F4F3F8]'
              )}
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>

      {filteredNotes.length === 0 ? (
        <div className="text-center py-14 rounded-2xl bg-[#0D101A] border border-white/[0.08]">
          <BookOpen className="h-12 w-12 text-[#5E687E] mx-auto mb-4" aria-hidden="true" />
          <p className="text-[#8E9AB5] font-display text-base">
            Tidak ada technical notes yang cocok dengan kriteria filter.
          </p>
        </div>
      ) : (
        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
          role="list"
          aria-label="Koleksi Technical Notes"
        >
          {filteredNotes.map((note, idx) => {
            const badgeStyle = SEMANTIC_BADGES[idx % SEMANTIC_BADGES.length];
            return (
              <Link
                key={note.slug}
                to={`/notes/${note.slug}`}
                className="block group"
                role="listitem"
                aria-label={`Buka panduan teknis: ${note.title}`}
              >
                <div className="p-6 h-full rounded-2xl bg-[#0D101A] border border-white/[0.08] hover:border-white/25 transition-all duration-300 flex flex-col justify-between shadow-nocturneCard hover:-translate-y-0.5">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span
                        className={cn(
                          'px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase tracking-wider border',
                          badgeStyle
                        )}
                      >
                        {note.category}
                      </span>
                      <span className="text-[11px] text-[#5E687E] font-mono">
                        {formatRelativeTime(note.publishedAt || note.createdAt)}
                      </span>
                    </div>
                    <h2 className="text-lg sm:text-xl font-display font-medium text-[#F4F3F8] group-hover:text-white transition-colors mb-2">
                      {note.title}
                    </h2>
                    <p className="text-[#8E9AB5] text-xs sm:text-sm mb-5 line-clamp-2 leading-relaxed">
                      {note.summary}
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {note.tags.slice(0, 4).map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] font-mono text-[#A3ADC4] bg-[#080A10] px-2.5 py-0.5 rounded-full border border-white/[0.08]"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <span className="text-xs font-mono font-semibold text-[#F4F3F8] group-hover:text-[#D2D8F0] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform flex-shrink-0">
                      Baca Panduan <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Notes;