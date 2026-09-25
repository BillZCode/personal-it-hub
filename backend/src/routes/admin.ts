import { Router } from 'express';
import { adminController } from '../controllers/admin';
import { authMiddleware, requireAdmin } from '../middleware/auth';
import { generalRateLimit } from '../middleware/rateLimit';

const router = Router();

router.use(generalRateLimit);
router.use(authMiddleware);
router.use(requireAdmin);

router.get('/statistics', adminController.statistics.getDashboard);

router.get('/projects', adminController.projects.getAll);
router.post('/projects', adminController.projects.create);
router.put('/projects/:id', adminController.projects.update);
router.delete('/projects/:id', adminController.projects.delete);

router.get('/notes', adminController.notes.getAll);
router.post('/notes', adminController.notes.create);
router.put('/notes/:id', adminController.notes.update);
router.delete('/notes/:id', adminController.notes.delete);

router.get('/certificates', adminController.certificates.getAll);
router.post('/certificates', adminController.certificates.create);
router.put('/certificates/:id', adminController.certificates.update);
router.delete('/certificates/:id', adminController.certificates.delete);

router.get('/gallery', adminController.gallery.getAll);
router.post('/gallery', adminController.gallery.create);
router.put('/gallery/:id', adminController.gallery.update);
router.delete('/gallery/:id', adminController.gallery.delete);

router.get('/changelog', adminController.changelog.getAll);
router.post('/changelog', adminController.changelog.create);
router.put('/changelog/:id', adminController.changelog.update);
router.delete('/changelog/:id', adminController.changelog.delete);

router.get('/guestbook', adminController.guestbook.getAll);
router.put('/guestbook/:id/approve', adminController.guestbook.approve);
router.delete('/guestbook/:id', adminController.guestbook.delete);

export default router;