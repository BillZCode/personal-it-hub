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

// Security: Prevent Directory Traversal
export function sanitizeFileName(name: string): string {
  // Strip null bytes, slashes, and traversal sequences
  return path.basename(name).replace(/[<>:"/\\|?*\x00-\x1F]/g, '_').trim() || 'unnamed_file';
}

export function assertSafeStoragePath(targetPath: string) {
  const resolved = path.resolve(targetPath);
  if (!resolved.startsWith(STORAGE_ROOT)) {
    throw new AppError('Access denied: directory traversal detected', 403, 'FORBIDDEN');
  }
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
      try { fs.unlinkSync(file.path); } catch (e) {}
    } else if (file.buffer) {
      fs.writeFileSync(destinationPath, file.buffer);
    }

    return prisma.driveItem.create({
      data: {
        name: cleanName,
        type: 'FILE',
        mimeType: file.mimetype || 'application/octet-stream',
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

    // If folder, recursively delete child physical files
    if (item.type === 'FOLDER') {
      const childFiles = await prisma.driveItem.findMany({
        where: { userId, parentId: item.id, type: 'FILE' },
      });
      for (const child of childFiles) {
        if (child.storagePath && fs.existsSync(child.storagePath)) {
          try {
            assertSafeStoragePath(child.storagePath);
            fs.unlinkSync(child.storagePath);
          } catch {}
        }
      }
    }

    return prisma.driveItem.delete({
      where: { id },
    });
  },

  async emptyTrash(userId: string) {
    const trashItems = await prisma.driveItem.findMany({
      where: { userId, isTrash: true },
    });

    for (const item of trashItems) {
      if (item.type === 'FILE' && item.storagePath && fs.existsSync(item.storagePath)) {
        try {
          assertSafeStoragePath(item.storagePath);
          fs.unlinkSync(item.storagePath);
        } catch {}
      }
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
    let folderCount = await prisma.driveItem.count({ where: { userId, type: 'FOLDER', isTrash: false } });

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
