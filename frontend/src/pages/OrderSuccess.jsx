import React from "react";
import { Link, useLocation } from "react-router-dom";

const PINK = "#f4a7b9";
const DARK = "#2d2d2d";
const MUTED = "#8a7f7a";
const BORDER = "#e8ddd5";
const CREAM = "#fdf6f0";

const rupee = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

const readSaved = () => {
  try {
    return JSON.parse(sessionStorage.getItem("littlestore_last_order") || "null");
  } catch {
    return null;
  }
};

const pill = {
  display: "inline-block",
  background: PINK,
  color: "#fff",
  borderRadius: "999px",
  padding: "11px 28px",
  fontFamily: '"Nunito", sans-serif',
  fontSize: "13.5px",
  fontWeight: 700,
  textDecoration: "none",
};

export default function OrderSuccess() {
  const { state } = useLocation();
  const order = state?.order || readSaved();

  if (state?.failed) {
    return (
      <div style={{ background: "#fdfbf9", fontFamily: '"Nunito", sans-serif', minHeight: "60vh" }}>
        <div style={{ maxWidth: "520px", margin: "0 auto", padding: "80px 20px", textAlign: "center" }}>
          <div style={{ fontSize: "48px" }}>⚠️</div>
          <h1 style={{ fontSize: "22px", fontWeight: 800, color: DARK, margin: "14px 0 8px" }}>Payment not confirmed</h1>
          <p style={{ fontSize: "14px", color: MUTED, margin: "0 0 22px", lineHeight: 1.6 }}>
            {state.message || "We couldn't confirm your payment."} Your cart has been kept so you can try again.
          </p>
          <Link to="/checkout" style={pill}>Try Again</Link>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div style={{ background: "#fdfbf9", fontFamily: '"Nunito", sans-serif', minHeight: "60vh" }}>
        <div style={{ maxWidth: "520px", margin: "0 auto", padding: "80px 20px", textAlign: "center" }}>
          <h1 style={{ fontSize: "22px", fontWeight: 800, color: DARK, margin: "0 0 8px" }}>No recent order found</h1>
          <Link to="/shop" style={pill}>Continue Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "#fdfbf9", fontFamily: '"Nunito", sans-serif' }}>
      <div style={{ maxWidth: "640px", margin: "0 auto", padding: "48px 20px" }}>
        <div style={{ textAlign: "center", marginBottom: "26px" }}>
          <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "#e8f6ee", color: "#3fa66b", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "32px", margin: "0 auto 14px" }}>✓</div>
          <h1 style={{ fontSize: "24px", fontWeight: 800, color: DARK, margin: "0 0 6px" }}>Thank you, your order is confirmed!</h1>
          <p style={{ fontSize: "14px", color: MUTED, margin: 0 }}>
            Order number <strong style={{ color: DARK }}>{order.orderNumber}</strong>. Keep it (with your phone number) to track your order.
          </p>
        </div>

        <div style={{ background: "#fff", borderRadius: "14px", padding: "18px", boxShadow: "0 2px 12px rgba(0,0,0,0.05)", marginBottom: "16px" }}>
          {order.items?.map((i, idx) => (
            <div key={idx} style={{ display: "flex", gap: "12px", padding: "10px 0", borderTop: idx ? `1px solid ${BORDER}` : "none" }}>
              <img src={i.image || "/images/placeholder.png"} alt={i.name} style={{ width: "52px", height: "52px", borderRadius: "8px", objectFit: "cover", background: "#f8f3f0" }} />
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: "13.5px", fontWeight: 700, color: DARK }}>{i.name}</p>
                <p style={{ margin: "2px 0 0", fontSize: "12.5px", color: MUTED }}>
                  {i.age ? `${i.age} · ` : ""}Qty {i.quantity}
                </p>
              </div>
              <span style={{ fontSize: "13.5px", fontWeight: 700, color: DARK }}>{rupee(i.price * i.quantity)}</span>
            </div>
          ))}
          <div style={{ borderTop: `1px solid ${BORDER}`, marginTop: "8px", paddingTop: "10px", fontSize: "14px", color: DARK }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}><span>Subtotal</span><span>{rupee(order.subtotal)}</span></div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}><span>Shipping</span><span>{order.shippingCharge ? rupee(order.shippingCharge) : "Free"}</span></div>
            <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 800, fontSize: "16px" }}><span>Total paid</span><span>{rupee(order.totalAmount)}</span></div>
          </div>
        </div>

        <div style={{ background: CREAM, border: `1px solid ${BORDER}`, borderRadius: "14px", padding: "16px 18px", fontSize: "13.5px", color: DARK, lineHeight: 1.6, marginBottom: "24px" }}>
          <strong>Delivering to</strong>
          <br />
          {order.customer?.name}, {order.customer?.phone}
          <br />
          {order.address?.line1}{order.address?.line2 ? `, ${order.address.line2}` : ""}, {order.address?.city}, {order.address?.state} - {order.address?.pincode}
          <br />
          <span style={{ color: MUTED }}>Payment: {order.paymentStatus} · Payment ID: {order.razorpayPaymentId}</span>
        </div>

        <div style={{ textAlign: "center" }}>
          <Link to="/shop" style={pill}>Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
}
