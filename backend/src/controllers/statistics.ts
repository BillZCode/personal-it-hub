import { Request, Response } from 'express';
import { prisma } from '../database/client';
import { asyncHandler } from '../middleware';
import { statisticsService } from '../services/statistics';

export const statisticsController = {
  getOverview: asyncHandler(async (req: Request, res: Response) => {
    const overview = await statisticsService.getStatisticsOverview();
    res.json(overview);
  }),

  getVisitors: asyncHandler(async (req: Request, res: Response) => {
    const period = req.query.period as string || '30d';
    const days = period === '7d' ? 7 : period === '30d' ? 30 : period === '90d' ? 90 : 365;
    const data = await statisticsService.getVisitorsData(days);
    res.json(data);
  }),

  getToolUsage: asyncHandler(async (req: Request, res: Response) => {
    const data = await statisticsService.getToolUsage();
    res.json(data);
  }),

  getArticleViews: asyncHandler(async (req: Request, res: Response) => {
    const data = await statisticsService.getArticleViews();
    res.json(data);
  }),
};