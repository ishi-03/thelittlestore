import React, { useState, useEffect } from 'react';

/**
 * HeroBanner — "The Little Store"
 * Exact match to reference:
 *   • Warm cream bg (#f5ede0)
 *   • Left: Nunito Extra Bold headline, pink highlight line, light body, pink pill CTA
 *   • Right: baby photo fills full right half, no border radius on img
 *   • Floating: crescent moon (top-center), two yellow stars, white cloud (right)
 *   • Slider dots: bottom-left, pink filled dot + faded dots
 *   • Auto-advances every 4s
 *
 * Font (add to index.html):
 * <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
 */

const SLIDES = [
  {
    id: 1,
    h1: 'Cozy Nights,',
    hl: 'Happy Babies',
    body: "Super soft nightsuits made for your little one's peaceful sleep.",
    cta: 'Shop Now',
    img: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=800&q=80',
    imgAlt: 'Smiling baby in a soft white nightsuit with bunny toy',
  },
  {
    id: 2,
    h1: 'Dreamy Gift',
    hl: 'Sets for Babies',
    body: 'Curated bundles of our softest babywear — the perfect gift for new parents.',
    cta: 'Explore Gifts',
    img: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&q=80',
    imgAlt: 'Baby gift set',
  },
  {
    id: 3,
    h1: 'Organic Cotton',
    hl: 'Sleep Suits',
    body: "Breathable, GOTS-certified organic cotton — gentle on baby's delicate skin.",
    cta: 'Shop Organic',
    img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80',
    imgAlt: 'Baby in organic cotton suit',
  },
];

export default function HeroBanner() {
  const [cur, setCur] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setCur(c => (c + 1) % SLIDES.length), 4000);
    return () => clearInterval(t);
  }, []);

  const s = SLIDES[cur];

  return (
    <>
      {/* Keyframe animations injected once */}
      <style>{`
        @keyframes floatY {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-8px); }
        }
        @keyframes floatY2 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50%       { transform: translateY(-6px) rotate(8deg); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .float1 { animation: floatY  3.5s ease-in-out infinite; }
        .float2 { animation: floatY2 4.2s ease-in-out infinite 0.5s; }
        .float3 { animation: floatY  3s  ease-in-out infinite 1s; }
        .float4 { animation: floatY2 5s  ease-in-out infinite 0.2s; }
        .fade-up { animation: fadeUp 0.55s ease both; }
      `}</style>

      <section
        className="relative flex flex-col md:flex-row items-stretch
                   rounded-[1.5rem] overflow-hidden w-full"
        style={{ backgroundColor: '#f5ede0', minHeight: '340px' }}
      >

        {/* ══ LEFT — Text ════════════════════════════════ */}
        <div
          key={s.id}
          className="fade-up flex-1 flex flex-col justify-center
                     px-10 md:px-14 pt-12 pb-10 md:py-14 z-10"
          style={{ minWidth: 0 }}
        >
          {/* Headline */}
          <h1
            style={{
              fontFamily: '"Nunito", sans-serif',
              fontWeight: 900,
              fontSize: 'clamp(2rem, 4vw, 2.9rem)',
              lineHeight: 1.1,
              color: '#2d2d2d',
              marginBottom: '0.2rem',
              letterSpacing: '-0.01em',
            }}
          >
            {s.h1}
          </h1>

          {/* Pink highlight line */}
          <h1
            style={{
              fontFamily: '"Nunito", sans-serif',
              fontWeight: 900,
              fontSize: 'clamp(2rem, 4vw, 2.9rem)',
              lineHeight: 1.15,
              color: '#f4a7b9',
              marginBottom: '1.1rem',
              letterSpacing: '-0.01em',
            }}
          >
            {s.hl}
          </h1>

          {/* Body */}
          <p
            style={{
              fontFamily: '"Nunito", sans-serif',
              fontWeight: 500,
              fontSize: '0.9rem',
              color: '#8a7f7a',
              lineHeight: 1.75,
              maxWidth: '260px',
              marginBottom: '2rem',
            }}
          >
            {s.body}
          </p>

          {/* CTA pill */}
          <button
            style={{
              alignSelf: 'flex-start',
              fontFamily: '"Nunito", sans-serif',
              fontWeight: 700,
              fontSize: '0.88rem',
              color: '#fff',
              backgroundColor: '#f4a7b9',
              border: 'none',
              borderRadius: 'xxxpx',
              padding: '0.75rem 1.8rem',
              cursor: 'pointer',
              boxShadow: '0 6px 20px rgba(244,167,185,0.45)',
              transition: 'background 0.2s, transform 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = '#e0839b';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = '#f4a7b9';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            {s.cta}
          </button>
        </div>

        {/* ══ RIGHT — Photo + Decorations ══════════════ */}
        <div
          className="flex-1 relative overflow-hidden"
          style={{ minHeight: '280px' }}
        >
          {/* Baby photo — fills the entire right half */}
          <img
            key={s.img}
            src={s.img}
            alt={s.imgAlt}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center top',
            }}
          />

          {/* ── Moon — top center ── */}
          <span
            className="float1"
            style={{
              position: 'absolute',
              top: '10%',
              left: '38%',
              zIndex: 20,
              pointerEvents: 'none',
            }}
          >
            <MoonSVG />
          </span>

          {/* ── Star top-right ── */}
          <span
            className="float2"
            style={{
              position: 'absolute',
              top: '11%',
              right: '14%',
              zIndex: 20,
              pointerEvents: 'none',
            }}
          >
            <StarSVG size={26} />
          </span>

          {/* ── Star mid-left ── */}
          <span
            className="float3"
            style={{
              position: 'absolute',
              top: '52%',
              left: '6%',
              zIndex: 20,
              pointerEvents: 'none',
            }}
          >
            <StarSVG size={18} />
          </span>

          {/* ── Cloud — right ── */}
          <span
            className="float4"
            style={{
              position: 'absolute',
              top: '18%',
              right: '2%',
              zIndex: 20,
              pointerEvents: 'none',
            }}
          >
            <CloudSVG />
          </span>
        </div>

        {/* ══ Slider dots ══════════════════════════════ */}
        <div
          style={{
            position: 'absolute',
            bottom: '18px',
            left: '2.5rem',
            zIndex: 30,
            display: 'flex',
            gap: '7px',
            alignItems: 'center',
          }}
        >
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCur(i)}
              aria-label={`Slide ${i + 1}`}
              style={{
                height: '8px',
                width: i === cur ? '22px' : '8px',
                borderRadius: 'xxxpx',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: i === cur ? '#f4a7b9' : 'rgba(244,167,185,0.35)',
                transition: 'width 0.3s, background 0.3s',
                padding: 0,
              }}
            />
          ))}
        </div>
      </section>
    </>
  );
}

/* ── Decorations ──────────────────────────────────────── */

function MoonSVG() {
  return (
    <svg width="54" height="54" viewBox="0 0 54 54" fill="none">
      {/* Full yellow circle */}
      <circle cx="27" cy="27" r="22" fill="#f5d87a" opacity="0.95" />
      {/* Carve-out to create crescent */}
      <circle cx="36" cy="19" r="14" fill="#f5ede0" opacity="0.9" />
    </svg>
  );
}

function StarSVG({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#f5d87a">
      <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
    </svg>
  );
}

function CloudSVG() {
  return (
    <svg width="72" height="46" viewBox="0 0 72 46" fill="white" opacity="0.85">
      <ellipse cx="36" cy="32" rx="30" ry="14" />
      <ellipse cx="22" cy="26" rx="15" ry="13" />
      <ellipse cx="46" cy="22" rx="18" ry="14" />
    </svg>
  );
}