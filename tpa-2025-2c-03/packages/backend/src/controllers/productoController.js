import ProductoService from "../services/productoService.js";
import ProductoInputDTO from "../models/dtos/input/productoInputDTO.js";
import z from "zod";
import { sessionHandler } from "../app/sessionHandler.js";
import { ProductoQuery } from "./queryParser.js";
import jwt from "jsonwebtoken";
import { ObjectId } from "./paramParser.js";
export default class ProductoController {
  static async crearProducto(req, res) {
    try {
      
            const authHeader = req.headers.authorization;
      if (!authHeader)
        return res.status(401).json({ error: "Token no proporcionado" });

      const token = authHeader.split(" ")[1];
      const decoded = jwt.decode(token);

      const mongoId =
        decoded?.mongoId ||
        decoded?.attributes?.mongoId?.[0] ||
        decoded?.attributes?.mongoId;

      if (!mongoId)
        return res.status(400).json({ error: "El token no contiene mongoId" });

      const fotos = req.files?.map(file => `/fotosProductos/${file.filename}`) || [];

      const inputDTO = ProductoInputDTO.parse({
        ...req.body,
        fotos,
      });

      const producto = await ProductoService.crearProducto(inputDTO, mongoId);

      res.status(201).json({ producto });
    } catch (err) {
      console.error("Error al crear producto:", err.message);
      res.status(500).json({ error: err.message });
    }
  }

  static async obtenerProductosBuscados(req, res) {
    try {

      const textoDeBusqueda = z.string().parse(req.query.busqueda)
      const productos = await ProductoService.obtenerProductosBuscados(textoDeBusqueda)
      res.status(200).json(productos)

    } catch (err) {
      res.status(500).json({ error: err.message })
    }


  }

  static async obtenerProductosRandom(req, res) {
    try {
      const productosRandom = await ProductoService.obtenerProductosRandom();
      res.status(200).json(productosRandom);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async obtenerProductoPorId(req, res) {
  try {
    const { id } = req.params;
    const producto = await ProductoService.obtenerProductoPorId(id);

    return res.status(200).json(producto);
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }
}

}
