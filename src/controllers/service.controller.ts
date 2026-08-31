import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import * as serviceService from '../services/service.service';
import { created, ok } from '../utils/apiResponse';
import { AppError } from '../utils/AppError';
import { param } from '../utils/params';

export const listPublic = asyncHandler(async (_req: Request, res: Response) => {
  const services = await serviceService.listServices(false);
  return ok(res, services);
});

export const getBySlug = asyncHandler(async (req: Request, res: Response) => {
  const service = await serviceService.getServiceBySlug(param(req, 'slug'));
  return ok(res, service);
});

export const listAdmin = asyncHandler(async (_req: Request, res: Response) => {
  const services = await serviceService.listServices(true);
  return ok(res, services);
});

export const getById = asyncHandler(async (req: Request, res: Response) => {
  const service = await serviceService.getServiceById(param(req, 'id'));
  return ok(res, service);
});

export const create = asyncHandler(async (req: Request, res: Response) => {
  const service = await serviceService.createService(req.body);
  return created(res, service, 'Service created');
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const service = await serviceService.updateService(param(req, 'id'), req.body);
  return ok(res, service, 'Service updated');
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  const result = await serviceService.deleteService(param(req, 'id'));
  return ok(res, result, 'Service deleted');
});

export const toggle = asyncHandler(async (req: Request, res: Response) => {
  const service = await serviceService.toggleServiceActive(param(req, 'id'));
  return ok(res, service, 'Service updated');
});

export const uploadImage = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) throw new AppError(400, 'Image is required');
  const service = await serviceService.uploadServiceImage(param(req, 'id'), req.file);
  return ok(res, service, 'Service image uploaded');
});

export const deleteImage = asyncHandler(async (req: Request, res: Response) => {
  const service = await serviceService.deleteServiceImage(param(req, 'id'));
  return ok(res, service, 'Service image deleted');
});
