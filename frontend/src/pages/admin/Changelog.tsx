import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../../services/api';
import { Card, CardContent, Badge, Button, Input, Textarea, Modal, ConfirmDialog } from '../../components/ui';
import { Plus, Edit, Trash2, Calendar, Package, Bug, Wrench, Sparkles } from 'lucide-react';
import { cn, formatDate, formatRelativeTime } from '../../utils';
import { ChangelogEntry } from '../../types';

const typeConfig = {
  added: { label: 'Added', icon: Package, color: 'text-green-400', bg: 'bg-green-500/20' },
  changed: { label: 'Changed', icon: Wrench, color: 'text-blue-400', bg: 'bg-blue-500/20' },
  fixed: { label: 'Fixed', icon: Bug, color: 'text-red-400', bg: 'bg-red-500/20' },
  improved: { label: 'Improved', icon: Sparkles, color: 'text-purple-400', bg: 'bg-purple-500/20' },
} as const;

export function AdminChangelog() {
  const [showModal, setShowModal] = useState(false);
  const [editingEntry, setEditingEntry] = useState<ChangelogEntry | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<ChangelogEntry | null>(null);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'changelog'],
    queryFn: () => adminApi.changelog.getAll(),
    placeholderData: [],
  });

  const createMutation = useMutation({
    mutationFn: (data: Partial<ChangelogEntry>) => adminApi.changelog.create(data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin', 'changelog'] }); setShowModal(false); },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ChangelogEntry> }) => adminApi.changelog.update(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin', 'changelog'] }); setShowModal(false); setEditingEntry(null); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminApi.changelog.delete(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin', 'changelog'] }); setDeleteConfirm(null); },
  });

  const entries = data || [];

  const formFields = [
    { name: 'version', label: 'Version (e.g., v2.4.0)', type: 'text', required: true },
    { name: 'date', label: 'Release Date', type: 'date', required: true },
    { name: 'added', label: 'Added (one per line)', type: 'textarea' },
    { name: 'changed', label: 'Changed (one per line)', type: 'textarea' },
    { name: 'fixed', label: 'Fixed (one per line)', type: 'textarea' },
    { name: 'improved', label: 'Improved (one per line)', type: 'textarea' },
  ];

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: Record<string, any> = {};
    formData.forEach((value, key) => {
      const valStr = typeof value === 'string' ? value : '';
      if (['added', 'changed', 'fixed', 'improved'].includes(key)) {
        data[key] = valStr.split('\n').map((s: string) => s.trim()).filter(Boolean);
      } else {
        data[key] = valStr;
      }
    });
    if (editingEntry) updateMutation.mutate({ id: editingEntry.id, data });
    else createMutation.mutate(data);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div><h1 className="text-3xl font-bold">Changelog Management</h1><p className="text-dark-400">Manage version history and release notes</p></div>
        <Button onClick={() => { setEditingEntry(null); setShowModal(true); }} leftIcon={<Plus className="h-4 w-4" />}>New Release</Button>
      </div>

      {isLoading ? (
        <div className="space-y-4">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="card p-4 animate-pulse h-24" />)}</div>
      ) : entries.length === 0 ? (
        <div className="text-center py-12"><p className="text-dark-400">No changelog entries found.</p></div>
      ) : (
        <div className="space-y-4">
          {entries.map((entry) => (
            <Card key={entry.id} className="p-4 card-hover">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono font-bold text-primary-500">{entry.version}</span>
                    <span className="text-xs text-dark-500 font-mono">{formatRelativeTime(entry.date)}</span>
                  </div>
                  <p className="text-dark-400 text-sm">{formatDate(entry.date)}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => { setEditingEntry(entry); setShowModal(true); }}><Edit className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="sm" onClick={() => setDeleteConfirm(entry)}><Trash2 className="h-4 w-4 text-red-400" /></Button>
                </div>
              </div>
              <div className="space-y-3">
                {(['added', 'changed', 'fixed', 'improved'] as const).map((type) => {
                  const items = entry[type];
                  if (!items.length) return null;
                  const config = typeConfig[type];
                  const Icon = config.icon;
                  return (
                    <div key={type} className="space-y-1">
                      <div className="flex items-center gap-2">
                        <div className={cn('p-1 rounded', config.bg)}><Icon className={cn('h-3 w-3', config.color)} /></div>
                        <span className={cn('font-semibold text-xs uppercase tracking-wide', config.color)}>{config.label}</span>
                      </div>
                      <ul className="ml-6 space-y-0.5 border-l border-dark-700 pl-3">
                        {items.map((item, i) => (
                          <li key={i} className="text-dark-300 text-sm relative before:absolute before:left-[-8px] before:top-[6px] before:w-1.5 before:h-1.5 before:rounded-full before:bg-primary-500/50">{item}</li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => { setShowModal(false); setEditingEntry(null); }} title={editingEntry ? 'Edit Release' : 'New Release'} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[80vh] overflow-y-auto">
          {formFields.map((field) => (
            <div key={field.name}>
              {field.type === 'date' ? (
                <Input label={field.label} name={field.name} type="date" defaultValue={editingEntry?.[field.name as keyof ChangelogEntry] as string} required={field.required} />
              ) : field.type === 'textarea' ? (
                <Textarea label={field.label} name={field.name} defaultValue={editingEntry?.[field.name as keyof ChangelogEntry] as string} required={field.required} rows={4} />
              ) : (
                <Input label={field.label} name={field.name} type={field.type} defaultValue={editingEntry?.[field.name as keyof ChangelogEntry] as string} required={field.required} />
              )}
            </div>
          ))}
          <div className="flex justify-end gap-3 pt-4 border-t border-dark-700">
            <Button type="button" variant="secondary" onClick={() => { setShowModal(false); setEditingEntry(null); }}>Cancel</Button>
            <Button type="submit" loading={createMutation.isPending || updateMutation.isPending}>{editingEntry ? 'Update' : 'Create'}</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} onConfirm={() => deleteConfirm && deleteMutation.mutate(deleteConfirm.id)} title="Delete Release" message={`Delete "${deleteConfirm?.version}"?`} confirmText="Delete" variant="danger" loading={deleteMutation.isPending} />
    </div>
  );
}