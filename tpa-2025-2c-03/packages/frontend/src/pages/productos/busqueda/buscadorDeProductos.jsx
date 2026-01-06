import { useState, useEffect, useCallback, useRef } from "react";
import "../../../styles/buscadorDeProductos.css";
import TarjetaProducto from "../../../components/productos/tarjetaProducto.jsx";
import { useSearchParams } from "react-router-dom";
import { obtenerProductosBuscados } from "../../../service/productosService.js";
import { ProductoCard } from "../../misProductos.jsx";
import "../../../styles/misProductos.css";

export default function BuscadorDeProductos() {

  const [searchParams] = useSearchParams();
  const textoBusqueda = searchParams.get("busqueda");

  const [productos, setProductos] = useState([]);
  const [cantPaginas, setPaginas] = useState(1);
  const [numeroDePagina, setNumeroDePagina] = useState(1);
  const [productosAMostrar, setProductosAMostrar] = useState([]);
  const [productosAFiltrar, setProductosAFiltrar] = useState([]);
  const [cargando, setCargando] = useState(true);

  const [filtros, setFiltros] = useState({
      categoria: "",
      descripcion: "",
      maximo: "",
      minimo: "",
    });

  const [categoriasUnicas,setCategoriasUnicas] = useState([]);

  const refContenedorProductos = useRef(null) // usamos esta ref para medir el ancho donde van los productos
 
  const [anchoPaginaProductos, setAnchoPaginaProductos] = useState(0)

  const obtenerCantidadProductosXPagina = useCallback(() => {

    const anchoTarj = 305.382 + parseFloat(getComputedStyle(document.documentElement).fontSize) //px aprox de tarjeta + gap parseado de string (rem) a float
  
    const tarjetasPorFila = Math.floor(anchoPaginaProductos / anchoTarj); // La parte decimal incluye cualquier cosa que “coma espacio”: gap, bordes, márgenes
    const filasPorPagina = 3 // para no estirar mucho la pagina lo dejamos en 3 filas

    return tarjetasPorFila * filasPorPagina;
  },[anchoPaginaProductos])

  const obtenerProductosAMostrar = useCallback(() => {
    if(cargando) return

    const cantidadProductosXPagina = obtenerCantidadProductosXPagina()

    const indiceInferior = (numeroDePagina - 1) * cantidadProductosXPagina;
    const cantProductos = productos.length;
    let indiceSuperior = indiceInferior + cantidadProductosXPagina;

    if (indiceSuperior > cantProductos) {
      indiceSuperior = cantProductos;
    }

    setProductosAMostrar(productos.slice(indiceInferior, indiceSuperior));
  }, [productos, numeroDePagina, anchoPaginaProductos]);

  const aumentarPagina = () => setNumeroDePagina(numeroDePagina + 1);
  const disminuirPagina = () => setNumeroDePagina(numeroDePagina - 1);

  useEffect(() => {
    setAnchoPaginaProductos(refContenedorProductos.current.clientWidth)
    obtenerProductosAMostrar();
    window.scrollTo(0, 0);
  }, [obtenerProductosAMostrar]);

  useEffect(() => {
    obtenerCantPaginas(productos.length);
  }, [productos]);

  const obtenerCantPaginas = (cantProductos) => {
    const cant = Math.ceil(cantProductos / 9);
    setPaginas(cant >= 1 ? cant : 1);
  };

  const obtenerProductos = async () => {
    setCargando(true);
    const productosEncontrados = await obtenerProductosBuscados(textoBusqueda);
    setProductos(productosEncontrados);
    setProductosAFiltrar(productosEncontrados);
    setNumeroDePagina(1); 
    setCargando(false);
    setCategoriasUnicas([...new Set(productosEncontrados.flatMap(prod => prod.categorias))]);
  };


  const getMonedaSimbolo = (moneda) => {
    switch (moneda) {
      case "PESO_ARG": return "$";
      case "DOLAR_USA": return "USD";
      case "REAL": return "R$";
      default: return "";
    }
  };

  useEffect(() => {
    obtenerProductos();
    window.scrollTo(0, 0);
  }, [textoBusqueda]);   // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
  aplicarFiltros(filtros);
  }, [filtros]);  // eslint-disable-line react-hooks/exhaustive-deps

  const aplicarFiltros = (filtros) => {
    const { categoria = "", descripcion = "", maximo = Infinity, minimo = 0 } = filtros;
    const max = maximo ? Number(maximo) : Infinity;
    const min = minimo ? Number(minimo) : 0;

    const prodFiltrados = productosAFiltrar.filter(
      (prod) =>
        prod.precio <= max &&
        prod.precio >= min &&
        (categoria === "" || prod.categorias.some((cat) => cat === categoria)) &&
        (descripcion === "" || prod.descripcion.toLowerCase().includes(descripcion.toLowerCase()))
    );

    setProductos(prodFiltrados);
    setNumeroDePagina(1);
  };

  return (
    <div className="contenedor-principal">
      <div className="contenedor-filtros">
        <h1 className="titulo-filtros">Filtros</h1>
        <form
          className="form-filtros"
        >
          <div className="contenedor-filtro-categoria">
            <label htmlFor="input-categoria">Categoría</label>
            <select name="categoria" className="input-categoria filtrado" defaultValue=""
             onChange={(e) => setFiltros({ ...filtros, categoria: e.target.value })}
             value={filtros.categoria}>

              <option value="" disabled>Seleccioná una categoría</option>
              {categoriasUnicas.map((categoria, i) => (
                <option key={i} value={categoria}>
                  {categoria}
                </option>
              ))}

            </select>
          </div>

          <div className="contenedor-filtro-descripcion">
            <label htmlFor="input-descripcion">Descripción</label>
            <input
              name="descripcion"
              className="input-descripcion filtrado"
              type="text"
              placeholder="Describí el producto"
              value={filtros.descripcion}
              onChange={(e) => setFiltros({ ...filtros, descripcion: e.target.value })}
            />
          </div>

          <div className="contenedor-filtro-precio">
            <div className="grupo-precio">
              <label htmlFor="input-precio-minimo">Precio mínimo</label>
              <input
                name="minimo"
                placeholder="Mínimo"
                className="input-precio-minimo filtrado"
                type="number"
                value={filtros.minimo}
                onChange={(e) => setFiltros({ ...filtros, minimo: e.target.value })}
              />
            </div>
            <div className="grupo-precio">
              <label htmlFor="input-precio-maximo">Precio máximo</label>
              <input
                name="maximo"
                placeholder="Máximo"
                className="input-precio-maximo filtrado"
                type="number"
                value={filtros.maximo}
                onChange={(e) => setFiltros({ ...filtros, maximo: e.target.value })}
              />
            </div>
          </div>
            <button type="reset" className="boton filtrar"
            onClick={() => setFiltros({ categoria: "", descripcion: "", maximo: "", minimo: "" })}>Limpiar Filtros</button>
        </form>
      </div>

      <div className="contenedor-productos-paginas">
        <div ref={refContenedorProductos} className="contenedor-productos">
          {cargando ? (
            Array.from({ length: 9 }).map((_, index) => (
              <TarjetaProducto key={index} producto={null} cargando={true} />
            ))
          ) : productosAMostrar.length === 0 ? (
            <div className="mensaje-sin-productos">
              No se encontraron productos que cumplan las características
            </div>
          ) : (
            productosAMostrar.map((prod) => (
                        <ProductoCard key={prod._id} prod={prod} getMonedaSimbolo={getMonedaSimbolo} vendedor={false}/>
            ))
          )}
        </div>

        {!cargando && productosAMostrar.length > 0 && (
          <div className="contenedor-paginas">
            <button
              type="button"
              className={numeroDePagina === 1 ? "paginas-izquierda oculto" : "paginas-izquierda"}
              onClick={disminuirPagina}
            >
              Anterior
            </button>
            <h1>Página {numeroDePagina} de {cantPaginas}</h1>
            <button
              type="button"
              className={numeroDePagina === cantPaginas ? "paginas-derecha oculto" : "paginas-derecha"}
              onClick={aumentarPagina}
            >
              Siguiente
            </button>
          </div>
        )}
      </div>
    </div>
  );
}