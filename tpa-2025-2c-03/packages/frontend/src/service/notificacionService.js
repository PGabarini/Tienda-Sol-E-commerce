import { BASE_API_URL } from "../config/api.js";
export default class NotificacionService {
    static async obtenerNotificaciones(leidas, token) {
        const estado = leidas ? "true" : "false";

        try {
            const res = await fetch(`${BASE_API_URL}/usuarios/notificaciones/${estado}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const contentType = res.headers.get("content-type") || "";
            if (!res.ok) throw new Error(`Error HTTP ${res.status}`);

            if (!contentType.includes("application/json")) {
                console.warn("Respuesta no JSON del servidor");
                return [];
            }

            const data = await res.json();
            return Array.isArray(data) ? data : [];
        } catch (err) {
            console.error("Error al obtener notificaciones:", err);
            return [];
        }
    }

    static async marcarComoLeida(id, token) {
        const res = await fetch(`${BASE_API_URL}/notificaciones/${id}`, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!res.ok) throw new Error(`Error HTTP ${res.status}`);

        const data = await res.json();
        return data.fechaLeida; 
    }

    static async marcarComoNoLeida(id, token) {
        const res = await fetch(`${BASE_API_URL}/notificaciones/${id}/desleida`, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!res.ok) throw new Error(`Error HTTP ${res.status}`);
    }
}
