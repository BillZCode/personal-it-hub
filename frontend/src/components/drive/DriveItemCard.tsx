import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  Download,
  Eye,
  Trash2,
  Edit2,
  RefreshCw,
  Check,
  X,
  AlertCircle
} from 'lucide-react';
import { DriveItem, driveApi } from '../../services/api';
import { formatBytes, formatRelativeTime } from '../../utils';
import {
  isImageFile,
  getFileExtension,
  getFileCategory,
  getCategoryBadgeStyles,
  validateFileName
} from '../../utils/fileTypes';
import FileIcon from './FileIcon';
import { Input } from '../ui';

interface DriveItemCardProps {
  item: DriveItem;
  viewMode: 'grid' | 'list';
  isTrash: boolean;
  onOpenFolder: (folderId: string) => void;
  onPreviewFile: (item: DriveItem) => void;
  onRename: (id: string, newName: string) => void;
  onTrash: (id: string) => void;
  onRestore: (id: string) => void;
  onDeletePermanent: (id: string, name: string) => void;
}

export const DriveItemCard: React.FC<DriveItemCardProps> = React.memo(({
  item,
  viewMode,
  isTrash,
  onOpenFolder,
  onPreviewFile,
  onRename,
  onTrash,
  onRestore,
  onDeletePermanent,
}) => {
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState(item.name);
  const [renameError, setRenameError] = useState<string | null>(null);
  const [thumbError, setThumbError] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);

  const renameInputRef = useRef<HTMLInputElement>(null);

  const isImg = isImageFile(item);
  const ext = getFileExtension(item.name).toUpperCase();
  const category = getFileCategory(item);
  const badgeStyles = getCategoryBadgeStyles(category);

  // Sync renameValue when item name changes from props
  useEffect(() => {
    setRenameValue(item.name);
  }, [item.name]);

  // Focus rename input on rename mode
  useEffect(() => {
    if (isRenaming) {
      renameInputRef.current?.focus();
      renameInputRef.current?.select();
    }
  }, [isRenaming]);

  const handlePrimaryClick = useCallback(() => {
    if (isTrash) return;
    if (item.type === 'FOLDER') {
      onOpenFolder(item.id);
    } else {
      onPreviewFile(item);
    }
  }, [isTrash, item, onOpenFolder, onPreviewFile]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (isRenaming) return;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handlePrimaryClick();
      } else if (e.key === 'F2' && !isTrash) {
        e.preventDefault();
        setIsRenaming(true);
      } else if (e.key === 'Delete') {
        e.preventDefault();
        if (isTrash) {
          onDeletePermanent(item.id, item.name);
        } else {
          onTrash(item.id);
        }
      }
    },
    [isRenaming, isTrash, handlePrimaryClick, item.id, item.name, onDeletePermanent, onTrash]
  );

  const handleRenameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateFileName(renameValue);
    if (!validation.valid) {
      setRenameError(validation.error || 'Nama tidak valid');
      return;
    }

    if (renameValue.trim() !== item.name) {
      onRename(item.id, renameValue.trim());
    }
    setRenameError(null);
    setIsRenaming(false);
  };

  const handleCancelRename = () => {
    setRenameValue(item.name);
    setRenameError(null);
    setIsRenaming(false);
  };

  // ================= LIST VIEW =================
  if (viewMode === 'list') {
    return (
      <div
        role="button"
        tabIndex={isTrash ? -1 : 0}
        aria-label={`${item.type === 'FOLDER' ? 'Folder' : 'Berkas'}: ${item.name}`}
        onKeyDown={handleKeyDown}
        onClick={handlePrimaryClick}
        className={`group relative flex items-center justify-between p-2.5 sm:p-3 rounded-xl border border-dark-800/80 bg-dark-900/60 hover:bg-dark-850 hover:border-dark-700 hover:shadow-md transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-primary-500 ${
          !isTrash ? 'cursor-pointer active:scale-[0.995]' : ''
        }`}
      >
        <div className="flex items-center gap-3 min-w-0 flex-1 mr-3">
          <div className="p-2 bg-dark-800/90 rounded-lg flex-shrink-0 border border-dark-700/50 group-hover:border-primary-500/30 transition-colors">
            <FileIcon item={item} size="md" />
          </div>

          <div className="min-w-0 flex-1">
            {isRenaming ? (
              <form
                onSubmit={handleRenameSubmit}
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-2 max-w-sm"
              >
                <div className="relative flex-1">
                  <Input
                    ref={renameInputRef}
                    value={renameValue}
                    onChange={(e) => {
                      setRenameValue(e.target.value);
                      if (renameError) setRenameError(null);
                    }}
                    className="h-8 text-xs bg-dark-950 border-dark-700"
                    aria-label="Nama baru"
                  />
                  {renameError && (
                    <span className="absolute -bottom-5 left-0 text-[10px] text-rose-400 font-medium flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {renameError}
                    </span>
                  )}
                </div>
                <button
                  type="submit"
                  className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 touch-manipulation transition-colors"
                  aria-label="Simpan perubahan nama"
                >
                  <Check className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={handleCancelRename}
                  className="p-1.5 rounded-lg bg-dark-800 text-dark-400 hover:bg-dark-700 touch-manipulation transition-colors"
                  aria-label="Batal ubah nama"
                >
                  <X className="h-4 w-4" />
                </button>
              </form>
            ) : (
              <p
                className="text-xs sm:text-sm font-medium text-dark-200 group-hover:text-primary-300 truncate transition-colors"
                title={item.name}
              >
                {item.name}
              </p>
            )}
          </div>
        </div>

        {/* List view metadata & actions */}
        <div className="flex items-center gap-3 sm:gap-6 flex-shrink-0 text-xs text-dark-400 font-mono">
          <span className="hidden sm:inline w-20 text-right">
            {item.type === 'FOLDER' ? (
              <span className="text-amber-400/80 font-sans font-medium">Folder</span>
            ) : (
              formatBytes(item.size)
            )}
          </span>
          <span className="hidden md:inline w-24 text-right">
            {formatRelativeTime(item.createdAt)}
          </span>

          {/* Action buttons */}
          <div
            className="flex items-center gap-1 opacity-100 sm:opacity-60 sm:group-hover:opacity-100 transition-opacity"
            onClick={(e) => e.stopPropagation()}
          >
            {!isTrash ? (
              <>
                {item.type === 'FILE' && (
                  <>
                    <button
                      type="button"
                      onClick={() => onPreviewFile(item)}
                      className="p-2 sm:p-1.5 rounded-lg text-dark-300 hover:text-primary-400 hover:bg-dark-800 active:scale-95 transition-all touch-manipulation focus-visible:ring-1 focus-visible:ring-primary-500"
                      title="Lihat Pratinjau (Spasi)"
                      aria-label="Lihat Pratinjau"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <a
                      href={driveApi.getDownloadUrl(item.id)}
                      download={item.name}
                      className="p-2 sm:p-1.5 rounded-lg text-dark-300 hover:text-primary-400 hover:bg-dark-800 active:scale-95 transition-all touch-manipulation focus-visible:ring-1 focus-visible:ring-primary-500"
                      title="Download Berkas"
                      aria-label="Download Berkas"
                    >
                      <Download className="h-4 w-4" />
                    </a>
                  </>
                )}
                <button
                  type="button"
                  onClick={() => setIsRenaming(true)}
                  className="p-2 sm:p-1.5 rounded-lg text-dark-300 hover:text-amber-400 hover:bg-dark-800 active:scale-95 transition-all touch-manipulation focus-visible:ring-1 focus-visible:ring-primary-500"
                  title="Ganti Nama (F2)"
                  aria-label="Ganti Nama"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onTrash(item.id)}
                  className="p-2 sm:p-1.5 rounded-lg text-dark-300 hover:text-rose-400 hover:bg-dark-800 active:scale-95 transition-all touch-manipulation focus-visible:ring-1 focus-visible:ring-primary-500"
                  title="Pindahkan ke Sampah (Delete)"
                  aria-label="Pindahkan ke Sampah"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => onRestore(item.id)}
                  className="p-2 sm:p-1.5 rounded-lg text-dark-300 hover:text-emerald-400 hover:bg-dark-800 active:scale-95 transition-all touch-manipulation focus-visible:ring-1 focus-visible:ring-primary-500"
                  title="Pulihkan Berkas"
                  aria-label="Pulihkan Berkas"
                >
                  <RefreshCw className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onDeletePermanent(item.id, item.name)}
                  className="p-2 sm:p-1.5 rounded-lg text-dark-300 hover:text-rose-400 hover:bg-dark-800 active:scale-95 transition-all touch-manipulation focus-visible:ring-1 focus-visible:ring-primary-500"
                  title="Hapus Permanen"
                  aria-label="Hapus Permanen"
                >
                  <Trash2 className="h-4 w-4 text-rose-400" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ================= GRID VIEW (Double-Bezel Design) =================
  return (
    <div
      role="button"
      tabIndex={isTrash ? -1 : 0}
      aria-label={`${item.type === 'FOLDER' ? 'Folder' : 'Berkas'}: ${item.name}`}
      onKeyDown={handleKeyDown}
      onClick={handlePrimaryClick}
      className={`group relative p-1 rounded-2xl bg-gradient-to-b from-white/5 via-dark-900 to-transparent border border-white/5 hover:border-primary-500/40 hover:shadow-xl transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-primary-500 ${
        !isTrash ? 'cursor-pointer' : ''
      }`}
    >
      {/* Inner Core Card */}
      <div className="rounded-[calc(1rem-0.125rem)] bg-dark-900/90 p-3.5 flex flex-col justify-between h-full relative overflow-hidden shadow-inner">
        {/* Subtle Ambient Sheen */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />

        <div>
          {/* Header Row: Thumbnail / Icon & Actions */}
          <div className="flex items-start justify-between gap-2 mb-3">
            <div
              className={`p-2 bg-dark-800/90 rounded-xl border border-dark-700/60 group-hover:border-primary-500/50 transition-all flex items-center justify-center overflow-hidden w-12 h-12 relative flex-shrink-0 shadow-sm ${
                !isTrash ? 'active:scale-95' : ''
              }`}
            >
              {item.type === 'FILE' && isImg && !isTrash && !thumbError ? (
                <>
                  {isImageLoading && (
                    <div className="absolute inset-0 bg-dark-800 animate-pulse rounded-lg" />
                  )}
                  <img
                    src={driveApi.getPreviewUrl(item.id)}
                    alt={item.name}
                    loading="lazy"
                    onLoad={() => setIsImageLoading(false)}
                    onError={() => {
                      setThumbError(true);
                      setIsImageLoading(false);
                    }}
                    className={`w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-300 ${
                      isImageLoading ? 'opacity-0' : 'opacity-100'
                    }`}
                  />
                </>
              ) : (
                <FileIcon item={item} size="lg" />
              )}
            </div>

            {/* Quick Action Buttons */}
            <div
              className="flex items-center gap-0.5 opacity-100 sm:opacity-50 sm:group-hover:opacity-100 transition-opacity"
              onClick={(e) => e.stopPropagation()}
            >
              {!isTrash ? (
                <>
                  {item.type === 'FILE' && (
                    <>
                      <button
                        type="button"
                        onClick={() => onPreviewFile(item)}
                        className="p-1.5 rounded-lg text-dark-300 hover:text-primary-400 hover:bg-dark-800 active:scale-95 transition-all touch-manipulation"
                        title="Lihat Pratinjau (Spasi)"
                        aria-label="Lihat Pratinjau"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </button>
                      <a
                        href={driveApi.getDownloadUrl(item.id)}
                        download={item.name}
                        className="p-1.5 rounded-lg text-dark-300 hover:text-primary-400 hover:bg-dark-800 active:scale-95 transition-all touch-manipulation"
                        title="Download Berkas"
                        aria-label="Download Berkas"
                      >
                        <Download className="h-3.5 w-3.5" />
                      </a>
                    </>
                  )}
                  <button
                    type="button"
                    onClick={() => setIsRenaming(true)}
                    className="p-1.5 rounded-lg text-dark-300 hover:text-amber-400 hover:bg-dark-800 active:scale-95 transition-all touch-manipulation"
                    title="Ganti Nama (F2)"
                    aria-label="Ganti Nama"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onTrash(item.id)}
                    className="p-1.5 rounded-lg text-dark-300 hover:text-rose-400 hover:bg-dark-800 active:scale-95 transition-all touch-manipulation"
                    title="Pindahkan ke Sampah (Delete)"
                    aria-label="Pindahkan ke Sampah"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => onRestore(item.id)}
                    className="p-1.5 rounded-lg text-dark-300 hover:text-emerald-400 hover:bg-dark-800 active:scale-95 transition-all touch-manipulation"
                    title="Pulihkan Berkas"
                    aria-label="Pulihkan Berkas"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeletePermanent(item.id, item.name)}
                    className="p-1.5 rounded-lg text-dark-300 hover:text-rose-400 hover:bg-dark-800 active:scale-95 transition-all touch-manipulation"
                    title="Hapus Permanen"
                    aria-label="Hapus Permanen"
                  >
                    <Trash2 className="h-3.5 w-3.5 text-rose-400" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Item Name / Inline Rename */}
          {isRenaming ? (
            <form
              onSubmit={handleRenameSubmit}
              onClick={(e) => e.stopPropagation()}
              className="space-y-1.5 my-1"
            >
              <div className="flex items-center gap-1.5">
                <Input
                  ref={renameInputRef}
                  value={renameValue}
                  onChange={(e) => {
                    setRenameValue(e.target.value);
                    if (renameError) setRenameError(null);
                  }}
                  className="h-7 text-xs bg-dark-950 border-dark-700"
                  aria-label="Nama baru"
                />
                <button
                  type="submit"
                  className="p-1 rounded-md bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-colors"
                  aria-label="Simpan perubahan nama"
                >
                  <Check className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={handleCancelRename}
                  className="p-1 rounded-md bg-dark-800 text-dark-400 hover:bg-dark-700 transition-colors"
                  aria-label="Batal ubah nama"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
              {renameError && (
                <p className="text-[10px] text-rose-400 font-medium flex items-center gap-1">
                  <AlertCircle className="h-3 w-3 flex-shrink-0" />
                  {renameError}
                </p>
              )}
            </form>
          ) : (
            <p
              className="font-medium text-xs sm:text-sm text-dark-200 group-hover:text-primary-300 truncate transition-colors tracking-tight"
              title={item.name}
            >
              {item.name}
            </p>
          )}
        </div>

        {/* Card Footer: Category Badge, Size & Timestamp */}
        <div className="mt-3.5 pt-2 border-t border-dark-800/80 flex items-center justify-between text-[11px] text-dark-500 font-mono">
          <span className="flex items-center gap-1.5">
            {item.type === 'FILE' && ext ? (
              <span
                className={`px-1.5 py-0.5 rounded border text-[10px] font-bold ${badgeStyles.bg} ${badgeStyles.text} ${badgeStyles.border}`}
              >
                {ext}
              </span>
            ) : (
              <span className="px-1.5 py-0.5 rounded border text-[10px] font-bold bg-amber-500/10 text-amber-400 border-amber-500/30">
                DIR
              </span>
            )}
            <span>{item.type === 'FOLDER' ? 'Folder' : formatBytes(item.size)}</span>
          </span>
          <span className="text-[10px]">{formatRelativeTime(item.createdAt)}</span>
        </div>
      </div>
    </div>
  );
});

DriveItemCard.displayName = 'DriveItemCard';

export default DriveItemCard;
