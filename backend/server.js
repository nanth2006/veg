import cors from "cors";
import mongoose from "mongoose";
import express from "express";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

import productRoutes from "./routes/productRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";

dotenv.config();

const app = express();

// Allow multiple origins in development and production
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (like mobile apps, curl, postman)
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith(".vercel.app") ||
        origin.endsWith(".onrender.com") ||
        origin.endsWith(".netlify.app") ||
        origin.includes("localhost")
      ) {
        return callback(null, true);
      }
      return callback(null, true); // Permissive in dev/testing to prevent CORS blocks
    },
    credentials: true,
  })
);

app.use(express.json());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api", productRoutes);
app.use("/api", orderRoutes);
app.use("/api", contactRoutes);

// Health check endpoint (for deployment uptime / Render ping)
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    emailConfigured: Boolean(process.env.EMAIL_USER && process.env.EMAIL_PASS),
  });
});

// Test Email endpoint (helps test Gmail app password directly)
app.get("/api/test-email", async (req, res) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    return res.status(400).json({
      success: false,
      message: "EMAIL_USER or EMAIL_PASS not configured in .env",
    });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const target = req.query.to || process.env.ADMIN_EMAIL || process.env.EMAIL_USER;
    const info = await transporter.sendMail({
      from: `"FreshVeg Store Test" <${process.env.EMAIL_USER}>`,
      to: target,
      subject: "🥦 FreshVeg Store — Email Test Notification",
      html: `
        <div style="font-family:Arial,sans-serif;padding:20px;border-radius:12px;background:#f0fdf4;border:1px solid #86efac;max-width:500px;">
          <h2 style="color:#15803d;margin-top:0;">Email Setup Working! ✅</h2>
          <p style="color:#166534;">Your Gmail App Password and Nodemailer configuration for FreshVeg Store are working perfectly.</p>
          <p style="font-size:12px;color:#4ade80;">Sent at: ${new Date().toLocaleString()}</p>
        </div>
      `,
    });

    res.json({
      success: true,
      message: `Test email sent successfully to ${target}!`,
      messageId: info.messageId,
    });
  } catch (err) {
    console.error("Test email failed:", err);
    res.status(500).json({
      success: false,
      message: "Failed to send test email",
      error: err.message,
    });
  }
});

app.get("/", (req, res) => res.send("🥦 FreshVeg Direct E-Commerce API is running ✅"));

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected ✅");
    app.listen(PORT, () => {
      console.log(`🥦 FreshVeg Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed ❌", err.message);
  });
