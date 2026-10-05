import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useToast } from "./ToastContext.jsx";

const STORAGE_KEY = "littlestore_favorites_v1";
const FavoritesContext = createContext(null);

// Always a de-duplicated array of product id strings
const loadFavorites = () => {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(parsed) ? [...new Set(parsed.map(String))] : [];
  } catch {
    return [];
  }
};

export function FavoritesProvider({ children }) {
  const toast = useToast();
  const [ids, setIds] = useState(loadFavorites);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    } catch {
      /* ignore */
    }
  }, [ids]);

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === STORAGE_KEY) setIds(loadFavorites());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const isFavorite = useCallback((id) => ids.includes(String(id)), [ids]);

  const toggleFavorite = useCallback(
    (id) => {
      const key = String(id);
      if (ids.includes(key)) {
        setIds(ids.filter((x) => x !== key));
        toast.info("Removed from favorites");
      } else {
        setIds([...new Set([...ids, key])]);
        toast.success("Added to favorites");
      }
    },
    [ids, toast]
  );

  // Drop ids of products that no longer exist (e.g. deleted by admin)
  const pruneFavorites = useCallback((validIds) => {
    const valid = new Set(validIds.map(String));
    setIds((prev) => {
      const next = prev.filter((x) => valid.has(x));
      return next.length === prev.length ? prev : next;
    });
  }, []);

  const value = useMemo(
    () => ({ ids, count: ids.length, isFavorite, toggleFavorite, pruneFavorites }),
    [ids, isFavorite, toggleFavorite, pruneFavorites]
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used inside <FavoritesProvider>");
  return ctx;
}
