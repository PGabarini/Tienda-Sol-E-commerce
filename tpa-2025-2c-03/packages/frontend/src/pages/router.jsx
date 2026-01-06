import { createBrowserRouter } from "react-router-dom";
import Layout from "./layout/layout";
import { route as productos } from "./productos/route";
import { route as auth } from "./auth/route";
import PrivateRoute from "../components/privateRoute";
import Perfil from "./perfil";
import HistorialPedidos from "./historialPedidos";
import NotificacionesPerfil from "./notificacionesPerfil";
import Carrito from "./carrito";
import Landing from "./productos/landing";
import DetallePedido from "./detallePedido";
import MisProductos from "./misProductos";
import CargarProducto from "./cargarProducto";
import GestionarPedidos from "./gestionarPedidos";
 

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <Landing /> },
      productos,

      {
        element: <PrivateRoute />,
        children: [
          { path: "/perfil", element: <Perfil /> },
          { path: "/historial-pedidos", element: <HistorialPedidos /> },
          { path: "/historial-pedidos/:pedidoId", element: <DetallePedido /> },
          { path: "/notificaciones", element: <NotificacionesPerfil /> },
          { path: "/carrito", element: <Carrito /> },
          {path: "/gestionar-pedidos", element: <GestionarPedidos />}
        ],
      },

      {
        element: <PrivateRoute forbiddenRoles={["COMPRADOR"]} />,
        children: [
          { path: "/mis-productos", element: <MisProductos /> },
          { path: "/publicar-producto", element: <CargarProducto /> },
        ],
      },
    ],
  },
  auth,
]);


export default router;