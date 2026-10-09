import React, { useEffect, useRef, useState } from "react";
import { getProducts } from "../api/productApi.js";
import ProductCard from "../components/ProductCard.jsx";

/**
 * GiftSets — "The Little Store"
 * ──────────────────────────────
 * Photo-led landing page for the "Gift Sets" quick-filter icon on Home.
 * Fonts: Nunito (body, existing brand font) + Fraunces (soft serif for headings).
 *
 * HERO VIDEO — put your video at:  /public/images/hero_video.mp4
 * (poster / fallback photo: /images/gift-hero.jpg or .jpeg)
 *
 * OTHER IMAGES — drop files into /public/images with these names and they show
 * up automatically. Until then everything falls back to existing photos:
 *   - gift-hero.jpg / gift-hero.jpeg → hero poster + fallback if video fails
 *   - giftStory1.jpeg                → "Return gifts" section photo
 *   - gift-story-2.jpg               → "Bulk orders" section photo
 *   - gift-why-1.jpg / gift-why-2.jpg → "why our gift sets" photos
 */

const WHATSAPP_NUMBER = "919892734880";
const whatsappLink = (message) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

const WHY_CARDS = [
  {
    img: "/images/gift-why-1.jpg",
    fallback: "/images/why1.jpeg",
    tint: "#fde8ee",
    accent: "#c9627e",
    title: "Loved By Kids & Parents",
    body: "Soft, skin-friendly fabrics that feel as good as they look — parent-approved, kid-adored.",
  },
   {
    img: "/images/why3.jpeg",
    fallback: "/images/why3.jpeg",
    tint: "#f5f0d4",
    accent: "#8f7218",
    title: "Bulk & Return-Gift Ready",
    body: "Planning a birthday or baby shower? Get special pricing on bulk gift-set orders.",
  },
  {
    img: "/images/gift-why-2.jpg",
    fallback: "/images/why2.jpeg",
    tint: "#e8e0f5",
    accent: "#7a5fb0",
    title: "Beautifully Gift-Wrapped",
    body: "Every set arrives ribboned and boxed — ready to hand over, no extra wrapping needed.",
  },
 
];

// Image frame shapes for the three "why" cards: arch, soft square, inverted arch
const WHY_SHAPES = [
  "999px 999px 28px 28px",
  "28px",
  "28px 28px 999px 999px",
];

export default function GiftSets() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const heroVideoRef = useRef(null);

  useEffect(() => {
    getProducts()
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .catch((err) => {
        console.log(err);
        setProducts([]);
      })
      .finally(() => setLoading(false));
  }, []);

  // Autoplay the hero video silently; stay paused for people who prefer reduced motion
  useEffect(() => {
    const v = heroVideoRef.current;
    if (!v) return;
    v.muted = true;
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      v.pause();
    } else {
      const p = v.play();
      if (p && p.catch) p.catch(() => {});
    }
  }, []);

  const giftProducts = products.filter((p) =>
    p.category?.toLowerCase().includes("gift")
  );

  return (
    <div className="gs-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,600;0,9..144,700;1,9..144,600&display=swap');

        .gs-root { font-family: "Nunito", sans-serif; color: #3a2b34; overflow-x: hidden; }
        .gs-serif { font-family: "Fraunces", Georgia, serif; font-weight: 600; letter-spacing: -0.015em; }

        /* ── motion ── */
        @keyframes gsRise {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes gsFloat {
          0%, 100% { transform: translateY(0) rotate(10deg); }
          50%      { transform: translateY(-8px) rotate(10deg); }
        }
        .gs-rise { opacity: 0; animation: gsRise 0.95s cubic-bezier(0.2, 0.7, 0.2, 1) forwards; }
        .gs-float { animation: gsFloat 4s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .gs-rise { opacity: 1; animation: none; }
          .gs-float { animation: none; transform: rotate(10deg); }
          .gs-why-img { transition: none !important; }
        }

        /* ── buttons ── */
        .gs-btn {
          display: inline-flex; align-items: center; justify-content: center;
          font-family: "Nunito", sans-serif; font-weight: 800; font-size: 0.95rem;
          border: none; border-radius: 999px; padding: 0.9rem 2rem;
          cursor: pointer; text-decoration: none; white-space: nowrap;
          transition: transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
        }
        .gs-btn:hover { transform: translateY(-2px); }
        .gs-btn:focus-visible { outline: 3px solid #7a5fb0; outline-offset: 3px; }
        .gs-btn-pink  { color: #fff; background: linear-gradient(135deg, #e58aa3, #c9627e); box-shadow: 0 10px 24px rgba(201,98,126,0.38); }
        .gs-btn-glass { color: #fff; background: rgba(255,255,255,0.16); border: 1px solid rgba(255,255,255,0.6); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); }
        .gs-btn-glass:hover { background: rgba(255,255,255,0.28); }
        .gs-btn-hero:focus-visible { outline-color: #fff; }
        .gs-btn-amber { color: #fff; background: #c4642c; box-shadow: 0 10px 22px rgba(196,100,44,0.30); }
        .gs-btn-white { color: #b8486a; background: #fff; box-shadow: 0 8px 20px rgba(58,43,52,0.18); }

        /* ── hero ── */
        .gs-hero { position: relative; width: 100%; height: min(86vh, 720px); min-height: 540px; display: flex; align-items: flex-end; overflow: hidden; background: #3a2b34; }
        .gs-hero-media { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center 30%; }
        .gs-hero-shade {
          position: absolute; inset: 0;
          background:
            linear-gradient(90deg, rgba(34,22,30,0.50) 0%, rgba(34,22,30,0.12) 62%, rgba(34,22,30,0) 100%),
            linear-gradient(180deg, rgba(58,43,52,0.10) 0%, rgba(58,43,52,0.18) 38%, rgba(30,19,27,0.82) 100%);
        }
        .gs-hero-inner { position: relative; z-index: 2; width: 100%; max-width: 1200px; margin: 0 auto; padding: 0 24px 60px; }
        .gs-hero-pill {
          display: inline-flex; align-items: center; gap: 8px; margin-bottom: 1.2rem;
          padding: 0.45rem 1rem; border-radius: 999px; font-weight: 700; font-size: 0.82rem; color: #fff;
          background: rgba(255,255,255,0.16); border: 1px solid rgba(255,255,255,0.45);
          backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
        }
        .gs-hero-pill i { width: 7px; height: 7px; border-radius: 50%; background: #f5d87a; display: inline-block; }
        .gs-hero-h1 { font-size: clamp(2.5rem, 6.2vw, 4.6rem); line-height: 1.04; color: #fff; margin: 0 0 1.1rem; max-width: 780px; text-shadow: 0 2px 22px rgba(0,0,0,0.25); }
        .gs-hero-h1 em { font-style: italic; font-weight: 600; color: #fde8ee; }
        .gs-hero-p { font-size: 1.05rem; font-weight: 500; color: #fff7f2; max-width: 500px; line-height: 1.7; margin: 0 0 2rem; }
        .gs-hero-actions { display: flex; flex-wrap: wrap; gap: 14px; }

        /* ── trust strip ── */
        .gs-strip { background: #fff; border-bottom: 1px solid #f3e4e4; }
        .gs-strip-inner { max-width: 1200px; margin: 0 auto; padding: 20px 24px; display: flex; flex-wrap: wrap; justify-content: center; gap: 14px 48px; }
        .gs-strip-item { display: flex; align-items: center; gap: 10px; font-weight: 700; font-size: 0.92rem; color: #5b4852; }
        .gs-strip-item svg { flex: none; }

        /* ── shared layout ── */
        .gs-wrap { max-width: 1200px; margin: 0 auto; padding: 96px 24px; display: flex; align-items: center; gap: 80px; }
        .gs-col { flex: 1 1 0; min-width: 0; }
        .gs-pill { display: inline-block; font-weight: 800; font-size: 0.82rem; padding: 0.4rem 1rem; border-radius: 999px; margin-bottom: 1.2rem; }
        .gs-h2 { font-size: clamp(2rem, 3.8vw, 3.05rem); line-height: 1.1; margin: 0 0 1.2rem; }
        .gs-lead { font-size: 1.02rem; line-height: 1.85; max-width: 460px; margin: 0 0 2rem; }

        /* ── story 1: return gifts ── */
        .gs-story1 { position: relative; overflow: hidden; background: linear-gradient(160deg, #fff4ea 0%, #fde8ee 58%, #f1e9fa 100%); }
        .gs-story1::before { content: ""; position: absolute; width: 480px; height: 480px; border-radius: 50%; top: -160px; right: -120px; background: radial-gradient(circle, rgba(245,216,122,0.38), rgba(245,216,122,0) 70%); pointer-events: none; }
        .gs-arch-wrap { position: relative; width: 100%; max-width: 410px; margin: 0 auto; }
        .gs-arch-back { position: absolute; inset: 0; transform: translate(20px, 20px); border-radius: 999px 999px 30px 30px; background: #e3d8f4; }
        .gs-arch { position: relative; aspect-ratio: 4 / 5; border-radius: 999px 999px 30px 30px; overflow: hidden; border: 6px solid #fff; box-shadow: 0 26px 50px rgba(120,70,90,0.22); background: #f8f3f0; }
        .gs-sticker {
          position: absolute; top: 34px; right: -18px; z-index: 3; width: 98px; height: 98px; border-radius: 50%;
          background: #f5d87a; border: 3px solid #fff; display: flex; align-items: center; justify-content: center; text-align: center;
          box-shadow: 0 12px 24px rgba(200,150,20,0.35); transform: rotate(10deg);
        }
        .gs-sticker span { font-size: 0.78rem; line-height: 1.2; color: #5a3d00; font-weight: 700; }

        /* ── story 2: bulk orders ── */
        .gs-story2 { background: #fdf0e9; }
        .gs-frame-wrap { position: relative; width: 100%; }
        .gs-frame-back { position: absolute; inset: 0; transform: translate(-18px, 18px); border-radius: 30px; background: #f8d9c4; }
        .gs-frame { position: relative; aspect-ratio: 4 / 3; border-radius: 30px; overflow: hidden; box-shadow: 0 22px 44px rgba(120,70,40,0.18); background: #f8d9c4; }

        /* ── why our gift sets ── */
        .gs-why { background: #fffaf3; padding: 96px 0 104px; }
        .gs-why-inner { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
        .gs-why-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 44px; align-items: start; }
        .gs-why-card:nth-child(2) { margin-top: 56px; }
        .gs-why-media { aspect-ratio: 4 / 5; overflow: hidden; margin-bottom: 1.4rem; }
        .gs-why-img { transition: transform 0.5s ease; }
        .gs-why-card:hover .gs-why-img { transform: scale(1.06); }

        /* ── product grid ── */
        .gs-shop { max-width: 1200px; margin: 0 auto; padding: 88px 24px 72px; scroll-margin-top: 90px; }
        .gs-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }

        /* ── bottom CTA ── */
        .gs-cta { max-width: 1200px; margin: 0 auto 80px; padding: 0 24px; }
        .gs-cta-card {
          position: relative; overflow: hidden; border-radius: 32px; padding: 52px 48px;
          display: flex; align-items: center; justify-content: space-between; gap: 28px;
          background: linear-gradient(135deg, #dc7a95 0%, #c36f9c 55%, #a77fc4 120%);
        }
        .gs-cta-card::before { content: ""; position: absolute; width: 380px; height: 380px; border-radius: 50%; top: -170px; right: -90px; background: radial-gradient(circle, rgba(255,255,255,0.28), rgba(255,255,255,0) 70%); pointer-events: none; }
        .gs-cta-card::after { content: ""; position: absolute; width: 280px; height: 280px; border-radius: 50%; bottom: -150px; left: 12%; background: radial-gradient(circle, rgba(245,216,122,0.30), rgba(245,216,122,0) 70%); pointer-events: none; }
        .gs-cta-text { position: relative; z-index: 1; }

        /* ── responsive ── */
        @media (max-width: 1024px) {
          .gs-grid { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 860px) {
          .gs-wrap { flex-direction: column; gap: 52px; padding: 68px 20px; }
          .gs-wrap-rev { flex-direction: column-reverse; }
          .gs-lead { max-width: none; }
          .gs-why { padding: 72px 0 80px; }
          .gs-why-grid { grid-template-columns: 1fr; gap: 48px; }
          .gs-why-card { max-width: 420px; width: 100%; margin: 0 auto; }
          .gs-why-card:nth-child(2) { margin-top: 0; }
          .gs-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
          .gs-shop { padding: 64px 20px 56px; }
          .gs-cta-card { flex-direction: column; align-items: flex-start; padding: 40px 28px; }
          .gs-hero { min-height: 520px; }
          .gs-hero-inner { padding: 0 20px 44px; }
          .gs-sticker { right: -6px; width: 88px; height: 88px; }
          .gs-frame-back { transform: translate(-10px, 12px); }
          .gs-arch-back { transform: translate(12px, 14px); }
        }
      `}</style>

      {/* ══════════════ HERO — VIDEO ══════════════ */}
      <section className="gs-hero">
        {/* Photo sits underneath as a fallback while the video loads (or if it can't) */}
        <ImgWithFallback
          src="/images/gift-hero.jpg"
          fallback="/images/gift-hero.jpeg"
          alt=""
          className="gs-hero-media"
        />
        <video
          ref={heroVideoRef}
          className="gs-hero-media"
          src="/images/hero_video.mp4"
          poster="/images/gift-hero.jpeg"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
        <div className="gs-hero-shade" />

        <div className="gs-hero-inner">
          <span className="gs-hero-pill gs-rise" style={{ animationDelay: "0.1s" }}>
            <i />
            Join the Little Store family
          </span>

          <h1 className="gs-serif gs-hero-h1">
            <span className="gs-rise" style={{ display: "block", animationDelay: "0.25s" }}>
              Spread smiles
            </span>
            <em className="gs-rise" style={{ display: "block", animationDelay: "0.4s" }}>
              with our gift sets
            </em>
          </h1>

          <p className="gs-hero-p gs-rise" style={{ animationDelay: "0.6s" }}>
            Curated bundles of our softest essentials, beautifully packaged
            for baby showers, birthdays, and every little celebration.
          </p>

          <div className="gs-hero-actions gs-rise" style={{ animationDelay: "0.75s" }}>
            <button
              className="gs-btn gs-btn-pink gs-btn-hero"
              onClick={() =>
                document
                  .getElementById("gift-sets-grid")
                  ?.scrollIntoView({ behavior: "smooth", block: "start" })
              }
            >
              Shop gift sets
            </button>
            <a
              className="gs-btn gs-btn-glass gs-btn-hero"
              href={whatsappLink("Hi! I'd like help choosing a Gift Set.")}
              target="_blank"
              rel="noopener noreferrer"
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ══════════════ TRUST STRIP ══════════════ */}
      <div className="gs-strip">
        <div className="gs-strip-inner">
          <StripItem
            label="100% cotton, soft on skin"
            path="M11 20A7 7 0 0 1 4 13c0-6 7-10 16-10 0 9-4 17-9 17z M4 21c3-6 6-9 11-11"
          />
          <StripItem
            label="Ribboned and boxed"
            path="M20 12v9H4v-9 M2 7h20v5H2z M12 21V7 M12 7H7.5a2.5 2.5 0 1 1 0-5C11 2 12 7 12 7z M12 7h4.5a2.5 2.5 0 1 0 0-5C13 2 12 7 12 7z"
          />
          <StripItem
            label="Special pricing on bulk orders"
            path="M20.6 13.4l-7.2 7.2a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8z M7.5 7.5h.01"
          />
        </div>
      </div>

      {/* ══════════════ STORY 1 — RETURN GIFTS ══════════════ */}
      <section className="gs-story1">
        <div className="gs-wrap">
          <div className="gs-col">
            <div className="gs-arch-wrap">
              <div className="gs-arch-back" />
              <div className="gs-arch">
                <ImgWithFallback
                  src="/images/giftStory1.jpeg"
                  fallback="/images/gift-hero.jpeg"
                  alt="Return gift favours for kids birthday parties"
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
              </div>
              <div className="gs-sticker gs-float">
                <span>
                  Party
                  <br />
                  favourite
                </span>
              </div>
            </div>
          </div>

          <div className="gs-col">
            <span className="gs-pill" style={{ background: "#fff", color: "#b8486a", boxShadow: "0 4px 14px rgba(0,0,0,0.06)" }}>
              Return gifts
            </span>
            <h2 className="gs-serif gs-h2" style={{ color: "#34252e" }}>
              Perfect return gifts for birthdays
            </h2>
            <p className="gs-lead" style={{ color: "#6b5a62" }}>
              Birthdays are magical — the return gifts should be too! Surprise
              every little guest with soft, cozy sets that bring giggles,
              compliments, and memories that last way past the party.
            </p>
            <a
              href={whatsappLink("Hi! I'm interested in your Gift Sets for a birthday return gift order.")}
              target="_blank"
              rel="noopener noreferrer"
              className="gs-btn gs-btn-pink"
            >
              Enquire for party favours
            </a>
          </div>
        </div>
      </section>

      {/* ══════════════ STORY 2 — BULK ORDERS ══════════════ */}
      <section className="gs-story2">
        <div className="gs-wrap gs-wrap-rev">
          <div className="gs-col">
            <span className="gs-pill" style={{ background: "#f8d9c4", color: "#8a461a" }}>
              Bulk orders
            </span>
            <h2 className="gs-serif gs-h2" style={{ color: "#3a2a1f" }}>
              Gift sets for every celebration
            </h2>
            <p className="gs-lead" style={{ color: "#6b5a4f" }}>
              School events, baby showers, or festive get-togethers — our
              100% cotton sets are made for the moment. Ask us about special
              pricing when you order in bulk.
            </p>
            <a
              href={whatsappLink("Hi! I'd like to ask about bulk pricing for Gift Sets.")}
              target="_blank"
              rel="noopener noreferrer"
              className="gs-btn gs-btn-amber"
            >
              Ask about bulk pricing
            </a>
          </div>

          <div className="gs-col" style={{ width: "100%" }}>
            <div className="gs-frame-wrap">
              <div className="gs-frame-back" />
              <div className="gs-frame">
                <ImgWithFallback
                  src="/images/gift-story-2.jpg"
                  fallback="/images/giftStory2.jpeg"
                  alt="Bulk gift set orders for celebrations"
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════ WHY OUR GIFT SETS ══════════════ */}
      <section className="gs-why">
        <div className="gs-why-inner">
          <h2
            className="gs-serif"
            style={{
              fontSize: "clamp(2rem, 3.6vw, 2.8rem)",
              color: "#34252e",
              textAlign: "center",
              margin: "0 0 3.2rem",
            }}
          >
            Why our gift sets?
          </h2>

          <div className="gs-why-grid">
            {WHY_CARDS.map((c, i) => (
              <div key={c.title} className="gs-why-card">
                <div
                  className="gs-why-media"
                  style={{ backgroundColor: c.tint, borderRadius: WHY_SHAPES[i % WHY_SHAPES.length] }}
                >
                  <ImgWithFallback
                    src={c.img}
                    fallback={c.fallback}
                    alt={c.title}
                    className="gs-why-img"
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  />
                </div>
                <h3
                  className="gs-serif"
                  style={{ fontSize: "1.3rem", color: c.accent, margin: "0 0 0.5rem" }}
                >
                  {c.title}
                </h3>
                <p style={{ fontSize: "0.95rem", color: "#6f6168", lineHeight: 1.75, margin: 0 }}>
                  {c.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ PRODUCT GRID ══════════════ */}
      <section id="gift-sets-grid" className="gs-shop">
        {loading ? (
          <div style={{ padding: "64px 0", textAlign: "center", color: "#8a7f7a", fontWeight: 600 }}>
            Loading gift sets…
          </div>
        ) : giftProducts.length === 0 ? (
          <div
            style={{
              padding: "64px 20px",
              textAlign: "center",
              borderRadius: "28px",
              backgroundColor: "#fdf6f0",
              color: "#8a7f7a",
            }}
          >
            <p className="gs-serif" style={{ fontSize: "1.3rem", color: "#34252e", margin: "0 0 8px" }}>
              New gift sets coming soon
            </p>
            <p style={{ fontSize: "0.92rem", margin: 0 }}>
              We're curating something special — check back shortly.
            </p>
          </div>
        ) : (
          <GiftSetsGrid products={giftProducts} />
        )}
      </section>

      {/* ══════════════ BOTTOM CTA ══════════════ */}
      <section className="gs-cta">
        <div className="gs-cta-card">
          <div className="gs-cta-text">
            <p className="gs-serif" style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)", color: "#fff", margin: "0 0 8px" }}>
              Can't find the perfect set?
            </p>
            <p style={{ fontSize: "1rem", color: "#fff7f9", margin: 0, maxWidth: "460px", lineHeight: 1.65 }}>
              Tell us the occasion — we'll help you build a custom gift box.
            </p>
          </div>
          <a
            href={whatsappLink("Hi! I couldn't find the perfect gift set — can you help me build a custom gift box?")}
            target="_blank"
            rel="noopener noreferrer"
            className="gs-btn gs-btn-white"
            style={{ position: "relative", zIndex: 1 }}
          >
            Contact us
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
      <div style={{ textAlign: "center", marginBottom: "2.2rem" }}>
        <h2
          className="gs-serif"
          style={{ fontSize: "clamp(1.8rem, 3.2vw, 2.5rem)", color: "#34252e", margin: "0 0 6px" }}
        >
          Shop all gift sets
        </h2>
        <p style={{ fontSize: "0.95rem", color: "#8a7f7a", margin: 0, fontWeight: 600 }}>
          {products.length} {products.length === 1 ? "set" : "sets"} to choose from
        </p>
      </div>
      <div className="gs-grid">
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

/* ───────────── Trust strip item ───────────── */

function StripItem({ label, path }) {
  return (
    <div className="gs-strip-item">
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#c9627e"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d={path} />
      </svg>
      <span>{label}</span>
    </div>
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