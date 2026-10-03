import React, { useRef, useEffect } from 'react';
import {
  FolderPlus,
  UploadCloud,
  Trash2,
  RefreshCw,
  ChevronRight,
  Home,
  Search,
  LayoutGrid,
  List,
  ArrowUpDown,
  X
} from 'lucide-react';
import { Button, Input } from '../ui';

export type SortField = 'name' | 'createdAt' | 'size';
export type SortOrder = 'asc' | 'desc';

interface BreadcrumbItem {
  id: string;
  name: string;
}

interface DriveToolbarProps {
  isTrash: boolean;
  breadcrumbs: BreadcrumbItem[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  sortField: SortField;
  sortOrder: SortOrder;
  onSortChange: (field: SortField, order: SortOrder) => void;
  onNavigateRoot: () => void;
  onNavigateFolder: (id: string) => void;
  onOpenCreateFolder: () => void;
  onTriggerUpload: () => void;
  onEmptyTrash: () => void;
  onRefresh: () => void;
  isUploading: boolean;
  isRefreshing?: boolean;
}

export const DriveToolbar: React.FC<DriveToolbarProps> = React.memo(({
  isTrash,
  breadcrumbs,
  searchQuery,
  onSearchChange,
  viewMode,
  onViewModeChange,
  sortField,
  sortOrder,
  onSortChange,
  onNavigateRoot,
  onNavigateFolder,
  onOpenCreateFolder,
  onTriggerUpload,
  onEmptyTrash,
  onRefresh,
  isUploading,
  isRefreshing = false,
}) => {
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Global '/' keyboard shortcut to focus search input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === '/' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleSortOrder = () => {
    onSortChange(sortField, sortOrder === 'asc' ? 'desc' : 'asc');
  };

  return (
    <nav
      aria-label="Drive Toolbar"
      className="p-1 rounded-2xl bg-gradient-to-b from-white/10 via-dark-900 to-transparent border border-white/5 shadow-xl"
    >
      <div className="rounded-[calc(1rem-0.125rem)] bg-dark-900/90 border border-dark-800 p-3 sm:p-4 space-y-3 relative overflow-hidden">
        {/* Subtle Ambient Sheen */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />

        {/* Top Row: Breadcrumbs & Primary Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Breadcrumb Path Navigation */}
          <ol
            aria-label="Hierarki Folder"
            className="flex items-center gap-1.5 flex-wrap text-xs sm:text-sm list-none p-0 m-0"
          >
            <li>
              <button
                type="button"
                onClick={onNavigateRoot}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-dark-300 hover:text-primary-400 hover:bg-dark-800/80 active:scale-95 transition-all outline-none focus-visible:ring-1 focus-visible:ring-primary-500 font-medium"
                aria-label="Root Drive"
              >
                <Home className="h-3.5 w-3.5 text-primary-400" />
                <span>Drive</span>
              </button>
            </li>

            {!isTrash &&
              breadcrumbs.map((crumb, idx) => (
                <li key={crumb.id} className="flex items-center gap-1.5">
                  <ChevronRight className="h-3.5 w-3.5 text-dark-600 flex-shrink-0" aria-hidden="true" />
                  <button
                    type="button"
                    onClick={() => onNavigateFolder(crumb.id)}
                    className={`px-2.5 py-1.5 rounded-lg transition-all outline-none focus-visible:ring-1 focus-visible:ring-primary-500 truncate max-w-[140px] sm:max-w-[200px] ${
                      idx === breadcrumbs.length - 1
                        ? 'text-primary-300 bg-primary-500/10 font-semibold'
                        : 'text-dark-300 hover:text-primary-400 hover:bg-dark-800/80 font-medium'
                    }`}
                    title={crumb.name}
                    aria-current={idx === breadcrumbs.length - 1 ? 'location' : undefined}
                  >
                    {crumb.name}
                  </button>
                </li>
              ))}

            {isTrash && (
              <li className="flex items-center gap-1.5">
                <ChevronRight className="h-3.5 w-3.5 text-dark-600 flex-shrink-0" aria-hidden="true" />
                <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 font-medium text-xs flex items-center gap-1">
                  <Trash2 className="h-3 w-3" />
                  Tempat Sampah
                </span>
              </li>
            )}
          </ol>

          {/* Primary Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap flex-shrink-0">
            {!isTrash ? (
              <>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={onOpenCreateFolder}
                  leftIcon={<FolderPlus className="h-4 w-4 text-amber-400" />}
                  className="text-xs active:scale-95"
                  aria-label="Buat Folder Baru"
                >
                  Folder Baru
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={onTriggerUpload}
                  loading={isUploading}
                  leftIcon={<UploadCloud className="h-4 w-4" />}
                  className="text-xs shadow-lg shadow-primary-500/25 active:scale-95"
                  aria-label="Upload Berkas ke Drive"
                >
                  {isUploading ? 'Mengupload...' : 'Upload Berkas'}
                </Button>
              </>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={onEmptyTrash}
                className="text-rose-400 border-rose-500/30 hover:bg-rose-500/10 text-xs active:scale-95"
                leftIcon={<Trash2 className="h-4 w-4" />}
                aria-label="Kosongkan Semua Sampah"
              >
                Kosongkan Sampah
              </Button>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={onRefresh}
              title="Muat Ulang Berkas"
              aria-label="Muat Ulang Berkas"
              className="p-2 text-dark-400 hover:text-dark-100 active:scale-95"
            >
              <RefreshCw
                className={`h-4 w-4 ${isRefreshing ? 'animate-spin text-primary-400' : ''}`}
                aria-hidden="true"
              />
            </Button>
          </div>
        </div>

        {/* Bottom Row: Search Filter, Sorting, View Mode Switcher */}
        <div className="pt-2 border-t border-dark-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          {/* Search Bar within Current Directory */}
          <div className="relative flex-1 max-w-md">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-dark-400 pointer-events-none"
              aria-hidden="true"
            />
            <Input
              ref={searchInputRef}
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Cari file atau folder di sini..."
              className="h-8 pl-8 pr-14 text-xs bg-dark-950/70 border-dark-700/80 focus:border-primary-500/80 font-sans"
              aria-label="Cari file atau folder"
            />
            {searchQuery ? (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded text-dark-400 hover:text-dark-100"
                title="Bersihkan Pencarian"
                aria-label="Bersihkan Pencarian"
              >
                <X className="h-3 w-3" />
              </button>
            ) : (
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded bg-dark-800 text-[10px] font-mono text-dark-400 select-none pointer-events-none border border-dark-700">
                /
              </span>
            )}
          </div>

          {/* Controls: Sort and View Mode */}
          <div className="flex items-center gap-2 self-end sm:self-auto flex-shrink-0">
            {/* Sort Selector */}
            <div className="flex items-center gap-1 bg-dark-950/80 rounded-xl p-0.5 border border-dark-700/80 shadow-inner">
              <select
                value={sortField}
                onChange={(e) => onSortChange(e.target.value as SortField, sortOrder)}
                className="h-7 px-2 bg-transparent text-xs text-dark-300 font-medium focus:outline-none cursor-pointer"
                title="Urutkan Berdasarkan"
                aria-label="Urutkan Berdasarkan"
              >
                <option value="name" className="bg-dark-900 text-dark-200">Nama</option>
                <option value="createdAt" className="bg-dark-900 text-dark-200">Tanggal</option>
                <option value="size" className="bg-dark-900 text-dark-200">Ukuran</option>
              </select>

              <button
                type="button"
                onClick={toggleSortOrder}
                className="p-1.5 rounded-lg text-dark-400 hover:text-dark-100 hover:bg-dark-800 active:scale-95 transition-all outline-none focus-visible:ring-1 focus-visible:ring-primary-500"
                title={sortOrder === 'asc' ? 'Urutan Naik (A-Z)' : 'Urutan Turun (Z-A)'}
                aria-label={`Ubah Arah Urutan (Sekarang: ${sortOrder === 'asc' ? 'Naik' : 'Turun'})`}
              >
                <ArrowUpDown className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* View Mode Toggle: Grid vs List */}
            <div className="flex items-center bg-dark-950/80 rounded-xl p-0.5 border border-dark-700/80 shadow-inner">
              <button
                type="button"
                onClick={() => onViewModeChange('grid')}
                className={`p-1.5 rounded-lg transition-all active:scale-95 outline-none focus-visible:ring-1 focus-visible:ring-primary-500 ${
                  viewMode === 'grid'
                    ? 'bg-primary-500/20 text-primary-400 font-semibold shadow-sm'
                    : 'text-dark-400 hover:text-dark-200'
                }`}
                title="Tampilan Grid"
                aria-label="Tampilan Grid"
                aria-pressed={viewMode === 'grid'}
              >
                <LayoutGrid className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onViewModeChange('list')}
                className={`p-1.5 rounded-lg transition-all active:scale-95 outline-none focus-visible:ring-1 focus-visible:ring-primary-500 ${
                  viewMode === 'list'
                    ? 'bg-primary-500/20 text-primary-400 font-semibold shadow-sm'
                    : 'text-dark-400 hover:text-dark-200'
                }`}
                title="Tampilan List"
                aria-label="Tampilan List"
                aria-pressed={viewMode === 'list'}
              >
                <List className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
});

DriveToolbar.displayName = 'DriveToolbar';

export default DriveToolbar;
