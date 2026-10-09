import Order, { ORDER_STATUSES } from "../models/Order.js";
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

// ---------- admin (behind requireAdmin) ----------

// GET /api/orders?status=Confirmed&search=LS-2610
export const listOrders = async (req, res) => {
  try {
    const filter = {};
    const status = String(req.query.status ?? "");
    if (ORDER_STATUSES.includes(status)) filter.orderStatus = status;

    const search = String(req.query.search ?? "").trim();
    if (search) {
      const safe = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const rx = new RegExp(safe, "i");
      filter.$or = [{ orderNumber: rx }, { "customer.name": rx }, { "customer.phone": rx }, { "customer.email": rx }];
    }

    const orders = await Order.find(filter).sort({ createdAt: -1 }).limit(500);
    res.status(200).json(orders);
  } catch (error) {
    console.error("list orders failed:", error);
    res.status(500).json({ message: "Failed to load orders" });
  }
};

// GET /api/orders/:id
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: "Failed to load order" });
  }
};

// PUT /api/orders/:id/status   Body: { orderStatus }
export const updateOrderStatus = async (req, res) => {
  try {
    const orderStatus = String(req.body?.orderStatus ?? "");
    if (!ORDER_STATUSES.includes(orderStatus)) {
      return res.status(400).json({ message: "Invalid order status" });
    }
    const order = await Order.findByIdAndUpdate(req.params.id, { orderStatus }, { returnDocument: "after" });
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: "Failed to update order" });
  }
};
