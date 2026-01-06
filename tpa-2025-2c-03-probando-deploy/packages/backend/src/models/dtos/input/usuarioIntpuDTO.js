import z from "zod"

const UsuarioInputDTO = z.object({
  nombre: z.string().min(2).max(100),
  telefono: z.string().min(7).max(15).optional(),
  email: z.string().email("Formato de email invalido"),
  tipo: z.enum(["COMPRADOR", "VENDEDOR", "ADMIN"]),
  password: z.string().min(6),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  fotoUrl: z.string().url().optional(),
});

export default UsuarioInputDTO