import { Prisma } from '@prisma/client';
import { prisma } from '../config/prisma';
import { AppError } from '../utils/AppError';
import { slugify } from '../utils/slugify';
import { sanitizeOptional, sanitizeString } from '../utils/sanitize';
import { deleteStoredFile, deleteStoredFiles, uploadBuffer } from './storage.service';

interface ListQuery {
  page?: number;
  limit?: number;
  category?: string;
  status?: string;
  search?: string;
  featured?: boolean;
  latest?: boolean;
  completed?: boolean;
  published?: boolean;
  sort?: string;
}

function publicSelect() {
  return {
    id: true,
    title: true,
    slug: true,
    shortDescription: true,
    description: true,
    category: true,
    location: true,
    year: true,
    status: true,
    client: true,
    architect: true,
    projectArea: true,
    coverImage: true,
    featured: true,
    latest: true,
    completed: true,
    displayOrder: true,
    published: true,
    createdAt: true,
    updatedAt: true,
    images: {
      orderBy: { displayOrder: 'asc' as const },
      select: {
        id: true,
        imageUrl: true,
        altText: true,
        caption: true,
        displayOrder: true,
      },
    },
  };
}

async function uniqueSlug(title: string, slug?: string, excludeId?: string) {
  const base = slugify(slug || title) || 'project';
  let candidate = base;
  let i = 2;
  while (true) {
    const existing = await prisma.project.findUnique({ where: { slug: candidate } });
    if (!existing || existing.id === excludeId) return candidate;
    candidate = `${base}-${i}`;
    i += 1;
  }
}

export async function listProjects(query: ListQuery, admin = false) {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 12;
  const skip = (page - 1) * limit;

  const where: Prisma.ProjectWhereInput = {};
  if (!admin) where.published = true;
  else if (typeof query.published === 'boolean') where.published = query.published;

  if (query.category && query.category !== 'all') where.category = query.category;
  if (query.status) where.status = query.status;
  if (typeof query.featured === 'boolean') where.featured = query.featured;
  if (typeof query.latest === 'boolean') where.latest = query.latest;
  if (typeof query.completed === 'boolean') where.completed = query.completed;
  if (query.search) {
    where.OR = [
      { title: { contains: query.search, mode: 'insensitive' } },
      { location: { contains: query.search, mode: 'insensitive' } },
      { shortDescription: { contains: query.search, mode: 'insensitive' } },
    ];
  }

  const orderBy: Prisma.ProjectOrderByWithRelationInput =
    query.sort === 'oldest'
      ? { createdAt: 'asc' }
      : query.sort === 'order'
        ? { displayOrder: 'asc' }
        : query.sort === 'year'
          ? { year: 'desc' }
          : { createdAt: 'desc' };

  const [items, total] = await prisma.$transaction([
    prisma.project.findMany({
      where,
      skip,
      take: limit,
      orderBy,
      select: publicSelect(),
    }),
    prisma.project.count({ where }),
  ]);

  return { items, total, page, limit };
}

export async function getProjectBySlug(slug: string, admin = false) {
  const project = await prisma.project.findUnique({
    where: { slug },
    select: publicSelect(),
  });
  if (!project || (!admin && !project.published)) {
    throw new AppError(404, 'Project not found');
  }
  return project;
}

export async function getProjectById(id: string) {
  const project = await prisma.project.findUnique({
    where: { id },
    select: {
      ...publicSelect(),
      coverImagePath: true,
      images: {
        orderBy: { displayOrder: 'asc' },
        select: {
          id: true,
          imageUrl: true,
          storagePath: true,
          altText: true,
          caption: true,
          displayOrder: true,
        },
      },
    },
  });
  if (!project) throw new AppError(404, 'Project not found');
  return project;
}

export async function getRelatedProjects(slug: string, category: string) {
  return prisma.project.findMany({
    where: { published: true, category, slug: { not: slug } },
    take: 3,
    orderBy: { createdAt: 'desc' },
    select: publicSelect(),
  });
}

interface ProjectInput {
  title: string;
  slug?: string;
  shortDescription: string;
  description: string;
  category: string;
  location: string;
  year: number;
  status?: string;
  client?: string;
  architect?: string;
  projectArea?: string;
  featured?: boolean;
  latest?: boolean;
  completed?: boolean;
  published?: boolean;
  displayOrder?: number;
}

export async function createProject(input: ProjectInput) {
  const slug = await uniqueSlug(input.title, input.slug);
  return prisma.project.create({
    data: {
      title: sanitizeString(input.title),
      slug,
      shortDescription: sanitizeString(input.shortDescription),
      description: sanitizeString(input.description),
      category: input.category,
      location: sanitizeString(input.location),
      year: input.year,
      status: input.status || 'concept',
      client: sanitizeOptional(input.client),
      architect: sanitizeOptional(input.architect),
      projectArea: sanitizeOptional(input.projectArea),
      featured: Boolean(input.featured),
      latest: Boolean(input.latest),
      completed: Boolean(input.completed) || input.status === 'completed',
      published: Boolean(input.published),
      displayOrder: input.displayOrder ?? 0,
    },
    select: publicSelect(),
  });
}

export async function updateProject(id: string, input: Partial<ProjectInput>) {
  const existing = await prisma.project.findUnique({ where: { id } });
  if (!existing) throw new AppError(404, 'Project not found');

  const slug =
    input.title || input.slug ? await uniqueSlug(input.title || existing.title, input.slug, id) : existing.slug;

  return prisma.project.update({
    where: { id },
    data: {
      ...(input.title !== undefined ? { title: sanitizeString(input.title) } : {}),
      slug,
      ...(input.shortDescription !== undefined ? { shortDescription: sanitizeString(input.shortDescription) } : {}),
      ...(input.description !== undefined ? { description: sanitizeString(input.description) } : {}),
      ...(input.category !== undefined ? { category: input.category } : {}),
      ...(input.location !== undefined ? { location: sanitizeString(input.location) } : {}),
      ...(input.year !== undefined ? { year: input.year } : {}),
      ...(input.status !== undefined ? { status: input.status } : {}),
      ...(input.client !== undefined ? { client: sanitizeOptional(input.client) } : {}),
      ...(input.architect !== undefined ? { architect: sanitizeOptional(input.architect) } : {}),
      ...(input.projectArea !== undefined ? { projectArea: sanitizeOptional(input.projectArea) } : {}),
      ...(input.featured !== undefined ? { featured: input.featured } : {}),
      ...(input.latest !== undefined ? { latest: input.latest } : {}),
      ...(input.completed !== undefined ? { completed: input.completed } : {}),
      ...(input.published !== undefined ? { published: input.published } : {}),
      ...(input.displayOrder !== undefined ? { displayOrder: input.displayOrder } : {}),
    },
    select: publicSelect(),
  });
}

export async function deleteProject(id: string) {
  const project = await prisma.project.findUnique({
    where: { id },
    include: { images: true },
  });
  if (!project) throw new AppError(404, 'Project not found');

  await prisma.$transaction(async (tx) => {
    await tx.projectImage.deleteMany({ where: { projectId: id } });
    await tx.project.delete({ where: { id } });
  });

  await deleteStoredFiles([project.coverImagePath, ...project.images.map((img) => img.storagePath)]);
  return { id };
}

export async function toggleFlag(id: string, field: 'featured' | 'latest' | 'completed' | 'published') {
  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) throw new AppError(404, 'Project not found');

  return prisma.project.update({
    where: { id },
    data: {
      [field]: !project[field],
      ...(field === 'completed' && !project.completed ? { status: 'completed' } : {}),
    },
    select: publicSelect(),
  });
}

export async function uploadCover(id: string, file: Express.Multer.File) {
  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) throw new AppError(404, 'Project not found');

  const uploaded = await uploadBuffer(file, `projects/${id}`);
  await deleteStoredFile(project.coverImagePath);

  return prisma.project.update({
    where: { id },
    data: { coverImage: uploaded.imageUrl, coverImagePath: uploaded.storagePath },
    select: publicSelect(),
  });
}

export async function addGalleryImages(
  id: string,
  files: Express.Multer.File[],
  meta: { altText?: string; caption?: string } = {},
) {
  const project = await prisma.project.findUnique({
    where: { id },
    include: { images: true },
  });
  if (!project) throw new AppError(404, 'Project not found');

  let order = project.images.length;
  const created = [];

  for (const file of files) {
    const uploaded = await uploadBuffer(file, `projects/${id}`);
    const image = await prisma.projectImage.create({
      data: {
        projectId: id,
        imageUrl: uploaded.imageUrl,
        storagePath: uploaded.storagePath,
        altText: sanitizeOptional(meta.altText) ?? project.title,
        caption: sanitizeOptional(meta.caption),
        displayOrder: order,
      },
    });
    created.push(image);
    order += 1;
  }

  return getProjectById(id);
}

export async function updateGalleryImage(
  projectId: string,
  imageId: string,
  data: { altText?: string; caption?: string; displayOrder?: number },
) {
  const image = await prisma.projectImage.findFirst({ where: { id: imageId, projectId } });
  if (!image) throw new AppError(404, 'Image not found');

  await prisma.projectImage.update({
    where: { id: imageId },
    data: {
      ...(data.altText !== undefined ? { altText: sanitizeOptional(data.altText) } : {}),
      ...(data.caption !== undefined ? { caption: sanitizeOptional(data.caption) } : {}),
      ...(data.displayOrder !== undefined ? { displayOrder: data.displayOrder } : {}),
    },
  });
  return getProjectById(projectId);
}

export async function reorderGalleryImages(projectId: string, orderedIds: string[]) {
  const project = await prisma.project.findUnique({ where: { id: projectId }, include: { images: true } });
  if (!project) throw new AppError(404, 'Project not found');

  await prisma.$transaction(
    orderedIds.map((id, index) =>
      prisma.projectImage.updateMany({
        where: { id, projectId },
        data: { displayOrder: index },
      }),
    ),
  );
  return getProjectById(projectId);
}

export async function deleteGalleryImage(projectId: string, imageId: string) {
  const image = await prisma.projectImage.findFirst({ where: { id: imageId, projectId } });
  if (!image) throw new AppError(404, 'Image not found');

  await prisma.projectImage.delete({ where: { id: imageId } });
  await deleteStoredFile(image.storagePath);
  return getProjectById(projectId);
}
