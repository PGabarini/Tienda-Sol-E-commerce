import { useEffect, useState } from "react";
import "../../styles/landing.css";
import TarjetaProducto from "../../components/productos/tarjetaProducto.jsx";
import { HeroSection } from "../../components/landing/heroSection.jsx";
import { Link } from "react-router-dom";
import { ProductoCard } from "../misProductos.jsx";
import axios from "axios";
import { BASE_API_URL } from "../../config/api.js";


function Landing() {
  const [productos, setProductos] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const visibles = 4;

  const obtenerProductos = async () => {
    try {
      const response = await axios.get(`${BASE_API_URL}/productosLanding`);
      setProductos(response.data);
    } catch (error) {
      console.error("Error obteniendo productos:", error);
    }
  };

  useEffect(() => {
    obtenerProductos();
  }, []);

  const siguiente = () => {
    if (startIndex + visibles < productos.length)
      setStartIndex(startIndex + 1);
  };

  const anterior = () => {
    if (startIndex > 0) setStartIndex(startIndex - 1);
  };

  const productosVisibles = productos.slice(startIndex, startIndex + visibles);

  const getMonedaSimbolo = (moneda) => {
    switch (moneda) {
      case "PESO_ARG": return "$";
      case "DOLAR_USA": return "USD";
      case "REAL": return "R$";
      default: return "";
    }
  };

  return (
    <>
      <HeroSection />

      {/* Productos recomendados */}
      <section className="products">
        <div className="contenedor-productos-recomendados">
          <h2 className="section-title">Productos recomendados</h2>

          <div className="productos-navegables">
            <button
              className="flecha flecha-izquierda"
              onClick={anterior}
              disabled={startIndex === 0}
            >
              ❮
            </button>

            <div className="productos-recomendados-contenedor">
              {productosVisibles.map((prod) => (
                <ProductoCard
                  key={prod._id}
                  prod={prod}
                  getMonedaSimbolo={getMonedaSimbolo}
                  vendedor={false}
                />
              ))}
            </div>

            <button
              className="flecha flecha-derecha"
              onClick={siguiente}
              disabled={startIndex + visibles >= productos.length}
            >
              ❯
            </button>
          </div>
        </div>
      </section>
    </>
  );
}

export default Landing;
export { Landing as Component };
