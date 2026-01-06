
import Detalle from "./id/detalleProducto.jsx";
import BuscadorDeProductos from "./busqueda/buscadorDeProductos.jsx"
import React from "react";

export const route = {
 path: "/productos",
  children: [
    {
      path: "/productos/:id",
      element: <Detalle/>
    },
    {
      path: "",
      lazy: () => import("./landing")
    },
    {
      path: ":id",
      lazy: () => import("./id/detalleProducto")
    },
    {
      path: "new",
      lazy: () => import("./new/page")
    },
    {
      index:true,
      element:<BuscadorDeProductos />
    }
    ]
}