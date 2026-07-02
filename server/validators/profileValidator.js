const { body, validationResult } = require('express-validator');
const { sendError } = require('../utils/apiResponse');

const validateProfile = [
  body('preferredLocation').notEmpty().withMessage('Preferred location is required'),
  body('budgetMin')
    .isNumeric().withMessage('budgetMin must be a number')
    .custom((value, { req }) => {
      if (parseFloat(value) >= parseFloat(req.body.budgetMax)) {
        throw new Error('budgetMin must be less than budgetMax');
      }
      return true;
    }),
  body('budgetMax').isNumeric().withMessage('budgetMax must be a number'),
  body('moveInDate').isISO8601().withMessage('moveInDate must be a valid date'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendError(res, 'Validation failed', errors.array(), 422);
    }
    next();
  }
];

module.exports = { validateProfile };
