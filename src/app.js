const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const express = require("express");

const authRoutes = require("./routes/authRoutes");
const transactionRoutes = require("./routes/transactionroutes");
const categoryRoutes = require("./routes/categoryroutes");
const summaryRoutes = require("./routes/summaryroutes");
const budgetRoutes = require("./routes/budgetroutes");
const dashboardRoutes = require("./routes/dashboardroutes");
const errorMiddleware = require("./middlewares/errormiddleware");

const app = express();

// Security middleware
app.use(helmet());

app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true
}));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        success: false,
        message: "Too many requests, please try again later"
    }
});

app.use(limiter);


// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);

app.use("/api/transactions", transactionRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/summary", summaryRoutes);
app.use("/api/budget", budgetRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Home route
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Cash Flow API is running"
    });
});

// Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Error middleware
app.use(errorMiddleware);

module.exports = app;