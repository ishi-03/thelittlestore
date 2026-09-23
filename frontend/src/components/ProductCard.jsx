import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';



export default function ProductCard({ product }) {
  const [wished, setWished] = useState(false);
  const { name, price, bg, image } = product;
  const navigate = useNavigate();

  return (
    <article
      onClick={() => navigate(`/product/${product._id}`)}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.07)';
      }}
      style={{
        backgroundColor: '#fff',
        borderRadius: '14px',
        overflow: 'hidden',
        boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform .2s, box-shadow .2s',
        cursor: 'pointer',
      }}
    >
      {/* ── Image area ── */}
      <div style={{
        position: 'relative',
        backgroundColor: bg,
        width: '100%',
        aspectRatio: '1 / 1',
        overflow: 'hidden',
      }}>
        <img
          src={image}
          alt={name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            display: 'block',
          }}
        />

        {/* Heart button */}
        <button
          onClick={e => { e.stopPropagation(); setWished(w => !w); }}
          aria-label="Wishlist"
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.12)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          style={{
            position: 'absolute', top: '10px', right: '10px',
            width: '30px', height: '30px', borderRadius: '50%',
            background: 'rgba(255,255,255,0.9)', border: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', boxShadow: '0 1px 6px rgba(0,0,0,0.1)',
            transition: 'transform .15s',
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24"
            fill={wished ? '#f4a7b9' : 'none'}
            stroke={wished ? '#f4a7b9' : '#c0b0b0'}
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>
      </div>

      {/* ── Info ── */}
      <div style={{ padding: '10px 13px 14px' }}>
        <p style={{
          fontFamily: '"Nunito", sans-serif', fontWeight: 600,
          fontSize: '0.83rem', color: '#2d2d2d', margin: '0 0 4px', lineHeight: 1.3,
        }}>{name}</p>
        <p style={{
          fontFamily: '"Nunito", sans-serif', fontWeight: 700,
          fontSize: '0.88rem', color: '#f4a7b9', margin: 0,
        }}>₹{price}</p>
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