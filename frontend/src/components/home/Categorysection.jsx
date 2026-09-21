import React from "react";
import ProductCard from "../ProductCard";

/**
 * CategorySection
 * ───────────────
 * Generic section: heading + responsive grid + "View All" link.
 *
 * Props:
 *   title    string       Section heading
 *   products Product[]    Array passed from Home
 *   viewAll  string       href for "View All" link
 *
 * 100% Tailwind — no CSS file.
 */
export default function CategorySection({
  title,
  products,
  viewAll,
}) {
  return (
    <section className="mt-10">

      {/* Section header */}
      <div className="flex items-baseline justify-between mb-5">
        <h2 className="font-display text-[1.2rem] font-bold text-[#2d2d2d] tracking-tight">
          {title}
        </h2>

        {viewAll && (
          <a
            href={viewAll}
            className="text-[0.78rem] font-semibold text-pink-dark hover:opacity-70 transition-opacity"
          >
            View All ›
          </a>
        )}
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {products?.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
          />
        ))}
      </div>

    </section>
  );
}