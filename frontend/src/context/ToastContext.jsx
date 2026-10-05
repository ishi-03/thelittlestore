import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

const ToastContext = createContext(null);

const COLORS = { success: "#3fa66b", error: "#d9534f", info: "#2d2d2d" };

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const show = useCallback((message, type = "info") => {
    if (!message) return;
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((t) => [...t.slice(-2), { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }, []);

  const value = useMemo(
    () => ({
      show,
      success: (m) => show(m, "success"),
      error: (m) => show(m, "error"),
      info: (m) => show(m, "info"),
    }),
    [show]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        style={{
          position: "fixed",
          left: 0,
          right: 0,
          bottom: "20px",
          zIndex: 1000,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "8px",
          padding: "0 16px",
          pointerEvents: "none",
        }}
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            style={{
              background: "#fff",
              color: "#2d2d2d",
              borderLeft: `4px solid ${COLORS[t.type] || COLORS.info}`,
              borderRadius: "10px",
              boxShadow: "0 6px 24px rgba(0,0,0,0.15)",
              padding: "11px 16px",
              fontFamily: '"Nunito", sans-serif',
              fontSize: "13.5px",
              fontWeight: 600,
              maxWidth: "380px",
              width: "100%",
            }}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}
