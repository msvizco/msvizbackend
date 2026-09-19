import { prisma } from '../config/prisma';
import { sanitizeOptional, sanitizeString } from '../utils/sanitize';
import { deleteStoredFile, storagePathFromPublicUrl, uploadBuffer } from './storage.service';

const PUBLIC_FIELDS = {
  id: true,
  companyName: true,
  logoUrl: true,
  email: true,
  phone: true,
  whatsapp: true,
  address: true,
  facebook: true,
  instagram: true,
  linkedin: true,
  youtube: true,
  websiteDescription: true,
  heroHeading: true,
  heroSubtitle: true,
  heroImageUrl: true,
  aboutIntro: true,
  vision: true,
  mission: true,
  philosophy: true,
  differentiators: true,
  yearsExperience: true,
  projectsCompleted: true,
  clientsServed: true,
  awardsWon: true,
  whoImageUrl: true,
  missionImageUrl: true,
  visionImageUrl: true,
  aboutHeadline: true,
  updatedAt: true,
} as const;

export async function getSettings(admin = false) {
  const settings = await prisma.siteSetting.findUnique({
    where: { id: 'default' },
    select: admin ? undefined : PUBLIC_FIELDS,
  });
  return settings;
}

export async function updateSettings(input: Record<string, unknown>) {
  const stringFields = [
    'companyName',
    'email',
    'phone',
    'whatsapp',
    'address',
    'facebook',
    'instagram',
    'linkedin',
    'youtube',
    'websiteDescription',
    'heroHeading',
    'heroSubtitle',
    'aboutIntro',
    'vision',
    'mission',
    'philosophy',
    'differentiators',
    'aboutHeadline',
  ];

  const data: Record<string, unknown> = {};
  for (const key of stringFields) {
    if (input[key] !== undefined) {
      data[key] = key.includes('Url') || ['facebook', 'instagram', 'linkedin', 'youtube'].includes(key)
        ? sanitizeOptional(input[key] as string) ?? null
        : sanitizeString(String(input[key] ?? ''));
    }
  }

  for (const key of ['yearsExperience', 'projectsCompleted', 'clientsServed', 'awardsWon']) {
    if (input[key] !== undefined) data[key] = Number(input[key]);
  }

  return prisma.siteSetting.upsert({
    where: { id: 'default' },
    update: data,
    create: {
      id: 'default',
      companyName: String(data.companyName || 'MSVIZ'),
      email: String(data.email || 'hello@msviz.com'),
      phone: String(data.phone || ''),
      address: String(data.address || ''),
      websiteDescription: String(data.websiteDescription || ''),
      heroHeading: String(data.heroHeading || 'Architecture Beyond Imagination'),
      heroSubtitle: String(data.heroSubtitle || '3D Visualization • Interior Design • Exterior Design • Floor Planning'),
      ...data,
    },
  });
}

export async function uploadLogo(file: Express.Multer.File) {
  const existing = await prisma.siteSetting.findUnique({ where: { id: 'default' } });
  const uploaded = await uploadBuffer(file, 'site');
  if (existing?.logoPath) await deleteStoredFile(existing.logoPath);

  return prisma.siteSetting.upsert({
    where: { id: 'default' },
    update: { logoUrl: uploaded.imageUrl, logoPath: uploaded.storagePath },
    create: {
      id: 'default',
      companyName: 'MSVIZ',
      email: 'hello@msviz.com',
      phone: '',
      address: '',
      websiteDescription: '',
      heroHeading: 'Architecture Beyond Imagination',
      heroSubtitle: '3D Visualization • Interior Design • Exterior Design • Floor Planning',
      logoUrl: uploaded.imageUrl,
      logoPath: uploaded.storagePath,
    },
  });
}

export async function uploadHeroImage(file: Express.Multer.File) {
  const existing = await prisma.siteSetting.findUnique({ where: { id: 'default' } });
  const uploaded = await uploadBuffer(file, 'site/hero');

  const oldPath =
    existing?.heroImagePath || storagePathFromPublicUrl(existing?.heroImageUrl || undefined);
  if (oldPath && oldPath !== uploaded.storagePath) {
    await deleteStoredFile(oldPath);
  }

  return prisma.siteSetting.upsert({
    where: { id: 'default' },
    update: { heroImageUrl: uploaded.imageUrl, heroImagePath: uploaded.storagePath },
    create: {
      id: 'default',
      companyName: 'MSVIZ',
      email: 'hello@msviz.com',
      phone: '',
      address: '',
      websiteDescription: '',
      heroHeading: 'Architecture Beyond Imagination',
      heroSubtitle: '3D Visualization • Interior Design • Exterior Design • Floor Planning',
      heroImageUrl: uploaded.imageUrl,
      heroImagePath: uploaded.storagePath,
    },
  });
}

type PanelImageKey = 'who' | 'mission' | 'vision';

const PANEL_FIELDS: Record<PanelImageKey, { url: 'whoImageUrl' | 'missionImageUrl' | 'visionImageUrl'; path: 'whoImagePath' | 'missionImagePath' | 'visionImagePath' }> = {
  who: { url: 'whoImageUrl', path: 'whoImagePath' },
  mission: { url: 'missionImageUrl', path: 'missionImagePath' },
  vision: { url: 'visionImageUrl', path: 'visionImagePath' },
};

export async function uploadPanelImage(panel: PanelImageKey, file: Express.Multer.File) {
  const fields = PANEL_FIELDS[panel];
  if (!fields) throw new Error('Invalid panel');

  const existing = await prisma.siteSetting.findUnique({ where: { id: 'default' } });
  const uploaded = await uploadBuffer(file, `site/${panel}`);
  const oldPath = existing?.[fields.path];
  if (oldPath) await deleteStoredFile(oldPath);

  return prisma.siteSetting.upsert({
    where: { id: 'default' },
    update: {
      [fields.url]: uploaded.imageUrl,
      [fields.path]: uploaded.storagePath,
    },
    create: {
      id: 'default',
      companyName: 'MSVIZ',
      email: 'hello@msviz.com',
      phone: '',
      address: '',
      websiteDescription: '',
      heroHeading: 'Architecture Beyond Imagination',
      heroSubtitle: '3D Visualization • Interior Design • Exterior Design • Floor Planning',
      [fields.url]: uploaded.imageUrl,
      [fields.path]: uploaded.storagePath,
    },
  });
}

export async function listTestimonials() {
  return prisma.testimonial.findMany({
    where: { active: true },
    orderBy: { createdAt: 'desc' },
  });
}

export async function listFaqs() {
  return prisma.faq.findMany({
    where: { active: true },
    orderBy: { displayOrder: 'asc' },
  });
}
