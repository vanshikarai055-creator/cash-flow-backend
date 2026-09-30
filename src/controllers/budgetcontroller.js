const Budget = require("../models/budget.model");
const Transaction = require("../models/transaction.model");

const createBudget = async (req, res) => {
    try {
        const userId = req.user.userId;

        const {
            category,
            amount,
            month,
            year
        } = req.body;

        // 1. Validate required fields
        if (!category || !amount || !month || !year) {
            return res.status(400).json({
                success: false,
                message: "Category, amount, month and year are required"
            });
        }

        // 2. Convert values to numbers
        const amountNumber = Number(amount);
        const monthNumber = Number(month);
        const yearNumber = Number(year);

        // 3. Validate values
        if (
            amountNumber <= 0 ||
            monthNumber < 1 ||
            monthNumber > 12 ||
            !Number.isInteger(monthNumber) ||
            !Number.isInteger(yearNumber)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid budget details"
            });
        }

        // 4. Check if budget already exists
        const existingBudget = await Budget.findOne({
            userId,
            category,
            month: monthNumber,
            year: yearNumber
        });

        if (existingBudget) {
            return res.status(400).json({
                success: false,
                message: "Budget already exists for this category and month"
            });
        }

        // 5. Create budget
        const budget = await Budget.create({
            userId,
            category,
            amount: amountNumber,
            month: monthNumber,
            year: yearNumber
        });

        // 6. Send response
        return res.status(201).json({
            success: true,
            message: "Budget created successfully",
            budget
        });

    } catch (error) {
        console.error("Create budget error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};
const getBudgets = async (req, res) => {
    try {
        const userId = req.user.userId;

        const { month, year } = req.query;

        if (!month || !year) {
            return res.status(400).json({
                success: false,
                message: "Month and year are required"
            });
        }

        const monthNumber = Number(month);
        const yearNumber = Number(year);

        if (
            !Number.isInteger(monthNumber) ||
            monthNumber < 1 ||
            monthNumber > 12 ||
            !Number.isInteger(yearNumber)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid month or year"
            });
        }

        const budgets = await Budget.find({
            userId,
            month: monthNumber,
            year: yearNumber
        });

        return res.status(200).json({
            success: true,
            month: monthNumber,
            year: yearNumber,
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
const getBudgetStatus = async (req, res) => {
    try {
        const userId = req.user.userId;

        const { month, year } = req.query;

        if (!month || !year) {
            return res.status(400).json({
                success: false,
                message: "Month and year are required"
            });
        }

        const monthNumber = Number(month);
        const yearNumber = Number(year);

        if (
            !Number.isInteger(monthNumber) ||
            monthNumber < 1 ||
            monthNumber > 12 ||
            !Number.isInteger(yearNumber)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid month or year"
            });
        }

        // Get user's budgets for this month
        const budgets = await Budget.find({
            userId,
            month: monthNumber,
            year: yearNumber
        });

        // Get start and end dates of the month
        const startDate = new Date(
            yearNumber,
            monthNumber - 1,
            1
        );

        const endDate = new Date(
            yearNumber,
            monthNumber,
            1
        );

        // Get expenses for this month
        const transactions = await Transaction.find({
            userId,
            type: "expense",
            date: {
                $gte: startDate,
                $lt: endDate
            }
        });

        // Calculate spending category-wise
        const spending = {};

        transactions.forEach((transaction) => {
            const category = transaction.category;

            if (!spending[category]) {
                spending[category] = 0;
            }

            spending[category] += transaction.amount;
        });

        // Compare budget with spending
        const result = budgets.map((budget) => {
            const spent = spending[budget.category] || 0;

            return {
                category: budget.category,
                budget: budget.amount,
                spent,
                remaining: budget.amount - spent,
                exceeded: spent > budget.amount
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
const updateBudget = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { id } = req.params;

        const { category, amount } = req.body;

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

        if (category) {
            budget.category = category;
        }

        if (amount !== undefined) {
            const amountNumber = Number(amount);

            if (amountNumber <= 0) {
                return res.status(400).json({
                    success: false,
                    message: "Amount must be greater than 0"
                });
            }

            budget.amount = amountNumber;
        }

        await budget.save();

        return res.status(200).json({
            success: true,
            message: "Budget updated successfully",
            budget
        });

    } catch (error) {
        console.error("Update budget error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};
const deleteBudget = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { id } = req.params;

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