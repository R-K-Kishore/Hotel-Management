// Database configuration
// Connects to PostgreSQL using the pg package and environment variables

const { Pool } = require('pg');
require('dotenv').config();

// Create a connection pool using environment variables
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

// Test the connection when the server starts
pool.connect((err, client, release) => {
  if (err) {
    console.error('Error connecting to PostgreSQL:', err.message);
  } else {
    console.log('Connected to PostgreSQL database successfully');
    release();
  }
});

module.exports = pool;

