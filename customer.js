const express = require("express");
const db = require("../db/database");
const jwt = require("jsonwebtoken");
const secret = "abc123";
const router = express.Router();
router.post("/customerLogin", async (req, res) => {
  try {
    const { email } = req.body;
    const customers = await db("customers")
      .select("*")
      .where({ email: email })
      .first();
    console.log(typeof customers);
    const token = jwt.sign({ custom: customers }, secret);
    console.log(token);

    return res.json({ details: customers, token: token });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
router.post("/customerRegisteration", async (req, res) => {
  try {
    // const { name, email } = req.body;
    const customers = await db("customers").insert(req.body);
    return res.json(customers);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
module.exports = router;
