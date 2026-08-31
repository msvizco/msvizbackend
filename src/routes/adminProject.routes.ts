import { Router } from 'express';
import * as projectController from '../controllers/project.controller';
import { requireAuth } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { upload } from '../middleware/upload';
import { idParamValidator, projectBodyValidator, projectQueryValidator } from '../validators/project.validator';

const router = Router();

router.use(requireAuth);

router.get('/', projectQueryValidator, validate, projectController.listAdmin);
router.get('/:id', idParamValidator, validate, projectController.getById);
router.post('/', projectBodyValidator, validate, projectController.create);
router.put('/:id', idParamValidator, projectBodyValidator, validate, projectController.update);
router.delete('/:id', idParamValidator, validate, projectController.remove);
router.patch('/:id/:field', idParamValidator, validate, projectController.toggle);

router.post('/:id/cover', idParamValidator, validate, upload.single('image'), projectController.uploadCover);
router.post('/:id/images', idParamValidator, validate, upload.array('images', 20), projectController.uploadGallery);
router.put('/:id/images/reorder', idParamValidator, validate, projectController.reorderImages);
router.put('/:id/images/:imageId', idParamValidator, validate, projectController.updateImage);
router.delete('/:id/images/:imageId', idParamValidator, validate, projectController.deleteImage);

export default router;
