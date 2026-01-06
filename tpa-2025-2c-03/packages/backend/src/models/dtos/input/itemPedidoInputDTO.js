import {z} from "zod"
import { ObjectId } from "../../../controllers/paramParser.js"

const ItemPedidoInputDTO = z.object ({
  productoId : z.refine((valor)=> ObjectId.parse(valor)),
  cantidad : z.number().nonnegative()
})

export default ItemPedidoInputDTO