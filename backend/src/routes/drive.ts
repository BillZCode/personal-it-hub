import { Router } from 'express';
import multer from 'multer';
import os from 'os';
import { driveController } from '../controllers/drive';
import { authMiddleware } from '../middleware/auth';
import { generalRateLimit } from '../middleware/rateLimit';

const router = Router();

// Configure Multer for secure temporary file streaming
const upload = multer({
  dest: os.tmpdir(),
  limits: {
    fileSize: 5 * 1024 * 1024 * 1024, // 5GB max
  },
});

// All routes require authentication
router.use(generalRateLimit);
router.use(authMiddleware);

// Drive management endpoints
router.get('/files', driveController.listItems);
router.post('/folders', driveController.createFolder);
router.post('/upload', upload.single('file'), driveController.uploadFile);
router.get('/download/:id', driveController.downloadFile);
router.get('/preview/:id', driveController.previewFile);
router.patch('/items/:id', driveController.renameItem);
router.delete('/items/:id', driveController.moveToTrash);
router.post('/items/:id/restore', driveController.restoreFromTrash);
router.delete('/items/:id/permanent', driveController.deletePermanent);
router.delete('/trash/empty', driveController.emptyTrash);
router.get('/storage', driveController.getStorageStats);

export default router;
