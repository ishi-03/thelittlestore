import crypto from "crypto";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import PaymentIntent from "../models/PaymentIntent.js";
import { getRazorpay } from "../config/razorpay.js";

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I

const generateOrderNumber = () => {
  const d = new Date();
  const ymd =
    String(d.getFullYear()).slice(2) +
    String(d.getMonth() + 1).padStart(2, "0") +
    String(d.getDate()).padStart(2, "0");
  let suffix = "";
  for (const byte of crypto.randomBytes(5)) suffix += ALPHABET[byte % ALPHABET.length];
  return `LS-${ymd}-${suffix}`;
};

// Shape that is safe to send back to the customer
export const toPublicOrder = (o) => ({
  orderNumber: o.orderNumber,
  createdAt: o.createdAt,
  customer: o.customer,
  address: o.address,
  items: o.items.map((i) => ({
    product: i.product,
    name: i.name,
    image: i.image,
    age: i.age,
    quantity: i.quantity,
    price: i.price,
  })),
  subtotal: o.subtotal,
  shippingCharge: o.shippingCharge,
  totalAmount: o.totalAmount,
  paymentStatus: o.paymentStatus,
  orderStatus: o.orderStatus,
  razorpayPaymentId: o.razorpayPaymentId,
});

// Atomically take stock for one purchased variant. Only succeeds if enough
// stock is still there, so two buyers can never oversell the same variant.
const takeStock = (item) =>
  Product.updateOne(
    {
      _id: item.product,
      isActive: { $ne: false },
      variants: { $elemMatch: { _id: item.variantId, stock: { $gte: item.quantity } } },
    },
    { $inc: { "variants.$.stock": -item.quantity } }
  );

const returnStock = (items) =>
  Promise.all(
    items.map((item) =>
      Product.updateOne(
        { _id: item.product, "variants._id": item.variantId },
        { $inc: { "variants.$.stock": item.quantity } }
      )
    )
  );

async function createOrderDoc(intent, extra = {}) {
  const base = {
    user: null,
    customer: intent.customer,
    address: intent.address,
    items: intent.items,
    subtotal: intent.subtotal,
    shippingCharge: intent.shippingCharge,
    totalWeightGrams: intent.totalWeightGrams || 0,
    totalAmount: intent.totalAmount,
    razorpayOrderId: intent.razorpayOrderId,
    razorpayPaymentId: intent.razorpayPaymentId,
    ...extra,
  };

  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      return await Order.create({ ...base, orderNumber: generateOrderNumber() });
    } catch (err) {
      const dupOrderNumber = err?.code === 11000 && err?.keyPattern?.orderNumber;
      if (!dupOrderNumber) throw err;
    }
  }
  throw new Error("Could not generate a unique order number");
}

const replayOutcome = async (existing) => {
  if (existing.status === "paid") {
    const order = await Order.findById(existing.orderId);
    return { ok: true, duplicate: true, order };
  }
  if (existing.status === "refunded") {
    return {
      ok: false,
      status: 409,
      code: "REFUNDED",
      message: "Some items just went out of stock. Your payment has been refunded.",
    };
  }
  if (existing.status === "needs_refund") {
    return {
      ok: false,
      status: 409,
      code: "NEEDS_REFUND",
      message:
        "Some items just went out of stock. Your payment will be refunded by our team shortly.",
    };
  }
  return {
    ok: false,
    status: 409,
    code: "PROCESSING",
    message: "Your payment is being confirmed. Please wait a moment.",
  };
};

/**
 * Turn a verified payment into an order. Safe to call several times for the
 * same payment (double click, retry, webhook racing the browser): only the
 * first caller wins the atomic claim, the others get the same result back.
 */
export async function finalizePayment({ razorpayOrderId, razorpayPaymentId, paidAmountPaise }) {
  // 1. atomic claim: created/failed -> processing
  const intent = await PaymentIntent.findOneAndUpdate(
    { razorpayOrderId, status: { $in: ["created", "failed"] } },
    { $set: { status: "processing", razorpayPaymentId } },
    { new: true }
  );

  if (!intent) {
    const existing = await PaymentIntent.findOne({ razorpayOrderId });
    if (!existing) {
      return { ok: false, status: 404, code: "NOT_FOUND", message: "Payment session not found." };
    }
    return replayOutcome(existing);
  }

  // webhook path knows the captured amount; it must equal what we asked for
  if (paidAmountPaise !== undefined && Number(paidAmountPaise) !== intent.amountPaise) {
    await PaymentIntent.updateOne(
      { _id: intent._id },
      { status: "failed", failureReason: "amount_mismatch" }
    );
    return { ok: false, status: 400, code: "AMOUNT_MISMATCH", message: "Payment amount mismatch." };
  }

  // 2. take stock for every tracked variant, all-or-nothing
  const taken = [];
  let outOfStock = false;
  try {
    for (const item of intent.items) {
      if (!item.variantId) continue; // product without variants: no stock tracking
      const res = await takeStock(item);
      if (res.modifiedCount !== 1) {
        outOfStock = true;
        break;
      }
      taken.push(item);
    }
  } catch (err) {
    console.error("Stock update failed:", err);
    await returnStock(taken).catch(() => {});
    await PaymentIntent.updateOne({ _id: intent._id }, { status: "failed", failureReason: "stock_error" });
    return { ok: false, status: 500, code: "SERVER", message: "We couldn't complete your order. Please try again." };
  }

  // 3a. someone else bought the last unit: undo, refund, keep a cancelled record
  if (outOfStock) {
    await returnStock(taken).catch((e) => console.error("Stock rollback failed:", e));

    let refunded = false;
    try {
      await getRazorpay().payments.refund(razorpayPaymentId, {
        amount: intent.amountPaise,
        notes: { reason: "Out of stock at confirmation", order: razorpayOrderId },
      });
      refunded = true;
    } catch (err) {
      console.error("Auto-refund failed, needs manual refund:", razorpayPaymentId, err?.error?.description || err?.message);
    }

    try {
      await createOrderDoc(intent, {
        paymentStatus: refunded ? "Refunded" : "Paid",
        orderStatus: "Cancelled",
        note: refunded
          ? "Auto-cancelled: out of stock at confirmation. Payment refunded."
          : "Auto-cancelled: out of stock at confirmation. REFUND PENDING - refund manually in Razorpay.",
      });
    } catch (err) {
      console.error("Could not save cancelled order record:", err);
    }

    await PaymentIntent.updateOne(
      { _id: intent._id },
      { status: refunded ? "refunded" : "needs_refund", failureReason: "out_of_stock" }
    );
    return refunded
      ? await replayOutcome({ status: "refunded" })
      : await replayOutcome({ status: "needs_refund" });
  }

  // 3b. happy path
  try {
    const order = await createOrderDoc(intent, {
      paymentStatus: "Paid",
      orderStatus: "Confirmed",
    });
    await PaymentIntent.updateOne({ _id: intent._id }, { status: "paid", orderId: order._id });
    return { ok: true, duplicate: false, order };
  } catch (err) {
    console.error("Order creation failed after payment:", err);
    await returnStock(taken).catch(() => {});
    // back to a retryable state; verify/webhook can run again
    await PaymentIntent.updateOne({ _id: intent._id }, { status: "failed", failureReason: "order_create_error" });
    return {
      ok: false,
      status: 500,
      code: "SERVER",
      message:
        "We received your payment but couldn't finish your order yet. Please retry; you won't be charged again.",
    };
  }
}
