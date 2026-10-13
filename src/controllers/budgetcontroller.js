

const mongoose = require("mongoose");
const Budget = require("../models/budget.model");
const Transaction = require("../models/transaction.model");

// Validate month and year
const validateMonthYear = (month, year) => {
    if (
        month === undefined ||
        month === null ||
        month === "" ||
        year === undefined ||
        year === null ||
        year === ""
    ) {
        return null;
    }

    const monthNumber = Number(month);
    const yearNumber = Number(year);

    if (
        !Number.isInteger(monthNumber) ||
        monthNumber < 1 ||
        monthNumber > 12 ||
        !Number.isInteger(yearNumber) ||
        yearNumber < 2000 ||
        yearNumber > 9999
    ) {
        return null;
    }

    return { monthNumber, yearNumber };
};

// Validate budget amount
const validateAmount = (amount) => {
    if (
        amount === undefined ||
        amount === null ||
        (typeof amount === "string" && amount.trim() === "")
    ) {
        return null;
    }

    const amountNumber = Number(amount);

    if (!Number.isFinite(amountNumber) || amountNumber <= 0) {
        return null;
    }

    return amountNumber;
};

// Create budget
const createBudget = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { category, amount, month, year } = req.body;

        if (
            typeof category !== "string" ||
            !category.trim() ||
            amount === undefined ||
            amount === null ||
            amount === "" ||
            month === undefined ||
            month === null ||
            month === "" ||
            year === undefined ||
            year === null ||
            year === ""
        ) {
            return res.status(400).json({
                success: false,
                message: "Category, amount, month and year are required"
            });
        }

        const amountNumber = validateAmount(amount);
        const dates = validateMonthYear(month, year);

        if (amountNumber === null || !dates) {
            return res.status(400).json({
                success: false,
                message: "Invalid budget details"
            });
        }

        const cleanCategory = category.trim();

        const existingBudget = await Budget.findOne({
            userId,
            category: cleanCategory,
            month: dates.monthNumber,
            year: dates.yearNumber
        });

        if (existingBudget) {
            return res.status(409).json({
                success: false,
                message: "Budget already exists for this category and month"
            });
        }

        const budget = await Budget.create({
            userId,
            category: cleanCategory,
            amount: amountNumber,
            month: dates.monthNumber,
            year: dates.yearNumber
        });

        return res.status(201).json({
            success: true,
            message: "Budget created successfully",
            budget
        });
    } catch (error) {
        // Handle duplicate-key errors from a unique MongoDB index
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "Budget already exists for this category and month"
            });
        }

        console.error("Create budget error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// Get budgets for a month
const getBudgets = async (req, res) => {
    try {
        const userId = req.user.userId;
        const dates = validateMonthYear(req.query.month, req.query.year);

        if (!dates) {
            return res.status(400).json({
                success: false,
                message: "Valid month and year are required"
            });
        }

        const budgets = await Budget.find({
            userId,
            month: dates.monthNumber,
            year: dates.yearNumber
        }).sort({ category: 1 });

        return res.status(200).json({
            success: true,
            month: dates.monthNumber,
            year: dates.yearNumber,
            budgets
        });
    } catch (error) {
        console.error("Get budgets error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// Get budget status and monthly spending
const getBudgetStatus = async (req, res) => {
    try {
        const userId = req.user.userId;
        const dates = validateMonthYear(req.query.month, req.query.year);

        if (!dates) {
            return res.status(400).json({
                success: false,
                message: "Valid month and year are required"
            });
        }

        const { monthNumber, yearNumber } = dates;

        // Fetch only the authenticated user's budgets
        const budgets = await Budget.find({
            userId,
            month: monthNumber,
            year: yearNumber
        });

        const startDate = new Date(yearNumber, monthNumber - 1, 1);
        const endDate = new Date(yearNumber, monthNumber, 1);

        // Fetch only the authenticated user's expenses for this month
        const transactions = await Transaction.find({
            userId,
            type: "expense",
            date: {
                $gte: startDate,
                $lt: endDate
            }
        });

        const spending = {};

        transactions.forEach((transaction) => {
            const category = transaction.category;

            spending[category] =
                (spending[category] || 0) + transaction.amount;
        });

        const result = budgets.map((budget) => {
            const spent = spending[budget.category] || 0;
            const remaining = budget.amount - spent;

            return {
                category: budget.category,
                budget: budget.amount,
                spent,
                remaining,
                exceeded: spent > budget.amount,
                usagePercentage: Number(
                    ((spent / budget.amount) * 100).toFixed(2)
                )
            };
        });

        return res.status(200).json({
            success: true,
            month: monthNumber,
            year: yearNumber,
            budgets: result
        });
    } catch (error) {
        console.error("Budget status error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// Update budget
const updateBudget = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { id } = req.params;
        const { category, amount } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid budget ID"
            });
        }

        if (category === undefined && amount === undefined) {
            return res.status(400).json({
                success: false,
                message: "Provide category or amount to update"
            });
        }

        // Restrict lookup to the authenticated user
        const budget = await Budget.findOne({
            _id: id,
            userId
        });

        if (!budget) {
            return res.status(404).json({
                success: false,
                message: "Budget not found"
            });
        }

        let cleanCategory = budget.category;

        if (category !== undefined) {
            if (
                typeof category !== "string" ||
                !category.trim()
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Category must be a non-empty string"
                });
            }

            cleanCategory = category.trim();
        }

        let amountNumber = budget.amount;

        if (amount !== undefined) {
            amountNumber = validateAmount(amount);

            if (amountNumber === null) {
                return res.status(400).json({
                    success: false,
                    message: "Amount must be a valid number greater than 0"
                });
            }
        }

        // Prevent duplicate budgets for the same user/category/month/year
        const duplicate = await Budget.findOne({
            _id: { $ne: budget._id },
            userId,
            category: cleanCategory,
            month: budget.month,
            year: budget.year
        });

        if (duplicate) {
            return res.status(409).json({
                success: false,
                message: "A budget already exists for this category and month"
            });
        }

        budget.category = cleanCategory;
        budget.amount = amountNumber;

        await budget.save();

        return res.status(200).json({
            success: true,
            message: "Budget updated successfully",
            budget
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "A budget already exists for this category and month"
            });
        }

        console.error("Update budget error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// Delete budget
const deleteBudget = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid budget ID"
            });
        }

        // Delete only if this budget belongs to the authenticated user
        const budget = await Budget.findOneAndDelete({
            _id: id,
            userId
        });

        if (!budget) {
            return res.status(404).json({
                success: false,
                message: "Budget not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Budget deleted successfully"
        });
    } catch (error) {
        console.error("Delete budget error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

module.exports = {
    createBudget,
    getBudgets,
    getBudgetStatus,
    updateBudget,
    deleteBudget
};
