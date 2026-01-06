import { ObjectId } from "./paramParser.js";
import UsuarioService from "../services/usuarioService.js";
import UsuarioInputDTO from "../models/dtos/input/usuarioIntpuDTO.js";
import { ProductoQuery } from "./queryParser.js"
import axios from "axios";
import { sessionHandler } from "../app/sessionHandler.js";

import jwt from "jsonwebtoken";

export default class UsuarioController {

  static async crearUsuario(req, res) {
    try {
      const inputDTO = UsuarioInputDTO.parse(req.body);
      const usuarioCreado = await UsuarioService.crearUsuario(inputDTO);
      res.status(201).json(usuarioCreado);
    }
    catch (err) {
      res.status(400).json({ error: err.response?.data?.error || err.message });
    }
  }

  static async iniciarSesion(req, res) {
    try {
      const { username, password } = req.body;

      const params = new URLSearchParams();
      params.append("grant_type", "password");
      params.append("client_id", process.env.KEYCLOAK_CLIENT_ID);
      params.append("client_secret", process.env.KEYCLOAK_CLIENT_SECRET);
      params.append("username", username);
      params.append("password", password);

      const response = await axios.post(
        `${process.env.KEYCLOAK_URL}/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/token`,
        params,
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      );

      res.json(response.data);
    } catch (err) {
      res.status(err.response?.status || 500).json({
        error: err.response?.data?.error_description || err.message
      });
    }
  }

  static async obtenerHistorialPedidos(req, res) {
    try {
      
            const authHeader = req.headers.authorization;

      if (!authHeader)
        return res.status(401).json({ error: "Token no proporcionado" });

      const token = authHeader.split(" ")[1];
      const decoded = jwt.decode(token);
      const mongoId = decoded?.mongoId || decoded?.attributes?.mongoId?.[0] || decoded?.attributes?.mongoId;

      if (!mongoId)
        return res.status(400).json({ error: "El token no contiene mongoId" });

      const pedidos = await UsuarioService.obtenerHistorialPedidos(mongoId);

      res.status(200).json(pedidos);
    } catch (err) {
      console.error("Error al obtener historial de pedidos:", err.message);
      res.status(500).json({ error: err.message });
    }
  }

  static async listarProductos(req, res) {
    const id = ObjectId.parse(req.params.id);
    const filtros = ProductoQuery.safeParse(req.query).data
    const productos = await UsuarioService.filtrarProductosDeVendedor(id, filtros)

    res.status(200).json(productos);
  }

  static async actualizarFotoPerfil(req, res) {
    try {
            const authHeader = req.headers.authorization;

      if (!authHeader)
        return res.status(401).json({ error: "Token no proporcionado" });

      const token = authHeader.split(" ")[1];
      const decoded = jwt.decode(token);
      const mongoId = decoded?.mongoId || decoded?.attributes?.mongoId?.[0] || decoded?.attributes?.mongoId;

      if (!mongoId)
        return res.status(400).json({ error: "El token no contiene mongoId" });

      const { fotoUrl } = req.body;
      if (!fotoUrl)
        return res.status(400).json({ error: "Debe incluir una URL de imagen" });

      const usuarioActualizado = await UsuarioService.actualizarFotoPerfilPorMongoId(
        mongoId,
        fotoUrl
      );

      if (!usuarioActualizado)
        return res.status(404).json({ error: "Usuario no encontrado" });

      res.status(200).json({
        message: "Foto de perfil actualizada correctamente",
        usuario: usuarioActualizado,
      });
    } catch (err) {
      console.error("Error al actualizar foto de perfil:", err.message);
      res.status(500).json({ error: err.message });
    }
  }

  static async obtenerUsuario(req, res) {
    try {

      const authHeader = req.headers.authorization;

      

      if (!authHeader)
        return res.status(401).json({ error: "Token no proporcionado" });

      const token = authHeader.split(" ")[1];
      const decoded = jwt.decode(token);
      const mongoId = decoded?.mongoId || decoded?.attributes?.mongoId?.[0] || decoded?.attributes?.mongoId;

      
      //const mongoId = sessionHandler(req, res);


      if (!mongoId)
        return res.status(400).json({ error: "El token no contiene mongoId" });

      const usuario = await UsuarioService.obtenerUsuarioDeMongo(mongoId);

      if (!usuario)
        return res.status(404).json({ error: "Usuario no encontrado" });

      res.status(200).json(usuario);
    } catch (err) {
      console.error("Error al obtener usuario:", err.message);
      res.status(500).json({ error: err.message });
    }
  }

  static async obtenerProductos(req, res) {
    try {
      
            const authHeader = req.headers.authorization;
      if (!authHeader)
        return res.status(401).json({ error: "Token no proporcionado" });

      const token = authHeader.split(" ")[1];
      const decoded = jwt.decode(token);
      const vendedorID = decoded?.mongoId || decoded?.attributes?.mongoId?.[0] || decoded?.attributes?.mongoId;

      if (!vendedorID)
        return res.status(400).json({ error: "El token no contiene mongoId" });

      const pagina = parseInt(req.query.pagina) || 1;  // capaz podemos usar el paginador q ya hay pero ni idea @tade 
      const limite = parseInt(req.query.limite) || 20;  // capaz podemos usar el paginador q ya hay pero ni idea @tade 

      const productos = await UsuarioService.listarProductosDelVendedor(vendedorID, pagina, limite);

      res.status(200).json(productos);

    } catch (err) {
      console.error("Error al obtener productos del vendedor:", err.message);
      res.status(500).json({ error: err.message });
    }
  }

  static async cambiarTipoUsuarioAVendedor(req, res) {
    try {
      const authHeader = req.headers.authorization; 
      if (!authHeader)
        return res.status(401).json({ error: "Token no proporcionado" });
      const token = authHeader.split(" ")[1];
      const decoded = jwt.decode(token);
      const mongoId = decoded?.mongoId || decoded?.attributes?.mongoId?.[0] || decoded?.attributes?.mongoId;
      if (!mongoId)
        return res.status(400).json({ error: "El token no contiene mongoId" });

      const usuarioActualizado = await UsuarioService.cambiarTipoUsuarioAVendedor(mongoId);
      res.status(200).json({
        message: "Tipo de usuario cambiado a vendedor correctamente",
        usuario: usuarioActualizado,
      });
    } catch (err) {
      console.error("Error al cambiar tipo de usuario a vendedor:", err.message);
      res.status(500).json({ error: err.message });
    }
  }
}
