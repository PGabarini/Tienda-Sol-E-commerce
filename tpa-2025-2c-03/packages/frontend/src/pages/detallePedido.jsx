import React, { useEffect, useState } from "react";
import { SidebarPerfil } from "../components/sidebar/sidebarPerfil";
import "../styles/detallePedidos.css";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { obtenerPedidoPorId, cancelarPedido } from "../service/pedidoService";

export default function DetallePedido() {
  const { pedidoId } = useParams();
  const navigate = useNavigate();
  const { token, isAuthenticated } = useAuth();
  const [pedido, setPedido] = useState(null);
  const [loading, setLoading] = useState(true);

  const formatCurrency = (valor, moneda) => {
    switch (moneda) {
      case "PESO_ARG": return `AR$${valor.toFixed(2)}`;
      case "REAL": return `R$${valor.toFixed(2)}`;
      default: return `€${valor.toFixed(2)}`;
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchPedido = async () => {
      try {
        setLoading(true);
        const data = await obtenerPedidoPorId(pedidoId, token);
        setPedido(data);
      } catch (err) {
        console.error("Error fetching pedido:", err);
        setPedido(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPedido();
  }, [pedidoId, token, isAuthenticated]);


  // ✔ LÓGICA DE CANCELAR (idéntica a HistorialPedidos)
  const handleCancelarPedido = async () => {
    if (!window.confirm("¿Seguro que querés cancelar este pedido?")) return;

    try {
      await cancelarPedido(pedidoId, token);
      alert("Pedido cancelado correctamente.");

      // Refrescar datos del pedido
      const data = await obtenerPedidoPorId(pedidoId, token);
      setPedido(data);

    } catch (err) {
      console.error("Error al cancelar pedido:", err);
      alert("No se pudo cancelar el pedido.");
    }
  };


  if (!isAuthenticated) return <p>No estás autenticado</p>;
  if (loading) return <p>Cargando pedido...</p>;
  if (!pedido) return <p>No se encontró el pedido</p>;

  const direccion = pedido.direccionEntrega || {};

  return (
    <div className="registro-container">
      <SidebarPerfil />
      <div className="registro-right">
        <div className="registro-form">
          <h2>Detalle del pedido</h2>

          {/* ✔ Botones lado a lado */}
          <div style={{ display: "flex", gap: "1rem" }}>
            <button className="btn-secondary wide" onClick={() => navigate(-1)}>
              ← Volver
            </button>

            {pedido.estado === "PENDIENTE" && (
              <button
                className="btn-secondary wide"
                style={{ borderColor: "red", color: "red" }}
                onClick={handleCancelarPedido}
              >
                ✖ Cancelar pedido
              </button>
            )}
          </div>

          <div className="form-field">
            <label>ID de pedido:</label>
            <div className="readonly-field">{pedido._id}</div>
          </div>

          <div className="form-field">
            <label>Fecha de creación:</label>
            <div className="readonly-field">
              {pedido.fechaCreacion
                ? new Date(pedido.fechaCreacion).toLocaleDateString()
                : "No disponible"}
            </div>
          </div>

          {/* ✔ Estado + Total */}
          <div className="form-row">
            <div className="form-field half">
              <label>Estado actual:</label>
              <div className="readonly-field">{pedido.estado || "No disponible"}</div>
            </div>

            <div className="form-field half">
              <label>Total:</label>
              <div className="readonly-field">
                {formatCurrency(pedido.total, pedido.moneda)}
              </div>
            </div>
          </div>

          <div className="form-field">
            <label>Dirección de entrega:</label>
            <div className="readonly-field textarea-like">
              {direccion.calle
                ? `${direccion.calle} ${direccion.altura}, Piso ${direccion.piso || "-"}, Depto ${direccion.departamento || "-"}, ${direccion.ciudad}, ${direccion.provincia}, ${direccion.pais}, CP: ${direccion.codPostal}`
                : "No disponible"}
            </div>
          </div>

          <div className="form-field">
            <label>Productos:</label>
            <table>
              <thead>
                <tr>
                  <th>ID producto</th>
                  <th>Cantidad</th>
                  <th>Precio unitario</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {pedido.items && pedido.items.length > 0 ? (
                  pedido.items.map((item, index) => (
                    <tr key={index}>
                      <td style={{ color: "black" }}>{item.producto.titulo}</td>
                      <td style={{ color: "black" }}>{item.cantidad}</td>
                      <td style={{ color: "black" }}>
                        {formatCurrency(item.precioUnitario, pedido.moneda)}
                      </td>
                      <td style={{ color: "black" }}>
                        {formatCurrency(item.precioUnitario * item.cantidad, pedido.moneda)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" style={{ textAlign: "center" }}>
                      No hay productos
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="form-field">
            <label>Historial de estados:</label>
            <ul>
              {pedido.historialEstados?.length > 0 ? (
                pedido.historialEstados.map((hist, index) => (
                  <li key={index}>
                    {hist.estado} - {new Date(hist.fecha).toLocaleDateString()}
                  </li>
                ))
              ) : (
                <li>No hay historial</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
