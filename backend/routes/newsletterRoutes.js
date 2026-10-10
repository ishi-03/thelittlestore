import express from "express";
import rateLimit from "express-rate-limit";
import { requireAdmin } from "../middleware/adminAuth.js";
import { subscribe, getSubscribers } from "../controllers/newsletterController.js";

const router = express.Router();

// stop bots from flooding the list
const subscribeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many attempts. Please try again later." },
});

router.post("/", subscribeLimiter, subscribe);
router.get("/", requireAdmin, getSubscribers);

export default router;
