import express from "express";
import rateLimit from "express-rate-limit";
import { adminLogin, adminMe } from "../controllers/authController.js";
import { requireAdmin } from "../middleware/adminAuth.js";

const router = express.Router();

// Max 10 login attempts per 15 minutes per IP
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many login attempts. Please try again after 15 minutes." },
});

router.post("/login", loginLimiter, adminLogin);
router.get("/me", requireAdmin, adminMe);

export default router;