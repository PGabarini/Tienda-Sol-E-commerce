import "../../styles/header.css";
import { Link } from "react-router-dom";
import { BarraDeBusqueda } from "../../components/header/barraDeBusqueda.jsx";
import { MenuDeUsuario } from "../../components/header/menuDeUsuario.jsx";

export const Header = () => {
  return (
    <header className="navbar" style={{ position: "relative", zIndex: 1000 }}>
      <div className="container nav-content">
        <Link to="/" className="logo">
          <img src="/uploads/logoTienda.png" alt="Logo" className="logo-img" />
        </Link>

        <BarraDeBusqueda />

        <div
          className="auth-buttons"
          style={{
            display: "flex",
            alignItems: "center",
            position: "relative", 
          }}
        >
          <MenuDeUsuario />
        </div>
      </div>
    </header>
  );
};
