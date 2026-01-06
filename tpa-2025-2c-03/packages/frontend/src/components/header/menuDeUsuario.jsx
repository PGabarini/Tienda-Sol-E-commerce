import "../../styles/header.css";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState, useRef, useEffect } from "react";
import CarritoDesplegable from "./carritoDesplegable";
import { BASE_API_URL } from "../../config/api";
import NotificacionService from "../../service/notificacionService";

export const MenuDeUsuario = () => {
  const navigate = useNavigate();
  const { isAuthenticated, profile, token } = useAuth();
  const [mostrarCarrito, setMostrarCarrito] = useState(false);
  const [cantNoLeidas, setCantNoLeidas] = useState(0);

  const carritoRef = useRef(null);
  const botonCarritoRef = useRef(null);

 
  const cargarCantidadNotificaciones = async () => {
    try {
      const data = await NotificacionService.obtenerNotificaciones(false, token);
      setCantNoLeidas(data?.length || 0);
    } catch (e) {
      console.error("Error cargando cantidad de no leídas:", e);
    }
  };

  
  useEffect(() => {
    if (token) cargarCantidadNotificaciones();
  }, [token]);

  
  useEffect(() => {
    const refrescar = () => cargarCantidadNotificaciones();
    window.addEventListener("actualizarNotificaciones", refrescar);

    return () => {
      window.removeEventListener("actualizarNotificaciones", refrescar);
    };
  }, [token]);

  // Cierre del carrito si clickean afuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        carritoRef.current &&
        !carritoRef.current.contains(e.target) &&
        botonCarritoRef.current &&
        !botonCarritoRef.current.contains(e.target)
      ) {
        setMostrarCarrito(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const getFullUrl = (url) => {
    if (!url) return "/uploads/userDefault.jpg";
    return url.startsWith("http") ? url : `${BASE_API_URL}${url}`;
  };

  const photoURL = getFullUrl(profile?.fotoUrl || profile?.photoURL);

  if (!isAuthenticated) {
    return (
      <div className="botonesSinSesion">
        <button className="btn-register small login" onClick={() => navigate("/auth/login")}>
          Loguearse
        </button>
        <button
          className="btn-register small"
          onClick={() => navigate("/auth/register")}
          id="registrarseBoton"
        >
          Registrarse
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="profile-wrapper">

      {/* CARRITO */}
      <div className="desplegable">
          
          <button
            ref={botonCarritoRef}
            className="cart-btn"
            title="Ver carrito"
            onClick={(e) => {
              e.stopPropagation();
              setMostrarCarrito((prev) => !prev);
            }}
          >
            <img src="/uploads/carrito.png" alt="Carrito" className="header-cart-img" />
          </button>

        {mostrarCarrito && (
          <div ref={carritoRef}>
            <CarritoDesplegable visible={mostrarCarrito} />
          </div>
        )}
        </div>

        {/* 🔔 NOTIFICACIONES */}
        <div className="notification-wrapper" onClick={() => navigate("/notificaciones")}>
          <img
            src="/uploads/notificacion.png"
            alt="Notificaciones"
            className="notification-icon"
          />

          {cantNoLeidas > 0 && (
            <span className="notification-badge">{cantNoLeidas}</span>
          )}
        </div>

        {/* PERFIL */}
        <Link to="/perfil" className="profile-btn">
          <img src={photoURL} alt="Perfil" className="header-profile-img" />
        </Link>

      </div>
    </>
  );
};
