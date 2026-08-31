import { body } from 'express-validator';

export const serviceBodyValidator = [
  body('name').isString().trim().isLength({ min: 2, max: 200 }).withMessage('Name must be at least 2 characters'),
  body('shortDescription')
    .isString()
    .trim()
    .isLength({ min: 3, max: 500 })
    .withMessage('Short description must be at least 3 characters'),
  body('fullDescription')
    .isString()
    .trim()
    .isLength({ min: 5 })
    .withMessage('Full description must be at least 5 characters'),
  body('icon').optional({ nullable: true }).isString(),
  body('displayOrder').optional().isInt().toInt(),
  body('active').optional().isBoolean().toBoolean(),
  body('slug').optional().isString(),
];
