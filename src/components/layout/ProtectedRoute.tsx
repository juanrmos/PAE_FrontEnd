import { Navigate, Outlet } from "react-router-dom";

interface Props {
  allowedRoles: string[];
}

export const ProtectedRoute = ({ allowedRoles }: Props) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role") || "";

  
  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (!allowedRoles.includes(userRole)) {
    
    if (userRole === "estudiante") return <Navigate to="/estudiante" replace />;
    if (userRole === "docente") return <Navigate to="/docente" replace />;
    
    return <Navigate to="/" replace />;
  }

  // 3. Si todo bien, renderiza el contenido (Outlet)
  return <Outlet />;
};