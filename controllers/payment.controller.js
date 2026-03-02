import getDb from "../config/db.js";
import nodemailer from "nodemailer";

const PLAN_LEVEL = { FREE: 0, BRONZE: 1, SILVER: 2, GOLD: 3 };
const PLANS = {
  BRONZE: { price: 100, limit: 5 },
  SILVER: { price: 300, limit: 10 },
  GOLD: { price: 1000, limit: 9999 },
};

const isAllowed = () => {
  const now = new Date();
  const ist = new Date(now.getTime() + 5.5 * 60 * 60 * 1000);
  const hour = ist.getUTCHours();
  return hour >= 10 && hour < 11;
};

const mailer = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  tls: { rejectUnauthorized: false },
});

export const fakePayment = async (req, res) => {
  try {
    if (!isAllowed())
      return res.status(403).json({ message: "Payments allowed only between 10–11 AM IST" });

    const { plan } = req.body;
    const userId = req.userId;

    if (!PLANS[plan]) return res.status(400).json({ message: "Invalid plan selected" });

    const db = await getDb();
    const sub = await db.get("SELECT plan, expires_at FROM subscriptions WHERE user_id = ?", [userId]);

    if (!sub) {
      await db.run("INSERT INTO subscriptions (user_id, plan, daily_limit) VALUES (?, 'FREE', 1)", [userId]);
      return res.json({ message: "Free plan created. Please try payment again." });
    }

    if (sub.expires_at && new Date(sub.expires_at) > new Date()) {
      if (PLAN_LEVEL[plan] <= PLAN_LEVEL[sub.plan]) {
        return res.status(400).json({ message: "You can only upgrade to a higher plan" });
      }
    }

    const selectedPlan = PLANS[plan];
    const newExpiry = new Date();
    newExpiry.setDate(newExpiry.getDate() + 30);
    const newExpiryStr = newExpiry.toISOString().split("T")[0];

    await db.run(
      "UPDATE subscriptions SET plan = ?, daily_limit = ?, expires_at = ? WHERE user_id = ?",
      [plan, selectedPlan.limit, newExpiryStr, userId]
    );

    const user = await db.get("SELECT email FROM users WHERE id = ?", [userId]);

    if (user?.email && process.env.EMAIL_USER) {
      try {
        await mailer.sendMail({
          from: process.env.EMAIL_USER,
          to: user.email,
          subject: "Subscription Invoice",
          html: `<h2>Invoice</h2><p>Plan: ${plan}</p><p>Amount: ₹${selectedPlan.price}</p>
                 <p>Transaction ID: TXN${Date.now()}</p><p>Valid till: ${newExpiry.toDateString()}</p>`,
        });
      } catch (e) { console.error("Invoice email failed:", e.message); }
    }

    res.json({ message: "Payment successful" });
  } catch (err) {
    res.status(500).json({ message: "Payment failed", error: err.message });
  }
};
