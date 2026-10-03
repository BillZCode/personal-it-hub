import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import { config } from '../config';
import { logger } from '../utils/logger';

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code?: string;
  public readonly details?: Record<string, unknown>;

  constructor(message: string, statusCode = 500, code?: string, details?: Record<string, unknown>) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  logger.error('Request error', { err, path: req.path, method: req.method });

  if (err instanceof ZodError) {
    return res.status(400).json({
      message: 'Validation failed',
      code: 'VALIDATION_ERROR',
      statusCode: 400,
      details: err.flatten().fieldErrors,
    });
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      message: err.message,
      code: err.code,
      statusCode: err.statusCode,
      details: err.details,
    });
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      const target = (err.meta?.target as string[])?.join(', ') || 'field';
      return res.status(409).json({
        message: `Konflik data: Nilai unik untuk '${target}' sudah ada dalam sistem`,
        code: 'CONFLICT',
        statusCode: 409,
      });
    }
    if (err.code === 'P2025') {
      return res.status(404).json({
        message: 'Data yang diminta tidak ditemukan atau telah dihapus',
        code: 'NOT_FOUND',
        statusCode: 404,
      });
    }
    if (err.code === 'P2003') {
      return res.status(400).json({
        message: 'Operasi database gagal: Relasi data terkait tidak valid',
        code: 'FOREIGN_KEY_VIOLATION',
        statusCode: 400,
      });
    }
  }

  if (err.name === 'MulterError') {
    const isLimit = err.message.toLowerCase().includes('limit') || err.message.toLowerCase().includes('large');
    return res.status(400).json({
      message: isLimit ? 'Ukuran file melebihi batas yang diizinkan (maksimal 5GB)' : `Upload gagal: ${err.message}`,
      code: 'UPLOAD_ERROR',
      statusCode: 400,
    });
  }

  if (err.name === 'UnauthorizedError' || err.message?.toLowerCase().includes('jwt')) {
    return res.status(401).json({
      message: 'Sesi kedaluwarsa atau tidak valid, silakan login kembali',
      code: 'UNAUTHORIZED',
      statusCode: 401,
    });
  }

  return res.status(500).json({
    message: config.nodeEnv === 'development' ? err.message : 'Internal server error',
    code: 'INTERNAL_ERROR',
    statusCode: 500,
  });
}

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({
    message: `Route ${req.method} ${req.path} not found`,
    code: 'NOT_FOUND',
    statusCode: 404,
  });
}

export function asyncHandler(fn: (req: Request, res: Response, next: NextFunction) => unknown) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}