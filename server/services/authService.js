const jwt = require('jsonwebtoken');
const User = require('../models/User');
const TenantProfile = require('../models/TenantProfile');
const AppError = require('../utils/AppError');
const { jwtSecret, jwtExpiresIn } = require('../config/env');

const generateToken = (userId, role) => {
  return jwt.sign({ id: userId, role }, jwtSecret, { expiresIn: jwtExpiresIn });
};

const registerUser = async ({ name, email, password, role, preferredLocation, budgetMin, budgetMax }) => {
  const existing = await User.findOne({ email });
  if (existing) throw new AppError('Email already registered', 400);

  if (role === 'tenant') {
    const min = Number(budgetMin) || 0;
    const max = Number(budgetMax) || 100000;
    if (min >= max) {
      throw new AppError('Minimum budget must be less than maximum budget', 400);
    }
  }

  const user = await User.create({ name, email, password, role });
  
  if (role === 'tenant') {
    // moveInDate isn't in the filter but required by TenantProfile, so use a default if not provided
    await TenantProfile.create({
      tenant: user._id,
      preferredLocation: preferredLocation || '',
      budgetMin: Number(budgetMin) || 0,
      budgetMax: Number(budgetMax) || 100000,
      moveInDate: new Date()
    });
  }
  const token = generateToken(user._id, user.role);

  return { token, user: { id: user._id, name: user.name, email: user.email, role: user.role } };
};

const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+password');
  if (!user) throw new AppError('Invalid email or password', 401);
  if (user.isDisabled) throw new AppError('Account has been disabled', 401);

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new AppError('Invalid email or password', 401);

  const token = generateToken(user._id, user.role);

  return { token, user: { id: user._id, name: user.name, email: user.email, role: user.role } };
};

module.exports = { registerUser, loginUser };
