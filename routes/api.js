const { CosmosClient } = require("@azure/cosmos");
const express = require("express");
const { sql } = require("../config/db");
require("dotenv").config();
const router = express.Router();
const client = new CosmosClient({endpoint: process.env.COSMOS_DB_URL, key: process.env.COSMOS_DB_KEY});
const databaseIdColleague = process.env.COSMOS_DB_ID_COLLEAGUE;
const databaseIdProduct = process.env.COSMOS_DB_ID_PRODUCT;
const containerIdColleague = process.env.COSMOS_CONTAINER_COLLEAGUE;
const containerIdProduct = process.env.COSMOS_CONTAINER_PRODUCT;

router.get("/products", async (req, res) => {
  try {
    const { database } = await client.databases.createIfNotExists({ id: databaseIdProduct });
    const { container } = await database.containers.createIfNotExists({ id: containerIdProduct });

    const querySpec = {
      query: "SELECT * FROM c",
    };

    const { resources: products } = await container.items.query(querySpec).fetchAll();
    console.log("Products:", products);
    res.status(200).json(products);
  } catch (err) {
    console.error("Error getting products:", err);
    res.status(500).json({ error: "Failed to retrieve products" });
  }
});

router.get("/colleagues", async (req, res) => {
  try {
    const { database } = await client.databases.createIfNotExists({ id: databaseIdColleague });
    const { container } = await database.containers.createIfNotExists({ id: containerIdColleague });

    const querySpec = {
      query: "SELECT * FROM c",
    };

    const { resources: colleagues } = await container.items.query(querySpec).fetchAll();
    console.log("Colleagues:", colleagues);
    res.status(200).json(colleagues);
  } catch (err) {
    console.error("Error getting colleagues:", err);
    res.status(500).json({ error: "Failed to retrieve colleagues" });
  }
});

// POST a new name
// router.post("/users", async (req, res) => {
//   const { fullName } = req.body;

//   if (!fullName || fullName.trim() === "") {
//     return res.status(400).json({ error: "Full name is required" });
//   }

//   const newUser = {
//     id: Date.now().toString(),
//     fullName,
//     createdAt: new Date(),
//   };

  // try {
  //   const request = req.app.locals.db.request();
  //   request.input("id", sql.VarChar(50), newUser.id);
  //   request.input("fullName", sql.NVarChar(255), newUser.fullName);
  //   request.input("createdAt", sql.DateTime, newUser.createdAt);

  //   await request.query(`
  //     INSERT INTO users (id, fullName, createdAt)
  //     VALUES (@id, @fullName, @createdAt)
  //   `);

  //   res.status(201).json(newUser);
  // } catch (err) {
  //   console.error("Error creating user:", err);
  //   res.status(500).json({ error: "Failed to save user" });
  // }
// });

module.exports = router;
