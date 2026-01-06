import { TarjetaNotificacion } from "./tarjetaeNotificacion"
import { Link } from "react-router-dom"

export const desplegableNotificaciones = ({ profile }) => {
    return (
        <ul>
            {notificaciones.map(notificacion => 
                (
                    <li key={notificacion.id}>
                    <TarjetaNotificacion notificacion={notificacion} />
                    </li>
                )
            )}
            
            <li>
                <Link to="/notificaciones">Ver más...</Link>
            </li>
        </ul>
    )
}