import React, { createContext, useState, useEffect, useContext } from "react";
import { BASE_API_URL } from "../config/api";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [isAuthenticated, setIsAuthenticated] = useState(false);



  const [profile, setProfile] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);

  

  useEffect(() => {
    

    const fetchUserData = async () => {

      

      try {
        const response = await fetch(`${BASE_API_URL}/usuario`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Error al obtener datos del usuario");

        const userData = await response.json();

        setProfile((prev) => ({
          ...prev,
          username: userData.nombre || prev?.username,
          email: userData.email || prev?.email,
          firstName: userData.firstName || prev?.firstName,
          lastName: userData.lastName || prev?.lastName,
          telefono: userData.telefono || "No disponible",
          tipo: userData.tipo || "USUARIO",
          fotoUrl: userData.fotoUrl || "/uploads/userDefault.jpg",
        }));
      } catch (error) {
        console.error("Error trayendo datos del backend:", error);
        setIsAuthenticated(false);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      
      setIsAuthenticated(true);

      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setProfile({
          username: payload.preferred_username,
          email: payload.email,
          firstName: payload.given_name,
          lastName: payload.family_name,
          mongoId: payload.sub,
        });
      } catch (err) {
        console.error("Error decodificando token:", err);
        setProfile(null);
      }

      fetchUserData();
    } else {
    
      setIsAuthenticated(false);
      setProfile(null);
      setLoading(false);
    }
  }, [token]);

  const login = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setIsAuthenticated(false);
    setProfile(null);
  };

  const updateProfile = (updates) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, profile, login, logout, token, loading, updateProfile}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
