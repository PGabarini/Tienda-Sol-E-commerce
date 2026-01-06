import React, { useState, useEffect } from "react";
import { SidebarPerfil } from "../components/sidebar/sidebarPerfil";
import "../styles/notificacionesPerfil.css";
import NotificacionService from "../service/notificacionService";
import { useAuth } from "../context/AuthContext";

export default function NotificacionesPerfil() {
    const { token } = useAuth();
    const [notificaciones, setNotificaciones] = useState([]);
    const [mostrarLeidas, setMostrarLeidas] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNotificaciones = async () => {
            setLoading(true);
            try {
                const data = await NotificacionService.obtenerNotificaciones(
                    mostrarLeidas,
                    token
                );
                setNotificaciones(data || []);
            } catch (err) {
                console.error("Error al traer notificaciones:", err);
                setNotificaciones([]);
            } finally {
                setLoading(false);
            }
        };

        if (token) fetchNotificaciones();
    }, [mostrarLeidas, token]);

    const marcarComoLeida = async (id) => {
        if (!id) return;
        try {
            const fechaLeida = await NotificacionService.marcarComoLeida(id, token);

            window.dispatchEvent(new Event("actualizarNotificaciones"));

            if (!mostrarLeidas) {
                setNotificaciones((prev) => prev.filter((n) => n.id !== id));
            } else {
                setNotificaciones((prev) =>
                    prev.map((n) =>
                        n.id === id ? { ...n, fueLeida: true, fechaLeida } : n
                    )
                );
            }
        } catch (err) {
            console.error("Error al marcar como leída:", err);
        }
    };

    const marcarComoNoLeida = async (id) => {
        if (!id) return;
        try {
            await NotificacionService.marcarComoNoLeida(id, token);

            window.dispatchEvent(new Event("actualizarNotificaciones"));

            if (mostrarLeidas) {
                setNotificaciones((prev) => prev.filter((n) => n.id !== id));
            } else {
                setNotificaciones((prev) =>
                    prev.map((n) =>
                        n.id === id ? { ...n, fueLeida: false, fechaLeida: null } : n
                    )
                );
            }
        } catch (err) {
            console.error("Error al marcar como no leída:", err);
        }
    };

    const marcarTodasComoLeidas = async () => {
        try {
            for (const noti of notificaciones) {
                if (!noti.fueLeida) {
                    await NotificacionService.marcarComoLeida(noti.id, token);
                }
            }

            window.dispatchEvent(new Event("actualizarNotificaciones"));

            if (!mostrarLeidas) {
                setNotificaciones([]);
            } else {
                setNotificaciones((prev) =>
                    prev.map((n) => ({
                        ...n,
                        fueLeida: true,
                        fechaLeida: new Date().toISOString(),
                    }))
                );
            }
        } catch (err) {
            console.error("Error marcando todas como leídas:", err);
        }
    };

    return (
        <div className="historial-container">
            <SidebarPerfil />
            <main className="historial-main">
                <h2>Tus notificaciones</h2>
                <p>Revisá tus notificaciones recientes.</p>

                <div className="notificaciones-header">
                    <div className="notificaciones-filtros">
                        <button
                            className={!mostrarLeidas ? "activo" : ""}
                            onClick={() => setMostrarLeidas(false)}
                        >
                            No leídas
                        </button>
                        <button
                            className={mostrarLeidas ? "activo" : ""}
                            onClick={() => setMostrarLeidas(true)}
                        >
                            Leídas
                        </button>
                    </div>

                    {!mostrarLeidas && notificaciones.length > 0 && (
                        <button className="btn-marcar" onClick={marcarTodasComoLeidas}>
                            Marcar todas como leídas
                        </button>
                    )}
                </div>

                {loading ? (
                    <p>Cargando notificaciones...</p>
                ) : notificaciones.length === 0 ? (
                    <p>No hay notificaciones {mostrarLeidas ? "leídas" : "no leídas"}.</p>
                ) : (
                    <div className="notificaciones-container">
                        {notificaciones.map((noti) => (
                            <div
                                key={noti.id}
                                className={`notificacion-card ${noti.fueLeida ? "leida" : "no-leida"}`}
                            >
                                <div className="notificacion-info">
                                    <span className="notificacion-fecha">
                                        {new Date(noti.fechaAlta).toLocaleDateString("es-AR")}
                                    </span>
                                    <p className="notificacion-mensaje">{noti.mensaje}</p>
                                </div>

                                {noti.fueLeida ? (
                                    <button
                                        className="btn-marcar"
                                        onClick={() => marcarComoNoLeida(noti.id)}
                                    >
                                        Marcar como no leída
                                    </button>
                                ) : (
                                    <button
                                        className="btn-marcar"
                                        onClick={() => marcarComoLeida(noti.id)}
                                    >
                                        Marcar como leída
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
