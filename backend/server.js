import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import Razorpay from "razorpay";
import dotenv from "dotenv";
import mysql from "mysql2/promise"; // Using promise-based MySQL
import authRoutes from "./routes/auth.routes.js";
import movieRoutes from "./routes/movie.route.js";
import paymentRoutes from "./routes/payment.routes.js"; // Payment Routes
import { ENV_VARS } from "./config/envVars.js";
import { connectDB } from "./config/db.js";

dotenv.config();

const app = express();
const PORT = ENV_VARS.PORT || 5000;

// CORS Configuration
app.use(
  cors({
    origin: "*",
    credentials: true, // Allow cookies & authentication headers
  })
);

app.use(express.json());
app.use(cookieParser());

// ✅ Connect to MySQL Database (Using async/await)
const connectToDatabase = async () => {
  try {
    global.db = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "Rishabh@123",
      database: "netflix_clone",
    });
    console.log("✅ Connected to MySQL Database");
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    process.exit(1);
  }
};

connectToDatabase();

// ✅ Razorpay Configuration
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ✅ Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/movie", movieRoutes);
app.use("/api/v1/payment", paymentRoutes); // Payment API

app.get("/", (req, res) => {
  res.send("Welcome to the Netflix Clone API 🚀");
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  connectDB();
});
