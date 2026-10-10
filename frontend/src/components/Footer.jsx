import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SizeGuideModal from './SizeGuide.jsx';
import { subscribeNewsletter } from '../api/newsletterApi.js';

/**
 * Footer — "The Little Store"
 * ───────────────────────────
 * Newsletter card → brand + link columns → trust strip → bottom bar.
 * Styling is self-contained (scoped .ft-* classes), same approach as GiftSets.
 */

const WHATSAPP_NUMBER = '919892734880';

const SHOP_LINKS = [
  { label: 'Shop All',    to: '/shop' },
  { label: 'Women Wear',  to: '/women-wear' },
  { label: 'Twinning',    to: '/twinning' },
  { label: 'Gift Sets',   to: '/gift-sets' },
];

const HELP_LINKS = [
  { label: 'Size Guide',  action: 'size-guide' },
  { label: 'Track Order', to: '/track-order' },
  { label: 'Contact Us',  to: '/contact' },
  { label: 'About Us',    to: '/about' },
];

const POLICY_LINKS = [
  { label: 'Privacy Policy',      to: '/privacy-policy' },
  { label: 'Terms & Conditions',  to: '/terms-and-conditions' },
  { label: 'Refund & Returns',    to: '/refund-policy' },
  { label: 'Shipping Policy',     to: '/shipping-policy' },
];

const SOCIALS = [{ label: 'Instagram', href: 'https://www.instagram.com/thelittlestore_kids' }];

const TRUST = [
  '100% soft cotton',
  'Ribboned & gift-boxed',
  'Delivered across India',
  'Secure payments',
];

export default function Footer() {
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [newsStatus, setNewsStatus] = useState({ type: '', text: '' });
  const [joining, setJoining] = useState(false);

  const handleJoin = async (e) => {
    e.preventDefault();
    if (joining) return;
    setJoining(true);
    setNewsStatus({ type: '', text: '' });
    try {
      const data = await subscribeNewsletter(email);
      setNewsStatus({ type: 'ok', text: data.message });
      setEmail('');
    } catch (err) {
      setNewsStatus({
        type: 'err',
        text: err?.response?.data?.message || 'Something went wrong. Please try again.',
      });
    } finally {
      setJoining(false);
    }
  };

  return (
    <footer className="ft-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,600;1,9..144,600&display=swap');

        .ft-root { position: relative; margin-top: 64px; font-family: "Nunito", sans-serif; color: #3a2b34;
          background: linear-gradient(180deg, #fff9f4 0%, #fdeef1 100%); border-top: 1px solid #f3dde2; }
        .ft-serif { font-family: "Fraunces", Georgia, serif; font-weight: 600; letter-spacing: -0.015em; }
        .ft-wrap { max-width: 1200px; margin: 0 auto; padding: 0 24px; }

        /* newsletter card — overlaps the top edge */
        .ft-news { position: relative; overflow: hidden; margin-top: -48px; border-radius: 28px; padding: 40px 44px;
          display: flex; align-items: center; justify-content: space-between; gap: 28px;
          background: linear-gradient(135deg, #dc7a95 0%, #c36f9c 60%, #a77fc4 120%);
          box-shadow: 0 24px 48px rgba(180, 90, 120, 0.25); }
        .ft-news::before { content: ""; position: absolute; width: 320px; height: 320px; border-radius: 50%; top: -150px; right: -80px;
          background: radial-gradient(circle, rgba(255,255,255,0.28), rgba(255,255,255,0) 70%); pointer-events: none; }
        .ft-news::after { content: ""; position: absolute; width: 240px; height: 240px; border-radius: 50%; bottom: -130px; left: 10%;
          background: radial-gradient(circle, rgba(245,216,122,0.30), rgba(245,216,122,0) 70%); pointer-events: none; }
        .ft-news-text, .ft-news-right { position: relative; z-index: 1; }
        .ft-news-right { width: 100%; max-width: 400px; }
        .ft-news-msg { margin: 10px 0 0 14px; font-size: 0.82rem; font-weight: 700; color: #fff; }
        .ft-news-msg.ft-err { color: #fff3c4; }
        .ft-join:disabled { opacity: 0.7; cursor: default; }
        .ft-news-title { font-size: clamp(1.4rem, 2.6vw, 1.9rem); color: #fff; margin: 0 0 6px; }
        .ft-news-sub { font-size: 0.92rem; color: #fff3f6; margin: 0; line-height: 1.6; }
        .ft-news-form { display: flex; gap: 8px; width: 100%; padding: 6px; border-radius: 999px;
          background: rgba(255,255,255,0.95); box-shadow: 0 8px 20px rgba(58,43,52,0.15); }
        .ft-input { flex: 1; min-width: 0; border: none; outline: none; background: transparent; padding: 0 14px;
          font-family: "Nunito", sans-serif; font-size: 0.88rem; color: #3a2b34; }
        .ft-input::placeholder { color: #a99ba2; }
        .ft-join { border: none; cursor: pointer; border-radius: 999px; padding: 11px 24px; font-family: "Nunito", sans-serif;
          font-weight: 800; font-size: 0.85rem; color: #fff; background: #c9627e; transition: background .2s, transform .2s; }
        .ft-join:hover { background: #b8486a; transform: translateY(-1px); }

        /* main grid */
        .ft-grid { display: grid; grid-template-columns: 1.6fr 1fr 1fr 1fr; gap: 48px; padding: 64px 0 48px; }
        .ft-brand { font-size: 1.9rem; color: #34252e; margin: 0 0 12px; font-style: italic; }
        .ft-brand span { color: #e58aa3; font-style: normal; }
        .ft-tag { font-size: 0.9rem; line-height: 1.8; color: #6f6168; max-width: 320px; margin: 0 0 22px; }
        .ft-chips { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 18px; }
        .ft-chip { text-decoration: none; font-size: 0.78rem; font-weight: 700; color: #b8486a; background: #fff;
          border: 1px solid #f3dde2; border-radius: 999px; padding: 7px 16px; transition: all .2s; }
        .ft-chip:hover { background: #c9627e; border-color: #c9627e; color: #fff; transform: translateY(-2px); }
        .ft-wa { display: inline-flex; align-items: center; gap: 8px; text-decoration: none; font-weight: 700; font-size: 0.85rem; color: #5b4852; }
        .ft-wa i { width: 8px; height: 8px; border-radius: 50%; background: #3fa66b; display: inline-block; }
        .ft-wa:hover { color: #c9627e; }

        .ft-h { font-size: 0.78rem; font-weight: 800; letter-spacing: 0.14em; text-transform: uppercase; color: #c9627e; margin: 0 0 18px; }
        .ft-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 12px; }
        .ft-link { background: none; border: none; padding: 0; cursor: pointer; text-align: left; text-decoration: none;
          font-family: "Nunito", sans-serif; font-size: 0.92rem; font-weight: 600; color: #6f6168;
          display: inline-block; transition: color .2s, transform .2s; }
        .ft-link:hover { color: #c9627e; transform: translateX(4px); }

        /* trust strip */
        .ft-trust { display: flex; flex-wrap: wrap; justify-content: center; gap: 12px 40px; padding: 22px 0;
          border-top: 1px solid #f3dde2; border-bottom: 1px solid #f3dde2; }
        .ft-trust-item { display: flex; align-items: center; gap: 10px; font-size: 0.85rem; font-weight: 700; color: #5b4852; }
        .ft-trust-item i { width: 7px; height: 7px; border-radius: 50%; background: #f5d87a; display: inline-block; }

        /* bottom bar */
        .ft-bottom { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 8px;
          padding: 20px 0 26px; font-size: 0.78rem; color: #9a8c93; }
        .ft-bottom b { color: #e58aa3; font-weight: 700; }

        @media (max-width: 860px) {
          .ft-news { flex-direction: column; align-items: flex-start; padding: 32px 24px; margin-top: -36px; }
          .ft-news-right { max-width: none; }
          .ft-grid { grid-template-columns: 1fr 1fr; gap: 40px 28px; padding: 48px 0 36px; }
          .ft-brandcol { grid-column: 1 / -1; }
          .ft-bottom { justify-content: center; text-align: center; }
        }
        @media (max-width: 480px) {
          .ft-trust { flex-direction: column; align-items: flex-start; }
        }
      `}</style>

      <div className="ft-wrap">
        {/* ── Newsletter card ───────────────────── */}
        <div className="ft-news">
          <div className="ft-news-text">
            <p className="ft-serif ft-news-title">Join the little circle</p>
            <p className="ft-news-sub">New arrivals &amp; baby sleep tips, straight to your inbox.</p>
          </div>
          <div className="ft-news-right">
            <form className="ft-news-form" onSubmit={handleJoin}>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                aria-label="Email address"
                className="ft-input"
              />
              <button type="submit" className="ft-join" disabled={joining}>
                {joining ? '…' : 'Join'}
              </button>
            </form>
            {newsStatus.text && (
              <p className={`ft-news-msg ${newsStatus.type === 'err' ? 'ft-err' : ''}`}>{newsStatus.text}</p>
            )}
          </div>
        </div>

        {/* ── Main grid ─────────────────────────── */}
        <div className="ft-grid">
          <div className="ft-brandcol">
            <p className="ft-serif ft-brand">the little store <span>♡</span></p>
            <p className="ft-tag">Cozy nights for little ones, since 2020. Soft, skin-friendly cotton made for tiny dreamers.</p>
            <div className="ft-chips">
              {SOCIALS.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="ft-chip">{s.label}</a>
              ))}
            </div>
            <a
              className="ft-wa"
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <i /> Chat with us on WhatsApp
            </a>
          </div>

          <div>
            <h4 className="ft-h">Shop</h4>
            <ul className="ft-list">
              {SHOP_LINKS.map(({ label, to }) => (
                <li key={label}>
                  <Link to={to} className="ft-link">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="ft-h">Help</h4>
            <ul className="ft-list">
              {HELP_LINKS.map(({ label, to, action }) => (
                <li key={label}>
                  {action === 'size-guide' ? (
                    <button type="button" className="ft-link" onClick={() => setSizeGuideOpen(true)}>
                      {label}
                    </button>
                  ) : (
                    <Link to={to} className="ft-link">{label}</Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="ft-h">Policies</h4>
            <ul className="ft-list">
              {POLICY_LINKS.map(({ label, to }) => (
                <li key={label}>
                  <Link to={to} className="ft-link">{label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Trust strip ───────────────────────── */}
        <div className="ft-trust">
          {TRUST.map((t) => (
            <span key={t} className="ft-trust-item"><i />{t}</span>
          ))}
        </div>

        {/* ── Bottom bar ────────────────────────── */}
        <div className="ft-bottom">
          <span>© {new Date().getFullYear()} The Little Store. All rights reserved.</span>
<p>
  Made with ♡ by{" "}
  <a
    href="https://www.blainfotech.com/"
    target="_blank"
    rel="noopener noreferrer"
    className="font-bold hover:underline"
  >
    BLA Infotech
  </a>
</p>        </div>
      </div>

      <SizeGuideModal open={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} />
    </footer>
  );
}
