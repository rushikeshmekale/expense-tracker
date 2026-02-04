const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Expense = require("./models/expense");

const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect("mongodb://127.0.0.1:27017/expenseDB")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error(err));

app.post("/api/expenses", async (req, res) => {
  const exp = await Expense.create(req.body);
  res.json(exp);
});

app.get("/api/expenses", async (req, res) => {
  const data = await Expense.find();
  res.json(data);
});

app.delete("/api/expenses/:id", async (req, res) => {
  await Expense.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

app.get("/api/analytics/total", async (req, res) => {
  const r = await Expense.aggregate([
    { $group: { _id: null, total: { $sum: "$amount" } } }
  ]);
  res.json({ total: r[0]?.total || 0 });
});

app.listen(5000, () =>
  console.log("🔥 Backend running on http://localhost:5000")
);
