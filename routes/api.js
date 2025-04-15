const express = require("express");
const { sql } = require("../config/db");
const router = express.Router();

// Ensure users table exists
router.use(async (req, res, next) => {
  try {
    // Create table if it doesn't exist
    await req.app.locals.db.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='users' AND xtype='U')
      CREATE TABLE users (
        id VARCHAR(50) PRIMARY KEY,
        fullName NVARCHAR(255) NOT NULL,
        createdAt DATETIME NOT NULL
      )
    `);
    next();
  } catch (err) {
    console.error("Error ensuring table exists:", err);
    res.status(500).json({ error: "Database initialization error" });
  }
});

// GET all submitted names
// routes/api.js
router.get("/users", async (req, res) => {
  try {
    if (require("../config/db").useInMemory()) {
      // Use in-memory storage
      res.json(require("../config/db").getInMemoryUsers());
    } else {
      // Use SQL Database
      const result = await req.app.locals.db
        .request()
        .query("SELECT * FROM users ORDER BY createdAt DESC");
      res.json(result.recordset);
    }
  } catch (err) {
    console.error("Error getting users:", err);
    res.status(500).json({ error: "Failed to retrieve users" });
  }
});

// POST a new name
router.post("/users", async (req, res) => {
  const { fullName } = req.body;

  if (!fullName || fullName.trim() === "") {
    return res.status(400).json({ error: "Full name is required" });
  }

  const newUser = {
    id: Date.now().toString(),
    fullName,
    createdAt: new Date(),
  };

  try {
    const request = req.app.locals.db.request();
    request.input("id", sql.VarChar(50), newUser.id);
    request.input("fullName", sql.NVarChar(255), newUser.fullName);
    request.input("createdAt", sql.DateTime, newUser.createdAt);

    await request.query(`
      INSERT INTO users (id, fullName, createdAt)
      VALUES (@id, @fullName, @createdAt)
    `);

    res.status(201).json(newUser);
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).json({ error: "Failed to save user" });
  }
});

module.exports = router;
