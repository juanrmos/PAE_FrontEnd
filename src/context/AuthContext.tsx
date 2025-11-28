// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../hooks/useToast';

interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'estudiante' | 'docente' | 'admin';
  avatar?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (data: Partial<AuthUser>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Inicializar desde localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setToken(storedToken);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulación de API call - reemplazar con llamada real
      await new Promise(resolve => setTimeout(resolve, 1000));

      const isTeacher = email.includes('docente') || email.includes('profesor');
      
      const mockUser: AuthUser = {
        id: 'user-' + Date.now(),
        name: isTeacher ? 'Profesor Mock' : 'Estudiante Mock',
        email,
        role: isTeacher ? 'docente' : 'estudiante',
        avatar: 'https://github.com/shadcn.png',
      };

      const mockToken = 'mock-jwt-' + Date.now();

      // Guardar en estado y localStorage
      setUser(mockUser);
      setToken(mockToken);
      localStorage.setItem('token', mockToken);
      localStorage.setItem('user', JSON.stringify(mockUser));

      toast({
        title: 'Bienvenido',
        description: `Ingresaste como ${mockUser.role}`,
      });

      // Redirigir según rol
      const basePath = mockUser.role === 'docente' ? '/docente' : '/estudiante/explorar';
      navigate(basePath, { replace: true });

    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error de acceso',
        description: 'Credenciales incorrectas o servicio no disponible.',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [navigate, toast]);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');

    toast({
      title: 'Sesión cerrada',
      description: 'Has salido de tu cuenta correctamente',
    });

    navigate('/', { replace: true });
  }, [navigate, toast]);

  const updateUser = useCallback((data: Partial<AuthUser>) => {
    if (!user) return;

    const updatedUser = { ...user, ...data };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  }, [user]);

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!user && !!token,
    isLoading,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};