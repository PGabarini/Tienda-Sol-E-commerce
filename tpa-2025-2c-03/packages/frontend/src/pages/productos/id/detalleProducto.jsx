import { useLocation, useNavigate } from "react-router-dom";
import "../../../styles/detalleProducto.css";
import { useEffect, useState, useContext } from "react";
import { ToastContext } from "../../../context/ToastContext.jsx";
import { CarritoContext } from "../../../context/CarritoContext.jsx";
import { useAuth } from "../../../context/AuthContext.jsx";
import { ArrowLeft } from "lucide-react";
import { BASE_API_URL } from "../../../config/api.js";

export default function Detalle() {
  const navigate = useNavigate();
  const { agregarAlCarrito } = useContext(CarritoContext);
  const { showToast } = useContext(ToastContext);
  const { isAuthenticated} = useAuth();

  const location = useLocation();
  const { producto } = location.state;

  const [fotoPrincipal, setFotoPrincipal] = useState();

  const cambiarFotoPrincipal = (foto) => {
    if (foto) {
      setFotoPrincipal(foto);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    if (producto?.fotos?.[0]) {
      setFotoPrincipal(`${BASE_API_URL}${producto.fotos[0]}`);
    }
  }, [producto]);

  const handleAgregar = (prod) => {
    if (!isAuthenticated) {
      showToast("Debés iniciar sesión para agregar al carrito", 3000);
      return;
    }

    if (prod.stock <= 0) {
      showToast("Producto sin stock disponible", 3000);
      return;
    }

    const agregado = agregarAlCarrito(prod);

    if (agregado) {
      showToast(`${prod.titulo} agregado al carrito`, 3000);
    }
  };

  const getFotoUrl = (foto) =>
    foto
      ? `${BASE_API_URL}${foto}`
      : `${BASE_API_URL}/uploads/defaultProduct.jpg`;

  return (
    <div className="detalle-producto">
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Detalle de Producto</title>

      {/* Botón de volver */}
      <button className="boton-volver" onClick={() => navigate(-1)}>
        <ArrowLeft size={20} />
        <span>Volver</span>
      </button>

      <div className="contenedor">
        <div className="contenedor-imagenes">
          <img
            className="fotoPrincipal"
            src={fotoPrincipal}
            alt="Imagen del producto"
          />
          <div className="contenedor-fotos">
            {producto.fotos.map((foto, index) => (
              <button
                key={index}
                className="boton-foto-secundaria"
                onClick={() => cambiarFotoPrincipal(getFotoUrl(foto))}
                style={{ backgroundImage: `url(${getFotoUrl(foto)})` }}
              ></button>
            ))}
          </div>
        </div>

        <div className="contenedor-info">
          <h1 className="titulo">{producto.titulo}</h1>
          <div className="contenedor-precio-moneda">
            <h2 className="precio">
              {producto.moneda === "PESO_ARG"
                ? "$ "
                : producto.moneda === "DOLAR_USA"
                ? "U$D "
                : producto.moneda === "REAL"
                ? "R$ "
                : ""}
              {new Intl.NumberFormat("es-ES", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }).format(producto.precio)}
            </h2>
          </div>
          <h3 className="descripcion">{producto.descripcion}</h3>
          <div className="cantidad-vendedor">
            <p className="cantidad">
              {producto.stock > 0
                ? `Cantidad disponible: ${producto.stock}`
                : "Sin stock disponible"}
            </p>
          </div>

          <section className="seccion-comprar">
            <button
              type="button"
              className="boton-agregarAlCarrito"
              onClick={() => handleAgregar(producto)}
              disabled={producto.stock <= 0}
              style={{
                backgroundColor:
                  producto.stock <= 0 ? "#ccc" : "#d58cd9",
                cursor: producto.stock <= 0 ? "not-allowed" : "pointer",
                boxShadow:
                  producto.stock <= 0
                    ? "none"
                    : "0 4px 6px rgba(180, 73, 186, 0.3)",
              }}
            >
              {producto.stock > 0 ? "Agregar al Carrito" : "Sin Stock"}
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}