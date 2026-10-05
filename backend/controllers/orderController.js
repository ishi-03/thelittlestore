import Order from "../models/Order.js";
import { normalizePhone } from "../utils/orderPricing.js";
import { toPublicOrder } from "../services/orderService.js";

// Orders are only ever created by the payment flow (services/orderService.js),
// after the Razorpay signature has been verified. There is deliberately no
// public "create order" endpoint.

// POST /api/orders/track   Body: { orderNumber, phone }
// Guest order lookup: needs BOTH the order number and the phone used at checkout.
export const trackOrder = async (req, res) => {
  try {
    const orderNumber = String(req.body?.orderNumber ?? "").trim().toUpperCase();
    const phone = normalizePhone(req.body?.phone);

    if (!orderNumber || !phone) {
      return res.status(400).json({ message: "Please enter your order number and the mobile number used at checkout." });
    }

    const order = await Order.findOne({ orderNumber, "customer.phone": phone });
    if (!order) {
      // same message for "wrong number" and "wrong phone" so orders can't be probed
      return res.status(404).json({ message: "We couldn't find an order with those details." });
    }

    res.status(200).json(toPublicOrder(order));
  } catch (error) {
    console.error("track order failed:", error);
    res.status(500).json({ message: "Something went wrong. Please try again." });
  }
};
