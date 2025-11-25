import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  login as loginService, 
  register as registerService, 
  type LoginCredentials, 
  type RegisterData 
} from "../services/authServices"; // Asegúrate que coincida con el nombre de tu archivo (singular)
import { useToast } from "../../../hooks/useToast";

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      const response = await loginService(credentials);
      
      // 1. Guardar sesión
      localStorage.setItem("token", response.token);
      localStorage.setItem("role", response.user.role);
      localStorage.setItem("user", JSON.stringify(response.user));

      // 2. Feedback
      toast({
        title: "Bienvenido",
        description: `Ingresaste como ${response.user.role}`,
      });

      
      if (response.user.role === "docente") {
        navigate("/docente");
      } else {
        navigate("/estudiante"); 
      }
      
      window.dispatchEvent(new Event("storage")); //corregir

    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error de acceso",
        description: "Credenciales incorrectas o servicio no disponible.",
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

      if (response.user.role === "docente") {
          navigate("/docente");
      } else {
          navigate("/estudiante");
      }
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
    
    window.dispatchEvent(new Event("storage"));
  };

  
  return {
    login,
    register,
    logout,
    isLoading,
  };
};