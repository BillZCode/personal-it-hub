import { Request, Response } from 'express';
import { prisma } from '../database/client';
import { asyncHandler } from '../middleware';
import { AppError } from '../middleware';

export const adminController = {
  projects: {
    getAll: asyncHandler(async (req: Request, res: Response) => {
      const { page = 1, limit = 20 } = req.query;
      const [projects, total] = await Promise.all([
        prisma.project.findMany({ orderBy: { createdAt: 'desc' }, skip: (Number(page) - 1) * Number(limit), take: Number(limit) }),
        prisma.project.count(),
      ]);
      res.json({ data: projects, total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / Number(limit)) });
    }),
    create: asyncHandler(async (req: Request, res: Response) => {
      const project = await prisma.project.create({ data: req.body });
      res.status(201).json(project);
    }),
    update: asyncHandler(async (req: Request, res: Response) => {
      const project = await prisma.project.update({ where: { id: req.params.id }, data: req.body });
      res.json(project);
    }),
    delete: asyncHandler(async (req: Request, res: Response) => {
      await prisma.project.delete({ where: { id: req.params.id } });
      res.status(204).send();
    }),
  },

  notes: {
    getAll: asyncHandler(async (req: Request, res: Response) => {
      const { page = 1, limit = 20, published } = req.query;
      const where: any = {};
      if (published !== undefined) where.published = published === 'true';
      const [notes, total] = await Promise.all([
        prisma.technicalNote.findMany({ where, orderBy: { createdAt: 'desc' }, skip: (Number(page) - 1) * Number(limit), take: Number(limit) }),
        prisma.technicalNote.count({ where }),
      ]);
      res.json({ data: notes, total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / Number(limit)) });
    }),
    create: asyncHandler(async (req: Request, res: Response) => {
      const readingTime = req.body.readingTime || Math.max(1, Math.ceil(((req.body.content || '').split(/\s+/).length) / 200));
      const note = await prisma.technicalNote.create({
        data: {
          ...req.body,
          readingTime,
          publishedAt: req.body.published ? new Date() : null,
        },
      });
      res.status(201).json(note);
    }),
    update: asyncHandler(async (req: Request, res: Response) => {
      const existing = await prisma.technicalNote.findUnique({ where: { id: req.params.id } });
      const note = await prisma.technicalNote.update({ where: { id: req.params.id }, data: { ...req.body, publishedAt: req.body.published && !existing?.published ? new Date() : existing?.publishedAt } });
      res.json(note);
    }),
    delete: asyncHandler(async (req: Request, res: Response) => {
      await prisma.technicalNote.delete({ where: { id: req.params.id } });
      res.status(204).send();
    }),
  },

  certificates: {
    getAll: asyncHandler(async (req: Request, res: Response) => {
      const { page = 1, limit = 20 } = req.query;
      const [certs, total] = await Promise.all([
        prisma.certificate.findMany({ orderBy: { createdAt: 'desc' }, skip: (Number(page) - 1) * Number(limit), take: Number(limit) }),
        prisma.certificate.count(),
      ]);
      res.json({ data: certs, total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / Number(limit)) });
    }),
    create: asyncHandler(async (req: Request, res: Response) => {
      const cert = await prisma.certificate.create({ data: req.body });
      res.status(201).json(cert);
    }),
    update: asyncHandler(async (req: Request, res: Response) => {
      const cert = await prisma.certificate.update({ where: { id: req.params.id }, data: req.body });
      res.json(cert);
    }),
    delete: asyncHandler(async (req: Request, res: Response) => {
      await prisma.certificate.delete({ where: { id: req.params.id } });
      res.status(204).send();
    }),
  },

  gallery: {
    getAll: asyncHandler(async (req: Request, res: Response) => {
      const { page = 1, limit = 20 } = req.query;
      const [items, total] = await Promise.all([
        prisma.galleryItem.findMany({ orderBy: { createdAt: 'desc' }, skip: (Number(page) - 1) * Number(limit), take: Number(limit) }),
        prisma.galleryItem.count(),
      ]);
      res.json({ data: items, total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / Number(limit)) });
    }),
    create: asyncHandler(async (req: Request, res: Response) => {
      const item = await prisma.galleryItem.create({ data: req.body });
      res.status(201).json(item);
    }),
    update: asyncHandler(async (req: Request, res: Response) => {
      const item = await prisma.galleryItem.update({ where: { id: req.params.id }, data: req.body });
      res.json(item);
    }),
    delete: asyncHandler(async (req: Request, res: Response) => {
      await prisma.galleryItem.delete({ where: { id: req.params.id } });
      res.status(204).send();
    }),
  },

  changelog: {
    getAll: asyncHandler(async (req: Request, res: Response) => {
      const entries = await prisma.changelogEntry.findMany({ orderBy: { date: 'desc' } });
      res.json(entries);
    }),
    create: asyncHandler(async (req: Request, res: Response) => {
      const entry = await prisma.changelogEntry.create({ data: req.body });
      res.status(201).json(entry);
    }),
    update: asyncHandler(async (req: Request, res: Response) => {
      const entry = await prisma.changelogEntry.update({ where: { id: req.params.id }, data: req.body });
      res.json(entry);
    }),
    delete: asyncHandler(async (req: Request, res: Response) => {
      await prisma.changelogEntry.delete({ where: { id: req.params.id } });
      res.status(204).send();
    }),
  },

  guestbook: {
    getAll: asyncHandler(async (req: Request, res: Response) => {
      const { page = 1, limit = 20, approved } = req.query;
      const where: any = {};
      if (approved !== undefined) where.approved = approved === 'true';
      const [entries, total] = await Promise.all([
        prisma.guestbookEntry.findMany({ where, orderBy: { createdAt: 'desc' }, skip: (Number(page) - 1) * Number(limit), take: Number(limit) }),
        prisma.guestbookEntry.count({ where }),
      ]);
      res.json({ data: entries, total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / Number(limit)) });
    }),
    approve: asyncHandler(async (req: Request, res: Response) => {
      const entry = await prisma.guestbookEntry.update({ where: { id: req.params.id }, data: { approved: true } });
      res.json(entry);
    }),
    delete: asyncHandler(async (req: Request, res: Response) => {
      await prisma.guestbookEntry.delete({ where: { id: req.params.id } });
      res.status(204).send();
    }),
  },

  statistics: {
    getDashboard: asyncHandler(async (req: Request, res: Response) => {
      const [visitors, projects, notes, certs, gallery, guestbook] = await Promise.all([
        prisma.statistics.aggregate({ _sum: { visitors: true } }),
        prisma.project.count(),
        prisma.technicalNote.count({ where: { published: true } }),
        prisma.certificate.count(),
        prisma.galleryItem.count(),
        prisma.guestbookEntry.count({ where: { approved: true } }),
      ]);
      res.json({
        totalVisitors: Number(visitors._sum.visitors || 0),
        totalProjects: projects,
        totalNotes: notes,
        totalCertificates: certs,
        totalGalleryItems: gallery,
        totalGuestbookEntries: guestbook,
      });
    }),
  },
};