export const PROJECT_CATEGORIES = [
  'interior',
  'exterior',
  'visualization',
  'floor-plans',
  'residential',
  'commercial',
  'other',
] as const;

export const PROJECT_STATUSES = ['concept', 'in-progress', 'completed'] as const;

export const MESSAGE_STATUSES = ['new', 'read', 'replied', 'archived'] as const;

export const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];

export const ALLOWED_VIDEO_MIME_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'];

export const ALLOWED_VIDEO_EXTENSIONS = ['.mp4', '.webm', '.mov'];

export const ALLOWED_GALLERY_MIME_TYPES = [...ALLOWED_MIME_TYPES, ...ALLOWED_VIDEO_MIME_TYPES];

export const ALLOWED_GALLERY_EXTENSIONS = [...ALLOWED_EXTENSIONS, ...ALLOWED_VIDEO_EXTENSIONS];

export function isVideoMime(mime: string): boolean {
  return ALLOWED_VIDEO_MIME_TYPES.includes(mime);
}

export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number];
export type ProjectStatus = (typeof PROJECT_STATUSES)[number];
export type MessageStatus = (typeof MESSAGE_STATUSES)[number];
