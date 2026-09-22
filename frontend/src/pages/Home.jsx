import React, { useEffect, useState } from 'react';
import FilterSidebar from '../components/home/FilterSidebar.jsx';
import HeroBanner from '../components/home/HeroBanner.jsx';
import AgeCategory from '../components/home/AgeCategory.jsx';
import { BestsellerGrid } from '../components/ProductCard.jsx';
import { getProducts } from '../api/productApi.js';

export default function Home() {
  const [products, setProducts] = useState([]);

  const [filters, setFilters] = useState({
    categories: [],
    ages: [],
    colors: [],
  });

  useEffect(() => {
    getProducts()
      .then((data) => setProducts(data))
      .catch((err) => console.log(err));
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
  const filteredProducts = products.filter((product) => {
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
        <AgeCategory />
        <BestsellerGrid products={filteredProducts} />
      </main>

    </div>
  );
}