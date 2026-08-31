import { Router } from 'express';
import * as serviceController from '../controllers/service.controller';
import { requireAuth } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { upload } from '../middleware/upload';
import { serviceBodyValidator } from '../validators/service.validator';
import { idParamValidator, slugParamValidator } from '../validators/project.validator';

const publicRouter = Router();
publicRouter.get('/', serviceController.listPublic);
publicRouter.get('/:slug', slugParamValidator, validate, serviceController.getBySlug);

const adminRouter = Router();
adminRouter.use(requireAuth);
adminRouter.get('/', serviceController.listAdmin);
adminRouter.get('/:id', idParamValidator, validate, serviceController.getById);
adminRouter.post('/', serviceBodyValidator, validate, serviceController.create);
adminRouter.put('/:id', idParamValidator, serviceBodyValidator, validate, serviceController.update);
adminRouter.delete('/:id', idParamValidator, validate, serviceController.remove);
adminRouter.patch('/:id/toggle', idParamValidator, validate, serviceController.toggle);
adminRouter.post('/:id/image', idParamValidator, validate, upload.single('image'), serviceController.uploadImage);
adminRouter.delete('/:id/image', idParamValidator, validate, serviceController.deleteImage);

export { publicRouter as serviceRoutes, adminRouter as adminServiceRoutes };
