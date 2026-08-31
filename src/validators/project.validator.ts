import { body, param, query } from 'express-validator';
import { PROJECT_CATEGORIES, PROJECT_STATUSES } from '../utils/constants';

export const projectQueryValidator = [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 50 }).toInt(),
  query('category').optional().isString(),
  query('status').optional().isString(),
  query('search').optional().isString(),
  query('featured').optional().isBoolean().toBoolean(),
  query('latest').optional().isBoolean().toBoolean(),
  query('completed').optional().isBoolean().toBoolean(),
  query('published').optional().isBoolean().toBoolean(),
  query('sort').optional().isIn(['newest', 'oldest', 'order', 'year']),
];

export const projectBodyValidator = [
  body('title').isString().trim().isLength({ min: 2, max: 200 }).withMessage('Title is required'),
  body('shortDescription').isString().trim().isLength({ min: 10, max: 500 }),
  body('description').isString().trim().isLength({ min: 20 }),
  body('category').isIn(PROJECT_CATEGORIES).withMessage('Invalid category'),
  body('location').isString().trim().isLength({ min: 2, max: 200 }),
  body('year').isInt({ min: 1900, max: 2100 }).toInt(),
  body('status').optional().isIn(PROJECT_STATUSES),
  body('client').optional({ nullable: true }).isString(),
  body('architect').optional({ nullable: true }).isString(),
  body('projectArea').optional({ nullable: true }).isString(),
  body('featured').optional().isBoolean().toBoolean(),
  body('latest').optional().isBoolean().toBoolean(),
  body('completed').optional().isBoolean().toBoolean(),
  body('published').optional().isBoolean().toBoolean(),
  body('displayOrder').optional().isInt().toInt(),
  body('slug').optional().isString(),
];

export const idParamValidator = [param('id').isUUID().withMessage('Invalid id')];
export const slugParamValidator = [param('slug').isString().isLength({ min: 1 })];
