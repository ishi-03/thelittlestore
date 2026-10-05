import mongoose from "mongoose";

export const ORDER_STATUSES = [
  "Pending",
  "Confirmed",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];
export const PAYMENT_STATUSES = ["Pending", "Paid", "Failed", "Refunded"];

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, required: true, unique: true, index: true },

    // Guest checkout for now; set when customer login is added later
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },

    customer: {
      name: { type: String, required: true, trim: true },
      phone: { type: String, required: true, trim: true },
      email: { type: String, required: true, trim: true, lowercase: true },
    },

    address: {
      line1: { type: String, required: true, trim: true },
      line2: { type: String, trim: true, default: "" },
      city: { type: String, required: true, trim: true },
      state: { type: String, required: true, trim: true },
      pincode: { type: String, required: true, trim: true },
    },

    // Snapshots: never depend on the live product after the order is placed
    items: [
      {
        _id: false,
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        variantId: { type: mongoose.Schema.Types.ObjectId, default: null },
        name: { type: String, required: true },
        image: { type: String, default: "" },
        age: { type: String, default: null },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true, min: 0 },
      },
    ],

    subtotal: { type: Number, required: true, min: 0 },
    shippingCharge: { type: Number, default: 0, min: 0 },
    totalWeightGrams: { type: Number, default: 0, min: 0 },
    totalAmount: { type: Number, required: true, min: 0 },

    razorpayOrderId: { type: String, required: true, unique: true },
    razorpayPaymentId: { type: String, default: null },

    paymentStatus: { type: String, enum: PAYMENT_STATUSES, default: "Pending" },
    orderStatus: { type: String, enum: ORDER_STATUSES, default: "Pending" },

    // internal note for admin (e.g. refund follow-up)
    note: { type: String, default: "" },
  },
  { timestamps: true }
);

orderSchema.index({ createdAt: -1 });
orderSchema.index({ "customer.phone": 1 });

export default mongoose.model("Order", orderSchema);
