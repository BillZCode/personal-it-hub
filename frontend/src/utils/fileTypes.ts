/**
 * Utility functions for file type detection, categorisation, formatting, and validation.
 */

export interface FileItemInfo {
  name: string;
  mimeType?: string | null;
}

export function getFileExtension(filename: string): string {
  if (!filename) return '';
  const parts = filename.toLowerCase().split('.');
  return parts.length > 1 ? parts.pop() || '' : '';
}

export const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'ico', 'tiff', 'avif'];
export const PDF_EXTENSIONS = ['pdf'];
export const VIDEO_EXTENSIONS = ['mp4', 'webm', 'mkv', 'mov', 'avi', 'flv', 'wmv', 'm4v', '3gp', 'ogv'];
export const AUDIO_EXTENSIONS = ['mp3', 'wav', 'ogg', 'm4a', 'flac', 'aac', 'wma', 'opus'];
export const CODE_EXTENSIONS = [
  'js', 'jsx', 'ts', 'tsx', 'html', 'css', 'scss', 'json', 'py', 'php', 'sh',
  'bash', 'sql', 'c', 'cpp', 'h', 'java', 'go', 'rs', 'yml', 'yaml', 'md', 'xml',
  'env', 'toml', 'dockerfile', 'graphql'
];
export const ARCHIVE_EXTENSIONS = ['zip', 'rar', '7z', 'tar', 'gz', 'bz2', 'xz', 'iso', 'tgz'];
export const DOCUMENT_EXTENSIONS = ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'rtf', 'odt', 'csv'];

export function isImageFile(item: FileItemInfo): boolean {
  const mime = (item.mimeType || '').toLowerCase();
  const ext = getFileExtension(item.name);
  return mime.startsWith('image/') || IMAGE_EXTENSIONS.includes(ext);
}

export function isPdfFile(item: FileItemInfo): boolean {
  const mime = (item.mimeType || '').toLowerCase();
  const ext = getFileExtension(item.name);
  return mime === 'application/pdf' || mime === 'application/x-pdf' || PDF_EXTENSIONS.includes(ext);
}

export function isVideoFile(item: FileItemInfo): boolean {
  const mime = (item.mimeType || '').toLowerCase();
  const ext = getFileExtension(item.name);
  return mime.startsWith('video/') || VIDEO_EXTENSIONS.includes(ext);
}

export function isAudioFile(item: FileItemInfo): boolean {
  const mime = (item.mimeType || '').toLowerCase();
  const ext = getFileExtension(item.name);
  return mime.startsWith('audio/') || AUDIO_EXTENSIONS.includes(ext);
}

export function isCodeFile(item: FileItemInfo): boolean {
  const ext = getFileExtension(item.name);
  return CODE_EXTENSIONS.includes(ext);
}

export function isArchiveFile(item: FileItemInfo): boolean {
  const ext = getFileExtension(item.name);
  return ARCHIVE_EXTENSIONS.includes(ext);
}

export type FileCategory =
  | 'folder'
  | 'image'
  | 'pdf'
  | 'video'
  | 'audio'
  | 'code'
  | 'archive'
  | 'document'
  | 'spreadsheet'
  | 'other';

export function getFileCategory(item: FileItemInfo & { type?: string }): FileCategory {
  if (item.type === 'FOLDER') return 'folder';
  if (isImageFile(item)) return 'image';
  if (isPdfFile(item)) return 'pdf';
  if (isVideoFile(item)) return 'video';
  if (isAudioFile(item)) return 'audio';
  if (isCodeFile(item)) return 'code';
  if (isArchiveFile(item)) return 'archive';

  const ext = getFileExtension(item.name);
  if (['xls', 'xlsx', 'csv'].includes(ext)) return 'spreadsheet';
  if (DOCUMENT_EXTENSIONS.includes(ext)) return 'document';
  return 'other';
}

/**
 * Returns color tokens for badges and icons based on category
 */
export function getCategoryBadgeStyles(category: FileCategory): {
  bg: string;
  text: string;
  border: string;
  glow: string;
} {
  switch (category) {
    case 'folder':
      return {
        bg: 'bg-amber-500/10',
        text: 'text-amber-400',
        border: 'border-amber-500/30',
        glow: 'shadow-amber-500/10',
      };
    case 'image':
      return {
        bg: 'bg-violet-500/10',
        text: 'text-violet-400',
        border: 'border-violet-500/30',
        glow: 'shadow-violet-500/10',
      };
    case 'pdf':
      return {
        bg: 'bg-rose-500/10',
        text: 'text-rose-400',
        border: 'border-rose-500/30',
        glow: 'shadow-rose-500/10',
      };
    case 'video':
      return {
        bg: 'bg-red-500/10',
        text: 'text-red-400',
        border: 'border-red-500/30',
        glow: 'shadow-red-500/10',
      };
    case 'audio':
      return {
        bg: 'bg-emerald-500/10',
        text: 'text-emerald-400',
        border: 'border-emerald-500/30',
        glow: 'shadow-emerald-500/10',
      };
    case 'code':
      return {
        bg: 'bg-cyan-500/10',
        text: 'text-cyan-400',
        border: 'border-cyan-500/30',
        glow: 'shadow-cyan-500/10',
      };
    case 'archive':
      return {
        bg: 'bg-orange-500/10',
        text: 'text-orange-400',
        border: 'border-orange-500/30',
        glow: 'shadow-orange-500/10',
      };
    case 'spreadsheet':
      return {
        bg: 'bg-teal-500/10',
        text: 'text-teal-400',
        border: 'border-teal-500/30',
        glow: 'shadow-teal-500/10',
      };
    case 'document':
      return {
        bg: 'bg-blue-500/10',
        text: 'text-blue-400',
        border: 'border-blue-500/30',
        glow: 'shadow-blue-500/10',
      };
    default:
      return {
        bg: 'bg-zinc-500/10',
        text: 'text-zinc-400',
        border: 'border-zinc-500/30',
        glow: 'shadow-zinc-500/10',
      };
  }
}

/**
 * Validates a filename for disallowed characters or invalid structure.
 */
export function validateFileName(name: string): { valid: boolean; error?: string } {
  const trimmed = name.trim();
  if (!trimmed) {
    return { valid: false, error: 'Nama berkas atau folder tidak boleh kosong.' };
  }
  if (trimmed.length > 255) {
    return { valid: false, error: 'Nama terlalu panjang (maksimal 255 karakter).' };
  }
  // Check for forbidden characters in Unix & Windows paths
  const invalidCharsRegex = /[<>:"/\\|?*\x00-\x1F]/g;
  if (invalidCharsRegex.test(trimmed)) {
    return { valid: false, error: 'Nama berisi karakter terlarang (/ \\ : * ? " < > |).' };
  }
  if (trimmed === '.' || trimmed === '..') {
    return { valid: false, error: 'Nama berkas tidak valid.' };
  }
  return { valid: true };
}
