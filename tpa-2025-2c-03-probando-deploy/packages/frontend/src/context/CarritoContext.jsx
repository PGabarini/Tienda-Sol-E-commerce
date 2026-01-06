import React, { createContext, useState, useEffect, useContext } from "react";
import { useAuth } from "./AuthContext";
import { ToastContext } from "./ToastContext.jsx";

export const CarritoContext = createContext();

export const CarritoProvider = ({ children }) => {
  const { profile } = useAuth();
  const { showToast } = useContext(ToastContext);
  const userId = profile?.mongoId || "anonimo";
  const storageKey = `carrito_${userId}`;

  const [carrito, setCarrito] = useState([]);

  useEffect(() => {
    try {
      const data = localStorage.getItem(storageKey);
      setCarrito(data ? JSON.parse(data) : []);
    } catch (err) {
      console.error("Error cargando carrito:", err);
      setCarrito([]);
    }
  }, [storageKey]);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(carrito));
    } catch (err) {
      console.error("Error guardando carrito:", err);
    }
  }, [carrito, storageKey]);

  const agregarAlCarrito = (producto) => {
    if (!producto || !producto._id) return false;

    const vendedorProducto = producto.vendedor;

    if (carrito.length > 0) {
      const vendedorActual = carrito[0].vendedor;
      if (vendedorProducto !== vendedorActual) {
        showToast(
          "Solo podés agregar productos del mismo vendedor. Vaciá el carrito para cambiar.",
          4000
        );
        return false;
      }
    }

    setCarrito((prev) => {
      const existente = prev.find((p) => p._id === producto._id);
      if (existente) {
        return prev.map((p) =>
          p._id === producto._id
            ? { ...p, cantidad: Math.min(p.cantidad + 1, producto.stock || 9999) }
            : p
        );
      } else {
        return [...prev, { ...producto, cantidad: 1, vendedor: vendedorProducto }];
      }
    });

    return true; 
  };


  const eliminarDelCarrito = (id) => {
    setCarrito((prev) => prev.filter((p) => p._id !== id));
  };

  const cambiarCantidad = (id, cantidad) => {
    setCarrito((prev) =>
      prev.map((p) => (p._id === id ? { ...p, cantidad } : p))
    );
  };

  const vaciarCarrito = () => {
    setCarrito([]);
    localStorage.removeItem(storageKey);
  };

  if (profile === undefined) return null;

  return (
    <CarritoContext.Provider
      value={{
        carrito,
        agregarAlCarrito,
        eliminarDelCarrito,
        cambiarCantidad,
        vaciarCarrito,
      }}
    >
      {children}
    </CarritoContext.Provider>
  );
};
