import { Router } from 'express';
import * as projectController from '../controllers/project.controller';
import { requireAuth } from '../middleware/auth';
import { validate } from '../middleware/validate';
import {
  idParamValidator,
  projectBodyValidator,
  projectQueryValidator,
  slugParamValidator,
} from '../validators/project.validator';

const router = Router();

router.get('/', projectQueryValidator, validate, projectController.listPublic);
router.get('/:slug', slugParamValidator, validate, projectController.getBySlug);

router.post('/', requireAuth, projectBodyValidator, validate, projectController.create);
router.put('/:id', requireAuth, idParamValidator, projectBodyValidator, validate, projectController.update);
router.delete('/:id', requireAuth, idParamValidator, validate, projectController.remove);

export default router;
