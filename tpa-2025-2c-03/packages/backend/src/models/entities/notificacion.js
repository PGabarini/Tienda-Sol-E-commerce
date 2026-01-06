import {EstadoPedido} from "../repositories/mongoSchemas/pedidoSchema.js";


export class Notificacion {
  constructor(usuarioDestino, mensaje, fechaAlta, leida = false, fechaLeida = null) {
    this.usuarioDestino = usuarioDestino;
    this.mensaje = mensaje;
    this.fechaAlta = fechaAlta;
    this.leida = leida;
    this.fechaLeida = fechaLeida;
  }
}

export class FactoryNotificacion {

    constructor(){}

    static crearMensajeYDestinatarioSegunEstadoPedido(pedido) {
      const estado = pedido.estado;
      const vendedor = pedido.vendedor;

      switch (estado) {
          case EstadoPedido.Pendiente: {
              const productosPendiente = pedido.items
                  .map(i => `${i.cantidad} x ${i.producto.titulo}`)
                  .join(", ");
              return {
                  destinatario: vendedor,
                  mensaje: `Nuevo pedido de ${pedido.comprador.nombre}.
         Productos: ${productosPendiente}.
         Total: ${pedido.total} ${pedido.moneda}.
         Dirección de entrega: ${pedido.direccionEntrega.calle} ${pedido.direccionEntrega.altura}, ${pedido.direccionEntrega.ciudad}`
              };
          }

          case EstadoPedido.Confirmado: {
              return {
                  destinatario: pedido.comprador,
                  mensaje: `Tu pedido #${pedido.id} ha sido confirmado.`
              };
          }
          case EstadoPedido.EnPreparacion: {
              return {
                  destinatario: pedido.comprador,
                  mensaje: `Tu pedido #${pedido.id} está en preparación.`
              };
          }
          case EstadoPedido.Enviado: {
              return {
                  destinatario: pedido.comprador,
                  mensaje: `El pedido #${pedido.id} fue enviado por ${vendedor.nombre}.`
              };
          }
          case EstadoPedido.Entregado: {
              return {
                  destinatario: pedido.comprador,
                  mensaje: `Tu pedido #${pedido.id} fue entregado.`
              };
          }
          case EstadoPedido.Cancelado: {
              return {
                  destinatario: vendedor,
                  mensaje: `El pedido de ${pedido.comprador.nombre} fue cancelado.`
              };
          }
          default: {
              return {
                  destinatario: pedido.comprador,
                  mensaje: `El pedido #${pedido.id} cambió de estado a ${estado}.`
              };
          }
        }
    }

    static crearSegunPedido(pedido) {
    const mensaje_y_destinatario = this.crearMensajeYDestinatarioSegunEstadoPedido(pedido);

    return new Notificacion(
      mensaje_y_destinatario.destinatario,
      mensaje_y_destinatario.mensaje,
      new Date(Date.now())
    );
  }
}


