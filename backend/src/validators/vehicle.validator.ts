import { body, query } from 'express-validator';

export const vehicleCreateValidator = [
  body('make')
    .trim()
    .notEmpty()
    .withMessage('Make is required'),
  body('model')
    .trim()
    .notEmpty()
    .withMessage('Model is required'),
  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required'),
  body('price')
    .isFloat({ gt: 0 })
    .withMessage('Price must be a number greater than 0'),
  body('quantity')
    .isInt({ min: 0 })
    .withMessage('Quantity must be an integer greater than or equal to 0'),
];

export const vehicleUpdateValidator = [
  body('make')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Make cannot be empty'),
  body('model')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Model cannot be empty'),
  body('category')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Category cannot be empty'),
  body('price')
    .optional()
    .isFloat({ gt: 0 })
    .withMessage('Price must be a number greater than 0'),
  body('quantity')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Quantity must be an integer greater than or equal to 0'),
];

export const searchValidator = [
  query('make')
    .optional()
    .trim(),
  query('model')
    .optional()
    .trim(),
  query('category')
    .optional()
    .trim(),
  query('minPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('minPrice must be a positive number')
    .toFloat(),
  query('maxPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('maxPrice must be a positive number')
    .toFloat(),
];

export const inventoryActionValidator = [
  body('quantity')
    .isInt({ gt: 0 })
    .withMessage('Quantity must be an integer greater than 0'),
];
