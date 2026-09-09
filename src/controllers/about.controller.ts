import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import * as aboutService from '../services/about.service';
import { created, ok } from '../utils/apiResponse';
import { AppError } from '../utils/AppError';
import { param } from '../utils/params';

export const getPublic = asyncHandler(async (_req: Request, res: Response) => {
  const data = await aboutService.getAboutPage(false);
  return ok(res, data);
});

export const getAdmin = asyncHandler(async (_req: Request, res: Response) => {
  const data = await aboutService.getAboutPage(true);
  return ok(res, data);
});

export const createFeature = asyncHandler(async (req: Request, res: Response) => {
  const item = await aboutService.createFeature(req.body);
  return created(res, item, 'Feature created');
});

export const updateFeature = asyncHandler(async (req: Request, res: Response) => {
  const item = await aboutService.updateFeature(param(req, 'id'), req.body);
  return ok(res, item, 'Feature updated');
});

export const deleteFeature = asyncHandler(async (req: Request, res: Response) => {
  const result = await aboutService.deleteFeature(param(req, 'id'));
  return ok(res, result, 'Feature deleted');
});

export const uploadFeatureIcon = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) throw new AppError(400, 'Icon image is required');
  const item = await aboutService.uploadFeatureIcon(param(req, 'id'), req.file);
  return ok(res, item, 'Icon uploaded');
});

export const reorderFeatures = asyncHandler(async (req: Request, res: Response) => {
  const ids = req.body.orderedIds as string[];
  if (!Array.isArray(ids)) throw new AppError(400, 'orderedIds must be an array');
  const items = await aboutService.reorderFeatures(ids);
  return ok(res, items, 'Features reordered');
});

export const createTeamMember = asyncHandler(async (req: Request, res: Response) => {
  const item = await aboutService.createTeamMember(req.body);
  return created(res, item, 'Team member created');
});

export const updateTeamMember = asyncHandler(async (req: Request, res: Response) => {
  const item = await aboutService.updateTeamMember(param(req, 'id'), req.body);
  return ok(res, item, 'Team member updated');
});

export const deleteTeamMember = asyncHandler(async (req: Request, res: Response) => {
  const result = await aboutService.deleteTeamMember(param(req, 'id'));
  return ok(res, result, 'Team member deleted');
});

export const uploadTeamImage = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) throw new AppError(400, 'Image is required');
  const item = await aboutService.uploadTeamImage(param(req, 'id'), req.file);
  return ok(res, item, 'Team image uploaded');
});

export const reorderTeam = asyncHandler(async (req: Request, res: Response) => {
  const ids = req.body.orderedIds as string[];
  if (!Array.isArray(ids)) throw new AppError(400, 'orderedIds must be an array');
  const items = await aboutService.reorderTeam(ids);
  return ok(res, items, 'Team reordered');
});

export const createStory = asyncHandler(async (req: Request, res: Response) => {
  const item = await aboutService.createStory(req.body);
  return created(res, item, 'Story created');
});

export const updateStory = asyncHandler(async (req: Request, res: Response) => {
  const item = await aboutService.updateStory(param(req, 'id'), req.body);
  return ok(res, item, 'Story updated');
});

export const deleteStory = asyncHandler(async (req: Request, res: Response) => {
  const result = await aboutService.deleteStory(param(req, 'id'));
  return ok(res, result, 'Story deleted');
});

export const uploadStoryImage = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) throw new AppError(400, 'Image is required');
  const item = await aboutService.uploadStoryImage(param(req, 'id'), req.file);
  return ok(res, item, 'Story image uploaded');
});

export const reorderStories = asyncHandler(async (req: Request, res: Response) => {
  const ids = req.body.orderedIds as string[];
  if (!Array.isArray(ids)) throw new AppError(400, 'orderedIds must be an array');
  const items = await aboutService.reorderStories(ids);
  return ok(res, items, 'Stories reordered');
});
