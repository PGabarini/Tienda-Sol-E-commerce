export class PedidoOutputDTO {
  constructor(pedido) {
    this.id = pedido.id;
    this.compradorId = pedido.comprador.id; 
    this.items = pedido.items.map(item => ({
      productoId: item.producto.id,
      cantidad: item.cantidad,
      subtotal: item.subtotal(),
    }));
    this.total = pedido.total;
    this.moneda = pedido.moneda;
    this.direccionEntrega = pedido.direccionEntrega;
    this.estado = pedido.estado;
    this.fechaCreacion = pedido.fechaCreacion;
  }
}
