const express = require("express");

const {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    patchCategory,
    deleteCategory
} = require("../controllers/categorycontroller");

const authMiddleware = require("../middlewares/authmiddleware");

const router = express.Router();

router.post("/", authMiddleware, createCategory);
router.get("/",authMiddleware,getAllCategories);
router.get("/:id",authMiddleware,getCategoryById);
router.put("/:id",authMiddleware,updateCategory);
router.patch("/:id",authMiddleware,patchCategory);
router.delete("/:id",authMiddleware,deleteCategory);

module.exports = router;