import React from 'react';
import {
  Folder,
  Image as ImageIcon,
  FileText,
  Video,
  Music,
  FileCode,
  FileArchive,
  FileSpreadsheet,
  FileCheck,
  File,
  Terminal,
  Database
} from 'lucide-react';
import { getFileCategory, getFileExtension, FileItemInfo } from '../../utils/fileTypes';

interface FileIconProps {
  item: FileItemInfo & { type?: 'FOLDER' | 'FILE' };
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
  xl: 'h-8 w-8',
};

export const FileIcon: React.FC<FileIconProps> = React.memo(({ item, size = 'lg', className = '' }) => {
  const iconSize = sizeClasses[size] || sizeClasses.lg;
  const category = getFileCategory(item);
  const ext = getFileExtension(item.name);

  if (category === 'folder') {
    return (
      <Folder
        className={`${iconSize} text-amber-400 fill-amber-400/20 drop-shadow-[0_2px_8px_rgba(251,191,36,0.25)] ${className}`}
        aria-hidden="true"
      />
    );
  }

  if (category === 'image') {
    return (
      <ImageIcon
        className={`${iconSize} text-violet-400 drop-shadow-[0_2px_8px_rgba(167,139,250,0.25)] ${className}`}
        aria-hidden="true"
      />
    );
  }

  if (category === 'pdf') {
    return (
      <FileText
        className={`${iconSize} text-rose-500 drop-shadow-[0_2px_8px_rgba(244,63,94,0.25)] ${className}`}
        aria-hidden="true"
      />
    );
  }

  if (category === 'video') {
    return (
      <Video
        className={`${iconSize} text-red-400 drop-shadow-[0_2px_8px_rgba(248,113,113,0.25)] ${className}`}
        aria-hidden="true"
      />
    );
  }

  if (category === 'audio') {
    return (
      <Music
        className={`${iconSize} text-emerald-400 drop-shadow-[0_2px_8px_rgba(52,211,153,0.25)] ${className}`}
        aria-hidden="true"
      />
    );
  }

  if (['sh', 'bash', 'zsh', 'fish'].includes(ext)) {
    return (
      <Terminal
        className={`${iconSize} text-emerald-400 drop-shadow-[0_2px_8px_rgba(52,211,153,0.25)] ${className}`}
        aria-hidden="true"
      />
    );
  }

  if (['sql', 'db', 'sqlite', 'sqlite3'].includes(ext)) {
    return (
      <Database
        className={`${iconSize} text-indigo-400 drop-shadow-[0_2px_8px_rgba(129,140,248,0.25)] ${className}`}
        aria-hidden="true"
      />
    );
  }

  if (category === 'code') {
    return (
      <FileCode
        className={`${iconSize} text-cyan-400 drop-shadow-[0_2px_8px_rgba(34,211,238,0.25)] ${className}`}
        aria-hidden="true"
      />
    );
  }

  if (category === 'archive') {
    return (
      <FileArchive
        className={`${iconSize} text-orange-400 drop-shadow-[0_2px_8px_rgba(251,146,60,0.25)] ${className}`}
        aria-hidden="true"
      />
    );
  }

  if (category === 'spreadsheet') {
    return (
      <FileSpreadsheet
        className={`${iconSize} text-teal-400 drop-shadow-[0_2px_8px_rgba(45,212,191,0.25)] ${className}`}
        aria-hidden="true"
      />
    );
  }

  if (['doc', 'docx', 'odt'].includes(ext)) {
    return (
      <FileCheck
        className={`${iconSize} text-blue-400 drop-shadow-[0_2px_8px_rgba(96,165,250,0.25)] ${className}`}
        aria-hidden="true"
      />
    );
  }

  return (
    <File
      className={`${iconSize} text-zinc-400 drop-shadow-[0_2px_8px_rgba(161,161,170,0.15)] ${className}`}
      aria-hidden="true"
    />
  );
});

FileIcon.displayName = 'FileIcon';

export default FileIcon;
