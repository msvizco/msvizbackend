import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import * as settingsService from '../services/settings.service';
import { ok } from '../utils/apiResponse';
import { AppError } from '../utils/AppError';

export const getPublic = asyncHandler(async (_req: Request, res: Response) => {
  const settings = await settingsService.getSettings(false);
  return ok(res, settings);
});

export const getAdmin = asyncHandler(async (_req: Request, res: Response) => {
  const settings = await settingsService.getSettings(true);
  return ok(res, settings);
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const settings = await settingsService.updateSettings(req.body);
  return ok(res, settings, 'Settings updated');
});

export const uploadLogo = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) throw new AppError(400, 'Logo image is required');
  const settings = await settingsService.uploadLogo(req.file);
  return ok(res, settings, 'Logo uploaded');
});

export const uploadHeroImage = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) throw new AppError(400, 'Hero image is required');
  const settings = await settingsService.uploadHeroImage(req.file);
  return ok(res, settings, 'Hero image uploaded');
});

export const uploadPanelImage = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) throw new AppError(400, 'Image is required');
  const panel = String(req.params.panel || '') as 'who' | 'mission' | 'vision';
  if (!['who', 'mission', 'vision'].includes(panel)) {
    throw new AppError(400, 'Panel must be who, mission, or vision');
  }
  const settings = await settingsService.uploadPanelImage(panel, req.file);
  return ok(res, settings, 'Panel image uploaded');
});

export const testimonials = asyncHandler(async (_req: Request, res: Response) => {
  const items = await settingsService.listTestimonials();
  return ok(res, items);
});

export const faqs = asyncHandler(async (_req: Request, res: Response) => {
  const items = await settingsService.listFaqs();
  return ok(res, items);
});
