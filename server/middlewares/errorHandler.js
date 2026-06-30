const { nodeEnv } = require('../config/env');
const AppError = require('../utils/AppError');
const { sendError } = require('../utils/apiResponse');

const errorHandler = (err, _req, res, _next) => {
  if (err instanceof AppError) {
    return sendError(res, err.message, [], err.statusCode);
  }

  if (nodeEnv === 'development') {
    console.error(err.stack);
    return res.status(500).json({ success: false, message: err.message, stack: err.stack });
  }

  return sendError(res, 'Something went wrong', [], 500);
};

module.exports = errorHandler;
