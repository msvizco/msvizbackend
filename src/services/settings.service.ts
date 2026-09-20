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
  ctaBackgroundImageUrl: true,
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
  homeWhoIntro: true,
  homeWhoSecondary: true,
  homeMission: true,
  homeMissionSecondary: true,
  homeVision: true,
  homeVisionSecondary: true,
  homeWhoImageUrl: true,
  homeMissionImageUrl: true,
  homeVisionImageUrl: true,
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
    'homeWhoIntro',
    'homeWhoSecondary',
    'homeMission',
    'homeMissionSecondary',
    'homeVision',
    'homeVisionSecondary',
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

export async function uploadCtaBackgroundImage(file: Express.Multer.File) {
  const existing = await prisma.siteSetting.findUnique({ where: { id: 'default' } });
  const uploaded = await uploadBuffer(file, 'site/cta');

  const oldPath =
    existing?.ctaBackgroundImagePath ||
    storagePathFromPublicUrl(existing?.ctaBackgroundImageUrl || undefined);
  if (oldPath && oldPath !== uploaded.storagePath) {
    await deleteStoredFile(oldPath);
  }

  return prisma.siteSetting.upsert({
    where: { id: 'default' },
    update: {
      ctaBackgroundImageUrl: uploaded.imageUrl,
      ctaBackgroundImagePath: uploaded.storagePath,
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
      ctaBackgroundImageUrl: uploaded.imageUrl,
      ctaBackgroundImagePath: uploaded.storagePath,
    },
  });
}

/** About page panels: who | mission | vision. Home panels: home-who | home-mission | home-vision */
export type PanelImageKey = 'who' | 'mission' | 'vision' | 'home-who' | 'home-mission' | 'home-vision';

const PANEL_FIELDS: Record<
  PanelImageKey,
  {
    url:
      | 'whoImageUrl'
      | 'missionImageUrl'
      | 'visionImageUrl'
      | 'homeWhoImageUrl'
      | 'homeMissionImageUrl'
      | 'homeVisionImageUrl';
    path:
      | 'whoImagePath'
      | 'missionImagePath'
      | 'visionImagePath'
      | 'homeWhoImagePath'
      | 'homeMissionImagePath'
      | 'homeVisionImagePath';
    folder: string;
  }
> = {
  who: { url: 'whoImageUrl', path: 'whoImagePath', folder: 'site/who' },
  mission: { url: 'missionImageUrl', path: 'missionImagePath', folder: 'site/mission' },
  vision: { url: 'visionImageUrl', path: 'visionImagePath', folder: 'site/vision' },
  'home-who': { url: 'homeWhoImageUrl', path: 'homeWhoImagePath', folder: 'site/home-who' },
  'home-mission': { url: 'homeMissionImageUrl', path: 'homeMissionImagePath', folder: 'site/home-mission' },
  'home-vision': { url: 'homeVisionImageUrl', path: 'homeVisionImagePath', folder: 'site/home-vision' },
};

export const PANEL_IMAGE_KEYS = Object.keys(PANEL_FIELDS) as PanelImageKey[];

export async function uploadPanelImage(panel: PanelImageKey, file: Express.Multer.File) {
  const fields = PANEL_FIELDS[panel];
  if (!fields) throw new Error('Invalid panel');

  const existing = await prisma.siteSetting.findUnique({ where: { id: 'default' } });
  const uploaded = await uploadBuffer(file, fields.folder);
  const oldPath =
    existing?.[fields.path] || storagePathFromPublicUrl(existing?.[fields.url] || undefined);
  if (oldPath && oldPath !== uploaded.storagePath) {
    await deleteStoredFile(oldPath);
  }

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
