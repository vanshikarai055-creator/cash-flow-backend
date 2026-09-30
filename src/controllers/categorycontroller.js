const Category = require("../models/category.model");

const createCategory = async (req, res) => {
    try {
        const { name, type } = req.body;

        // 1. Validate required fields
        if (!name || !type) {
            return res.status(400).json({
                success: false,
                message: "Name and type are required"
            });
        }

        // 2. Validate category type
        if (!["income", "expense"].includes(type)) {
            return res.status(400).json({
                success: false,
                message: "Type must be income or expense"
            });
        }

        // 3. Check if category already exists for this user
        const existingCategory = await Category.findOne({
            userId: req.user.userId,
            name: name.trim(),
            type
        });

        if (existingCategory) {
            return res.status(400).json({
                success: false,
                message: "Category already exists"
            });
        }

        // 4. Create category
        const category = await Category.create({
            userId: req.user.userId,
            name: name.trim(),
            type
        });

        // 5. Send response
        return res.status(201).json({
            success: true,
            message: "Category created successfully",
            category
        });

    } catch (error) {
        console.error("Create category error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};
const getAllCategories = async (req, res) => {
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
        console.error("Get categories error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};
const getCategoryById = async (req, res) => {
    try {
        const category = await Category.findOne({
            _id: req.params.id,
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
        console.error("Get category error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};
const updateCategory = async (req, res) => {
    try {
        const { name, type } = req.body;

        // 1. Validate required fields
        if (!name || !type) {
            return res.status(400).json({
                success: false,
                message: "Name and type are required"
            });
        }

        // 2. Validate category type
        if (!["income", "expense"].includes(type)) {
            return res.status(400).json({
                success: false,
                message: "Type must be income or expense"
            });
        }

        // 3. Update category
        const category = await Category.findOneAndUpdate(
            {
                _id: req.params.id,
                userId: req.user.userId
            },
            {
                name: name.trim(),
                type
            },
            {
                new: true,
                runValidators: true
            }
        );

        // 4. Category not found
        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        // 5. Send updated category
        return res.status(200).json({
            success: true,
            message: "Category updated successfully",
            category
        });

    } catch (error) {
        console.error("Update category error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};
const patchCategory = async (req, res) => {
    try {
        const { name, type } = req.body;

        // Validate type only if provided
        if (type && !["income", "expense"].includes(type)) {
            return res.status(400).json({
                success: false,
                message: "Type must be income or expense"
            });
        }

        // Build only the fields that were sent
        const updateData = {};

        if (name !== undefined) {
            updateData.name = name.trim();
        }

        if (type !== undefined) {
            updateData.type = type;
        }

        // Don't allow empty PATCH request
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                success: false,
                message: "At least one field is required to update"
            });
        }

        const category = await Category.findOneAndUpdate(
            {
                _id: req.params.id,
                userId: req.user.userId
            },
            updateData,
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
            message: "Category partially updated successfully",
            category
        });

    } catch (error) {
        console.error("Patch category error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};
const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findOneAndDelete({
            _id: req.params.id,
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
        console.error("Delete category error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
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