import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { guestbookApi } from '../../services/api';
import { Card, Button, Input, Textarea } from '../../components/ui';
import { SkeletonCard } from '../../components/feedback/LoadingStates';
import { MessageSquare, Send, ChevronLeft, ChevronRight, User } from 'lucide-react';
import { formatRelativeTime } from '../../utils';
import { GuestbookEntry } from '../../types';
import { useToast, useDocumentTitle } from '../../hooks';

const sampleEntries: GuestbookEntry[] = [];

export function Guestbook() {
  useDocumentTitle('Guestbook');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [page, setPage] = useState(1);
  const limit = 10;
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['guestbook', page],
    queryFn: () => guestbookApi.getAll(page, limit),
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
  });

  const submitMutation = useMutation({
    mutationFn: (data: { name: string; message: string }) => guestbookApi.create(data),
    onSuccess: () => {
      showToast('Pesan berhasil terkirim dan disimpan!', 'success');
      setName('');
      setMessage('');
      queryClient.invalidateQueries({ queryKey: ['guestbook'] });
      queryClient.refetchQueries({ queryKey: ['guestbook'] });
    },
    onError: () => showToast('Gagal mengirim pesan', 'error'),
  });

  const entries = data?.data || sampleEntries;
  const totalPages = data?.totalPages || 1;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && message.trim()) {
      submitMutation.mutate({ name: name.trim(), message: message.trim() });
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in pb-16">
      <div className="border-b border-dark-800/80 pb-6">
        <h1 className="text-3xl font-bold text-dark-100 tracking-tight font-sans">Guestbook</h1>
        <p className="text-dark-400 text-sm mt-1">Tinggalkan pesan, jejak kunjungan, atau salam hangat di buku tamu publik</p>
      </div>

      <div className="v7-card-wrapper">
        <div className="v7-corner-tl" />
        <div className="v7-corner-br" />
        <div className="v7-glass-card p-6 sm:p-7 relative z-10">
          <h2 className="text-base font-bold font-mono text-dark-100 uppercase tracking-wider mb-4 flex items-center gap-2">
            <span className="w-1.5 h-4 bg-amber-400 rounded-full inline-block" />
            Tulis di Buku Tamu
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Nama Lengkap / Samaran"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nama Anda"
              required
              maxLength={50}
              autoComplete="name"
            />
            <Textarea
              label="Pesan Anda"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tulis pesan, tanggapan, atau salam Anda..."
              required
              maxLength={500}
              rows={3}
            />
            <div className="flex items-center justify-between pt-2">
              <p className="text-2xs font-mono text-dark-500">{message.length}/500 karakter</p>
              <button
                type="submit"
                disabled={submitMutation.isPending || !name.trim() || !message.trim()}
                className="v7-btn-gold px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="h-3.5 w-3.5" />
                <span>{submitMutation.isPending ? 'Mengirim...' : 'Kirim Pesan'}</span>
              </button>
            </div>
            <p className="text-2xs font-mono text-dark-500 text-center pt-2 border-t border-dark-800/80">
              Pesan Anda akan otomatis tampil di daftar buku tamu publik setelah berhasil terkirim.
            </p>
          </form>
        </div>
      </div>

      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-dark-800/80 pb-3">
          <h2 className="text-base font-bold font-mono text-dark-100 uppercase tracking-wide">
            Daftar Pesan ({data?.total ?? entries.length})
          </h2>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : entries.length === 0 ? (
          <div className="text-center py-12 bg-dark-900/40 rounded-xl border border-dark-800">
            <MessageSquare className="h-10 w-10 text-dark-600 mx-auto mb-3" />
            <p className="text-dark-300 text-sm font-medium">Belum ada pesan di buku tamu.</p>
            <p className="text-dark-500 text-xs mt-1">Jadilah orang pertama yang meninggalkan pesan!</p>
          </div>
        ) : (
          <div className="space-y-3" role="list" aria-label="Daftar pesan buku tamu">
            {entries.map((entry) => (
              <Card key={entry.id} role="listitem" className="p-4 bg-dark-900/60 border border-dark-800 hover:border-amber-500/30 transition-colors">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-amber-500/15 text-amber-400 border border-amber-500/25 flex items-center justify-center font-mono font-bold text-xs" aria-hidden="true">
                      {entry.name ? entry.name.charAt(0).toUpperCase() : <User className="h-3.5 w-3.5" aria-hidden="true" />}
                    </div>
                    <span className="font-semibold text-xs text-dark-100 font-mono">{entry.name}</span>
                  </div>
                  <span className="text-2xs font-mono text-dark-500">
                    {formatRelativeTime(entry.createdAt)}
                  </span>
                </div>
                <p className="text-dark-300 text-xs sm:text-sm leading-relaxed pl-9">{entry.message}</p>
              </Card>
            ))}

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 pt-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="text-xs"
                  aria-label="Halaman sebelumnya"
                >
                  <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                </Button>
                <span className="text-xs font-mono text-dark-400 px-2">
                  Halaman {page} dari {totalPages}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="text-xs"
                  aria-label="Halaman berikutnya"
                >
                  <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

export default Guestbook;