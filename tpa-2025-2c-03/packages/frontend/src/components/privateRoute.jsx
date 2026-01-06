import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PrivateRoute({ forbiddenRoles = [] }) {
  const { isAuthenticated, loading, profile } = useAuth();

  if (loading) return <div>Cargando...</div>;

  if (!isAuthenticated) return <Navigate to="/" />;

  if (forbiddenRoles.includes(profile?.tipo)) return <Navigate to="/" />;

  return <Outlet />;
}
