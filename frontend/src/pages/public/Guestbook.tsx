import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { guestbookApi } from '../../services/api';
import { Card, Button, Input, Textarea, ConfirmDialog } from '../../components/ui';
import { SkeletonCard } from '../../components/feedback/LoadingStates';
import { MessageSquare, Send, ChevronLeft, ChevronRight, User, Trash2, ShieldCheck, Clock } from 'lucide-react';
import { formatRelativeTime } from '../../utils';
import { GuestbookEntry } from '../../types';
import { useToast, useDocumentTitle } from '../../hooks';
import { useAuthStore } from '../../store/auth';

const sampleEntries: GuestbookEntry[] = [];

export function Guestbook() {
  useDocumentTitle('Guestbook');
  const { isAuthenticated } = useAuthStore();
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<GuestbookEntry | null>(null);
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
      showToast('Pesan berhasil dikirim! Pesan berstatus pending dan akan muncul setelah disetujui operator.', 'success');
      setName('');
      setMessage('');
      queryClient.invalidateQueries({ queryKey: ['guestbook'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'guestbook'] });
    },
    onError: () => showToast('Gagal mengirim pesan', 'error'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => guestbookApi.delete(id),
    onSuccess: () => {
      showToast('Pesan berhasil dihapus dari buku tamu!', 'success');
      setDeleteTarget(null);
      queryClient.invalidateQueries({ queryKey: ['guestbook'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'guestbook'] });
    },
    onError: () => showToast('Gagal menghapus pesan buku tamu', 'error'),
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
            <div className="flex items-center justify-center gap-1.5 text-2xs font-mono text-dark-400 text-center pt-2 border-t border-dark-800/80">
              <Clock className="h-3 w-3 text-amber-400 flex-shrink-0" />
              <span>Pesan baru akan berstatus pending dan tampil setelah disetujui oleh operator/admin.</span>
            </div>
          </form>
        </div>
      </div>

      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-dark-800/80 pb-3">
          <h2 className="text-base font-bold font-mono text-dark-100 uppercase tracking-wide">
            Daftar Pesan ({data?.total ?? entries.length})
          </h2>

          {isAuthenticated && (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-400 text-2xs font-mono">
                <ShieldCheck className="h-3.5 w-3.5 text-amber-400" />
                <span>Mode Admin</span>
              </div>
              <Link
                to="/admin/guestbook"
                className="px-2.5 py-1 rounded-full bg-dark-800/80 hover:bg-dark-700 border border-dark-700 hover:border-amber-500/40 text-dark-300 hover:text-amber-400 text-2xs font-mono transition-colors"
              >
                Panel Moderasi &rarr;
              </Link>
            </div>
          )}
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
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xs font-mono text-dark-500">
                      {formatRelativeTime(entry.createdAt)}
                    </span>
                    {isAuthenticated && (
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(entry)}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-2xs font-mono text-red-400 hover:text-red-300 hover:bg-red-500/15 border border-red-500/25 transition-all"
                        title="Hapus pesan ini (Akses Admin)"
                        aria-label={`Hapus pesan dari ${entry.name}`}
                      >
                        <Trash2 className="h-3 w-3" />
                        <span>Hapus</span>
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-dark-300 text-xs sm:text-sm leading-relaxed pl-9 whitespace-pre-wrap">{entry.message}</p>
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

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
        title="Hapus Pesan Buku Tamu"
        message={`Apakah Anda yakin ingin menghapus pesan dari "${deleteTarget?.name}"? Pesan ini akan dihapus secara permanen.`}
        confirmText="Hapus Pesan"
        cancelText="Batal"
        variant="danger"
        loading={deleteMutation.isPending}
      />
    </div>
  );
}

export default Guestbook;