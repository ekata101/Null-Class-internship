import { Router } from "express";
import { ask } from "../controllers/question.controller.js";
import auth from "../middlewares/auth.middleware.js";

const router = Router();
router.post("/ask", auth, ask);
export default router;
