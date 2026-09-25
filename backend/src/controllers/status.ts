import { Request, Response } from 'express';
import { asyncHandler } from '../middleware';
import { prisma } from '../database/client';

export const statusController = {
  getSystemStatus: asyncHandler(async (req: Request, res: Response) => {
    // Check database connectivity
    let dbStatus = 'operational';
    try {
      await prisma.$queryRaw`SELECT 1`;
    } catch {
      dbStatus = 'major_outage';
    }

    // Check API (self)
    const apiStatus = 'operational';

    // Check website (self)
    const websiteStatus = 'operational';

    // Check download service (mock)
    const downloadStatus = 'operational';

    // Check DNS (mock)
    const dnsStatus = 'operational';

    res.json({
      website: websiteStatus,
      api: apiStatus,
      download: downloadStatus,
      database: dbStatus,
      dns: dnsStatus,
    });
  }),
};