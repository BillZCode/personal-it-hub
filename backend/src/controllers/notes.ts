import { Request, Response } from 'express';
import { prisma } from '../database/client';
import { asyncHandler } from '../middleware';
import { AppError } from '../middleware';

export const notesController = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const { category, tag, search, published = true, page = 1, limit = 20 } = req.query;
    const where: any = {};

    if (published !== undefined && published !== '') {
      where.published = published === true || published === 'true';
    }
    if (category) where.category = category;
    if (tag) where.tags = { has: tag };
    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: 'insensitive' } },
        { summary: { contains: search as string, mode: 'insensitive' } },
        { tags: { has: search as string } },
      ];
    }

    const [notes, total] = await Promise.all([
      prisma.technicalNote.findMany({
        where,
        orderBy: { publishedAt: 'desc' },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
      }),
      prisma.technicalNote.count({ where }),
    ]);

    res.json({ data: notes, total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / Number(limit)) });
  }),

  getBySlug: asyncHandler(async (req: Request, res: Response) => {
    const note = await prisma.technicalNote.findUnique({ where: { slug: req.params.slug } });
    if (!note) throw new AppError('Note not found', 404, 'NOT_FOUND');
    res.json(note);
  }),

  getCategories: asyncHandler(async (req: Request, res: Response) => {
    const categories = await prisma.technicalNote.findMany({
      where: { published: true },
      select: { category: true },
      distinct: ['category'],
    });
    res.json(categories.map(c => c.category).sort());
  }),

  getTags: asyncHandler(async (req: Request, res: Response) => {
    const notes = await prisma.technicalNote.findMany({
      where: { published: true },
      select: { tags: true },
    });
    const tags = [...new Set(notes.flatMap(n => n.tags))].sort();
    res.json(tags);
  }),

  getRelated: asyncHandler(async (req: Request, res: Response) => {
    const note = await prisma.technicalNote.findUnique({ where: { slug: req.params.slug } });
    if (!note) throw new AppError('Note not found', 404, 'NOT_FOUND');

    const related = await prisma.technicalNote.findMany({
      where: { category: note.category, id: { not: note.id }, published: true },
      take: 5,
      orderBy: { publishedAt: 'desc' },
    });
    res.json(related);
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const { title, slug, category, tags, summary, content, published, readingTime } = req.body;
    const calculatedReadingTime = readingTime || Math.max(1, Math.ceil(((content || '').split(/\s+/).length) / 200));
    const note = await prisma.technicalNote.create({
      data: {
        title,
        slug,
        category,
        tags: tags || [],
        summary,
        content,
        readingTime: calculatedReadingTime,
        published: published ?? true,
        publishedAt: published ? new Date() : null,
      },
    });
    res.status(201).json(note);
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const { title, slug, category, tags, summary, content, published } = req.body;
    const existing = await prisma.technicalNote.findUnique({ where: { id: req.params.id } });
    if (!existing) throw new AppError('Note not found', 404, 'NOT_FOUND');

    const note = await prisma.technicalNote.update({
      where: { id: req.params.id },
      data: { title, slug, category, tags, summary, content, published, publishedAt: published && !existing.published ? new Date() : existing.publishedAt },
    });
    res.json(note);
  }),

  delete: asyncHandler(async (req: Request, res: Response) => {
    await prisma.technicalNote.delete({ where: { id: req.params.id } });
    res.status(204).send();
  }),
};