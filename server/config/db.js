const mongoose = require('mongoose');
const mysql = require('mysql2/promise');
const { mongoUri } = require('./env');

let pool;

const connectDB = async () => {
  try {
    // 1. Connect MongoDB for unstructured data
    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB connected: ${conn.connection.host}`);

    // 2. Initialize MySQL connection pool for core relational data
    pool = mysql.createPool({
      host: process.env.MYSQL_HOST || 'localhost',
      user: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASSWORD || '',
      database: process.env.MYSQL_DATABASE || 'rent_flatmate_finder',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    // Test MySQL connection
    const connection = await pool.getConnection();
    console.log('MySQL connected');
    connection.release();

  } catch (err) {
    console.error(`Database connection error: ${err.message}`);
    process.exit(1);
  }
};

const getPool = () => {
  if (!pool) {
    throw new Error('MySQL pool is not initialized. Please call connectDB first.');
  }
  return pool;
};

module.exports = { connectDB, getPool };
