import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CarritoContext } from "../../context/CarritoContext";
import { ToastContext } from "../../context/ToastContext.jsx";
import "../../styles/carritoDesplegable.css";
import { BASE_API_URL } from "../../config/api.js";
export const CarritoDesplegable = ({ visible }) => {
  const navigate = useNavigate();
  const { carrito, eliminarDelCarrito, cambiarCantidad } =
    useContext(CarritoContext);
  const { showToast } = useContext(ToastContext);

  if (!visible) return null;

  const subtotal = carrito.reduce(
    (acc, p) => acc + (p.precio || 0) * (p.cantidad || 1),
    0
  );
  const envio = subtotal > 0 ? 5 : 0;
  const total = subtotal + envio;

  const incrementar = (id, cantidad) => {
    const producto = carrito.find((p) => p._id === id);
    if (!producto) return;

    if (cantidad < producto.stock) {
      cambiarCantidad(id, cantidad + 1);
    } else {
      showToast(
        `No puedes agregar más. Stock disponible: ${producto.stock}`,
        3000
      );
    }
  };

  const decrementar = (id, cantidad) => {
    if (cantidad > 1) cambiarCantidad(id, cantidad - 1);
  };

  return (
    <div className="carrito-desplegable carrito-card">
      <h2>Mi carrito</h2>

      {carrito.length === 0 ? (
        <p>Tu carrito está vacío</p>
      ) : (
        <section className="productos scrollable">
          {carrito.map((p) => (
            <div key={p._id} className="producto">
              <img
                src={
                  p.fotos?.[0]
                    ? `${BASE_API_URL}${p.fotos[0]}`
                    : `${BASE_API_URL}/uploads/default.jpg`
                }
                alt={p.nombre}
              />

              <div className="info">
                <h3>{p.nombre}</h3>
                <p>
                  Precio:{" "}
                  {p.moneda === "DOLAR_USA"
                    ? "U$S"
                    : p.moneda === "PESO_ARG"
                    ? "$"
                    : p.moneda === "REAL"
                    ? "R$"
                    : ""}{" "}
                  {p.precio?.toFixed(2)}
                </p>

                <div className="acciones-producto">
                  <span>Cantidad:</span>
                  <div className="contador">
                    <button
                      className="btn-cantidad"
                      onClick={() => decrementar(p._id, p.cantidad)}
                    >
                      −
                    </button>
                    <span className="valor-cantidad">{p.cantidad}</span>
                    <button
                      className="btn-cantidad"
                      onClick={() => incrementar(p._id, p.cantidad)}
                      disabled={p.cantidad >= p.stock}
                    >
                      +
                    </button>
                  </div>

                  {p.cantidad >= p.stock && (
                    <small className="stock-msg">
                      Stock máximo alcanzado
                    </small>
                  )}
                </div>
              </div>

              <button
                className="btn-remove"
                onClick={(e) => {
                  e.stopPropagation();
                  eliminarDelCarrito(p._id);
                }}
              >
                Eliminar
              </button>
            </div>
          ))}
        </section>
      )}

      {carrito.length > 0 && (
        <aside className="resumen">
          <h2>Resumen</h2>
          <p>Subtotal: ${subtotal.toFixed(2)}</p>
          <p>Envío: ${envio.toFixed(2)}</p>
          <hr />
          <p className="total">
            <strong>Total: ${total.toFixed(2)}</strong>
          </p>
          <div className="acciones">
            <button
              className="btn-primary"
              onClick={() => navigate("/carrito")}
            >
              Finalizar compra
            </button>
          </div>
        </aside>
      )}
    </div>
  );
};

export default CarritoDesplegable;
