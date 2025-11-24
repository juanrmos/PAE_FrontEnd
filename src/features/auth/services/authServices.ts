// src/features/auth/services/authService.ts

// 1. Definimos las "formas" (Interfaces) de los datos
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  isTeacher: boolean; // Campo clave para el registro
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'estudiante' | 'docente' | 'admin';
  avatar?: string;
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
}

// 2. Simulación de API (Mock)
// TODO: Reemplazar con axios.post('/api/auth/login') en la Fase de Conexión Real
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulación básica de error
      if (credentials.password === "error") {
        reject(new Error("Credenciales inválidas"));
        return;
      }

      // Lógica de Rol Inteligente para pruebas
      const isTeacher = credentials.email.includes("docente") || credentials.email.includes("profesor");
      const role = isTeacher ? 'docente' : 'estudiante';

      resolve({
        user: {
          id: "12345",
          name: isTeacher ? "Profesor Carlos" : "Juan Estudiante",
          email: credentials.email,
          role: role,
          avatar: "https://github.com/shadcn.png",
        },
        token: "fake-jwt-token-123",
      });
    }, 1500); // 1.5 segundos de carga falsa
  });
};

export const register = async (data: RegisterData): Promise<AuthResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        user: {
          id: "67890",
          name: data.name,
          email: data.email,
          role: data.isTeacher ? 'docente' : 'estudiante',
        },
        token: "fake-jwt-token-456",
      });
    }, 1500);
  });
};