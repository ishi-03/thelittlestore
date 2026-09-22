import React, { useEffect, useState } from "react";
import { getProducts } from "../api/productApi.js";
import FilterSidebar from "../components/home/FilterSidebar.jsx";
import HeroBanner from "../components/home/HeroBanner.jsx";
import AgeCategory from "../components/home/AgeCategory.jsx";
import ProductCard from "../components/ProductCard.jsx";

function SortBar({ sort, setSort, count, onOpenFilters }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
      <div className="flex items-center justify-between sm:justify-start gap-3">
        <span style={{ fontFamily: '"Nunito", sans-serif', fontSize: "13.5px", color: "#8a7f7a" }}>
          <strong style={{ color: "#2d2d2d" }}>{count}</strong> products
        </span>
        <button
          onClick={onOpenFilters}
          className="md:hidden flex items-center gap-1.5 border rounded-full px-3.5 py-1.5"
          style={{
            borderColor: "#e8ddd5",
            color: "#2d2d2d",
            fontFamily: '"Nunito", sans-serif',
            fontSize: "12.5px",
            fontWeight: 600,
            background: "#fdf6f0",
          }}
        >
          Filters
        </button>
      </div>
      <div className="flex items-center gap-2.5">
        <span style={{ fontFamily: '"Nunito", sans-serif', fontSize: "13px", color: "#8a7f7a" }}>
          Sort by
        </span>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border rounded-lg px-3 py-1.5 text-[13px] outline-none"
          style={{
            borderColor: "#e8ddd5",
            color: "#444",
            background: "#fdf6f0",
            fontFamily: '"Nunito", sans-serif',
          }}
        >
          <option value="popular">Most Popular</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="newest">Newest First</option>
        </select>
      </div>
    </div>
  );
}

export default function Shop() {
  const [filters, setFilters] = useState({
    categories: [],
    ages: [],
    colors: [],
  });
  const [sort, setSort] = useState("popular");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    getProducts()
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setLoading(false);
      });
  }, []);

  // Dynamic filter options from live product data
  const categories = [
    ...new Set(products.map((p) => p.category).filter(Boolean)),
  ];

  const ages = [
    ...new Set(
      products.flatMap((product) => product.variants?.map((v) => v.age) || [])
    ),
  ];

  const colors = [
    ...new Set(products.map((p) => p.color).filter(Boolean)),
  ];

  const filtered = products
    .filter((p) => {
      const categoryMatch =
        filters.categories.length === 0 ||
        filters.categories.includes(p.category);

      const ageMatch =
        filters.ages.length === 0 ||
        p.variants?.some((v) => filters.ages.includes(v.age));

      const colorMatch =
        filters.colors.length === 0 || filters.colors.includes(p.color);

      return categoryMatch && ageMatch && colorMatch;
    })
    .sort((a, b) => {
      if (sort === "price_asc") return a.price - b.price;
      if (sort === "price_desc") return b.price - a.price;
      if (sort === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
      return 0;
    });

  return (
    <div style={{ fontFamily: '"Nunito", sans-serif', background: "#fdfbf9", minHeight: "100vh" }}>
      <div className="flex items-start gap-5 max-w-[1280px] mx-auto px-5 md:px-8 py-7">
        {/* Desktop sidebar */}
        <div className="hidden md:block">
          <FilterSidebar
            filters={filters}
            setFilters={setFilters}
            categories={categories}
            ages={ages}
            colors={colors}
          />
        </div>

        {/* Mobile filter drawer */}
        {mobileFiltersOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            <div
              className="absolute inset-0"
              style={{ background: "rgba(0,0,0,0.35)" }}
              onClick={() => setMobileFiltersOpen(false)}
            />
            <div
              className="relative w-[80%] max-w-[300px] h-full overflow-y-auto"
              style={{ background: "#fdf6f0" }}
            >
              <div className="flex items-center justify-between px-5 pt-5">
                <span
                  style={{
                    fontFamily: '"Nunito", sans-serif',
                    fontWeight: 700,
                    color: "#2d2d2d",
                  }}
                >
                  Filters
                </span>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  style={{
                    fontSize: "20px",
                    color: "#8a7f7a",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  ✕
                </button>
              </div>
              <FilterSidebar
                filters={filters}
                setFilters={setFilters}
                categories={categories}
                ages={ages}
                colors={colors}
              />
            </div>
          </div>
        )}

        {/* Right column */}
        <div className="flex-1 min-w-0">
          <HeroBanner />
          <AgeCategory />

          <div className="mt-8 mb-2">
            <h3
              style={{
                fontSize: "20px",
                fontWeight: 700,
                color: "#2d2d2d",
                margin: "0 0 4px 0",
                fontFamily: '"Nunito", sans-serif',
              }}
            >
              All Products
            </h3>
            <div style={{ width: "40px", height: "3px", background: "#f4a7b9", borderRadius: "2px" }} />
          </div>

          <SortBar
            sort={sort}
            setSort={setSort}
            count={filtered.length}
            onOpenFilters={() => setMobileFiltersOpen(true)}
          />

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl animate-pulse"
                  style={{ background: "#f2eae4", aspectRatio: "3/4" }}
                />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16" style={{ color: "#aaa" }}>
              <div style={{ fontSize: "48px", marginBottom: "12px" }}>🔍</div>
              <p style={{ fontSize: "15px", fontFamily: '"Nunito", sans-serif' }}>
                No products match your filters.
              </p>
              <button
                onClick={() => setFilters({ categories: [], ages: [], colors: [] })}
                className="mt-3 rounded-full px-6 py-2.5 text-white"
                style={{
                  background: "#f4a7b9",
                  fontFamily: '"Nunito", sans-serif',
                  fontSize: "13px",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.map((product) => (
                <ProductCard
                  key={product._id}
                  product={{
                    ...product,
                    image: product.images?.[0],
                    bg: "#f8f3f0",
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}