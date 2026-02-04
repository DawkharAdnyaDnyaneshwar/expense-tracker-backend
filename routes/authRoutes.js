const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../db");

const router = express.Router();

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  const hash = await bcrypt.hash(password, 10);

  db.query(
    "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
    [name, email, hash],
    err => {
      if (err) return res.status(400).json(err);
      res.json({ message: "User registered" });
    }
  );
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, result) => {
      if (result.length === 0)
        return res.status(401).json({ error: "Invalid user" });

      const user = result[0];
      const match = await bcrypt.compare(password, user.password);

      if (!match)
        return res.status(401).json({ error: "Wrong password" });

      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.json({ token });
    }
  );
});

module.exports = router;
