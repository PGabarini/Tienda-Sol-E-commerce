import React, { useState } from "react";
import "../../../styles/register.css";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { BASE_API_URL } from "../../../config/api";

export function Page() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    tipo: "",
    profilePicture: null,
  });

  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [flashMessage, setFlashMessage] = useState(""); // toast

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profilePicture") {
      const file = files[0];
      setFormData({ ...formData, profilePicture: file });
      setPreview(file ? URL.createObjectURL(file) : null);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    try {
      const payload = {
        nombre: formData.username,
        email: formData.email,
        telefono: formData.phone,
        tipo: "COMPRADOR",
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
      };

      const createResponse = await fetch(`${BASE_API_URL}/usuarios`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!createResponse.ok) {
        const data = await createResponse.json();
        throw new Error(data.error || "Error al registrar usuario");
      }

      // 2. Loguear automáticamente
      const loginResponse = await fetch(`${BASE_API_URL}/usuarios/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: formData.username, password: formData.password }),
      });

      const loginData = await loginResponse.json();

      if (!loginResponse.ok) {
        throw new Error(loginData.error || "Error al iniciar sesión automáticamente");
      }

      localStorage.setItem("token", loginData.access_token);
      login(loginData.access_token);

      setFlashMessage("Usuario creado y logueado correctamente");
      setTimeout(() => {
        setFlashMessage("");
        navigate("/");
      }, 1000);

    } catch (err) {
      setError(err.message);
      setFlashMessage("Hubo un error al crear el usuario.");
      setTimeout(() => setFlashMessage(""), 4000);
    }
  };

  return (
    <div className="registro-container">
      {/* Panel Izquierdo */}
      <div className="registro-left">
        <Link to="/">
          <img src="/uploads/logoTienda.png" alt="Logo Tienda Sol" className="logo" />
        </Link>
        <h1>
          Hola! <span className="highlight">Creá</span> tu cuenta
          <br />
          y empezá a disfrutar de nuestros productos y beneficios.
        </h1>
        <p className="legal">
          Tienda Sol — <a href="#">Términos y condiciones</a> y <a href="#">Política de privacidad</a>
        </p>
      </div>

      {/* Panel Derecho */}
      <div className="registro-right">
        <form className="registro-form" onSubmit={handleSubmit}>
          <h2>Registro</h2>

          <div className="form-grid">
            <div className="form-field">
              <label>Nombre de usuario *</label>
              <input
                className="usuario"
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Nombre de usuario"
                required
              />
            </div>

            <div className="form-field">
              <label>Email *</label>
              <input
                className="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Correo electrónico"
                required
              />
            </div>

            <div className="form-field">
              <label>Contraseña *</label>
              <input
                className="contrasenia"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Contraseña"
                required
              />
            </div>

            <div className="form-field">
              <label>Confirmar Contraseña *</label>
              <input
                className="confirmar-contrasenia"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Repite la contraseña"
                required
              />
            </div>

            <div className="form-field">
              <label>Nombre *</label>
              <input
                className="nombre"
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Nombre"
                required
              />
            </div>

            <div className="form-field">
              <label>Apellido *</label>
              <input
                className="apellido"
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Apellido"
                required
              />
            </div>

            <div className="form-field">
              <label>Teléfono *</label>
              <input
                className="telefono"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Teléfono"
              />
            </div>

          </div>

          {/* Error */}
          {error && <p className="error">{error}</p>}

          {/* Botones */}
          <button type="submit" className="btn-primary wide crear-cuenta">Crear cuenta</button>
          <Link to="/auth/login" className="btn-secondary wide iniciar">Iniciar sesión</Link>
        </form>

        {/* Toast */}
        {flashMessage && (
          <div className={`toast ${error ? "toast-error" : "toast-success"}`}>
            {flashMessage}
          </div>
        )}
      </div>
    </div>
  );
}

export { Page as Component };
