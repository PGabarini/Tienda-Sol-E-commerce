const ordenMasVendidos = { $sort: { "cantidadVendida": -1 } }
const ordenPrecioAsc = { $sort: { precio: 1 } }
const ordenPrecioDes = { $sort: { precio: -1 } }

export default function crearOrdenProductos(filtro) {
  switch (filtro.orden) {
    case "masVendidos": return ordenMasVendidos
    case "precioAsc": return ordenPrecioAsc
    case "precioDes": return ordenPrecioDes
    default: return  null
  }
}