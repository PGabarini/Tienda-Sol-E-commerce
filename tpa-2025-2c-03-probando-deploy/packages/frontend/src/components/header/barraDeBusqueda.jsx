import "../../styles/barraDeBusqueda.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";

export const BarraDeBusqueda = () => {
    const navegador = useNavigate();
    const [searchParams] = useSearchParams();
    const textoBusqueda = searchParams.get("busqueda") || "";

    const [busqueda, setBusqueda] = useState(textoBusqueda);

    useEffect(() => {
        setBusqueda(textoBusqueda);
    }, [textoBusqueda]);

    const manejarSubmit = (e) => {
        e.preventDefault();
        if (busqueda.trim() === "") return;
        navegador(`/productos?busqueda=${encodeURIComponent(busqueda)}`);
    };

    return (
        <div className="Barra-busqueda">
            <form className="form-busqueda" onSubmit={manejarSubmit}>
                <nav className="nav-busqueda">
                    <input
                        required
                        className="input-busqueda"
                        type="text"
                        name="busqueda"
                        placeholder="Buscá tus productos favoritos"
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                    />
                    <button className="submit-busqueda" type="submit"></button>
                </nav>
            </form>
        </div>
    );
};
