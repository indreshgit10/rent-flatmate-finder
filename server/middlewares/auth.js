const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const { jwtSecret } = require('../config/env');

const authenticate = async (req, _res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      return next(new AppError('Authentication required', 401));
    }

    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, jwtSecret);

    const user = await User.findById(decoded.id).select('role isDisabled');
    if (!user) return next(new AppError('User not found', 401));
    if (user.isDisabled) return next(new AppError('Account has been disabled', 403));

    req.user = { id: decoded.id, role: decoded.role };
    next();
  } catch (err) {
    next(new AppError('Invalid or expired token', 401));
  }
};

module.exports = authenticate;
