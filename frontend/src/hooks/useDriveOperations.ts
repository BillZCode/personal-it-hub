import { useState, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { driveApi } from '../services/api';
import { useToast } from './index';
import { validateFileName } from '../utils/fileTypes';

export interface UploadProgressState {
  current: number;
  total: number;
  fileName: string;
  percent: number;
}

export function useDriveOperations(currentFolderId: string | null, isTrash: boolean) {
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  // Upload state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgressState | null>(null);

  // Invalidate Drive queries helper
  const invalidateDrive = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['drive'] });
  }, [queryClient]);

  // Create folder mutation
  const createFolderMutation = useMutation({
    mutationFn: async (name: string) => {
      const validation = validateFileName(name);
      if (!validation.valid) {
        throw new Error(validation.error || 'Nama folder tidak valid');
      }
      return driveApi.createFolder(name.trim(), currentFolderId);
    },
    onSuccess: () => {
      invalidateDrive();
      showToast('Folder berhasil dibuat', 'success');
    },
    onError: (err: any) => {
      showToast(err.message || 'Gagal membuat folder', 'error');
    },
  });

  // Rename mutation
  const renameMutation = useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) => {
      const validation = validateFileName(name);
      if (!validation.valid) {
        throw new Error(validation.error || 'Nama berkas tidak valid');
      }
      return driveApi.rename(id, name.trim());
    },
    onSuccess: () => {
      invalidateDrive();
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
      invalidateDrive();
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
      invalidateDrive();
      showToast('Item berhasil dipulihkan', 'success');
    },
    onError: (err: any) => {
      showToast(err.message || 'Gagal memulihkan item', 'error');
    },
  });

  // Delete permanent mutation
  const deletePermanentMutation = useMutation({
    mutationFn: (id: string) => driveApi.deletePermanent(id),
    onSuccess: () => {
      invalidateDrive();
      showToast('Item dihapus permanen dari server', 'success');
    },
    onError: (err: any) => {
      showToast(err.message || 'Gagal menghapus item secara permanen', 'error');
    },
  });

  // Empty trash mutation
  const emptyTrashMutation = useMutation({
    mutationFn: () => driveApi.emptyTrash(),
    onSuccess: () => {
      invalidateDrive();
      showToast('Seluruh sampah dibersihkan permanen', 'success');
    },
    onError: (err: any) => {
      showToast(err.message || 'Gagal membersihkan sampah', 'error');
    },
  });

  // Batch upload processor
  const uploadFiles = useCallback(
    async (files: File[]) => {
      if (files.length === 0 || isTrash) return;
      setIsUploading(true);
      let successCount = 0;
      let failCount = 0;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setUploadProgress({
          current: i + 1,
          total: files.length,
          fileName: file.name,
          percent: 0,
        });

        try {
          await driveApi.upload(file, currentFolderId, (percent) => {
            setUploadProgress((prev) => (prev ? { ...prev, percent } : null));
          });
          successCount++;
        } catch (err: any) {
          failCount++;
          showToast(`Gagal upload "${file.name}": ${err.message || 'Error'}`, 'error');
        }
      }

      setIsUploading(false);
      setUploadProgress(null);
      invalidateDrive();

      if (successCount > 0) {
        showToast(
          files.length === 1
            ? `File "${files[0].name}" berhasil diupload!`
            : `${successCount} file berhasil diupload!${failCount > 0 ? ` (${failCount} gagal)` : ''}`,
          'success'
        );
      }
    },
    [currentFolderId, isTrash, invalidateDrive, showToast]
  );

  return {
    isUploading,
    uploadProgress,
    uploadFiles,
    createFolder: createFolderMutation.mutate,
    isCreatingFolder: createFolderMutation.isPending,
    renameItem: renameMutation.mutate,
    isRenaming: renameMutation.isPending,
    moveToTrash: trashMutation.mutate,
    isTrashing: trashMutation.isPending,
    restoreItem: restoreMutation.mutate,
    isRestoring: restoreMutation.isPending,
    deletePermanent: deletePermanentMutation.mutate,
    isDeletingPermanent: deletePermanentMutation.isPending,
    emptyTrash: emptyTrashMutation.mutate,
    isEmptyingTrash: emptyTrashMutation.isPending,
    invalidateDrive,
  };
}
