import getDb from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

const JWT_SECRET = process.env.JWT_SECRET || "secret123";

const generatePassword = (length = 10) => {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  return password;
};

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  tls: { rejectUnauthorized: false },
});

// ===================== REGISTER =====================
export const register = async (req, res) => {
  const { email, password } = req.body;
  try {
    const db = await getDb();
    const hashedPassword = await bcrypt.hash(password, 10);
    let result;
    try {
      result = await db.run(
        "INSERT INTO users (email, password) VALUES (?, ?)",
        [email, hashedPassword]
      );
    } catch (err) {
      if (err.message.includes("UNIQUE constraint failed")) {
        return res.status(409).json({ message: "User already exists" });
      }
      throw err;
    }
    await db.run(
      "INSERT INTO subscriptions (user_id, plan, daily_limit) VALUES (?, 'FREE', 1)",
      [result.lastID]
    );
    res.status(201).json({ message: "Registration successful" });
  } catch (err) {
    res.status(500).json({ message: "Database error", error: err.message });
  }
};

// ===================== LOGIN =====================
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const db = await getDb();
    const user = await db.get("SELECT * FROM users WHERE email = ?", [email]);
    if (!user) return res.status(401).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid email or password" });

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "1h" });
    res.json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ message: "Database error", error: err.message });
  }
};

// ===================== PROFILE =====================
export const profile = async (req, res) => {
  try {
    const db = await getDb();
    const row = await db.get(
      `SELECT u.email, s.plan, s.daily_limit, s.expires_at
       FROM users u JOIN subscriptions s ON u.id = s.user_id
       WHERE u.id = ?`,
      [req.userId]
    );
    if (!row) return res.status(404).json({ message: "Profile not found" });
    res.json(row);
  } catch (err) {
    res.status(500).json({ message: "Database error", error: err.message });
  }
};

// ===================== FORGOT PASSWORD =====================
export const forgotPassword = async (req, res) => {
  const { emailOrPhone } = req.body;
  if (!emailOrPhone)
    return res.status(400).json({ success: false, message: "Email or phone is required" });

  try {
    const db = await getDb();
    const user = await db.get(
      "SELECT * FROM users WHERE email = ? OR phone = ?",
      [emailOrPhone, emailOrPhone]
    );
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const today = new Date().toISOString().split("T")[0];
    if (user.last_reset === today) {
      return res.json({ success: false, message: "You can request forgot password only 1 time a day!" });
    }

    const newPassword = generatePassword();
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.run("UPDATE users SET password = ?, last_reset = ? WHERE id = ?", [hashedPassword, today, user.id]);

    if (process.env.EMAIL_USER) {
      try {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: emailOrPhone,
          subject: "Your New Password",
          text: `Your new password is: ${newPassword}\n\nPlease change it after logging in.`,
        });
      } catch (e) { console.error("Email failed:", e.message); }
    }

    res.json({ success: true, message: "New password generated successfully!", newPassword });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};
