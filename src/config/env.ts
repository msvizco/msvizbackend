import dotenv from 'dotenv';

dotenv.config();

const nodeEnv = process.env.NODE_ENV ?? 'development';
const isProd = nodeEnv === 'production';
const isVercel = Boolean(process.env.VERCEL);

function resolveAllowedOrigins(): string[] {
  const fromList = process.env.ALLOWED_ORIGINS?.split(',').map((o) => o.trim()).filter(Boolean);
  const primary = process.env.FRONTEND_URL?.trim();
  const origins = new Set<string>();

  if (fromList?.length) fromList.forEach((o) => origins.add(o));
  if (primary) origins.add(primary);

  if (!isProd) {
    origins.add('http://localhost:5173');
    origins.add('http://127.0.0.1:5173');
  }

  if (!origins.size && primary) origins.add(primary);
  if (!origins.size) origins.add('http://localhost:5173');

  return [...origins];
}

export const env = {
  nodeEnv,
  isProd,
  isVercel,
  port: Number(process.env.PORT ?? 5000),
  databaseUrl: process.env.DATABASE_URL ?? '',
  jwtSecret: process.env.JWT_SECRET ?? '',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
  supabaseUrl: process.env.SUPABASE_URL ?? '',
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? '',
  supabaseBucket: process.env.SUPABASE_STORAGE_BUCKET ?? 'msviz-images',
  frontendUrl: process.env.FRONTEND_URL ?? 'http://localhost:5173',
  allowedOrigins: resolveAllowedOrigins(),
  adminEmail: process.env.ADMIN_EMAIL ?? 'admin@msviz.com',
  adminPassword: process.env.ADMIN_PASSWORD ?? 'Admin@MSVIZ2026',
  adminName: process.env.ADMIN_NAME ?? 'MSVIZ Admin',
  maxFileSizeMb: Number(process.env.MAX_FILE_SIZE_MB ?? 10),
};

export function getMissingEnvVars(): string[] {
  const missing: string[] = [];
  if (!env.databaseUrl) missing.push('DATABASE_URL');
  if (!env.jwtSecret) missing.push('JWT_SECRET');
  return missing;
}

export function assertRuntimeEnv() {
  const missing = getMissingEnvVars();
  if (missing.length) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}
