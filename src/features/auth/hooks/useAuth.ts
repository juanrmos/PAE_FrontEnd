// src/features/auth/hooks/useAuth.ts
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  login as loginService, 
  register as registerService, 
  type LoginCredentials, 
  type RegisterData 
} from "../services/authServices";
import { useToast } from "../../../hooks/useToast"; // Tu hook migrado

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      const response = await loginService(credentials);
      
      // 1. Guardar sesión (Persistencia básica)
      localStorage.setItem("token", response.token);
      localStorage.setItem("role", response.user.role);
      localStorage.setItem("user", JSON.stringify(response.user));

      // 2. Feedback al usuario
      toast({
        title: "¡Bienvenido!",
        description: `Has iniciado sesión como ${response.user.role}`,
      });

      // 3. Redirección inteligente según rol
      // Esto cumple con el requisito de vistas por rol
      if (response.user.role === "docente") {
        navigate("/repositorio/mis-repos"); // Vista default docente
      } else {
        navigate("/home"); // Vista default estudiante
      }
      
      // Forzar recarga para que el Sidebar actualice el rol (solución temporal simple)
      // En una app más avanzada usaríamos un Context, pero esto funciona perfecto por ahora.
      window.dispatchEvent(new Event("storage"));

    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error de acceso",
        description: error instanceof Error ? error.message : "Ocurrió un error inesperado",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    setIsLoading(true);
    try {
      const response = await registerService(data);
      
      localStorage.setItem("token", response.token);
      localStorage.setItem("role", response.user.role);
      localStorage.setItem("user", JSON.stringify(response.user));

      toast({
        title: "Cuenta creada",
        description: "Tu registro ha sido exitoso",
      });

      navigate("/home");
      window.dispatchEvent(new Event("storage"));

    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error en registro",
        description: "No se pudo crear la cuenta. Intenta nuevamente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    navigate("/");
    toast({
      title: "Sesión cerrada",
      description: "Has salido de tu cuenta correctamente",
    });
  };

  return {
    login,
    register,
    logout,
    isLoading,
  };
};