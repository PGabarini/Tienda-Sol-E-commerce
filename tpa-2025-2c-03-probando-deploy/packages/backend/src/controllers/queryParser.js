import z from "zod";

export const ProductoQuery = z.object({
  nombre: z.string().optional(),
  categoria: z.string().optional(),
  descripcion: z.string().optional(),
  precioDesde: z
    .string()
    .transform(val => Number(val))
    .refine(val => !isNaN(val) && val >= 0)
    .optional(),
  precioHasta: z
    .string()
    .transform(val => Number(val))
    .refine(val => !isNaN(val) && val >= 0)
    .optional(),
  pagina: z
    .string()
    .transform(val => Number(val))
    .refine(val => !isNaN(val) && val > 0)
    .optional(),
  limite: z
    .string()
    .transform(val => Number(val))
    .refine(val => !isNaN(val) && val > 0 && val <= 100)
    .optional(),
  orden: z
    .enum(["masVendidos", "precioAsc", "precioDes"])
    .optional(),
});