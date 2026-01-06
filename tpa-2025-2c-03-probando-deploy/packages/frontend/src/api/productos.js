import axiosInstance from "./axios";

export function crearProducto(id, producto) {
  return axiosInstance.post(`/usuarios/${id}/productos`, producto)
}