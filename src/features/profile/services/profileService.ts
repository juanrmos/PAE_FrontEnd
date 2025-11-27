// src/features/profile/services/profileService.ts
import { api } from "../../../services/api";

// ========== INTERFACES ==========
export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "docente" | "estudiante" | "admin";
  institution: string;
  bio?: string;
  avatar?: string;
  createdAt: string;
}

export interface ProfileStats {
  coursesCount: number;
  achievementsCount: number;
  connectionsCount: number;
}

export interface SessionInfo {
  device: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
}

export interface UpdateProfileData {
  firstName: string;
  lastName: string;
  institution: string;
  bio?: string;
}

export interface UpdatePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// ========== MOCK DATA ==========
const MOCK_USER: UserProfile = {
  id: "user-123",
  firstName: "Carlos",
  lastName: "Mendoza",
  email: "cmendoza@pae.edu",
  role: "docente",
  institution: "Universidad Nacional Mayor de San Marcos",
  bio: "Docente de Matemáticas con 10 años de experiencia. Apasionado por la educación digital.",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=carlos",
  createdAt: "2024-01-15",
};

const MOCK_STATS: ProfileStats = {
  coursesCount: 8,
  achievementsCount: 24,
  connectionsCount: 156,
};

const MOCK_SESSIONS: SessionInfo[] = [
  {
    device: "Chrome en Windows",
    location: "Lima, Perú",
    lastActive: "Hace 5 minutos (Sesión actual)",
    isCurrent: true,
  },
  {
    device: "Safari en iPhone",
    location: "Lima, Perú",
    lastActive: "Hace 2 días",
    isCurrent: false,
  },
  {
    device: "Firefox en Windows",
    location: "Callao, Perú",
    lastActive: "Hace 1 semana",
    isCurrent: false,
  },
];

// ========== SERVICIOS MOCK ==========
const getProfileMock = async (): Promise<UserProfile> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Intentar obtener info del localStorage
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        resolve({
          ...MOCK_USER,
          firstName: userData.name?.split(" ")[0] || MOCK_USER.firstName,
          lastName: userData.name?.split(" ").slice(1).join(" ") || MOCK_USER.lastName,
          email: userData.email || MOCK_USER.email,
          role: userData.role || MOCK_USER.role,
        });
      } else {
        resolve(MOCK_USER);
      }
    }, 800);
  });
};

const getStatsMock = async (): Promise<ProfileStats> => {
  return new Promise((resolve) => setTimeout(() => resolve(MOCK_STATS), 600));
};

const getSessionsMock = async (): Promise<SessionInfo[]> => {
  return new Promise((resolve) => setTimeout(() => resolve(MOCK_SESSIONS), 600));
};

const updateProfileMock = async (data: UpdateProfileData): Promise<UserProfile> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const updatedUser = {
        ...MOCK_USER,
        ...data,
      };
      resolve(updatedUser);
    }, 1000);
  });
};

const updatePasswordMock = async (data: UpdatePasswordData): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulación: validar que la contraseña actual sea correcta
      if (data.currentPassword === "wrongpassword") {
        reject(new Error("Contraseña actual incorrecta"));
      } else {
        resolve();
      }
    }, 1000);
  });
};

const logoutAllSessionsMock = async (): Promise<void> => {
  return new Promise((resolve) => setTimeout(() => resolve(), 800));
};

// ========== SERVICIOS API ==========
const getProfileApi = async (): Promise<UserProfile> => {
  const response = await api.get("/profile");
  return response.data;
};

const getStatsApi = async (): Promise<ProfileStats> => {
  const response = await api.get("/profile/stats");
  return response.data;
};

const getSessionsApi = async (): Promise<SessionInfo[]> => {
  const response = await api.get("/profile/sessions");
  return response.data;
};

const updateProfileApi = async (data: UpdateProfileData): Promise<UserProfile> => {
  const response = await api.put("/profile", data);
  return response.data;
};

const updatePasswordApi = async (data: UpdatePasswordData): Promise<void> => {
  await api.put("/profile/password", data);
};

const logoutAllSessionsApi = async (): Promise<void> => {
  await api.post("/profile/sessions/logout-all");
};

// ========== EXPORTACIONES CON FALLBACK ==========
export const getProfile = async (): Promise<UserProfile> => {
  if (import.meta.env.VITE_USE_MOCKS === "true") {
    console.log("🔶 Modo Mock: Profile");
    return getProfileMock();
  }

  try {
    return await getProfileApi();
  } catch (error) {
    console.warn("🔴 API Error (Profile), using mock.", error);
    return getProfileMock();
  }
};

export const getStats = async (): Promise<ProfileStats> => {
  if (import.meta.env.VITE_USE_MOCKS === "true") {
    console.log("🔶 Modo Mock: Profile Stats");
    return getStatsMock();
  }

  try {
    return await getStatsApi();
  } catch (error) {
    console.warn("🔴 API Error (Profile Stats), using mock.", error);
    return getStatsMock();
  }
};

export const getSessions = async (): Promise<SessionInfo[]> => {
  if (import.meta.env.VITE_USE_MOCKS === "true") {
    console.log("🔶 Modo Mock: Sessions");
    return getSessionsMock();
  }

  try {
    return await getSessionsApi();
  } catch (error) {
    console.warn("🔴 API Error (Sessions), using mock.", error);
    return getSessionsMock();
  }
};

export const updateProfile = async (data: UpdateProfileData): Promise<UserProfile> => {
  if (import.meta.env.VITE_USE_MOCKS === "true") {
    return updateProfileMock(data);
  }

  try {
    return await updateProfileApi(data);
  } catch (error) {
    console.warn("🔴 API Error (Update Profile), using mock.", error);
    return updateProfileMock(data);
  }
};

export const updatePassword = async (data: UpdatePasswordData): Promise<void> => {
  if (import.meta.env.VITE_USE_MOCKS === "true") {
    return updatePasswordMock(data);
  }

  try {
    return await updatePasswordApi(data);
  } catch (error) {
    console.warn("🔴 API Error (Update Password), using mock.", error);
    return updatePasswordMock(data);
  }
};

export const logoutAllSessions = async (): Promise<void> => {
  if (import.meta.env.VITE_USE_MOCKS === "true") {
    return logoutAllSessionsMock();
  }

  try {
    return await logoutAllSessionsApi();
  } catch (error) {
    console.warn("🔴 API Error (Logout All), using mock.", error);
    return logoutAllSessionsMock();
  }
};