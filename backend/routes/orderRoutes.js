import express from "express";
import { trackOrder } from "../controllers/orderController.js";

const router = express.Router();

router.post("/track", trackOrder);

export default router;
