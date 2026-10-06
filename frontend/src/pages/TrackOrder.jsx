import React, { useState } from "react";
import { trackOrder } from "../api/orderApi.js";

const PINK = "#f4a7b9";
const DARK = "#2d2d2d";
const MUTED = "#8a7f7a";
const BORDER = "#e8ddd5";

const rupee = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;
const STEPS = ["Confirmed", "Processing", "Shipped", "Delivered"];

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: "11px 12px",
  border: `1px solid ${BORDER}`,
  borderRadius: "8px",
  background: "#fff",
  fontFamily: '"Nunito", sans-serif',
  fontSize: "14px",
  color: DARK,
  outline: "none",
  marginBottom: "14px",
};

export default function TrackOrder() {
  const [orderNumber, setOrderNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setOrder(null);
    try {
      setLoading(true);
      setOrder(await trackOrder(orderNumber, phone));
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const cancelled = order?.orderStatus === "Cancelled";
  const stepIndex = order ? STEPS.indexOf(order.orderStatus) : -1;

  return (
    <div style={{ background: "#fdfbf9", fontFamily: '"Nunito", sans-serif', minHeight: "60vh" }}>
      <div style={{ maxWidth: "560px", margin: "0 auto", padding: "40px 20px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: 800, color: DARK, margin: "0 0 4px" }}>Track your order</h1>
        <div style={{ width: "40px", height: "3px", background: PINK, borderRadius: "2px", marginBottom: "18px" }} />
        <p style={{ fontSize: "13.5px", color: MUTED, margin: "0 0 18px" }}>
          Enter your order number and the mobile number used at checkout.
        </p>

        <form onSubmit={handleSubmit} style={{ background: "#fff", borderRadius: "14px", padding: "20px", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
          <input style={inputStyle} placeholder="Order number (e.g. LS-261006-ABCDE)" value={orderNumber} onChange={(e) => setOrderNumber(e.target.value)} required />
          <input style={inputStyle} placeholder="Mobile number" inputMode="numeric" value={phone} onChange={(e) => setPhone(e.target.value)} required />
          <button
            type="submit"
            disabled={loading}
            style={{ width: "100%", background: loading ? "#f2d9df" : PINK, color: "#fff", border: "none", borderRadius: "8px", padding: "13px", fontFamily: '"Nunito", sans-serif', fontSize: "13.5px", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer" }}
          >
            {loading ? "CHECKING…" : "TRACK ORDER"}
          </button>
        </form>

        {error && (
          <div style={{ background: "#fdecea", color: "#a83a35", borderRadius: "10px", padding: "10px 14px", fontSize: "13px", marginTop: "14px" }}>
            {error}
          </div>
        )}

        {order && (
          <div style={{ background: "#fff", borderRadius: "14px", padding: "20px", boxShadow: "0 2px 12px rgba(0,0,0,0.05)", marginTop: "18px" }}>
            <p style={{ margin: "0 0 14px", fontSize: "14px", color: DARK }}>
              Order <strong>{order.orderNumber}</strong>
              <span style={{ color: MUTED }}> · {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</span>
            </p>

            {cancelled ? (
              <p style={{ background: "#fdecea", color: "#a83a35", borderRadius: "8px", padding: "10px 12px", fontSize: "13.5px", fontWeight: 700 }}>
                This order was cancelled.{order.paymentStatus === "Refunded" ? " Your payment has been refunded." : ""}
              </p>
            ) : (
              <div style={{ display: "flex", justifyContent: "space-between", margin: "6px 0 20px" }}>
                {STEPS.map((s, i) => {
                  const done = i <= stepIndex;
                  return (
                    <div key={s} style={{ flex: 1, textAlign: "center" }}>
                      <div style={{ width: "26px", height: "26px", borderRadius: "50%", margin: "0 auto 6px", background: done ? PINK : "#f2eae4", color: "#fff", fontSize: "13px", fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {done ? "✓" : ""}
                      </div>
                      <span style={{ fontSize: "11.5px", fontWeight: done ? 700 : 500, color: done ? DARK : MUTED }}>{s}</span>
                    </div>
                  );
                })}
              </div>
            )}

            {order.items?.map((i, idx) => (
              <div key={idx} style={{ display: "flex", gap: "10px", padding: "8px 0", borderTop: `1px solid ${BORDER}` }}>
                <img src={i.image || "/images/placeholder.png"} alt={i.name} style={{ width: "44px", height: "44px", borderRadius: "8px", objectFit: "cover", background: "#f8f3f0" }} />
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontSize: "13px", fontWeight: 700, color: DARK }}>{i.name}</p>
                  <p style={{ margin: "2px 0 0", fontSize: "12px", color: MUTED }}>{i.age ? `${i.age} · ` : ""}Qty {i.quantity}</p>
                </div>
                <span style={{ fontSize: "13px", fontWeight: 700, color: DARK }}>{rupee(i.price * i.quantity)}</span>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", borderTop: `1px solid ${BORDER}`, paddingTop: "10px", fontSize: "15px", fontWeight: 800, color: DARK }}>
              <span>Total</span>
              <span>{rupee(order.totalAmount)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
