import React from "react";

const CATS = [
  {
    id: 1,
    label: "0-6 Months",
    bg: "#cce8f4",
    stroke: "#7bb8d4",
    icon: <OnesieIcon />,
  },
  {
    id: 2,
    label: "6-12 Months",
    bg: "#fde8ee",
    stroke: "#e89ab0",
    icon: <OnesieIcon />,
  },
  {
    id: 3,
    label: "12-18 Months",
    bg: "#f5ede0",
    stroke: "#c8a882",
    icon: <OnesieIcon />,
  },
  {
    id: 4,
    label: "18-24 Months",
    bg: "#d4edda",
    stroke: "#7bbf8a",
    icon: <OnesieIcon />,
  },
  {
    id: 5,
    label: "Gift Sets",
    bg: "#e8e0f5",
    stroke: "#9b82c8",
    icon: <GiftIcon />,
  },
  {
    id: 6,
    label: "New Arrivals",
    bg: "#f5f0d4",
    stroke: "#b8a660",
    icon: <TagIcon />,
  },
];

export default function AgeCategory({
  activeAges = [],
  activeNewest = false,
  onSelect,
}) {
  const isActive = (label) => {
    if (label === "New Arrivals") return activeNewest;
    if (label === "Gift Sets") return false; // navigates away, never "active"
    return activeAges.includes(label);
  };

  const handleCategoryClick = (label) => {
    onSelect?.(label);
  };

  return (
    <section className="my-8 px-6 md:px-12">
      <div
        className="flex gap-8 overflow-x-auto pb-1"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {CATS.map((cat) => {
          const active = isActive(cat.label);

          return (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat.label)}
              className="
                flex flex-col items-center gap-2.5 shrink-0
                hover:-translate-y-1
                transition-transform duration-200
              "
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              {/* Pastel circle */}
              <span
                className="w-[72px] h-[72px] rounded-full flex items-center justify-center transition-all duration-200"
                style={{
                  backgroundColor: cat.bg,
                  boxShadow: active
                    ? `0 0 0 2.5px ${cat.stroke}`
                    : "none",
                }}
              >
                {React.cloneElement(cat.icon, {
                  stroke: cat.stroke,
                })}
              </span>

              {/* Label */}
              <span
                style={{
                  fontFamily: '"Nunito", sans-serif',
                  fontSize: "0.72rem",
                  fontWeight: active ? 700 : 500,
                  color: active ? "#2d2d2d" : "#6b6b6b",
                  whiteSpace: "nowrap",
                }}
              >
                {cat.label}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

/* ───────────── Onesie ───────────── */

function OnesieIcon({ stroke = "#7bb8d4" }) {
  return (
    <svg
      width="34"
      height="34"
      viewBox="0 0 48 48"
      fill="none"
      stroke={stroke}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 6 C17 6 14 9 10 10 L6 22 L14 24 L14 40 L34 40 L34 24 L42 22 L38 10 C34 9 31 6 31 6" />
      <path d="M17 6 C18.5 10 29.5 10 31 6" />
      <circle cx="21" cy="40" r="1" fill={stroke} stroke="none" />
      <circle cx="24" cy="40" r="1" fill={stroke} stroke="none" />
      <circle cx="27" cy="40" r="1" fill={stroke} stroke="none" />
    </svg>
  );
}

/* ───────────── Gift ───────────── */

function GiftIcon({ stroke = "#9b82c8" }) {
  return (
    <svg
      width="34"
      height="34"
      viewBox="0 0 48 48"
      fill="none"
      stroke={stroke}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="8" y="22" width="32" height="20" rx="2" />
      <rect x="6" y="14" width="36" height="8" rx="2" />
      <line x1="24" y1="14" x2="24" y2="42" />
      <path d="M24 14 C24 14 18 6 13 9 C10 11 13 14 24 14" />
      <path d="M24 14 C24 14 30 6 35 9 C38 11 35 14 24 14" />
    </svg>
  );
}

/* ───────────── Tag ───────────── */

function TagIcon({ stroke = "#b8a660" }) {
  return (
    <svg
      width="34"
      height="34"
      viewBox="0 0 48 48"
      fill="none"
      stroke={stroke}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M26 6 L42 6 L42 22 L24 40 C22.5 41.5 20 41.5 18.5 40 L8 29.5 C6.5 28 6.5 25.5 8 24 Z" />
      <circle cx="35" cy="13" r="2.5" />
    </svg>
  );
}