import mongoose from "mongoose";

const ProductoSchema = new mongoose.Schema({
  vendedor: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario", required: true },
  titulo: { type: String, required: true },
  descripcion: { type: String, required: true },
  categorias: [{ type: String }],
  precio: { type: Number, required: true },
  moneda: { type: String, enum: ["PESO_ARG", "DOLAR_USA", "REAL"], required: true },
  stock: { type: Number, required: true },
  cantidadVendida: { type: Number, required: true },
  fotos: [{ type: String }],
  activo: { type: Boolean, default: true }
}, { timestamps: true });

ProductoSchema.index({titulo:"text",descripcion:"text"})

ProductoSchema.methods.estaDisponible = function(cantidad) {
  return this.stock >= cantidad;
};

export default mongoose.model("Producto", ProductoSchema);