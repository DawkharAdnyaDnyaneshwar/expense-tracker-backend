const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const budgetRoutes = require("./routes/budgetRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/expenses", expenseRoutes);
app.use("/budgets", budgetRoutes);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
