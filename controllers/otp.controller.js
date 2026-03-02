import getDb from "../config/db.js";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  tls: { rejectUnauthorized: false },
});

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

// ===================== SEND OTP =====================
export const sendOtp = async (req, res) => {
  const { language, contact } = req.body;
  if (!language || !contact)
    return res.status(400).json({ success: false, message: "Language and contact are required" });

  try {
    const db = await getDb();
    const existing = await db.get(
      "SELECT * FROM otps WHERE contact = ? AND expires_at > datetime('now')",
      [contact]
    );
    if (existing)
      return res.status(400).json({ success: false, message: "Please wait before requesting another OTP" });

    const otp = generateOtp();
    const hashedOtp = await bcrypt.hash(otp, 10);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

    await db.run("DELETE FROM otps WHERE contact = ?", [contact]);
    await db.run(
      "INSERT INTO otps (contact, otp_hash, language, expires_at) VALUES (?, ?, ?, ?)",
      [contact, hashedOtp, language, expiresAt]
    );

    if (process.env.EMAIL_USER) {
      try {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: contact,
          subject: "Your Verification Code",
          text: `Your OTP is: ${otp}. It will expire in 5 minutes.`,
        });
      } catch (e) { console.error("OTP email failed:", e.message); }
    }

    const response = { success: true, message: "OTP sent successfully" };
    if (process.env.NODE_ENV !== "production") response.devOtp = otp;
    res.json(response);
  } catch (err) {
    res.status(500).json({ success: false, message: "Error sending OTP", error: err.message });
  }
};

// ===================== VERIFY OTP =====================
export const verifyOtp = async (req, res) => {
  const { contact, otp } = req.body;
  if (!contact || !otp)
    return res.status(400).json({ success: false, message: "Contact and OTP are required" });

  try {
    const db = await getDb();
    const record = await db.get("SELECT * FROM otps WHERE contact = ?", [contact]);

    if (!record) return res.status(400).json({ success: false, message: "Invalid OTP" });

    if (new Date(record.expires_at) < new Date()) {
      await db.run("DELETE FROM otps WHERE contact = ?", [contact]);
      return res.status(400).json({ success: false, message: "OTP expired" });
    }

    const isMatch = await bcrypt.compare(otp, record.otp_hash);
    if (!isMatch) return res.status(400).json({ success: false, message: "Invalid OTP" });

    await db.run("DELETE FROM otps WHERE contact = ?", [contact]);
    res.json({ success: true, message: "OTP verified successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Verification error", error: err.message });
  }
};
