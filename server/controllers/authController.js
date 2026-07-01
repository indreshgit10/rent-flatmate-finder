const { registerUser, loginUser } = require('../services/authService');
const { sendSuccess } = require('../utils/apiResponse');

const register = async (req, res, next) => {
  try {
    const result = await registerUser(req.body);
    sendSuccess(res, 'Registration successful', result, 201);
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const result = await loginUser(req.body);
    sendSuccess(res, 'Login successful', result);
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login };
