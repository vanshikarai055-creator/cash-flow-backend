const Transaction = require("../models/transaction.model");
const Budget = require("../models/budget.model");

const getDashboard = async (req, res) => {
    try {
        const userId = req.user.userId;

        // Get all transactions
        const transactions = await Transaction.find({
            userId
        }).sort({ date: -1 });

        // Calculate income and expense
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

        // Category-wise expenses
        const categorySpending = {};

        transactions.forEach((transaction) => {
            if (transaction.type === "expense") {
                const category = transaction.category;

                if (!categorySpending[category]) {
                    categorySpending[category] = 0;
                }

                categorySpending[category] += transaction.amount;
            }
        });

        // Get latest 5 transactions
        const recentTransactions = transactions.slice(0, 5);

        // Get current date
        const currentDate = new Date();

        const currentMonth = currentDate.getMonth() + 1;
        const currentYear = currentDate.getFullYear();

        // Get current month's budgets
        const budgets = await Budget.find({
            userId,
            month: currentMonth,
            year: currentYear
        });
        const budgetStatus = budgets.map((budget) => {
        const spent = categorySpending[budget.category] || 0;

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

            summary: {
                totalIncome,
                totalExpense,
                balance,
                transactionCount: transactions.length
            },

            categorySpending,

            budgetStatus,

            recentTransactions
        });

    } catch (error) {
        console.error("Dashboard error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

module.exports = {
    getDashboard
};