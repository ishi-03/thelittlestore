import React, { useEffect } from "react";

const PINK = "#f4a7b9";
const DARK = "#2d2d2d";
const MUTED = "#8a7f7a";
const BORDER = "#e8ddd5";
const CREAM = "#fdf6f0";

const HEADERS = [
  "Age",
  "Shoulder",
  "Sleeve Length",
  "Half Chest",
  "Top Length",
  "Waist Relax Elastic",
  "Bottom Length",
];

// Nightsuit measurements, in cm
const ROWS = [
  ["6-12M", 24, 27, 30, 37, 40, 44],
  ["1-2 Y", 25, 29, 31.5, 38.5, 43, 50],
  ["2-3Y", 26.5, 32, 33, 41, 46, 56],
  ["3-4Y", 27, 34, 34, 43, 48.5, 59],
  ["4-5Y", 28, 36, 36, 47, 51, 63],
  ["5-6Y", 29, 38, 37, 49, 53.5, 66],
  ["6-7Y", 30, 40, 38, 51, 56, 69],
  ["7-8 years", 31, 42, 39.5, 53, 57, 72],
  ["8-9 years", 32, 44, 41, 55, 58.5, 76],
  ["9-10 years", 33, 46, 42, 58, 60, 80],
  ["10-11 years", 34, 48, 44, 60, 62, 84],
  ["11-12 years", 35, 50, 45, 63, 63.5, 88],
];

/** The measurement table on its own (used inside the product page accordion). */
export function SizeGuideTable() {
  const th = {
    padding: "10px 12px",
    background: CREAM,
    color: DARK,
    fontWeight: 700,
    fontSize: "12.5px",
    textAlign: "center",
    whiteSpace: "nowrap",
    borderBottom: `1px solid ${BORDER}`,
  };
  const td = {
    padding: "9px 12px",
    textAlign: "center",
    fontSize: "13px",
    color: DARK,
    borderBottom: `1px solid ${BORDER}`,
    whiteSpace: "nowrap",
  };

  return (
    <div>
      <p style={{ fontSize: "12.5px", color: MUTED, margin: "0 0 8px" }}>
        Nightsuit measurements · all sizes in cm. Please choose carefully — we do not offer size exchanges.
      </p>
      <div style={{ overflowX: "auto", border: `1px solid ${BORDER}`, borderRadius: "10px" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: '"Nunito", sans-serif' }}>
          <thead>
            <tr>
              {HEADERS.map((h) => (
                <th key={h} style={th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row) => (
              <tr key={row[0]}>
                {row.map((cell, i) => (
                  <td key={i} style={{ ...td, fontWeight: i === 0 ? 700 : 500 }}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/** Popup version (used from the footer). */
export default function SizeGuideModal({ open, onClose }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          borderRadius: "16px",
          width: "100%",
          maxWidth: "820px",
          maxHeight: "90vh",
          overflowY: "auto",
          padding: "22px",
          fontFamily: '"Nunito", sans-serif',
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
          <h2 style={{ fontSize: "20px", fontWeight: 800, color: DARK, margin: 0 }}>
            Size Guide
            <span style={{ display: "block", width: "40px", height: "3px", background: PINK, borderRadius: "2px", marginTop: "6px" }} />
          </h2>
          <button
            onClick={onClose}
            aria-label="Close size guide"
            style={{ background: "none", border: "none", fontSize: "24px", color: MUTED, cursor: "pointer", lineHeight: 1 }}
          >
            ×
          </button>
        </div>
        <SizeGuideTable />
      </div>
    </div>
  );
}
