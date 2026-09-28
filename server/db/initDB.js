const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function initDB() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST || 'localhost',
      user: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASSWORD || '',
      multipleStatements: true
    });

    const dbName = process.env.MYSQL_DATABASE || 'rent_flatmate_finder';
    
    console.log(`Creating database ${dbName} if it doesn't exist...`);
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
    
    console.log(`Using database ${dbName}...`);
    await connection.query(`USE \`${dbName}\`;`);

    const schemaPath = path.join(__dirname, 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');

    console.log('Executing schema.sql...');
    await connection.query(schemaSql);
    
    console.log('Database initialized successfully!');
    await connection.end();
  } catch (err) {
    console.error('Error initializing database:', err);
    process.exit(1);
  }
}

initDB();
