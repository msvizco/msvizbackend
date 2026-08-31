import multer from 'multer';
import path from 'path';
import { env } from '../config/env';
import { ALLOWED_EXTENSIONS, ALLOWED_MIME_TYPES } from '../utils/constants';
import { AppError } from '../utils/AppError';

const storage = multer.memoryStorage();

function fileFilter(_req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) {
  const ext = path.extname(file.originalname).toLowerCase();
  if (!ALLOWED_MIME_TYPES.includes(file.mimetype) || !ALLOWED_EXTENSIONS.includes(ext)) {
    return cb(new AppError(400, 'Only JPG, JPEG, PNG, and WEBP images are allowed'));
  }
  cb(null, true);
}

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: env.maxFileSizeMb * 1024 * 1024, files: 20 },
});
