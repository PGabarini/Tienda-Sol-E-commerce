import  ProductoSchema  from "./productoSchema.js"

export default async function consultaProductos  (filtro, orden, paginador) {
  const pipeline = []

  pipeline.push(filtro)

  if (orden) {
    pipeline.push(orden)
  }

  pipeline.push(paginador.offset)
  pipeline.push(paginador.limit)

  return ProductoSchema.aggregate(pipeline);
}