import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { notesApi } from '../../services/api';
import { Card, Badge } from '../../components/ui';
import { LoadingState } from '../../components/feedback/LoadingStates';
import { Calendar, Clock, ArrowLeft, Copy, Check } from 'lucide-react';
import { cn, formatDate, formatRelativeTime } from '../../utils';
import ReactMarkdown from 'react-markdown';
import { allNotesMap, allNotesList } from '../../data/notesData';

function extractHeadings(content: string) {
  if (!content) return [];
  // Strip fenced code blocks so code comments (e.g. # in bash/python) are not treated as headings
  const cleanContent = content.replace(/```[\s\S]*?```/g, '');
  const headingRegex = /^(#{1,3})\s+(.+)$/gm;
  const headings = [];
  let match;
  while ((match = headingRegex.exec(cleanContent)) !== null) {
    headings.push({
      level: match[1].length,
      text: match[2],
      slug: match[2].toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-'),
    });
  }
  return headings;
}

export function NoteDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [tocOpen, setTocOpen] = useState(true);

  // Check local data first for guaranteed availability
  const localNote = slug ? allNotesMap[slug] : undefined;

  const { data: note, isLoading } = useQuery({
    queryKey: ['notes', slug],
    queryFn: async () => {
      try {
        const res = await notesApi.getBySlug(slug!);
        if (res && res.content) return res;
      } catch {
        // Fallback to local
      }
      return localNote;
    },
    enabled: !!slug,
    initialData: localNote,
  });

  const activeNote = note || localNote;

  const headings = activeNote ? extractHeadings(activeNote.content) : [];

  if (isLoading && !activeNote) return <LoadingState text="Loading article..." />;
  if (!activeNote) return (
    <div className="text-center py-16">
      <h2 className="text-2xl font-bold text-dark-100 mb-2">Article Not Found</h2>
      <p className="text-dark-400 mb-6">Materi teknis dengan slug "{slug}" belum tersedia atau telah dipindahkan.</p>
      <Link to="/notes" className="btn-primary inline-flex"><ArrowLeft className="h-4 w-4 mr-2" />Kembali ke Technical Notes</Link>
    </div>
  );

  const relatedNotes = allNotesList
    .filter(n => n.category === activeNote.category && n.slug !== activeNote.slug)
    .slice(0, 4);

  const copyToClipboard = async (code: string, language: string) => {
    await navigator.clipboard.writeText(code);
    setCopiedCode(language);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in pb-16">
      <Link to="/notes" className="inline-flex items-center gap-2 text-xs font-mono text-dark-400 hover:text-emerald-400 transition-colors">
        <ArrowLeft className="h-4 w-4" />
        Kembali ke Daftar Notes
      </Link>

      <article className="space-y-6">
        <header className="space-y-4 border-b border-dark-800/80 pb-6">
          <div className="flex items-center gap-2">
            <Badge variant="info" className="text-2xs font-mono">{activeNote.category}</Badge>
            <span className="text-xs text-dark-500 font-mono">{formatRelativeTime(activeNote.publishedAt || activeNote.createdAt)}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-dark-100 font-sans tracking-tight leading-snug">{activeNote.title}</h1>
          <p className="text-dark-400 text-sm sm:text-base leading-relaxed">{activeNote.summary}</p>
          <div className="flex flex-wrap items-center gap-4 text-xs text-dark-500 pt-2 font-mono">
            <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5 text-emerald-400" />{formatDate(activeNote.publishedAt || activeNote.createdAt)}</span>
            <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-emerald-400" />{activeNote.readingTime} min read</span>
            <div className="flex gap-1.5">
              {activeNote.tags.map((tag) => (
                <Badge key={tag} variant="neutral" className="text-2xs font-mono">#{tag}</Badge>
              ))}
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1 hidden lg:block">
            <div className="sticky top-24 space-y-4">
              <Card className="p-4 bg-dark-900/60 border border-dark-800">
                <h3 className="font-semibold text-dark-100 mb-3 flex items-center justify-between text-xs font-mono uppercase text-emerald-400">
                  Daftar Isi
                  <button onClick={() => setTocOpen(!tocOpen)} className="text-dark-400 hover:text-emerald-400 text-2xs">
                    {tocOpen ? 'Tutup' : 'Buka'}
                  </button>
                </h3>
                {tocOpen && headings.length > 0 ? (
                  <nav className="space-y-1.5">
                    {headings.map((heading) => (
                      <a
                        key={heading.slug}
                        href={`#${heading.slug}`}
                        className={cn(
                          'block text-xs text-dark-400 hover:text-emerald-400 transition-colors pl-2 border-l-2',
                          heading.level === 1 ? 'border-emerald-500 font-medium text-dark-200' : 'border-dark-800',
                          heading.level >= 2 && 'ml-2'
                        )}
                      >
                        {heading.text}
                      </a>
                    ))}
                  </nav>
                ) : (
                  <p className="text-dark-500 text-xs">Tidak ada sub-judul</p>
                )}
              </Card>

              {relatedNotes.length > 0 && (
                <Card className="p-4 bg-dark-900/60 border border-dark-800">
                  <h3 className="font-semibold text-dark-100 mb-3 text-xs font-mono uppercase text-emerald-400">Materi Terkait</h3>
                  <ul className="space-y-2">
                    {relatedNotes.map((related) => (
                      <li key={related.id}>
                        <Link to={`/notes/${related.slug}`} className="text-xs text-dark-400 hover:text-emerald-400 transition-colors line-clamp-2 block leading-snug">
                          • {related.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </Card>
              )}
            </div>
          </aside>

          <div className="lg:col-span-3">
            <div className="prose prose-invert max-w-none prose-headings:text-dark-100 prose-headings:font-semibold prose-a:text-emerald-400 prose-a:no-underline hover:prose-a:underline prose-code:bg-dark-850 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-emerald-400 prose-code:before:content-none prose-code:after:content-none prose-pre:bg-dark-900 prose-pre:border prose-pre:border-dark-750 prose-pre:rounded-xl">
              <ReactMarkdown
                components={{
                  code: ({ node, className, children, ...props }) => {
                    const match = /language-(\w+)/.exec(className || '');
                    const language = match ? match[1] : '';
                    const codeString = String(children).replace(/\n$/, '');

                    if (!match) {
                      return (
                        <code className="bg-dark-850 text-emerald-400 px-1.5 py-0.5 rounded text-xs font-mono border border-dark-750" {...props}>
                          {children}
                        </code>
                      );
                    }

                    return (
                      <div className="relative group my-4 rounded-xl overflow-hidden border border-dark-750 bg-dark-950">
                        <div className="flex items-center justify-between px-4 py-2 bg-dark-900 border-b border-dark-800">
                          <span className="text-2xs text-dark-400 font-mono uppercase">{language || 'code'}</span>
                          <button
                            onClick={() => copyToClipboard(codeString, language)}
                            className="p-1 rounded bg-dark-800 text-dark-300 hover:text-emerald-400 transition-colors"
                            aria-label="Copy code"
                          >
                            {copiedCode === language ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                          </button>
                        </div>
                        <pre className="p-4 overflow-x-auto text-xs font-mono leading-relaxed bg-dark-950/90 text-dark-200">
                          <code>{children}</code>
                        </pre>
                      </div>
                    );
                  },
                }}
              >
                {activeNote.content}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      </article>

      <footer className="pt-8 border-t border-dark-800 flex items-center justify-between">
        <Link to="/notes" className="btn-secondary inline-flex text-xs">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Semua Notes
        </Link>
      </footer>
    </div>
  );
}

export default NoteDetail;