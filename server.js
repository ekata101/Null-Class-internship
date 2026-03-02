import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

import authRoutes from "./routes/auth.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import questionRoutes from "./routes/question.routes.js";
import otpRoutes from "./routes/otp.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

// Auth: Register, Login, Profile, Forgot Password
app.use("/api/auth", authRoutes);

// Subscription & Payment
app.use("/api/payment", paymentRoutes);

// Q&A with AI answers
app.use("/api/questions", questionRoutes);

// OTP for Multilanguage switching
app.use("/api/otp", otpRoutes);

app.get("/", (req, res) => {
  res.send("Combined Backend running ✅");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
