const express = require("express");

const {
    createBudget,
    getBudgets,
    getBudgetStatus,
    updateBudget,
    deleteBudget
} = require("../controllers/budgetcontroller");

const authMiddleware = require("../middlewares/authmiddleware");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Budgets
 *   description: Budget management APIs
 */

/**
 * @swagger
 * /api/budget:
 *   post:
 *     summary: Create a budget
 *     tags: [Budgets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - category
 *               - amount
 *               - month
 *               - year
 *             properties:
 *               category:
 *                 type: string
 *                 example: Food
 *               amount:
 *                 type: number
 *                 example: 5000
 *               month:
 *                 type: integer
 *                 example: 9
 *               year:
 *                 type: integer
 *                 example: 2026
 *     responses:
 *       201:
 *         description: Budget created successfully
 *       400:
 *         description: Invalid budget data
 *       401:
 *         description: Unauthorized
 */
router.post("/", authMiddleware, createBudget);

/**
 * @swagger
 * /api/budget:
 *   get:
 *     summary: Get all budgets
 *     tags: [Budgets]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Budgets retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/", authMiddleware, getBudgets);

/**
 * @swagger
 * /api/budget/status:
 *   get:
 *     summary: Get budget status
 *     tags: [Budgets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: month
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *         example: 9
 *       - in: query
 *         name: year
 *         required: true
 *         schema:
 *           type: integer
 *         example: 2026
 *     responses:
 *       200:
 *         description: Budget status retrieved successfully
 *       400:
 *         description: Invalid month or year
 *       401:
 *         description: Unauthorized
 */
router.get("/status", authMiddleware, getBudgetStatus);

/**
 * @swagger
 * /api/budget/{id}:
 *   put:
 *     summary: Update a budget
 *     tags: [Budgets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Budget ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               category:
 *                 type: string
 *                 example: Groceries
 *               amount:
 *                 type: number
 *                 example: 6000
 *               month:
 *                 type: integer
 *                 example: 9
 *               year:
 *                 type: integer
 *                 example: 2026
 *     responses:
 *       200:
 *         description: Budget updated successfully
 *       404:
 *         description: Budget not found
 *       401:
 *         description: Unauthorized
 */
router.put("/:id", authMiddleware, updateBudget);

/**
 * @swagger
 * /api/budget/{id}:
 *   delete:
 *     summary: Delete a budget
 *     tags: [Budgets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Budget ID
 *     responses:
 *       200:
 *         description: Budget deleted successfully
 *       404:
 *         description: Budget not found
 *       401:
 *         description: Unauthorized
 */
router.delete("/:id", authMiddleware, deleteBudget);

module.exports = router;