import crypto from "crypto";
import jwt from "jsonwebtoken";

const safeEqual = (a, b) => {
  const x = crypto.createHash("sha256").update(String(a)).digest();
  const y = crypto.createHash("sha256").update(String(b)).digest();
  return crypto.timingSafeEqual(x, y);
};

// POST /api/auth/login   Body: { email, password }
// Single admin account configured through .env (ADMIN_EMAIL, ADMIN_PASSWORD, JWT_SECRET).
export const adminLogin = (req, res) => {
  const { ADMIN_EMAIL, ADMIN_PASSWORD, JWT_SECRET } = process.env;
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD || !JWT_SECRET) {
    return res.status(503).json({ message: "Admin login is not configured on the server." });
  }

  const email = String(req.body?.email ?? "").trim().toLowerCase();
  const password = String(req.body?.password ?? "");

  const ok = safeEqual(email, ADMIN_EMAIL.trim().toLowerCase()) && safeEqual(password, ADMIN_PASSWORD);
  if (!ok) return res.status(401).json({ message: "Invalid email or password" });

  const token = jwt.sign({ role: "admin", email }, JWT_SECRET, { expiresIn: "12h" });
  res.status(200).json({ token });
};

// GET /api/auth/me  (behind requireAdmin) - lets the frontend validate a stored token
export const adminMe = (req, res) => res.status(200).json({ email: req.admin.email });
