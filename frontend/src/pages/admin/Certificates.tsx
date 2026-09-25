import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../../services/api';
import { Card, CardContent, Badge, Button, Input, Select, Modal, ConfirmDialog } from '../../components/ui';
import { SkeletonCard } from '../../components/feedback/LoadingStates';
import { Plus, Edit, Trash2, Search, Eye, Calendar } from 'lucide-react';
import { cn, formatDate, formatRelativeTime } from '../../utils';
import { Certificate } from '../../types';

export function AdminCertificates() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCert, setEditingCert] = useState<Certificate | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Certificate | null>(null);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'certificates', page, search],
    queryFn: () => adminApi.certificates.getAll({ page, limit: 20, search }),
    placeholderData: { data: [], total: 0, page: 1, limit: 20, totalPages: 1 },
  });

  const createMutation = useMutation({
    mutationFn: (data: Partial<Certificate>) => adminApi.certificates.create(data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin', 'certificates'] }); setShowModal(false); },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Certificate> }) => adminApi.certificates.update(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin', 'certificates'] }); setShowModal(false); setEditingCert(null); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminApi.certificates.delete(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin', 'certificates'] }); setDeleteConfirm(null); },
  });

  const certificates = data?.data || [];
  const totalPages = data?.totalPages || 1;

  const formFields = [
    { name: 'name', label: 'Name', type: 'text', required: true },
    { name: 'provider', label: 'Provider', type: 'text', required: true },
    { name: 'issueDate', label: 'Issue Date', type: 'date', required: true },
    { name: 'expiryDate', label: 'Expiry Date', type: 'date' },
    { name: 'credentialId', label: 'Credential ID', type: 'text' },
    { name: 'verificationUrl', label: 'Verification URL', type: 'url' },
    { name: 'imageUrl', label: 'Image URL', type: 'url' },
  ];

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: Partial<Certificate> = {};
    formData.forEach((value, key) => { (data as any)[key] = value; });
    if (editingCert) updateMutation.mutate({ id: editingCert.id, data });
    else createMutation.mutate(data);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div><h1 className="text-3xl font-bold">Certificates Management</h1><p className="text-dark-400">Manage professional certifications</p></div>
        <Button onClick={() => { setEditingCert(null); setShowModal(true); }} leftIcon={<Plus className="h-4 w-4" />}>New Certificate</Button>
      </div>

      <div className="card p-4"><Input placeholder="Search certificates..." value={search} onChange={(e) => setSearch(e.target.value)} leftIcon={<Search className="h-5 w-5" />} className="max-w-xs" /></div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}</div>
      ) : certificates.length === 0 ? (
        <div className="text-center py-12"><p className="text-dark-400">No certificates found.</p></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {certificates.map((cert) => (
            <Card key={cert.id} className="p-4 card-hover">
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="p-2 bg-primary-500/20 rounded-lg"><Calendar className="h-5 w-5 text-primary-500" /></div>
                {cert.expiryDate && new Date(cert.expiryDate) < new Date() && <Badge variant="danger" className="text-xs">Expired</Badge>}
              </div>
              <h3 className="font-semibold text-dark-100 mb-1">{cert.name}</h3>
              <p className="text-dark-400 text-sm mb-2">{cert.provider}</p>
              <div className="flex items-center gap-2 text-xs text-dark-500 mb-3">
                <span>Issued: {formatDate(cert.issueDate)}</span>
                {cert.expiryDate && <span>Expires: {formatDate(cert.expiryDate)}</span>}
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => { setEditingCert(cert); setShowModal(true); }}><Edit className="h-4 w-4" /></Button>
                <Button variant="ghost" size="sm" onClick={() => setDeleteConfirm(cert)}><Trash2 className="h-4 w-4 text-red-400" /></Button>
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

      <Modal isOpen={showModal} onClose={() => { setShowModal(false); setEditingCert(null); }} title={editingCert ? 'Edit Certificate' : 'New Certificate'} size="md">
        <form onSubmit={handleSubmit} className="space-y-4">
          {formFields.map((field) => (
            <div key={field.name}>
              {field.type === 'date' ? (
                <Input label={field.label} name={field.name} type="date" defaultValue={editingCert?.[field.name as keyof Certificate] as string} required={field.required} />
              ) : (
                <Input label={field.label} name={field.name} type={field.type} defaultValue={editingCert?.[field.name as keyof Certificate] as string} required={field.required} />
              )}
            </div>
          ))}
          <div className="flex justify-end gap-3 pt-4 border-t border-dark-700">
            <Button type="button" variant="secondary" onClick={() => { setShowModal(false); setEditingCert(null); }}>Cancel</Button>
            <Button type="submit" loading={createMutation.isPending || updateMutation.isPending}>{editingCert ? 'Update' : 'Create'}</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} onConfirm={() => deleteConfirm && deleteMutation.mutate(deleteConfirm.id)} title="Delete Certificate" message={`Delete "${deleteConfirm?.name}"?`} confirmText="Delete" variant="danger" loading={deleteMutation.isPending} />
    </div>
  );
}