const { getPool } = require('../config/db');
const AppError = require('../utils/AppError');

const createProfile = async (tenantId, data) => {
  const pool = getPool();
  const [existing] = await pool.query('SELECT * FROM TenantProfiles WHERE user_id = ?', [tenantId]);
  
  if (existing.length > 0) {
    throw new AppError('Profile already exists', 409);
  }
  
  const { preferredLocation = '', budgetMin = 0, budgetMax = 100000, moveInDate = null } = data;
  
  await pool.query(
    'INSERT INTO TenantProfiles (user_id, preferred_location, budget_min, budget_max, move_in_date) VALUES (?, ?, ?, ?, ?)',
    [tenantId, preferredLocation, budgetMin, budgetMax, moveInDate]
  );
  
  const [newProfile] = await pool.query('SELECT * FROM TenantProfiles WHERE user_id = ?', [tenantId]);
  return newProfile[0];
};

const getProfile = async (tenantId) => {
  const pool = getPool();
  const [profiles] = await pool.query('SELECT * FROM TenantProfiles WHERE user_id = ?', [tenantId]);
  return profiles[0] || null;
};

const updateProfile = async (tenantId, data) => {
  const pool = getPool();
  
  const [existing] = await pool.query('SELECT * FROM TenantProfiles WHERE user_id = ?', [tenantId]);
  if (existing.length === 0) {
    throw new AppError('Profile not found', 404);
  }

  const { preferredLocation, budgetMin, budgetMax, moveInDate } = data;
  const oldProfile = existing[0];
  
  const updateData = {
    preferred_location: preferredLocation !== undefined ? preferredLocation : oldProfile.preferred_location,
    budget_min: budgetMin !== undefined ? budgetMin : oldProfile.budget_min,
    budget_max: budgetMax !== undefined ? budgetMax : oldProfile.budget_max,
    move_in_date: moveInDate !== undefined ? moveInDate : oldProfile.move_in_date
  };

  await pool.query(
    'UPDATE TenantProfiles SET preferred_location = ?, budget_min = ?, budget_max = ?, move_in_date = ? WHERE user_id = ?',
    [updateData.preferred_location, updateData.budget_min, updateData.budget_max, updateData.move_in_date, tenantId]
  );

  // Invalidate cached compatibility scores (assuming compatibility scores table exists or will exist)
  // await pool.query('DELETE FROM CompatibilityScores WHERE tenant_id = ?', [tenantId]);

  const [updatedProfiles] = await pool.query('SELECT * FROM TenantProfiles WHERE user_id = ?', [tenantId]);
  return updatedProfiles[0];
};

module.exports = {
  createProfile,
  getProfile,
  updateProfile
};
