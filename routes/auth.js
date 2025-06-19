const express = require("express");
const crypto = require("crypto");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");

const router = express.Router();

router.post("/register", async (req, res) => {
  const { email } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) return res.status(400).send("User already exists");

  const verificationToken = crypto.randomBytes(32).toString("hex");

  const user = new User({ email, verificationToken });
  await user.save();

  const verificationLink = `http://localhost:5000/api/auth/verify/${verificationToken}`;
  await sendEmail(email, "Verify your email", `<a href="${verificationLink}">Click to verify</a>`);

  res.send("Registration successful. Check your email to verify.");
});

router.get("/verify/:token", async (req, res) => {
  const user = await User.findOne({ verificationToken: req.params.token });
  if (!user) return res.status(400).send("Invalid or expired token");

  user.verified = true;
  user.verificationToken = null;
  await user.save();

  res.send("Email verified successfully.");
});

module.exports = router;
