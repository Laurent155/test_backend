// config/db.js
const sql = require("mssql");
require("dotenv").config();

// In-memory fallback for development
let inMemoryUsers = [];
let useInMemory = false;

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  options: {
    encrypt: true,
    trustServerCertificate: false,
    connectTimeout: 30000, // Increase timeout for development
  },
};

async function connectToDatabase() {
  if (
    process.env.NODE_ENV === "development" &&
    process.env.USE_IN_MEMORY === "true"
  ) {
    console.log("Using in-memory storage for development");
    useInMemory = true;
    return null;
  }

  try {
    const pool = await sql.connect(config);
    console.log("Connected to SQL Database");
    useInMemory = false;
    return pool;
  } catch (err) {
    console.error("Database connection error:", err);
    if (process.env.NODE_ENV === "development") {
      console.log("Falling back to in-memory storage");
      useInMemory = true;
      return null;
    }
    throw err;
  }
}

// Expose in-memory functions for development fallback
function getInMemoryUsers() {
  return inMemoryUsers;
}

function addInMemoryUser(user) {
  inMemoryUsers.push(user);
  return user;
}

module.exports = {
  connectToDatabase,
  sql,
  useInMemory: () => useInMemory,
  getInMemoryUsers,
  addInMemoryUser,
};
