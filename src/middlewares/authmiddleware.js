
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        // Check whether the token exists
        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: "Authorization token is required"
            });
        }

        // Validate Bearer token format
        const parts = authHeader.split(" ");

        if (
            parts.length !== 2 ||
            parts[0] !== "Bearer" ||
            !parts[1]
        ) {
            return res.status(401).json({
                success: false,
                message: "Invalid authorization format"
            });
        }

        const token = parts[1];

        // Ensure JWT secret is configured
        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET is not configured");

            return res.status(500).json({
                success: false,
                message: "Authentication service is not configured"
            });
        }

        // Verify the token signature and expiration
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET,
            { algorithms: ["HS256"] }
        );

        // Ensure the token contains a user ID
        if (!decoded || !decoded.userId) {
            return res.status(401).json({
                success: false,
                message: "Invalid token payload"
            });
        }

        req.user = decoded;

        return next();

    } catch (error) {
        if (error.name !== "TokenExpiredError" &&
            error.name !== "JsonWebTokenError" &&
            error.name !== "NotBeforeError") {
            console.error("Auth middleware error:", error.message);
        }

        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
};

module.exports = authMiddleware;
