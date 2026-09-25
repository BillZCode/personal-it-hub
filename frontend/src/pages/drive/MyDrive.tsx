import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { driveApi, DriveItem } from '../../services/api';
import { Card, Button, Input } from '../../components/ui';
import { useToast } from '../../hooks';
import {
  Folder,
  FolderPlus,
  UploadCloud,
  FileText,
  FileCode,
  FileArchive,
  Image,
  Video,
  File,
  Download,
  Eye,
  Trash2,
  Edit2,
  RefreshCw,
  ChevronRight,
  Home,
  Check,
  X,
  AlertCircle,
  Clock,
  HardDrive
} from 'lucide-react';
import { formatRelativeTime } from '../../utils';

export function MyDrive({ isTrash = false }: { isTrash?: boolean }) {
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [newFolderName, setNewFolderName] = useState('');
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [renamingItemId, setRenamingItemId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [previewItem, setPreviewItem] = useState<DriveItem | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  // Query files/folders
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['drive', 'items', currentFolderId, isTrash],
    queryFn: () => driveApi.list(currentFolderId, isTrash),
  });

  // Create folder mutation
  const createFolderMutation = useMutation({
    mutationFn: (name: string) => driveApi.createFolder(name, currentFolderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drive'] });
      setNewFolderName('');
      setIsCreatingFolder(false);
      showToast('Folder berhasil dibuat', 'success');
    },
    onError: (err: any) => {
      showToast(err.message || 'Gagal membuat folder', 'error');
    },
  });

  // Upload file mutation
  const uploadMutation = useMutation({
    mutationFn: (file: File) => driveApi.upload(file, currentFolderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drive'] });
      showToast('File berhasil diupload ke secure server', 'success');
    },
    onError: (err: any) => {
      showToast(err.message || 'Gagal mengupload file', 'error');
    },
  });

  // Rename mutation
  const renameMutation = useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) => driveApi.rename(id, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drive'] });
      setRenamingItemId(null);
      showToast('Item berhasil dinamai ulang', 'success');
    },
    onError: (err: any) => {
      showToast(err.message || 'Gagal mengubah nama', 'error');
    },
  });

  // Move to trash mutation
  const trashMutation = useMutation({
    mutationFn: (id: string) => driveApi.moveToTrash(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drive'] });
      showToast('Item dipindahkan ke sampah', 'info');
    },
    onError: (err: any) => {
      showToast(err.message || 'Gagal menghapus item', 'error');
    },
  });

  // Restore mutation
  const restoreMutation = useMutation({
    mutationFn: (id: string) => driveApi.restore(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drive'] });
      showToast('Item dipulihkan', 'success');
    },
  });

  // Delete permanent mutation
  const deletePermanentMutation = useMutation({
    mutationFn: (id: string) => driveApi.deletePermanent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drive'] });
      showToast('Item dihapus permanen dari server', 'success');
    },
  });

  // Empty trash mutation
  const emptyTrashMutation = useMutation({
    mutationFn: () => driveApi.emptyTrash(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drive'] });
      showToast('Seluruh sampah dibersihkan permanen', 'success');
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      uploadMutation.mutate(e.target.files[0]);
      e.target.value = '';
    }
  };

  const getFileIcon = (item: DriveItem) => {
    if (item.type === 'FOLDER') {
      return <Folder className="h-6 w-6 text-amber-400 fill-amber-400/20" />;
    }
    const mime = item.mimeType || '';
    if (mime.startsWith('image/')) return <Image className="h-6 w-6 text-purple-400" />;
    if (mime.startsWith('video/')) return <Video className="h-6 w-6 text-red-400" />;
    if (mime.includes('zip') || mime.includes('tar') || mime.includes('compressed'))
      return <FileArchive className="h-6 w-6 text-orange-400" />;
    if (mime.includes('javascript') || mime.includes('json') || mime.includes('python') || mime.includes('text/html'))
      return <FileCode className="h-6 w-6 text-cyan-400" />;
    return <FileText className="h-6 w-6 text-blue-400" />;
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in">
      {/* Hidden File Input for Upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-dark-900/60 p-4 rounded-xl border border-dark-800">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-1.5 flex-wrap text-sm">
          <button
            onClick={() => setCurrentFolderId(null)}
            className="flex items-center gap-1 text-dark-400 hover:text-primary-400 transition-colors"
          >
            <Home className="h-4 w-4" />
            <span>Root</span>
          </button>

          {!isTrash && data?.breadcrumbs?.map((crumb) => (
            <div key={crumb.id} className="flex items-center gap-1.5">
              <ChevronRight className="h-3.5 w-3.5 text-dark-600" />
              <button
                onClick={() => setCurrentFolderId(crumb.id)}
                className="text-dark-300 hover:text-primary-400 transition-colors"
              >
                {crumb.name}
              </button>
            </div>
          ))}

          {isTrash && (
            <div className="flex items-center gap-1.5">
              <ChevronRight className="h-3.5 w-3.5 text-dark-600" />
              <span className="text-amber-400 font-medium">Tempat Sampah / Trash</span>
            </div>
          )}
        </div>

        {/* Buttons Controls */}
        <div className="flex items-center gap-2">
          {!isTrash ? (
            <>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setIsCreatingFolder(true)}
                leftIcon={<FolderPlus className="h-4 w-4" />}
              >
                Folder Baru
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                loading={uploadMutation.isPending}
                leftIcon={<UploadCloud className="h-4 w-4" />}
              >
                Upload File
              </Button>
            </>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (confirm('Kosongkan seluruh tempat sampah secara permanen?')) {
                  emptyTrashMutation.mutate();
                }
              }}
              className="text-red-400 border-red-500/30 hover:bg-red-500/10"
              leftIcon={<Trash2 className="h-4 w-4" />}
            >
              Kosongkan Sampah
            </Button>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={() => refetch()}
            title="Refresh"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Inline Folder Creation Form */}
      {isCreatingFolder && (
        <Card className="p-4 border-primary-500/40 bg-primary-500/5 animate-in">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (newFolderName.trim()) createFolderMutation.mutate(newFolderName.trim());
            }}
            className="flex items-center gap-3"
          >
            <FolderPlus className="h-5 w-5 text-primary-400 flex-shrink-0" />
            <Input
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Nama folder baru..."
              className="flex-1"
              autoFocus
            />
            <Button type="submit" size="sm" loading={createFolderMutation.isPending}>
              Simpan
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsCreatingFolder(false)}
            >
              Batal
            </Button>
          </form>
        </Card>
      )}

      {/* Files & Folders List */}
      {isLoading ? (
        <div className="py-20 flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500" />
        </div>
      ) : !data?.items || data.items.length === 0 ? (
        <div className="py-20 text-center border-2 border-dashed border-dark-800 rounded-2xl p-8 bg-dark-900/30">
          <div className="mx-auto w-12 h-12 rounded-xl bg-dark-800 flex items-center justify-center text-dark-500 mb-3">
            {isTrash ? <Trash2 className="h-6 w-6" /> : <HardDrive className="h-6 w-6" />}
          </div>
          <h3 className="text-base font-medium text-dark-300">
            {isTrash ? 'Tempat sampah kosong' : 'Folder ini masih kosong'}
          </h3>
          <p className="text-xs text-dark-500 max-w-sm mx-auto mt-1">
            {isTrash
              ? 'File atau folder yang dihapus akan disimpan di sini sebelum dihapus permanen.'
              : 'Klik tombol "Upload File" atau "Folder Baru" untuk mulai menyimpan data Anda di server private.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {data.items.map((item) => (
            <Card
              key={item.id}
              className="p-4 border-dark-800 hover:border-dark-700 bg-dark-900/80 transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="p-2.5 bg-dark-800/80 rounded-xl border border-dark-700/50">
                    {getFileIcon(item)}
                  </div>

                  {/* Actions Dropdown / Buttons */}
                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                    {!isTrash ? (
                      <>
                        {item.type === 'FILE' && (
                          <>
                            <a
                              href={driveApi.getDownloadUrl(item.id)}
                              download={item.name}
                              className="p-1.5 rounded-lg text-dark-400 hover:text-primary-400 hover:bg-dark-800 transition-colors"
                              title="Download File"
                            >
                              <Download className="h-3.5 w-3.5" />
                            </a>
                            <button
                              onClick={() => setPreviewItem(item)}
                              className="p-1.5 rounded-lg text-dark-400 hover:text-primary-400 hover:bg-dark-800 transition-colors"
                              title="Preview"
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => {
                            setRenamingItemId(item.id);
                            setRenameValue(item.name);
                          }}
                          className="p-1.5 rounded-lg text-dark-400 hover:text-amber-400 hover:bg-dark-800 transition-colors"
                          title="Ganti Nama"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => trashMutation.mutate(item.id)}
                          className="p-1.5 rounded-lg text-dark-400 hover:text-red-400 hover:bg-dark-800 transition-colors"
                          title="Pindahkan ke Sampah"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => restoreMutation.mutate(item.id)}
                          className="p-1.5 rounded-lg text-dark-400 hover:text-emerald-400 hover:bg-dark-800 transition-colors"
                          title="Pulihkan Item"
                        >
                          <RefreshCw className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Hapus permanen "${item.name}"? File fisik akan dimusnahkan.`)) {
                              deletePermanentMutation.mutate(item.id);
                            }
                          }}
                          className="p-1.5 rounded-lg text-dark-400 hover:text-red-400 hover:bg-dark-800 transition-colors"
                          title="Hapus Permanen"
                        >
                          <Trash2 className="h-3.5 w-3.5 text-red-400" />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Name / Rename Input */}
                {renamingItemId === item.id ? (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (renameValue.trim()) {
                        renameMutation.mutate({ id: item.id, name: renameValue.trim() });
                      }
                    }}
                    className="flex items-center gap-1.5 my-1"
                  >
                    <Input
                      value={renameValue}
                      onChange={(e) => setRenameValue(e.target.value)}
                      className="h-8 text-xs"
                      autoFocus
                    />
                    <button
                      type="submit"
                      className="p-1.5 rounded bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
                    >
                      <Check className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setRenamingItemId(null)}
                      className="p-1.5 rounded bg-dark-800 text-dark-400 hover:bg-dark-700"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </form>
                ) : (
                  <div
                    onClick={() => {
                      if (item.type === 'FOLDER' && !isTrash) {
                        setCurrentFolderId(item.id);
                      } else if (item.type === 'FILE' && !isTrash) {
                        setPreviewItem(item);
                      }
                    }}
                    className="cursor-pointer group-hover:text-primary-400 transition-colors"
                  >
                    <p className="font-medium text-sm text-dark-200 truncate" title={item.name}>
                      {item.name}
                    </p>
                  </div>
                )}
              </div>

              {/* Meta information */}
              <div className="mt-4 pt-2.5 border-t border-dark-800 flex items-center justify-between text-[11px] text-dark-500 font-mono">
                <span>{item.type === 'FOLDER' ? 'Folder' : formatBytes(item.size)}</span>
                <span>{formatRelativeTime(item.createdAt)}</span>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Preview Modal */}
      {previewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="bg-dark-900 border border-dark-700 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl animate-in">
            {/* Modal Header */}
            <div className="h-14 px-6 border-b border-dark-800 flex items-center justify-between bg-dark-950/50">
              <div className="flex items-center gap-3 min-w-0 mr-4">
                {getFileIcon(previewItem)}
                <span className="font-semibold text-sm text-dark-100 truncate">
                  {previewItem.name}
                </span>
                <span className="text-xs font-mono text-dark-500">
                  ({formatBytes(previewItem.size)})
                </span>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={driveApi.getDownloadUrl(previewItem.id)}
                  download={previewItem.name}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-500/20 text-primary-400 text-xs font-medium hover:bg-primary-500/30 transition-colors"
                >
                  <Download className="h-3.5 w-3.5" />
                  Download
                </a>
                <button
                  onClick={() => setPreviewItem(null)}
                  className="p-1.5 rounded-lg text-dark-400 hover:text-dark-100 hover:bg-dark-800"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Modal Body: Inline streaming */}
            <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-dark-950/80 min-h-[350px]">
              {previewItem.mimeType?.startsWith('image/') ? (
                <img
                  src={driveApi.getPreviewUrl(previewItem.id)}
                  alt={previewItem.name}
                  className="max-h-[70vh] max-w-full rounded-lg object-contain"
                />
              ) : previewItem.mimeType === 'application/pdf' ? (
                <iframe
                  src={driveApi.getPreviewUrl(previewItem.id)}
                  title={previewItem.name}
                  className="w-full h-[70vh] rounded-lg border border-dark-800"
                />
              ) : previewItem.mimeType?.startsWith('video/') ? (
                <video
                  controls
                  src={driveApi.getPreviewUrl(previewItem.id)}
                  className="max-h-[70vh] max-w-full rounded-lg"
                />
              ) : (
                <div className="text-center p-8">
                  <div className="mx-auto w-12 h-12 rounded-xl bg-dark-800 flex items-center justify-center text-dark-400 mb-3">
                    <FileText className="h-6 w-6" />
                  </div>
                  <p className="text-sm text-dark-300 font-medium">Pratinjau langsung tidak didukung untuk tipe file ini</p>
                  <p className="text-xs text-dark-500 mt-1">Silakan unduh file untuk membukanya di aplikasi lokal Anda.</p>
                  <a
                    href={driveApi.getDownloadUrl(previewItem.id)}
                    download={previewItem.name}
                    className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-lg text-xs font-semibold"
                  >
                    <Download className="h-4 w-4" />
                    Unduh Berkas Sekarang
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default MyDrive;
