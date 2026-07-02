const TenantProfile = require('../models/TenantProfile');
const CompatibilityScore = require('../models/CompatibilityScore');
const AppError = require('../utils/AppError');

const createProfile = async (tenantId, data) => {
  const existing = await TenantProfile.findOne({ tenant: tenantId });
  if (existing) {
    throw new AppError('Profile already exists', 409);
  }
  
  const profile = await TenantProfile.create({
    tenant: tenantId,
    ...data
  });
  return profile;
};

const getProfile = async (tenantId) => {
  const profile = await TenantProfile.findOne({ tenant: tenantId });
  return profile;
};

const updateProfile = async (tenantId, data) => {
  const profile = await TenantProfile.findOneAndUpdate(
    { tenant: tenantId },
    data,
    { new: true, runValidators: true }
  );

  if (!profile) {
    throw new AppError('Profile not found', 404);
  }

  // Invalidate cached compatibility scores for this tenant
  await CompatibilityScore.deleteMany({ tenant: tenantId });

  return profile;
};

module.exports = {
  createProfile,
  getProfile,
  updateProfile
};
