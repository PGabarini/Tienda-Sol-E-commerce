import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarPerfil } from "../components/sidebar/sidebarPerfil";
import { useAuth } from "../context/AuthContext";
import "../styles/historialPedidos.css";

import { obtenerPedidos } from "../service/pedidoService";

export default function HistorialPedidos() {
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
        const data = await obtenerPedidos(token);
        setPedidos(data);
      } catch (err) {
        console.error("Error fetching pedidos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPedidos();
  }, [isAuthenticated, token]);

  const handleVerDetalle = (id) => {
    navigate(`/historial-pedidos/${id}`);
  };

  if (!isAuthenticated) return <p>No estás autenticado</p>;

  return (
    <div className="historial-container">
      <SidebarPerfil />

      <main className="historial-main">
        <h2>Tus pedidos</h2>
        <p>Revisá y consultá tus compras.</p>

        {loading ? (
          <p>Cargando pedidos...</p>
        ) : pedidos.length === 0 ? (
          <p>No hay pedidos para mostrar.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID de pedido</th>
                <th>Fecha</th>
                <th>Estado</th>
                <th>Total</th>
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
                    <td>{fecha}</td>
                    <td>
                      <span
                        className={`estado ${getEstadoClass(pedido.estado)}`}
                      >
                        {formatEstado(pedido.estado)}
                      </span>
                    </td>

                    <td>
                      {total}{" "}
                      {pedido.moneda === "PESO_ARG" ? "$" : pedido.moneda}
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
