import { Router, Request, Response, NextFunction } from 'express';
import { projectsController } from '../controllers/projects';
import { notesController } from '../controllers/notes';
import { certificatesController } from '../controllers/certificates';
import { changelogController } from '../controllers/changelog';
import { galleryController } from '../controllers/gallery';
import { guestbookController } from '../controllers/guestbook';
import { statisticsController } from '../controllers/statistics';
import { networkController } from '../controllers/network';
import { serverController } from '../controllers/server';
import { statusController } from '../controllers/status';
import { personalController } from '../controllers/personal';
import { contactController } from '../controllers/contact';
import { downloaderController } from '../controllers/downloader';
import { contactRateLimit, guestbookRateLimit, networkToolsRateLimit, generalRateLimit } from '../middleware/rateLimit';
import { validate } from '../middleware/validation';
import { guestbookSchema, contactSchema, networkToolSchemas } from '../utils/validation';
import { statisticsService } from '../services/statistics';
import { asyncHandler } from '../middleware';
import { logger } from '../utils/logger';

const router = Router();

router.use(generalRateLimit);

const EXCLUDED_TRACKING_PREFIXES = ['/server/stats', '/status', '/health'];

router.use((req: Request, _res: Response, next: NextFunction) => {
  const isExcluded = EXCLUDED_TRACKING_PREFIXES.some((prefix) => req.path.startsWith(prefix));
  if (!isExcluded && req.method === 'GET') {
    // Asynchronous non-blocking visitor recording
    statisticsService.recordVisitor().catch((err: any) => {
      logger.warn('Failed to record visitor stat', { error: err?.message });
    });
  }
  next();
});

router.get('/status', statusController.getSystemStatus);
router.get('/server/stats', serverController.getStats);
router.get('/server/stats/history', serverController.getHistory);
router.get('/statistics', statisticsController.getOverview);
router.get('/statistics/visitors', statisticsController.getVisitors);
router.get('/statistics/tools', statisticsController.getToolUsage);
router.get('/statistics/articles', statisticsController.getArticleViews);

router.get('/projects', projectsController.getAll);
router.get('/projects/featured', projectsController.getFeatured);
router.get('/projects/:slug', projectsController.getBySlug);

router.get('/certificates', certificatesController.getAll);
router.get('/certificates/:id', certificatesController.getById);

router.get('/notes', notesController.getAll);
router.get('/notes/categories', notesController.getCategories);
router.get('/notes/tags', notesController.getTags);
router.get('/notes/:slug', notesController.getBySlug);
router.get('/notes/related/:slug', notesController.getRelated);

router.get('/changelog', changelogController.getAll);
router.get('/changelog/latest', changelogController.getLatest);

router.get('/guestbook', guestbookController.getAll);
router.post('/guestbook', guestbookRateLimit, validate(guestbookSchema), guestbookController.create);

router.get('/gallery', galleryController.getAll);
router.get('/gallery/:id', galleryController.getById);

router.get('/personal/media', personalController.getMedia);
router.get('/personal/linux-setup', personalController.getLinuxSetup);

router.post('/contact', contactRateLimit, validate(contactSchema), contactController.submit);

router.post('/network/dns', networkToolsRateLimit, validate(networkToolSchemas.dns), networkController.dnsLookup);
router.post('/network/whois', networkToolsRateLimit, validate(networkToolSchemas.whois), networkController.whois);
router.post('/network/ping', networkToolsRateLimit, validate(networkToolSchemas.ping), networkController.ping);
router.post('/network/port-check', networkToolsRateLimit, validate(networkToolSchemas.checkPort), networkController.checkPort);
router.post('/network/traceroute', networkToolsRateLimit, validate(networkToolSchemas.traceroute), networkController.traceroute);
router.post('/network/http-headers', networkToolsRateLimit, validate(networkToolSchemas.httpHeaders), networkController.httpHeaders);
router.get('/network/public-ip', networkToolsRateLimit, networkController.publicIp);
router.post('/network/ip-calculator', networkToolsRateLimit, validate(networkToolSchemas.ipCalculator), networkController.ipCalculator);
router.post('/network/subnet-calculator', networkToolsRateLimit, validate(networkToolSchemas.subnetCalculator), networkController.subnetCalculator);
router.post('/network/cidr-converter', networkToolsRateLimit, validate(networkToolSchemas.cidrConverter), networkController.cidrConverter);

// Universal Media & File Downloader routes
router.post('/download/resolve', downloaderController.resolve);
router.get('/download/stream', downloaderController.stream);
router.get('/download/proxy', downloaderController.proxy);

export default router;