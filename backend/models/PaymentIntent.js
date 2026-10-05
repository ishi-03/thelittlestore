import mongoose from "mongoose";

// Server-side record of what the customer is paying for. Created by
// /payment/create-order and consumed by /payment/verify (or the webhook), so the
// final order is built from this trusted snapshot, never from browser data.
const paymentIntentSchema = new mongoose.Schema(
  {
    razorpayOrderId: { type: String, required: true, unique: true, index: true },

    status: {
      type: String,
      enum: ["created", "failed", "processing", "paid", "refunded", "needs_refund"],
      default: "created",
    },

    items: [
      {
        _id: false,
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        variantId: { type: mongoose.Schema.Types.ObjectId, default: null },
        name: String,
        image: String,
        age: { type: String, default: null },
        quantity: Number,
        price: Number,
      },
    ],

    subtotal: Number,
    shippingCharge: Number,
    totalWeightGrams: Number,
    totalAmount: Number,
    amountPaise: Number,

    customer: { name: String, phone: String, email: String },
    address: { line1: String, line2: String, city: String, state: String, pincode: String },

    razorpayPaymentId: { type: String, default: null },
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order", default: null },
    failureReason: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("PaymentIntent", paymentIntentSchema);
