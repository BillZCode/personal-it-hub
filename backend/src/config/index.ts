import 'dotenv/config';

export const config = {
  port: parseInt(process.env.PORT || '3001', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  
  database: {
    url: process.env.DATABASE_URL || 'mysql://user:password@localhost:3306/it_hub',
  },

  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-change-in-production',
    accessExpiry: '15m',
    refreshExpiry: '7d',
  },

  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  },

  rateLimit: {
    windowMs: 60 * 1000,
    max: 100,
    auth: { windowMs: 15 * 60 * 1000, max: 5 },
    contact: { windowMs: 60 * 60 * 1000, max: 3 },
    guestbook: { windowMs: 60 * 60 * 1000, max: 5 },
    networkTools: { windowMs: 60 * 1000, max: 10 },
  },

  email: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
    from: process.env.EMAIL_FROM || 'noreply@example.com',
  },

  storage: {
    path: process.env.STORAGE_PATH || './storage/personal-drive',
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '5368709120', 10), // 5GB
  },

  logging: {
    level: process.env.LOG_LEVEL || 'info',
  },
};