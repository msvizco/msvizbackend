import { prisma } from '../config/prisma';
import { AppError } from '../utils/AppError';
import { slugify } from '../utils/slugify';
import { sanitizeOptional, sanitizeString } from '../utils/sanitize';
import { deleteStoredFile, uploadBuffer } from './storage.service';

async function uniqueSlug(name: string, slug?: string, excludeId?: string) {
  const base = slugify(slug || name) || 'service';
  let candidate = base;
  let i = 2;
  while (true) {
    const existing = await prisma.service.findUnique({ where: { slug: candidate } });
    if (!existing || existing.id === excludeId) return candidate;
    candidate = `${base}-${i}`;
    i += 1;
  }
}

export async function listServices(admin = false) {
  return prisma.service.findMany({
    where: admin ? {} : { active: true },
    orderBy: { displayOrder: 'asc' },
  });
}

export async function getServiceBySlug(slug: string, admin = false) {
  const service = await prisma.service.findUnique({ where: { slug } });
  if (!service || (!admin && !service.active)) {
    throw new AppError(404, 'Service not found');
  }
  return service;
}

export async function getServiceById(id: string) {
  const service = await prisma.service.findUnique({ where: { id } });
  if (!service) throw new AppError(404, 'Service not found');
  return service;
}

interface ServiceInput {
  name: string;
  slug?: string;
  shortDescription: string;
  fullDescription: string;
  icon?: string;
  displayOrder?: number;
  active?: boolean;
}

export async function createService(input: ServiceInput) {
  const slug = await uniqueSlug(input.name, input.slug);
  const maxOrder = await prisma.service.aggregate({ _max: { displayOrder: true } });
  const nextOrder = input.displayOrder ?? (maxOrder._max.displayOrder ?? -1) + 1;
  return prisma.service.create({
    data: {
      name: sanitizeString(input.name),
      slug,
      shortDescription: sanitizeString(input.shortDescription),
      fullDescription: sanitizeString(input.fullDescription),
      icon: sanitizeOptional(input.icon),
      displayOrder: nextOrder,
      active: input.active ?? true,
    },
  });
}

export async function updateService(id: string, input: Partial<ServiceInput>) {
  const existing = await prisma.service.findUnique({ where: { id } });
  if (!existing) throw new AppError(404, 'Service not found');

  const slug =
    input.name || input.slug ? await uniqueSlug(input.name || existing.name, input.slug, id) : existing.slug;

  return prisma.service.update({
    where: { id },
    data: {
      ...(input.name !== undefined ? { name: sanitizeString(input.name) } : {}),
      slug,
      ...(input.shortDescription !== undefined ? { shortDescription: sanitizeString(input.shortDescription) } : {}),
      ...(input.fullDescription !== undefined ? { fullDescription: sanitizeString(input.fullDescription) } : {}),
      ...(input.icon !== undefined ? { icon: sanitizeOptional(input.icon) } : {}),
      ...(input.displayOrder !== undefined ? { displayOrder: input.displayOrder } : {}),
      ...(input.active !== undefined ? { active: input.active } : {}),
    },
  });
}

export async function deleteService(id: string) {
  const service = await prisma.service.findUnique({ where: { id } });
  if (!service) throw new AppError(404, 'Service not found');
  await prisma.service.delete({ where: { id } });
  await deleteStoredFile(service.storagePath);
  return { id };
}

export async function toggleServiceActive(id: string) {
  const service = await prisma.service.findUnique({ where: { id } });
  if (!service) throw new AppError(404, 'Service not found');
  return prisma.service.update({
    where: { id },
    data: { active: !service.active },
  });
}

export async function uploadServiceImage(id: string, file: Express.Multer.File) {
  const service = await prisma.service.findUnique({ where: { id } });
  if (!service) throw new AppError(404, 'Service not found');

  const uploaded = await uploadBuffer(file, 'services');
  await deleteStoredFile(service.storagePath);

  return prisma.service.update({
    where: { id },
    data: { imageUrl: uploaded.imageUrl, storagePath: uploaded.storagePath },
  });
}

export async function deleteServiceImage(id: string) {
  const service = await prisma.service.findUnique({ where: { id } });
  if (!service) throw new AppError(404, 'Service not found');
  if (!service.imageUrl && !service.storagePath) {
    throw new AppError(404, 'Service has no image');
  }

  await deleteStoredFile(service.storagePath);

  return prisma.service.update({
    where: { id },
    data: { imageUrl: null, storagePath: null },
  });
}

export async function reorderServices(orderedIds: string[]) {
  if (!Array.isArray(orderedIds) || !orderedIds.length) {
    throw new AppError(400, 'orderedIds must be a non-empty array');
  }

  await prisma.$transaction(
    orderedIds.map((id, index) =>
      prisma.service.update({
        where: { id },
        data: { displayOrder: index },
      }),
    ),
  );

  return listServices(true);
}
