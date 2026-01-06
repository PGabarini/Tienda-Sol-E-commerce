import { NotificacionService } from "../services/notificacionService.js";
import { EstadoBooleano, ObjectId } from "./paramParser.js";
import NotificacionOutputDto from "../models/dtos/output/notificacionOutputDto.js"
import { sessionHandler } from "../app/sessionHandler.js";
import jwt from "jsonwebtoken";
export class NotificacionController {

  static async obtenerPorPeticion(req, res) {
    try {
      
      const authHeader = req.headers.authorization;
      if (!authHeader)
        return res.status(401).json({ error: "Token no proporcionado" });

      const token = authHeader.split(" ")[1];
      const decoded = jwt.decode(token);
      const mongoId = decoded?.mongoId || decoded?.attributes?.mongoId?.[0] || decoded?.attributes?.mongoId;

      if (!mongoId)
        return res.status(400).json({ error: "El token no contiene mongoId" });

      const estado = EstadoBooleano.parse(req.params.estado);
      const notificaciones = await NotificacionService.obtenerPorPeticion(mongoId, estado);
      const notificacionesDTO = notificaciones.map((n) => new NotificacionOutputDto(n));

      res.status(200).json(notificacionesDTO);
    } catch (err) {
      console.error("Error al obtener notificaciones:", err.message);
      res.status(500).json({ error: err.message });
    }
  }

  static async marcarLeida(req, res) {
    const id = ObjectId.parse(req.params.id);
    const ahora = new Date(Date.now());
    await NotificacionService.marcarComoLeida(id, ahora);
    res.status(200).json({ mensaje: "Notificación marcada como leída", fechaLeida: ahora });
  }

  static async marcarNoLeida(req, res) {
    const id = ObjectId.parse(req.params.id);
    await NotificacionService.marcarComoNoLeida(id);
    res.status(200).json({ mensaje: "Notificación marcada como no leída"});
  }
}