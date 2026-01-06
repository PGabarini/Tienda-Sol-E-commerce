import { Link } from "react-router-dom";
import { useState } from "react"

export const TarjetaNotificacionDesplegable = ({ notificacion }) => {
    
    const [desplegado,setDesplegado] = useState(false)

    const desplegar = () => {
        setDesplegado(true)
    }

    return (
        <div className="tarjetaNotificacionContainer">
        <button onClick={desplegar}>
            <img src="/campanita" alt="Desplegable de notificaciones" />
        </button>

        {abierto && (
            <div className="tarjetaNotificacion">
            <Link to={`/notificacion/${notificacion.id}`} className="linkDirecto">
                <h3 className="titulo">{notificacion.nombre}</h3>
                <p className="descripcion">{notificacion.descripcion}</p>
            </Link>

            <Link to="/notificaciones" className="linkNotificacionCompleta">
                Ver más
            </Link>
            </div>
        )}
        </div>
    );
}