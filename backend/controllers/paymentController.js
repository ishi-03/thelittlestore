import Product from "../models/Product.js";
import PaymentIntent from "../models/PaymentIntent.js";
import { getRazorpay } from "../config/razorpay.js";
import { finalizePayment, toPublicOrder } from "../services/orderService.js";
import {
  validateCheckoutDetails,
  priceItems,
  computeShipping,
  getShippingRates,
  toPaise,
} from "../utils/orderPricing.js";
import { verifyPaymentSignature, verifyWebhookSignature } from "../utils/razorpaySignature.js";

const isNonEmptyString = (v) => typeof v === "string" && v.length > 0 && v.length < 200;

// Loads the products from the DB and prices the requested lines (never trusts browser prices).
const priceRequestedItems = async (requested, rates) => {
  const list = Array.isArray(requested) ? requested : [];
  const ids = [...new Set(list.map((l) => String(l?.productId ?? "")).filter((id) => /^[a-f\d]{24}$/i.test(id)))];
  const products = ids.length ? await Product.find({ _id: { $in: ids } }) : [];
  return priceItems(list, products, rates.defaultWeightGrams);
};

// POST /api/payment/shipping-quote
// Body: { items: [{ productId, variantId, quantity }], address: { state, city } }
// Shows the customer the exact shipping + total the server will charge.
export const getShippingQuote = async (req, res) => {
  try {
    const state = String(req.body?.address?.state ?? "").trim();
    const city = String(req.body?.address?.city ?? "").trim();
    if (!state) {
      return res.status(400).json({ message: "Please select your state.", code: "INVALID_DETAILS" });
    }

    const rates = getShippingRates();
    const priced = await priceRequestedItems(req.body?.items, rates);
    if (!priced.ok) {
      return res.status(priced.status).json({ message: priced.message, code: priced.code });
    }

    const ship = computeShipping({ subtotal: priced.subtotal, state, city, totalGrams: priced.totalGrams }, rates);
    res.status(200).json({
      subtotal: priced.subtotal,
      shippingCharge: ship.charge,
      totalAmount: priced.subtotal + ship.charge,
      billableKg: ship.billableKg,
    });
  } catch (error) {
    console.error("shipping-quote failed:", error);
    res.status(500).json({ message: "We couldn't calculate shipping. Please try again.", code: "SERVER" });
  }
};

// POST /api/payment/create-order
// Body: { items: [{ productId, variantId, quantity }], customer, address }
// Amount is ALWAYS calculated here from the database; any price sent by the browser is ignored.
export const createPaymentOrder = async (req, res) => {
  try {
    const details = validateCheckoutDetails(req.body);
    if (!details.ok) {
      return res.status(400).json({ message: details.message, field: details.field, code: "INVALID_DETAILS" });
    }

    const rates = getShippingRates();
    const priced = await priceRequestedItems(req.body?.items, rates);
    if (!priced.ok) {
      return res.status(priced.status).json({ message: priced.message, code: priced.code });
    }

    const ship = computeShipping(
      { subtotal: priced.subtotal, state: details.address.state, city: details.address.city, totalGrams: priced.totalGrams },
      rates
    );
    const shippingCharge = ship.charge;
    const totalAmount = priced.subtotal + shippingCharge;
    const amountPaise = toPaise(totalAmount);

    if (amountPaise < 100) {
      return res.status(400).json({ message: "Order total is too low to process.", code: "INVALID_AMOUNT" });
    }

    const rzOrder = await getRazorpay().orders.create({
      amount: amountPaise,
      currency: "INR",
      receipt: `ls_${Date.now()}`,
      notes: { customer: details.customer.name, phone: details.customer.phone },
    });

    await PaymentIntent.create({
      razorpayOrderId: rzOrder.id,
      items: priced.items,
      subtotal: priced.subtotal,
      shippingCharge,
      totalWeightGrams: priced.totalGrams,
      totalAmount,
      amountPaise,
      customer: details.customer,
      address: details.address,
    });

    res.status(201).json({
      razorpayOrderId: rzOrder.id,
      amount: amountPaise,
      currency: "INR",
      keyId: process.env.RAZORPAY_KEY_ID, // public key id, safe for the browser
      summary: { subtotal: priced.subtotal, shippingCharge, totalAmount },
    });
  } catch (error) {
    console.error("create-order failed:", error?.error?.description || error);
    if (error?.code === "RAZORPAY_NOT_CONFIGURED") {
      return res.status(503).json({ message: "Online payments are not available right now.", code: "NOT_CONFIGURED" });
    }
    res.status(500).json({ message: "We couldn't start your payment. Please try again.", code: "SERVER" });
  }
};

// POST /api/payment/verify
// Body: { razorpayOrderId, razorpayPaymentId, razorpaySignature }
export const verifyPayment = async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body || {};

    if (![razorpayOrderId, razorpayPaymentId, razorpaySignature].every(isNonEmptyString)) {
      return res.status(400).json({ message: "Invalid payment details.", code: "INVALID_REQUEST" });
    }

    const valid = verifyPaymentSignature({
      orderId: razorpayOrderId,
      paymentId: razorpayPaymentId,
      signature: razorpaySignature,
      secret: process.env.RAZORPAY_KEY_SECRET,
    });

    if (!valid) {
      console.warn("Invalid Razorpay signature for order", razorpayOrderId);
      return res.status(400).json({ message: "Payment verification failed.", code: "INVALID_SIGNATURE" });
    }

    const result = await finalizePayment({ razorpayOrderId, razorpayPaymentId });

    if (!result.ok) {
      return res.status(result.status).json({ message: result.message, code: result.code });
    }
    res.status(200).json({ success: true, duplicate: result.duplicate, order: toPublicOrder(result.order) });
  } catch (error) {
    console.error("verify failed:", error);
    res.status(500).json({ message: "We couldn't confirm your payment. Please retry.", code: "SERVER" });
  }
};

// POST /api/payment/failed   Body: { razorpayOrderId, reason }
// Only records a note; a failed attempt can still be retried and paid in the same session.
export const reportPaymentFailure = async (req, res) => {
  try {
    const { razorpayOrderId, reason } = req.body || {};
    if (isNonEmptyString(razorpayOrderId)) {
      await PaymentIntent.updateOne(
        { razorpayOrderId, status: "created" },
        { status: "failed", failureReason: String(reason || "payment_failed").slice(0, 200) }
      );
    }
    res.status(200).json({ received: true });
  } catch (error) {
    console.error("report-failure failed:", error);
    res.status(200).json({ received: true });
  }
};

// POST /api/payment/webhook  (raw body; mounted before express.json in server.js)
// Safety net: if the customer closes the tab after paying, Razorpay still tells us.
export const razorpayWebhook = async (req, res) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) return res.status(503).json({ message: "Webhook not configured" });

  const signature = req.get("x-razorpay-signature");
  if (!Buffer.isBuffer(req.body) || !verifyWebhookSignature(req.body, signature, secret)) {
    return res.status(400).json({ message: "Invalid signature" });
  }

  try {
    const event = JSON.parse(req.body.toString("utf8"));

    if (event.event === "payment.captured" || event.event === "order.paid") {
      const payment = event.payload?.payment?.entity;
      if (payment?.order_id && payment?.id) {
        const result = await finalizePayment({
          razorpayOrderId: payment.order_id,
          razorpayPaymentId: payment.id,
          paidAmountPaise: payment.amount,
        });
        if (!result.ok && result.status >= 500) {
          return res.status(500).json({ message: "Retry later" }); // let Razorpay retry
        }
      }
    }
    res.status(200).json({ received: true });
  } catch (error) {
    console.error("webhook failed:", error);
    res.status(500).json({ message: "Webhook error" });
  }
};
