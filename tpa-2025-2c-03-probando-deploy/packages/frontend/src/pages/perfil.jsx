import React, { useEffect, useState, useRef, useContext } from "react";
import "../styles/perfil.css";
import { useAuth } from "../context/AuthContext";
import { SidebarPerfil } from "../components/sidebar/sidebarPerfil";
import { ToastContext } from "../context/ToastContext";
import { subirFoto, actualizarFotoPerfil } from "../service/perfilService"; 
import { BASE_API_URL } from "../config/api.js";

export default function Perfil() {
  const fileInputRef = useRef(null);
  const { isAuthenticated, profile, token, updateProfile } = useAuth();
  const { showToast } = useContext(ToastContext);

  const [user, setUser] = useState({
    nombre: "",
    telefono: "No disponible",
    email: "No disponible",
    tipo: "USUARIO",
    photoURL: "/uploads/userDefault.jpg",
  });

  const [photoSrc, setPhotoSrc] = useState("/uploads/userDefault.jpg");

  const getFullUrl = (url) => {
    if (!url) return "/uploads/userDefault.jpg";
    return url.startsWith("http") ? url : `${BASE_API_URL}${url}`;
  };

  useEffect(() => {
    if (isAuthenticated && profile) {
      const newUser = {
        nombre: profile.firstName || profile.username || "Usuario",
        telefono: profile.telefono || "No disponible",
        email: profile.email || "No disponible",
        nombre: profile.firstName || profile.username || "Usuario",
        apellido: profile.lastName || "No disponible",
        photoURL: profile.fotoUrl || profile.photoURL || "/uploads/userDefault.jpg",
      };
      setUser(newUser);
      setPhotoSrc(getFullUrl(newUser.photoURL));
    }
  }, [isAuthenticated, profile]);

  if (!isAuthenticated) return <p>No estás autenticado</p>;

  const handleEditarFoto = () => fileInputRef.current?.click();

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const url = await subirFoto(file);

      await actualizarFotoPerfil(url, token);

      setUser((prev) => ({ ...prev, photoURL: url }));
      setPhotoSrc(getFullUrl(url));
      updateProfile({ fotoUrl: url });

      showToast("Foto de perfil actualizada correctamente!");
    } catch (err) {
      console.error("Error en handleFileChange:", err);
      showToast("Error al actualizar la foto de perfil");
    }
  };

  return (
    <div className="historial-container">
      <SidebarPerfil active="Perfil" />

      <main className="historial-main">
        <div className="profile-card">
          <div className="profile-img-wrapper">
            <img
              src={photoSrc}
              alt={user.nombre}
              className="profile-img"
              onError={() => setPhotoSrc("/uploads/userDefault.jpg")}
            />
          </div>

          <h2 className="profile-name">{user.nombre}</h2>

          <div className="profile-info">
            <p><strong>Nombre:</strong> {user.nombre}</p>
            <p><strong>Apellido:</strong> {user.apellido}</p>
            <p><strong>Teléfono:</strong> {user.telefono}</p>
            <p><strong>Email:</strong> {user.email}</p>
          </div>

          <button className="edit-profile-btn" onClick={handleEditarFoto}>
            Editar Foto de Perfil
          </button>

          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
      </main>
    </div>
  );
}
