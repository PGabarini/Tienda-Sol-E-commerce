import { NavLink, useNavigate } from "react-router-dom";
import "../../styles/sidebar.css";
import { useAuth } from "../../context/AuthContext";
import { useContext } from "react";
import { ToastContext } from "../../context/ToastContext";
import { BASE_API_URL } from "../../config/api";
export const SidebarPerfil = () => {
  const { logout, profile, updateProfile } = useAuth(); // Asegurate de tener setProfile disponible
  const { showToast } = useContext(ToastContext);
  const navigate = useNavigate();

  const tipoUsuario = profile?.tipo || "USUARIO";

  const baseItems = [
    { path: "/perfil", label: "Perfil" },
    { path: "/historial-pedidos", label: tipoUsuario === "VENDEDOR" ? "Historial de Pedidos" : "Historial de Compras" },
    { path: "/notificaciones", label: "Notificaciones" },
  ];

  const vendedorItems = [
    { path: "/mis-productos", label: "Mis Productos" },
    { path: "/publicar-producto", label: "Publicar Producto" },
    { path: "/gestionar-pedidos", label: "Gestionar Pedidos" }, 
  ];

  const abrirTiendaItem = tipoUsuario === "COMPRADOR"
  ? [{
      action: async () => {
        try {
          const response = await fetch(`${BASE_API_URL}/usuarios/vendedor`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({ tipo: "VENDEDOR" }),
          });

          console.log("response.status:", response.status);
          const data = await response.json().catch(() => null);
          console.log("response data:", data);

          if (!response.ok) {
            throw new Error(data?.error || "Error al abrir la tienda");
          }if (response.ok) {
            updateProfile(data.usuario);
            showToast("🎉 ¡Felicitaciones! Abriste tu tienda con éxito 🛍️", 4000);
          }


          updateProfile(data.usuario);
          navigate("/perfil");
        } catch (error) {
          console.error("Error al abrir tienda:", error);
          alert("No se pudo abrir la tienda");
        }
      },
      label: "Abrir Tienda",
    }]
  : [];


  const items =
    tipoUsuario === "VENDEDOR"
      ? [...baseItems.slice(0, 1), ...vendedorItems, ...baseItems.slice(1)]
      : [...baseItems, ...abrirTiendaItem];

  items.push({
    action: () => {
      logout();
      navigate("/");
    },
    label: "Cerrar Sesión",
  });

  return (
    <aside className="sidebar">
      <ul>
        {items.map((item, index) => (
          <li key={item.path || index}>
            {item.path ? (
              <NavLink
                to={item.path}
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                {item.label}
              </NavLink>
            ) : (
              <NavLink
                to="#"
                className="sidebar-logout-btn"
                onClick={(e) => {
                  e.preventDefault();
                  item.action();
                }}
              >
                {item.label}
              </NavLink>
            )}
          </li>
        ))}
      </ul>
    </aside>
  );
};
