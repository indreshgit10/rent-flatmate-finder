const profileService = require('../services/profileService');
const { sendSuccess } = require('../utils/apiResponse');
const AppError = require('../utils/AppError');

const createProfile = async (req, res, next) => {
  try {
    const profile = await profileService.createProfile(req.user.id, req.body);
    sendSuccess(res, 'Profile created successfully', profile, 201);
  } catch (error) {
    next(error);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const profile = await profileService.getProfile(req.user.id);
    if (!profile) {
      return next(new AppError('Profile not found', 404));
    }
    sendSuccess(res, 'Profile retrieved', profile);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProfile,
  getProfile
};
