import xss from 'xss';

export function sanitizeString(value: unknown): string {
  if (typeof value !== 'string') return '';
  return xss(value.trim());
}

export function sanitizeOptional(value: unknown): string | undefined {
  if (value === undefined || value === null || value === '') return undefined;
  return sanitizeString(value);
}
