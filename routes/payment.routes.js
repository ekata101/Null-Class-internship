import { Router } from "express";
import { fakePayment } from "../controllers/payment.controller.js";
import auth from "../middlewares/auth.middleware.js";

const router = Router();
router.post("/pay", auth, fakePayment);
export default router;
