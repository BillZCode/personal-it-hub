import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { notesApi } from '../../services/api';
import { Card, Badge, Input, Select } from '../../components/ui';
import { BookOpen, Tag, Search, ChevronRight, BookMarked, X } from 'lucide-react';
import { cn, formatRelativeTime } from '../../utils';
import { TechnicalNote } from '../../types';
import { Link } from 'react-router-dom';
import { allNotesList } from '../../data/notesData';
import { useDocumentTitle } from '../../hooks';

const titleCollator = new Intl.Collator('id-ID', { sensitivity: 'base' });

export function Notes() {
  useDocumentTitle('Technical Notes & Systems Documentation');
  const [search, setSearch] = useState('');

  const [categoryFilter, setCategoryFilter] = useState('');
  const [tagFilter, setTagFilter] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'title'>('date');

  const { data } = useQuery({
    queryKey: ['notes'],
    queryFn: () => notesApi.getAll(),
    placeholderData: { data: allNotesList as TechnicalNote[], total: allNotesList.length, page: 1, limit: 20, totalPages: 1 },
  });

  const notes = useMemo(() => {
    return (data?.data && data.data.length > 0) ? (data.data as TechnicalNote[]) : (allNotesList as TechnicalNote[]);
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
        const matchesSearch = !searchLower ||
          note.title.toLowerCase().includes(searchLower) ||
          note.summary.toLowerCase().includes(searchLower) ||
          note.tags.some((t) => t.toLowerCase().includes(searchLower));
        const matchesCategory = !categoryFilter || note.category === categoryFilter;
        const matchesTag = !tagFilter || note.tags.includes(tagFilter);
        return matchesSearch && matchesCategory && matchesTag;
      })
      .sort((a, b) => {
        if (sortBy === 'date') return new Date(b.publishedAt || b.createdAt).getTime() - new Date(a.publishedAt || a.createdAt).getTime();
        return titleCollator.compare(a.title, b.title);
      });
  }, [notes, search, categoryFilter, tagFilter, sortBy]);

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in pb-16">
      <div className="border-b border-dark-800/80 pb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-dark-100 flex items-center gap-2.5 tracking-tight font-sans">
            <BookMarked className="h-7 w-7 text-amber-400" aria-hidden="true" />
            Technical Notes
          </h1>
          <p className="text-dark-400 text-sm mt-1">Documentation, cheatsheets, and network/Linux engineering guides</p>
        </div>
      </div>

      <div className="p-4 rounded-xl space-y-4 bg-dark-900/40 border border-dark-800">
        <div className="flex flex-col sm:flex-row gap-4">
          <Input
            placeholder="Cari artikel, konfigurasi command, atau topik..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="h-4 w-4" />}
            aria-label="Cari artikel, konfigurasi command, atau topik"
            className="flex-1"
          />
          <Select
            placeholder="Semua Kategori"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            options={[
              { value: '', label: 'Semua Kategori' },
              ...categories.map(c => ({ value: c, label: c })),
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
              className="px-3 py-2 rounded-xl bg-dark-800 hover:bg-dark-750 text-dark-300 hover:text-white border border-dark-750 text-xs font-mono flex items-center justify-center gap-1.5 transition-colors"
              title="Reset semua filter catatan"
              aria-label="Reset semua filter catatan"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Reset</span>
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-1.5 pt-3 border-t border-dark-800/80" role="group" aria-label="Filter tag populer">
          <span className="text-2xs font-mono text-dark-500 mr-2 flex items-center gap-1">
            <Tag className="h-3 w-3 text-amber-400" aria-hidden="true" /> Tag Populer:
          </span>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setTagFilter(tagFilter === tag ? '' : tag)}
              aria-pressed={tagFilter === tag}
              className={cn(
                'px-2 py-0.5 rounded text-2xs font-mono transition-colors border focus:outline-none focus-visible:ring-1 focus-visible:ring-amber-400',
                tagFilter === tag 
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' 
                  : 'bg-dark-850 text-dark-400 border-dark-750 hover:text-dark-200'
              )}
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>

      {filteredNotes.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-dark-600 mx-auto mb-4" aria-hidden="true" />
          <p className="text-dark-400">Tidak ada technical notes yang cocok dengan kriteria filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4" role="list" aria-label="Koleksi Technical Notes">
          {filteredNotes.map((note) => (
            <Link
              key={note.slug}
              to={`/notes/${note.slug}`}
              className="block group"
              role="listitem"
              aria-label={`Buka panduan teknis: ${note.title}`}
            >
              <Card className="p-5 h-full card-hover border border-dark-800 bg-dark-900/60 hover:border-amber-500/40 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <Badge variant="info" className="text-2xs font-mono">{note.category}</Badge>
                    <span className="text-2xs text-dark-500 font-mono">
                      {formatRelativeTime(note.publishedAt || note.createdAt)}
                    </span>
                  </div>
                  <h2 className="text-base sm:text-lg font-semibold text-dark-100 group-hover:text-amber-400 transition-colors mb-2 font-mono">
                    {note.title}
                  </h2>
                  <p className="text-dark-400 text-xs sm:text-sm mb-4 line-clamp-2 leading-relaxed">
                    {note.summary}
                  </p>
                </div>
                <div>
                  <div className="flex items-center justify-between pt-3 border-t border-dark-800/80">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {note.tags.slice(0, 4).map((tag) => (
                        <span key={tag} className="text-2xs font-mono text-dark-400 bg-dark-850 px-2 py-0.5 rounded border border-dark-750">
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <span className="text-2xs font-mono text-amber-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform flex-shrink-0">
                      Baca Panduan <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default Notes;