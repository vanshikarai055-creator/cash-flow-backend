const express = require("express");

const {
    getSummary,
    getMonthlySummary,
    getYearlySummary,
    getCategorySummary
} = require("../controllers/summarycontroller");

const authMiddleware = require("../middlewares/authmiddleware");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Summary
 *   description: Financial summary and analytics APIs
 */

/**
 * @swagger
 * /api/summary:
 *   get:
 *     summary: Get overall financial summary
 *     tags: [Summary]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Overall financial summary retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/", authMiddleware, getSummary);

/**
 * @swagger
 * /api/summary/monthly:
 *   get:
 *     summary: Get monthly financial summary
 *     tags: [Summary]
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
 *         description: Month number
 *       - in: query
 *         name: year
 *         required: true
 *         schema:
 *           type: integer
 *         example: 2026
 *         description: Year
 *     responses:
 *       200:
 *         description: Monthly summary retrieved successfully
 *       400:
 *         description: Invalid month or year
 *       401:
 *         description: Unauthorized
 */
router.get("/monthly", authMiddleware, getMonthlySummary);

/**
 * @swagger
 * /api/summary/yearly:
 *   get:
 *     summary: Get yearly financial summary
 *     tags: [Summary]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: year
 *         required: true
 *         schema:
 *           type: integer
 *         example: 2026
 *         description: Year
 *     responses:
 *       200:
 *         description: Yearly summary retrieved successfully
 *       400:
 *         description: Invalid year
 *       401:
 *         description: Unauthorized
 */
router.get("/yearly", authMiddleware, getYearlySummary);

/**
 * @swagger
 * /api/summary/category:
 *   get:
 *     summary: Get expense summary by category
 *     tags: [Summary]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Category-wise expense summary retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/category", authMiddleware, getCategorySummary);

module.exports = router;