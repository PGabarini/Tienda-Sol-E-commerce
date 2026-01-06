import React, { useState, useEffect } from "react";
import { SidebarPerfil } from "../components/sidebar/sidebarPerfil";
import "../styles/misProductos.css";
import { obtenerProductosVendedor } from "../service/productosService";
import { useAuth } from "../context/AuthContext";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Navigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { BASE_API_URL } from "../config/api";
export default function MisProductos() {

  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    async function fetchProductos() {
      try {
        const data = await obtenerProductosVendedor(token);
        setProductos(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (token) fetchProductos();
  }, [token]);

  const getMonedaSimbolo = (moneda) => {
    switch (moneda) {
      case "PESO_ARG": return "$";
      case "DOLAR_USA": return "USD";
      case "REAL": return "R$";
      default: return "";
    }
  };

  if (loading) return <p>Cargando productos...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="registro-container">
      <SidebarPerfil />
      <main className="productos-main">
        <h2>Productos Publicados</h2>
        <div className="productos-grid">
          {productos.map((prod) => (
            <ProductoCard key={prod._id} prod={prod} getMonedaSimbolo={getMonedaSimbolo} vendedor={true}/>
          ))}
        </div>
      </main>
    </div>
  );
}

export function ProductoCard({ prod, getMonedaSimbolo, vendedor }) {
  const [indice, setIndice] = useState(0);

  const producto = prod;

  const fotos = prod.fotos && prod.fotos.length > 0
    ? prod.fotos.map((f) => `${BASE_API_URL}${f}`)
    : [`${BASE_API_URL}/uploads/defaultProduct.jpg`];

  const siguiente = () => setIndice((prev) => (prev + 1) % fotos.length);
  const anterior = () => setIndice((prev) => (prev - 1 + fotos.length) % fotos.length);

  return (
    <div className={`producto-card ${!prod.activo ? "inactivo" : ""}`}>
      <div className="producto-img-wrapper grande">
        {fotos.length > 1 && (
          <>
            <button className="img-nav-btn izquierda" onClick={anterior}>
              <ChevronLeft size={22} />
            </button>
            <button className="img-nav-btn derecha" onClick={siguiente}>
              <ChevronRight size={22} />
            </button>
          </>
        )}
        <img
          src={fotos[indice]}
          alt={`${prod.titulo} ${indice + 1}`}
          className="producto-img grande"
        />
      </div>

      <h3 className="producto-titulo">{prod.titulo}</h3>
      <p className="producto-desc">{prod.descripcion}</p>

      <div className="producto-info-fila">
        <p className="producto-precio">
          <strong>Precio:</strong> {getMonedaSimbolo(prod.moneda)} {prod.precio}
        </p>
        <p className="producto-stock">Stock: {prod.stock}</p>
      </div>

      <div className="producto-actions">
        <Link
          to={`/productos/${prod._id}`}
          state={{ producto }}
          style={{ width: "100%" }}
        >
          <button className="btn-primary" style={{ width: "100%" }}>
            Ver
          </button>
        </Link>
      </div>
    </div>
  );
}
