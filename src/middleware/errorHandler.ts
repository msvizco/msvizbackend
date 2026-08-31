import { NextFunction, Request, Response } from 'express';
import multer from 'multer';
import { AppError } from '../utils/AppError';
import { env } from '../config/env';

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof multer.MulterError) {
    const message =
      err.code === 'LIMIT_FILE_SIZE'
        ? `File too large. Maximum size is ${env.maxFileSizeMb}MB.`
        : err.message;
    res.status(400).json({ success: false, message });
    return;
  }

  const error = err as AppError & { code?: string; errors?: unknown };
  const statusCode = error.statusCode || 500;
  const message =
    statusCode === 500 && env.isProd ? 'Internal server error' : error.message || 'Internal server error';

  if (!env.isProd) {
    console.error(err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(error.details ? { details: error.details } : {}),
    ...(!env.isProd && error.stack ? { stack: error.stack } : {}),
  });
}

export function notFound(_req: Request, _res: Response, next: NextFunction) {
  next(new AppError(404, 'Route not found'));
}
