import React, { useContext, useState } from "react";
import "../styles/carrito.css";
import { CarritoContext } from "../context/CarritoContext";
import { useAuth } from "../context/AuthContext";
import { jwtDecode } from "jwt-decode";
import { ToastContext } from "../context/ToastContext.jsx";
import { useNavigate } from "react-router-dom";
import { BASE_API_URL } from "../config/api.js";
export default function Carrito() {
  const { carrito, eliminarDelCarrito, cambiarCantidad, vaciarCarrito } =
    useContext(CarritoContext);
  const { profile } = useAuth();
  const { showToast } = useContext(ToastContext);
  const navigate = useNavigate();

  const [monedaSeleccionada, setMonedaSeleccionada] = useState("PESO_ARG");

  const tasas = {
    DOLAR_USA: 1,
    PESO_ARG: 1400,
    REAL: 6,
    EUR: 0.9,
  };

  const convertir = (precio, desde, hacia) => {
    if (!desde || !precio) return 0;
    if (desde === hacia) return precio;
    const enUSD = precio / tasas[desde];
    return enUSD * tasas[hacia];
  };

  const subtotal = carrito.reduce(
    (acc, p) =>
      acc +
      convertir(p.precio, p.moneda, monedaSeleccionada) * (p.cantidad || 1),
    0
  );

  const envio =
    subtotal > 0 ? convertir(5, "DOLAR_USA", monedaSeleccionada) : 0;
  const total = subtotal + envio;

  const [direccionEntrega, setDireccionEntrega] = useState(
    profile?.direccionEntrega || {
      calle: "",
      altura: "",
      piso: "",
      departamento: "",
      ciudad: "",
      codPostal: "",
      provincia: "",
      pais: "",
    }
  );

  const camposObligatorios = [
    "calle",
    "ciudad",
    "codPostal",
    "provincia",
    "pais",
    "altura",
  ];

  const [errores, setErrores] = useState({});

  const handleDireccionChange = (e) => {
    const { name, value } = e.target;
    setDireccionEntrega((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errores[name] && value.trim() !== "") {
      setErrores((prev) => ({ ...prev, [name]: false }));
    }
  };

  const incrementar = (id, cantidad) => {
    const producto = carrito.find((p) => p._id === id);
    if (!producto) return;

    if (cantidad < producto.stock) {
      cambiarCantidad(id, cantidad + 1);
    } else {
      showToast(
        `No podés agregar más. Stock disponible: ${producto.stock}`,
        3000
      );
    }
  };

  const decrementar = (id, cantidad) => {
    if (cantidad > 1) cambiarCantidad(id, cantidad - 1);
  };

  const finalizarCompra = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      showToast("Tenés que iniciar sesión para realizar la compra ", 3000);
      return;
    }

    const decoded = jwtDecode(token);
    const mongoId =
      decoded?.mongoId ||
      decoded?.attributes?.mongoId?.[0] ||
      decoded?.attributes?.mongoId;

    if (!mongoId) {
      showToast("No se pudo obtener el ID de usuario del token ", 3000);
      return;
    }

    if (carrito.length === 0) {
      showToast("Tu carrito está vacío ", 3000);
      return;
    }

    const nuevosErrores = {};
    let hayError = false;

    camposObligatorios.forEach((campo) => {
      if (!direccionEntrega[campo] || direccionEntrega[campo].trim() === "") {
        nuevosErrores[campo] = true;
        hayError = true;
      }
    });

    if (hayError) {
      setErrores(nuevosErrores);
      showToast("Completá todos los campos obligatorios ", 3000);
      return;
    }

    // 🔍 VALIDAR STOCK CONTRA BACKEND
    for (const p of carrito) {
      const res = await fetch(`http://localhost:8000/producto/${p._id}`);
      if (!res.ok) {
        showToast("Error al validar stock", 3000);
        return;
      }

      const productoBD = await res.json();

      if (!productoBD || productoBD.error) {
        showToast("Producto inexistente o eliminado", 3000);
        return;
      }

      if (p.cantidad > productoBD.stock) {
        showToast(
          `No hay stock suficiente de "${productoBD.titulo}". Stock disponible: ${productoBD.stock}`,
          4000
        );
        return;
      }
    }

    // 🚀 CREAR PEDIDO
    const pedidoDTO = {
      compradorId: mongoId,
      moneda: monedaSeleccionada,
      items: carrito.map((p) => ({
        productoId: p._id,
        cantidad: p.cantidad,
      })),
      direccionEntrega,
    };

    const response = await fetch("http://localhost:8000/pedidos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pedidoDTO),
    });

    const data = await response.json();

    if (!response.ok) {
      showToast(data.error || "No se pudo crear el pedido", 3000);
      return;
    }

    showToast("Pedido realizado con éxito", 3000);
    vaciarCarrito();
    setErrores({});
  } catch (error) {
    console.error(error);
    showToast("Hubo un error al realizar el pedido", 3000);
  }
};


  const simbolo = (m) =>
    m === "PESO_ARG"
      ? "$"
      : m === "DOLAR_USA"
      ? "U$S"
      : m === "REAL"
      ? "R$"
      : "€";

  return (
    <div className="carrito-page">
      <main className="carrito-main">
        <section className="carrito-card productos">
          <h2>Mi carrito</h2>

          {carrito.length === 0 ? (
            <p>Tu carrito está vacío</p>
          ) : (
            carrito.map((p) => (
              <div key={p._id} className="producto">
                <img
                  src={
                    p.fotos?.[0]
                      ? `${BASE_API_URL}${p.fotos[0]}`
                      : `${BASE_API_URL}/uploads/default.jpg`
                  }
                  alt={p.nombre || p.titulo}
                />

                <div className="info">
                  <h3>{p.nombre || p.titulo}</h3>
                  <p>
                    Precio original: {simbolo(p.moneda)} {p.precio?.toFixed(2)}
                  </p>
                  <p>
                    Precio {simbolo(monedaSeleccionada)}{" "}
                    {convertir(p.precio, p.moneda, monedaSeleccionada).toFixed(
                      2
                    )}
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
                  onClick={() => eliminarDelCarrito(p._id)}
                >
                  Eliminar
                </button>
              </div>
            ))
          )}
        </section>

        {carrito.length > 0 && (
          <aside className="carrito-card resumen">
            <h2>Resumen</h2>

            <div className="selector-moneda">
              <label>Ver precios en: </label>
              <select
                value={monedaSeleccionada}
                onChange={(e) => setMonedaSeleccionada(e.target.value)}
              >
                <option value="PESO_ARG">ARS (Pesos argentinos)</option>
                <option value="DOLAR_USA">USD (Dólares)</option>
                <option value="REAL">BRL (Reales)</option>
                <option value="EUR">EUR (Euros)</option>
              </select>
            </div>

            <p>
              Subtotal: {simbolo(monedaSeleccionada)} {subtotal.toFixed(2)}
            </p>
            <p>
              Envío: {simbolo(monedaSeleccionada)} {envio.toFixed(2)}
            </p>
            <hr />
            <p className="total">
              <strong>
                Total: {simbolo(monedaSeleccionada)} {total.toFixed(2)}
              </strong>
            </p>

            <h3 className="titulo-direccion">Dirección de entrega</h3>
            <form className="form-direccion">
              {Object.keys(direccionEntrega).map((campo) => (
                <input
                  key={campo}
                  name={campo}
                  placeholder={
                    campo.charAt(0).toUpperCase() +
                    campo.slice(1).replace(/([A-Z])/g, " $1")
                  }
                  value={direccionEntrega[campo]}
                  onChange={handleDireccionChange}
                  className={errores[campo] ? "input-error" : ""}
                />
              ))}
            </form>

            <div className="acciones">
              <button
                className="btn-secondary"
                onClick={() => (window.location.href = "/")}
              >
                Seguir comprando
              </button>

              <button className="btn-primary" onClick={finalizarCompra}>
                Finalizar compra
              </button>
            </div>
          </aside>
        )}
      </main>
    </div>
  );
}
