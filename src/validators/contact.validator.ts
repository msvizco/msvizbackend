import { body } from 'express-validator';

export const contactBodyValidator = [
  body('name').isString().trim().isLength({ min: 2, max: 120 }).withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('A valid email is required'),
  body('phone').optional({ nullable: true }).isString().trim().isLength({ max: 40 }),
  body('service').optional({ nullable: true }).isString().trim().isLength({ max: 200 }),
  body('message').isString().trim().isLength({ min: 10, max: 5000 }).withMessage('Message is required'),
];

export const messageStatusValidator = [
  body('status').isIn(['new', 'read', 'replied', 'archived']).withMessage('Invalid status'),
];
