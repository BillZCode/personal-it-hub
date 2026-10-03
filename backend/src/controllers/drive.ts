import { Response } from 'express';
import fs from 'fs';
import path from 'path';
import { AuthRequest } from '../middleware/auth';
import { driveService, assertSafeStoragePath, resolveSafePath, inferMimeType } from '../services/drive';
import { asyncHandler, AppError } from '../middleware';

export const driveController = {
  // List files/folders in current directory
  listItems: asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    let parentId = (req.query.parentId as string) || null;
    if (parentId === 'null' || parentId === 'undefined' || (typeof parentId === 'string' && parentId.trim() === '')) {
      parentId = null;
    }
    const isTrash = req.query.trash === 'true';

    const items = await driveService.listItems(userId, parentId, isTrash);
    const breadcrumbs = isTrash ? [] : await driveService.getFolderHierarchy(userId, parentId);

    // Convert BigInt sizes to Numbers/Strings for JSON serialization
    const safeItems = items.map(item => ({
      ...item,
      size: Number(item.size),
    }));

    res.json({
      items: safeItems,
      breadcrumbs,
      currentFolderId: parentId,
      isTrash,
    });
  }),

  // Create new folder
  createFolder: asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const { name } = req.body;
    let parentId = (req.body.parentId as string) || null;
    if (parentId === 'null' || parentId === 'undefined' || (typeof parentId === 'string' && parentId.trim() === '')) {
      parentId = null;
    }

    if (!name || !name.trim()) {
      throw new AppError('Folder name is required', 400);
    }

    const folder = await driveService.createFolder(userId, name.trim(), parentId || null);
    res.status(201).json({ ...folder, size: Number(folder.size) });
  }),

  // Upload single or multiple files
  uploadFile: asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    let parentId = (req.body.parentId as string) || null;
    if (parentId === 'null' || parentId === 'undefined' || (typeof parentId === 'string' && parentId.trim() === '')) {
      parentId = null;
    }

    if (!req.file) {
      throw new AppError('File tidak ditemukan dalam request upload', 400);
    }

    const created = await driveService.saveUploadedFile(userId, req.file, parentId);
    res.status(201).json({ ...created, size: Number(created.size) });
  }),

  // Download file (Protected stream)
  downloadFile: asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const { id } = req.params;

    const item = await driveService.getItemForUser(id, userId);

    if (item.type !== 'FILE' || !item.storagePath) {
      throw new AppError('Cannot download a directory', 400);
    }

    assertSafeStoragePath(item.storagePath);
    const safePath = resolveSafePath(item.storagePath);

    if (!fs.existsSync(safePath)) {
      throw new AppError('Physical file not found on disk', 404);
    }

    const mimeType = inferMimeType(item.name, item.mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(item.name)}"`);
    res.setHeader('Content-Type', mimeType);
    res.setHeader('Content-Length', item.size.toString());

    const stream = fs.createReadStream(safePath);
    stream.on('error', () => {
      if (!res.headersSent) {
        res.status(500).json({ error: 'Failed to read file stream' });
      }
    });
    req.on('close', () => {
      stream.destroy();
    });
    stream.pipe(res);
  }),

  // Preview file (Inline stream for images, pdfs, audio, text, video with HTTP Range 206 support)
  previewFile: asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const { id } = req.params;

    const item = await driveService.getItemForUser(id, userId);

    if (item.type !== 'FILE' || !item.storagePath) {
      throw new AppError('Cannot preview a directory', 400);
    }

    assertSafeStoragePath(item.storagePath);
    const safePath = resolveSafePath(item.storagePath);

    if (!fs.existsSync(safePath)) {
      throw new AppError('Physical file not found on disk', 404);
    }

    const stat = fs.statSync(safePath);
    const fileSize = stat.size;
    const range = req.headers.range;
    const mimeType = inferMimeType(item.name, item.mimeType);

    // Remove restrictive CSP header on media/PDF streams to allow inline display & embedding on mobile
    res.removeHeader('Content-Security-Policy');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');

    // HTTP 206 Partial Content for video/audio streaming and seek/scrub support
    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

      if (start >= fileSize) {
        res.status(416).setHeader('Content-Range', `bytes */${fileSize}`).end();
        return;
      }

      const chunkSize = end - start + 1;
      const stream = fs.createReadStream(safePath, { start, end });
      stream.on('error', () => {
        if (!res.headersSent) {
          res.status(500).json({ error: 'Failed to read file stream' });
        }
      });
      req.on('close', () => {
        stream.destroy();
      });

      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': mimeType,
        'Content-Disposition': `inline; filename="${encodeURIComponent(item.name)}"`,
      });

      stream.pipe(res);
      return;
    }

    res.setHeader('Accept-Ranges', 'bytes');
    res.setHeader('Content-Disposition', `inline; filename="${encodeURIComponent(item.name)}"`);
    res.setHeader('Content-Type', mimeType);
    res.setHeader('Content-Length', fileSize.toString());

    const stream = fs.createReadStream(safePath);
    stream.on('error', () => {
      if (!res.headersSent) {
        res.status(500).json({ error: 'Failed to read file stream' });
      }
    });
    req.on('close', () => {
      stream.destroy();
    });
    stream.pipe(res);
  }),

  // Rename item
  renameItem: asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const { id } = req.params;
    const { name } = req.body;

    if (!name || !name.trim()) {
      throw new AppError('Name is required', 400);
    }

    const updated = await driveService.renameItem(id, userId, name.trim());
    res.json({ ...updated, size: Number(updated.size) });
  }),

  // Move to trash
  moveToTrash: asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const { id } = req.params;

    const item = await driveService.moveToTrash(id, userId);
    res.json({ success: true, item: { ...item, size: Number(item.size) } });
  }),

  // Restore from trash
  restoreFromTrash: asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const { id } = req.params;

    const item = await driveService.restoreFromTrash(id, userId);
    res.json({ success: true, item: { ...item, size: Number(item.size) } });
  }),

  // Delete permanent
  deletePermanent: asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const { id } = req.params;

    await driveService.deletePermanent(id, userId);
    res.json({ success: true, message: 'Item permanently deleted' });
  }),

  // Empty all trash
  emptyTrash: asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;

    await driveService.emptyTrash(userId);
    res.json({ success: true, message: 'Trash emptied successfully' });
  }),

  // Get storage usage stats
  getStorageStats: asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const stats = await driveService.getStorageStats(userId);
    res.json(stats);
  }),
};
