import Razorpay from "razorpay";

let instance = null;

// Created lazily so the server still boots (and the rest of the shop works)
// even if Razorpay keys are not configured yet.
export function getRazorpay() {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    const err = new Error("Razorpay keys are not configured");
    err.code = "RAZORPAY_NOT_CONFIGURED";
    throw err;
  }
  if (!instance) {
    instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
  return instance;
}
