import { BASE_API_URL } from "../config/api.js";

export async function obtenerProductos(){
  const res = await fetch(`${BASE_API_URL}/productos`,{
    method: "GET",
  });
  
  if (!res.ok) {
    throw new Error("Error al traer los productos");
  }
  return await res.json();
}


export async function crearProducto(token, formData) {  
    const res = await fetch(`${BASE_API_URL}/usuarios/productos`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: formData,
    });

    if (!res.ok) {
        const errorDetail = await res.json().catch(() => ({ message: res.statusText }));
        throw new Error(`Error ${res.status}: ${errorDetail.message || "Error al crear el producto"}`);
    }
    return await res.json();
}

export async function obtenerProductosVendedor(token) {
  const res = await fetch(`${BASE_API_URL}/vendedor/productos`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errorDetail = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(`Error ${res.status}: ${errorDetail.message || "Error al traer los productos"}`);
  }

  return await res.json();
}

export async function obtenerProductosBuscados(textoDeBusqueda){
  const res = await fetch(`${BASE_API_URL}/productos?busqueda=${textoDeBusqueda}`,{
    method:"GET"
  })

  if (!res.ok) {
    const errorDetail = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(`Error ${res.status}: ${errorDetail.message || "Error al traer los productos"}`);
  }

  return await res.json();

}