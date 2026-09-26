// One-time helper: promotes an already-registered user to "admin".
// Run this AFTER you've registered normally on the website with your
// email + password, so the account already exists.
//
// Usage:
//   cd backend
//   node scripts/makeAdmin.js your@email.com
//
import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();

const email = process.argv[2];

if (!email) {
  console.error("Usage: node scripts/makeAdmin.js your@email.com");
  process.exit(1);
}

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    const user = await User.findOneAndUpdate(
      { email: email.toLowerCase() },
      { role: "admin" },
      { new: true }
    );

    if (!user) {
      console.error(`No user found with email "${email}". Register on the site first, then run this again.`);
    } else {
      console.log(`✅ ${user.email} is now an admin. Log out and log back in on the site to see the Admin page.`);
    }

    await mongoose.disconnect();
  })
  .catch((err) => {
    console.error("Could not connect to MongoDB:", err.message);
    process.exit(1);
  });
