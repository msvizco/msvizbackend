import { prisma } from '../config/prisma';
import { AppError } from '../utils/AppError';
import { sanitizeOptional, sanitizeString } from '../utils/sanitize';
import { deleteStoredFile, uploadBuffer } from './storage.service';

async function nextOrder(model: 'aboutFeature' | 'teamMember' | 'aboutStory') {
  if (model === 'aboutFeature') {
    const max = await prisma.aboutFeature.aggregate({ _max: { displayOrder: true } });
    return (max._max.displayOrder ?? -1) + 1;
  }
  if (model === 'teamMember') {
    const max = await prisma.teamMember.aggregate({ _max: { displayOrder: true } });
    return (max._max.displayOrder ?? -1) + 1;
  }
  const max = await prisma.aboutStory.aggregate({ _max: { displayOrder: true } });
  return (max._max.displayOrder ?? -1) + 1;
}

export async function getAboutPage(admin = false) {
  const [features, team, stories] = await Promise.all([
    prisma.aboutFeature.findMany({
      where: admin ? {} : { active: true },
      orderBy: { displayOrder: 'asc' },
    }),
    prisma.teamMember.findMany({
      where: admin ? {} : { active: true },
      orderBy: { displayOrder: 'asc' },
    }),
    prisma.aboutStory.findMany({
      where: admin ? {} : { active: true },
      orderBy: { displayOrder: 'asc' },
    }),
  ]);
  return { features, team, stories };
}

/* ─── Features ─── */
export async function createFeature(input: {
  title: string;
  description: string;
  linkUrl?: string;
  displayOrder?: number;
  active?: boolean;
}) {
  return prisma.aboutFeature.create({
    data: {
      title: sanitizeString(input.title),
      description: sanitizeString(input.description),
      linkUrl: sanitizeOptional(input.linkUrl),
      displayOrder: input.displayOrder ?? (await nextOrder('aboutFeature')),
      active: input.active ?? true,
    },
  });
}

export async function updateFeature(
  id: string,
  input: Partial<{ title: string; description: string; linkUrl?: string; displayOrder: number; active: boolean }>,
) {
  const existing = await prisma.aboutFeature.findUnique({ where: { id } });
  if (!existing) throw new AppError(404, 'Feature not found');
  return prisma.aboutFeature.update({
    where: { id },
    data: {
      ...(input.title !== undefined ? { title: sanitizeString(input.title) } : {}),
      ...(input.description !== undefined ? { description: sanitizeString(input.description) } : {}),
      ...(input.linkUrl !== undefined ? { linkUrl: sanitizeOptional(input.linkUrl) } : {}),
      ...(input.displayOrder !== undefined ? { displayOrder: input.displayOrder } : {}),
      ...(input.active !== undefined ? { active: input.active } : {}),
    },
  });
}

export async function deleteFeature(id: string) {
  const existing = await prisma.aboutFeature.findUnique({ where: { id } });
  if (!existing) throw new AppError(404, 'Feature not found');
  await prisma.aboutFeature.delete({ where: { id } });
  await deleteStoredFile(existing.iconPath);
  return { id };
}

export async function uploadFeatureIcon(id: string, file: Express.Multer.File) {
  const existing = await prisma.aboutFeature.findUnique({ where: { id } });
  if (!existing) throw new AppError(404, 'Feature not found');
  const uploaded = await uploadBuffer(file, 'about/features');
  await deleteStoredFile(existing.iconPath);
  return prisma.aboutFeature.update({
    where: { id },
    data: { iconUrl: uploaded.imageUrl, iconPath: uploaded.storagePath },
  });
}

export async function reorderFeatures(orderedIds: string[]) {
  await prisma.$transaction(
    orderedIds.map((id, index) =>
      prisma.aboutFeature.update({ where: { id }, data: { displayOrder: index } }),
    ),
  );
  return prisma.aboutFeature.findMany({ orderBy: { displayOrder: 'asc' } });
}

/* ─── Team ─── */
export async function createTeamMember(input: {
  name: string;
  role: string;
  rating?: number;
  displayOrder?: number;
  active?: boolean;
}) {
  return prisma.teamMember.create({
    data: {
      name: sanitizeString(input.name),
      role: sanitizeString(input.role),
      rating: Math.min(5, Math.max(1, Number(input.rating ?? 5))),
      displayOrder: input.displayOrder ?? (await nextOrder('teamMember')),
      active: input.active ?? true,
    },
  });
}

export async function updateTeamMember(
  id: string,
  input: Partial<{ name: string; role: string; rating: number; displayOrder: number; active: boolean }>,
) {
  const existing = await prisma.teamMember.findUnique({ where: { id } });
  if (!existing) throw new AppError(404, 'Team member not found');
  return prisma.teamMember.update({
    where: { id },
    data: {
      ...(input.name !== undefined ? { name: sanitizeString(input.name) } : {}),
      ...(input.role !== undefined ? { role: sanitizeString(input.role) } : {}),
      ...(input.rating !== undefined ? { rating: Math.min(5, Math.max(1, Number(input.rating))) } : {}),
      ...(input.displayOrder !== undefined ? { displayOrder: input.displayOrder } : {}),
      ...(input.active !== undefined ? { active: input.active } : {}),
    },
  });
}

export async function deleteTeamMember(id: string) {
  const existing = await prisma.teamMember.findUnique({ where: { id } });
  if (!existing) throw new AppError(404, 'Team member not found');
  await prisma.teamMember.delete({ where: { id } });
  await deleteStoredFile(existing.imagePath);
  return { id };
}

export async function uploadTeamImage(id: string, file: Express.Multer.File) {
  const existing = await prisma.teamMember.findUnique({ where: { id } });
  if (!existing) throw new AppError(404, 'Team member not found');
  const uploaded = await uploadBuffer(file, 'about/team');
  await deleteStoredFile(existing.imagePath);
  return prisma.teamMember.update({
    where: { id },
    data: { imageUrl: uploaded.imageUrl, imagePath: uploaded.storagePath },
  });
}

export async function reorderTeam(orderedIds: string[]) {
  await prisma.$transaction(
    orderedIds.map((id, index) =>
      prisma.teamMember.update({ where: { id }, data: { displayOrder: index } }),
    ),
  );
  return prisma.teamMember.findMany({ orderBy: { displayOrder: 'asc' } });
}

/* ─── Stories ─── */
export async function createStory(input: {
  title: string;
  subtitle?: string;
  body: string;
  displayOrder?: number;
  active?: boolean;
}) {
  return prisma.aboutStory.create({
    data: {
      title: sanitizeString(input.title),
      subtitle: sanitizeOptional(input.subtitle),
      body: sanitizeString(input.body),
      displayOrder: input.displayOrder ?? (await nextOrder('aboutStory')),
      active: input.active ?? true,
    },
  });
}

export async function updateStory(
  id: string,
  input: Partial<{ title: string; subtitle?: string; body: string; displayOrder: number; active: boolean }>,
) {
  const existing = await prisma.aboutStory.findUnique({ where: { id } });
  if (!existing) throw new AppError(404, 'Story not found');
  return prisma.aboutStory.update({
    where: { id },
    data: {
      ...(input.title !== undefined ? { title: sanitizeString(input.title) } : {}),
      ...(input.subtitle !== undefined ? { subtitle: sanitizeOptional(input.subtitle) } : {}),
      ...(input.body !== undefined ? { body: sanitizeString(input.body) } : {}),
      ...(input.displayOrder !== undefined ? { displayOrder: input.displayOrder } : {}),
      ...(input.active !== undefined ? { active: input.active } : {}),
    },
  });
}

export async function deleteStory(id: string) {
  const existing = await prisma.aboutStory.findUnique({ where: { id } });
  if (!existing) throw new AppError(404, 'Story not found');
  await prisma.aboutStory.delete({ where: { id } });
  await deleteStoredFile(existing.imagePath);
  return { id };
}

export async function uploadStoryImage(id: string, file: Express.Multer.File) {
  const existing = await prisma.aboutStory.findUnique({ where: { id } });
  if (!existing) throw new AppError(404, 'Story not found');
  const uploaded = await uploadBuffer(file, 'about/stories');
  await deleteStoredFile(existing.imagePath);
  return prisma.aboutStory.update({
    where: { id },
    data: { imageUrl: uploaded.imageUrl, imagePath: uploaded.storagePath },
  });
}

export async function reorderStories(orderedIds: string[]) {
  await prisma.$transaction(
    orderedIds.map((id, index) =>
      prisma.aboutStory.update({ where: { id }, data: { displayOrder: index } }),
    ),
  );
  return prisma.aboutStory.findMany({ orderBy: { displayOrder: 'asc' } });
}
