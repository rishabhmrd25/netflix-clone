import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { generateTokenAndSetCookie } from "../utils/generateToken.js";
import jwt from "jsonwebtoken";
import { ENV_VARS } from "../config/envVars.js";

export async function signup(req, res) {
    try {
        const { email, password, username } = req.body;

        if (!email || !password || !username) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ success: false, message: "Invalid email" });
        }

        if (password.length < 6) {
            return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
        }

        const existingUserByEmail = await User.findOne({ where: { email } });

        if (existingUserByEmail) {
            return res.status(400).json({ success: false, message: "Email already exists" });
        }

        const existingUserByUsername = await User.findOne({ where: { username } });

        if (existingUserByUsername) {
            return res.status(400).json({ success: false, message: "Username already exists" });
        }

        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        const newUser = await User.create({
            email,
            password: hashedPassword,
            username,
        });

        generateTokenAndSetCookie(newUser.id, res);

        res.status(201).json({
            success: true,
            user: {
                id: newUser.id,
                email: newUser.email,
                username: newUser.username,
            },
        });
    } catch (error) {
        console.log("Error in signup controller", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export async function login(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ success: false, message: "Invalid credentials" });
        }

        const isPasswordCorrect = await bcryptjs.compare(password, user.password);

        if (!isPasswordCorrect) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        const token = generateTokenAndSetCookie(user.id, res);

        res.status(200).json({
            success: true,
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                isSubscribed: user.issubscriber,
                token: token
            },
        });
    } catch (error) {
        console.log("Error in login controller", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export async function updateSubscriptionStatus(req, res) {
    try {
        // Get token from request headers
        const token = req.headers.authorization?.split(" ")[1];
        
        if (!token) {
            return res.status(401).json({ success: false, message: "No token provided" });
        }

        // Verify and decode token
        const decoded = jwt.verify(token, ENV_VARS.JWT_SECRET);
        const userId = decoded.userId;

        // Find user by ID
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Update isSubscriber to true
        user.issubscriber = true;
        await user.save();

        res.status(200).json({
            success: true,
            message: "Subscription activated successfully",
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                issubscriber: user.issubscriber
            }
        });
    } catch (error) {
        console.error("Error updating subscription:", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export async function logout(req, res) {
    try {
        res.clearCookie("jwt-netflix");
        res.status(200).json({ success: true, message: "Logged out successfully" });
    } catch (error) {
        console.log("Error in logout controller", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}
