import ProductoForm from "./form";
import React, {useEffect} from "react";
import { useNavigate } from "react-router-dom";
import {useAuth} from "../../../context/AuthContext";
import {crearProducto} from "../../../api/productos";

export function  Page() {
  const navigate = useNavigate();
  const { isAuthenticated, profile } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth/login");
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = (data) => {
    crearProducto(profile.id, data)
    .then(() => {navigate("/productos")})
  };

  return (
    <div className="mx-auto max-w-2xl p-4">
          <ProductoForm onSubmit={onSubmit} />
    </div>
  );
}

export { Page as Component };
