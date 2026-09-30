const mongoose = require("mongoose");
const Transaction = require("../models/transaction.model");
const getSummary = async (req, res) => {
    try {
        const userId = req.user.userId;

        const transactions = await Transaction.find({
            userId
        });

        let totalIncome = 0;
        let totalExpense = 0;

        transactions.forEach((transaction) => {
            if (transaction.type === "income") {
                totalIncome += transaction.amount;
            }

            if (transaction.type === "expense") {
                totalExpense += transaction.amount;
            }
        });

        const balance = totalIncome - totalExpense;

        return res.status(200).json({
            success: true,
            summary: {
                totalIncome,
                totalExpense,
                balance,
                transactionCount: transactions.length
            }
        });

    } catch (error) {
        console.error("Get summary error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};
const getMonthlySummary = async (req, res) => {
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
            monthNumber < 1 ||
            monthNumber > 12 ||
            !Number.isInteger(monthNumber) ||
            !Number.isInteger(yearNumber)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid month or year"
            });
        }

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

        const transactions = await Transaction.find({
            userId,
            date: {
                $gte: startDate,
                $lt: endDate
            }
        });

        let totalIncome = 0;
        let totalExpense = 0;

        transactions.forEach((transaction) => {
            if (transaction.type === "income") {
                totalIncome += transaction.amount;
            }

            if (transaction.type === "expense") {
                totalExpense += transaction.amount;
            }
        });

        const balance = totalIncome - totalExpense;

        return res.status(200).json({
            success: true,
            month: monthNumber,
            year: yearNumber,
            summary: {
                totalIncome,
                totalExpense,
                balance,
                transactionCount: transactions.length
            }
        });

    } catch (error) {
        console.error("Monthly summary error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};
const getYearlySummary = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { year } = req.query;

        if (!year) {
            return res.status(400).json({
                success: false,
                message: "Year is required"
            });
        }

        const yearNumber = Number(year);

        if (!Number.isInteger(yearNumber) || yearNumber < 2000) {
            return res.status(400).json({
                success: false,
                message: "Invalid year"
            });
        }

        const startDate = new Date(yearNumber, 0, 1);
        const endDate = new Date(yearNumber + 1, 0, 1);

        const transactions = await Transaction.find({
            userId,
            date: {
                $gte: startDate,
                $lt: endDate
            }
        });

        let totalIncome = 0;
        let totalExpense = 0;

        transactions.forEach((transaction) => {
            if (transaction.type === "income") {
                totalIncome += transaction.amount;
            }

            if (transaction.type === "expense") {
                totalExpense += transaction.amount;
            }
        });

        const balance = totalIncome - totalExpense;

        return res.status(200).json({
            success: true,
            year: yearNumber,
            summary: {
                totalIncome,
                totalExpense,
                balance,
                transactionCount: transactions.length
            }
        });

    } catch (error) {
        console.error("Yearly summary error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};
const getCategorySummary = async (req, res) => {
    try {
        const userId = req.user.userId;

        const categorySummary = await Transaction.aggregate([
            {
                $match: {
                    userId: new mongoose.Types.ObjectId(userId),
                    type: "expense"
                }
            },
            {
                $group: {
                    _id: "$category",
                    totalAmount: {
                        $sum: "$amount"
                    },
                    transactionCount: {
                        $sum: 1
                    }
                }
            },
            {
                $sort: {
                    totalAmount: -1
                }
            }
        ]);

        return res.status(200).json({
            success: true,
            categories: categorySummary
        });

    } catch (error) {
        console.error("Category summary error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};
module.exports = {
    getSummary,
    getMonthlySummary,
    getYearlySummary,
    getCategorySummary
};