import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { prisma } from '../database/client';
import { AppError } from './index';

export interface AuthRequest extends Request {
  user?: { id: string; email: string; name: string; role: string };
  file?: Express.Multer.File;
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const token = req.cookies?.accessToken || req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return next(new AppError('Authentication required', 401, 'UNAUTHORIZED'));
  }

  try {
    const decoded = jwt.verify(token, config.jwt.secret) as { userId: string };
    prisma.user
      .findUnique({
        where: { id: decoded.userId },
        select: { id: true, email: true, name: true, role: true },
      })
      .then((user) => {
        if (!user) {
          return next(new AppError('User no longer exists', 401, 'USER_NOT_FOUND'));
        }
        req.user = user;
        next();
      })
      .catch((err) => next(err));
  } catch {
    return next(new AppError('Invalid or expired token', 401, 'INVALID_TOKEN'));
  }
}

export function requireAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  if (req.user?.role !== 'ADMIN') {
    throw new AppError('Admin access required', 403, 'FORBIDDEN');
  }
  next();
}

export async function loadUser(req: AuthRequest, res: Response, next: NextFunction) {
  const token = req.cookies?.accessToken || req.headers.authorization?.replace('Bearer ', '');

  if (!token) return next();

  try {
    const decoded = jwt.verify(token, config.jwt.secret) as { userId: string };
    const user = await prisma.user.findUnique({ where: { id: decoded.userId }, select: { id: true, email: true, name: true, role: true } });
    if (user) req.user = user;
  } catch {
    // Token invalid, continue without user
  }
  next();
}