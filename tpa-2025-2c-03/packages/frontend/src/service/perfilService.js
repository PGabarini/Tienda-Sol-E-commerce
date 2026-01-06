import { BASE_API_URL } from "../config/api.js";

export async function subirFoto(file) {
  const formData = new FormData();
  formData.append("foto", file);

  const uploadRes = await fetch(`${BASE_API_URL}/uploads`, {
    method: "POST",
    body: formData,
  });

  if (!uploadRes.ok) {
    throw new Error("Error subiendo la imagen");
  }

  const { url } = await uploadRes.json();
  return url;
}

export async function actualizarFotoPerfil(url, token) {
  const response = await fetch(`${BASE_API_URL}/usuarios/fotoDePerfil`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ fotoUrl: url }),
  });

  if (!response.ok) {
    throw new Error("Error actualizando foto de perfil");
  }

  return await response.json();
}
