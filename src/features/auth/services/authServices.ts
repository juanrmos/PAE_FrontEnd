import { api } from "../../../services/api";

// --- Interfaces ---
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  isTeacher: boolean;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: "estudiante" | "docente" | "admin";
  avatar?: string;
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
}

// --- 1. Lógica MOCK (Simulación) ---

const loginMock = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (credentials.password === "error") {
        reject(new Error("Credenciales inválidas (Mock)"));
        return;
      }

      const isTeacher = credentials.email.includes("docente") || credentials.email.includes("profesor");
      
      resolve({
        user: {
          id: "mock-123",
          name: isTeacher ? "Profesor Mock" : "Estudiante Mock",
          email: credentials.email,
          role: isTeacher ? "docente" : "estudiante",
          avatar: "https://github.com/shadcn.png",
        },
        token: "mock-jwt-token-login",
      });
    }, 1000);
  });
};

const registerMock = async (data: RegisterData): Promise<AuthResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        user: {
          id: "mock-new-user",
          name: data.name,
          email: data.email,
          role: data.isTeacher ? "docente" : "estudiante",
          avatar: "https://github.com/shadcn.png",
        },
        token: "mock-jwt-token-register",
      });
    }, 1500);
  });
};

// --- 2. Lógica REAL (API) ---

const loginApi = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/auth/login", credentials);
  return response.data;
};

const registerApi = async (data: RegisterData): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/auth/register", data);
  return response.data;
};

// --- 3. Funciones Principales con FALLBACK ---

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  // A. Mock Forzado
  if (import.meta.env.VITE_USE_MOCKS === "true") {
    console.log("🔶 Modo Mock: Login");
    return loginMock(credentials);
  }

  // B. API Real + Fallback
  try {
    return await loginApi(credentials);
  } catch (error) {
    console.warn("🔴 Fallo API Login. Usando Mock.", error);
    return loginMock(credentials);
  }
};

export const register = async (data: RegisterData): Promise<AuthResponse> => {
  // A. Mock Forzado
  if (import.meta.env.VITE_USE_MOCKS === "true") {
    console.log("🔶 Modo Mock: Registro");
    return registerMock(data);
  }

  // B. API Real + Fallback
  try {
    return await registerApi(data);
  } catch (error) {
    console.warn("🔴 Fallo API Registro. Usando Mock.", error);
    return registerMock(data);
  }
};