const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50
    },
    amount: {
      type: Number,
      required: true,
      min: 1
    },
    category: {
      type: String,
      enum: ["Food", "Travel", "Shopping", "Bills", "Other"],
      default: "Other"
    },
    date: {
      type: Date,
      required: true
    }
  },
  { timestamps: true } // ⭐ adds createdAt & updatedAt
);

module.exports = mongoose.model("Expense", expenseSchema);
