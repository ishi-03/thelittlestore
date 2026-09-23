import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

/**
 * Navbar — "The Little Store"
 * ────────────────────────────
 * Layout: LEFT nav | CENTER logo | RIGHT nav + icons
 *   • Pink announcement bar at top
 *   • Logo: thin weight "the little store" in Cormorant Garamond (elegant serif) — centered
 *   • Left links: Home, About Us, Contact
 *   • Right links: Shop, Collections + icons (search, user, cart)
 *   • Nav links: Nunito, medium weight, active = pink underline
 *   • White bg, very subtle bottom border
 *
 * Add to index.html <head>:
 * <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400&family=Nunito:wght@400;500;600&display=swap" rel="stylesheet">
 */

const LEFT_LINKS = [
  { label: 'Home',     to: '/'        },
  { label: 'About Us', to: '/about'   },
  { label: 'Contact',  to: '/contact' },
];

const RIGHT_LINKS = [
  { label: 'Shop',        to: '/shop'        },
  { label: 'Gift Sets',   to: '/gift-sets'   },
  { label: 'Collections', to: '/collections' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-50"
      style={{ fontFamily: '"Nunito", sans-serif' }}
    >
      {/* ── Announcement bar ─────────────────────────── */}
      <div
        className="flex items-center justify-center gap-2 py-2 text-[12px] text-[#5a5a5a]"
        style={{ backgroundColor: '#fde8ee' }}
      >
        <TruckIcon />
       
      </div>

      {/* ── Main navbar ──────────────────────────────── */}
      <div
        className="grid grid-cols-3 items-center px-8 md:px-12 h-[72px]"
        style={{
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #f0e8e0',
        }}
      >
        {/* ── Left nav links (desktop) ─────────────── */}
        <nav className="hidden md:flex items-center gap-1 justify-start">
          {LEFT_LINKS.map(({ label, to }) => (
            <NavLink
              key={label}
              to={to}
              end={to === '/'}
              className="relative px-4 py-2 transition-all duration-200"
              style={({ isActive }) => ({
                fontFamily: '"Nunito", sans-serif',
                fontWeight: isActive ? 600 : 500,
                fontSize: '0.875rem',
                color: isActive ? '#2d2d2d' : '#6b6b6b',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                textDecoration: 'none',
                display: 'inline-block',
              })}
            >
              {({ isActive }) => (
                <>
                  {label}
                  {isActive && (
                    <span
                      className="absolute left-4 right-4 rounded-full"
                      style={{
                        bottom: '-2px',
                        height: '2px',
                        background: '#f4a7b9',
                        display: 'block',
                      }}
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* ── Mobile: hamburger on the left ────────── */}
        <div className="flex md:hidden items-center justify-start">
          <button
            className="flex flex-col gap-[5px] p-2"
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Toggle menu"
          >
            {[
              menuOpen ? 'translate-y-[7px] rotate-45' : '',
              menuOpen ? 'opacity-0' : '',
              menuOpen ? '-translate-y-[7px] -rotate-45' : '',
            ].map((cls, i) => (
              <span
                key={i}
                className={`block w-5 rounded transition-all duration-200 ${cls}`}
                style={{ height: '1.5px', backgroundColor: '#2d2d2d' }}
              />
            ))}
          </button>
        </div>

        {/* ── Logo — centered ───────────────────────── */}
       {/* ── Logo — centered ───────────────────────── */}
<NavLink
  to="/"
  className="flex items-center justify-center justify-self-center"
  style={{ textDecoration: 'none' }}
>
  <img
    src="/images/logo.png"
    alt="The Little Store"
    className="h-[90px] w-auto object-contain"
  />
</NavLink>
        {/* ── Right: nav links + icons ─────────────── */}
        <div className="flex items-center justify-end gap-1">
          <nav className="hidden md:flex items-center gap-1">
            {RIGHT_LINKS.map(({ label, to }) => (
              <NavLink
                key={label}
                to={to}
                end={to === '/'}
                className="relative px-4 py-2 transition-all duration-200"
                style={({ isActive }) => ({
                  fontFamily: '"Nunito", sans-serif',
                  fontWeight: isActive ? 600 : 500,
                  fontSize: '0.875rem',
                  color: isActive ? '#2d2d2d' : '#6b6b6b',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textDecoration: 'none',
                  display: 'inline-block',
                })}
              >
                {({ isActive }) => (
                  <>
                    {label}
                    {isActive && (
                      <span
                        className="absolute left-4 right-4 rounded-full"
                        style={{
                          bottom: '-2px',
                          height: '2px',
                          background: '#f4a7b9',
                          display: 'block',
                        }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Search */}
          <IconBtn>
            <SearchIcon />
          </IconBtn>
          {/* User */}
          <IconBtn>
            <UserIcon />
          </IconBtn>
          {/* Cart */}
          <div className="relative">
            <IconBtn>
              <CartIcon />
            </IconBtn>
            <span
              className="absolute top-0.5 right-0.5 flex items-center justify-center rounded-full text-white"
              style={{
                width: '15px',
                height: '15px',
                fontSize: '0.5rem',
                fontWeight: 700,
                backgroundColor: '#f4a7b9',
                fontFamily: '"Nunito", sans-serif',
              }}
            >
              0
            </span>
          </div>
        </div>
      </div>

      {/* ── Mobile drawer ────────────────────────────── */}
      {menuOpen && (
        <nav
          className="md:hidden px-6 py-4"
          style={{ backgroundColor: '#fff', borderBottom: '1px solid #f0e8e0' }}
        >
          <ul className="flex flex-col gap-1">
            {[...LEFT_LINKS, ...RIGHT_LINKS].map(({ label, to }) => (
              <li key={label}>
                <NavLink
                  to={to}
                  end={to === '/'}
                  onClick={() => setMenuOpen(false)}
                  className="w-full text-left px-3 py-2 rounded-lg transition-all duration-200 block"
                  style={({ isActive }) => ({
                    fontFamily: '"Nunito", sans-serif',
                    fontWeight: isActive ? 600 : 500,
                    fontSize: '0.875rem',
                    color: isActive ? '#f4a7b9' : '#6b6b6b',
                    backgroundColor: isActive ? '#fde8ee' : 'transparent',
                    textDecoration: 'none',
                  })}
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}

/* ── Reusable icon button ───────────────────────────── */
function IconBtn({ children }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="w-9 h-9 flex items-center justify-center rounded-full transition-all duration-200"
      style={{
        color: hovered ? '#f4a7b9' : '#6b6b6b',
        backgroundColor: hovered ? '#fde8ee' : 'transparent',
      }}
    >
      {children}
    </button>
  );
}

/* ── Icons ──────────────────────────────────────────── */
function TruckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="#f4a7b9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="3" width="15" height="13" rx="1"/>
      <path d="M16 8h4l3 4v4h-7V8z"/>
      <circle cx="5.5" cy="18.5" r="2.5"/>
      <circle cx="18.5" cy="18.5" r="2.5"/>
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor"
      strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/>
      <line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  );
}

function UserIcon() {
  return (
    <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor"
      strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  );
}

function CartIcon() {
  return (
    <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor"
      strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
      <line x1="3" y1="6" x2="21" y2="6"/>
      <path d="M16 10a4 4 0 0 1-8 0"/>
    </svg>
  );
}