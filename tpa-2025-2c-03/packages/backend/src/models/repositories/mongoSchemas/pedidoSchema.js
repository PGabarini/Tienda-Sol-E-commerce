import mongoose from "mongoose";
import ItemPedidoSchema from "./itemPedidoSchema.js";

const PedidoSchema = new mongoose.Schema({
  comprador: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario", required: true },
  vendedor: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario", required: true },
  items: [ItemPedidoSchema],
  items: [ItemPedidoSchema],
  total: { type: Number, required: true },
  moneda: { type: String, enum: ["PESO_ARG", "DOLAR_USA", "REAL"], required: true },
  direccionEntrega: {
    calle: String,
    altura: String,
    piso: String,
    departamento: String,
    ciudad: String,
    codPostal: String,
    provincia: String,
    pais: String,
    lat: Number,
    lon: Number
  },
  estado: { type: String, enum: ["PENDIENTE", "CONFIRMADO", "EN_PREP", "ENVIADO", "ENTREGADO", "CANCELADO"], default: "PENDIENTE" },
  historialEstados: [{
    estado: String,
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario" },
    motivo: String,
    fecha: { type: Date, default: Date.now }
  }],
  fechaCreacion: { type: Date, default: Date.now }
});

export default mongoose.model("Pedido", PedidoSchema);

export const EstadoPedido = Object.freeze(
  {
    Pendiente: "PENDIENTE",
    Confirmado: "CONFIRMADO",
    EnPreparacion: "EN_PREP",
    Enviado: "ENVIADO",
    Entregado: "ENTREGADO",
    Cancelado: "CANCELADO"
  }
)