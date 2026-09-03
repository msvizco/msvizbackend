import path from 'path';
import { randomUUID } from 'crypto';
import { getSupabase, isSupabaseConfigured } from '../config/supabase';
import { env } from '../config/env';
import { AppError } from '../utils/AppError';

export interface UploadedImage {
  imageUrl: string;
  storagePath: string;
}

export async function uploadBuffer(
  file: Express.Multer.File,
  folder: string,
): Promise<UploadedImage> {
  if (!isSupabaseConfigured()) {
    throw new AppError(
      503,
      'Image storage is not configured. Set SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, and SUPABASE_STORAGE_BUCKET.',
    );
  }

  const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
  const storagePath = `${folder}/${randomUUID()}${ext}`;
  const supabase = getSupabase();

  if (!file?.buffer?.length) {
    throw new AppError(400, 'Uploaded file is empty or could not be read');
  }

  const { error } = await supabase.storage.from(env.supabaseBucket).upload(storagePath, file.buffer, {
    contentType: file.mimetype,
    upsert: false,
  });

  if (error) {
    console.error('[storage.upload]', {
      bucket: env.supabaseBucket,
      path: storagePath,
      mime: file.mimetype,
      size: file.buffer.length,
      message: error.message,
      name: error.name,
    });
    throw new AppError(
      502,
      `Image upload failed (${env.supabaseBucket}): ${error.message}`,
    );
  }

  const { data } = supabase.storage.from(env.supabaseBucket).getPublicUrl(storagePath);
  return { imageUrl: data.publicUrl, storagePath };
}

export async function deleteStoredFile(storagePath: string | null | undefined): Promise<void> {
  if (!storagePath || storagePath.startsWith('seed/') || storagePath.startsWith('http')) return;
  if (!isSupabaseConfigured()) return;

  const supabase = getSupabase();
  const { error } = await supabase.storage.from(env.supabaseBucket).remove([storagePath]);
  if (error) {
    console.error('Failed to delete storage file:', storagePath, error.message);
  }
}

export async function deleteStoredFiles(paths: (string | null | undefined)[]): Promise<void> {
  const valid = paths.filter((p): p is string => Boolean(p) && !p!.startsWith('seed/') && !p!.startsWith('http'));
  if (!valid.length || !isSupabaseConfigured()) return;

  const supabase = getSupabase();
  const { error } = await supabase.storage.from(env.supabaseBucket).remove(valid);
  if (error) {
    console.error('Failed to delete storage files:', error.message);
  }
}
