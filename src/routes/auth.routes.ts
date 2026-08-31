import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { loginValidator } from '../validators/auth.validator';
import { validate } from '../middleware/validate';
import { requireAuth } from '../middleware/auth';
import { authLimiter } from '../middleware/rateLimiter';

const router = Router();

router.post('/login', authLimiter, loginValidator, validate, authController.login);
router.get('/me', requireAuth, authController.me);

export default router;
