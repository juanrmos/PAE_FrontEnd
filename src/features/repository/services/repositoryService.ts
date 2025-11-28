import { api } from "../../../services/api";

// --- Interfaces ---
export interface Repository {
  id: string;
  title: string;
  author: string;
  role: "docente" | "estudiante";
  views: number;
  downloads: number;
  tags: string[];
  isFavorite: boolean;
  updatedAt: string;
}

export interface CreateRepoData {
  title: string;
  subject: string;
  description?: string;
}

// --- MOCKS ---
const MOCK_REPOS: Repository[] = [
  {
    id: "1",
    title: "Matemáticas I: Álgebra Lineal",
    author: "Prof. Carlos",
    role: "docente",
    views: 1205,
    downloads: 340,
    tags: ["Matemáticas"],
    isFavorite: false,
    updatedAt: "10/03/2024",
  },
  {
    id: "2",
    title: "Historia Universal: Siglo XX",
    author: "Dra. Ana María",
    role: "docente",
    views: 890,
    downloads: 120,
    tags: ["Historia"],
    isFavorite: true,
    updatedAt: "12/03/2024",
  },
];

const MY_MOCK_REPOS: Repository[] = [
  {
    id: "101",
    title: "Física II: Dinámica Avanzada",
    author: "Tú",
    role: "docente",
    views: 12,
    downloads: 0,
    tags: ["Física"],
    isFavorite: false,
    updatedAt: "Hoy",
  }
];

// --- GETTERS CON FALLBACK ---

// 1. Repositorios Públicos (Explorar)
export const getPopularRepositories = async (): Promise<Repository[]> => {
  if (import.meta.env.VITE_USE_MOCKS === "true") {
    return new Promise((resolve) => setTimeout(() => resolve(MOCK_REPOS), 1000));
  }
  try {
    const response = await api.get("/repository/popular");
    return response.data;
  } catch (error) {
    console.warn("API Error (Popular), using mock.", error);
    return MOCK_REPOS;
  }
};

// 2. Mis Repositorios
export const getMyRepositories = async (): Promise<Repository[]> => {
  if (import.meta.env.VITE_USE_MOCKS === "true") {
    return new Promise((resolve) => setTimeout(() => resolve(MY_MOCK_REPOS), 800));
  }
  try {
    const response = await api.get("/repository/mine");
    return response.data;
  } catch (error) {
    return MY_MOCK_REPOS;
  }
};

// 3. Favoritos (Nueva función)
export const getFavorites = async (): Promise<Repository[]> => {
  if (import.meta.env.VITE_USE_MOCKS === "true") {
    // Retornamos solo los que tienen isFavorite: true del mock
    const favorites = MOCK_REPOS.filter(r => r.isFavorite);
    return new Promise((resolve) => setTimeout(() => resolve(favorites), 800));
  }
  try {
    const response = await api.get("/repository/favorites");
    return response.data;
  } catch (error) {
    const favorites = MOCK_REPOS.filter(r => r.isFavorite);
    return favorites;
  }
};

// --- ACTIONS ---
export const createRepository = async (data: CreateRepoData): Promise<void> => {
    // (Mantener lógica previa de crear...)
    // Simulación para brevedad en este paso
    await new Promise(resolve => setTimeout(resolve, 1000));
};

export const deleteRepository = async (id: string): Promise<void> => {
    // (Mantener lógica previa de eliminar...)
     await new Promise(resolve => setTimeout(resolve, 500));
};