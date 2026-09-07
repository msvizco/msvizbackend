import multer from 'multer';
import path from 'path';
import { env } from '../config/env';
import {
  ALLOWED_EXTENSIONS,
  ALLOWED_GALLERY_EXTENSIONS,
  ALLOWED_GALLERY_MIME_TYPES,
  ALLOWED_MIME_TYPES,
  isVideoMime,
  normalizeImageMime,
} from '../utils/constants';
import { AppError } from '../utils/AppError';

const storage = multer.memoryStorage();

function imageFileFilter(_req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) {
  const ext = path.extname(file.originalname).toLowerCase();
  const mime = normalizeImageMime(file.mimetype);
  file.mimetype = mime || file.mimetype;

  const mimeOk = Boolean(mime && ALLOWED_MIME_TYPES.includes(mime));
  const extOk = ALLOWED_EXTENSIONS.includes(ext);

  // Accept when either mime or extension is valid (Windows/some browsers send odd MIME for PNG).
  if (!mimeOk && !extOk) {
    return cb(new AppError(400, 'Only JPG, JPEG, PNG, and WEBP images are allowed'));
  }

  if (!mime && extOk) {
    if (ext === '.png') file.mimetype = 'image/png';
    else if (ext === '.webp') file.mimetype = 'image/webp';
    else file.mimetype = 'image/jpeg';
  }

  cb(null, true);
}

function galleryFileFilter(_req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) {
  const ext = path.extname(file.originalname).toLowerCase();
  const mime = normalizeImageMime(file.mimetype) || file.mimetype.toLowerCase();
  file.mimetype = mime;

  const mimeOk = ALLOWED_GALLERY_MIME_TYPES.includes(mime) || ALLOWED_MIME_TYPES.includes(mime);
  const extOk = ALLOWED_GALLERY_EXTENSIONS.includes(ext);

  if (!mimeOk && !extOk) {
    return cb(new AppError(400, 'Only JPG, PNG, WEBP images and MP4, WEBM, MOV videos are allowed'));
  }

  if (!ALLOWED_GALLERY_MIME_TYPES.includes(file.mimetype) && extOk) {
    if (ext === '.png') file.mimetype = 'image/png';
    else if (ext === '.webp') file.mimetype = 'image/webp';
    else if (ext === '.mp4') file.mimetype = 'video/mp4';
    else if (ext === '.webm') file.mimetype = 'video/webm';
    else if (ext === '.mov') file.mimetype = 'video/quicktime';
    else file.mimetype = 'image/jpeg';
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
