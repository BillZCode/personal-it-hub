import { Request, Response } from 'express';
import { prisma } from '../database/client';
import { asyncHandler } from '../middleware';
import { AppError } from '../middleware';
import crypto from 'crypto';

export const guestbookController = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const { page = 1, limit = 20 } = req.query;
    const pageNum = Math.max(1, parseInt(String(page), 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(String(limit), 10) || 20));

    // Public guestbook: strictly show ONLY approved entries to public users
    const where = { approved: true };

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
    
    // Explicitly enforce approved: false so messages remain pending until approved by operator
    const entry = await prisma.guestbookEntry.create({
      data: {
        name: typeof name === 'string' ? name.trim() : name,
        message: typeof message === 'string' ? message.trim() : message,
        ipHash,
        userAgent: req.headers['user-agent'],
        approved: false,
      },
    });
    res.status(201).json(entry);
  }),

  approve: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) {
      throw new AppError('Entry ID is required', 400);
    }
    const approved = req.body && typeof req.body.approved === 'boolean' ? req.body.approved : true;
    const entry = await prisma.guestbookEntry.update({ where: { id }, data: { approved } });
    res.json(entry);
  }),

  delete: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) {
      throw new AppError('Entry ID is required', 400);
    }
    await prisma.guestbookEntry.deleteMany({ where: { id } });
    res.status(204).send();
  }),
};