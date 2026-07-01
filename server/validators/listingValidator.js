const { body } = require('express-validator');

const validateCreateListing = [
  body('location').trim().notEmpty().withMessage('Location is required'),
  body('rent').isFloat({ min: 1 }).withMessage('Rent must be a positive number'),
  body('availableFrom').isISO8601().withMessage('availableFrom must be a valid date'),
  body('roomType').isIn(['single', 'shared', 'studio']).withMessage('Invalid room type'),
  body('furnishing').isIn(['furnished', 'unfurnished', 'semi']).withMessage('Invalid furnishing status'),
];

const validateUpdateListing = [
  body('location').optional().trim().notEmpty().withMessage('Location cannot be empty'),
  body('rent').optional().isFloat({ min: 1 }).withMessage('Rent must be a positive number'),
  body('availableFrom').optional().isISO8601().withMessage('availableFrom must be a valid date'),
  body('roomType').optional().isIn(['single', 'shared', 'studio']).withMessage('Invalid room type'),
  body('furnishing').optional().isIn(['furnished', 'unfurnished', 'semi']).withMessage('Invalid furnishing status'),
];

module.exports = { validateCreateListing, validateUpdateListing };
