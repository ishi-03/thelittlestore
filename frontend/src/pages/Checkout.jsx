import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { getProducts } from "../api/productApi.js";
import {
  getShippingQuote,
  createPaymentOrder,
  verifyPayment,
  reportPaymentFailure,
} from "../api/paymentApi.js";

const PINK = "#f4a7b9";
const DARK = "#2d2d2d";
const MUTED = "#8a7f7a";
const BORDER = "#e8ddd5";
const CREAM = "#fdf6f0";
const RED = "#d9534f";

const STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat",
  "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh",
  "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand",
  "West Bengal", "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry",
];

const rupee = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

const EMPTY = { name: "", email: "", phone: "", line1: "", line2: "", city: "", state: "", pincode: "" };

// Same rules as the backend (utils/orderPricing.js) so errors show before the request
function validate(f) {
  const e = {};
  if (f.name.trim().length < 2) e.name = "Please enter your full name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.trim())) e.email = "Please enter a valid email address.";
  const digits = f.phone.replace(/\D/g, "").replace(/^(91|0)(?=\d{10}$)/, "");
  if (!/^[6-9]\d{9}$/.test(digits)) e.phone = "Please enter a valid 10-digit mobile number.";
  if (f.line1.trim().length < 5) e.line1 = "Please enter your delivery address.";
  if (f.city.trim().length < 2) e.city = "Please enter your city.";
  if (!f.state) e.state = "Please select your state.";
  if (!/^[1-9]\d{5}$/.test(f.pincode.trim())) e.pincode = "Please enter a valid 6-digit pincode.";
  return e;
}

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const existing = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
    if (existing) {
      existing.addEventListener("load", () => resolve(true));
      existing.addEventListener("error", () => resolve(false));
      return;
    }
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

function Field({ label, error, children }) {
  return (
    <label style={{ display: "block", marginBottom: "14px" }}>
      <span style={{ display: "block", fontSize: "12.5px", fontWeight: 700, color: DARK, marginBottom: "5px" }}>
        {label}
      </span>
      {children}
      {error && <span style={{ display: "block", fontSize: "12px", color: RED, marginTop: "4px" }}>{error}</span>}
    </label>
  );
}

const inputStyle = (hasError) => ({
  width: "100%",
  boxSizing: "border-box",
  padding: "11px 12px",
  border: `1px solid ${hasError ? RED : BORDER}`,
  borderRadius: "8px",
  background: "#fff",
  fontFamily: '"Nunito", sans-serif',
  fontSize: "14px",
  color: DARK,
  outline: "none",
});

export default function Checkout() {
  const navigate = useNavigate();
  const toast = useToast();
  const { items, subtotal, hasUnavailable, clearCart, syncWithProducts } = useCart();

  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [quote, setQuote] = useState(null); // { shippingCharge, totalAmount }
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState("");
  const [syncing, setSyncing] = useState(items.length > 0);
  const completed = useRef(false);

  const lines = useMemo(
    () => items.filter((i) => i.available).map((i) => ({ productId: i.productId, variantId: i.variantId, quantity: i.quantity })),
    [items]
  );

  // Refresh price/stock once when the page opens
  useEffect(() => {
    if (items.length === 0) return undefined;
    let cancelled = false;
    getProducts()
      .then((data) => !cancelled && syncWithProducts(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => !cancelled && setSyncing(false));
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Server-side shipping quote whenever state / city / cart changes
  useEffect(() => {
    if (!form.state || lines.length === 0) {
      setQuote(null);
      return undefined;
    }
    let cancelled = false;
    setQuoteLoading(true);
    getShippingQuote(lines, { state: form.state, city: form.city })
      .then((q) => !cancelled && setQuote(q))
      .catch((err) => {
        if (!cancelled) {
          setQuote(null);
          setPayError(err.response?.data?.message || "Couldn't calculate shipping.");
        }
      })
      .finally(() => !cancelled && setQuoteLoading(false));
    return () => {
      cancelled = true;
    };
  }, [form.state, form.city, lines]);

  if (items.length === 0 && !completed.current) {
    return (
      <div style={{ background: "#fdfbf9", fontFamily: '"Nunito", sans-serif', minHeight: "60vh" }}>
        <div style={{ maxWidth: "520px", margin: "0 auto", padding: "80px 20px", textAlign: "center" }}>
          <h1 style={{ fontSize: "22px", fontWeight: 800, color: DARK, margin: "0 0 6px" }}>Your cart is empty</h1>
          <p style={{ fontSize: "14px", color: MUTED, margin: "0 0 22px" }}>Add something to your cart to checkout.</p>
          <button
            onClick={() => navigate("/shop")}
            style={{ background: PINK, color: "#fff", border: "none", borderRadius: "999px", padding: "11px 28px", fontFamily: '"Nunito", sans-serif', fontSize: "13.5px", fontWeight: 700, cursor: "pointer" }}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  const set = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }));
  };

  const shipping = quote?.shippingCharge ?? null;
  const total = quote ? quote.totalAmount : subtotal;

  const handlePay = async () => {
    setPayError("");
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length) {
      toast.error("Please fix the highlighted fields.");
      return;
    }
    if (hasUnavailable) {
      setPayError("Some items are unavailable. Please remove them from your cart.");
      return;
    }

    setPaying(true);
    try {
      const sdkOk = await loadRazorpayScript();
      if (!sdkOk) throw new Error("Couldn't load the payment window. Check your connection and try again.");

      const order = await createPaymentOrder({
        items: lines,
        customer: { name: form.name, email: form.email, phone: form.phone },
        address: { line1: form.line1, line2: form.line2, city: form.city, state: form.state, pincode: form.pincode },
      });

      const rzp = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        order_id: order.razorpayOrderId,
        name: "The Little Store",
        description: "Order payment",
        prefill: { name: form.name, email: form.email, contact: form.phone },
        theme: { color: PINK },
        handler: async (response) => {
          try {
            const result = await verifyPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
            completed.current = true;
            try {
              sessionStorage.setItem("littlestore_last_order", JSON.stringify(result.order));
            } catch {
              /* ignore */
            }
            clearCart();
            navigate("/order-success", { replace: true, state: { order: result.order } });
          } catch (err) {
            setPaying(false);
            const msg = err.response?.data?.message || "We couldn't confirm your payment. If money was deducted, it will be refunded or the order confirmed shortly.";
            setPayError(msg);
            navigate("/order-success", { replace: true, state: { failed: true, message: msg } });
          }
        },
        modal: {
          ondismiss: () => setPaying(false),
        },
      });

      rzp.on("payment.failed", (resp) => {
        const reason = resp?.error?.description || "Payment failed";
        reportPaymentFailure(order.razorpayOrderId, reason);
        setPayError(`${reason}. You can try again.`);
        setPaying(false);
      });

      rzp.open();
    } catch (err) {
      setPaying(false);
      setPayError(err.response?.data?.message || err.message || "Something went wrong. Please try again.");
    }
  };

  const disabled = paying || syncing || hasUnavailable || quoteLoading;

  return (
    <div style={{ background: "#fdfbf9", fontFamily: '"Nunito", sans-serif' }}>
      <div className="max-w-[1100px] mx-auto px-5 md:px-8 py-8">
        <h1 style={{ fontSize: "24px", fontWeight: 800, color: DARK, margin: "0 0 4px" }}>Checkout</h1>
        <div style={{ width: "40px", height: "3px", background: PINK, borderRadius: "2px", marginBottom: "18px" }} />

        {hasUnavailable && (
          <div style={{ background: "#fdecea", color: "#a83a35", borderRadius: "10px", padding: "10px 14px", fontSize: "13px", marginBottom: "12px" }}>
            Some items in your cart are unavailable. <Link to="/cart" style={{ fontWeight: 700, color: "#a83a35" }}>Review cart</Link>
          </div>
        )}
        {payError && (
          <div style={{ background: "#fdecea", color: "#a83a35", borderRadius: "10px", padding: "10px 14px", fontSize: "13px", marginBottom: "12px" }}>
            {payError}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-[1fr_360px] gap-8 items-start">
          {/* Customer details */}
          <div style={{ background: "#fff", borderRadius: "14px", padding: "22px", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
            <h2 style={{ fontSize: "16px", fontWeight: 800, color: DARK, margin: "0 0 16px" }}>Customer details</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
              <Field label="Full name" error={errors.name}>
                <input style={inputStyle(errors.name)} value={form.name} onChange={set("name")} autoComplete="name" />
              </Field>
              <Field label="Phone" error={errors.phone}>
                <input style={inputStyle(errors.phone)} value={form.phone} onChange={set("phone")} inputMode="numeric" autoComplete="tel" placeholder="10-digit mobile number" />
              </Field>
            </div>
            <Field label="Email" error={errors.email}>
              <input style={inputStyle(errors.email)} type="email" value={form.email} onChange={set("email")} autoComplete="email" />
            </Field>
            <Field label="Address" error={errors.line1}>
              <input style={inputStyle(errors.line1)} value={form.line1} onChange={set("line1")} autoComplete="address-line1" placeholder="House no, building, street" />
            </Field>
            <Field label="Apartment, landmark (optional)">
              <input style={inputStyle(false)} value={form.line2} onChange={set("line2")} autoComplete="address-line2" />
            </Field>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4">
              <Field label="City" error={errors.city}>
                <input style={inputStyle(errors.city)} value={form.city} onChange={set("city")} autoComplete="address-level2" />
              </Field>
              <Field label="State" error={errors.state}>
                <select style={inputStyle(errors.state)} value={form.state} onChange={set("state")} autoComplete="address-level1">
                  <option value="">Select state</option>
                  {STATES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </Field>
              <Field label="Pincode" error={errors.pincode}>
                <input style={inputStyle(errors.pincode)} value={form.pincode} onChange={set("pincode")} inputMode="numeric" maxLength={6} autoComplete="postal-code" />
              </Field>
            </div>
          </div>

          {/* Order summary */}
          <aside className="md:sticky md:top-[110px]" style={{ background: CREAM, border: `1px solid ${BORDER}`, borderRadius: "14px", padding: "20px" }}>
            <h2 style={{ fontSize: "16px", fontWeight: 800, color: DARK, margin: "0 0 14px" }}>Order Summary</h2>

            <div style={{ maxHeight: "260px", overflowY: "auto", marginBottom: "10px" }}>
              {items.map((i) => (
                <div key={i.key} style={{ display: "flex", gap: "10px", padding: "8px 0", opacity: i.available ? 1 : 0.5 }}>
                  <img src={i.image || "/images/placeholder.png"} alt={i.name} style={{ width: "46px", height: "46px", borderRadius: "8px", objectFit: "cover", background: "#f8f3f0" }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: 0, fontSize: "13px", fontWeight: 700, color: DARK, lineHeight: 1.3 }}>{i.name}</p>
                    <p style={{ margin: "2px 0 0", fontSize: "12px", color: MUTED }}>
                      {i.age ? `${i.age} · ` : ""}Qty {i.quantity}
                    </p>
                  </div>
                  <span style={{ fontSize: "13px", fontWeight: 700, color: DARK }}>{rupee(i.price * i.quantity)}</span>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", color: DARK, margin: "8px 0", paddingTop: "10px", borderTop: `1px solid ${BORDER}` }}>
              <span>Subtotal</span>
              <span style={{ fontWeight: 700 }}>{rupee(subtotal)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", color: DARK, marginBottom: "8px" }}>
              <span>Shipping</span>
              <span style={{ fontWeight: 700 }}>
                {quoteLoading ? "…" : shipping === null ? "Select state" : shipping === 0 ? "Free" : rupee(shipping)}
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "16px", fontWeight: 800, color: DARK, padding: "12px 0", borderTop: `1px solid ${BORDER}` }}>
              <span>Total</span>
              <span>{rupee(total)}</span>
            </div>

            <button
              disabled={disabled}
              onClick={handlePay}
              style={{
                width: "100%",
                background: disabled ? "#f2d9df" : PINK,
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                padding: "13px",
                fontFamily: '"Nunito", sans-serif',
                fontSize: "13.5px",
                fontWeight: 700,
                letterSpacing: "0.03em",
                cursor: disabled ? "not-allowed" : "pointer",
              }}
            >
              {paying ? "OPENING PAYMENT…" : `PAY ${rupee(total)}`}
            </button>
            <p style={{ fontSize: "11.5px", color: MUTED, textAlign: "center", margin: "10px 0 0" }}>
              Secure payment via Razorpay (UPI, cards, netbanking, wallets)
            </p>
            <Link to="/cart" style={{ display: "block", textAlign: "center", marginTop: "10px", fontSize: "13px", fontWeight: 600, color: MUTED }}>
              ← Back to cart
            </Link>
          </aside>
        </div>
      </div>
    </div>
  );
}
