import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useToast } from "./ToastContext.jsx";
import { addToCart, setLineQuantity, syncItems, cartTotals } from "../utils/cartLogic.js";

const STORAGE_KEY = "littlestore_cart_v1";
const CartContext = createContext(null);

const isValidLine = (i) =>
  i && i.key && i.productId && Number.isInteger(i.quantity) && i.quantity > 0;

const loadCart = () => {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(parsed) ? parsed.filter(isValidLine) : [];
  } catch {
    return [];
  }
};

export function CartProvider({ children }) {
  const toast = useToast();
  const [items, setItems] = useState(loadCart);

  // Persist across refreshes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* storage full / blocked: cart still works for this session */
    }
  }, [items]);

  // Keep other open tabs in sync
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === STORAGE_KEY) setItems(loadCart());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const addItem = useCallback(
    (product, variant, qty = 1) => {
      const result = addToCart(items, product, variant, qty);
      if (result.ok) setItems(result.items);
      toast.show(result.message, result.type);
      return result.ok;
    },
    [items, toast]
  );

  const updateQuantity = useCallback(
    (key, qty) => {
      const result = setLineQuantity(items, key, qty);
      if (result.ok) setItems(result.items);
      if (result.message) toast.show(result.message, result.type);
      return result.ok;
    },
    [items, toast]
  );

  const removeItem = useCallback((key) => {
    setItems((prev) => prev.filter((i) => i.key !== key));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const syncWithProducts = useCallback((products) => {
    setItems((prev) => {
      const next = syncItems(prev, products);
      return JSON.stringify(next) === JSON.stringify(prev) ? prev : next;
    });
  }, []);

  const totals = useMemo(() => cartTotals(items), [items]);

  const value = useMemo(
    () => ({
      items,
      totalCount: totals.count,
      subtotal: totals.subtotal,
      hasUnavailable: totals.hasUnavailable,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      syncWithProducts,
    }),
    [items, totals, addItem, updateQuantity, removeItem, clearCart, syncWithProducts]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
