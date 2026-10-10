import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../../services/api';
import { Card, Badge, Button, Input, Select, ConfirmDialog } from '../../components/ui';
import { SkeletonCard } from '../../components/feedback/LoadingStates';
import { Search, CheckCircle2, XCircle, Trash2, MessageSquare, Mail } from 'lucide-react';
import { formatRelativeTime, getInitials } from '../../utils';
import { GuestbookEntry } from '../../types';
import { useToast, useDocumentTitle } from '../../hooks';

export function AdminGuestbook() {
  useDocumentTitle('Manage Guestbook - Admin');
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [approvedFilter, setApprovedFilter] = useState<'all' | 'approved' | 'pending'>('all');
  const [deleteConfirm, setDeleteConfirm] = useState<GuestbookEntry | null>(null);
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'guestbook', page, approvedFilter, search],
    queryFn: () => adminApi.guestbook.getAll({ page, limit: 20, approved: approvedFilter === 'all' ? undefined : approvedFilter === 'approved', search }),
    placeholderData: { data: [], total: 0, page: 1, limit: 20, totalPages: 1 },
  });

  const toggleApproveMutation = useMutation({
    mutationFn: ({ id, approved }: { id: string; approved: boolean }) => adminApi.guestbook.approve(id, approved),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'guestbook'] });
      queryClient.invalidateQueries({ queryKey: ['guestbook'] });
      showToast(variables.approved ? 'Pesan berhasil disetujui' : 'Persetujuan pesan dibatalkan', 'success');
    },
    onError: () => showToast('Gagal mengubah status pesan', 'error'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminApi.guestbook.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'guestbook'] });
      queryClient.invalidateQueries({ queryKey: ['guestbook'] });
      setDeleteConfirm(null);
      showToast('Pesan berhasil dihapus secara permanen', 'success');
    },
    onError: () => showToast('Gagal menghapus pesan', 'error'),
  });

  const entries = data?.data || [];
  const totalPages = data?.totalPages || 1;

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Guestbook Moderation</h1>
          <p className="text-dark-400">Review, setujui, dan hapus pesan buku tamu publik</p>
        </div>
      </div>

      <div className="card p-4 flex flex-col sm:flex-row gap-4">
        <Input
          placeholder="Cari pesan atau nama..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          leftIcon={<Search className="h-5 w-5" />}
          className="flex-1 max-w-xs"
        />
        <Select
          value={approvedFilter}
          onChange={(e) => setApprovedFilter(e.target.value as any)}
          options={[
            { value: 'all', label: 'Semua Status' },
            { value: 'approved', label: 'Disetujui (Approved)' },
            { value: 'pending', label: 'Menunggu (Pending)' },
          ]}
          className="w-full sm:w-48"
        />
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : entries.length === 0 ? (
        <div className="text-center py-12">
          <MessageSquare className="h-12 w-12 text-dark-600 mx-auto mb-4" />
          <p className="text-dark-400">Tidak ada pesan guestbook ditemukan.</p>
        </div>
      ) : (
        <div className="space-y-4" role="list" aria-label="Daftar pesan guestbook">
          {entries.map((entry) => (
            <Card key={entry.id} role="listitem" className="p-4 border border-dark-800 hover:border-dark-700 transition-colors">
              <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-amber-500/15 border border-amber-500/25 flex items-center justify-center flex-shrink-0" aria-hidden="true">
                    <span className="font-medium text-amber-400 font-mono text-sm">{getInitials(entry.name)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className="font-semibold text-dark-100">{entry.name}</span>
                      <Badge variant={entry.approved ? 'success' : 'warning'} className="text-xs" dot>
                        {entry.approved ? 'Approved' : 'Pending'}
                      </Badge>
                      <span className="text-xs text-dark-500 font-mono">{formatRelativeTime(entry.createdAt)}</span>
                    </div>
                    <p className="text-dark-200 text-sm leading-relaxed whitespace-pre-wrap">{entry.message}</p>
                    <div className="flex items-center gap-3 mt-2.5 text-xs text-dark-500 font-mono">
                      <span className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        IP: {entry.ipHash.slice(0, 8)}...
                      </span>
                      {entry.userAgent && (
                        <span className="truncate max-w-xs text-dark-600 hidden md:inline">
                          {entry.userAgent}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Moderation Action Buttons: Approve / Unapprove & Delete */}
                <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
                  {!entry.approved ? (
                    <Button
                      size="sm"
                      onClick={() => toggleApproveMutation.mutate({ id: entry.id, approved: true })}
                      loading={toggleApproveMutation.isPending && toggleApproveMutation.variables?.id === entry.id}
                      leftIcon={<CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />}
                      className="bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/25 text-xs font-semibold"
                      aria-label={`Setujui pesan dari ${entry.name}`}
                    >
                      Setujui
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleApproveMutation.mutate({ id: entry.id, approved: false })}
                      loading={toggleApproveMutation.isPending && toggleApproveMutation.variables?.id === entry.id}
                      leftIcon={<XCircle className="h-3.5 w-3.5 text-amber-400" />}
                      className="text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 border border-amber-500/20 text-xs font-medium"
                      aria-label={`Batalkan persetujuan pesan dari ${entry.name}`}
                      title="Kembalikan status pesan menjadi pending"
                    >
                      Batal Setuju
                    </Button>
                  )}

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeleteConfirm(entry)}
                    aria-label={`Hapus pesan dari ${entry.name}`}
                    leftIcon={<Trash2 className="h-3.5 w-3.5" />}
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-red-500/20 text-xs font-medium"
                  >
                    Hapus
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <Button variant="secondary" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Previous</Button>
          <span className="text-dark-400 text-sm font-mono px-2">Halaman {page} dari {totalPages}</span>
          <Button variant="secondary" size="sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next</Button>
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={() => deleteConfirm && deleteMutation.mutate(deleteConfirm.id)}
        title="Hapus Pesan Guestbook"
        message={`Apakah Anda yakin ingin menghapus pesan dari "${deleteConfirm?.name}"? Pesan ini akan dihapus secara permanen.`}
        confirmText="Hapus Pesan"
        cancelText="Batal"
        variant="danger"
        loading={deleteMutation.isPending}
      />
    </div>
  );
}