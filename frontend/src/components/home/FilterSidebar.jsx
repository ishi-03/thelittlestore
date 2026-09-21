import React, { useState } from "react";



const AGE_OPTIONS = [
  "0-6 Months",
  "6-12 Months",
  "12-18 Months",
  "18-24 Months",
  "2-4 Years",
  "4-6 Years",
];

export default function FilterSidebar({
  filters,
  setFilters,
  categories,
  ages = AGE_OPTIONS,
  colors = [],
}) {

  const resetAll = () => {
    setFilters({
      categories: [],
      ages: [],
      colors: [],
    });

  };

  const handleCheckboxFilter = (type, value) => {
    setFilters((prev) => ({
      ...prev,
      [type]: prev[type].includes(value)
        ? prev[type].filter((item) => item !== value)
        : [...prev[type], value],
    }));
  };


 


  return (
    <aside
      className="w-[252px] min-w-[252px] shrink-0 sticky top-[84px] h-fit px-5 py-5"
      style={{
        fontFamily: '"Nunito", sans-serif',
        backgroundColor: "#fdf6f0",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-4">
        <span className="text-[15px] font-semibold tracking-wide text-[#2d2d2d]">
          Filter
        </span>

        <button
          onClick={resetAll}
          aria-label="Reset filters"
          className="p-1.5 rounded-lg hover:bg-[#fde8ee] transition-colors"
        >
          <TuneIcon />
        </button>
      </div>

      <Divider />

      {/* Category */}
      <Group label="Category">
        {categories?.map((category) => (
          <CheckRow
            key={category}
            label={category}
            checked={filters.categories.includes(category)}
            onChange={() =>
              handleCheckboxFilter("categories", category)
            }
          />
        ))}
      </Group>

      <Divider />

      {/* Age */}
      <Group label="Age">
        {ages?.map((age) => (
          <CheckRow
            key={age}
            label={age}
            checked={filters.ages.includes(age)}
            onChange={() =>
              handleCheckboxFilter("ages", age)
            }
          />
        ))}
      </Group>

      <Divider />

      {/* Color */}
<Group label="Color">
  <select
    value={filters.colors[0] || ""}
    onChange={(e) => {
      const value = e.target.value;

      setFilters((prev) => ({
        ...prev,
        colors: value ? [value] : [],
      }));
    }}
    className="w-full border border-[#e8ddd5] rounded-lg px-3 py-2 text-[12.5px] text-[#7a6f6a] bg-[#fdf6f0] focus:outline-none focus:ring-1 focus:ring-[#f4a7b9]"
    style={{
      fontFamily: '"Nunito", sans-serif',
    }}
  >
    <option value="">Select Color</option>

    {colors?.map((color) => (
      <option key={color} value={color}>
        {color}
      </option>
    ))}
  </select>
</Group>
      <Divider />

    


      {/* Apply */}
      <div className="pt-4">
        <ApplyButton />
      </div>
    </aside>
  );
}

/* ---------------- Divider ---------------- */

function Divider() {
  return (
    <hr
      className="border-0 border-t my-0"
      style={{
        borderColor: "#f0e8e0",
      }}
    />
  );
}

/* ---------------- Group ---------------- */

function Group({ label, children }) {
  const [open, setOpen] = useState(true);

  return (
    <div className="py-4">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex items-center justify-between w-full group"
      >
        <span
          className="text-[13.5px] font-semibold text-[#2d2d2d]"
          style={{
            fontFamily: '"Nunito", sans-serif',
          }}
        >
          {label}
        </span>

        <span
          className={`transition-transform duration-200 text-[#a0a0a0] ${
            open ? "rotate-0" : "rotate-180"
          }`}
        >
          <ChevronIcon />
        </span>
      </button>

      {open && (
        <div className="flex flex-col gap-2.5 mt-3">
          {children}
        </div>
      )}
    </div>
  );
}

/* ---------------- Checkbox ---------------- */

function CheckRow({ label, checked, onChange }) {
  return (
    <label
      className="flex items-center gap-2.5 cursor-pointer group"
      style={{
        fontFamily: '"Nunito", sans-serif',
      }}
    >
      <span
        className={[
          "flex items-center justify-center",
          "w-[15px] h-[15px]",
          "rounded-[3px] shrink-0 border",
          "transition-colors duration-150",
          checked
            ? "bg-[#f4a7b9] border-[#f4a7b9]"
            : "bg-[#fdf6f0] border-[#d8cfc8] group-hover:border-[#f4a7b9]",
        ].join(" ")}
      >
        {checked && (
          <svg
            className="w-2.5 h-2.5 text-white"
            fill="none"
            viewBox="0 0 10 8"
          >
            <path
              d="M1 4l2.5 2.5L9 1"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>

      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />

      <span
        className="text-[12.5px] leading-snug transition-colors duration-150 group-hover:text-[#2d2d2d]"
        style={{
          color: checked ? "#2d2d2d" : "#7a6f6a",
        }}
      >
        {label}
      </span>
    </label>
  );
}

/* ---------------- Apply Button ---------------- */

function ApplyButton() {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      type="button"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="w-full py-3.5 rounded-full text-white font-semibold text-[13.5px] tracking-wide transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
      style={{
        background: hovered ? "#e8889f" : "#f4a7b9",
        boxShadow: "0 6px 20px rgba(244,167,185,0.50)",
        fontFamily: '"Nunito", sans-serif',
      }}
    >
      Apply Filters
    </button>
  );
}

/* ---------------- Icons ---------------- */

function TuneIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#9a8f8a"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <line x1="4" y1="6" x2="20" y2="6" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="18" x2="20" y2="18" />

      <circle
        cx="8"
        cy="6"
        r="2"
        fill="white"
        stroke="#9a8f8a"
      />

      <circle
        cx="16"
        cy="12"
        r="2"
        fill="white"
        stroke="#9a8f8a"
      />

      <circle
        cx="10"
        cy="18"
        r="2"
        fill="white"
        stroke="#9a8f8a"
      />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="18 15 12 9 6 15" />
    </svg>
  );
}