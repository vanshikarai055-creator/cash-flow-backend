const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");

// Register user
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validate required fields
        if (
            typeof name !== "string" ||
            !name.trim() ||
            typeof email !== "string" ||
            !email.trim() ||
            typeof password !== "string" ||
            password.length === 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Valid name, email and password are required"
            });
        }

        // Validate password length for bcrypt
        if (
            password.trim().length === 0 ||
            Buffer.byteLength(password, "utf8") > 72
        ) {
            return res.status(400).json({
                success: false,
                message: "Password must not be empty or exceed 72 UTF-8 bytes"
            });
        }

        const cleanName = name.trim();
        const cleanEmail = email.trim().toLowerCase();

        // Basic email format validation
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(cleanEmail)) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid email address"
            });
        }

        // Check whether the user already exists
        const existingUser = await User.findOne({
            email: cleanEmail
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User already exists"
            });
        }

        // Hash password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name: cleanName,
            email: cleanEmail,
            password: hashedPassword
        });

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        // Handle duplicate email if a unique database index exists
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "User already exists"
            });
        }

        console.error("Register error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// Login user
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate required fields
        if (
            typeof email !== "string" ||
            !email.trim() ||
            typeof password !== "string" ||
            password.length === 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Valid email and password are required"
            });
        }

        if (Buffer.byteLength(password, "utf8") > 72) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const cleanEmail = email.trim().toLowerCase();

        // Check JWT configuration
        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET is not configured");

            return res.status(500).json({
                success: false,
                message: "Authentication service is not configured"
            });
        }

        // Find user and retrieve password hash
        const user = await User.findOne({
            email: cleanEmail
        }).select("+password");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Compare submitted password with stored hash
        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Generate JWT
        const token = jwt.sign(
            {
                userId: user._id.toString()
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES_IN || "7d",
                algorithm: "HS256"
            }
        );

        return res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error("Login error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

module.exports = {
    registerUser,
    loginUser
};