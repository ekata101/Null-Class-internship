import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

import authRoutes from "./routes/auth.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import questionRoutes from "./routes/question.routes.js";
import otpRoutes from "./routes/otp.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/otp", otpRoutes);

// Serve Frontend
app.use(express.static(path.join(__dirname, "frontend")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "index.html"));
});

// Start Server (ONLY ONCE)
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});