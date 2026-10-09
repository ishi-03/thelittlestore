import React from "react";
import { Link } from "react-router-dom";

const PINK = "#f4a7b9";
const DARK = "#2d2d2d";
const MUTED = "#8a7f7a";

export default function NotFound() {
  return (
    <div style={{ background: "#fdfbf9", fontFamily: '"Nunito", sans-serif', minHeight: "60vh" }}>
      <div style={{ maxWidth: "480px", margin: "0 auto", padding: "80px 20px", textAlign: "center" }}>
        <div style={{ fontSize: "64px", fontWeight: 800, color: PINK, lineHeight: 1 }}>404</div>
        <h1 style={{ fontSize: "22px", fontWeight: 800, color: DARK, margin: "14px 0 6px" }}>Page not found</h1>
        <p style={{ fontSize: "14px", color: MUTED, margin: "0 0 22px" }}>
          The page you are looking for doesn't exist or may have been moved.
        </p>
        <Link
          to="/"
          style={{
            display: "inline-block",
            padding: "11px 24px",
            background: PINK,
            color: "#fff",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: 700,
            textDecoration: "none",
          }}
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}