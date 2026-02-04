const express = require("express");
const db = require("../db");
const auth = require("../middleware/authenticateToken");

const router = express.Router();

router.post("/", auth, (req, res) => {
  const { amount, category, date, description } = req.body;

  db.query(
    "INSERT INTO expenses (user_id, amount, category, date, description) VALUES (?, ?, ?, ?, ?)",
    [req.userId, amount, category, date, description],
    () => res.json({ message: "Expense added" })
  );
});

module.exports = router;
