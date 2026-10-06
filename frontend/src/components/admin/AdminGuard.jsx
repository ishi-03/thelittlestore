import React, { useEffect, useState } from "react";
import { Navigate, NavLink, useNavigate } from "react-router-dom";
import { adminLogout, getAdminToken, verifyAdmin } from "../../api/adminAuth.js";

const TABS = [
  { to: "/admin", label: "Dashboard", end: true },
  { to: "/admin/products", label: "Products" },
  { to: "/admin/categories", label: "Categories" },
  { to: "/admin/age-groups", label: "Age Groups" },
  { to: "/admin/orders", label: "Orders" },
];

// Wraps every admin page: requires a valid admin token and shows a slim tab bar.
export default function AdminGuard({ children }) {
  const navigate = useNavigate();
  const [state, setState] = useState(getAdminToken() ? "checking" : "denied");

  useEffect(() => {
    if (!getAdminToken()) return undefined;
    let cancelled = false;
    verifyAdmin()
      .then(() => !cancelled && setState("ok"))
      .catch(() => !cancelled && setState("denied"));
    return () => {
      cancelled = true;
    };
  }, []);

  if (state === "denied") return <Navigate to="/admin/login" replace />;
  if (state === "checking") {
    return <div className="p-10 text-center text-gray-500">Checking login…</div>;
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-1 border-b bg-white px-6 pt-3">
        {TABS.map((t) => (
          <NavLink
            key={t.to}
            to={t.to}
            end={t.end}
            className={({ isActive }) =>
              `px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
                isActive
                  ? "border-pink-400 text-pink-500"
                  : "border-transparent text-gray-500 hover:text-gray-800"
              }`
            }
          >
            {t.label}
          </NavLink>
        ))}
        <button
          onClick={() => {
            adminLogout();
            navigate("/");
          }}
          className="ml-auto text-sm text-gray-500 hover:text-red-500 pb-2"
        >
          Log out
        </button>
      </div>
      {children}
    </div>
  );
}
