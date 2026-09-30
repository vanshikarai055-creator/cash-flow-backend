const express = require("express");

const router = express.Router();

const {
    createBudget,
    getBudgets,
    getBudgetStatus,
    updateBudget,
    deleteBudget
} = require("../controllers/budgetcontroller");

const authMiddleware = require("../middlewares/authmiddleware");

router.post(
    "/",
    authMiddleware,
    createBudget
);
router.get(
    "/",
    authMiddleware,
    getBudgets
);
router.get(
    "/status",
    authMiddleware,
    getBudgetStatus
);
router.put("/:id", authMiddleware, updateBudget);

router.delete("/:id", authMiddleware, deleteBudget);
module.exports = router;