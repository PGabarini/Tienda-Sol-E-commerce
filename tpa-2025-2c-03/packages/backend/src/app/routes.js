import express from "express";
import { getHealth } from "../controllers/healthController.js";
import { PedidoController } from "../controllers/pedidosController.js";
import UsuarioController from "../controllers/usuarioController.js";
import { NotificacionController } from "../controllers/notificacionController.js";
import ProductoController from "../controllers/productoController.js";
import { uploadFotosProducto } from '../config/productosUploads.js';

const router = express.Router();

// Pedidos
router.post("/pedidos/:id/envios", PedidoController.marcarComoEnviado);
router.post("/pedidos", PedidoController.crearPedido);
router.get("/pedidos", PedidoController.obtenerTodos);
router.delete("/pedidos/:id", PedidoController.cancelarPedido);
router.get("/pedidos/vendedor", PedidoController.PedidosDeVendedor);

// Usuarios
router.post("/usuarios", UsuarioController.crearUsuario);
router.post('/usuarios/productos',uploadFotosProducto,ProductoController.crearProducto);
router.get("/usuarios/notificaciones/:estado", NotificacionController.obtenerPorPeticion);
router.get("/usuarios/pedidos", UsuarioController.obtenerHistorialPedidos);
router.post("/usuarios/login", UsuarioController.iniciarSesion);
router.post("/usuarios/fotoDePerfil", UsuarioController.actualizarFotoPerfil);
router.get("/usuario", UsuarioController.obtenerUsuario);
router.get("/usuario/pedidos/:id", PedidoController.obtenerPedido);
router.patch("/usuarios/vendedor", UsuarioController.cambiarTipoUsuarioAVendedor)

// Productos
router.get("/vendedor/:id/productos", UsuarioController.listarProductos)
router.get("/vendedor/productos", UsuarioController.obtenerProductos)
router.get("/productos", ProductoController.obtenerProductosBuscados)
router.get("/productosLanding", ProductoController.obtenerProductosRandom)
router.get("/producto/:id", ProductoController.obtenerProductoPorId);

// Notificaciones
router.patch("/notificaciones/:id", NotificacionController.marcarLeida);
router.patch("/notificaciones/:id/desleida", NotificacionController.marcarNoLeida);

// Extras
router.get("/health", getHealth);

export default router;
