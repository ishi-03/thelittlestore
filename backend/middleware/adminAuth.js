import jwt from "jsonwebtoken";

// True when the request carries a valid admin token (never rejects; used for public routes
// that show extra data to the admin, e.g. inactive products).
export const isAdminRequest = (req) => {
  try {
    const header = req.get("authorization") || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token || !process.env.JWT_SECRET) return false;
    return jwt.verify(token, process.env.JWT_SECRET)?.role === "admin";
  } catch {
    return false;
  }
};

// Protects admin-only routes. Expects "Authorization: Bearer <token>" issued by /api/auth/login.
export const requireAdmin = (req, res, next) => {
  try {
    const header = req.get("authorization") || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token || !process.env.JWT_SECRET) {
      return res.status(401).json({ message: "Admin login required" });
    }
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (payload?.role !== "admin") {
      return res.status(403).json({ message: "Not allowed" });
    }
    req.admin = payload;
    next();
  } catch {
    res.status(401).json({ message: "Session expired. Please log in again." });
  }
};
