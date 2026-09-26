import express from "express";
import { sendContactEmail } from "../utils/sendEmail.js";

const router = express.Router();

// POST /api/contact
router.post("/contact", async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ message: "Name, email and message are required" });
    }

    await sendContactEmail({ name, email, phone, message });
    res.status(200).json({ message: "Your message has been sent successfully!" });
  } catch (err) {
    console.error("Contact form error:", err);
    res.status(500).json({ message: "Failed to send message. Please try again later." });
  }
});

export default router;
