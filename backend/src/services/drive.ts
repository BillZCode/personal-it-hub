import fs from 'fs';
import path from 'path';
import { prisma } from '../database/client';
import { config } from '../config';
import { AppError } from '../middleware';

// Ensure storage directory exists
const STORAGE_ROOT = path.resolve(config.storage.path);
if (!fs.existsSync(STORAGE_ROOT)) {
  fs.mkdirSync(STORAGE_ROOT, { recursive: true, mode: 0o700 });
}

// Security: Prevent Directory Traversal & decode UTF-8 filenames
export function sanitizeFileName(name: string): string {
  let decoded = name;
  try {
    decoded = Buffer.from(name, 'latin1').toString('utf8');
  } catch {
    decoded = name;
  }
  // Strip null bytes, slashes, and traversal sequences
  // eslint-disable-next-line no-control-regex
  return path.basename(decoded).replace(/[<>:"/\\|?*\x00-\x1F]/g, '_').trim() || 'unnamed_file';
}

// Infer MIME type if multer/browser provides generic octet-stream
export function inferMimeType(fileName: string, currentMime?: string | null): string {
  if (currentMime && currentMime !== 'application/octet-stream') {
    return currentMime;
  }
  const ext = path.extname(fileName).toLowerCase();
  const mimeMap: Record<string, string> = {
    // Images
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.bmp': 'image/bmp',
    '.ico': 'image/x-icon',
    // Videos
    '.mp4': 'video/mp4',
    '.webm': 'video/webm',
    '.mkv': 'video/x-matroska',
    '.mov': 'video/quicktime',
    '.avi': 'video/x-msvideo',
    '.flv': 'video/x-flv',
    '.wmv': 'video/x-ms-wmv',
    '.m4v': 'video/mp4',
    // Audio
    '.mp3': 'audio/mpeg',
    '.wav': 'audio/wav',
    '.ogg': 'audio/ogg',
    '.m4a': 'audio/mp4',
    '.flac': 'audio/flac',
    // Documents
    '.pdf': 'application/pdf',
    '.txt': 'text/plain',
    '.csv': 'text/csv',
    '.json': 'application/json',
    '.zip': 'application/zip',
    '.tar': 'application/x-tar',
    '.gz': 'application/gzip',
  };
  return mimeMap[ext] || currentMime || 'application/octet-stream';
}

export function assertSafeStoragePath(targetPath: string) {
  const resolved = path.resolve(targetPath);
  const legacyRoot = path.resolve('/home/sabbil/Dokumen/TKJ/personal-it-hub-run/storage/personal-drive');
  if (!resolved.startsWith(STORAGE_ROOT) && !resolved.startsWith(legacyRoot)) {
    throw new AppError('Access denied: directory traversal detected', 403, 'FORBIDDEN');
  }
}

export function resolveSafePath(targetPath: string): string {
  const fileName = path.basename(targetPath);
  const preferred = path.join(STORAGE_ROOT, fileName);
  if (fs.existsSync(preferred)) {
    return preferred;
  }
  const legacyPath = path.join('/home/sabbil/Dokumen/TKJ/personal-it-hub-run/storage/personal-drive', fileName);
  if (fs.existsSync(legacyPath)) {
    return legacyPath;
  }
  return preferred;
}

export const driveService = {
  getStorageRoot() {
    return STORAGE_ROOT;
  },

  async listItems(userId: string, parentId: string | null = null, isTrash: boolean = false) {
    return prisma.driveItem.findMany({
      where: {
        userId,
        parentId: isTrash ? undefined : parentId,
        isTrash,
      },
      orderBy: [
        { type: 'asc' }, // FOLDER first, then FILE
        { name: 'asc' },
      ],
    });
  },

  async getFolderHierarchy(userId: string, currentFolderId: string | null) {
    const breadcrumbs: { id: string; name: string }[] = [];
    let currId = currentFolderId;

    while (currId) {
      const folder = await prisma.driveItem.findFirst({
        where: { id: currId, userId, type: 'FOLDER' },
        select: { id: true, name: true, parentId: true },
      });
      if (!folder) break;
      breadcrumbs.unshift({ id: folder.id, name: folder.name });
      currId = folder.parentId;
    }

    return breadcrumbs;
  },

  async createFolder(userId: string, name: string, parentId: string | null = null) {
    const cleanName = sanitizeFileName(name);
    if (!cleanName) throw new AppError('Folder name is required', 400);

    // Verify parent folder if given
    if (parentId) {
      const parent = await prisma.driveItem.findFirst({
        where: { id: parentId, userId, type: 'FOLDER', isTrash: false },
      });
      if (!parent) throw new AppError('Parent folder not found', 404);
    }

    return prisma.driveItem.create({
      data: {
        name: cleanName,
        type: 'FOLDER',
        userId,
        parentId: parentId || null,
        size: BigInt(0),
      },
    });
  },

  async saveUploadedFile(
    userId: string,
    file: Express.Multer.File,
    parentId: string | null = null
  ) {
    const cleanName = sanitizeFileName(file.originalname);
    const storageFileName = `${Date.now()}_${Math.random().toString(36).substring(2, 10)}_${cleanName}`;
    const destinationPath = path.join(STORAGE_ROOT, storageFileName);

    assertSafeStoragePath(destinationPath);

    // Move or write file to secure destination
    if (file.path) {
      fs.copyFileSync(file.path, destinationPath);
      try { fs.unlinkSync(file.path); } catch { /* ignore cleanup error */ }
    } else if (file.buffer) {
      fs.writeFileSync(destinationPath, file.buffer);
    }

    return prisma.driveItem.create({
      data: {
        name: cleanName,
        type: 'FILE',
        mimeType: inferMimeType(cleanName, file.mimetype),
        size: BigInt(file.size),
        storagePath: destinationPath,
        userId,
        parentId: parentId || null,
      },
    });
  },

  async getItemForUser(id: string, userId: string) {
    const item = await prisma.driveItem.findFirst({
      where: { id, userId },
    });
    if (!item) throw new AppError('Item not found or access denied', 404);
    return item;
  },

  async renameItem(id: string, userId: string, newName: string) {
    const cleanName = sanitizeFileName(newName);
    if (!cleanName) throw new AppError('Invalid name', 400);

    await this.getItemForUser(id, userId);

    return prisma.driveItem.update({
      where: { id },
      data: { name: cleanName },
    });
  },

  async moveToTrash(id: string, userId: string) {
    await this.getItemForUser(id, userId);

    return prisma.driveItem.update({
      where: { id },
      data: {
        isTrash: true,
        trashedAt: new Date(),
      },
    });
  },

  async restoreFromTrash(id: string, userId: string) {
    await this.getItemForUser(id, userId);

    return prisma.driveItem.update({
      where: { id },
      data: {
        isTrash: false,
        trashedAt: null,
      },
    });
  },

  async deletePermanent(id: string, userId: string) {
    const item = await this.getItemForUser(id, userId);

    // If file, remove from disk
    if (item.type === 'FILE' && item.storagePath) {
      try {
        assertSafeStoragePath(item.storagePath);
        if (fs.existsSync(item.storagePath)) {
          fs.unlinkSync(item.storagePath);
        }
      } catch (err) {
        console.error('Error deleting physical file:', err);
      }
    }

    // If folder, recursively delete all descendant files and subfolders from disk and DB
    if (item.type === 'FOLDER') {
      const getAllFolderIds = async (folderIds: string[]): Promise<string[]> => {
        const subfolders = await prisma.driveItem.findMany({
          where: { userId, parentId: { in: folderIds }, type: 'FOLDER' },
          select: { id: true },
        });
        if (subfolders.length === 0) return folderIds;
        const subIds = subfolders.map((s) => s.id);
        const deeper = await getAllFolderIds(subIds);
        return [...folderIds, ...deeper];
      };

      const allFolderIds = await getAllFolderIds([item.id]);

      const childFiles = await prisma.driveItem.findMany({
        where: { userId, parentId: { in: allFolderIds }, type: 'FILE' },
      });

      for (const child of childFiles) {
        if (child.storagePath && fs.existsSync(child.storagePath)) {
          try {
            assertSafeStoragePath(child.storagePath);
            fs.unlinkSync(child.storagePath);
          } catch {
            // ignore unlink error
          }
        }
      }

      // Clean up all descendant items in database
      await prisma.driveItem.deleteMany({
        where: { userId, parentId: { in: allFolderIds } },
      });
    }

    return prisma.driveItem.delete({
      where: { id },
    });
  },

  async emptyTrash(userId: string) {
    const trashItems = await prisma.driveItem.findMany({
      where: { userId, isTrash: true },
    });

    const trashedFolderIds = trashItems.filter((i) => i.type === 'FOLDER').map((f) => f.id);

    // Recursively collect all descendant folder IDs of trashed folders
    const getAllFolderIds = async (folderIds: string[]): Promise<string[]> => {
      if (folderIds.length === 0) return [];
      const subfolders = await prisma.driveItem.findMany({
        where: { userId, parentId: { in: folderIds }, type: 'FOLDER' },
        select: { id: true },
      });
      if (subfolders.length === 0) return folderIds;
      const subIds = subfolders.map((s) => s.id);
      const deeper = await getAllFolderIds(subIds);
      return [...folderIds, ...deeper];
    };

    const allTrashedFolderIds = await getAllFolderIds(trashedFolderIds);

    // Physical files directly in trash or inside trashed folders
    const filesToDelete = await prisma.driveItem.findMany({
      where: {
        userId,
        OR: [
          { isTrash: true, type: 'FILE' },
          { parentId: { in: allTrashedFolderIds }, type: 'FILE' },
        ],
      },
    });

    for (const file of filesToDelete) {
      if (file.storagePath && fs.existsSync(file.storagePath)) {
        try {
          assertSafeStoragePath(file.storagePath);
          fs.unlinkSync(file.storagePath);
        } catch {
          // ignore unlink error
        }
      }
    }

    // Delete descendants inside trashed folders
    if (allTrashedFolderIds.length > 0) {
      await prisma.driveItem.deleteMany({
        where: { userId, parentId: { in: allTrashedFolderIds } },
      });
    }

    return prisma.driveItem.deleteMany({
      where: { userId, isTrash: true },
    });
  },

  async getStorageStats(userId: string) {
    const files = await prisma.driveItem.findMany({
      where: { userId, type: 'FILE' },
      select: { size: true, isTrash: true },
    });

    let totalActiveBytes = BigInt(0);
    let totalTrashBytes = BigInt(0);
    let fileCount = 0;
    const folderCount = await prisma.driveItem.count({ where: { userId, type: 'FOLDER', isTrash: false } });

    files.forEach((f: { isTrash: boolean; size: bigint }) => {
      if (f.isTrash) {
        totalTrashBytes += f.size;
      } else {
        totalActiveBytes += f.size;
        fileCount++;
      }
    });

    const maxQuota = BigInt(config.storage.maxFileSize || 5368709120); // default 5 GB limit
    const usedBytes = totalActiveBytes + totalTrashBytes;

    return {
      usedBytes: Number(usedBytes),
      activeBytes: Number(totalActiveBytes),
      trashBytes: Number(totalTrashBytes),
      maxQuotaBytes: Number(maxQuota),
      percentageUsed: Number((usedBytes * BigInt(100)) / (maxQuota || BigInt(1))),
      fileCount,
      folderCount,
    };
  },
};
