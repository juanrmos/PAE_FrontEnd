import { Navigate, Outlet } from "react-router-dom";

interface Props {
  allowedRoles: string[];
}

export const ProtectedRoute = ({ allowedRoles }: Props) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role") || "";

  // 1. Si no hay token, al Login
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // 2. Si tiene token pero el rol no coincide, al "Home" correspondiente (o 404)
  if (!allowedRoles.includes(userRole)) {
    // Si intenta entrar a docente siendo estudiante, lo mandamos a su home
    if (userRole === "estudiante") return <Navigate to="/estudiante" replace />;
    if (userRole === "docente") return <Navigate to="/docente" replace />;
    
    return <Navigate to="/" replace />;
  }

  // 3. Si todo bien, renderiza el contenido (Outlet)
  return <Outlet />;
};