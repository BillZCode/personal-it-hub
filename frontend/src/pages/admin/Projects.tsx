import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi, projectsApi } from '../../services/api';
import { Card, CardContent, Badge, Button, Input, Select, Textarea, Modal, ConfirmDialog } from '../../components/ui';
import { SkeletonCard } from '../../components/feedback/LoadingStates';
import { Plus, Edit, Trash2, Search, Eye, Github, ExternalLink } from 'lucide-react';
import { cn, formatDate, formatRelativeTime } from '../../utils';
import { Project, ProjectStatus } from '../../types';

const statusColors: Record<ProjectStatus, 'warning' | 'info' | 'success' | 'neutral'> = {
  PLANNING: 'warning', IN_PROGRESS: 'info', COMPLETED: 'success', ARCHIVED: 'neutral',
};

export function AdminProjects() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Project | null>(null);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'projects', page, search],
    queryFn: () => adminApi.projects.getAll({ page, limit: 20, search }),
    placeholderData: { data: [], total: 0, page: 1, limit: 20, totalPages: 1 },
  });

  const createMutation = useMutation({
    mutationFn: (data: Partial<Project>) => adminApi.projects.create(data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin', 'projects'] }); setShowModal(false); },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Project> }) => adminApi.projects.update(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin', 'projects'] }); setShowModal(false); setEditingProject(null); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminApi.projects.delete(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin', 'projects'] }); setDeleteConfirm(null); },
  });

  const projects = data?.data || [];
  const totalPages = data?.totalPages || 1;

  const formFields = [
    { name: 'title', label: 'Title', type: 'text', required: true },
    { name: 'slug', label: 'Slug', type: 'text', required: true },
    { name: 'description', label: 'Description', type: 'textarea', required: true },
    { name: 'content', label: 'Content (Markdown)', type: 'textarea' },
    { name: 'technologies', label: 'Technologies (comma-separated)', type: 'text' },
    { name: 'image', label: 'Image URL', type: 'text' },
    { name: 'demoUrl', label: 'Demo URL', type: 'url' },
    { name: 'repoUrl', label: 'Repository URL', type: 'url' },
    { name: 'status', label: 'Status', type: 'select', options: ['PLANNING', 'IN_PROGRESS', 'COMPLETED', 'ARCHIVED'] },
    { name: 'featured', label: 'Featured', type: 'checkbox' },
  ];

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: Record<string, any> = {};
    formData.forEach((value, key) => {
      const valStr = typeof value === 'string' ? value : '';
      if (key === 'technologies') data[key] = valStr.split(',').map((s: string) => s.trim()).filter(Boolean);
      else if (key === 'featured') data[key] = valStr === 'on';
      else data[key] = valStr;
    });
    if (editingProject) updateMutation.mutate({ id: editingProject.id, data });
    else createMutation.mutate(data);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Projects Management</h1>
          <p className="text-dark-400">Create, edit, and manage portfolio projects</p>
        </div>
        <Button onClick={() => { setEditingProject(null); setShowModal(true); }} leftIcon={<Plus className="h-4 w-4" />}>
          New Project
        </Button>
      </div>

      <div className="card p-4 flex flex-col sm:flex-row gap-4">
        <Input placeholder="Search projects..." value={search} onChange={(e) => setSearch(e.target.value)} leftIcon={<Search className="h-5 w-5" />} className="flex-1 max-w-xs" />
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-dark-400">No projects found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-700 text-left text-dark-400 text-sm">
                <th className="pb-3 pr-4">Title</th>
                <th className="pb-3 pr-4">Status</th>
                <th className="pb-3 pr-4">Featured</th>
                <th className="pb-3 pr-4">Technologies</th>
                <th className="pb-3 pr-4">Updated</th>
                <th className="pb-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.id} className="border-b border-dark-800 hover:bg-dark-800/50">
                  <td className="py-4 pr-4">
                    <div className="font-medium text-dark-100">{project.title}</div>
                    <div className="text-sm text-dark-400 truncate max-w-xs">{project.slug}</div>
                  </td>
                  <td className="py-4 pr-4"><Badge variant={statusColors[project.status]} className="text-xs capitalize">{project.status.toLowerCase().replace('_', ' ')}</Badge></td>
                  <td className="py-4 pr-4">{project.featured ? <Badge variant="success" className="text-xs" dot>Featured</Badge> : <Badge variant="neutral" className="text-xs">-</Badge>}</td>
                  <td className="py-4 pr-4">
                    <div className="flex flex-wrap gap-1">
                      {project.technologies.slice(0, 3).map((t) => <Badge key={t} variant="neutral" className="text-xs">{t}</Badge>)}
                      {project.technologies.length > 3 && <Badge variant="neutral" className="text-xs">+{project.technologies.length - 3}</Badge>}
                    </div>
                  </td>
                  <td className="py-4 pr-4 text-sm text-dark-400 font-mono">{formatRelativeTime(project.updatedAt)}</td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => { setEditingProject(project); setShowModal(true); }}><Edit className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="sm" onClick={() => setDeleteConfirm(project)}><Trash2 className="h-4 w-4 text-red-400" /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button variant="secondary" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Previous</Button>
          <span className="text-dark-400 text-sm">Page {page} of {totalPages}</span>
          <Button variant="secondary" size="sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next</Button>
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => { setShowModal(false); setEditingProject(null); }} title={editingProject ? 'Edit Project' : 'New Project'} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto">
          {formFields.map((field) => (
            <div key={field.name}>
              {field.type === 'textarea' ? (
                <Textarea label={field.label} name={field.name} defaultValue={editingProject?.[field.name as keyof Project] as string} required={field.required} rows={4} />
              ) : field.type === 'select' ? (
                <Select label={field.label} name={field.name} defaultValue={editingProject?.[field.name as keyof Project] as string} options={field.options!.map(o => ({ value: o, label: o }))} required={field.required} />
              ) : field.type === 'checkbox' ? (
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name={field.name} defaultChecked={editingProject?.[field.name as keyof Project] as boolean} className="rounded border-dark-600" />
                  <span className="text-dark-300">{field.label}</span>
                </label>
              ) : (
                <Input label={field.label} name={field.name} type={field.type} defaultValue={editingProject?.[field.name as keyof Project] as string} required={field.required} />
              )}
            </div>
          ))}
          <div className="flex justify-end gap-3 pt-4 border-t border-dark-700">
            <Button type="button" variant="secondary" onClick={() => { setShowModal(false); setEditingProject(null); }}>Cancel</Button>
            <Button type="submit" loading={createMutation.isPending || updateMutation.isPending}>{editingProject ? 'Update' : 'Create'}</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} onConfirm={() => deleteConfirm && deleteMutation.mutate(deleteConfirm.id)} title="Delete Project" message={`Are you sure you want to delete "${deleteConfirm?.title}"? This action cannot be undone.`} confirmText="Delete" variant="danger" loading={deleteMutation.isPending} />
    </div>
  );
}