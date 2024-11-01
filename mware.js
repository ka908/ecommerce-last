const express = require("express");
const jwt = require("jsonwebtoken");
const secret = "abc123";

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Please enter valid credentials" });
    }
    const token = authHeader.split(" ")[1];
    jwt.verify(token, secret, (err, data) => {
      if (err) {
        return res
          .status(403)
          .json({ message: "Access forbidden, token is invalid" });
      }
      req.user = data;
      return next();
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
