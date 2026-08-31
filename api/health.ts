import type { VercelRequest, VercelResponse } from '@vercel/node';

function getMissingEnvVars(): string[] {
  const missing: string[] = [];
  if (!process.env.DATABASE_URL) missing.push('DATABASE_URL');
  if (!process.env.JWT_SECRET) missing.push('JWT_SECRET');
  return missing;
}

export default function handler(_req: VercelRequest, res: VercelResponse) {
  const missing = getMissingEnvVars();

  res.status(missing.length ? 503 : 200).json({
    success: missing.length === 0,
    service: 'msviz-api',
    status: missing.length ? 'misconfigured' : 'ok',
    env: process.env.VERCEL ? 'vercel' : 'node',
    ...(missing.length ? { missing } : {}),
  });
}
