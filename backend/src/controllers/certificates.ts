import { Request, Response } from 'express';
import { prisma } from '../database/client';
import { asyncHandler } from '../middleware';
import { AppError } from '../middleware';

export const certificatesController = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const { provider, search, page = 1, limit = 20 } = req.query;
    const where: any = {};

    if (provider) where.provider = provider;
    if (search) where.OR = [{ name: { contains: search as string, mode: 'insensitive' } }, { provider: { contains: search as string, mode: 'insensitive' } }];

    const [certificates, total] = await Promise.all([
      prisma.certificate.findMany({ where, orderBy: { issueDate: 'desc' }, skip: (Number(page) - 1) * Number(limit), take: Number(limit) }),
      prisma.certificate.count({ where }),
    ]);

    res.json({ data: certificates, total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / Number(limit)) });
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const cert = await prisma.certificate.findUnique({ where: { id: req.params.id } });
    if (!cert) throw new AppError('Certificate not found', 404, 'NOT_FOUND');
    res.json(cert);
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const { name, provider, issueDate, expiryDate, credentialId, verificationUrl, imageUrl } = req.body;
    const cert = await prisma.certificate.create({ data: { name, provider, issueDate: new Date(issueDate), expiryDate: expiryDate ? new Date(expiryDate) : null, credentialId, verificationUrl, imageUrl } });
    res.status(201).json(cert);
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const { name, provider, issueDate, expiryDate, credentialId, verificationUrl, imageUrl } = req.body;
    const cert = await prisma.certificate.update({ where: { id: req.params.id }, data: { name, provider, issueDate: new Date(issueDate), expiryDate: expiryDate ? new Date(expiryDate) : null, credentialId, verificationUrl, imageUrl } });
    res.json(cert);
  }),

  delete: asyncHandler(async (req: Request, res: Response) => {
    await prisma.certificate.delete({ where: { id: req.params.id } });
    res.status(204).send();
  }),
};