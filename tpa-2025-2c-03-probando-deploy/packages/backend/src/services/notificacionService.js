import Notificacion from "../models/repositories/mongoSchemas/notificacionSchema.js";
import Pedido from "../models/repositories/mongoSchemas/pedidoSchema.js";
import Usuario from "../models/repositories/mongoSchemas/usuarioSchema.js";
import { FactoryNotificacion } from "../models/entities/notificacion.js";
import { NoEncontradoError } from "../exceptions/exceptions.js";

export class NotificacionService {
  static async crearNotificacion(idPedido) {

    const pedidoPersistencia = await Pedido.findById(idPedido)
      .populate({
        path: 'items.producto',
        populate: { path: 'vendedor' },
      })
      .populate('comprador')
      .exec()

    if (!pedidoPersistencia) {
      throw new NoEncontradoError(`No se encontró el pedido con ID: ${idPedido}`);
    }

    pedidoPersistencia.vendedor = pedidoPersistencia.items[0].producto.vendedor;
    const nuevaNotificacionDominio = FactoryNotificacion.crearSegunPedido(pedidoPersistencia);

    const notificacionPersistible = new Notificacion(nuevaNotificacionDominio)

    await notificacionPersistible.save();

  }

  static async obtenerPorPeticion(id, leida) {
    const usuarioPersitido = await Usuario.findById(id)

    if (!usuarioPersitido) {
      throw new NoEncontradoError(`No existe el usuario: ${id}`)
    }

    return Notificacion.find({ usuarioDestino: id, fueLeida: leida });
  }

  static async marcarComoLeida(id, fechaLeida) {
    const modificacion = await Notificacion.updateOne(
      { _id: id },
      { $set: { fueLeida: true, fechaLeida: fechaLeida } }
    );

    if (modificacion.matchedCount === 0) {
      throw new NoEncontradoError(`No se encontró la notificación: ${id}`);
    }

    return fechaLeida;
  }

  static async marcarComoNoLeida(id) {
    const modificacion = await Notificacion.updateOne(
      { _id: id },
      { $set: { fueLeida: false } }
    );

    if (modificacion.matchedCount === 0) {
      throw new NoEncontradoError(`No se encontró la notificación: ${id}`);
    }
  }
}