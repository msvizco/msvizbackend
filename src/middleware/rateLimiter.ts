import { RequestHandler } from 'express';
import rateLimit from 'express-rate-limit';
import { env } from '../config/env';

const passthrough: RequestHandler = (_req, _res, next) => next();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
});

export const authLimiter = env.isVercel
  ? passthrough
  : rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 20,
      standardHeaders: true,
      legacyHeaders: false,
      message: { success: false, message: 'Too many login attempts. Try again later.' },
    });

export const contactLimiter = env.isVercel
  ? passthrough
  : rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 10,
      standardHeaders: true,
      legacyHeaders: false,
      message: { success: false, message: 'Too many contact submissions. Try again later.' },
    });

export const apiLimiter = env.isVercel ? passthrough : limiter;
