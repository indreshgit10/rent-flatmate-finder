const TenantProfile = require('../models/TenantProfile');
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

module.exports = {
  createProfile,
  getProfile
};
