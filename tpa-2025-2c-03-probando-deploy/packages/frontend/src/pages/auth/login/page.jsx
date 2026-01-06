import React, { useState, useContext } from "react";
import "../../../styles/login.css";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { ToastContext } from "../../../context/ToastContext";
import { BASE_API_URL } from "../../../config/api";

export function Page() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showToast } = useContext(ToastContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(`${BASE_API_URL}/usuarios/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al iniciar sesión");
      }

      localStorage.setItem("token", data.access_token);
      login?.(data.access_token);

      // ✅ Mostramos el toast de éxito
      showToast("Inicio de sesión exitoso 🎉", 3000, "success");

      // opcionalmente podés redirigir después de un pequeño delay:
      setTimeout(() => navigate("/"), 1000);

    } catch (err) {
      console.error("Error al iniciar sesión:", err);
      setError(err.message);
      showToast("Error al iniciar sesión ❌", 3000, "error");
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <Link to="/">
          <img
            src="/uploads/logoTienda.png"
            alt="Logo Tienda Sol"
            className="logo"
          />
        </Link>

        <h1>
          Hola! <span className="highlight">Accedé</span> a tu cuenta
          <br /> con tu nombre de usuario y contraseña.
        </h1>

        <p className="legal">
          Tienda Sol —{" "}
          <Link to="/politica-cookies">Política de cookies</Link> y{" "}
          <Link to="/politica-privacidad">Política de privacidad</Link>
        </p>
      </div>

      <div className="login-right">
        <form className="login-form" onSubmit={handleSubmit}>
          <h2>Iniciar sesión</h2>

          <label>Nombre de usuario *</label>
          <input
            className="nombre-usuario"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Tu nombre de usuario"
            required
          />

          <label>Contraseña *</label>
          <input
            className="contrasenia"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Tu contraseña"
            required
          />

          {error && <p className="error">{error}</p>}

          <button type="submit" className="btn-primary wide iniciar">
            Iniciar sesión
          </button>

          <hr className="separator" />

          <Link to="/auth/register" className="btn-primary wide registrarse">
            Registrarse
          </Link>
        </form>
      </div>
    </div>
  );
}

export { Page as Component };
