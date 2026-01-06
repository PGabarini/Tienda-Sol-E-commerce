import z from "zod"
import ItemPedidoInputDTO from "./itemPedidoInputDTO.js"
import DireccionEntregaInputDto from "./direccionEntregaInputDto.js"
import { ObjectId } from "../../../controllers/paramParser.js"

const PedidoInputDTO = z.object( {
    compradorId: z.refine((valor) => ObjectId.parse(valor)),
    items: z.array(ItemPedidoInputDTO),
    moneda: z.enum(["PESO_ARG","DOLAR_USA","REAL"]),
    direccionEntrega : DireccionEntregaInputDto
})

export default PedidoInputDTO
