import { Router } from 'express';
import * as contactController from '../controllers/contact.controller';
import { requireAuth } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { contactLimiter } from '../middleware/rateLimiter';
import { contactBodyValidator, messageStatusValidator } from '../validators/contact.validator';
import { idParamValidator } from '../validators/project.validator';

const publicRouter = Router();
publicRouter.post('/', contactLimiter, contactBodyValidator, validate, contactController.create);

const adminRouter = Router();
adminRouter.use(requireAuth);
adminRouter.get('/', contactController.list);
adminRouter.get('/:id', idParamValidator, validate, contactController.getById);
adminRouter.put('/:id', idParamValidator, messageStatusValidator, validate, contactController.updateStatus);
adminRouter.delete('/:id', idParamValidator, validate, contactController.remove);

export { publicRouter as contactRoutes, adminRouter as adminContactRoutes };
