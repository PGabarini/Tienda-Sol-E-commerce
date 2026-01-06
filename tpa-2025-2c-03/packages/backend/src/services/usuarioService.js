import PedidoModel from "../models/repositories/mongoSchemas/pedidoSchema.js";
import Usuario from "../models/repositories/mongoSchemas/usuarioSchema.js";
import { NoEncontradoError, UsuarioYaCreadoError } from "../exceptions/exceptions.js";
import crearPaginador from "../models/repositories/paginador.js";
import consultaProductos from "../models/repositories/producto/consultaProductos.js";
import crearOrdenProductos from "../models/repositories/producto/ordenProducto.js";
import crearFiltrosProductos from "../models/repositories/producto/filtroProducto.js";
import axios from "axios";
import Producto from "../models/repositories/producto/productoSchema.js";

const KEYCLOAK_BASE_URL = process.env.KEYCLOAK_URL;
const REALM = process.env.KEYCLOAK_REALM;
const CLIENT_ID = process.env.KEYCLOAK_CLIENT_ID;
const CLIENT_SECRET = process.env.KEYCLOAK_CLIENT_SECRET;

async function obtenerAdminToken() {
  const params = new URLSearchParams();
  params.append("grant_type", "client_credentials");
  params.append("client_id", process.env.KEYCLOAK_CLIENT_ID);
  params.append("client_secret", process.env.KEYCLOAK_CLIENT_SECRET);

  try {
    const res = await axios.post(
      `${process.env.KEYCLOAK_URL}/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/token`,
      params,
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    return res.data.access_token;
  } catch (err) {
    console.error("Error al pedir token:", err.response?.data || err.message);
    throw err;
  }
}

export default class UsuarioService {
  static async obtenerHistorialPedidos(usuarioId) {
    const usuario = await Usuario.findById(usuarioId);

    if (!usuario) {
      throw new NoEncontradoError(`Usuario con id ${usuarioId} no encontrado`);
    }

    return PedidoModel.find({ comprador: usuarioId });
  }

  static async crearUsuario(inputDTO) {
    const { nombre, telefono, email, tipo, password, firstName, lastName } = inputDTO;

    if (!nombre || !telefono || !email || !password || !firstName || !lastName) {
      throw new Error("Faltan datos requeridos: nombre, telefono, email, password, firstName o lastName.");
    }

    let usuarioMongo;

    try {
      usuarioMongo = new Usuario(inputDTO);
      await usuarioMongo.save();

      const ADMIN_TOKEN = await obtenerAdminToken();

      const kcUser = {
        username: nombre,
        email,
        enabled: true,
        firstName,
        lastName,
        attributes: {
          phone: telefono,
          tipo,
          mongoId: usuarioMongo._id.toString(),
        },
        credentials: [
          { type: "password", value: password, temporary: false },
        ],
      };

      console.log("Enviando a Keycloak:", kcUser);

      await axios.post(
        `${process.env.KEYCLOAK_URL}/admin/realms/${process.env.KEYCLOAK_REALM}/users`,
        kcUser,
        {
          headers: {
            Authorization: `Bearer ${ADMIN_TOKEN}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Usuario creado en Keycloak y MongoDB");

      return usuarioMongo;

    } catch (err) {
      console.error("Error al crear usuario:", err.response?.data || err.message);

      if (usuarioMongo?._id) {
        try {
          await Usuario.deleteOne({ _id: usuarioMongo._id });
          console.log(" Usuario MongoDB eliminado por fallo en Keycloak");
        } catch (rollbackErr) {
          console.error("Error en rollback MongoDB:", rollbackErr.message);
        }
      }

      if (err.code === 11000) {
        throw new UsuarioYaCreadoError(email);
      }

      if (err.response?.status === 409) {
        throw new Error(`Usuario ya existe en Keycloak: ${email}`);
      }

      throw err;
    }
  }

  static async iniciarSesion(username, password) {
    if (!username || !password) {
      throw new Error("Usuario y contraseña son obligatorios");
    }

    try {
      const params = new URLSearchParams();
      params.append("grant_type", "password");
      params.append("client_id", CLIENT_ID);
      params.append("client_secret", CLIENT_SECRET);
      params.append("username", username);
      params.append("password", password);

      const response = await axios.post(
        `${KEYCLOAK_BASE_URL}/realms/${REALM}/protocol/openid-connect/token`,
        params,
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      );

      return {
        access_token: response.data.access_token,
        refresh_token: response.data.refresh_token,
        expires_in: response.data.expires_in,
        token_type: response.data.token_type,
      };
    } catch (err) {
      console.error("Error al iniciar sesión: ", err.response?.data || err.message);

      if (err.response?.status === 401) {
        throw new Error("Credenciales inválidas");
      }

      throw err;
    }
  }

  static async filtrarProductosDeVendedor(vendedorID, filtros) {

    const vendedor = await Usuario.findById(vendedorID);

    if (!vendedor) {
      throw new NoEncontradoError(`Usuario con id ${vendedorID} no encontrado`);
    }

    filtros.vendedor = vendedorID

    const filtroCompuesto = crearFiltrosProductos(filtros)

    const orden = crearOrdenProductos(filtros)

    const paginador = crearPaginador(filtros.pagina || 1, filtros.limite || 20)

    return consultaProductos(filtroCompuesto, orden, paginador);
  }

  static async actualizarFotoPerfilPorMongoId(id, fotoUrl) {
    return await Usuario.findByIdAndUpdate(
      id,
      { fotoUrl },
      { new: true }
    );
  }

  static async obtenerUsuarioDeMongo(mongoId) {
    try {
      const usuario = await Usuario.findById(mongoId);
      return usuario;
    } catch (err) {
      console.error("Error al obtener el user", err.message);
      throw err;
    }
  }

  static async listarProductosDelVendedor(vendedorID, pagina = 1, limite = 20) {
    const skip = (pagina - 1) * limite;

    return Producto.find({ vendedor: vendedorID })
      .skip(skip)
      .limit(limite);
  }

  static async cambiarTipoUsuarioAVendedor(mongoId){
    const usuario = await Usuario.findById(mongoId);

    if (!usuario) {
      throw new NoEncontradoError(`Usuario con id ${mongoId} no encontrado`);
    } 
    usuario.tipo = 'VENDEDOR';
    await usuario.save();
    return usuario;
  }

}

