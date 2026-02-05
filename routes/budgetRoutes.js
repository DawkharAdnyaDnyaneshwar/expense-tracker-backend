const express = require("express");
const db = require("../db");
const auth = require("../middleware/authenticateToken");

const router = express.Router();

router.post("/", auth, (req, res) => {
  const { category, monthly_limit, month_year } = req.body;

  db.query(
    `
    INSERT INTO budgets (user_id, category, monthly_limit, month_year)
    VALUES (?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE monthly_limit = ?
    `,
    [req.userId, category, monthly_limit, month_year, monthly_limit],
    () => res.json({ message: "Budget saved" })
  );
});

router.put("/", auth, (req, res) => {
  const { category, monthly_limit, month_year } = req.body;

  db.query(
    `UPDATE budgets
     SET monthly_limit = ?
     WHERE user_id = ? AND category = ? AND month_year = ?`,
    [monthly_limit, req.userId, category, month_year],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Update failed" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Budget not found" });
      }

      res.json({ message: "Budget updated successfully" });
    }
  );
});


router.get("/compare", auth, (req, res) => {
  db.query(
    `
    SELECT
      b.category,
      b.monthly_limit,
      IFNULL(SUM(e.amount), 0) AS total_spent,
      (b.monthly_limit - IFNULL(SUM(e.amount), 0)) AS remaining
    FROM budgets b
    LEFT JOIN expenses e
      ON b.user_id = e.user_id
      AND b.category = e.category
      AND DATE_FORMAT(e.date, '%Y-%m') = b.month_year
    WHERE b.user_id = ?
    GROUP BY b.category, b.monthly_limit
    `,
    [req.userId],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json(result);
    }
  );
});

module.exports = router;
