const sendSuccess = (res, message, data = null, statusCode = 200) => {
  res.status(statusCode).json({ success: true, message, data });
};

const sendError = (res, message, errors = [], statusCode = 400) => {
  res.status(statusCode).json({ success: false, message, errors });
};

module.exports = { sendSuccess, sendError };
