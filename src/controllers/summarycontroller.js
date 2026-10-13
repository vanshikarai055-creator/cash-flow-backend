
const mongoose = require("mongoose");
const Transaction = require("../models/transaction.model");

// Get overall summary
const getSummary = async (req, res) => {
    try {
        const userId = req.user.userId;

        const transactions = await Transaction.find({ userId });

        let totalIncome = 0;
        let totalExpense = 0;

        transactions.forEach((transaction) => {
            if (transaction.type === "income") {
                totalIncome += transaction.amount;
            } else if (transaction.type === "expense") {
                totalExpense += transaction.amount;
            }
        });

        return res.status(200).json({
            success: true,
            summary: {
                totalIncome,
                totalExpense,
                balance: totalIncome - totalExpense,
                transactionCount: transactions.length
            }
        });
    } catch (error) {
        console.error("Get summary error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// Get monthly summary
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
            !Number.isInteger(monthNumber) ||
            monthNumber < 1 ||
            monthNumber > 12 ||
            !Number.isInteger(yearNumber) ||
            yearNumber < 2000 ||
            yearNumber > 9999
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid month or year"
            });
        }

        const startDate = new Date(yearNumber, monthNumber - 1, 1);
        const endDate = new Date(yearNumber, monthNumber, 1);

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
            } else if (transaction.type === "expense") {
                totalExpense += transaction.amount;
            }
        });

        return res.status(200).json({
            success: true,
            month: monthNumber,
            year: yearNumber,
            summary: {
                totalIncome,
                totalExpense,
                balance: totalIncome - totalExpense,
                transactionCount: transactions.length
            }
        });
    } catch (error) {
        console.error("Monthly summary error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// Get yearly summary
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

        if (
            !Number.isInteger(yearNumber) ||
            yearNumber < 2000 ||
            yearNumber > 9999
        ) {
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
            } else if (transaction.type === "expense") {
                totalExpense += transaction.amount;
            }
        });

        return res.status(200).json({
            success: true,
            year: yearNumber,
            summary: {
                totalIncome,
                totalExpense,
                balance: totalIncome - totalExpense,
                transactionCount: transactions.length
            }
        });
    } catch (error) {
        console.error("Yearly summary error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// Get expense summary by category
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
                    totalAmount: { $sum: "$amount" },
                    transactionCount: { $sum: 1 }
                }
            },
            {
                $sort: { totalAmount: -1 }
            }
        ]);

        return res.status(200).json({
            success: true,
            categories: categorySummary
        });
    } catch (error) {
        console.error("Category summary error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// Compare current-month spending with previous-month spending
const getSpendingInsights = async (req, res) => {
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
            !Number.isInteger(yearNumber) ||
            yearNumber < 2000 ||
            yearNumber > 9999
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid month or year"
            });
        }

        const currentMonthStart = new Date(
            yearNumber,
            monthNumber - 1,
            1
        );

        const nextMonthStart = new Date(
            yearNumber,
            monthNumber,
            1
        );

        const previousMonthStart = new Date(
            yearNumber,
            monthNumber - 2,
            1
        );

        const transactions = await Transaction.find({
            userId,
            type: "expense",
            date: {
                $gte: previousMonthStart,
                $lt: nextMonthStart
            }
        });

        const currentSpending = {};
        const previousSpending = {};

        transactions.forEach((transaction) => {
            const category = transaction.category;
            const amount = transaction.amount;

            if (transaction.date >= currentMonthStart) {
                currentSpending[category] =
                    (currentSpending[category] || 0) + amount;
            } else {
                previousSpending[category] =
                    (previousSpending[category] || 0) + amount;
            }
        });

        const categories = new Set([
            ...Object.keys(currentSpending),
            ...Object.keys(previousSpending)
        ]);

        const insights = Array.from(categories).map((category) => {
            const currentMonthSpending =
                currentSpending[category] || 0;

            const previousMonthSpending =
                previousSpending[category] || 0;

            let changePercentage = null;
            let trend;
            let message;

            if (previousMonthSpending === 0) {
                if (currentMonthSpending > 0) {
                    trend = "new";
                    message =
                        `New spending in ${category} this month; ` +
                        "there is no previous-month baseline.";
                } else {
                    trend = "stable";
                    message = `No spending in ${category}.`;
                }
            } else {
                changePercentage = Number(
                    (
                        ((currentMonthSpending -
                            previousMonthSpending) /
                            previousMonthSpending) *
                        100
                    ).toFixed(2)
                );

                if (changePercentage >= 20) {
                    trend = "increased";
                    message =
                        `${category} spending increased by ` +
                        `${changePercentage}%.`;
                } else if (changePercentage <= -20) {
                    trend = "reduced";
                    message =
                        `${category} spending decreased by ` +
                        `${Math.abs(changePercentage)}%.`;
                } else {
                    trend = "stable";
                    message =
                        `${category} spending is relatively stable.`;
                }
            }

            return {
                category,
                currentMonthSpending,
                previousMonthSpending,
                changePercentage,
                trend,
                message
            };
        });

        insights.sort(
            (a, b) =>
                b.currentMonthSpending - a.currentMonthSpending
        );

        return res.status(200).json({
            success: true,
            month: monthNumber,
            year: yearNumber,
            insights
        });
    } catch (error) {
        console.error("Spending insights error:", error.message);

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
    getCategorySummary,
    getSpendingInsights
};
