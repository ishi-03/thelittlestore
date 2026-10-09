import React, { useEffect, useState } from "react";
import { getProducts } from "../api/productApi.js";
import ProductCard from "./ProductCard.jsx";

/**
 * PlacementPage — shared layout for the Women Wear and Twinning pages.
 * Fetches only the products tagged with the given placement in admin.
 */
export default function PlacementPage({ placement, eyebrow, title, subtitle, emptyTitle, emptyText }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("newest");

  useEffect(() => {
    setLoading(true);
    getProducts(placement)
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .catch((err) => {
        console.error("Error fetching products:", err);
        setProducts([]);
      })
      .finally(() => setLoading(false));
  }, [placement]);

  const sorted = [...products].sort((a, b) => {
    if (sort === "price_asc") return a.price - b.price;
    if (sort === "price_desc") return b.price - a.price;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  return (
    <div style={{ fontFamily: '"Nunito", sans-serif', background: "#fdfbf9", minHeight: "100vh" }}>
      {/* Header banner */}
      <section
        style={{
          background: "linear-gradient(160deg, #fff4ea 0%, #fde8ee 60%, #f1e9fa 100%)",
          padding: "56px 20px 48px",
          textAlign: "center",
        }}
      >
        <span
          style={{
            display: "inline-block",
            background: "#fff",
            color: "#b8486a",
            fontWeight: 800,
            fontSize: "0.8rem",
            padding: "6px 16px",
            borderRadius: "999px",
            boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
            marginBottom: "16px",
          }}
        >
          {eyebrow}
        </span>
        <h1
          style={{
            fontSize: "clamp(2rem, 4.5vw, 3rem)",
            fontWeight: 800,
            color: "#34252e",
            margin: "0 0 12px",
            lineHeight: 1.1,
          }}
        >
          {title}
        </h1>
        <p style={{ fontSize: "1rem", color: "#6b5a62", maxWidth: "520px", margin: "0 auto", lineHeight: 1.7 }}>
          {subtitle}
        </p>
      </section>

      {/* Products */}
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "32px 20px 64px" }}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
            marginBottom: "20px",
          }}
        >
          <span style={{ fontSize: "13.5px", color: "#8a7f7a" }}>
            <strong style={{ color: "#2d2d2d" }}>{sorted.length}</strong> products
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "13px", color: "#8a7f7a" }}>Sort by</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              style={{
                border: "1px solid #e8ddd5",
                borderRadius: "8px",
                padding: "6px 12px",
                fontSize: "13px",
                color: "#444",
                background: "#fdf6f0",
                fontFamily: '"Nunito", sans-serif',
                outline: "none",
              }}
            >
              <option value="newest">Newest First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse"
                style={{ background: "#f2eae4", aspectRatio: "3/4", borderRadius: "16px" }}
              />
            ))}
          </div>
        ) : sorted.length === 0 ? (
          <div
            style={{
              padding: "64px 20px",
              textAlign: "center",
              borderRadius: "28px",
              backgroundColor: "#fdf6f0",
              color: "#8a7f7a",
            }}
          >
            <p style={{ fontSize: "1.3rem", fontWeight: 700, color: "#34252e", margin: "0 0 8px" }}>
              {emptyTitle}
            </p>
            <p style={{ fontSize: "0.92rem", margin: 0 }}>{emptyText}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {sorted.map((product) => (
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
