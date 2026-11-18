import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from './config';
import { errorHandler, notFoundHandler } from './middleware';
import { prisma } from './database/client';
import authRoutes from './routes/auth';
import publicRoutes from './routes/public';
import adminRoutes from './routes/admin';
import driveRoutes from './routes/drive';
import { systemService } from './services/system';
import { logger } from './utils/logger';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const HOSTING_STATE_PATH = path.resolve(__dirname, '../../storage/hosting-panel.json');

function getDomainSuspensionInfo(targetHost: string) {
  try {
    const filePath = HOSTING_STATE_PATH;
    if (!fs.existsSync(filePath)) return { isSuspended: false, status: 'active', domain: targetHost };
    const state = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const cleanHost = targetHost.toLowerCase().split(':')[0];

    const matched = (state.domains || []).find((d: any) => {
      const dName = (d.domain || '').toLowerCase();
      const aliases = (d.aliases || []).map((a: string) => a.toLowerCase());
      if (dName === cleanHost || aliases.includes(cleanHost)) return true;
      if ((cleanHost === 'localhost' || cleanHost === '127.0.0.1') && d.id === 'vhost-portal') {
        return true;
      }
      return false;
    });

    if (!matched) return { isSuspended: false, status: 'active', domain: cleanHost };

    return {
      isSuspended: matched.status === 'suspended',
      status: matched.status,
      domain: matched.domain,
      vhostId: matched.id,
    };
  } catch {
    return { isSuspended: false, status: 'active', domain: targetHost };
  }
}

// Enable BigInt JSON serialization
(BigInt.prototype as any).toJSON = function () {
  return Number(this);
};

const app = express();

// Trust reverse proxy (Nginx, Cloudflare) for accurate client IP in rate limiting & logs
app.set('trust proxy', 1);

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      imgSrc: ["'self'", 'data:', 'https:', 'blob:'],
      connectSrc: ["'self'"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

const allowedOrigins = (config.cors.origin || '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (
      allowedOrigins.includes(origin) ||
      allowedOrigins.includes('*') ||
      origin.includes('sabbilaf.network') ||
      origin.includes('sabbilferdyansyah.my.id') ||
      origin.includes('hub.lokal') ||
      origin.includes('localhost') ||
      origin.includes('127.0.0.1')
    ) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true,
}));

app.use(compression());
app.use(morgan('combined', { stream: { write: (msg) => logger.info(msg.trim()) } }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// 1. Status endpoint for Frontend / Edge suspension checking
app.get(['/api/vhost-status', '/api/public/vhost-status'], (req, res) => {
  const queryHost = (req.query.hostname as string) || (req.query.test_domain as string);
  const headerHost = (req.headers['x-forwarded-host'] as string) || req.headers.host || req.hostname || '';
  const targetHost = (queryHost || headerHost).split(':')[0].toLowerCase();

  const info = getDomainSuspensionInfo(targetHost);
  res.json({
    hostname: targetHost,
    ...info,
    message: info.isSuspended
      ? `Website ${info.domain} sedang ditangguhkan oleh Administrator cPanel.`
      : 'Active',
  });
});

// 2. Interceptor for Public API calls if domain is suspended
app.use((req, res, next) => {
  if (
    req.path.startsWith('/api/admin') ||
    req.path.startsWith('/api/auth') ||
    req.path.startsWith('/api/vhost-status') ||
    req.path.startsWith('/api/public/vhost-status') ||
    req.path === '/api/health'
  ) {
    return next();
  }

  const queryHost = req.query.test_domain as string;
  const headerHost = (req.headers['x-forwarded-host'] as string) || req.headers.host || req.hostname || '';
  const targetHost = (queryHost || headerHost).split(':')[0].toLowerCase();

  const info = getDomainSuspensionInfo(targetHost);
  if (info.isSuspended) {
    return res.status(503).json({
      statusCode: 503,
      error: 'DOMAIN_SUSPENDED',
      domain: info.domain,
      message: `Website dan API untuk ${info.domain} sedang ditangguhkan (Suspended) oleh Administrator cPanel & WHM.`,
    });
  }

  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/admin/auth', authRoutes);
app.use('/api', publicRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/drive', driveRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use(notFoundHandler);
app.use(errorHandler);

async function startServer() {
  try {
    await prisma.$connect();
    logger.info('Database connected');

    // Start metrics collection (every 5 minutes)
    setInterval(async () => {
      try {
        await systemService.saveServerMetrics();
      } catch (err) {
        logger.error('Failed to save server metrics', { err });
      }
    }, 5 * 60 * 1000);

    // Initial metrics save (non-blocking)
    try {
      await systemService.saveServerMetrics();
    } catch (err) {
      logger.warn('Initial server metrics save deferred', { err });
    }

    app.listen(config.port, () => {
      logger.info(`Server running on port ${config.port} in ${config.nodeEnv} mode`);
    });
  } catch (err) {
    logger.error('Failed to start server', { err });
    process.exit(1);
  }
}

process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down gracefully');
  await prisma.$disconnect();
  process.exit(0);
});

startServer();

export default app;