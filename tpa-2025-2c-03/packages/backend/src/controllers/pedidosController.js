import { PedidoService } from "../services/pedidoService.js";
import PedidoInputDTO from "../models/dtos/input/pedidoInputDTO.js";
import { NotificacionService } from "../services/notificacionService.js";
import { ObjectId } from "./paramParser.js";
import { sessionHandler } from "../app/sessionHandler.js";
import jwt from "jsonwebtoken";

export class PedidoController {
  static async crearPedido(req, res) {
    const inputDTO = PedidoInputDTO.parse(req.body);
    const pedidoPersistido = await PedidoService.crearPedido(inputDTO);

    await NotificacionService.crearNotificacion(pedidoPersistido._id);

    res.status(201).json(pedidoPersistido);
  }

  static async marcarComoEnviado(req, res) {
    const id = ObjectId.parse(req.params.id);

    await PedidoService.marcarComoEnviado(id);

    await NotificacionService.crearNotificacion(id);

    res.status(203).send();
  }

  static async obtenerTodos(req, res) {
    console.log("pedidos")
    const pedidos = await PedidoService.obtenerTodos();

    res.status(200).json(pedidos);
  }

  static async cancelarPedido(req, res) {
    const id = ObjectId.parse(req.params.id);
    await PedidoService.cancelarPedido(id);
    await NotificacionService.crearNotificacion(id);

    res.status(203).send()
  }

  static async obtenerPedido(req, res) {
    try {
      const id = req.params.id;
      const pedido = await PedidoService.obtenerPorId(id);
      res.status(200).json(pedido);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async PedidosDeVendedor(req, res) {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader)
        return res.status(401).json({ error: "Token no proporcionado" });

      const token = authHeader.split(" ")[1];
      const decoded = jwt.decode(token);
      const mongoId = decoded?.mongoId || decoded?.attributes?.mongoId?.[0] || decoded?.attributes?.mongoId;

      if (!mongoId)
        return res.status(400).json({ error: "El token no contiene mongoId" });

      const pedidos = await PedidoService.obtenerPedidosDeVendedor(mongoId);

      res.status(200).json(pedidos);
    } catch (err) {
      console.error("Error al obtener historial de pedidos:", err.message);
      res.status(500).json({ error: err.message });
    }
  }



}
