import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useIsAdmin, adminLogout } from '../api/adminAuth.js';
import { useCart } from '../context/CartContext.jsx';
import { useFavorites } from '../context/FavoritesContext.jsx';

/**
 * Navbar — "The Little Store"
 * ────────────────────────────
 * Layout: LEFT nav | CENTER logo | RIGHT nav + icons
 *   • Pink announcement bar at top
 *   • Logo: thin weight "the little store" in Cormorant Garamond (elegant serif) — centered
 *   • Left links: Home, About Us, Contact
 *   • Right links: Shop,  + icons (search, user, cart)
 *   • Nav links: Nunito, medium weight, active = pink underline
 *   • White bg, very subtle bottom border
 *
 * Add to index.html <head>:
 * <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400&family=Nunito:wght@400;500;600&display=swap" rel="stylesheet">
 */

const LEFT_LINKS = [
  { label: 'Home',       to: '/'           },
  { label: 'Shop',       to: '/shop'       },
  { label: 'Women Wear', to: '/women-wear' },
  { label: 'Twinning',   to: '/twinning'   },
];

const RIGHT_LINKS = [
  { label: 'Gift Sets',   to: '/gift-sets'   },
  { label: 'About Us',    to: '/about'       },
  { label: 'Contact',     to: '/contact'     },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { totalCount } = useCart();
  const { count: favCount } = useFavorites();
  const isAdmin = useIsAdmin();
  const [userMenu, setUserMenu] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');

  const submitSearch = (e) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    navigate(`/shop?q=${encodeURIComponent(q)}`);
    setSearchOpen(false);
    setMenuOpen(false);
  };

  const logout = () => {
    adminLogout();
    setUserMenu(false);
    setMenuOpen(false);
    navigate('/');
  };

  const menuItem = {
    display: 'block', width: '100%', textAlign: 'left', padding: '9px 14px',
    background: 'none', border: 'none', cursor: 'pointer',
    fontFamily: '"Nunito", sans-serif', fontSize: '0.85rem', fontWeight: 600, color: '#2d2d2d',
  };

  return (
    <header
      className="sticky top-0 z-50"
      style={{ fontFamily: '"Nunito", sans-serif' }}
    >
      {/* ── Main navbar ──────────────────────────────── */}
      <div
        className="grid grid-cols-[1fr_auto_1fr] items-center px-3 sm:px-8 md:px-12 h-[72px]"
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
                whiteSpace: 'nowrap',
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
                whiteSpace: 'nowrap',
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
          <IconBtn label="Search" onClick={() => setSearchOpen((o) => !o)}>
            <SearchIcon />
          </IconBtn>
          {/* User: guests go to admin login, admins get Admin Panel / Logout */}
          <div className="relative">
            <IconBtn
              label={isAdmin ? 'Admin menu' : 'Admin login'}
              onClick={() => (isAdmin ? setUserMenu((o) => !o) : navigate('/admin/login'))}
            >
              <UserIcon />
            </IconBtn>
            {isAdmin && (
              <span
                className="absolute top-1 right-1 rounded-full"
                style={{ width: '8px', height: '8px', backgroundColor: '#3fa66b', border: '1.5px solid #fff' }}
              />
            )}
            {isAdmin && userMenu && (
              <div
                className="absolute right-0 mt-2 rounded-xl overflow-hidden"
                style={{ top: '100%', minWidth: '170px', background: '#fff', border: '1px solid #f0e8e0', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', zIndex: 60 }}
              >
                <button style={menuItem} onClick={() => { setUserMenu(false); navigate('/admin'); }}>
                  Admin Panel
                </button>
                <button style={{ ...menuItem, color: '#d9534f', borderTop: '1px solid #f0e8e0' }} onClick={logout}>
                  Log out
                </button>
              </div>
            )}
          </div>
          {/* Favorites */}
          <div className="relative">
            <IconBtn onClick={() => navigate('/favorites')} label="Favorites">
              <HeartIcon />
            </IconBtn>
            {favCount > 0 && (
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
                {favCount > 99 ? '99+' : favCount}
              </span>
            )}
          </div>
          {/* Cart */}
          <div className="relative">
            <IconBtn onClick={() => navigate('/cart')} label="Cart">
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
              {totalCount > 99 ? '99+' : totalCount}
            </span>
          </div>
        </div>
      </div>

      {/* ── Search bar ───────────────────────────────── */}
      {searchOpen && (
        <form
          onSubmit={submitSearch}
          style={{
            display: 'flex',
            gap: '10px',
            padding: '12px 16px',
            background: '#fff',
            borderBottom: '1px solid #f0e8e0',
          }}
        >
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search nightsuits, colours, categories…"
            aria-label="Search products"
            style={{
              flex: 1,
              minWidth: 0,
              border: '1px solid #e8ddd5',
              borderRadius: '999px',
              padding: '10px 18px',
              fontSize: '14px',
              background: '#fdf6f0',
              outline: 'none',
              fontFamily: '"Nunito", sans-serif',
            }}
          />
          <button
            type="submit"
            style={{
              border: 'none',
              borderRadius: '999px',
              padding: '10px 22px',
              fontWeight: 800,
              fontSize: '13px',
              color: '#fff',
              background: '#c9627e',
              cursor: 'pointer',
              fontFamily: '"Nunito", sans-serif',
            }}
          >
            Search
          </button>
        </form>
      )}

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
            <li>
              {isAdmin ? (
                <>
                  <button
                    onClick={() => { setMenuOpen(false); navigate('/admin'); }}
                    className="w-full text-left px-3 py-2 rounded-lg block"
                    style={{ fontSize: '0.875rem', fontWeight: 600, color: '#f4a7b9' }}
                  >
                    Admin Panel
                  </button>
                  <button
                    onClick={logout}
                    className="w-full text-left px-3 py-2 rounded-lg block"
                    style={{ fontSize: '0.875rem', fontWeight: 600, color: '#d9534f' }}
                  >
                    Log out
                  </button>
                </>
              ) : (
                <button
                  onClick={() => { setMenuOpen(false); navigate('/admin/login'); }}
                  className="w-full text-left px-3 py-2 rounded-lg block"
                  style={{ fontSize: '0.875rem', fontWeight: 500, color: '#6b6b6b' }}
                >
                  Admin Login
                </button>
              )}
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}

/* ── Reusable icon button ───────────────────────────── */
function IconBtn({ children, onClick, label }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      aria-label={label}
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

function HeartIcon() {
  return (
    <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor"
      strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  );
}
