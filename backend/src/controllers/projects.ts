import { Request, Response } from 'express';
import { prisma } from '../database/client';
import { asyncHandler } from '../middleware';
import { AppError } from '../middleware';

export const projectsController = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const { status, technology, featured, page = 1, limit = 20 } = req.query;
    const pageNum = Math.max(1, parseInt(String(page), 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(String(limit), 10) || 20));
    const where: any = {};

    if (status) where.status = status;
    if (technology) where.technologies = { has: technology };
    if (featured !== undefined) where.featured = featured === 'true';

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
      }),
      prisma.project.count({ where }),
    ]);

    res.json({ 
      data: projects, 
      total, 
      page: pageNum, 
      limit: limitNum, 
      totalPages: Math.ceil(total / limitNum) 
    });
  }),

  getFeatured: asyncHandler(async (req: Request, res: Response) => {
    const projects = await prisma.project.findMany({
      where: { featured: true, status: 'COMPLETED' },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });
    res.json(projects);
  }),

  getBySlug: asyncHandler(async (req: Request, res: Response) => {
    const project = await prisma.project.findUnique({ where: { slug: req.params.slug } });
    if (!project) throw new AppError('Project not found', 404, 'NOT_FOUND');
    res.json(project);
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const { title, slug, description, content, technologies, image, demoUrl, repoUrl, status, featured } = req.body;
    const project = await prisma.project.create({
      data: { title, slug, description, content, technologies: technologies || [], image, demoUrl, repoUrl, status, featured },
    });
    res.status(201).json(project);
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const { title, slug, description, content, technologies, image, demoUrl, repoUrl, status, featured } = req.body;
    const project = await prisma.project.update({
      where: { id: req.params.id },
      data: { title, slug, description, content, technologies, image, demoUrl, repoUrl, status, featured },
    });
    res.json(project);
  }),

  delete: asyncHandler(async (req: Request, res: Response) => {
    await prisma.project.delete({ where: { id: req.params.id } });
    res.status(204).send();
  }),
};