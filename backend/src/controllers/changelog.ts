import { Request, Response } from 'express';
import { prisma } from '../database/client';
import { asyncHandler } from '../middleware';
import { AppError } from '../middleware';

export const changelogController = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const entries = await prisma.changelogEntry.findMany({ orderBy: { date: 'desc' } });
    res.json(entries);
  }),

  getLatest: asyncHandler(async (req: Request, res: Response) => {
    const entry = await prisma.changelogEntry.findFirst({ orderBy: { date: 'desc' } });
    if (!entry) throw new AppError('No changelog entries found', 404, 'NOT_FOUND');
    res.json(entry);
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const { version, date, added, changed, fixed, improved } = req.body;
    const entry = await prisma.changelogEntry.create({ data: { version, date: new Date(date), added: added || [], changed: changed || [], fixed: fixed || [], improved: improved || [] } });
    res.status(201).json(entry);
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const { version, date, added, changed, fixed, improved } = req.body;
    const entry = await prisma.changelogEntry.update({ where: { id: req.params.id }, data: { version, date: new Date(date), added, changed, fixed, improved } });
    res.json(entry);
  }),

  delete: asyncHandler(async (req: Request, res: Response) => {
    await prisma.changelogEntry.delete({ where: { id: req.params.id } });
    res.status(204).send();
  }),
};