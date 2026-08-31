import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import * as contactService from '../services/contact.service';
import { created, ok } from '../utils/apiResponse';
import { MessageStatus } from '../utils/constants';
import { param } from '../utils/params';

export const create = asyncHandler(async (req: Request, res: Response) => {
  const message = await contactService.createMessage(req.body);
  return created(res, { id: message.id }, 'Message sent');
});

export const list = asyncHandler(async (req: Request, res: Response) => {
  const messages = await contactService.listMessages(req.query.status as string | undefined);
  return ok(res, messages);
});

export const getById = asyncHandler(async (req: Request, res: Response) => {
  const message = await contactService.getMessage(param(req, 'id'));
  return ok(res, message);
});

export const updateStatus = asyncHandler(async (req: Request, res: Response) => {
  const message = await contactService.updateMessageStatus(param(req, 'id'), req.body.status as MessageStatus);
  return ok(res, message, 'Message updated');
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  const result = await contactService.deleteMessage(param(req, 'id'));
  return ok(res, result, 'Message deleted');
});
