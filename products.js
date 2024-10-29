const express = require("express");
const db = require("../db/database");
const router = express.Router();
router.post("/products", async (req, res) => {
  try {
    const products = await db("products").insert(req.body);
    return res.json(products);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
