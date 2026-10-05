import express from "express";
import {
  getShippingQuote,
  createPaymentOrder,
  verifyPayment,
  reportPaymentFailure,
} from "../controllers/paymentController.js";

const router = express.Router();

router.post("/shipping-quote", getShippingQuote);
router.post("/create-order", createPaymentOrder);
router.post("/verify", verifyPayment);
router.post("/failed", reportPaymentFailure);

export default router;
