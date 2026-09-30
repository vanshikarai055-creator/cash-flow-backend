const express = require("express");

const router = express.Router();

const {
    getDashboard
} = require("../controllers/dashboardcontroller");

const authMiddleware = require("../middlewares/authmiddleware");

router.get(
    "/",
    authMiddleware,
    getDashboard
);

module.exports = router;