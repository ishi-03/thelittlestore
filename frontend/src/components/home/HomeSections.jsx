import React from "react";
import { Link } from "react-router-dom";

/**
 * HomeSections — "The Little Store" landing-page sections
 * ───────────────────────────────────────────────────────
 * HomeStyles       one scoped <style> block (render once, at the top of Home)
 * HomeHero         full-width hero with photo collage
 * TrustMarquee     slow scrolling brand-promise strip
 * CollectionTiles  Shop by collection (Shop All / Women Wear / Twinning / Gift Sets)
 * PromiseSection   "Why parents love us"
 * GiftCta          gifting banner
 *
 * Optional photo: drop /public/images/women-wear.jpg to fill the Women Wear tile.
 */

const WHATSAPP_NUMBER = "919892734880";

export function HomeStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,600;0,9..144,700;1,9..144,600&display=swap');

      .hm-serif { font-family: "Fraunces", Georgia, serif; font-weight: 600; letter-spacing: -0.015em; }
      .hm-wrap { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
      .hm-pill { display: inline-block; font-family: "Nunito", sans-serif; font-weight: 800; font-size: 0.8rem; padding: 6px 16px;
        border-radius: 999px; background: #fff; color: #b8486a; box-shadow: 0 4px 14px rgba(0,0,0,0.06); margin-bottom: 14px; }
      .hm-h2 { font-size: clamp(1.8rem, 3.6vw, 2.6rem); line-height: 1.12; color: #34252e; margin: 0 0 10px; }
      .hm-sub { font-family: "Nunito", sans-serif; font-size: 1rem; color: #6f6168; line-height: 1.7; margin: 0 auto; max-width: 520px; }
      .hm-head { text-align: center; margin-bottom: 36px; }

      /* motion */
      @keyframes hmRise { from { opacity: 0; transform: translateY(22px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes hmFloat { 0%,100% { transform: translateY(0) rotate(var(--r, 0deg)); } 50% { transform: translateY(-9px) rotate(var(--r, 0deg)); } }
      @keyframes hmMarquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
      .hm-rise { opacity: 0; animation: hmRise 0.9s cubic-bezier(0.2,0.7,0.2,1) forwards; }
      .hm-float { animation: hmFloat 4.2s ease-in-out infinite; }
      @media (prefers-reduced-motion: reduce) {
        .hm-rise { opacity: 1; animation: none; }
        .hm-float { animation: none; }
        .hm-marquee-track { animation: none !important; }
        .hm-tile img { transition: none !important; }
      }

      /* buttons */
      .hm-btn { display: inline-flex; align-items: center; justify-content: center; font-family: "Nunito", sans-serif; font-weight: 800;
        font-size: 0.95rem; border: none; border-radius: 999px; padding: 0.9rem 2rem; cursor: pointer; text-decoration: none; white-space: nowrap;
        transition: transform .2s ease, box-shadow .2s ease; }
      .hm-btn:hover { transform: translateY(-2px); }
      .hm-btn-pink { color: #fff; background: linear-gradient(135deg, #e58aa3, #c9627e); box-shadow: 0 10px 24px rgba(201,98,126,0.38); }
      .hm-btn-ghost { color: #b8486a; background: #fff; border: 1.5px solid #f3c9d5; }
      .hm-btn-white { color: #b8486a; background: #fff; box-shadow: 0 8px 20px rgba(58,43,52,0.18); }
      .hm-btn-glass { color: #fff; background: rgba(255,255,255,0.16); border: 1px solid rgba(255,255,255,0.6); }

      /* hero */
      .hm-hero { position: relative; overflow: hidden; background: linear-gradient(150deg, #fff4ea 0%, #fde8ee 55%, #efe6fa 100%); }
      .hm-hero::before { content: ""; position: absolute; width: 520px; height: 520px; border-radius: 50%; top: -200px; right: -120px;
        background: radial-gradient(circle, rgba(245,216,122,0.40), rgba(245,216,122,0) 70%); pointer-events: none; }
      .hm-hero::after { content: ""; position: absolute; width: 420px; height: 420px; border-radius: 50%; bottom: -220px; left: -100px;
        background: radial-gradient(circle, rgba(167,127,196,0.22), rgba(167,127,196,0) 70%); pointer-events: none; }
      .hm-hero-grid { position: relative; z-index: 2; display: grid; grid-template-columns: 1.05fr 1fr; gap: 56px; align-items: center;
        max-width: 1200px; margin: 0 auto; padding: 72px 24px 80px; }
      .hm-hero-h1 { font-size: clamp(2.5rem, 5.6vw, 4.2rem); line-height: 1.04; color: #34252e; margin: 0 0 18px; }
      .hm-hero-h1 em { display: block; font-style: italic; color: #c9627e; }
      .hm-hero-p { font-family: "Nunito", sans-serif; font-size: 1.05rem; line-height: 1.8; color: #6b5a62; max-width: 460px; margin: 0 0 30px; }
      .hm-hero-actions { display: flex; flex-wrap: wrap; gap: 14px; margin-bottom: 34px; }
      .hm-hero-points { display: flex; flex-wrap: wrap; gap: 10px 26px; font-family: "Nunito", sans-serif; font-weight: 700; font-size: 0.86rem; color: #5b4852; }
      .hm-hero-points span { display: inline-flex; align-items: center; gap: 8px; }
      .hm-hero-points i { width: 7px; height: 7px; border-radius: 50%; background: #f5d87a; display: inline-block; }

      .hm-collage { position: relative; width: 100%; max-width: 440px; margin: 0 auto; padding-bottom: 36px; }
      .hm-arch-back { position: absolute; inset: 0 0 36px 0; transform: translate(18px, 18px); border-radius: 999px 999px 30px 30px; background: #e3d8f4; }
      .hm-arch { position: relative; aspect-ratio: 3 / 4; border-radius: 999px 999px 30px 30px; overflow: hidden; border: 6px solid #fff;
        box-shadow: 0 28px 54px rgba(120,70,90,0.24); background: #f8f3f0; }
      .hm-arch img { width: 100%; height: 100%; object-fit: cover; object-position: center 25%; display: block; }
      .hm-mini { position: absolute; left: -34px; bottom: 0; width: 42%; aspect-ratio: 1 / 1; border-radius: 26px; overflow: hidden;
        border: 5px solid #fff; box-shadow: 0 18px 36px rgba(120,70,90,0.24); background: #fde8ee; z-index: 3; }
      .hm-mini img { width: 100%; height: 100%; object-fit: cover; display: block; }
      .hm-sticker { position: absolute; top: 42px; right: -20px; z-index: 4; width: 100px; height: 100px; border-radius: 50%; background: #f5d87a;
        border: 3px solid #fff; display: flex; align-items: center; justify-content: center; text-align: center; --r: 10deg;
        box-shadow: 0 12px 24px rgba(200,150,20,0.35); font-family: "Nunito", sans-serif; font-weight: 800; font-size: 0.76rem; line-height: 1.25; color: #5a3d00; }
      .hm-deco { position: absolute; z-index: 4; pointer-events: none; }

      /* marquee */
      .hm-marquee { overflow: hidden; background: linear-gradient(90deg, #dc7a95, #c36f9c 60%, #a77fc4); padding: 14px 0; }
      .hm-marquee-track { display: flex; width: max-content; animation: hmMarquee 34s linear infinite; }
      .hm-marquee-item { display: inline-flex; align-items: center; gap: 18px; padding-right: 18px; white-space: nowrap;
        font-family: "Nunito", sans-serif; font-weight: 800; font-size: 0.86rem; letter-spacing: 0.04em; color: #fff; }
      .hm-marquee-item i { color: #f5d87a; font-style: normal; }

      /* collection tiles */
      .hm-collections { padding: 84px 0 40px; }
      .hm-tiles { display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px; }
      .hm-tile { position: relative; display: block; aspect-ratio: 3 / 4; border-radius: 26px; overflow: hidden; text-decoration: none;
        box-shadow: 0 10px 28px rgba(120,70,90,0.14); transition: transform .3s ease, box-shadow .3s ease; }
      .hm-tile:hover { transform: translateY(-6px); box-shadow: 0 20px 40px rgba(120,70,90,0.24); }
      .hm-tile img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; transition: transform .6s ease; }
      .hm-tile:hover img { transform: scale(1.07); }
      .hm-tile-shade { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(40,25,35,0) 45%, rgba(40,25,35,0.72) 100%); }
      .hm-tile-body { position: absolute; left: 0; right: 0; bottom: 0; padding: 22px; color: #fff; z-index: 2; }
      .hm-tile-title { font-size: 1.45rem; margin: 0 0 4px; color: #fff; }
      .hm-tile-link { font-family: "Nunito", sans-serif; font-weight: 700; font-size: 0.82rem; color: #fde8ee; }

      /* products wrapper */
      .hm-products { padding: 56px 0 24px; background: linear-gradient(180deg, #fff 0%, #fdf6f0 100%); }

      /* promise */
      .hm-promise { padding: 84px 0; background: #fffaf3; }
      .hm-promise-grid { display: grid; grid-template-columns: 0.9fr 1.1fr; gap: 64px; align-items: center; }
      .hm-promise-img { position: relative; max-width: 400px; margin: 0 auto; width: 100%; }
      .hm-promise-img .hm-arch { aspect-ratio: 4 / 5; }
      .hm-feats { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 28px; }
      .hm-feat { border-radius: 22px; padding: 20px; }
      .hm-feat h3 { font-family: "Nunito", sans-serif; font-size: 0.98rem; font-weight: 800; color: #34252e; margin: 12px 0 4px; }
      .hm-feat p { font-family: "Nunito", sans-serif; font-size: 0.86rem; line-height: 1.65; color: #6f6168; margin: 0; }
      .hm-feat-ic { width: 44px; height: 44px; border-radius: 50%; background: #fff; display: flex; align-items: center; justify-content: center; }

      /* gift cta */
      .hm-gift { padding: 20px 0 28px; background: #fffaf3; }
      .hm-gift-card { position: relative; overflow: hidden; border-radius: 34px; display: grid; grid-template-columns: 1.1fr 0.9fr; align-items: stretch;
        background: linear-gradient(135deg, #dc7a95 0%, #c36f9c 55%, #a77fc4 120%); }
      .hm-gift-card::before { content: ""; position: absolute; width: 380px; height: 380px; border-radius: 50%; top: -170px; left: -90px;
        background: radial-gradient(circle, rgba(255,255,255,0.26), rgba(255,255,255,0) 70%); pointer-events: none; }
      .hm-gift-text { position: relative; z-index: 1; padding: 56px 52px; }
      .hm-gift-img { position: relative; min-height: 320px; }
      .hm-gift-img img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }

      @media (max-width: 1024px) {
        .hm-tiles { grid-template-columns: repeat(2, 1fr); }
      }
      @media (max-width: 860px) {
        .hm-hero-grid { grid-template-columns: 1fr; gap: 44px; padding: 48px 20px 64px; text-align: center; }
        .hm-hero-p { margin-left: auto; margin-right: auto; }
        .hm-hero-actions, .hm-hero-points { justify-content: center; }
        .hm-collage { max-width: 340px; }
        .hm-mini { left: -14px; }
        .hm-sticker { right: -8px; width: 86px; height: 86px; }
        .hm-collections { padding: 60px 0 24px; }
        .hm-promise { padding: 60px 0; }
        .hm-promise-grid { grid-template-columns: 1fr; gap: 44px; }
        .hm-gift { padding-bottom: 24px; }
        .hm-gift-card { grid-template-columns: 1fr; }
        .hm-gift-text { padding: 40px 28px; }
        .hm-gift-img { min-height: 240px; }
      }
      @media (max-width: 520px) {
        .hm-tiles { gap: 12px; }
        .hm-tile { border-radius: 20px; }
        .hm-tile-body { padding: 14px; }
        .hm-tile-title { font-size: 1.1rem; }
        .hm-feats { grid-template-columns: 1fr; }
      }
    `}</style>
  );
}

/* ───────────── Hero ───────────── */

export function HomeHero() {
  return (
    <section className="hm-hero">
      <div className="hm-hero-grid">
        <div>
          <span className="hm-pill hm-rise" style={{ animationDelay: "0.05s" }}>
            Premium cotton nightsuits
          </span>
          <h1 className="hm-serif hm-hero-h1">
            <span className="hm-rise" style={{ display: "block", animationDelay: "0.2s" }}>Cozy nights,</span>
            <em className="hm-rise" style={{ animationDelay: "0.35s" }}>happy mornings</em>
          </h1>
          <p className="hm-hero-p hm-rise" style={{ animationDelay: "0.5s" }}>
            Soft, breathable, beautifully made nightsuits for your little dreamers —
            ready to wear, ready to gift.
          </p>
          <div className="hm-hero-actions hm-rise" style={{ animationDelay: "0.65s" }}>
            <Link to="/shop" className="hm-btn hm-btn-pink">Shop now</Link>
            <Link to="/twinning" className="hm-btn hm-btn-ghost">Twinning sets</Link>
          </div>
          <div className="hm-hero-points hm-rise" style={{ animationDelay: "0.8s" }}>
            <span><i />100% cotton</span>
            <span><i />Gift-boxed</span>
            <span><i />Delivered across India</span>
          </div>
        </div>

        <div className="hm-collage hm-rise" style={{ animationDelay: "0.3s" }}>
          <div className="hm-arch-back" />
          <div className="hm-arch">
            <img src="/images/banner2.jpeg" alt="Kids in cozy cotton nightsuits" />
          </div>
          <div className="hm-mini">
            <img src="/images/why1.jpeg" alt="Girl smiling in a cotton nightsuit" style={{ objectPosition: "center 25%" }} />
          </div>
          <div className="hm-sticker hm-float">Loved by kids,<br />trusted by<br />parents</div>
          <span className="hm-deco hm-float" style={{ top: "-14px", left: "12%", ["--r"]: "0deg" }}><Moon /></span>
          <span className="hm-deco hm-float" style={{ top: "32%", left: "-26px", animationDelay: "0.6s", ["--r"]: "12deg" }}><Star size={24} /></span>
          <span className="hm-deco hm-float" style={{ bottom: "30%", right: "-18px", animationDelay: "1.1s", ["--r"]: "-10deg" }}><Star size={18} /></span>
        </div>
      </div>
    </section>
  );
}

/* ───────────── Marquee ───────────── */

const MARQUEE_ITEMS = [
  "100% soft cotton",
  "Ribboned & gift-boxed",
  "Easy 7-day size exchange",
  "Gentle on little skin",
  "Delivered across India",
  "Made for cozy nights",
];

export function TrustMarquee() {
  const row = (key) => (
    <div key={key} className="hm-marquee-item" aria-hidden={key === "b"}>
      {MARQUEE_ITEMS.map((t) => (
        <React.Fragment key={t}>
          <span>{t}</span>
          <i>✦</i>
        </React.Fragment>
      ))}
    </div>
  );
  return (
    <div className="hm-marquee">
      <div className="hm-marquee-track">
        {row("a")}
        {row("b")}
      </div>
    </div>
  );
}

/* ───────────── Shop by collection ───────────── */

const TILES = [
  { title: "Shop All",   sub: "Nightsuits & more", to: "/shop",       img: "/images/giftStory1.jpeg",   bg: "linear-gradient(160deg,#fde8ee,#f8c9d6)" },
  { title: "Women Wear", sub: "Comfort for moms",  to: "/women-wear", img: "/images/women-wear.jpg",  bg: "linear-gradient(160deg,#ece3f8,#d9c8f0)", icon: true },
  { title: "Twinning",   sub: "Matching sets",     to: "/twinning",   img: "/images/banner3.jpeg",    bg: "linear-gradient(160deg,#fff4ea,#f8d9c4)" },
  { title: "Gift Sets",  sub: "Ribboned & boxed",  to: "/gift-sets",  img: "/images/gift-hero.jpeg",  bg: "linear-gradient(160deg,#f5f0d4,#ecdf9f)" },
];

export function CollectionTiles() {
  return (
    <section className="hm-collections">
      <div className="hm-wrap">
        <div className="hm-head">
          <span className="hm-pill">Collections</span>
          <h2 className="hm-serif hm-h2">Shop by collection</h2>
          <p className="hm-sub">Something soft for every little moment — and the grown-ups too.</p>
        </div>
        <div className="hm-tiles">
          {TILES.map((t) => (
            <Link key={t.title} to={t.to} className="hm-tile" style={{ background: t.bg }}>
              {t.icon && (
                <svg
                  width="84" height="84" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.2"
                  strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
                  style={{ position: "absolute", top: "30%", left: "50%", transform: "translate(-50%, -50%)", opacity: 0.85 }}
                >
                  <path d="M12 6a2 2 0 1 1 2 2c0 1-2 1.5-2 3l9 5.5a1 1 0 0 1-.5 1.8h-17A1 1 0 0 1 3 16.5L12 11" />
                </svg>
              )}
              <img
                src={t.img}
                alt=""
                onError={(e) => { e.currentTarget.style.display = "none"; }}
              />
              <div className="hm-tile-shade" />
              <div className="hm-tile-body">
                <p className="hm-serif hm-tile-title">{t.title}</p>
                <span className="hm-tile-link">{t.sub} →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────── Why parents love us ───────────── */

const FEATURES = [
  { title: "100% soft cotton",    body: "Breathable fabric that feels as good as it looks.", tint: "#fde8ee", stroke: "#c9627e", path: "M11 20A7 7 0 0 1 4 13c0-6 7-10 16-10 0 9-4 17-9 17z M4 21c3-6 6-9 11-11" },
  { title: "Gentle on skin",      body: "Made for little ones with sensitive skin.",         tint: "#e8e0f5", stroke: "#7a5fb0", path: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" },
  { title: "Comfy every day",     body: "Relaxed fits for cozy nights and slow mornings.",    tint: "#f5f0d4", stroke: "#8f7218", path: "M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" },
  { title: "Perfect for gifting", body: "Ribboned, boxed and ready to hand over.",            tint: "#fdf0e9", stroke: "#c4642c", path: "M20 12v9H4v-9 M2 7h20v5H2z M12 21V7 M12 7H7.5a2.5 2.5 0 1 1 0-5C11 2 12 7 12 7z M12 7h4.5a2.5 2.5 0 1 0 0-5C13 2 12 7 12 7z" },
];

export function PromiseSection() {
  return (
    <section className="hm-promise">
      <div className="hm-wrap">
        <div className="hm-promise-grid">
          <div className="hm-promise-img">
            <div className="hm-arch-back" style={{ inset: 0, transform: "translate(-16px, 16px)", background: "#f8d9c4" }} />
            <div className="hm-arch">
              <img src="/images/why1.jpeg" alt="Girl smiling in a cotton nightsuit" style={{ objectPosition: "center 20%" }} />
            </div>
          </div>

          <div>
            <span className="hm-pill" style={{ background: "#fde8ee" }}>Why The Little Store</span>
            <h2 className="hm-serif hm-h2">Made for the softest sleep</h2>
            <p className="hm-sub" style={{ margin: 0, maxWidth: "460px" }}>
              Every piece is chosen for comfort first — so bedtime feels like a hug.
            </p>
            <div className="hm-feats">
              {FEATURES.map((f) => (
                <div key={f.title} className="hm-feat" style={{ background: f.tint }}>
                  <span className="hm-feat-ic">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={f.stroke} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d={f.path} />
                    </svg>
                  </span>
                  <h3>{f.title}</h3>
                  <p>{f.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────────── Gift banner ───────────── */

export function GiftCta() {
  return (
    <section className="hm-gift">
      <div className="hm-wrap">
        <div className="hm-gift-card">
          <div className="hm-gift-text">
            <span className="hm-pill" style={{ background: "rgba(255,255,255,0.2)", color: "#fff", boxShadow: "none", border: "1px solid rgba(255,255,255,0.5)" }}>
              Gifting made easy
            </span>
            <h2 className="hm-serif hm-h2" style={{ color: "#fff" }}>Birthdays, baby showers & return gifts</h2>
            <p style={{ fontFamily: '"Nunito", sans-serif', fontSize: "1rem", lineHeight: 1.75, color: "#fff3f6", maxWidth: "440px", margin: "0 0 26px" }}>
              Soft cotton sets, beautifully wrapped. Ask us about special pricing on bulk orders.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "14px" }}>
              <Link to="/gift-sets" className="hm-btn hm-btn-white">Explore gift sets</Link>
              <a
                className="hm-btn hm-btn-glass"
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi! I'd like to ask about gift sets and bulk orders.")}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Chat on WhatsApp
              </a>
            </div>
          </div>
          <div className="hm-gift-img">
            <img src="/images/giftStory2.jpeg" alt="Gift sets neatly packed" onError={(e) => { e.currentTarget.style.display = "none"; }} />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────────── Decorations ───────────── */

function Moon() {
  return (
    <svg width="46" height="46" viewBox="0 0 54 54" fill="none" aria-hidden="true">
      <circle cx="27" cy="27" r="22" fill="#f5d87a" />
      <circle cx="37" cy="19" r="14" fill="#fff4ea" />
    </svg>
  );
}

function Star({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#f5d87a" aria-hidden="true">
      <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
    </svg>
  );
}
