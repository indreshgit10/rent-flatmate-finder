const { body, validationResult } = require('express-validator');
const { sendError } = require('../utils/apiResponse');
const mongoose = require('mongoose');

const validateInterest = [
  body('listingId')
    .notEmpty().withMessage('listingId is required')
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error('listingId must be a valid ObjectId');
      }
      return true;
    }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendError(res, 'Validation failed', errors.array(), 422);
    }
    next();
  }
];

module.exports = { validateInterest };
