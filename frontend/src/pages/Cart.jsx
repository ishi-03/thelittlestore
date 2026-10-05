import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getProducts } from "../api/productApi.js";
import { useCart } from "../context/CartContext.jsx";
import { useToast } from "../context/ToastContext.jsx";

const PINK = "#f4a7b9";
const DARK = "#2d2d2d";
const MUTED = "#8a7f7a";
const BORDER = "#e8ddd5";
const CREAM = "#fdf6f0";

const rupee = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

function QtyControl({ item, onChange }) {
  const max = item.stock ?? 99;
  const btn = {
    width: "36px",
    height: "36px",
    border: "none",
    background: "none",
    fontSize: "16px",
    color: DARK,
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        border: `1px solid ${BORDER}`,
        borderRadius: "8px",
        background: "#fff",
      }}
    >
      <button
        aria-label="Decrease quantity"
        disabled={item.quantity <= 1}
        onClick={() => onChange(item.quantity - 1)}
        style={{ ...btn, cursor: item.quantity <= 1 ? "not-allowed" : "pointer", opacity: item.quantity <= 1 ? 0.35 : 1 }}
      >
        −
      </button>
      <span style={{ width: "30px", textAlign: "center", fontSize: "14px", fontWeight: 700, color: DARK }}>
        {item.quantity}
      </span>
      <button
        aria-label="Increase quantity"
        disabled={item.quantity >= max}
        onClick={() => onChange(item.quantity + 1)}
        style={{ ...btn, cursor: item.quantity >= max ? "not-allowed" : "pointer", opacity: item.quantity >= max ? 0.35 : 1 }}
      >
        +
      </button>
    </div>
  );
}

function CartLine({ item, onQty, onRemove }) {
  const unavailable = !item.available;

  return (
    <div style={{ display: "flex", gap: "14px", padding: "16px 0", borderTop: `1px solid ${BORDER}` }}>
      <Link to={`/product/${item.productId}`} style={{ flexShrink: 0 }}>
        <img
          src={item.image || "/images/placeholder.png"}
          alt={item.name}
          style={{
            width: "88px",
            height: "88px",
            objectFit: "cover",
            borderRadius: "10px",
            background: "#f8f3f0",
            display: "block",
            filter: unavailable ? "grayscale(1)" : "none",
            opacity: unavailable ? 0.6 : 1,
          }}
        />
      </Link>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "10px" }}>
          <div style={{ minWidth: 0 }}>
            <Link
              to={`/product/${item.productId}`}
              style={{ color: DARK, fontWeight: 700, fontSize: "14.5px", textDecoration: "none", lineHeight: 1.3 }}
            >
              {item.name}
            </Link>
            {item.age && (
              <p style={{ margin: "3px 0 0", fontSize: "12.5px", color: MUTED }}>
                Size: <span style={{ color: DARK, fontWeight: 600 }}>{item.age}</span>
              </p>
            )}
            <p style={{ margin: "3px 0 0", fontSize: "12.5px", color: MUTED }}>{rupee(item.price)} each</p>
          </div>
          <button
            onClick={onRemove}
            aria-label={`Remove ${item.name}`}
            style={{
              alignSelf: "flex-start",
              background: "none",
              border: "none",
              color: MUTED,
              fontSize: "12.5px",
              fontWeight: 600,
              textDecoration: "underline",
              cursor: "pointer",
              padding: 0,
              flexShrink: 0,
            }}
          >
            Remove
          </button>
        </div>

        {unavailable ? (
          <p style={{ margin: "10px 0 0", fontSize: "12.5px", fontWeight: 700, color: "#d9534f" }}>
            {item.stock === 0 && item.age ? "This size is out of stock" : "No longer available"}. Remove it to continue.
          </p>
        ) : (
          <>
            {item.stock !== null && item.stock <= 3 && (
              <p style={{ margin: "6px 0 0", fontSize: "12px", fontWeight: 600, color: "#c07a2f" }}>
                Only {item.stock} left
              </p>
            )}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "8px",
                marginTop: "10px",
              }}
            >
              <QtyControl item={item} onChange={onQty} />
              <span style={{ fontSize: "15px", fontWeight: 800, color: DARK }}>
                {rupee(item.price * item.quantity)}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function Cart() {
  const navigate = useNavigate();
  const toast = useToast();
  const { items, subtotal, hasUnavailable, updateQuantity, removeItem, syncWithProducts } = useCart();

  const [syncing, setSyncing] = useState(items.length > 0);
  const [syncFailed, setSyncFailed] = useState(false);

  // Refresh price/stock from the server once when the page opens
  useEffect(() => {
    if (items.length === 0) return undefined;
    let cancelled = false;
    getProducts()
      .then((data) => {
        if (!cancelled) syncWithProducts(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (!cancelled) setSyncFailed(true);
      })
      .finally(() => {
        if (!cancelled) setSyncing(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (items.length === 0) {
    return (
      <div style={{ background: "#fdfbf9", fontFamily: '"Nunito", sans-serif', minHeight: "60vh" }}>
        <div style={{ maxWidth: "520px", margin: "0 auto", padding: "80px 20px", textAlign: "center" }}>
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke={PINK} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
          <h1 style={{ fontSize: "22px", fontWeight: 800, color: DARK, margin: "18px 0 6px" }}>Your cart is empty</h1>
          <p style={{ fontSize: "14px", color: MUTED, margin: "0 0 22px" }}>
            Looks like you haven't added anything yet.
          </p>
          <button
            onClick={() => navigate("/shop")}
            style={{
              background: PINK,
              color: "#fff",
              border: "none",
              borderRadius: "999px",
              padding: "11px 28px",
              fontFamily: '"Nunito", sans-serif',
              fontSize: "13.5px",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "#fdfbf9", fontFamily: '"Nunito", sans-serif' }}>
      <div className="max-w-[1100px] mx-auto px-5 md:px-8 py-8">
        <h1 style={{ fontSize: "24px", fontWeight: 800, color: DARK, margin: "0 0 4px" }}>Your Cart</h1>
        <div style={{ width: "40px", height: "3px", background: PINK, borderRadius: "2px", marginBottom: "18px" }} />

        {syncFailed && (
          <div style={{ background: "#fff4e5", color: "#8a5a14", borderRadius: "10px", padding: "10px 14px", fontSize: "13px", marginBottom: "12px" }}>
            Couldn't refresh the latest prices and stock. Showing your saved cart.
          </div>
        )}
        {hasUnavailable && (
          <div style={{ background: "#fdecea", color: "#a83a35", borderRadius: "10px", padding: "10px 14px", fontSize: "13px", marginBottom: "12px" }}>
            Some items are unavailable. Please remove them to continue.
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-[1fr_340px] gap-8 items-start">
          <div style={{ background: "#fff", borderRadius: "14px", padding: "4px 18px 8px", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
            {items.map((item, idx) => (
              <div key={item.key} style={idx === 0 ? { marginTop: "-1px" } : undefined}>
                <CartLine
                  item={item}
                  onQty={(q) => updateQuantity(item.key, q)}
                  onRemove={() => removeItem(item.key)}
                />
              </div>
            ))}
          </div>

          <aside
            className="md:sticky md:top-[110px]"
            style={{ background: CREAM, border: `1px solid ${BORDER}`, borderRadius: "14px", padding: "20px" }}
          >
            <h2 style={{ fontSize: "16px", fontWeight: 800, color: DARK, margin: "0 0 14px" }}>Order Summary</h2>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", color: DARK, marginBottom: "8px" }}>
              <span>Subtotal</span>
              <span style={{ fontWeight: 700 }}>{rupee(subtotal)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "16px", fontWeight: 800, color: DARK, padding: "12px 0", borderTop: `1px solid ${BORDER}`, marginTop: "8px" }}>
              <span>Total</span>
              <span>{rupee(subtotal)}</span>
            </div>
            {syncing && (
              <p style={{ fontSize: "12px", color: MUTED, margin: "0 0 10px" }}>Checking latest stock…</p>
            )}
            <button
              disabled={syncing || hasUnavailable || subtotal <= 0}
              onClick={() => toast.info("Checkout is coming in the next step")}
              style={{
                width: "100%",
                background: syncing || hasUnavailable ? "#f2d9df" : PINK,
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                padding: "13px",
                fontFamily: '"Nunito", sans-serif',
                fontSize: "13.5px",
                fontWeight: 700,
                letterSpacing: "0.03em",
                cursor: syncing || hasUnavailable ? "not-allowed" : "pointer",
              }}
            >
              PROCEED TO CHECKOUT
            </button>
            <Link
              to="/shop"
              style={{ display: "block", textAlign: "center", marginTop: "12px", fontSize: "13px", fontWeight: 600, color: MUTED }}
            >
              Continue Shopping
            </Link>
          </aside>
        </div>
      </div>
    </div>
  );
}
