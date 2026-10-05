import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProducts } from "../api/productApi.js";
import ProductCard from "../components/ProductCard.jsx";
import { useFavorites } from "../context/FavoritesContext.jsx";

const PINK = "#f4a7b9";
const DARK = "#2d2d2d";
const MUTED = "#8a7f7a";

export default function Favorites() {
  const navigate = useNavigate();
  const { ids, pruneFavorites } = useFavorites();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(ids.length > 0);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (ids.length === 0) return undefined;
    let cancelled = false;
    getProducts()
      .then((data) => {
        if (cancelled) return;
        const list = Array.isArray(data) ? data : [];
        setProducts(list);
        pruneFavorites(list.map((p) => p._id));
      })
      .catch(() => {
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // load once; ids changes (un-favoriting) are handled by filtering below
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const favorites = products.filter((p) => ids.includes(String(p._id)));

  return (
    <div style={{ fontFamily: '"Nunito", sans-serif', background: "#fdfbf9", minHeight: "60vh" }}>
      <div className="max-w-[1280px] mx-auto px-5 md:px-8 py-8">
        <h1 style={{ fontSize: "24px", fontWeight: 800, color: DARK, margin: "0 0 4px" }}>Your Favorites</h1>
        <div style={{ width: "40px", height: "3px", background: PINK, borderRadius: "2px", marginBottom: "20px" }} />

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: Math.min(ids.length, 4) || 4 }).map((_, i) => (
              <div key={i} className="rounded-2xl animate-pulse" style={{ background: "#f2eae4", aspectRatio: "3/4" }} />
            ))}
          </div>
        ) : error ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: MUTED, fontSize: "14px" }}>
            Couldn't load your favorites. Please check your connection and refresh.
          </div>
        ) : favorites.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke={PINK} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            <h2 style={{ fontSize: "20px", fontWeight: 800, color: DARK, margin: "18px 0 6px" }}>No favorites yet</h2>
            <p style={{ fontSize: "14px", color: MUTED, margin: "0 0 22px" }}>
              Tap the heart on any product to save it here.
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
              Browse Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {favorites.map((product) => (
              <ProductCard
                key={product._id}
                product={{ ...product, image: product.images?.[0], bg: "#f8f3f0" }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
