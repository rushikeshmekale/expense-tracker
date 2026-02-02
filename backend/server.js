const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Expense = require("./models/expense");

const app = express();

app.use(cors());
app.use(express.json());

// 🔌 DB Connection
mongoose
  .connect("mongodb://localhost:27017/expenseDB")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Error:", err.message));

// ➕ ADD EXPENSE
app.post("/api/expenses", async (req, res) => {
  try {
    const expense = await Expense.create(req.body);
    res.status(201).json(expense);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 📥 GET ALL EXPENSES (latest first)
app.get("/api/expenses", async (req, res) => {
  const expenses = await Expense.find().sort({ createdAt: -1 });
  res.json(expenses);
});

// ❌ DELETE EXPENSE
app.delete("/api/expenses/:id", async (req, res) => {
  await Expense.findByIdAndDelete(req.params.id);
  res.json({ message: "Expense deleted" });
});

// 📊 TOTAL SPENT
app.get("/api/analytics/total", async (req, res) => {
  const result = await Expense.aggregate([
    { $group: { _id: null, total: { $sum: "$amount" } } }
  ]);
  res.json({ total: result[0]?.total || 0 });
});

// 📊 CATEGORY WISE BREAKDOWN
app.get("/api/analytics/category", async (req, res) => {
  const data = await Expense.aggregate([
    { $group: { _id: "$category", total: { $sum: "$amount" } } }
  ]);
  res.json(data);
});

// 🚀 SERVER START
const PORT = 5000;
app.listen(PORT, () =>
  console.log(`🔥 Server running on http://localhost:${PORT}`)
);