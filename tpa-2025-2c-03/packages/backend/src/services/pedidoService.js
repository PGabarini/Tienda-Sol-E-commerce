import Pedido, { EstadoPedido } from "../models/repositories/mongoSchemas/pedidoSchema.js";
import Producto from "../models/repositories/producto/productoSchema.js";
import {
  CambioDeEstadoInvalidoError,
  NoEncontradoError,
  StockInsuficienteError
} from "../exceptions/exceptions.js";

export class PedidoService {
  static async crearPedido(inputDTO) {
  // Buscamos los productos y actualizamos stock
  const productos = await Promise.all(
    inputDTO.items.map(async (item) => {
      const producto = await Producto.findById(item.productoId);
      if (!producto) throw new NoEncontradoError(`Producto ${item.productoId} no existe`);
      if (!producto.estaDisponible(item.cantidad))
        throw new StockInsuficienteError(producto.titulo);

      // Actualizamos stock y cantidad vendida
      producto.stock -= item.cantidad;
      producto.cantidadVendida += item.cantidad;
      await producto.save();

      item.producto = item.productoId;
      item.precioUnitario = producto.precio;

      return producto;
    })
  );

  // ✅ Asumimos que todos los productos son del mismo vendedor
  const vendedor = productos[0].vendedor;

  inputDTO.comprador = inputDTO.compradorId;
  inputDTO.vendedor = vendedor; // 👈 Agregamos esto
  inputDTO.total = inputDTO.items
    .map((item) => item.cantidad * item.precioUnitario)
    .reduce((a, b) => a + b, 0);

  const pedidoPersistencia = new Pedido(inputDTO);
  return await pedidoPersistencia.save();
}

  static async obtenerTodos() {
    return Pedido.find()
      .populate("comprador", "nombre email tipo")
      .populate("items.producto", "titulo precio stock")
      .sort({ fechaCreacion: -1 });
  }

  static async obtenerPorId(pedidoId) {
    const pedidoPersistencia = await Pedido.findById(pedidoId)
      .populate("comprador", "nombre email tipo")
      .populate("items.producto", "titulo precio stock");

    return pedidoPersistencia;
  }

  static async marcarComoEnviado(pedidoId) {
    const pedidoPersistencia = await Pedido.findById(pedidoId)
      .populate({
        path: 'items.producto',
        populate: { path: 'vendedor' }
      })
      .exec();

    if (!pedidoPersistencia) {
      throw new NoEncontradoError(`Pedido ${pedidoId} no encontrado.`);
    }
    const primerItem = pedidoPersistencia.items[0];

    if (primerItem.producto.vendedor === null) {
      throw new Error("El item no tiene vendedor asignado, estado inconsistente");
    }

    const vendedorId = primerItem.producto.vendedor;

    pedidoPersistencia.estado = EstadoPedido.Enviado;

    pedidoPersistencia.historialEstados.push({
      estado: EstadoPedido.Enviado,
      usuario: vendedorId,
      fecha: new Date(),
      motivo: "Pedido marcado como enviado por el vendedor"
    });

    await pedidoPersistencia.save();
  }

  static async cancelarPedido(pedidoId) {
    const pedidoPersistencia = await Pedido.findById(pedidoId);
    if (!pedidoPersistencia) {
      throw new NoEncontradoError(`Pedido ${pedidoId} no encontrado.`);
    }
    if (pedidoPersistencia.estado === EstadoPedido.Enviado) {
      throw new CambioDeEstadoInvalidoError(`El pedido ${pedidoId} ya fue enviado`);
    }
    if (pedidoPersistencia.estado === EstadoPedido.Cancelado) {
      throw new CambioDeEstadoInvalidoError(`El pedido ${pedidoId} ya fue cancelado`);
    }

    for (const item of pedidoPersistencia.items) {
      const producto = await Producto.findById(item.producto._id);
      if (producto) {
        producto.stock += item.cantidad;
        producto.cantidadVendidos -= item.cantidad;
        if (producto.cantidadVendidos < 0) producto.cantidadVendidos = 0;
        await producto.save();
      }
    }

    pedidoPersistencia.estado = EstadoPedido.Cancelado;
    pedidoPersistencia.historialEstados.push({
      estado: EstadoPedido.Cancelado,
      usuario: pedidoPersistencia.comprador,
      fecha: new Date(),
      motivo: "Pedido cancelado por el comprador"
    });

    await pedidoPersistencia.save();
  }

 static async obtenerPedidosDeVendedor(vendedorId) {
  try {
    return await Pedido.find({ vendedor: vendedorId })
      .populate("comprador", "nombre email tipo") 
      .populate("items.producto", "titulo precio");
  } catch (error) {
    console.error("Error al obtener pedidos del vendedor:", error);
    throw error;
  }
}

}


