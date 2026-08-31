import { body } from 'express-validator';

export const loginValidator = [
  body('email').isEmail().normalizeEmail().withMessage('A valid email is required'),
  body('password').isString().isLength({ min: 6 }).withMessage('Password is required'),
];
