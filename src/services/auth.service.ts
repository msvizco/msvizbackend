import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { prisma } from '../config/prisma';
import { env } from '../config/env';
import { AppError } from '../utils/AppError';

export async function login(email: string, password: string) {
  const admin = await prisma.adminUser.findUnique({ where: { email: email.toLowerCase() } });
  if (!admin) {
    throw new AppError(401, 'Invalid email or password');
  }

  const match = await bcrypt.compare(password, admin.password);
  if (!match) {
    throw new AppError(401, 'Invalid email or password');
  }

  const token = jwt.sign({ id: admin.id, email: admin.email }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  } as SignOptions);

  return {
    token,
    user: { id: admin.id, email: admin.email, name: admin.name },
  };
}

export async function getMe(id: string) {
  const admin = await prisma.adminUser.findUnique({
    where: { id },
    select: { id: true, email: true, name: true, createdAt: true },
  });
  if (!admin) {
    throw new AppError(404, 'Admin user not found');
  }
  return admin;
}
