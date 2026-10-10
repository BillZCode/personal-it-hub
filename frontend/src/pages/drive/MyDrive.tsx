import React, { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { driveApi, DriveItem } from '../../services/api';
import { Card, Button, Input, ConfirmDialog } from '../../components/ui';
import {
  FolderPlus,
  UploadCloud,
  HardDrive,
  Trash2,
  Search,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import {
  DriveToolbar,
  DriveItemCard,
  FilePreviewModal,
  SortField,
  SortOrder,
} from '../../components/drive';
import { useDriveOperations, useDocumentTitle } from '../../hooks';
import { validateFileName } from '../../utils/fileTypes';

const fileNameCollator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });


interface ConfirmState {
  isOpen: boolean;
  type: 'delete' | 'emptyTrash';
  id?: string;
  name?: string;
  title: string;
  description: string;
}

export function MyDrive({ isTrash = false }: { isTrash?: boolean }) {
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderError, setNewFolderError] = useState<string | null>(null);
  const [isCreatingFolderInline, setIsCreatingFolderInline] = useState(false);
  const [previewItem, setPreviewItem] = useState<DriveItem | null>(null);

  // Modern Confirmation Modal State
  const [confirmDialog, setConfirmDialog] = useState<ConfirmState>({
    isOpen: false,
    type: 'delete',
    title: '',
    description: '',
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Dynamic document title
  useDocumentTitle(isTrash ? 'Tempat Sampah (Trash) — Secure Drive' : 'My Drive — Secure Storage');


  // Query files/folders
  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['drive', 'items', currentFolderId, isTrash],
    queryFn: () => driveApi.list(currentFolderId, isTrash),
  });

  // Dedicated operations hook (clean architecture separation)
  const {
    isUploading,
    uploadProgress,
    uploadFiles,
    createFolder,
    isCreatingFolder,
    renameItem,
    moveToTrash,
    restoreItem,
    deletePermanent,
    isDeletingPermanent,
    emptyTrash,
    isEmptyingTrash,
  } = useDriveOperations(currentFolderId, isTrash);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      uploadFiles(files);
      e.target.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isTrash) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (isTrash) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files);
      uploadFiles(files);
    }
  };

  const handleCreateFolderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateFileName(newFolderName);
    if (!validation.valid) {
      setNewFolderError(validation.error || 'Nama folder tidak valid');
      return;
    }
    createFolder(newFolderName.trim(), {
      onSuccess: () => {
        setNewFolderName('');
        setNewFolderError(null);
        setIsCreatingFolderInline(false);
      },
      onError: (err: any) => {
        setNewFolderError(err?.message || 'Gagal membuat folder');
      },
    });
  };

  // Memoized filtered & sorted items
  const processedItems = useMemo(() => {
    if (!data?.items) return [];

    let items = [...data.items];

    // 1. Search Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      items = items.filter((item) => item.name.toLowerCase().includes(q));
    }

    // 2. Sort (folders always first, then apply selected field)
    items.sort((a, b) => {
      if (a.type !== b.type) {
        return a.type === 'FOLDER' ? -1 : 1;
      }

      let cmp = 0;
      if (sortField === 'name') {
        cmp = fileNameCollator.compare(a.name, b.name);
      } else if (sortField === 'createdAt') {
        cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else if (sortField === 'size') {
        cmp = (a.size || 0) - (b.size || 0);
      }

      return sortOrder === 'asc' ? cmp : -cmp;
    });

    return items;
  }, [data?.items, searchQuery, sortField, sortOrder]);

  const handleOpenFolder = useCallback((folderId: string) => {
    setCurrentFolderId(folderId);
    setSearchQuery('');
  }, []);

  const handleSortChange = useCallback((field: SortField, order: SortOrder) => {
    setSortField(field);
    setSortOrder(order);
  }, []);

  // Confirmation modal triggers
  const promptDeletePermanent = useCallback((id: string, name: string) => {
    setConfirmDialog({
      isOpen: true,
      type: 'delete',
      id,
      name,
      title: 'Hapus Berkas Permanen?',
      description: `Apakah Anda yakin ingin menghapus "${name}" secara permanen? Tindakan ini tidak dapat dibatalkan dan berkas fisik di server akan dimusnahkan.`,
    });
  }, []);

  const promptEmptyTrash = useCallback(() => {
    setConfirmDialog({
      isOpen: true,
      type: 'emptyTrash',
      title: 'Kosongkan Tempat Sampah?',
      description:
        'Seluruh berkas dan folder di dalam tempat sampah akan dihapus secara permanen dari server penyimpanan.',
    });
  }, []);

  const handleConfirmAction = () => {
    if (confirmDialog.type === 'delete' && confirmDialog.id) {
      deletePermanent(confirmDialog.id, {
        onSettled: () => setConfirmDialog((prev) => ({ ...prev, isOpen: false })),
      });
    } else if (confirmDialog.type === 'emptyTrash') {
      emptyTrash(undefined, {
        onSettled: () => setConfirmDialog((prev) => ({ ...prev, isOpen: false })),
      });
    }
  };

  return (
    <section
      role="region"
      aria-label="Drive Storage Explorer"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className="space-y-6 max-w-7xl mx-auto animate-in relative pb-12"
    >
      {/* Drag & Drop Visual Backdrop Overlay */}
      {isDragging && !isTrash && (
        <div className="fixed inset-0 z-50 bg-black/85 border-2 border-dashed border-primary-400 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center pointer-events-none animate-in fade-in duration-200">
          <div className="p-6 rounded-[2rem] bg-primary-500/15 text-primary-400 mb-4 animate-bounce border border-primary-500/40 shadow-2xl">
            <UploadCloud className="h-16 w-16" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Lepaskan Berkas di Sini</h2>
          <p className="text-sm text-primary-200 max-w-md leading-relaxed font-sans">
            Upload file, gambar, dokumen PDF, berkas zip, atau video langsung ke private node drive
          </p>
        </div>
      )}

      {/* Hidden File Input for Native File Dialog */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        multiple
        aria-hidden="true"
        tabIndex={-1}
      />

      {/* Upload Progress Bar Card */}
      {uploadProgress && (
        <Card
          role="status"
          aria-live="polite"
          className="p-4 border-primary-500/40 bg-primary-500/10 shadow-xl animate-in fade-in duration-200"
        >
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-medium text-primary-300 flex items-center gap-2 truncate max-w-md">
              <UploadCloud className="h-4 w-4 animate-bounce text-primary-400 flex-shrink-0" />
              Mengupload ({uploadProgress.current}/{uploadProgress.total}):{' '}
              <span className="font-semibold text-white truncate">{uploadProgress.fileName}</span>
            </span>
            <span className="font-mono text-primary-400 font-bold">{uploadProgress.percent}%</span>
          </div>
          <div className="w-full bg-dark-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-primary-500 h-full rounded-full transition-all duration-200 shadow-sm"
              style={{ width: `${Math.max(2, uploadProgress.percent)}%` }}
            />
          </div>
        </Card>
      )}

      {/* Toolbar: Breadcrumbs, Search, View Mode, Controls */}
      <DriveToolbar
        isTrash={isTrash}
        breadcrumbs={data?.breadcrumbs || []}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        sortField={sortField}
        sortOrder={sortOrder}
        onSortChange={handleSortChange}
        onNavigateRoot={() => setCurrentFolderId(null)}
        onNavigateFolder={handleOpenFolder}
        onOpenCreateFolder={() => setIsCreatingFolderInline(true)}
        onTriggerUpload={() => fileInputRef.current?.click()}
        onEmptyTrash={promptEmptyTrash}
        onRefresh={() => refetch()}
        isUploading={isUploading}
        isRefreshing={isFetching}
      />

      {/* Inline Folder Creation Form */}
      {isCreatingFolderInline && (
        <Card className="p-4 border-primary-500/40 bg-primary-500/10 shadow-lg animate-in slide-in-from-top-2 duration-200">
          <form onSubmit={handleCreateFolderSubmit} className="space-y-2">
            <div className="flex items-center gap-3">
              <FolderPlus className="h-5 w-5 text-primary-400 flex-shrink-0" />
              <Input
                value={newFolderName}
                onChange={(e) => {
                  setNewFolderName(e.target.value);
                  if (newFolderError) setNewFolderError(null);
                }}
                placeholder="Nama folder baru..."
                className="flex-1 h-9 text-sm bg-dark-950/80 border-dark-700"
                autoFocus
                aria-label="Nama folder baru"
              />
              <Button
                type="submit"
                size="sm"
                loading={isCreatingFolder}
                disabled={!newFolderName.trim()}
                className="text-xs"
              >
                Simpan
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsCreatingFolderInline(false);
                  setNewFolderName('');
                  setNewFolderError(null);
                }}
                className="text-xs"
              >
                Batal
              </Button>
            </div>
            {newFolderError && (
              <p className="text-xs text-rose-400 font-medium pl-8 flex items-center gap-1.5">
                <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                {newFolderError}
              </p>
            )}
          </form>
        </Card>
      )}

      {/* Error State Fallback */}
      {isError && (
        <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-center space-y-3">
          <AlertCircle className="h-8 w-8 text-rose-400 mx-auto" />
          <h3 className="text-sm font-semibold text-rose-200">Gagal mengambil data dari server drive</h3>
          <p className="text-xs text-rose-300 max-w-md mx-auto">
            {error instanceof Error ? error.message : (error as { message?: string })?.message || 'Terjadi kesalahan saat berkomunikasi dengan server penyimpanan.'}
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="text-xs border-rose-500/40 text-rose-300 hover:bg-rose-500/20"
            leftIcon={<RefreshCw className="h-3.5 w-3.5" />}
          >
            Coba Lagi
          </Button>
        </div>
      )}

      {/* Files & Folders List / Grid Area */}
      {isLoading ? (
        <div className="py-24 flex flex-col justify-center items-center gap-3">
          <div className="animate-spin rounded-full h-9 w-9 border-b-2 border-primary-500" />
          <span className="text-xs text-dark-400 font-mono">Memuat berkas drive...</span>
        </div>
      ) : processedItems.length === 0 ? (
        /* Contextual Empty State */
        <div className="py-20 text-center border-2 border-dashed border-dark-800 rounded-3xl p-8 bg-dark-900/40">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-dark-800/80 border border-dark-700/50 flex items-center justify-center text-dark-400 mb-4 shadow-inner">
            {searchQuery ? (
              <Search className="h-7 w-7 text-dark-400" />
            ) : isTrash ? (
              <Trash2 className="h-7 w-7 text-dark-400" />
            ) : (
              <HardDrive className="h-7 w-7 text-dark-400" />
            )}
          </div>
          <h3 className="text-base font-semibold text-dark-200 tracking-tight">
            {searchQuery
              ? `Tidak ada hasil untuk "${searchQuery}"`
              : isTrash
              ? 'Tempat sampah kosong'
              : 'Folder ini masih kosong'}
          </h3>
          <p className="text-xs text-dark-400 max-w-sm mx-auto mt-1.5 leading-relaxed font-sans">
            {searchQuery
              ? 'Periksa ejaan kata kunci atau coba gunakan istilah pencarian yang berbeda.'
              : isTrash
              ? 'File atau folder yang dihapus akan disimpan di sini sebelum dimusnahkan secara permanen.'
              : 'Klik tombol "Upload Berkas", seret & lepas file ke sini, atau buat folder baru.'}
          </p>

          {!isTrash && !searchQuery && (
            <div className="mt-5 flex items-center justify-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setIsCreatingFolderInline(true)}
                leftIcon={<FolderPlus className="h-4 w-4" />}
                className="text-xs"
              >
                Buat Folder
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                leftIcon={<UploadCloud className="h-4 w-4" />}
                className="text-xs shadow-md shadow-primary-500/20"
              >
                Upload Berkas
              </Button>
            </div>
          )}
        </div>
      ) : viewMode === 'grid' ? (
        /* Grid Layout */
        <div
          role="list"
          aria-label="Daftar Berkas Grid"
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          {processedItems.map((item) => (
            <div key={item.id} role="listitem">
              <DriveItemCard
                item={item}
                viewMode="grid"
                isTrash={isTrash}
                onOpenFolder={handleOpenFolder}
                onPreviewFile={setPreviewItem}
                onRename={(id, name) => renameItem({ id, name })}
                onTrash={(id) => moveToTrash(id)}
                onRestore={(id) => restoreItem(id)}
                onDeletePermanent={promptDeletePermanent}
              />
            </div>
          ))}
        </div>
      ) : (
        /* List Layout */
        <div
          role="list"
          aria-label="Daftar Berkas List"
          className="space-y-2"
        >
          {processedItems.map((item) => (
            <div key={item.id} role="listitem">
              <DriveItemCard
                item={item}
                viewMode="list"
                isTrash={isTrash}
                onOpenFolder={handleOpenFolder}
                onPreviewFile={setPreviewItem}
                onRename={(id, name) => renameItem({ id, name })}
                onTrash={(id) => moveToTrash(id)}
                onRestore={(id) => restoreItem(id)}
                onDeletePermanent={promptDeletePermanent}
              />
            </div>
          ))}
        </div>
      )}

      {/* Global File Preview Modal with Playlist Navigation */}
      <FilePreviewModal
        item={previewItem}
        items={processedItems}
        onClose={() => setPreviewItem(null)}
        onNavigate={setPreviewItem}
      />

      {/* Accessible Confirmation Modal (Replaces browser window.confirm) */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={handleConfirmAction}
        title={confirmDialog.title}
        description={confirmDialog.description}
        confirmText="Hapus Permanen"
        cancelText="Batal"
        variant="danger"
        isLoading={isDeletingPermanent || isEmptyingTrash}
      />
    </section>
  );
}

export default MyDrive;
