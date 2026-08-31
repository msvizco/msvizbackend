import { body } from 'express-validator';

export const serviceBodyValidator = [
  body('name').isString().trim().isLength({ min: 2, max: 200 }).withMessage('Name is required'),
  body('shortDescription').isString().trim().isLength({ min: 10, max: 500 }),
  body('fullDescription').isString().trim().isLength({ min: 20 }),
  body('icon').optional({ nullable: true }).isString(),
  body('displayOrder').optional().isInt().toInt(),
  body('active').optional().isBoolean().toBoolean(),
  body('slug').optional().isString(),
];
