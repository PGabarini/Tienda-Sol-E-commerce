import { Link } from "react-router-dom";
import "../../styles/tarjetaProducto.css";
import { BASE_API_URL } from "../../config/api";
export default function TarjetaProducto({ producto, cargando = false }) {
  if (!producto || cargando) {
    return <div className="contenedor-vacio"></div>;
  }

  const imagenUrl = producto?.fotos?.[0]
    ? `${BASE_API_URL}${producto.fotos[0]}`
    : `${BASE_API_URL}/uploads/defaultProduct.jpg`;

  return (
    <div className="contenedor-tarjetaProd" key={producto.id}>
      <Link
        to={`/productos/${producto.titulo}`}
        className="boton-verProd-tarjetaProd"
        state={{ producto }}
      >
        <nav className="nav-tarjetaProd">
          <div className="contenedor-imagen">
            <img
              className="imagen-tarjetaProd"
              src={imagenUrl}
              alt="Imagen del producto a comprar"
            />
          </div>
          <h1 className="titulo-tarjetaProd">{producto.titulo}</h1>
          <h3 className="descripcion-tarjetaProd">{producto.descripcion}</h3>
          <div className="precio-ver-contenedor">
            <h3 className="precio-tarjetaProd">{producto.precio} $</h3>
            <button type="button" className="boton-ver">
              Ver
            </button>
          </div>
        </nav>
      </Link>
    </div>
  );
}
