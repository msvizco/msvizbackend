import dotenv from 'dotenv';

dotenv.config();

function required(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? 5000),
  databaseUrl: required('DATABASE_URL', 'postgresql://postgres:postgres@localhost:5432/msviz?schema=public'),
  jwtSecret: required('JWT_SECRET', 'dev-only-change-me'),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
  supabaseUrl: process.env.SUPABASE_URL ?? '',
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? '',
  supabaseBucket: process.env.SUPABASE_STORAGE_BUCKET ?? 'msviz-images',
  frontendUrl: process.env.FRONTEND_URL ?? 'http://localhost:5173',
  adminEmail: process.env.ADMIN_EMAIL ?? 'admin@msviz.com',
  adminPassword: process.env.ADMIN_PASSWORD ?? 'Admin@MSVIZ2026',
  adminName: process.env.ADMIN_NAME ?? 'MSVIZ Admin',
  maxFileSizeMb: Number(process.env.MAX_FILE_SIZE_MB ?? 10),
  isProd: (process.env.NODE_ENV ?? 'development') === 'production',
};
