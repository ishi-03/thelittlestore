import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext.jsx';
import { useCart } from '../context/CartContext.jsx';

const PINK = '#f4a7b9';
const PINK_DARK = '#e8899f';
const DARK = '#2d2d2d';
const MUTED = '#8a7f7a';
const BORDER = '#f0e8e0';

const FONT = '"Nunito", sans-serif';

export default function ProductCard({ product, hideCart = false }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { addItem } = useCart();
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);

  const wished = isFavorite(product._id);
  const { name, price, category } = product;
  const image = product.image || product.images?.[0];
  const bg = product.bg || '#f8f3f0';

  const variants = Array.isArray(product.variants) ? product.variants : [];
  const hasVariants = variants.length > 0;
  const inStockVariants = variants.filter((v) => Number(v.stock) > 0);
  const totalStock = variants.reduce((n, v) => n + (Number(v.stock) || 0), 0);

  const [variantId, setVariantId] = useState(
    inStockVariants[0] ? String(inStockVariants[0]._id) : ''
  );
  const selected = variants.find((v) => String(v._id) === variantId) || null;

  const soldOut = product.isActive === false || (hasVariants && inStockVariants.length === 0);
  const lowStock = !soldOut && hasVariants && totalStock <= 3;

  const stop = (fn) => (e) => {
    e.stopPropagation();
    fn(e);
  };

  const visibleVariants = variants.slice(0, 3);
  const extra = variants.length - visibleVariants.length;

  return (
    <article
      onClick={() => navigate(`/product/${product._id}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: '#fff',
        borderRadius: '16px',
        overflow: 'hidden',
        border: `1px solid ${BORDER}`,
        boxShadow: hovered ? '0 10px 28px rgba(244,167,185,0.28)' : '0 2px 12px rgba(0,0,0,0.06)',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform .2s, box-shadow .2s',
        cursor: 'pointer',
        fontFamily: FONT,
      }}
    >
      {/* ── Image area ── */}
      <div style={{ position: 'relative', backgroundColor: bg, width: '100%', aspectRatio: '1 / 1', overflow: 'hidden' }}>
        {image && (
          <img
            src={image}
            alt={name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              display: 'block',
              transform: hovered ? 'scale(1.05)' : 'scale(1)',
              transition: 'transform .35s',
              filter: soldOut ? 'grayscale(0.6)' : 'none',
              opacity: soldOut ? 0.75 : 1,
            }}
          />
        )}

        {/* Status badge */}
        {(soldOut || lowStock) && (
          <span
            style={{
              position: 'absolute', top: '10px', left: '10px',
              background: soldOut ? DARK : '#fff4e5',
              color: soldOut ? '#fff' : '#b9701d',
              fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.03em',
              padding: '4px 9px', borderRadius: '999px',
            }}
          >
            {soldOut ? 'Sold out' : `Only ${totalStock} left`}
          </span>
        )}

        {/* Heart button */}
        <button
          onClick={stop(() => toggleFavorite(product._id))}
          aria-label="Wishlist"
          aria-pressed={wished}
          style={{
            position: 'absolute', top: '10px', right: '10px',
            width: '32px', height: '32px', borderRadius: '50%',
            background: 'rgba(255,255,255,0.92)', border: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', boxShadow: '0 1px 6px rgba(0,0,0,0.12)',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24"
            fill={wished ? PINK : 'none'}
            stroke={wished ? PINK : '#b9a9a9'}
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
      </div>

      {/* ── Info ── */}
      <div style={{ padding: '12px 14px 14px', display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
        {category && (
          <span style={{ fontSize: '0.68rem', fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
            {category}
          </span>
        )}

        <h3
          style={{
            margin: 0, fontWeight: 700, fontSize: '0.9rem', color: DARK, lineHeight: 1.3,
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
            minHeight: '2.34em',
          }}
        >
          {name}
        </h3>

        {/* Age / size chips */}
        {hasVariants && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
            {visibleVariants.map((v) => {
              const ok = Number(v.stock) > 0;
              const active = String(v._id) === variantId;
              return (
                <button
                  key={v._id}
                  disabled={!ok}
                  onClick={stop(() => setVariantId(String(v._id)))}
                  style={{
                    fontFamily: FONT, fontSize: '0.68rem', fontWeight: 600,
                    padding: '3px 8px', borderRadius: '999px',
                    border: `1px solid ${active ? PINK : '#e8ddd5'}`,
                    background: active ? '#fde8ee' : '#fff',
                    color: ok ? (active ? PINK_DARK : '#6b6b6b') : '#c9bfba',
                    textDecoration: ok ? 'none' : 'line-through',
                    cursor: ok ? 'pointer' : 'not-allowed',
                  }}
                >
                  {v.age}
                </button>
              );
            })}
            {extra > 0 && (
              <span style={{ fontSize: '0.68rem', color: MUTED, alignSelf: 'center' }}>+{extra} more</span>
            )}
          </div>
        )}

        {/* Price + cart */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '4px' }}>
          <span style={{ fontWeight: 800, fontSize: '1.02rem', color: DARK }}>
            ₹{Number(price || 0).toLocaleString('en-IN')}
          </span>

          {!hideCart && (
            <button
              disabled={soldOut}
              onClick={stop(() => addItem(product, selected, 1))}
              aria-label="Add to cart"
              title={soldOut ? 'Sold out' : 'Add to cart'}
              style={{
                width: '36px', height: '36px', borderRadius: '50%', border: 'none',
                background: soldOut ? '#f2d9df' : PINK,
                color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: soldOut ? 'not-allowed' : 'pointer',
                boxShadow: soldOut ? 'none' : '0 3px 10px rgba(244,167,185,0.5)',
                transition: 'transform .15s, background .15s',
              }}
              onMouseEnter={(e) => { if (!soldOut) e.currentTarget.style.background = PINK_DARK; }}
              onMouseLeave={(e) => { if (!soldOut) e.currentTarget.style.background = PINK; }}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

export function BestsellerGrid({ products }) {  return (
    <section style={{ padding: '2rem 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.2rem' }}>
        <h2 style={{
          fontFamily: '"Nunito", sans-serif', fontWeight: 800,
          fontSize: '1.25rem', color: '#2d2d2d', margin: 0,
        }}>Shop Our Bestsellers</h2>
        <a href="#" style={{
          fontFamily: '"Nunito", sans-serif', fontWeight: 600,
          fontSize: '0.85rem', color: '#f4a7b9', textDecoration: 'none',
          display: 'flex', alignItems: 'center', gap: '3px',
        }}>
          View All
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
            stroke="#f4a7b9" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </a>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '14px' }}>
{products.map((p) => (
  <ProductCard key={p._id} product={p} />
))}      </div>
    </section>
  );
}