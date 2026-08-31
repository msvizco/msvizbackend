import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import * as projectService from '../services/project.service';
import { created, ok, paginated } from '../utils/apiResponse';
import { AppError } from '../utils/AppError';
import { param } from '../utils/params';

function parseBool(value: unknown): boolean | undefined {
  if (value === undefined) return undefined;
  if (typeof value === 'boolean') return value;
  if (value === 'true') return true;
  if (value === 'false') return false;
  return undefined;
}

export const listPublic = asyncHandler(async (req: Request, res: Response) => {
  const { items, total, page, limit } = await projectService.listProjects(
    {
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 12,
      category: req.query.category as string | undefined,
      status: req.query.status as string | undefined,
      search: req.query.search as string | undefined,
      featured: parseBool(req.query.featured),
      latest: parseBool(req.query.latest),
      completed: parseBool(req.query.completed),
      sort: (req.query.sort as string) || 'newest',
    },
    false,
  );
  return paginated(res, items, { page, limit, total });
});

export const getBySlug = asyncHandler(async (req: Request, res: Response) => {
  const project = await projectService.getProjectBySlug(param(req, 'slug'));
  const related = await projectService.getRelatedProjects(project.slug, project.category);
  return ok(res, { ...project, related });
});

export const listAdmin = asyncHandler(async (req: Request, res: Response) => {
  const { items, total, page, limit } = await projectService.listProjects(
    {
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 20,
      category: req.query.category as string | undefined,
      status: req.query.status as string | undefined,
      search: req.query.search as string | undefined,
      featured: parseBool(req.query.featured),
      latest: parseBool(req.query.latest),
      completed: parseBool(req.query.completed),
      published: parseBool(req.query.published),
      sort: (req.query.sort as string) || 'newest',
    },
    true,
  );
  return paginated(res, items, { page, limit, total });
});

export const getById = asyncHandler(async (req: Request, res: Response) => {
  const project = await projectService.getProjectById(param(req, 'id'));
  return ok(res, project);
});

export const create = asyncHandler(async (req: Request, res: Response) => {
  const project = await projectService.createProject(req.body);
  return created(res, project, 'Project created');
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const project = await projectService.updateProject(param(req, 'id'), req.body);
  return ok(res, project, 'Project updated');
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  const result = await projectService.deleteProject(param(req, 'id'));
  return ok(res, result, 'Project deleted');
});

export const toggle = asyncHandler(async (req: Request, res: Response) => {
  const field = param(req, 'field') as 'featured' | 'latest' | 'completed' | 'published';
  if (!['featured', 'latest', 'completed', 'published'].includes(field)) {
    throw new AppError(400, 'Invalid flag');
  }
  const project = await projectService.toggleFlag(param(req, 'id'), field);
  return ok(res, project, 'Project updated');
});

export const uploadCover = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) throw new AppError(400, 'Cover image is required');
  const project = await projectService.uploadCover(param(req, 'id'), req.file);
  return ok(res, project, 'Cover image uploaded');
});

export const uploadGallery = asyncHandler(async (req: Request, res: Response) => {
  const files = (req.files as Express.Multer.File[]) || [];
  if (!files.length) throw new AppError(400, 'At least one image is required');
  const project = await projectService.addGalleryImages(param(req, 'id'), files, {
    altText: req.body.altText,
    caption: req.body.caption,
  });
  return ok(res, project, 'Gallery images uploaded');
});

export const updateImage = asyncHandler(async (req: Request, res: Response) => {
  const project = await projectService.updateGalleryImage(param(req, 'id'), param(req, 'imageId'), req.body);
  return ok(res, project, 'Image updated');
});

export const reorderImages = asyncHandler(async (req: Request, res: Response) => {
  const ids = req.body.orderedIds as string[];
  if (!Array.isArray(ids)) throw new AppError(400, 'orderedIds must be an array');
  const project = await projectService.reorderGalleryImages(param(req, 'id'), ids);
  return ok(res, project, 'Images reordered');
});

export const deleteImage = asyncHandler(async (req: Request, res: Response) => {
  const project = await projectService.deleteGalleryImage(param(req, 'id'), param(req, 'imageId'));
  return ok(res, project, 'Image deleted');
});
