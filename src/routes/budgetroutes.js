
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
 *                 minimum: 1
 *                 maximum: 12
 *                 example: 10
 *               year:
 *                 type: integer
 *                 minimum: 2000
 *                 maximum: 9999
 *                 example: 2026
 *     responses:
 *       201:
 *         description: Budget created successfully
 *       400:
 *         description: Invalid budget data
 *       401:
 *         description: Unauthorized
 *       409:
 *         description: Budget already exists for this category and month
 */
router.post("/", authMiddleware, createBudget);

/**
 * @swagger
 * /api/budget:
 *   get:
 *     summary: Get all budgets for a month and year
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
 *         example: 10
 *       - in: query
 *         name: year
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 2000
 *           maximum: 9999
 *         example: 2026
 *     responses:
 *       200:
 *         description: Budgets retrieved successfully
 *       400:
 *         description: Invalid month or year
 *       401:
 *         description: Unauthorized
 */
router.get("/", authMiddleware, getBudgets);

/**
 * @swagger
 * /api/budget/status:
 *   get:
 *     summary: Get budget status and spending alerts
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
 *         example: 10
 *       - in: query
 *         name: year
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 2000
 *           maximum: 9999
 *         example: 2026
 *     responses:
 *       200:
 *         description: Budget status retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 month:
 *                   type: integer
 *                   example: 10
 *                 year:
 *                   type: integer
 *                   example: 2026
 *                 budgets:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       category:
 *                         type: string
 *                         example: Food
 *                       budget:
 *                         type: number
 *                         example: 5000
 *                       spent:
 *                         type: number
 *                         example: 4200
 *                       remaining:
 *                         type: number
 *                         example: 800
 *                       exceeded:
 *                         type: boolean
 *                         example: false
 *                       usagePercentage:
 *                         type: number
 *                         example: 84
 *                       alert:
 *                         type: object
 *                         properties:
 *                           level:
 *                             type: string
 *                             enum: [normal, warning, exceeded]
 *                             example: warning
 *                           message:
 *                             type: string
 *                             example: You have used at least 80% of your budget.
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
 *                 exclusiveMinimum: 0
 *                 example: 6000
 *     responses:
 *       200:
 *         description: Budget updated successfully
 *       400:
 *         description: Invalid budget data
 *       404:
 *         description: Budget not found
 *       409:
 *         description: Budget already exists for this category and month
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
 *       400:
 *         description: Invalid budget ID
 *       404:
 *         description: Budget not found
 *       401:
 *         description: Unauthorized
 */
router.delete("/:id", authMiddleware, deleteBudget);

module.exports = router;
