// src/context/ToastContext.jsx
import React, { createContext, useState, useCallback } from "react";
import "../styles/toast.css";

export const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((mensaje, duration = 3000, tipo = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, mensaje, duration, tipo }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="toast-container">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`toast ${t.tipo}`} // ← Aplica clase según tipo
            style={{ animationDuration: `${t.duration}ms` }}
          >
            {t.mensaje}
            <div className="progress-bar" />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
