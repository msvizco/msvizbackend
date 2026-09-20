import { Router } from 'express';
import * as settingsController from '../controllers/settings.controller';
import * as dashboardController from '../controllers/dashboard.controller';
import { requireAuth } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { upload } from '../middleware/upload';
import { settingsBodyValidator } from '../validators/settings.validator';

const publicRouter = Router();
publicRouter.get('/', settingsController.getPublic);
publicRouter.get('/testimonials', settingsController.testimonials);
publicRouter.get('/faqs', settingsController.faqs);

const adminRouter = Router();
adminRouter.use(requireAuth);
adminRouter.get('/', settingsController.getAdmin);
adminRouter.put('/', settingsBodyValidator, validate, settingsController.update);
adminRouter.post('/logo', upload.single('image'), settingsController.uploadLogo);
adminRouter.post('/hero-image', upload.single('image'), settingsController.uploadHeroImage);
adminRouter.post('/cta-background', upload.single('image'), settingsController.uploadCtaBackgroundImage);
adminRouter.post('/panel-image/:panel', upload.single('image'), settingsController.uploadPanelImage);

const dashboardRouter = Router();
dashboardRouter.use(requireAuth);
dashboardRouter.get('/', dashboardController.stats);

export {
  publicRouter as settingsRoutes,
  adminRouter as adminSettingsRoutes,
  dashboardRouter,
};
