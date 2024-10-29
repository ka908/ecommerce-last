const express = require("express");
const nodemailer = require("nodemailer");
const db = require("../db/database");
const router = express.Router();
const verifyToken = require("./mware");

router.post("/orders", verifyToken, async (req, res) => {
  try {
    const { user_id } = req.body;

    if (req.user) {
      const orders = await db("orders").insert(req.body);
      return res.json({ msg: "Order placed successfully" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get("/total", async (req, res) => {
  try {
    const sum = await db("orders").sum("total_price as total");
    return res.send(sum);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
module.exports = router;
