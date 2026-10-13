
const mongoose = require("mongoose");

const budgetSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        category: {
            type: String,
            required: true,
            trim: true
        },

        amount: {
            type: Number,
            required: true,
            min: [0.01, "Budget amount must be greater than 0"]
        },

        month: {
            type: Number,
            required: true,
            min: 1,
            max: 12,
            validate: {
                validator: Number.isInteger,
                message: "Month must be an integer"
            }
        },

        year: {
            type: Number,
            required: true,
            min: 2000,
            max: 9999,
            validate: {
                validator: Number.isInteger,
                message: "Year must be an integer"
            }
        }
    },
    {
        timestamps: true
    }
);

// Prevent duplicate budgets for the same user,
// category, month and year.
budgetSchema.index(
    {
        userId: 1,
        category: 1,
        month: 1,
        year: 1
    },
    {
        unique: true
    }
);

module.exports = mongoose.model("Budget", budgetSchema);
