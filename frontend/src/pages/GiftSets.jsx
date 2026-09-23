import React, { useEffect, useState } from "react";
import { getProducts } from "../api/productApi.js";
import ProductCard from "../components/ProductCard.jsx";

/**
 * GiftSets — "The Little Store"
 * ──────────────────────────────
 * Editorial, photo-led landing page for the "Gift Sets" quick-filter icon
 * on Home — full-bleed hero, alternating story sections, colorful "why us"
 * photo cards. Nunito font, existing brand colors (pink/lavender/cream)
 * kept, made bolder + more colorful throughout.
 *
 * IMAGES — drop files into /public/images with these exact names and they
 * show up automatically, no code changes needed. Until then everything
 * falls back to your existing banner photos so the page never breaks:
 *   - gift-hero.jpg        → full-width hero photo
 *   - gift-story-1.jpg     → "Perfect for Birthdays" section photo
 *   - gift-story-2.jpg     → "Bulk & Celebration Orders" section photo
 *   - gift-why-1.jpg / gift-why-2.jpg / gift-why-3.jpg
 *                          → the 3 colorful "why our gift sets" photo cards
 */

const WHATSAPP_NUMBER = "919892734880";
const whatsappLink = (message) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

const WHY_CARDS = [
  {
    img: "/images/gift-why-1.jpg",
    fallback: "/images/why1.jpeg",
    tint: "#fde8ee",
    accent: "#e0839b",
    title: "Loved By Kids & Parents",
    body: "Soft, skin-friendly fabrics that feel as good as they look — parent-approved, kid-adored.",
  },
   {
    img: "/images/why3.jpeg",
    fallback: "/images/why3.jpeg",
    tint: "#f5f0d4",
    accent: "#b8952e",
    title: "Bulk & Return-Gift Ready",
    body: "Planning a birthday or baby shower? Get special pricing on bulk gift-set orders.",
  },
  {
    img: "/images/gift-why-2.jpg",
    fallback: "/images/why2.jpeg",
    tint: "#e8e0f5",
    accent: "#9b82c8",
    title: "Beautifully Gift-Wrapped",
    body: "Every set arrives ribboned and boxed — ready to hand over, no extra wrapping needed.",
  },
 
];

export default function GiftSets() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts()
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .catch((err) => {
        console.log(err);
        setProducts([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const giftProducts = products.filter((p) =>
    p.category?.toLowerCase().includes("gift")
  );

  return (
    <div style={{ fontFamily: '"Nunito", sans-serif', overflowX: "hidden" }}>
      <style>{`
        @keyframes giftFadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes giftFloat {
          0%, 100% { transform: translateY(0px); }
          50%      { transform: translateY(-10px); }
        }
        .gift-fade-up { animation: giftFadeUp 0.7s ease both; }
        .gift-float   { animation: giftFloat 3.6s ease-in-out infinite; }
        .gift-why-img { transition: transform .4s ease; }
        .gift-why-card:hover .gift-why-img { transform: scale(1.07); }
        .gift-cta-btn { transition: background .2s, transform .2s; }
      `}</style>

      {/* ══════════════ FULL-BLEED HERO ══════════════ */}
      <section
        className="relative w-full flex items-end md:items-center"
        style={{ height: "560px", overflow: "hidden" }}
      >
        <ImgWithFallback
          src="/images/gift-hero.jpg"
          fallback="/images/gift-hero.jpeg"
          alt="Baby gift sets from The Little Store"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center 30%",
          }}
        />
        {/* Colorful gradient wash instead of plain dark overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(244,167,185,0.18) 0%, rgba(45,25,45,0.15) 45%, rgba(20,15,25,0.72) 100%)",
          }}
        />

        {/* Floating confetti dots for a playful, colorful touch */}
        <ConfettiDot top="12%" left="8%" color="#f5d87a" size={16} delay="0s" />
        <ConfettiDot top="20%" left="88%" color="#f4a7b9" size={20} delay="0.6s" />
        <ConfettiDot top="65%" left="92%" color="#9b82c8" size={14} delay="1.1s" />
        <ConfettiDot top="75%" left="5%" color="#7bbf8a" size={18} delay="0.3s" />

        <div
          className="gift-fade-up relative z-10 w-full max-w-[1200px] mx-auto px-6 md:px-12 pb-12 md:pb-16"
          style={{ textAlign: "center" }}
        >
          <span
            style={{
              fontFamily: '"Nunito", sans-serif',
              fontWeight: 700,
              fontSize: "0.8rem",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#f5d87a",
              display: "inline-block",
              marginBottom: "0.9rem",
            }}
          >
            Join the Little Store Family
          </span>

          <h1
            style={{
              fontFamily: '"Nunito", sans-serif',
              fontWeight: 900,
              fontSize: "clamp(2.2rem, 5vw, 3.6rem)",
              lineHeight: 1.15,
              color: "#ffffff",
              margin: "0 auto 1rem",
              maxWidth: "760px",
              textShadow: "0 2px 18px rgba(0,0,0,0.25)",
            }}
          >
            Spread Smiles With Our{" "}
            <span style={{ color: "#f4a7b9" }}>Gift Sets</span>
          </h1>

          <p
            style={{
              fontFamily: '"Nunito", sans-serif',
              fontWeight: 500,
              fontSize: "1rem",
              color: "#fdf6f0",
              maxWidth: "480px",
              margin: "0 auto 2rem",
              lineHeight: 1.7,
            }}
          >
            Curated bundles of our softest essentials, beautifully packaged
            for baby showers, birthdays, and every little celebration.
          </p>

          <button
            className="gift-cta-btn"
            onClick={() =>
              document
                .getElementById("gift-sets-grid")
                ?.scrollIntoView({ behavior: "smooth", block: "start" })
            }
            style={{
              fontFamily: '"Nunito", sans-serif',
              fontWeight: 700,
              fontSize: "0.92rem",
              color: "#fff",
              backgroundColor: "#f4a7b9",
              border: "none",
              borderRadius: "999px",
              padding: "0.85rem 2.3rem",
              cursor: "pointer",
              boxShadow: "0 8px 24px rgba(244,167,185,0.55)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#e0839b";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#f4a7b9";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            Shop Gift Sets
          </button>
        </div>
      </section>

      {/* ══════════════ STORY SECTION 1 — BIRTHDAY PARTY ENERGY ══════════════ */}
      <section
        className="relative"
        style={{
          background: "linear-gradient(135deg, #fff4d6 0%, #ffe3ec 50%, #e3f7ec 100%)",
          overflow: "hidden",
        }}
      >
        {/* Bunting flags along the top */}
        <BuntingRow />

        {/* Floating balloons + confetti around the whole section */}
        <span className="gift-float" style={{ position: "absolute", top: "8%", left: "3%", animationDelay: "0.1s" }}>
          <BalloonSVG color="#f4a7b9" size={46} />
        </span>
        <span className="gift-float" style={{ position: "absolute", top: "58%", left: "1%", animationDelay: "0.9s" }}>
          <BalloonSVG color="#f5d87a" size={34} />
        </span>
        <span className="gift-float" style={{ position: "absolute", top: "14%", right: "4%", animationDelay: "0.5s" }}>
          <BalloonSVG color="#9b82c8" size={40} />
        </span>
        <span className="gift-float" style={{ position: "absolute", top: "62%", right: "2%", animationDelay: "1.2s" }}>
          <BalloonSVG color="#7bbf8a" size={30} />
        </span>
        <ConfettiDot top="24%" left="22%" color="#f4a7b9" size={10} delay="0.2s" />
        <ConfettiDot top="80%" left="30%" color="#f5d87a" size={12} delay="0.7s" />
        <ConfettiDot top="20%" left="80%" color="#7bbf8a" size={10} delay="0.4s" />

        <div className="max-w-[1200px] mx-auto px-6 md:px-10 py-16 md:py-24 flex flex-col md:flex-row items-center gap-12 md:gap-16">
          {/* ── Tilted "polaroid" photo with sticker badge ── */}
          <div className="w-full md:w-1/2 flex justify-center">
            <div
              className="relative"
              style={{ transform: "rotate(-4deg)", maxWidth: "420px", width: "100%" }}
            >
              <div
                style={{
                  backgroundColor: "#fff",
                  padding: "14px 14px 34px",
                  borderRadius: "1.1rem",
                  boxShadow: "0 20px 40px rgba(90,60,40,0.25)",
                }}
              >
                <div className="rounded-[0.8rem] overflow-hidden" style={{ aspectRatio: "4/3" }}>
                  <ImgWithFallback
                    src="/images/giftStory1.jpeg"
                    fallback="/images/g.jpeg"
                    alt="Return gift favours for kids birthday parties"
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  />
                </div>
              </div>

              {/* Sticker badge, popped on the corner */}
              <div
                className="gift-float"
                style={{
                  position: "absolute",
                  top: "-22px",
                  right: "-22px",
                  width: "92px",
                  height: "92px",
                  borderRadius: "50%",
                  backgroundColor: "#ffd23f",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  transform: "rotate(9deg)",
                  boxShadow: "0 10px 22px rgba(255,180,20,0.5)",
                  border: "3px solid #fff",
                }}
              >
                <span
                  style={{
                    fontFamily: '"Nunito", sans-serif',
                    fontWeight: 900,
                    fontSize: "0.72rem",
                    lineHeight: 1.15,
                    color: "#5a3d00",
                  }}
                >
                  PARTY
                  <br />
                  FAVOURITE 🎉
                </span>
              </div>
            </div>
          </div>

          {/* ── Text ── */}
          <div className="w-full md:w-1/2">
            <span
              style={{
                display: "inline-block",
                backgroundColor: "#fff",
                color: "#e0839b",
                fontWeight: 800,
                fontSize: "0.75rem",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                padding: "0.4rem 1rem",
                borderRadius: "999px",
                marginBottom: "1.1rem",
                boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
              }}
            >
              🎈 Return Gifts
            </span>

            <h2
              style={{
                fontFamily: '"Nunito", sans-serif',
                fontWeight: 900,
                fontSize: "clamp(2rem, 3.6vw, 2.9rem)",
                lineHeight: 1.15,
                color: "#2d2d2d",
                marginBottom: "1.1rem",
              }}
            >
              Perfect Return Gifts
              <br />
              For{" "}
              <span style={{ position: "relative", display: "inline-block", color: "#e0839b" }}>
                Birthdays!
                <SquiggleSVG />
              </span>
            </h2>

            <p style={{ fontSize: "1rem", color: "#6b5f5a", lineHeight: 1.85, marginBottom: "1.8rem", maxWidth: "440px" }}>
              Birthdays are magical — the return gifts should be too! Surprise
              every little guest with soft, cozy sets that bring giggles,
              compliments, and memories that last way past the party. 🎂
            </p>

            <a
              href={whatsappLink("Hi! I'm interested in your Gift Sets for a birthday return gift order.")}
              target="_blank"
              rel="noopener noreferrer"
              className="gift-cta-btn"
              style={{
                display: "inline-block",
                fontFamily: '"Nunito", sans-serif',
                fontWeight: 800,
                fontSize: "0.9rem",
                color: "#fff",
                background: "linear-gradient(135deg, #f4a7b9, #e0839b)",
                border: "none",
                borderRadius: "999px",
                padding: "0.85rem 2.1rem",
                cursor: "pointer",
                boxShadow: "0 10px 24px rgba(224,131,155,0.45)",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-3px) scale(1.03)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0) scale(1)")}
            >
              🎉 Enquire for Party Favours
            </a>
          </div>
        </div>
      </section>

      {/* ══════════════ STORY SECTION 2 — text left, image right, peach/pink ══════════════ */}
      <section style={{ backgroundColor: "#fdf0e9" }}>
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 py-14 md:py-20 flex flex-col md:flex-row-reverse items-center gap-10 md:gap-16">
          <div className="w-full md:w-1/2 rounded-[1.75rem] overflow-hidden" style={{ aspectRatio: "4/3" }}>
            <ImgWithFallback
              src="/images/gift-story-2.jpg"
              fallback="/images/giftStory2.jpeg"
              alt="Bulk gift set orders for celebrations"
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          </div>
          <div className="w-full md:w-1/2">
            <span
              style={{
                display: "inline-block",
                backgroundColor: "#f8d9c4",
                color: "#a35a25",
                fontWeight: 700,
                fontSize: "0.72rem",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                padding: "0.35rem 0.9rem",
                borderRadius: "999px",
                marginBottom: "1rem",
              }}
            >
              Bulk Orders
            </span>
            <h2
              style={{
                fontFamily: '"Nunito", sans-serif',
                fontWeight: 900,
                fontSize: "clamp(1.7rem, 3vw, 2.4rem)",
                color: "#3a2a1f",
                lineHeight: 1.2,
                marginBottom: "1rem",
              }}
            >
              Gift Sets For Every Celebration
            </h2>
            <p style={{ fontSize: "0.95rem", color: "#6b5a4f", lineHeight: 1.8, marginBottom: "1.6rem", maxWidth: "440px" }}>
              School events, baby showers, or festive get-togethers — our
              100% cotton sets are made for the moment. Ask us about special
              pricing when you order in bulk.
            </p>
            <a
              href={whatsappLink("Hi! I'd like to ask about bulk pricing for Gift Sets.")}
              target="_blank"
              rel="noopener noreferrer"
              className="gift-cta-btn"
              style={{
                display: "inline-block",
                fontFamily: '"Nunito", sans-serif',
                fontWeight: 700,
                fontSize: "0.85rem",
                color: "#fff",
                backgroundColor: "#e0834a",
                border: "none",
                borderRadius: "999px",
                padding: "0.75rem 1.8rem",
                cursor: "pointer",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
            >
              Ask About Bulk Pricing
            </a>
          </div>
        </div>
      </section>
      {/* ══════════════ WHY OUR GIFT SETS — colorful photo cards ══════════════ */}
      <section style={{ backgroundColor: "#fffaf3" }} className="py-14 md:py-20">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10">
          <h2
            style={{
              fontFamily: '"Nunito", sans-serif',
              fontWeight: 900,
              fontSize: "clamp(1.8rem, 3.2vw, 2.5rem)",
              color: "#2d2d2d",
              textAlign: "center",
              marginBottom: "2.5rem",
            }}
          >
            Why Our Gift Sets?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {WHY_CARDS.map((c) => (
              <div key={c.title} className="gift-why-card">
                <div
                  className="rounded-[1.5rem] overflow-hidden mb-4"
                  style={{ aspectRatio: "4/3", backgroundColor: c.tint }}
                >
                  <ImgWithFallback
                    src={c.img}
                    fallback={c.fallback}
                    alt={c.title}
                    className="gift-why-img"
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  />
                </div>
                <h3
                  style={{
                    fontFamily: '"Nunito", sans-serif',
                    fontWeight: 800,
                    fontSize: "1.05rem",
                    color: c.accent,
                    marginBottom: "0.5rem",
                  }}
                >
                  {c.title}
                </h3>
                <p style={{ fontSize: "0.88rem", color: "#7a6f6a", lineHeight: 1.7 }}>
                  {c.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ PRODUCT GRID ══════════════ */}
      <section
        id="gift-sets-grid"
        className="max-w-[1200px] mx-auto px-6 md:px-10 py-14 scroll-mt-24"
      >
        {loading ? (
          <div className="py-16 text-center" style={{ color: "#8a7f7a" }}>
            Loading gift sets…
          </div>
        ) : giftProducts.length === 0 ? (
          <div
            className="py-16 text-center rounded-2xl"
            style={{ backgroundColor: "#fdf6f0", color: "#8a7f7a" }}
          >
            <p style={{ fontWeight: 700, color: "#2d2d2d", marginBottom: "6px" }}>
              New gift sets coming soon
            </p>
            <p style={{ fontSize: "0.85rem" }}>
              We're curating something special — check back shortly.
            </p>
          </div>
        ) : (
          <GiftSetsGrid products={giftProducts} />
        )}
      </section>

      {/* ══════════════ BOTTOM CTA — colorful confetti banner ══════════════ */}
      <section className="max-w-[1200px] mx-auto px-6 md:px-10 mb-16">
        <div
          className="relative flex flex-col md:flex-row items-center justify-between gap-5 rounded-[1.75rem] px-8 py-10 overflow-hidden"
          style={{ backgroundColor: "#f4a7b9" }}
        >
          <ConfettiDot top="15%" left="6%" color="#fff" size={10} delay="0.2s" />
          <ConfettiDot top="70%" left="14%" color="#f5d87a" size={14} delay="0.8s" />
          <ConfettiDot top="20%" left="92%" color="#fff" size={12} delay="0.4s" />
          <ConfettiDot top="75%" left="88%" color="#e8e0f5" size={16} delay="1s" />

          <div style={{ position: "relative", zIndex: 1 }}>
            <p style={{ fontWeight: 900, fontSize: "1.3rem", color: "#fff", marginBottom: "6px" }}>
              Can't find the perfect set?
            </p>
            <p style={{ fontSize: "0.9rem", color: "#fff0f3" }}>
              Tell us the occasion — we'll help you build a custom gift box.
            </p>
          </div>
          <a
            href={whatsappLink("Hi! I couldn't find the perfect gift set — can you help me build a custom gift box?")}
            target="_blank"
            rel="noopener noreferrer"
            className="gift-cta-btn"
            style={{
              position: "relative",
              zIndex: 1,
              display: "inline-block",
              fontFamily: '"Nunito", sans-serif',
              fontWeight: 700,
              fontSize: "0.88rem",
              color: "#e0839b",
              backgroundColor: "#fff",
              border: "none",
              borderRadius: "999px",
              padding: "0.8rem 2rem",
              cursor: "pointer",
              whiteSpace: "nowrap",
              boxShadow: "0 6px 18px rgba(0,0,0,0.15)",
              textDecoration: "none",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
          >
            Contact Us
          </a>
        </div>
      </section>
    </div>
  );
}

/* ───────────── Gift Sets product grid ───────────── */

function GiftSetsGrid({ products }) {
  return (
    <section>
      <h2
        style={{
          fontFamily: '"Nunito", sans-serif',
          fontWeight: 800,
          fontSize: "1.4rem",
          color: "#2d2d2d",
          margin: "0 0 1.4rem",
          textAlign: "center",
        }}
      >
        Shop All Gift Sets
      </h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: "14px",
        }}
      >
        {products.map((p) => (
          <ProductCard
            key={p._id}
            product={{ ...p, image: p.images?.[0], bg: "#f8f3f0" }}
          />
        ))}
      </div>
    </section>
  );
}

/* ───────────── Image with graceful fallback ───────────── */

function ImgWithFallback({ src, fallback, alt, style, className }) {
  const [current, setCurrent] = useState(src);
  return (
    <img
      src={current}
      alt={alt}
      style={style}
      className={className}
      onError={() => {
        if (current !== fallback) setCurrent(fallback);
      }}
    />
  );
}

/* ───────────── Birthday bunting row ───────────── */

function BuntingRow() {
  const colors = ["#f4a7b9", "#f5d87a", "#9b82c8", "#7bbf8a", "#f4a7b9", "#f5d87a", "#9b82c8", "#7bbf8a"];
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        gap: "6px",
        paddingTop: "14px",
        position: "relative",
        zIndex: 1,
      }}
    >
      {colors.map((c, i) => (
        <svg key={i} width="26" height="30" viewBox="0 0 26 30" style={{ transform: `rotate(${(i % 2 === 0 ? -4 : 4)}deg)` }}>
          <path d="M2 0 H24 L13 28 Z" fill={c} />
        </svg>
      ))}
    </div>
  );
}

/* ───────────── Balloon ───────────── */

function BalloonSVG({ color = "#f4a7b9", size = 40 }) {
  return (
    <svg width={size} height={size * 1.5} viewBox="0 0 40 60" fill="none">
      <ellipse cx="20" cy="22" rx="18" ry="21" fill={color} />
      <path d="M20 43 L23 48 L18 48 Z" fill={color} />
      <path
        d="M20 48 C20 48 14 54 20 60"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
        opacity="0.7"
      />
      <ellipse cx="14" cy="14" rx="4" ry="6" fill="#ffffff" opacity="0.35" />
    </svg>
  );
}

/* ───────────── Squiggle underline ───────────── */

function SquiggleSVG() {
  return (
    <svg
      width="100%"
      height="10"
      viewBox="0 0 140 10"
      preserveAspectRatio="none"
      style={{ position: "absolute", left: 0, bottom: "-8px" }}
    >
      <path
        d="M2 6 C 20 -2, 40 12, 60 6 S 100 -2, 138 6"
        stroke="#f5d87a"
        strokeWidth="3.5"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ───────────── Floating confetti dot ───────────── */

function ConfettiDot({ top, left, color, size = 14, delay = "0s" }) {
  return (
    <span
      className="gift-float"
      style={{
        position: "absolute",
        top,
        left,
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: "50%",
        backgroundColor: color,
        opacity: 0.85,
        zIndex: 2,
        animationDelay: delay,
        pointerEvents: "none",
      }}
    />
  );
}