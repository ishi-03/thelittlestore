import crypto from "crypto";

const safeEqual = (expectedHex, given) => {
  if (typeof given !== "string") return false;
  const a = Buffer.from(expectedHex);
  const b = Buffer.from(given);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
};

// Checkout signature: HMAC_SHA256(order_id + "|" + payment_id, key_secret)
export function verifyPaymentSignature({ orderId, paymentId, signature, secret }) {
  if (!orderId || !paymentId || !signature || !secret) return false;
  const expected = crypto
    .createHmac("sha256", secret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");
  return safeEqual(expected, signature);
}

// Webhook signature: HMAC_SHA256(raw request body, webhook_secret)
export function verifyWebhookSignature(rawBody, signature, secret) {
  if (!rawBody || !signature || !secret) return false;
  const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  return safeEqual(expected, signature);
}
