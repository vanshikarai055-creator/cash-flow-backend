
const mongoose = require("mongoose");
const Transaction = require("../models/transaction.model");

// CREATE TRANSACTION
const createTransaction = async (req, res, next) => {
    try {
        const {
            amount,
            type,
            category,
            description,
            date
        } = req.body;

        // 1. Check required fields
        if (
            amount === undefined ||
            type === undefined ||
            category === undefined
        ) {
            return res.status(400).json({
                success: false,
                message: "Amount, type and category are required"
            });
        }

        // 2. Validate amount
        if (
            typeof amount !== "number" ||
            !Number.isFinite(amount) ||
            amount <= 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Amount must be a positive number"
            });
        }

        // 3. Validate transaction type
        if (!["income", "expense"].includes(type)) {
            return res.status(400).json({
                success: false,
                message: "Type must be income or expense"
            });
        }

        // 4. Validate category
        if (
            typeof category !== "string" ||
            category.trim() === ""
        ) {
            return res.status(400).json({
                success: false,
                message: "Category must be a non-empty string"
            });
        }

        // 5. Validate description if provided
        if (
            description !== undefined &&
            typeof description !== "string"
        ) {
            return res.status(400).json({
                success: false,
                message: "Description must be a string"
            });
        }

        // 6. Validate date if provided
        let parsedDate;

        if (date !== undefined) {
            if (
                typeof date !== "string" ||
                date.trim() === "" ||
                Number.isNaN(Date.parse(date))
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Please provide a valid date"
                });
            }

            parsedDate = new Date(date);
        }

        // 7. Create transaction
        const transactionData = {
            userId: req.user.userId,
            amount,
            type,
            category: category.trim()
        };

        if (description !== undefined) {
            transactionData.description = description;
        }

        if (parsedDate !== undefined) {
            transactionData.date = parsedDate;
        }

        const transaction = await Transaction.create(transactionData);

        return res.status(201).json({
            success: true,
            message: "Transaction created successfully",
            transaction
        });

    } catch (error) {
        console.error("Create transaction error:", error);
        next(error);
    }
};


// GET ALL TRANSACTIONS WITH PAGINATION
const getAllTransactions = async (req, res, next) => {
    try {
        const userId = req.user.userId;

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;

        // Validate page and limit
        if (
            !Number.isInteger(page) ||
            !Number.isInteger(limit) ||
            page < 1 ||
            limit < 1
        ) {
            return res.status(400).json({
                success: false,
                message: "Page and limit must be positive integers"
            });
        }

        // Prevent very large requests
        if (limit > 100) {
            return res.status(400).json({
                success: false,
                message: "Limit cannot be greater than 100"
            });
        }

        // Calculate documents to skip
        const skip = (page - 1) * limit;

        // Get only the logged-in user's transactions
        const transactions = await Transaction.find({ userId })
            .sort({ date: -1 })
            .skip(skip)
            .limit(limit);

        // Count total transactions for this user
        const totalTransactions = await Transaction.countDocuments({
            userId
        });

        const totalPages = Math.ceil(totalTransactions / limit);

        return res.status(200).json({
            success: true,
            pagination: {
                currentPage: page,
                limit,
                totalTransactions,
                totalPages
            },
            transactions
        });

    } catch (error) {
        console.error("Get all transactions error:", error);
        next(error);
    }
};


// GET TRANSACTION BY ID
const getTransactionById = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Validate MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid transaction ID"
            });
        }

        // Find transaction belonging to the logged-in user
        const transaction = await Transaction.findOne({
            _id: id,
            userId: req.user.userId
        });

        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: "Transaction not found"
            });
        }

        return res.status(200).json({
            success: true,
            transaction
        });

    } catch (error) {
        console.error("Get transaction error:", error);
        next(error);
    }
};


// PUT UPDATE TRANSACTION
const updateTransaction = async (req, res, next) => {
    try {
        const { id } = req.params;

        // 1. Validate transaction ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid transaction ID"
            });
        }

        const {
            amount,
            type,
            category,
            description,
            date
        } = req.body;

        // 2. Required fields
        if (
            amount === undefined ||
            type === undefined ||
            category === undefined
        ) {
            return res.status(400).json({
                success: false,
                message: "Amount, type and category are required"
            });
        }

        // 3. Validate amount
        if (
            typeof amount !== "number" ||
            !Number.isFinite(amount) ||
            amount <= 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Amount must be a positive number"
            });
        }

        // 4. Validate type
        if (!["income", "expense"].includes(type)) {
            return res.status(400).json({
                success: false,
                message: "Type must be income or expense"
            });
        }

        // 5. Validate category
        if (
            typeof category !== "string" ||
            category.trim() === ""
        ) {
            return res.status(400).json({
                success: false,
                message: "Category must be a non-empty string"
            });
        }

        // 6. Validate description if provided
        if (
            description !== undefined &&
            typeof description !== "string"
        ) {
            return res.status(400).json({
                success: false,
                message: "Description must be a string"
            });
        }

        // 7. Validate date if provided
        let parsedDate;

        if (date !== undefined) {
            if (
                typeof date !== "string" ||
                date.trim() === "" ||
                Number.isNaN(Date.parse(date))
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Please provide a valid date"
                });
            }

            parsedDate = new Date(date);
        }

        // 8. Prepare update data
        const updateData = {
            amount,
            type,
            category: category.trim()
        };

        if (description !== undefined) {
            updateData.description = description;
        }

        if (parsedDate !== undefined) {
            updateData.date = parsedDate;
        }

        // 9. Update only the logged-in user's transaction
        const transaction = await Transaction.findOneAndUpdate(
            {
                _id: id,
                userId: req.user.userId
            },
            updateData,
            {
                new: true,
                runValidators: true
            }
        );

        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: "Transaction not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Transaction updated successfully",
            transaction
        });

    } catch (error) {
        console.error("Update transaction error:", error);
        next(error);
    }
};


// PATCH UPDATE TRANSACTION
const patchTransaction = async (req, res, next) => {
    try {
        const { id } = req.params;

        // 1. Validate transaction ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid transaction ID"
            });
        }

        const {
            amount,
            type,
            category,
            description,
            date
        } = req.body;

        // 2. Validate amount only if provided
        if (amount !== undefined) {
            if (
                typeof amount !== "number" ||
                !Number.isFinite(amount) ||
                amount <= 0
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Amount must be a positive number"
                });
            }
        }

        // 3. Validate type only if provided
        if (type !== undefined) {
            if (!["income", "expense"].includes(type)) {
                return res.status(400).json({
                    success: false,
                    message: "Type must be income or expense"
                });
            }
        }

        // 4. Validate category only if provided
        if (category !== undefined) {
            if (
                typeof category !== "string" ||
                category.trim() === ""
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Category must be a non-empty string"
                });
            }
        }

        // 5. Validate description if provided
        if (
            description !== undefined &&
            typeof description !== "string"
        ) {
            return res.status(400).json({
                success: false,
                message: "Description must be a string"
            });
        }

        // 6. Validate date if provided
        let parsedDate;

        if (date !== undefined) {
            if (
                typeof date !== "string" ||
                date.trim() === "" ||
                Number.isNaN(Date.parse(date))
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Please provide a valid date"
                });
            }

            parsedDate = new Date(date);
        }

        // 7. Create update object
        const updateData = {};

        if (amount !== undefined) {
            updateData.amount = amount;
        }

        if (type !== undefined) {
            updateData.type = type;
        }

        if (category !== undefined) {
            updateData.category = category.trim();
        }

        if (description !== undefined) {
            updateData.description = description;
        }

        if (parsedDate !== undefined) {
            updateData.date = parsedDate;
        }

        // 8. Ensure at least one field was provided
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                success: false,
                message: "At least one field is required to update"
            });
        }

        // 9. Update only the logged-in user's transaction
        const transaction = await Transaction.findOneAndUpdate(
            {
                _id: id,
                userId: req.user.userId
            },
            updateData,
            {
                new: true,
                runValidators: true
            }
        );

        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: "Transaction not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Transaction partially updated successfully",
            transaction
        });

    } catch (error) {
        console.error("Patch transaction error:", error);
        next(error);
    }
};


// DELETE TRANSACTION
const deleteTransaction = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Validate MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid transaction ID"
            });
        }

        // Delete only the logged-in user's transaction
        const transaction = await Transaction.findOneAndDelete({
            _id: id,
            userId: req.user.userId
        });

        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: "Transaction not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Transaction deleted successfully"
        });

    } catch (error) {
        console.error("Delete transaction error:", error);
        next(error);
    }
};


// FILTER TRANSACTIONS WITH PAGINATION
const filterTransactions = async (req, res, next) => {
    try {
        const userId = req.user.userId;

        const {
            type,
            category,
            startDate,
            endDate
        } = req.query;

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;

        // 1. Validate page and limit
        if (
            !Number.isInteger(page) ||
            !Number.isInteger(limit) ||
            page < 1 ||
            limit < 1
        ) {
            return res.status(400).json({
                success: false,
                message: "Page and limit must be positive integers"
            });
        }

        // 2. Prevent very large requests
        if (limit > 100) {
            return res.status(400).json({
                success: false,
                message: "Limit cannot be greater than 100"
            });
        }

        // 3. Base filter: current user only
        const filter = { userId };

        // 4. Filter by type
        if (type) {
            if (!["income", "expense"].includes(type)) {
                return res.status(400).json({
                    success: false,
                    message: "Type must be income or expense"
                });
            }

            filter.type = type;
        }

        // 5. Filter by category
        if (category) {
            if (typeof category !== "string") {
                return res.status(400).json({
                    success: false,
                    message: "Category must be a string"
                });
            }

            filter.category = category.trim();
        }

        // 6. Filter by date
        let start;
        let end;

        if (startDate) {
            start = new Date(startDate);

            if (Number.isNaN(start.getTime())) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid start date"
                });
            }
        }

        if (endDate) {
            end = new Date(endDate);

            if (Number.isNaN(end.getTime())) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid end date"
                });
            }

            // Include the entire end date
            end.setHours(23, 59, 59, 999);
        }

        // 7. Validate date range
        if (start && end && start > end) {
            return res.status(400).json({
                success: false,
                message: "Start date cannot be after end date"
            });
        }

        if (start || end) {
            filter.date = {};

            if (start) {
                filter.date.$gte = start;
            }

            if (end) {
                filter.date.$lte = end;
            }
        }

        // 8. Pagination
        const skip = (page - 1) * limit;

        // 9. Get matching transactions for this user
        const transactions = await Transaction.find(filter)
            .sort({ date: -1 })
            .skip(skip)
            .limit(limit);

        // 10. Count matching transactions
        const totalTransactions =
            await Transaction.countDocuments(filter);

        const totalPages = Math.ceil(totalTransactions / limit);

        return res.status(200).json({
            success: true,
            pagination: {
                currentPage: page,
                limit,
                totalTransactions,
                totalPages
            },
            transactions
        });

    } catch (error) {
        console.error("Filter transactions error:", error);
        next(error);
    }
};


// EXPORT CONTROLLERS
module.exports = {
    createTransaction,
    getAllTransactions,
    getTransactionById,
    updateTransaction,
    patchTransaction,
    deleteTransaction,
    filterTransactions
};
