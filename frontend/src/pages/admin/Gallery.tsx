import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../../services/api';
import { Card, CardContent, Badge, Button, Input, Select, Textarea, Modal, ConfirmDialog } from '../../components/ui';
import { SkeletonCard } from '../../components/feedback/LoadingStates';
import { Plus, Edit, Trash2, Search, Image as ImageIcon } from 'lucide-react';
import { cn, formatDate, formatRelativeTime } from '../../utils';
import { GalleryItem } from '../../types';

export function AdminGallery() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<GalleryItem | null>(null);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'gallery', page, search],
    queryFn: () => adminApi.gallery.getAll({ page, limit: 20, search }),
    placeholderData: { data: [], total: 0, page: 1, limit: 20, totalPages: 1 },
  });

  const createMutation = useMutation({
    mutationFn: (data: Partial<GalleryItem>) => adminApi.gallery.create(data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin', 'gallery'] }); setShowModal(false); },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<GalleryItem> }) => adminApi.gallery.update(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin', 'gallery'] }); setShowModal(false); setEditingItem(null); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminApi.gallery.delete(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin', 'gallery'] }); setDeleteConfirm(null); },
  });

  const items = data?.data || [];
  const totalPages = data?.totalPages || 1;

  const formFields = [
    { name: 'title', label: 'Title', type: 'text', required: true },
    { name: 'description', label: 'Description', type: 'textarea' },
    { name: 'category', label: 'Category', type: 'select', options: ['Projects', 'Linux', 'Networking', 'Homelab', 'Screenshots', 'Misc'], required: true },
    { name: 'imageUrl', label: 'Image URL', type: 'url', required: true },
    { name: 'thumbnailUrl', label: 'Thumbnail URL', type: 'url' },
    { name: 'tags', label: 'Tags (comma-separated)', type: 'text' },
  ];

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: Record<string, any> = {};
    formData.forEach((value, key) => {
      const valStr = typeof value === 'string' ? value : '';
      if (key === 'tags') data[key] = valStr.split(',').map((s: string) => s.trim()).filter(Boolean);
      else data[key] = valStr;
    });
    if (editingItem) updateMutation.mutate({ id: editingItem.id, data });
    else createMutation.mutate(data);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div><h1 className="text-3xl font-bold">Gallery Management</h1><p className="text-dark-400">Manage gallery images and screenshots</p></div>
        <Button onClick={() => { setEditingItem(null); setShowModal(true); }} leftIcon={<Plus className="h-4 w-4" />}>New Image</Button>
      </div>

      <div className="card p-4"><Input placeholder="Search gallery..." value={search} onChange={(e) => setSearch(e.target.value)} leftIcon={<Search className="h-5 w-5" />} className="max-w-xs" /></div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}</div>
      ) : items.length === 0 ? (
        <div className="text-center py-12"><p className="text-dark-400">No images found.</p></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <Card key={item.id} className="p-4 card-hover overflow-hidden">
              <img src={item.thumbnailUrl || item.imageUrl} alt={item.title} className="w-full h-32 object-cover rounded mb-3" />
              <h3 className="font-semibold text-dark-100 mb-1 truncate">{item.title}</h3>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="info" className="text-xs">{item.category}</Badge>
                <span className="text-xs text-dark-400">{formatRelativeTime(item.createdAt)}</span>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => { setEditingItem(item); setShowModal(true); }}><Edit className="h-4 w-4" /></Button>
                <Button variant="ghost" size="sm" onClick={() => setDeleteConfirm(item)}><Trash2 className="h-4 w-4 text-red-400" /></Button>
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

      <Modal isOpen={showModal} onClose={() => { setShowModal(false); setEditingItem(null); }} title={editingItem ? 'Edit Image' : 'New Image'} size="md">
        <form onSubmit={handleSubmit} className="space-y-4">
          {formFields.map((field) => (
            <div key={field.name}>
              {field.type === 'textarea' ? (
                <Textarea label={field.label} name={field.name} defaultValue={editingItem?.[field.name as keyof GalleryItem] as string} required={field.required} rows={3} />
              ) : field.type === 'select' ? (
                <Select label={field.label} name={field.name} defaultValue={editingItem?.[field.name as keyof GalleryItem] as string} options={field.options!.map(o => ({ value: o, label: o }))} required={field.required} />
              ) : (
                <Input label={field.label} name={field.name} type={field.type} defaultValue={editingItem?.[field.name as keyof GalleryItem] as string} required={field.required} />
              )}
            </div>
          ))}
          <div className="flex justify-end gap-3 pt-4 border-t border-dark-700">
            <Button type="button" variant="secondary" onClick={() => { setShowModal(false); setEditingItem(null); }}>Cancel</Button>
            <Button type="submit" loading={createMutation.isPending || updateMutation.isPending}>{editingItem ? 'Update' : 'Create'}</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} onConfirm={() => deleteConfirm && deleteMutation.mutate(deleteConfirm.id)} title="Delete Image" message={`Delete "${deleteConfirm?.title}"?`} confirmText="Delete" variant="danger" loading={deleteMutation.isPending} />
    </div>
  );
}