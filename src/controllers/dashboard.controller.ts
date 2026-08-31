import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import * as dashboardService from '../services/dashboard.service';
import { ok } from '../utils/apiResponse';

export const stats = asyncHandler(async (_req: Request, res: Response) => {
  const data = await dashboardService.getDashboardStats();
  return ok(res, data);
});
