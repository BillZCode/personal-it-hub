import { Request, Response } from 'express';
import { prisma } from '../database/client';
import { asyncHandler } from '../middleware';
import { AppError } from '../middleware';
import crypto from 'crypto';

export const guestbookController = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const { approved, page = 1, limit = 20 } = req.query;
    const pageNum = Math.max(1, parseInt(String(page), 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(String(limit), 10) || 20));
    const where: any = {};

    if (approved !== undefined) where.approved = approved === 'true';

    const [entries, total] = await Promise.all([
      prisma.guestbookEntry.findMany({ 
        where, 
        orderBy: { createdAt: 'desc' }, 
        skip: (pageNum - 1) * limitNum, 
        take: limitNum 
      }),
      prisma.guestbookEntry.count({ where }),
    ]);

    res.json({ 
      data: entries, 
      total, 
      page: pageNum, 
      limit: limitNum, 
      totalPages: Math.ceil(total / limitNum) 
    });
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const { name, message } = req.body;
    const ipHash = crypto.createHash('sha256').update(req.ip || 'unknown').digest('hex').slice(0, 16);
    
    const entry = await prisma.guestbookEntry.create({
      data: { name, message, ipHash, userAgent: req.headers['user-agent'] },
    });
    res.status(201).json(entry);
  }),

  approve: asyncHandler(async (req: Request, res: Response) => {
    const entry = await prisma.guestbookEntry.update({ where: { id: req.params.id }, data: { approved: true } });
    res.json(entry);
  }),

  delete: asyncHandler(async (req: Request, res: Response) => {
    await prisma.guestbookEntry.delete({ where: { id: req.params.id } });
    res.status(204).send();
  }),
};