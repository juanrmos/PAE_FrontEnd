// src/services/api.ts
import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios"; // ✅ Corrección aquí: agregado 'type'

// ✅ Configuración base de Axios
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30 segundos
});

// ✅ Estado para evitar múltiples refresh simultáneos
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: Error) => void;
}> = [];

/**
 * Procesa la cola de peticiones fallidas después del refresh
 */
const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

/**
 * Intenta refrescar el access token usando el refresh token
 */
const refreshAccessToken = async (): Promise<string> => {
  const refreshToken = localStorage.getItem("refresh_token");
  
  if (!refreshToken) {
    throw new Error("No refresh token available");
  }

  try {
    // ✅ Llamada al endpoint de refresh (ajustar según tu backend)
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}/auth/refresh`,
      { refreshToken },
      { 
        headers: { "Content-Type": "application/json" },
        timeout: 10000 
      }
    );

    const { accessToken, refreshToken: newRefreshToken } = response.data;

    // ✅ Guardar nuevos tokens
    localStorage.setItem("token", accessToken);
    if (newRefreshToken) {
      localStorage.setItem("refresh_token", newRefreshToken);
    }

    return accessToken;
  } catch (error) {
    // ✅ Si falla el refresh, limpiar todo y redirigir al login
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    
    // Redirigir al login
    window.location.href = "/login";
    
    throw error;
  }
};

// ✅ INTERCEPTOR DE REQUEST: Agregar token a cada petición
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("token");
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // ✅ Agregar CSRF token si existe
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    if (csrfToken && config.headers) {
      config.headers['X-CSRF-Token'] = csrfToken;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ✅ INTERCEPTOR DE RESPONSE: Manejo de errores 401 y refresh automático
api.interceptors.response.use(
  (response) => response, // Si la respuesta es exitosa, retornarla
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // ✅ Si es error 401 y no es una petición de login/refresh
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/login") &&
      !originalRequest.url?.includes("/auth/refresh")
    ) {
      // ✅ Si ya se está refrescando, agregar a la cola
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      // ✅ Marcar que estamos refrescando
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // ✅ Intentar refrescar el token
        const newAccessToken = await refreshAccessToken();
        
        // ✅ Procesar cola de peticiones fallidas
        processQueue(null, newAccessToken);
        
        // ✅ Reintentar la petición original con el nuevo token
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }
        
        return api(originalRequest);
      } catch (refreshError) {
        // ✅ Si falla el refresh, rechazar todas las peticiones pendientes
        processQueue(refreshError as Error, null);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // ✅ Para otros errores, rechazar directamente
    return Promise.reject(error);
  }
);

// ✅ Función helper para logout manual
export const clearAuthData = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("user");
  localStorage.removeItem("role");
};

export default api;