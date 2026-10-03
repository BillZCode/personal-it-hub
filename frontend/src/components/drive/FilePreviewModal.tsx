import React, { useState, useEffect, useCallback } from 'react';
import {
  X,
  Download,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCw,
  RotateCcw,
  Music,
  FileText,
  AlertCircle
} from 'lucide-react';
import { DriveItem, driveApi } from '../../services/api';
import { formatBytes } from '../../utils';
import { isImageFile, isPdfFile, isVideoFile, isAudioFile } from '../../utils/fileTypes';
import FileIcon from './FileIcon';

interface FilePreviewModalProps {
  item: DriveItem | null;
  items?: DriveItem[];
  onClose: () => void;
  onNavigate?: (item: DriveItem) => void;
}

export const FilePreviewModal: React.FC<FilePreviewModalProps> = ({
  item,
  items = [],
  onClose,
  onNavigate,
}) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [mediaError, setMediaError] = useState(false);

  // Filter only files (exclude folders) for playlist-like navigation
  const fileItems = items.filter((i) => i.type === 'FILE');
  const currentIndex = item ? fileItems.findIndex((i) => i.id === item.id) : -1;
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex >= 0 && currentIndex < fileItems.length - 1;

  // Reset zoom, rotation & error whenever the displayed item changes
  useEffect(() => {
    setZoomLevel(1);
    setRotation(0);
    setMediaError(false);
  }, [item?.id]);

  const handlePrevious = useCallback(() => {
    if (hasPrevious && onNavigate) {
      onNavigate(fileItems[currentIndex - 1]);
    }
  }, [hasPrevious, onNavigate, fileItems, currentIndex]);

  const handleNext = useCallback(() => {
    if (hasNext && onNavigate) {
      onNavigate(fileItems[currentIndex + 1]);
    }
  }, [hasNext, onNavigate, fileItems, currentIndex]);

  // Keyboard navigation shortcuts
  useEffect(() => {
    if (!item) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        handlePrevious();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if ((e.key === '+' || e.key === '=') && isImageFile(item)) {
        e.preventDefault();
        setZoomLevel((prev) => Math.min(3, +(prev + 0.25).toFixed(2)));
      } else if (e.key === '-' && isImageFile(item)) {
        e.preventDefault();
        setZoomLevel((prev) => Math.max(0.5, +(prev - 0.25).toFixed(2)));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [item, onClose, handlePrevious, handleNext]);

  if (!item) return null;

  const isImg = isImageFile(item);
  const isPdf = isPdfFile(item);
  const isVid = isVideoFile(item);
  const isAud = isAudioFile(item);
  const previewUrl = driveApi.getPreviewUrl(item.id);
  const downloadUrl = driveApi.getDownloadUrl(item.id);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="preview-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-2 sm:p-4 touch-manipulation animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Outer Shell (Double-Bezel Design) */}
      <div
        className="w-full max-w-5xl max-h-[96dvh] sm:max-h-[92vh] p-1 rounded-[1.75rem] bg-gradient-to-b from-white/15 to-transparent border border-white/10 shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Inner Core Container */}
        <div className="rounded-[calc(1.75rem-0.25rem)] bg-dark-900 border border-dark-800 flex flex-col flex-1 overflow-hidden relative shadow-inner">
          {/* Modal Top Header */}
          <header className="min-h-14 py-2.5 px-3 sm:px-6 border-b border-dark-800/80 flex items-center justify-between bg-dark-950/80 backdrop-blur gap-2 z-10">
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <div className="flex-shrink-0 p-1.5 bg-dark-800/80 rounded-lg border border-dark-700/50">
                <FileIcon item={item} size="md" />
              </div>
              <div className="min-w-0 flex-1">
                <h2
                  id="preview-modal-title"
                  className="font-semibold text-xs sm:text-sm text-dark-100 truncate"
                  title={item.name}
                >
                  {item.name}
                </h2>
                <div className="flex items-center gap-2 text-[10px] sm:text-xs text-dark-400 font-mono">
                  <span>{formatBytes(item.size)}</span>
                  {currentIndex >= 0 && (
                    <>
                      <span>•</span>
                      <span className="text-dark-400">
                        {currentIndex + 1} / {fileItems.length}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Header Controls */}
            <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
              {/* Open in full screen / native tab */}
              <a
                href={previewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-dark-800 text-dark-200 hover:text-white hover:bg-dark-700 text-xs font-medium transition-colors outline-none focus-visible:ring-1 focus-visible:ring-primary-500"
                title="Buka Layar Penuh di Tab Baru"
                aria-label="Buka Layar Penuh di Tab Baru"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Buka Penuh</span>
              </a>

              {/* Direct Download Button */}
              <a
                href={downloadUrl}
                download={item.name}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-primary-500/20 text-primary-400 text-xs font-medium hover:bg-primary-500/30 transition-colors outline-none focus-visible:ring-1 focus-visible:ring-primary-500"
                title="Download File"
                aria-label="Download File"
              >
                <Download className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Download</span>
              </a>

              {/* Close Button */}
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 sm:p-2 rounded-lg text-dark-400 hover:text-dark-100 hover:bg-dark-800 transition-colors touch-manipulation outline-none focus-visible:ring-1 focus-visible:ring-primary-500"
                aria-label="Tutup Pratinjau (Esc)"
                title="Tutup (Esc)"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </header>

          {/* Modal Center Body: Stream/Viewer Area */}
          <div className="flex-1 overflow-hidden relative flex items-center justify-center bg-dark-950/95 min-h-[300px]">
            {/* Previous File Floating Trigger */}
            {hasPrevious && (
              <button
                type="button"
                onClick={handlePrevious}
                className="absolute left-2 sm:left-4 z-20 p-2 sm:p-2.5 rounded-full bg-dark-900/80 border border-dark-700/80 text-dark-200 hover:text-white hover:bg-dark-800 backdrop-blur shadow-xl transition-all active:scale-95 touch-manipulation outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                title="File Sebelumnya (Panah Kiri)"
                aria-label="File Sebelumnya"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            )}

            {/* Next File Floating Trigger */}
            {hasNext && (
              <button
                type="button"
                onClick={handleNext}
                className="absolute right-2 sm:right-4 z-20 p-2 sm:p-2.5 rounded-full bg-dark-900/80 border border-dark-700/80 text-dark-200 hover:text-white hover:bg-dark-800 backdrop-blur shadow-xl transition-all active:scale-95 touch-manipulation outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                title="File Berikutnya (Panah Kanan)"
                aria-label="File Berikutnya"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            )}

            {/* Media Error State */}
            {mediaError ? (
              <div className="text-center p-6 space-y-4 max-w-md mx-auto">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                  <AlertCircle className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-dark-100">Gagal memuat pratinjau media</h3>
                  <p className="text-xs text-dark-400 mt-1">
                    Format mungkin terenkripsi atau stream server tidak merespons. Unduh berkas langsung:
                  </p>
                </div>
                <a
                  href={downloadUrl}
                  download={item.name}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-xl text-xs font-semibold shadow transition-colors"
                >
                  <Download className="h-4 w-4" />
                  Unduh Berkas
                </a>
              </div>
            ) : isImg ? (
              /* IMAGE VIEWER */
              <div className="w-full h-full flex flex-col items-center justify-between p-2 sm:p-4 overflow-auto">
                <div className="flex-1 flex items-center justify-center w-full min-h-[220px] overflow-auto select-none py-2">
                  <img
                    src={previewUrl}
                    alt={item.name}
                    onError={() => setMediaError(true)}
                    style={{
                      transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
                      transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                    className="max-h-[66vh] max-w-full rounded-lg object-contain shadow-2xl cursor-grab active:cursor-grabbing"
                    draggable={false}
                  />
                </div>

                {/* Floating Bottom Toolbar for Images */}
                <div className="z-10 mt-2 px-3 py-1.5 rounded-full bg-dark-900/90 border border-dark-700/80 backdrop-blur flex items-center gap-2 shadow-xl">
                  <button
                    type="button"
                    onClick={() => setZoomLevel((z) => Math.max(0.5, +(z - 0.25).toFixed(2)))}
                    className="p-1.5 rounded-full text-dark-300 hover:text-white hover:bg-dark-800 transition-colors"
                    title="Zoom Out (-)"
                    aria-label="Zoom Out"
                  >
                    <ZoomOut className="h-4 w-4" />
                  </button>
                  <span className="text-[11px] font-mono text-dark-300 w-12 text-center select-none">
                    {Math.round(zoomLevel * 100)}%
                  </span>
                  <button
                    type="button"
                    onClick={() => setZoomLevel((z) => Math.min(3, +(z + 0.25).toFixed(2)))}
                    className="p-1.5 rounded-full text-dark-300 hover:text-white hover:bg-dark-800 transition-colors"
                    title="Zoom In (+)"
                    aria-label="Zoom In"
                  >
                    <ZoomIn className="h-4 w-4" />
                  </button>

                  <div className="h-3 w-px bg-dark-700 mx-1" />

                  <button
                    type="button"
                    onClick={() => setRotation((r) => (r + 90) % 360)}
                    className="p-1.5 rounded-full text-dark-300 hover:text-white hover:bg-dark-800 transition-colors"
                    title="Putar 90°"
                    aria-label="Putar 90 Derajat"
                  >
                    <RotateCw className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setZoomLevel(1);
                      setRotation(0);
                    }}
                    className="p-1.5 rounded-full text-dark-300 hover:text-white hover:bg-dark-800 transition-colors"
                    title="Reset Tampilan"
                    aria-label="Reset Tampilan"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ) : isPdf ? (
              /* PDF VIEWER */
              <div className="w-full h-full flex flex-col p-2 sm:p-4 gap-2">
                <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2 text-rose-300 text-center sm:text-left">
                    <FileText className="h-4 w-4 flex-shrink-0 text-rose-400" />
                    <span>Dokumen PDF: Jika pratinjau tidak muncul di browser HP, buka langsung di tab baru:</span>
                  </div>
                  <a
                    href={previewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-medium inline-flex items-center gap-1.5 flex-shrink-0 shadow transition-colors touch-manipulation"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    Buka PDF Layar Penuh
                  </a>
                </div>

                <iframe
                  src={previewUrl}
                  title={item.name}
                  onError={() => setMediaError(true)}
                  className="w-full h-[58vh] sm:h-[68vh] rounded-xl border border-dark-800 bg-white/5 shadow-inner"
                />
              </div>
            ) : isVid ? (
              /* VIDEO VIEWER */
              <div className="w-full h-full flex flex-col items-center justify-center p-2 sm:p-4">
                <video
                  controls
                  autoPlay
                  playsInline
                  src={previewUrl}
                  onError={() => setMediaError(true)}
                  className="max-h-[72vh] max-w-full rounded-xl bg-black shadow-2xl border border-dark-800"
                >
                  Browser Anda tidak mendukung pemutar video HTML5 langsung.
                </video>
              </div>
            ) : isAud ? (
              /* AUDIO VIEWER */
              <div className="text-center p-8 space-y-6 max-w-md mx-auto">
                <div className="relative mx-auto w-24 h-24 rounded-3xl bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center shadow-xl">
                  <Music className="h-10 w-10 text-emerald-400 animate-pulse" />
                </div>

                <div>
                  <p className="font-semibold text-dark-100 text-lg line-clamp-2">{item.name}</p>
                  <p className="text-xs font-mono text-dark-400 mt-1">{formatBytes(item.size)}</p>
                </div>

                <audio
                  controls
                  autoPlay
                  src={previewUrl}
                  onError={() => setMediaError(true)}
                  className="w-full rounded-lg"
                />
              </div>
            ) : (
              /* UNSUPPORTED / GENERIC FILE */
              <div className="text-center p-6 sm:p-8 max-w-sm mx-auto">
                <div className="mx-auto w-16 h-16 rounded-2xl bg-dark-800/80 border border-dark-700/60 flex items-center justify-center text-dark-400 mb-4 shadow-lg">
                  <FileText className="h-8 w-8 text-primary-400" />
                </div>
                <p className="text-sm text-dark-200 font-medium">Pratinjau langsung tidak didukung untuk tipe file ini</p>
                <p className="text-xs text-dark-400 mt-1">
                  Silakan unduh file untuk membukanya menggunakan aplikasi di perangkat Anda.
                </p>
                <a
                  href={downloadUrl}
                  download={item.name}
                  className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 bg-primary-600 hover:bg-primary-500 text-white rounded-xl text-xs font-semibold shadow-lg transition-colors"
                >
                  <Download className="h-4 w-4" />
                  Unduh Berkas Sekarang
                </a>
              </div>
            )}
          </div>

          {/* Modal Footer: Keyboard Hints Badge */}
          <footer className="py-2 px-4 border-t border-dark-800/80 bg-dark-950/70 flex items-center justify-between text-[11px] text-dark-400 font-mono">
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline">Navigasi: <kbd className="px-1 py-0.5 rounded bg-dark-800 border border-dark-700 text-dark-300">←</kbd> <kbd className="px-1 py-0.5 rounded bg-dark-800 border border-dark-700 text-dark-300">→</kbd></span>
              {isImg && (
                <span className="hidden sm:inline">Zoom: <kbd className="px-1 py-0.5 rounded bg-dark-800 border border-dark-700 text-dark-300">+</kbd> <kbd className="px-1 py-0.5 rounded bg-dark-800 border border-dark-700 text-dark-300">-</kbd></span>
              )}
            </div>
            <span>Tutup: <kbd className="px-1.5 py-0.5 rounded bg-dark-800 border border-dark-700 text-dark-300">Esc</kbd></span>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default FilePreviewModal;
