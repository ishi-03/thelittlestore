import React from 'react';

/**
 * TopBar
 * ──────
 * Thin announcement strip. Pure presentational — no props / state.
 * All styling via Tailwind utility classes.
 */
export default function TopBar() {
  return (
    <div className="flex items-center justify-center gap-2 bg-pink-light border-b border-pink-medium px-4 py-2">
      {/* Truck icon */}
      <svg
        className="w-4 h-4 text-pink-dark shrink-0"
        fill="none" stroke="currentColor" strokeWidth="2"
        viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"
      >
        <rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
        <circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
      </svg>

      <p className="text-xs text-[#6b6b6b] tracking-wide">
        Free Shipping on orders above{' '}
        <strong className="font-semibold text-pink-dark">₹xxx</strong>
      </p>
    </div>
  );
}