import { Request, Response } from 'express';
import { prisma } from '../database/client';
import { asyncHandler } from '../middleware';
import { AppError } from '../middleware';

export const galleryController = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const { category, search, page = 1, limit = 20 } = req.query;
    const where: any = {};

    if (category) where.category = category;
    if (search) where.OR = [{ title: { contains: search as string, mode: 'insensitive' } }, { tags: { has: search as string } }];

    const [items, total] = await Promise.all([
      prisma.galleryItem.findMany({ where, orderBy: { createdAt: 'desc' }, skip: (Number(page) - 1) * Number(limit), take: Number(limit) }),
      prisma.galleryItem.count({ where }),
    ]);

    res.json({ data: items, total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / Number(limit)) });
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const item = await prisma.galleryItem.findUnique({ where: { id: req.params.id } });
    if (!item) throw new AppError('Gallery item not found', 404, 'NOT_FOUND');
    res.json(item);
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const { title, description, category, imageUrl, thumbnailUrl, tags } = req.body;
    const item = await prisma.galleryItem.create({ data: { title, description, category, imageUrl, thumbnailUrl, tags: tags || [] } });
    res.status(201).json(item);
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const { title, description, category, imageUrl, thumbnailUrl, tags } = req.body;
    const item = await prisma.galleryItem.update({ where: { id: req.params.id }, data: { title, description, category, imageUrl, thumbnailUrl, tags } });
    res.json(item);
  }),

  delete: asyncHandler(async (req: Request, res: Response) => {
    await prisma.galleryItem.delete({ where: { id: req.params.id } });
    res.status(204).send();
  }),
};