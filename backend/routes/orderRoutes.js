import express from "express";
import { trackOrder, listOrders, getOrderById, updateOrderStatus } from "../controllers/orderController.js";
import { requireAdmin } from "../middleware/adminAuth.js";

const router = express.Router();

router.post("/track", trackOrder);

// admin
router.get("/", requireAdmin, listOrders);
router.get("/:id", requireAdmin, getOrderById);
router.put("/:id/status", requireAdmin, updateOrderStatus);

export default router;
