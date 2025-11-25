import { api } from "../../../services/api";

export interface DashboardStats {
  activeStudents: number;
  totalRepositories: number;
  pendingEvaluations: number;
  studentGrowth: number; // Porcentaje
}

// --- MOCK ---
const MOCK_STATS: DashboardStats = {
  activeStudents: 142,
  totalRepositories: 8,
  pendingEvaluations: 5,
  studentGrowth: 12,
};

const getStatsMock = async (): Promise<DashboardStats> => {
  return new Promise((resolve) => setTimeout(() => resolve(MOCK_STATS), 1000));
};

// --- API REAL ---
const getStatsApi = async (): Promise<DashboardStats> => {
  const response = await api.get("/teacher/stats");
  return response.data;
};

// --- FALLBACK ---
export const getTeacherStats = async (): Promise<DashboardStats> => {
  if (import.meta.env.VITE_USE_MOCKS === "true") return getStatsMock();

  try {
    return await getStatsApi();
  } catch (error) {
    console.warn("API Error (Stats), using mock.", error);
    return getStatsMock();
  }
};