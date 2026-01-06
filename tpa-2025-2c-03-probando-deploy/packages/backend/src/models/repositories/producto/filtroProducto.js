import mongoose from "mongoose";

export default function crearFiltrosProductos(filtro) {
  const match = {};

  if (filtro.vendedor) {
    match.vendedor = new mongoose.Types.ObjectId(filtro.vendedor);
  }
  if (filtro.nombre) {
    match.titulo = filtro.nombre;
  }
  if (filtro.categoria) {
    match.categorias = filtro.categoria;
  }
  if (filtro.descripcion) {
    match.descripcion = filtro.descripcion;
  }
  if (filtro.precioDesde || filtro.precioHasta) {
    match.precio = {};
  }
  if (filtro.precioDesde) {
    match.precio.$gte = filtro.precioDesde;
  }
  if (filtro.precioHasta) {
    match.precio.$lte = filtro.precioHasta;
  }
  return { $match: match };
}