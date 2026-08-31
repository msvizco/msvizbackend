import multer from 'multer';
import path from 'path';
import { env } from '../config/env';
import {
  ALLOWED_EXTENSIONS,
  ALLOWED_GALLERY_EXTENSIONS,
  ALLOWED_GALLERY_MIME_TYPES,
  ALLOWED_MIME_TYPES,
  isVideoMime,
} from '../utils/constants';
import { AppError } from '../utils/AppError';

const storage = multer.memoryStorage();

function imageFileFilter(_req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) {
  const ext = path.extname(file.originalname).toLowerCase();
  if (!ALLOWED_MIME_TYPES.includes(file.mimetype) || !ALLOWED_EXTENSIONS.includes(ext)) {
    return cb(new AppError(400, 'Only JPG, JPEG, PNG, and WEBP images are allowed'));
  }
  cb(null, true);
}

function galleryFileFilter(_req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) {
  const ext = path.extname(file.originalname).toLowerCase();
  if (!ALLOWED_GALLERY_MIME_TYPES.includes(file.mimetype) || !ALLOWED_GALLERY_EXTENSIONS.includes(ext)) {
    return cb(new AppError(400, 'Only JPG, PNG, WEBP images and MP4, WEBM, MOV videos are allowed'));
  }
  cb(null, true);
}

export const upload = multer({
  storage,
  fileFilter: imageFileFilter,
  limits: { fileSize: env.maxFileSizeMb * 1024 * 1024, files: 20 },
});

export const uploadGallery = multer({
  storage,
  fileFilter: galleryFileFilter,
  limits: {
    fileSize: Math.max(env.maxFileSizeMb, env.maxVideoSizeMb) * 1024 * 1024,
    files: 20,
  },
});

export function getMediaType(mime: string): 'image' | 'video' {
  return isVideoMime(mime) ? 'video' : 'image';
}
