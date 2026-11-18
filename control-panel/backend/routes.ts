import { Router } from 'express';
import { adminController } from '../controllers/admin';
import { agentController } from '../controllers/agent';
import { hostingController } from '../controllers/hosting';
import { authMiddleware, requireAdmin } from '../middleware/auth';
import { generalRateLimit } from '../middleware/rateLimit';

const router = Router();

router.use(generalRateLimit);
router.use(authMiddleware);
router.use(requireAdmin);

// Hosting & Server Control Panel Routes (Vercel-Style Deployments, Env, Domains, Infra)
router.get('/hosting/overview', hostingController.getOverview);
router.post('/hosting/deployments', hostingController.triggerDeployment);
router.post('/hosting/deployments/:id/promote', hostingController.promoteDeployment);
router.delete('/hosting/deployments/:id', hostingController.deleteDeployment);
router.post('/hosting/env', hostingController.upsertEnvVar);
router.delete('/hosting/env/:key', hostingController.deleteEnvVar);
router.post('/hosting/domains', hostingController.createDomain);
router.put('/hosting/domains/:id', hostingController.updateDomain);
router.delete('/hosting/domains/:id', hostingController.deleteDomain);
router.post('/hosting/dns', hostingController.createDnsRecord);
router.delete('/hosting/dns/:id', hostingController.deleteDnsRecord);
router.post('/hosting/services/heal', hostingController.healAllServices);
router.post('/hosting/services/:id/control', hostingController.controlService);
router.post('/hosting/databases', hostingController.createDatabase);
router.delete('/hosting/databases/:id', hostingController.deleteDatabase);
router.post('/hosting/databases/backup', hostingController.createDatabaseBackup);
router.put('/hosting/firewall/toggle', hostingController.toggleFirewall);
router.post('/hosting/firewall/rules', hostingController.createFirewallRule);
router.delete('/hosting/firewall/rules/:id', hostingController.deleteFirewallRule);
router.post('/hosting/cron', hostingController.createCronJob);
router.post('/hosting/cron/:id/run', hostingController.runCronJobNow);
router.delete('/hosting/cron/:id', hostingController.deleteCronJob);
router.post('/hosting/nginx/save', hostingController.saveNginxConfig);

// Antigravity Agent Remote Management Routes
router.get('/agent/status', agentController.getStatus);
router.post('/agent/prompt', agentController.executePrompt);
router.post('/agent/command', agentController.executeCommand);
router.get('/agent/history', agentController.getHistory);
router.get('/agent/diagnostics', agentController.getHealthDiagnostics);
router.get('/agent/models', agentController.getModelsQuota);

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