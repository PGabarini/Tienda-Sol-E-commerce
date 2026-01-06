import { BASE_API_URL } from "../config/api.js";

export async function obtenerPedidoPorId(pedidoId, token) {
  const res = await fetch(`${BASE_API_URL}/usuario/pedidos/${pedidoId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Error al traer el pedido");
  }

  return await res.json();
}

export async function obtenerPedidos(token) { // (del user q lo pide, pasando token)
  const res = await fetch(`${BASE_API_URL}/usuarios/pedidos`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Error al traer los pedidos");
  }

  return await res.json();
}

export const obtenerPedidosVendedor = async (token) => {
  const response = await fetch(`${BASE_API_URL}/pedidos/vendedor`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Error al obtener pedidos del vendedor");
  return response.json();
};

export async function cancelarPedido(id, token) {
  const res = await fetch(`${BASE_API_URL}/pedidos/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Error al cancelar el pedido");
  }
  return true;
}

export async function marcarPedidoComoEnviado(id, token) {
  const res = await fetch(`${BASE_API_URL}/pedidos/${id}/envios`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Error al marcar el pedido como enviado");
  }
  return true;
}