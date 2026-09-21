import { useState,useEffect } from "react";

const COLORS = [
  { name: "Pink", image: "/pink.png" },
  { name: "Blue", image: "/blue.png" },
  { name: "Green", image: "/green.png" },
  { name: "Yellow", image: "/yellow.png" },
];




const HERO_SLIDES = [
  {
    title: "Dreamy Gift",
    titlePink: "Sets for Babies",
    desc: "Curated bundles of our softest babywear — the perfect gift for new parents.",
    btn: "Explore Gifts",
    bg: "#f5efe6",
    emoji: "🎁",
  },
  {
    title: "New Arrivals",
    titlePink: "Just for Tiny Ones",
    desc: "Fresh styles in the softest fabrics — designed for comfort from day one.",
    btn: "Shop New",
    bg: "#fce9ef",
    emoji: "✨",
  },
  {
    title: "Sleep Better",
    titlePink: "Nights Made Cozy",
    desc: "Our bestselling sleep bags keep little ones snug all night long.",
    btn: "Shop Sleep",
    bg: "#e8f0fb",
    emoji: "🌙",
  },
];

const CATEGORY_ICONS = [
  { label: "Full Sleeve", icon: "👕", color: "#d4eaf7" },
  { label: "Half Sleeve", icon: "👗", color: "#fce4ec" },
  { label: "Rompers", icon: "🩱", color: "#e8f4e8" },
  { label: "Sleep Bags", icon: "🛌", color: "#ede7f6" },
  { label: "Gift Sets", icon: "🎁", color: "#f8e8f8" },
  { label: "Sale", icon: "🏷️", color: "#fef9e0" },
];

// ─── Components ──────────────────────────────────────────────────────────────





const iconBtnStyle = {
  background: "none", border: "none", cursor: "pointer",
  fontSize: "18px", position: "relative", padding: "4px",
};

function HeroBanner() {
  const [active, setActive] = useState(1);
  const slide = HERO_SLIDES[active];

  return (
    <div style={{
      background: slide.bg,
      borderRadius: "20px",
      display: "flex",
      overflow: "hidden",
      minHeight: "380px",
      transition: "background 0.4s",
    }}>
      {/* Text side */}
      <div style={{ flex: "1", padding: "52px 48px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <h2 style={{ fontSize: "42px", fontFamily: "'Georgia', serif", color: "#2b2b2b", margin: "0 0 4px 0", fontWeight: "700", lineHeight: 1.1 }}>
          {slide.title}
        </h2>
        <h2 style={{ fontSize: "42px", fontFamily: "'Georgia', serif", color: "#e88fa0", margin: "0 0 20px 0", fontWeight: "700", lineHeight: 1.1 }}>
          {slide.titlePink}
        </h2>
        <p style={{ color: "#666", fontSize: "15px", lineHeight: 1.7, maxWidth: "340px", margin: "0 0 32px 0" }}>
          {slide.desc}
        </p>
        <button style={{
          background: "#e88fa0", color: "#fff", border: "none",
          borderRadius: "50px", padding: "14px 32px",
          fontSize: "14px", fontWeight: "600", cursor: "pointer",
          width: "fit-content", letterSpacing: "0.3px",
          transition: "background 0.2s, transform 0.1s",
        }}
          onMouseOver={e => e.target.style.background = "#d4768a"}
          onMouseOut={e => e.target.style.background = "#e88fa0"}
        >
          {slide.btn}
        </button>

        {/* Dots */}
        <div style={{ display: "flex", gap: "8px", marginTop: "28px" }}>
          {HERO_SLIDES.map((_, i) => (
            <button key={i} onClick={() => setActive(i)} style={{
              width: i === active ? "28px" : "8px",
              height: "8px",
              borderRadius: "4px",
              background: i === active ? "#e88fa0" : "#d0bfc4",
              border: "none", cursor: "pointer", padding: 0,
              transition: "width 0.3s, background 0.3s",
            }} />
          ))}
        </div>
      </div>

      {/* Emoji side (placeholder for image) */}
      <div style={{
        width: "380px", background: "rgba(255,255,255,0.25)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "120px", flexShrink: 0,
      }}>
        {slide.emoji}
      </div>
    </div>
  );
}

function CategoryStrip() {
  const [active, setActive] = useState(null);
  return (
    <div style={{ display: "flex", gap: "16px", justifyContent: "center", margin: "32px 0 8px" }}>
      {CATEGORY_ICONS.map(({ label, icon, color }) => (
        <button key={label} onClick={() => setActive(label === active ? null : label)} style={{
          display: "flex", flexDirection: "column", alignItems: "center", gap: "8px",
          background: "none", border: "none", cursor: "pointer",
        }}>
          <div style={{
            width: "68px", height: "68px", borderRadius: "50%",
            background: color,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "26px",
            boxShadow: active === label ? "0 0 0 3px #e88fa0" : "none",
            transition: "box-shadow 0.2s, transform 0.15s",
            transform: active === label ? "scale(1.08)" : "scale(1)",
          }}>
            {icon}
          </div>
          <span style={{ fontSize: "11px", color: "#777", fontWeight: active === label ? "700" : "400" }}>{label}</span>
        </button>
      ))}
    </div>
  );
}

function FilterSidebar({
  filters,
  setFilters,
  categories,
  ages,
  fabrics,
}) {  const toggle = (key, val) => {
    setFilters(prev => {
      const arr = prev[key];
      return { ...prev, [key]: arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val] };
    });
  };
const clearAll = () => setFilters({
  categories: [],
  ages: [],
  fabrics: [],
  colors: []
});
const totalActive =
  filters.categories.length +
  filters.ages.length +
  filters.fabrics.length +
  filters.colors.length;
  const Section = ({ title, items, filterKey }) => {
    const [open, setOpen] = useState(true);
    return (
      <div style={{ marginBottom: "24px" }}>
        <button onClick={() => setOpen(!open)} style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          width: "100%", background: "none", border: "none", cursor: "pointer",
          padding: "4px 0", marginBottom: open ? "12px" : 0,
        }}>
          <span style={{ fontWeight: "600", fontSize: "14px", color: "#2b2b2b" }}>{title}</span>
          <span style={{ fontSize: "16px", color: "#aaa", transform: open ? "rotate(0)" : "rotate(180deg)", transition: "transform 0.2s" }}>∧</span>
        </button>
        {open && items.map(item => (
          <label key={item} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px", cursor: "pointer" }}>
            <div style={{
              width: "16px", height: "16px", borderRadius: "4px",
              border: filters[filterKey].includes(item) ? "none" : "1.5px solid #ccc",
              background: filters[filterKey].includes(item) ? "#e88fa0" : "#fff",
              flexShrink: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "background 0.2s",
            }}
              onClick={() => toggle(filterKey, item)}
            >
              {filters[filterKey].includes(item) && <span style={{ color: "#fff", fontSize: "11px", lineHeight: 1 }}>✓</span>}
            </div>
            <span style={{ fontSize: "13.5px", color: "#555" }} onClick={() => toggle(filterKey, item)}>{item}</span>
          </label>
        ))}
      </div>
    );
  };

  return (
    <div style={{
      background: "#faf8f6", borderRadius: "16px",
      padding: "24px", width: "220px", flexShrink: 0,
      alignSelf: "flex-start", position: "sticky", top: "80px",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <span style={{ fontWeight: "700", fontSize: "16px", color: "#2b2b2b" }}>Filter</span>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          {totalActive > 0 && (
            <button onClick={clearAll} style={{
              fontSize: "11px", color: "#e88fa0", background: "none", border: "none", cursor: "pointer", textDecoration: "underline",
            }}>Clear</button>
          )}
          <span style={{ fontSize: "18px", color: "#888" }}>⚙</span>
        </div>
      </div>

<Section title="Category" items={categories} filterKey="categories" />
<div style={{ height: "1px", background: "#eee", margin: "4px 0 20px" }} />

<Section title="Age" items={ages} filterKey="ages" />
<div style={{ height: "1px", background: "#eee", margin: "4px 0 20px" }} />

<Section title="Fabric" items={fabrics} filterKey="fabrics" />
<div style={{ height: "1px", background: "#eee", margin: "4px 0 20px" }} />

<div>
  <span
    style={{
      fontWeight: "600",
      fontSize: "14px",
      color: "#2b2b2b",
    }}
  >
    Color
  </span>

  <div
    style={{
      display: "flex",
      gap: "10px",
      marginTop: "12px",
      flexWrap: "wrap",
    }}
  >
  {COLORS.map((color) => {
  const isActive = filters.colors.includes(color.name);

  return (
    <img
      key={color.name}
      src={color.image}
      alt={color.name}
      title={color.name}
      onClick={() => toggle("colors", color.name)}
      style={{
        width: "28px",
        height: "28px",
        borderRadius: "50%",
        cursor: "pointer",
        objectFit: "cover",
        border: isActive
          ? "2px solid #e88fa0"
          : "1px solid #ddd",
        boxShadow: isActive
          ? "0 0 0 2px #fff, 0 0 0 4px #e88fa0"
          : "none",
        transform: isActive ? "scale(1.08)" : "scale(1)",
        transition: "all 0.2s",
      }}
    />
  );
})}
  </div>
</div>
    </div>
  );
}

function ProductCard({ product, onAddToCart }) {
  const [wished, setWished] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    onAddToCart();
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <div style={{
      background: "#fff", borderRadius: "16px",
      overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
      transition: "transform 0.2s, box-shadow 0.2s",
      cursor: "pointer",
    }}
      onMouseOver={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.10)"; }}
      onMouseOut={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.06)"; }}
    >
      {/* Image area */}
      <div style={{
  background: "#f8f3f0",
  height: "180px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  position: "relative",
}}>
        {product.badge && (
          <span style={{
            position: "absolute", top: "12px", left: "12px",
            background: product.badge === "Sale" ? "#e88fa0" : product.badge === "New" ? "#7bc8a4" : "#f5c842",
            color: "#fff", fontSize: "10px", fontWeight: "700",
            padding: "3px 10px", borderRadius: "20px", letterSpacing: "0.5px",
          }}>{product.badge}</span>
        )}
        <button
          onClick={e => { e.stopPropagation(); setWished(!wished); }}
          style={{
            position: "absolute", top: "10px", right: "12px",
            background: "rgba(255,255,255,0.7)", border: "none", borderRadius: "50%",
            width: "30px", height: "30px", fontSize: "14px", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          {wished ? "❤️" : "🤍"}
        </button>
<img
  src={product.image}
  alt={product.name}
  style={{
    width: "100%",
    height: "100%",
    objectFit: "cover",
  }}
/>      </div>

      {/* Details */}
      <div style={{ padding: "14px 16px 16px" }}>
        <div style={{ fontSize: "11px", color: "#aaa", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
{product.ageGroup} · {product.fabric}        </div>
        <div style={{ fontWeight: "600", fontSize: "14px", color: "#2b2b2b", marginBottom: "10px", lineHeight: 1.3 }}>
          {product.name}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "16px", fontWeight: "700", color: "#2b2b2b" }}>₹{product.price}</span>
          <button
            onClick={handleAdd}
            style={{
              background: added ? "#7bc8a4" : "#e88fa0",
              color: "#fff", border: "none", borderRadius: "20px",
              padding: "7px 16px", fontSize: "12px", fontWeight: "600",
              cursor: "pointer", transition: "background 0.3s",
            }}
          >
            {added ? "✓ Added" : "+ Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}

function SortBar({ sort, setSort, count }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
      <span style={{ fontSize: "13.5px", color: "#888" }}><strong style={{ color: "#2b2b2b" }}>{count}</strong> products</span>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <span style={{ fontSize: "13px", color: "#888" }}>Sort by</span>
        <select value={sort} onChange={e => setSort(e.target.value)} style={{
          border: "1.5px solid #eee", borderRadius: "8px", padding: "6px 12px",
          fontSize: "13px", color: "#444", background: "#faf8f6", cursor: "pointer", outline: "none",
        }}>
          <option value="popular">Most Popular</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="newest">Newest First</option>
        </select>
      </div>
    </div>
  );
}

// ─── Main Shop Page ───────────────────────────────────────────────────────────
export default function Shop() {
const [filters, setFilters] = useState({
  categories: [],
  ages: [],
  fabrics: [],
  colors: []
});
  const [sort, setSort] = useState("popular");
  const [cartCount, setCartCount] = useState(0);
const [products, setProducts] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  fetch("http://localhost:5000/api/products")
    .then((res) => res.json())
    .then((data) => {
      setProducts(data);
      setLoading(false);
    })
    .catch((error) => {
      console.error("Error fetching products:", error);
      setLoading(false);
    });
}, []);
 const filtered = products.filter((p) => {
  if (
    filters.categories.length &&
    !filters.categories.includes(p.category)
  ) {
    return false;
  }

  if (
    filters.ages.length &&
    !filters.ages.includes(p.ageGroup)
  ) {
    return false;
  }

  if (
    filters.fabrics.length &&
    !filters.fabrics.includes(p.fabric)
  ) {
    return false;
  }

  if (
    filters.colors.length &&
    !filters.colors.includes(p.color)
  ) {
    return false;
  }

  return true;

}).sort((a, b) => {
  if (sort === "price_asc") return a.price - b.price;

  if (sort === "price_desc") return b.price - a.price;

  if (sort === "newest") {
    return new Date(b.createdAt) - new Date(a.createdAt);
  }

  return 0;
});
const categories = [
  ...new Set(products.map((p) => p.category).filter(Boolean))
];

const ages = [
  ...new Set(products.map((p) => p.ageGroup).filter(Boolean))
];

const fabrics = [
  ...new Set(products.map((p) => p.fabric).filter(Boolean))
];
  return (
    <div style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif", background: "#fdfbf9", minHeight: "100vh" }}>
     

      {/* Main content */}
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "28px 32px" }}>

        {/* Layout: sidebar + right column */}
        <div style={{ display: "flex", gap: "28px", alignItems: "flex-start" }}>

          {/* Filter Sidebar */}
<FilterSidebar
  filters={filters}
  setFilters={setFilters}
  categories={categories}
  ages={ages}
  fabrics={fabrics}
/>
          {/* Right column */}
          <div style={{ flex: 1, minWidth: 0 }}>

            {/* Hero Banner */}
            <HeroBanner />

            {/* Category icon strip */}
            <CategoryStrip />

            {/* Section heading */}
            <div style={{ margin: "32px 0 8px" }}>
              <h3 style={{ fontSize: "20px", fontWeight: "700", color: "#2b2b2b", margin: "0 0 4px 0" }}>
                All Products
              </h3>
              <div style={{ width: "40px", height: "3px", background: "#e88fa0", borderRadius: "2px" }} />
            </div>

            {/* Sort bar */}
            <div style={{ marginTop: "16px" }}>
              <SortBar sort={sort} setSort={setSort} count={filtered.length} />
            </div>

            {/* Product Grid */}
            {filtered.length === 0 ? (
              <div style={{ textAlign: "center", padding: "80px 0", color: "#aaa" }}>
                <div style={{ fontSize: "48px", marginBottom: "12px" }}>🔍</div>
                <p style={{ fontSize: "15px" }}>No products match your filters.</p>
                <button onClick={() => setFilters({ categories: [], ages: [], fabrics: [], colors: [] })} style={{
                  marginTop: "12px", background: "#e88fa0", color: "#fff",
                  border: "none", borderRadius: "20px", padding: "10px 24px",
                  fontSize: "13px", cursor: "pointer",
                }}>Clear Filters</button>
              </div>
            ) : (
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                gap: "20px",
              }}>
                {filtered.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={() => setCartCount(c => c + 1)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
\
    </div>
  );
}