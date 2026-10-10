import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById } from "../api/productApi.js";
import { useCart } from "../context/CartContext.jsx";
import { useFavorites } from "../context/FavoritesContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { SizeGuideTable } from "../components/SizeGuide.jsx";

const PINK = "#f4a7b9";
const DARK = "#2d2d2d";
const MUTED = "#8a7f7a";
const BORDER = "#e8ddd5";
const CREAM = "#fdf6f0";

function Accordion({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ borderTop: `1px solid ${BORDER}` }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 2px",
          background: "none",
          border: "none",
          cursor: "pointer",
          fontFamily: '"Nunito", sans-serif',
          fontWeight: 700,
          fontSize: "15px",
          color: DARK,
        }}
      >
        {title}
        <span style={{ fontSize: "18px", color: MUTED, fontWeight: 400 }}>
          {open ? "−" : "+"}
        </span>
      </button>
      {open && (
        <div
          style={{
            paddingBottom: "14px",
            fontFamily: '"Nunito", sans-serif',
            fontSize: "13.5px",
            color: MUTED,
            lineHeight: 1.6,
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [activeImg, setActiveImg] = useState(0);
  const [selectedAge, setSelectedAge] = useState(null);
  const [qty, setQty] = useState(1);
  const { addItem } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const toast = useToast();

  useEffect(() => {
    setLoading(true);
    setError(false);
    getProductById(id)
      .then((data) => {
        setProduct(data);
        setActiveImg(0);
        setSelectedAge(data.variants?.[0]?.age || null);
        setQty(1);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching product:", err);
        setError(true);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "40px 20px" }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="animate-pulse" style={{ background: "#f2eae4", borderRadius: "12px", aspectRatio: "1/1" }} />
          <div className="animate-pulse" style={{ background: "#f2eae4", borderRadius: "12px", height: "300px" }} />
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div style={{ maxWidth: "700px", margin: "0 auto", padding: "80px 20px", textAlign: "center" }}>
        <p style={{ fontFamily: '"Nunito", sans-serif', fontSize: "15px", color: MUTED }}>
          Product not found.
        </p>
        <button
          onClick={() => navigate("/shop")}
          style={{
            marginTop: "16px",
            background: PINK,
            color: "#fff",
            border: "none",
            borderRadius: "999px",
            padding: "10px 24px",
            fontFamily: '"Nunito", sans-serif',
            fontSize: "13px",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Back to Shop
        </button>
      </div>
    );
  }

  const images = product.images?.length ? product.images : ["/images/placeholder.png"];
  const selectedVariant = product.variants?.find((v) => v.age === selectedAge);
  const inStock = selectedVariant ? selectedVariant.stock > 0 : true;
  const stockCount = selectedVariant?.stock;
  const handleAddToCart = () => addItem(product, selectedVariant, qty);
  // BUY IT NOW: add this item, then go straight to checkout
  const handleBuyNow = () => {
    if (addItem(product, selectedVariant, qty)) navigate("/checkout");
  };

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const handleShare = async (label) => {
    const text = `${product.name} — The Little Store`;
    if (label === "Tweet") {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`, "_blank", "noopener,noreferrer");
      return;
    }
    if (label === "Pin it") {
      window.open(
        `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(shareUrl)}&media=${encodeURIComponent(
          new URL(images[0], shareUrl).href
        )}&description=${encodeURIComponent(text)}`,
        "_blank",
        "noopener,noreferrer"
      );
      return;
    }
    try {
      if (navigator.share) {
        await navigator.share({ title: product.name, text, url: shareUrl });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        toast.show("Link copied!", "success");
      }
    } catch {
      /* share dialog dismissed */
    }
  };
  const wished = isFavorite(product._id);

  return (
    <div style={{ background: "#fdfbf9", fontFamily: '"Nunito", sans-serif' }}>
      <div className="max-w-[1280px] mx-auto px-5 md:px-8 py-8 grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* ── Gallery ── */}
        <div className="flex gap-3">
          <div className="hidden sm:flex flex-col gap-2.5">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(i)}
                style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "8px",
                  overflow: "hidden",
                  border: i === activeImg ? `2px solid ${PINK}` : `1px solid ${BORDER}`,
                  padding: 0,
                  cursor: "pointer",
                  background: "#fff",
                }}
              >
                <img src={img} alt={`${product.name} ${i + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </button>
            ))}
          </div>

          <div style={{ position: "relative", flex: 1, borderRadius: "12px", overflow: "hidden", background: "#f8f3f0", aspectRatio: "1/1" }}>
            <img
              src={images[activeImg]}
              alt={product.name}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
            {images.length > 1 && (
              <>
                <button
                  onClick={() => setActiveImg((i) => (i === 0 ? images.length - 1 : i - 1))}
                  aria-label="Previous image"
                  style={{
                    position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)",
                    width: "34px", height: "34px", borderRadius: "50%", border: "none",
                    background: "rgba(255,255,255,0.9)", cursor: "pointer", fontSize: "16px", color: DARK,
                  }}
                >
                  ‹
                </button>
                <button
                  onClick={() => setActiveImg((i) => (i === images.length - 1 ? 0 : i + 1))}
                  aria-label="Next image"
                  style={{
                    position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)",
                    width: "34px", height: "34px", borderRadius: "50%", border: "none",
                    background: "rgba(255,255,255,0.9)", cursor: "pointer", fontSize: "16px", color: DARK,
                  }}
                >
                  ›
                </button>
              </>
            )}
          </div>
        </div>

        {/* ── Details ── */}
        <div>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px" }}>
            <h1 style={{ fontSize: "26px", fontWeight: 800, color: DARK, margin: "0 0 8px" }}>
              {product.name}
            </h1>
            <button
              onClick={() => toggleFavorite(product._id)}
              aria-label={wished ? "Remove from favorites" : "Add to favorites"}
              aria-pressed={wished}
              style={{
                flexShrink: 0,
                width: "38px",
                height: "38px",
                borderRadius: "50%",
                border: `1px solid ${BORDER}`,
                background: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24"
                fill={wished ? PINK : "none"}
                stroke={wished ? PINK : "#c0b0b0"}
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </button>
          </div>

          {product.category && (
            <p style={{ fontSize: "12.5px", letterSpacing: "0.06em", textTransform: "uppercase", color: MUTED, margin: "0 0 16px" }}>
              {product.category}
            </p>
          )}

          <div style={{ display: "flex", alignItems: "baseline", gap: "12px", margin: "8px 0 20px" }}>
            <span style={{ fontSize: "22px", fontWeight: 800, color: DARK }}>₹{product.price}</span>
            {selectedVariant && (
              <span style={{ fontSize: "13px", fontWeight: 600, color: inStock ? "#3fa66b" : "#d9534f" }}>
                {inStock ? `${stockCount} Available` : "Out of Stock"}
              </span>
            )}
          </div>

          {product.color && (
            <div style={{ marginBottom: "18px" }}>
              <p style={{ fontSize: "13px", fontWeight: 700, color: DARK, margin: "0 0 6px" }}>Color: <span style={{ fontWeight: 400, color: MUTED }}>{product.color}</span></p>
            </div>
          )}

          {product.variants?.length > 0 && (
            <div style={{ marginBottom: "22px" }}>
              <p style={{ fontSize: "13px", fontWeight: 700, color: DARK, margin: "0 0 8px" }}>
                Size: <span style={{ fontWeight: 400, color: MUTED }}>{selectedAge}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v) => (
                  <button
                    key={v.age}
                    onClick={() => setSelectedAge(v.age)}
                    disabled={v.stock === 0}
                    style={{
                      padding: "8px 14px",
                      borderRadius: "8px",
                      border: v.age === selectedAge ? `2px solid ${DARK}` : `1px solid ${BORDER}`,
                      background: v.stock === 0 ? "#f2eae4" : "#fff",
                      color: v.stock === 0 ? "#c4b9b2" : DARK,
                      fontFamily: '"Nunito", sans-serif',
                      fontSize: "13px",
                      fontWeight: 600,
                      cursor: v.stock === 0 ? "not-allowed" : "pointer",
                      textDecoration: v.stock === 0 ? "line-through" : "none",
                    }}
                  >
                    {v.age}
                  </button>
                ))}
              </div>
              <p style={{ fontSize: "12px", color: MUTED, margin: "10px 0 0" }}>
                No returns or exchanges — please check the Size Guide below before ordering.
              </p>
            </div>
          )}

          <div style={{ display: "flex", gap: "12px", marginBottom: "14px" }}>
            <div style={{ display: "flex", alignItems: "center", border: `1px solid ${BORDER}`, borderRadius: "8px" }}>
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                style={{ width: "38px", height: "40px", border: "none", background: "none", fontSize: "16px", cursor: "pointer", color: DARK }}
              >
                −
              </button>
              <span style={{ width: "30px", textAlign: "center", fontSize: "14px", fontWeight: 700, color: DARK }}>{qty}</span>
              <button
                onClick={() => setQty((q) => q + 1)}
                style={{ width: "38px", height: "40px", border: "none", background: "none", fontSize: "16px", cursor: "pointer", color: DARK }}
              >
                +
              </button>
            </div>
            <button
              disabled={!inStock}
              onClick={handleAddToCart}
              style={{
                flex: 1,
                background: inStock ? DARK : "#c4b9b2",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                fontFamily: '"Nunito", sans-serif',
                fontSize: "13.5px",
                fontWeight: 700,
                letterSpacing: "0.03em",
                cursor: inStock ? "pointer" : "not-allowed",
              }}
            >
              ADD TO CART
            </button>
          </div>

          <button
            disabled={!inStock}
            onClick={handleBuyNow}
            style={{
              width: "100%",
              background: inStock ? PINK : "#f2d9df",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              padding: "13px",
              fontFamily: '"Nunito", sans-serif',
              fontSize: "13.5px",
              fontWeight: 700,
              letterSpacing: "0.03em",
              cursor: inStock ? "pointer" : "not-allowed",
              marginBottom: "24px",
            }}
          >
            BUY IT NOW
          </button>

          {/* Trust badges */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", padding: "16px 0", borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}`, marginBottom: "6px" }}>
            {[
              "Eco Friendly Packaging",
              "Delivered Across India",
              "10,000+ Happy Customers",
              "Flexible & Secure Payment",
            ].map((item) => (
              <div key={item} style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "13px", color: DARK }}>
                <span style={{ color: PINK, fontSize: "15px" }}>✓</span>
                {item}
              </div>
            ))}
          </div>

          {/* Accordions */}
          <div>
            <Accordion title="Description" defaultOpen>
              {product.description || "No description available for this product yet."}
            </Accordion>
            <Accordion title="Size Guide">
              <SizeGuideTable />
            </Accordion>
            <Accordion title="Shipping Information">
              Orders are processed within 1-2 business days. Shipping is calculated at checkout based on your location and order weight.
            </Accordion>
            <Accordion title="Wash Care">
              Machine or hand wash in cold water. Do not bleach. Tumble dry low.
            </Accordion>
          </div>

          {/* Share */}
          <div style={{ display: "flex", gap: "18px", marginTop: "22px" }}>
            {["Share", "Tweet", "Pin it"].map((label) => (
              <button
                key={label}
                onClick={() => handleShare(label)}
                style={{
                  background: "none",
                  border: "none",
                  color: MUTED,
                  fontSize: "12.5px",
                  fontWeight: 600,
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
