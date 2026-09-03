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

  if (err instanceof AppError) {
    if (env.isProd && err.statusCode >= 500) {
      console.error('[AppError]', err.statusCode, err.message, err.details ?? '');
    }
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(err.details ? { details: err.details } : {}),
      ...(!env.isProd && err.stack ? { stack: err.stack } : {}),
    });
    return;
  }

  const error = err as Error & { statusCode?: number; details?: unknown };
  const statusCode = error.statusCode || 500;
  console.error(err);

  res.status(statusCode).json({
    success: false,
    message: env.isProd ? 'Internal server error' : error.message || 'Internal server error',
    ...(error.details ? { details: error.details } : {}),
    ...(!env.isProd && error.stack ? { stack: error.stack } : {}),
  });
}

export function notFound(_req: Request, _res: Response, next: NextFunction) {
  next(new AppError(404, 'Route not found'));
}
