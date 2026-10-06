import { useSyncExternalStore } from "react";
import axios from "axios";
import { API_URL } from "../config/api.js";

const TOKEN_KEY = "littlestore_admin_token";

export const getAdminToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
};

const CHANGE_EVENT = "littlestore-admin-change";

export const setAdminToken = (token) => {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
};

const subscribe = (cb) => {
  window.addEventListener(CHANGE_EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(CHANGE_EVENT, cb);
    window.removeEventListener("storage", cb);
  };
};

// true while an admin token is stored (navbar uses this to show Admin Panel / Logout)
export const useIsAdmin = () =>
  useSyncExternalStore(subscribe, () => Boolean(getAdminToken()), () => false);

export const adminLogin = async (email, password) => {
  const { data } = await axios.post(`${API_URL}/auth/login`, { email, password });
  setAdminToken(data.token);
  return data;
};

export const adminLogout = () => setAdminToken(null);

export const verifyAdmin = async () => {
  const { data } = await axios.get(`${API_URL}/auth/me`);
  return data;
};

// Attach the admin token to every request that goes to our own API.
// Public endpoints ignore it, protected ones require it.
axios.interceptors.request.use((config) => {
  const token = getAdminToken();
  if (token && String(config.url || "").startsWith(API_URL)) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Expired/invalid admin session -> back to the login page
axios.interceptors.response.use(
  (res) => res,
  (error) => {
    const url = String(error?.config?.url || "");
    const isLogin = url.includes("/auth/login");
    if (error?.response?.status === 401 && !isLogin && getAdminToken()) {
      setAdminToken(null);
      if (window.location.pathname.startsWith("/admin")) {
        window.location.href = "/admin/login";
      }
    }
    return Promise.reject(error);
  }
);
