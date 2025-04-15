const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { connectToDatabase } = require("./config/db");
const apiRoutes = require("./routes/api");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3001;

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  optionsSuccessStatus: 200,
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan("dev"));

// Database initialization
let pool;
(async function initializeDatabase() {
  try {
    pool = await connectToDatabase();
    app.locals.db = pool; // Make the database connection available to routes
    console.log("Database initialized");
  } catch (err) {
    console.error("Failed to initialize database:", err);
  }
})();

// Routes
app.use("/api", apiRoutes);

// Base route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Full Name API" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
