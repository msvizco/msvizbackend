import { Request } from 'express';
import { AppError } from './AppError';

export function param(req: Request, name: string): string {
  const value = req.params[name];
  if (Array.isArray(value)) return value[0];
  if (!value) throw new AppError(400, `Missing parameter: ${name}`);
  return value;
}

export function queryString(req: Request, name: string): string | undefined {
  const value = req.query[name];
  if (Array.isArray(value)) return String(value[0]);
  if (typeof value === 'string') return value;
  return undefined;
}
