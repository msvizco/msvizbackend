import { prisma } from '../config/prisma';
import { AppError } from '../utils/AppError';
import { sanitizeOptional, sanitizeString } from '../utils/sanitize';
import { MESSAGE_STATUSES, MessageStatus } from '../utils/constants';

export async function createMessage(input: {
  name: string;
  email: string;
  phone?: string;
  service?: string;
  message: string;
}) {
  return prisma.contactMessage.create({
    data: {
      name: sanitizeString(input.name),
      email: sanitizeString(input.email).toLowerCase(),
      phone: sanitizeOptional(input.phone),
      service: sanitizeOptional(input.service),
      message: sanitizeString(input.message),
      status: 'new',
    },
  });
}

export async function listMessages(status?: string) {
  return prisma.contactMessage.findMany({
    where: status ? { status } : {},
    orderBy: { createdAt: 'desc' },
  });
}

export async function getMessage(id: string) {
  const message = await prisma.contactMessage.findUnique({ where: { id } });
  if (!message) throw new AppError(404, 'Message not found');
  return message;
}

export async function updateMessageStatus(id: string, status: MessageStatus) {
  if (!MESSAGE_STATUSES.includes(status)) {
    throw new AppError(400, 'Invalid status');
  }
  const message = await prisma.contactMessage.findUnique({ where: { id } });
  if (!message) throw new AppError(404, 'Message not found');
  return prisma.contactMessage.update({ where: { id }, data: { status } });
}

export async function deleteMessage(id: string) {
  const message = await prisma.contactMessage.findUnique({ where: { id } });
  if (!message) throw new AppError(404, 'Message not found');
  await prisma.contactMessage.delete({ where: { id } });
  return { id };
}
