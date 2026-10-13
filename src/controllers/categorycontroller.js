
const mongoose = require("mongoose");
const Category = require("../models/category.model");

// CREATE CATEGORY
const createCategory = async (req, res, next) => {
    try {
        const { name, type } = req.body;

        // 1. Validate required fields
        if (
            typeof name !== "string" ||
            name.trim() === "" ||
            type === undefined
        ) {
            return res.status(400).json({
                success: false,
                message: "A valid name and type are required"
            });
        }

        // 2. Validate category type
        if (!["income", "expense"].includes(type)) {
            return res.status(400).json({
                success: false,
                message: "Type must be income or expense"
            });
        }

        const normalizedName = name.trim();

        // 3. Check duplicate category for this user
        const existingCategory = await Category.findOne({
            userId: req.user.userId,
            name: normalizedName,
            type
        });

        if (existingCategory) {
            return res.status(409).json({
                success: false,
                message: "Category already exists"
            });
        }

        // 4. Create category
        const category = await Category.create({
            userId: req.user.userId,
            name: normalizedName,
            type
        });

        return res.status(201).json({
            success: true,
            message: "Category created successfully",
            category
        });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "Category already exists"
            });
        }

        next(error);
    }
};


// GET ALL CATEGORIES
const getAllCategories = async (req, res, next) => {
    try {
        const categories = await Category.find({
            userId: req.user.userId
        }).sort({ name: 1 });

        return res.status(200).json({
            success: true,
            count: categories.length,
            categories
        });

    } catch (error) {
        next(error);
    }
};


// GET CATEGORY BY ID
const getCategoryById = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Validate MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid category ID"
            });
        }

        // Only find categories belonging to this user
        const category = await Category.findOne({
            _id: id,
            userId: req.user.userId
        });

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        return res.status(200).json({
            success: true,
            category
        });

    } catch (error) {
        next(error);
    }
};


// PUT UPDATE CATEGORY
const updateCategory = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, type } = req.body;

        // 1. Validate MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid category ID"
            });
        }

        // 2. Validate required fields
        if (
            typeof name !== "string" ||
            name.trim() === "" ||
            type === undefined
        ) {
            return res.status(400).json({
                success: false,
                message: "A valid name and type are required"
            });
        }

        // 3. Validate type
        if (!["income", "expense"].includes(type)) {
            return res.status(400).json({
                success: false,
                message: "Type must be income or expense"
            });
        }

        const normalizedName = name.trim();

        // 4. Prevent duplicate categories for the same user
        const existingCategory = await Category.findOne({
            userId: req.user.userId,
            name: normalizedName,
            type,
            _id: { $ne: id }
        });

        if (existingCategory) {
            return res.status(409).json({
                success: false,
                message: "Category already exists"
            });
        }

        // 5. Update only the current user's category
        const category = await Category.findOneAndUpdate(
            {
                _id: id,
                userId: req.user.userId
            },
            {
                name: normalizedName,
                type
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Category updated successfully",
            category
        });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "Category already exists"
            });
        }

        next(error);
    }
};


// PATCH UPDATE CATEGORY
const patchCategory = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, type } = req.body;

        // 1. Validate MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid category ID"
            });
        }

        // 2. Validate name if provided
        if (name !== undefined) {
            if (
                typeof name !== "string" ||
                name.trim() === ""
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Name must be a non-empty string"
                });
            }
        }

        // 3. Validate type if provided
        if (
            type !== undefined &&
            !["income", "expense"].includes(type)
        ) {
            return res.status(400).json({
                success: false,
                message: "Type must be income or expense"
            });
        }

        // 4. Build update object
        const updateData = {};

        if (name !== undefined) {
            updateData.name = name.trim();
        }

        if (type !== undefined) {
            updateData.type = type;
        }

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                success: false,
                message: "At least one field is required to update"
            });
        }

        // 5. Check duplicate name/type combination
        const currentCategory = await Category.findOne({
            _id: id,
            userId: req.user.userId
        });

        if (!currentCategory) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        const finalName =
            updateData.name !== undefined
                ? updateData.name
                : currentCategory.name;

        const finalType =
            updateData.type !== undefined
                ? updateData.type
                : currentCategory.type;

        const duplicate = await Category.findOne({
            userId: req.user.userId,
            name: finalName,
            type: finalType,
            _id: { $ne: id }
        });

        if (duplicate) {
            return res.status(409).json({
                success: false,
                message: "Category already exists"
            });
        }

        // 6. Update only the current user's category
        const category = await Category.findOneAndUpdate(
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

        return res.status(200).json({
            success: true,
            message: "Category partially updated successfully",
            category
        });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "Category already exists"
            });
        }

        next(error);
    }
};


// DELETE CATEGORY
const deleteCategory = async (req, res, next) => {
    try {
        const { id } = req.params;

        // 1. Validate MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid category ID"
            });
        }

        // 2. Delete only the current user's category
        const category = await Category.findOneAndDelete({
            _id: id,
            userId: req.user.userId
        });

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Category deleted successfully"
        });

    } catch (error) {
        next(error);
    }
};


module.exports = {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    patchCategory,
    deleteCategory
};
