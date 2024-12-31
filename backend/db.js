const mysql = require("mysql2");
require("dotenv").config();

// Create the MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "satmar_inventory",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // debug: true, // Enable query debugging
});

// Promisify the pool for async/await
const promisePool = pool.promise();

module.exports = promisePool;
