const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { getPool } = require('../config/db');
const AppError = require('../utils/AppError');
const { jwtSecret, jwtExpiresIn } = require('../config/env');

const generateToken = (userId, role) => {
  return jwt.sign({ id: userId, role }, jwtSecret, { expiresIn: jwtExpiresIn });
};

const registerUser = async ({ name, email, password, role, preferredLocation, budgetMin, budgetMax }) => {
  const pool = getPool();
  
  // Check if user exists
  const [existing] = await pool.query('SELECT * FROM Users WHERE email = ?', [email]);
  if (existing.length > 0) throw new AppError('Email already registered', 400);

  if (role === 'tenant') {
    const min = Number(budgetMin) || 0;
    const max = Number(budgetMax) || 100000;
    if (min >= max) {
      throw new AppError('Minimum budget must be less than maximum budget', 400);
    }
  }

  // Hash password manually since we removed Mongoose pre-save hook
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Insert User
    const [userResult] = await connection.query(
      'INSERT INTO Users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
      [name, email, passwordHash, role]
    );
    const userId = userResult.insertId;

    if (role === 'tenant') {
      const min = Number(budgetMin) || 0;
      const max = Number(budgetMax) || 100000;
      const moveInDate = new Date().toISOString().split('T')[0]; // Default to today
      
      // Insert TenantProfile
      await connection.query(
        'INSERT INTO TenantProfiles (user_id, preferred_location, budget_min, budget_max, move_in_date) VALUES (?, ?, ?, ?, ?)',
        [userId, preferredLocation || '', min, max, moveInDate]
      );
    }
    
    await connection.commit();
    const token = generateToken(userId, role);
    return { token, user: { id: userId, name, email, role } };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

const loginUser = async ({ email, password }) => {
  const pool = getPool();
  const [users] = await pool.query('SELECT * FROM Users WHERE email = ?', [email]);
  const user = users[0];
  
  if (!user) throw new AppError('Invalid email or password', 401);

  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) throw new AppError('Invalid email or password', 401);

  const token = generateToken(user.id, user.role);

  return { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } };
};

module.exports = { registerUser, loginUser };
