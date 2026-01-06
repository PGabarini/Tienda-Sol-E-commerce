import React, { useContext } from "react";
import { CarritoContext } from "../context/CarritoContext";
import "../styles/carrito.css";

export default function Carrito() {
  const { carrito, eliminarDelCarrito, cambiarCantidad } = useContext(CarritoContext);

  const total = carrito.reduce((acc, p) => acc + p.precio * p.cantidad, 0);

  return (
    <div className="carrito">
      <h2>Carrito</h2>
      {carrito.length === 0 ? (
        <p>Tu carrito está vacío</p>
      ) : (
        <ul>
          {carrito.map((p) => (
            <li key={p.id}>
              {p.nombre} - €{p.precio.toFixed(2)} x{" "}
              <input
                type="number"
                min="1"
                value={p.cantidad}
                onChange={(e) => cambiarCantidad(p.id, parseInt(e.target.value))}
              />
              <button onClick={() => eliminarDelCarrito(p.id)}>Eliminar</button>
            </li>
          ))}
        </ul>
      )}
      <h3>Total: €{total.toFixed(2)}</h3>
    </div>
  );
}
