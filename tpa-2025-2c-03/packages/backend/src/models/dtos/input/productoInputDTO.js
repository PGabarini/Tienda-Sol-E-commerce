import z from "zod";

const ProductoInputDTO = z.object({
  titulo: z.string().max(70),
  descripcion: z.string().max(2000),

  categorias: z.preprocess(
    (val) => {
      if (typeof val === "string") return [val];
      if (!val) return [];
      return val;
    },
    z.array(z.string().max(100))
  ),

  // Convierte strings a número
  precio: z.preprocess(
    (val) => Number(val),
    z.number().nonnegative()
  ),

  moneda: z.enum(["PESO_ARG", "DOLAR_USA", "REAL"]),

  stock: z.preprocess(
    (val) => Number(val),
    z.number().nonnegative()
  ),

  // Si llega como string (una sola foto), la convierte a array
  fotos: z.preprocess(
    (val) => {
      if (typeof val === "string") return [val];
      if (!val) return [];
      return val;
    },
    z.array(z.string().max(100))
  )
});

export default ProductoInputDTO;
