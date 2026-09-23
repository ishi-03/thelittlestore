import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FilterSidebar from '../components/home/FilterSidebar.jsx';
import HeroBanner from '../components/home/HeroBanner.jsx';
import AgeCategory from '../components/home/AgeCategory.jsx';
import { BestsellerGrid } from '../components/ProductCard.jsx';
import { getProducts } from '../api/productApi.js';

export default function Home() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  const [filters, setFilters] = useState({
    categories: [],
    ages: [],
    colors: [],
  });

  // Quick-filter pill: sort by newest (from the "New Arrivals" icon)
  const [sortNewest, setSortNewest] = useState(false);

  useEffect(() => {
  getProducts()
    .then((data) => {
      console.log("PRODUCT API RESPONSE:", data);
      setProducts(Array.isArray(data) ? data : []);
    })
    .catch((err) => {
      console.log(err);
      setProducts([]);
    });
}, []);
  // Dynamic filter options from MongoDB
  const categories = [
    ...new Set(products.map((p) => p.category).filter(Boolean))
  ];

 const ages = [
  ...new Set(
    products.flatMap(
      (product) =>
        product.variants?.map((variant) => variant.age) || []
    )
  ),
];


  const colors = [
    ...new Set(products.map((p) => p.color).filter(Boolean))
  ];

  // Filter products
  let filteredProducts = products.filter((product) => {
    const categoryMatch =
      filters.categories.length === 0 ||
      filters.categories.includes(product.category);

  const ageMatch =
  filters.ages.length === 0 ||
  product.variants?.some((variant) =>
    filters.ages.includes(variant.age)
  );
  
    const colorMatch =
      filters.colors.length === 0 ||
      filters.colors.includes(product.color);

    return (
      categoryMatch &&
      ageMatch &&
      colorMatch
    );
  });

  // "New Arrivals" pill: sort the same grid by newest instead of navigating away
  if (sortNewest) {
    filteredProducts = [...filteredProducts].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  }

  // Handles clicks from the AgeCategory pills on this page
  const handleQuickFilter = (label) => {
    if (label === "Gift Sets") {
      // Gift Sets gets its own page — navigate there
      navigate("/gift-sets");
      return;
    }

    if (label === "New Arrivals") {
      setSortNewest((prev) => !prev);
      return;
    }

    // Age pills (0-6, 6-12, 12-18, 18-24 Months): filter in place, no navigation
    setFilters((prev) => ({
      ...prev,
      ages: prev.ages.includes(label)
        ? prev.ages.filter((a) => a !== label)
        : [...prev.ages, label],
    }));
  };

  return (
    <div className="flex items-start gap-5 max-w-[1200px] mx-auto px-5 md:px-6 my-6">

      <div className="hidden md:block">
        <FilterSidebar
          filters={filters}
          setFilters={setFilters}
          categories={categories}
          ages={ages}
          colors={colors}
        />
      </div>

      <main className="flex-1 min-w-0">
        <HeroBanner />
        <AgeCategory
          activeAges={filters.ages}
          activeNewest={sortNewest}
          onSelect={handleQuickFilter}
        />
<BestsellerGrid
  products={filteredProducts.map((p) => ({
    ...p,
    image: p.images?.[0],
    bg: "#f8f3f0",
  }))}
/>      </main>

    </div>
  );
}