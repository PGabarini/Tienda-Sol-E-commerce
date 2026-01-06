import z from "zod"

const DireccionEntregaInputDto = z.object({
    calle: z.string().max(200),
    altura: z.string().max(10),
    piso: z.string().max(10),
    departamento: z.string().max(10),
    ciudad: z.string().max(50),
    codPostal: z.string().max(50),
    provincia: z.string().max(50),
    pais: z.string().max(50),
})

export default DireccionEntregaInputDto