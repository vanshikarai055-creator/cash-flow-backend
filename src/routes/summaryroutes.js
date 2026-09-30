const express = require("express");

const {
    getSummary,
    getMonthlySummary,
    getYearlySummary,
    getCategorySummary

} = require("../controllers/summarycontroller");

const authMiddleware = require("../middlewares/authmiddleware");

const router = express.Router();

router.get("/", authMiddleware, getSummary);
router.get("/monthly", authMiddleware, getMonthlySummary);
router.get("/yearly", authMiddleware, getYearlySummary);
router.get("/categories", authMiddleware, getCategorySummary);

module.exports = router;