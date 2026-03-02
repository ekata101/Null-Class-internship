import { Router } from "express";
import { register, login, profile, forgotPassword } from "../controllers/auth.controller.js";
import auth from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", auth, profile);
router.post("/forgot-password", forgotPassword);

export default router;
