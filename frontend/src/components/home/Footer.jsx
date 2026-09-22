import React from 'react';

/**
 * Footer
 * ──────
 * 3-col grid: Brand | Shop links | Help links | Newsletter
 * Pure presentational. No CSS file — 100% Tailwind.
 */

const SHOP_LINKS = ['Nightsuits', 'Rompers', 'Sleep Bags', 'Gift Sets', 'New Arrivals'];
const HELP_LINKS = ['Size Guide', 'FAQs', 'Returns', 'Track Order', 'Contact Us'];

export default function Footer() {
  return (
    <footer className="bg-blush border-t border-pink-medium mt-16">

      {/* ── Main grid ───────────────────────── */}
      <div className="max-w-6xl mx-auto px-6 md:px-8 pt-14 pb-10
                      grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

        {/* Brand col */}
        <div>
          <span className="font-display text-lg font-bold text-[#2d2d2d] block mb-2">
            the little store ♡
          </span>
          <p className="text-xs text-[#6b6b6b] leading-relaxed mb-4">
            Cozy nights for little ones, since 2020.
          </p>
          <div className="flex gap-3 flex-wrap">
            {['Instagram', 'Pinterest', 'Facebook'].map(s => (
              <a key={s} href="#" className="text-[0.72rem] font-semibold text-pink-dark hover:opacity-70 transition-opacity">
                {s}
              </a>
            ))}
          </div>
        </div>

        {/* Shop col */}
        <div>
          <h4 className="font-display text-sm font-semibold text-[#2d2d2d] mb-3 tracking-wide">
            Shop
          </h4>
          <ul className="flex flex-col gap-2">
            {SHOP_LINKS.map(l => (
              <li key={l}>
                <a href="#" className="text-xs text-[#6b6b6b] hover:text-pink-dark transition-colors">
                  {l}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Help col */}
        <div>
          <h4 className="font-display text-sm font-semibold text-[#2d2d2d] mb-3 tracking-wide">
            Help
          </h4>
          <ul className="flex flex-col gap-2">
            {HELP_LINKS.map(l => (
              <li key={l}>
                <a href="#" className="text-xs text-[#6b6b6b] hover:text-pink-dark transition-colors">
                  {l}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter col */}
        <div>
          <h4 className="font-display text-sm font-semibold text-[#2d2d2d] mb-3 tracking-wide">
            Stay in the loop
          </h4>
          <p className="text-xs text-[#6b6b6b] leading-relaxed mb-4">
            Get new arrivals &amp; baby sleep tips in your inbox.
          </p>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 px-3 py-2 text-xs border border-pink-medium rounded-lg
                         bg-white text-[#2d2d2d] outline-none
                         focus:border-pink transition-colors placeholder:text-[#a0a0a0]"
            />
            <button className="px-4 py-2 bg-pink text-white text-xs font-semibold rounded-lg
                               hover:bg-pink-hover transition-colors shrink-0">
              Join
            </button>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ──────────────────────── */}
      <div className="border-t border-pink-medium">
        <div className="max-w-6xl mx-auto px-6 md:px-8 py-4 flex flex-col sm:flex-row
                        justify-between items-center gap-2 text-[0.68rem] text-[#a0a0a0]">
          <span>© {new Date().getFullYear()} The Little Store. All rights reserved.</span>
          <span className="text-pink">Made with ♡ for tiny dreamers</span>
        </div>
      </div>
    </footer>
  );
}