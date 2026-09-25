import { Response } from 'express';
import fs from 'fs';
import path from 'path';
import { AuthRequest } from '../middleware/auth';
import { driveService, assertSafeStoragePath } from '../services/drive';
import { asyncHandler, AppError } from '../middleware';

export const driveController = {
  // List files/folders in current directory
  listItems: asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const parentId = (req.query.parentId as string) || null;
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
    const { name, parentId } = req.body;

    if (!name || !name.trim()) {
      throw new AppError('Folder name is required', 400);
    }

    const folder = await driveService.createFolder(userId, name.trim(), parentId || null);
    res.status(201).json({ ...folder, size: Number(folder.size) });
  }),

  // Upload single or multiple files
  uploadFile: asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const parentId = (req.body.parentId as string) || null;

    if (!req.file) {
      throw new AppError('No file uploaded', 400);
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

    if (!fs.existsSync(item.storagePath)) {
      throw new AppError('Physical file not found on disk', 404);
    }

    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(item.name)}"`);
    res.setHeader('Content-Type', item.mimeType || 'application/octet-stream');
    res.setHeader('Content-Length', item.size.toString());

    const stream = fs.createReadStream(item.storagePath);
    stream.pipe(res);
  }),

  // Preview file (Inline stream for images, pdfs, audio, text)
  previewFile: asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const { id } = req.params;

    const item = await driveService.getItemForUser(id, userId);

    if (item.type !== 'FILE' || !item.storagePath) {
      throw new AppError('Cannot preview a directory', 400);
    }

    assertSafeStoragePath(item.storagePath);

    if (!fs.existsSync(item.storagePath)) {
      throw new AppError('Physical file not found on disk', 404);
    }

    res.setHeader('Content-Disposition', `inline; filename="${encodeURIComponent(item.name)}"`);
    res.setHeader('Content-Type', item.mimeType || 'application/octet-stream');
    res.setHeader('Content-Length', item.size.toString());

    const stream = fs.createReadStream(item.storagePath);
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
