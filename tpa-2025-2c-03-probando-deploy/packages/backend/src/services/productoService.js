
import Producto from "../models/repositories/producto/productoSchema.js";

export default class ProductoService {

  static async crearProducto(inputDTO, mongoId) {
    try {
      const {
        titulo,
        descripcion,
        categorias = [],
        precio,
        moneda,
        stock,
        fotos = [],
      } = inputDTO;

      if (isNaN(precio) || isNaN(stock)) {
        throw new Error("Precio y stock deben ser valores numéricos válidos");
      }

      if (!mongoId) {
        throw new Error("No se encontró el ID del vendedor (mongoId)");
      }

      const nuevoProducto = new Producto({
        vendedor: mongoId,
        titulo,
        descripcion,
        categorias: Array.isArray(categorias) ? categorias : [categorias],
        precio: Number(precio),
        moneda,
        stock: Number(stock),
        cantidadVendida: 0, 
        fotos,
        activo: true,
      });

      const productoGuardado = await nuevoProducto.save();
      return productoGuardado;

    } catch (error) {
      console.error("Error al crear producto:", error);
      throw error; 
    }
  }

  static async obtenerProductosBuscados(textoDeBusqueda) {

    const busqueda = { $text: { $search: textoDeBusqueda } }

    const productos = Producto.find(busqueda);
    return productos;
  }
  
  static async obtenerProductosRandom() {
    try {
      const productos = await Producto.aggregate([
        { $sample: { size: 10 } }
      ]);

      return productos;
    } catch (error) {
      throw new Error("Error al obtener productos aleatorios: " + error.message);
    }
  }

  static async obtenerProductoPorId(productoId) {
  try {
    const producto = await Producto.findById(productoId);

    if (!producto) {
      throw new Error("Producto no encontrado");
    }

    return producto;
  } catch (error) {
    throw new Error("Error al obtener producto: " + error.message);
  }
}


}