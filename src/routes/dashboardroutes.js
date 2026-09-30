const express = require("express");

const {
    getDashboard
} = require("../controllers/dashboardcontroller");

const authMiddleware = require("../middlewares/authmiddleware");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Dashboard and financial overview APIs
 */

/**
 * @swagger
 * /api/dashboard:
 *   get:
 *     summary: Get complete financial dashboard
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   description: Dashboard information
 *       401:
 *         description: Unauthorized
 */
router.get("/", authMiddleware, getDashboard);

module.exports = router;