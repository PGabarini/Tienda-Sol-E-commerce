import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarPerfil } from "../components/sidebar/sidebarPerfil";
import { useAuth } from "../context/AuthContext";
import "../styles/historialPedidos.css";

import {
  obtenerPedidosVendedor,
  marcarPedidoComoEnviado,
} from "../service/pedidoService";

export default function GestionarPedidos() {
  const { token, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);

  const getEstadoClass = (estado) => {
    switch (estado) {
      case "ENVIADO":
        return "entregado";
      case "PENDIENTE":
        return "pendiente";
      case "CANCELADO":
        return "cancelado";
      default:
        return "";
    }
  };

  const formatEstado = (estado) =>
    estado.charAt(0) + estado.slice(1).toLowerCase();

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchPedidos = async () => {
      try {
        setLoading(true);
        const data = await obtenerPedidosVendedor(token);
        setPedidos(data);
      } catch (err) {
        console.error("Error fetching pedidos del vendedor:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPedidos();
  }, [isAuthenticated, token]);

  const handleVerDetalle = (id) => {
    navigate(`/historial-pedidos/${id}`);
  };

  const handleMarcarComoEnviado = async (id) => {
    try {
      await marcarPedidoComoEnviado(id, token);
      setPedidos((prev) =>
        prev.map((p) =>
          p._id === id ? { ...p, estado: "ENVIADO" } : p
        )
      );
    } catch (error) {
      console.error("Error marcando como enviado", error);
    }
  };

  if (!isAuthenticated) return <p>No estás autenticado</p>;

  return (
    <div className="historial-container">
      <SidebarPerfil />
      <main className="historial-main">
        <h2>Pedidos de tus productos</h2>
        <p>Revisá y gestioná todos tus pedidos como vendedor.</p>

        {loading ? (
          <p>Cargando pedidos...</p>
        ) : pedidos.length === 0 ? (
          <p>No hay pedidos para mostrar.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID de pedido</th>
                <th>Comprador</th>
                <th>Fecha</th>
                <th>Estado</th>
                <th>Total</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {pedidos.map((pedido) => {
                const fecha = new Date(
                  pedido.fechaCreacion
                ).toLocaleDateString("es-AR");

                const total = pedido.total.toFixed(2);

                return (
                  <tr
                    key={pedido._id}
                    className="fila-click"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleVerDetalle(pedido._id)}
                  >
                    <td>{pedido._id}</td>
                    <td>{pedido.comprador?.nombre || "Desconocido"}</td>
                    <td>{fecha}</td>
                    <td>
                      <span
                        className={`estado ${getEstadoClass(
                          pedido.estado
                        )}`}
                      >
                        {formatEstado(pedido.estado)}
                      </span>
                    </td>
                    <td>
                      {total}{" "}
                      {pedido.moneda === "PESO_ARG" ? "$" : pedido.moneda}
                    </td>

                    <td>
                      {pedido.estado === "PENDIENTE" && (
                      <button
                      className="btn-detalles"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMarcarComoEnviado(pedido._id);
                      }}
                    >
                      Marcar como enviado
                    </button>
                    )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </main>
    </div>
  );
}
