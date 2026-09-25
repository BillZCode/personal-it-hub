import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { guestbookApi } from '../../services/api';
import { Card, Button, Input, Textarea } from '../../components/ui';
import { SkeletonCard } from '../../components/feedback/LoadingStates';
import { MessageSquare, Send, ChevronLeft, ChevronRight, User } from 'lucide-react';
import { formatRelativeTime } from '../../utils';
import { GuestbookEntry } from '../../types';
import { useToast } from '../../hooks';

const sampleEntries: GuestbookEntry[] = [];

export function Guestbook() {
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

      <Card className="p-6 bg-dark-900/60 border border-dark-800">
        <h2 className="text-lg font-bold font-mono text-dark-100 uppercase tracking-wide mb-4">Tulis di Buku Tamu</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nama Lengkap / Samaran"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nama Anda"
            required
            maxLength={50}
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
            <Button type="submit" loading={submitMutation.isPending} leftIcon={<Send className="h-4 w-4" />} className="text-xs">
              Kirim Pesan
            </Button>
          </div>
          <p className="text-2xs font-mono text-dark-500 text-center pt-2 border-t border-dark-800">
            Pesan Anda akan otomatis tampil di daftar buku tamu publik setelah berhasil terkirim.
          </p>
        </form>
      </Card>

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
          <div className="space-y-3">
            {entries.map((entry) => (
              <Card key={entry.id} className="p-4 bg-dark-900/60 border border-dark-800">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <User className="h-3.5 w-3.5" />
                    </div>
                    <span className="font-semibold text-xs text-dark-100 font-mono">{entry.name}</span>
                  </div>
                  <span className="text-2xs font-mono text-dark-500">
                    {formatRelativeTime(entry.createdAt)}
                  </span>
                </div>
                <p className="text-dark-300 text-xs sm:text-sm leading-relaxed pl-8">{entry.message}</p>
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
                >
                  <ChevronLeft className="h-4 w-4" />
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
                >
                  <ChevronRight className="h-4 w-4" />
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