import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi, guestbookApi } from '../../services/api';
import { Card, CardContent, Badge, Button, Input, Select, Modal, ConfirmDialog } from '../../components/ui';
import { SkeletonCard } from '../../components/feedback/LoadingStates';
import { Search, CheckCircle2, XCircle, MessageSquare, Mail, User } from 'lucide-react';
import { cn, formatDate, formatRelativeTime, getInitials } from '../../utils';
import { GuestbookEntry } from '../../types';
import { useToast } from '../../hooks';

export function AdminGuestbook() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [approvedFilter, setApprovedFilter] = useState<'all' | 'approved' | 'pending'>('all');
  const [selectedEntry, setSelectedEntry] = useState<GuestbookEntry | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<GuestbookEntry | null>(null);
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'guestbook', page, approvedFilter, search],
    queryFn: () => adminApi.guestbook.getAll({ page, limit: 20, approved: approvedFilter === 'all' ? undefined : approvedFilter === 'approved', search }),
    placeholderData: { data: [], total: 0, page: 1, limit: 20, totalPages: 1 },
  });

  const approveMutation = useMutation({
    mutationFn: (id: string) => adminApi.guestbook.approve(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin', 'guestbook'] }); showToast('Entry approved', 'success'); },
    onError: () => showToast('Failed to approve', 'error'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminApi.guestbook.delete(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin', 'guestbook'] }); setDeleteConfirm(null); showToast('Entry deleted', 'success'); },
    onError: () => showToast('Failed to delete', 'error'),
  });

  const entries = data?.data || [];
  const totalPages = data?.totalPages || 1;

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div><h1 className="text-3xl font-bold">Guestbook Moderation</h1><p className="text-dark-400">Review and moderate guestbook entries</p></div>
      </div>

      <div className="card p-4 flex flex-col sm:flex-row gap-4">
        <Input placeholder="Search entries..." value={search} onChange={(e) => setSearch(e.target.value)} leftIcon={<Search className="h-5 w-5" />} className="flex-1 max-w-xs" />
        <Select value={approvedFilter} onChange={(e) => setApprovedFilter(e.target.value as any)} options={[
          { value: 'all', label: 'All' },
          { value: 'approved', label: 'Approved' },
          { value: 'pending', label: 'Pending' },
        ]} className="w-full sm:w-40" />
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : entries.length === 0 ? (
        <div className="text-center py-12"><MessageSquare className="h-12 w-12 text-dark-600 mx-auto mb-4" /><p className="text-dark-400">No entries found.</p></div>
      ) : (
        <div className="space-y-4">
          {entries.map((entry) => (
            <Card key={entry.id} className="p-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center flex-shrink-0">
                  <span className="font-medium text-primary-500">{getInitials(entry.name)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-dark-100">{entry.name}</span>
                    <Badge variant={entry.approved ? 'success' : 'warning'} className="text-xs" dot>{entry.approved ? 'Approved' : 'Pending'}</Badge>
                    <span className="text-xs text-dark-500 font-mono">{formatRelativeTime(entry.createdAt)}</span>
                  </div>
                  <p className="text-dark-300">{entry.message}</p>
                  <div className="flex items-center gap-2 mt-2 text-xs text-dark-500">
                    <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{entry.ipHash.slice(0, 8)}...</span>
                    {entry.userAgent && <span className="truncate max-w-xs">{entry.userAgent}</span>}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  {!entry.approved && (
                    <Button size="sm" onClick={() => approveMutation.mutate(entry.id)} loading={approveMutation.isPending} leftIcon={<CheckCircle2 className="h-3 w-3" />}>Approve</Button>
                  )}
                  <Button variant="ghost" size="sm" onClick={() => setDeleteConfirm(entry)} className="text-red-400 hover:text-red-300"><XCircle className="h-4 w-4" /></Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button variant="secondary" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Previous</Button>
          <span className="text-dark-400 text-sm">Page {page} of {totalPages}</span>
          <Button variant="secondary" size="sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next</Button>
        </div>
      )}

      <ConfirmDialog isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} onConfirm={() => deleteConfirm && deleteMutation.mutate(deleteConfirm.id)} title="Delete Entry" message={`Delete entry from ${deleteConfirm?.name}?`} confirmText="Delete" variant="danger" loading={deleteMutation.isPending} />
    </div>
  );
}