import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import * as authService from '../services/auth.service';
import { ok } from '../utils/apiResponse';

export const login = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.login(req.body.email, req.body.password);
  return ok(res, result, 'Logged in');
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  const user = await authService.getMe(req.user!.id);
  return ok(res, user);
});
