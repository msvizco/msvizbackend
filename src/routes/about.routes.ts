import { Router } from 'express';
import * as aboutController from '../controllers/about.controller';
import { requireAuth } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { upload } from '../middleware/upload';
import { idParamValidator } from '../validators/project.validator';
import { body } from 'express-validator';

const featureBody = [
  body('title').isString().trim().isLength({ min: 2, max: 120 }),
  body('description').isString().trim().isLength({ min: 5 }),
  body('linkUrl').optional({ nullable: true }).isString(),
  body('displayOrder').optional().isInt().toInt(),
  body('active').optional().isBoolean().toBoolean(),
];

const teamBody = [
  body('name').isString().trim().isLength({ min: 2, max: 120 }),
  body('role').isString().trim().isLength({ min: 2, max: 120 }),
  body('rating').optional().isInt({ min: 1, max: 5 }).toInt(),
  body('displayOrder').optional().isInt().toInt(),
  body('active').optional().isBoolean().toBoolean(),
];

const storyBody = [
  body('title').isString().trim().isLength({ min: 2, max: 200 }),
  body('subtitle').optional({ nullable: true }).isString(),
  body('body').isString().trim().isLength({ min: 5 }),
  body('displayOrder').optional().isInt().toInt(),
  body('active').optional().isBoolean().toBoolean(),
];

const publicRouter = Router();
publicRouter.get('/', aboutController.getPublic);

const adminRouter = Router();
adminRouter.use(requireAuth);
adminRouter.get('/', aboutController.getAdmin);

adminRouter.post('/features', featureBody, validate, aboutController.createFeature);
adminRouter.put('/features/reorder', aboutController.reorderFeatures);
adminRouter.put('/features/:id', idParamValidator, featureBody, validate, aboutController.updateFeature);
adminRouter.delete('/features/:id', idParamValidator, validate, aboutController.deleteFeature);
adminRouter.post('/features/:id/icon', idParamValidator, validate, upload.single('image'), aboutController.uploadFeatureIcon);

adminRouter.post('/team', teamBody, validate, aboutController.createTeamMember);
adminRouter.put('/team/reorder', aboutController.reorderTeam);
adminRouter.put('/team/:id', idParamValidator, teamBody, validate, aboutController.updateTeamMember);
adminRouter.delete('/team/:id', idParamValidator, validate, aboutController.deleteTeamMember);
adminRouter.post('/team/:id/image', idParamValidator, validate, upload.single('image'), aboutController.uploadTeamImage);

adminRouter.post('/stories', storyBody, validate, aboutController.createStory);
adminRouter.put('/stories/reorder', aboutController.reorderStories);
adminRouter.put('/stories/:id', idParamValidator, storyBody, validate, aboutController.updateStory);
adminRouter.delete('/stories/:id', idParamValidator, validate, aboutController.deleteStory);
adminRouter.post('/stories/:id/image', idParamValidator, validate, upload.single('image'), aboutController.uploadStoryImage);

export { publicRouter as aboutRoutes, adminRouter as adminAboutRoutes };
