import { Router } from 'express';
import * as settingsController from '../controllers/settings.controller';
import authRoutes from './auth.routes';
import projectRoutes from './project.routes';
import adminProjectRoutes from './adminProject.routes';
import { serviceRoutes, adminServiceRoutes } from './service.routes';
import { contactRoutes, adminContactRoutes } from './contact.routes';
import { settingsRoutes, adminSettingsRoutes, dashboardRouter } from './settings.routes';

const router = Router();

router.use('/auth', authRoutes);

router.use('/projects', projectRoutes);
router.use('/admin/projects', adminProjectRoutes);

router.use('/services', serviceRoutes);
router.use('/admin/services', adminServiceRoutes);

router.use('/contact', contactRoutes);
router.use('/contact', adminContactRoutes);
router.use('/admin/messages', adminContactRoutes);

router.use('/settings', settingsRoutes);
router.use('/settings', adminSettingsRoutes);
router.use('/admin/settings', adminSettingsRoutes);

router.get('/testimonials', settingsController.testimonials);
router.get('/faqs', settingsController.faqs);

router.use('/admin/dashboard', dashboardRouter);

export default router;
