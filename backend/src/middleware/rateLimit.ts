import rateLimit from 'express-rate-limit';
import { config } from '../config';
import { AppError } from './index';

export const createRateLimiter = (options: { windowMs: number; max: number; message?: string }) => {
  return rateLimit({
    windowMs: options.windowMs,
    max: options.max,
    message: { message: options.message || 'Too many requests, please try again later', code: 'RATE_LIMITED', statusCode: 429 },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => req.ip || 'unknown',
    handler: (req, res) => {
      throw new AppError('Too many requests, please try again later', 429, 'RATE_LIMITED');
    },
  });
};

export const generalRateLimit = createRateLimiter({ windowMs: config.rateLimit.windowMs, max: config.rateLimit.max });
export const authRateLimit = createRateLimiter({ windowMs: config.rateLimit.auth.windowMs, max: config.rateLimit.auth.max, message: 'Too many login attempts' });
export const contactRateLimit = createRateLimiter({ windowMs: config.rateLimit.contact.windowMs, max: config.rateLimit.contact.max, message: 'Too many contact submissions' });
export const guestbookRateLimit = createRateLimiter({ windowMs: config.rateLimit.guestbook.windowMs, max: config.rateLimit.guestbook.max, message: 'Too many guestbook entries' });
export const networkToolsRateLimit = createRateLimiter({ windowMs: config.rateLimit.networkTools.windowMs, max: config.rateLimit.networkTools.max, message: 'Too many network tool requests' });