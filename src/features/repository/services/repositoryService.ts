import { api } from "../../../services/api";

// Interfaces
export interface Repository {
  id: string;
  title: string;
  author: string;
  role: string;
  views: number;
  downloads: number;
  tags: string[];
  isFavorite: boolean;
  updatedAt: string;
}

// 1. MOCKS
const MOCK_REPOS: Repository[] = [
  {
    id: "1",
    title: "Matemáticas I: Álgebra Lineal",
    author: "Prof. Carlos",
    role: "Docente",
    views: 1205,
    downloads: 340,
    tags: ["Matemáticas", "Álgebra"],
    isFavorite: false,
    updatedAt: "10/03/2024",
  },
  {
    id: "2",
    title: "Historia Universal: Siglo XX",
    author: "Dra. Ana María",
    role: "Docente",
    views: 890,
    downloads: 120,
    tags: ["Historia", "Humanidades"],
    isFavorite: true,
    updatedAt: "10/03/2024",
  },
];

const MY_MOCK_REPOS: Repository[] = [
  {
    id: "101",
    title: "Borrador: Física II",
    author: "Tú",
    role: "Docente",
    views: 0,
    downloads: 0,
    tags: ["Física"],
    isFavorite: false,
    updatedAt: "Ahora",
  },
  {
    id: "1",
    title: "Álgebra Lineal: Matrices y Vectores",
    author: "Tú",
    role: "Docente",
    views: 1250,
    downloads: 340,
    tags: ["Matemáticas"],
    isFavorite: false,
    updatedAt: "10/03/2024",
  }
];

export const getMyRepositories = async (): Promise<Repository[]> => {
  if (import.meta.env.VITE_USE_MOCKS === "true") {
    return new Promise((resolve) => setTimeout(() => resolve(MY_MOCK_REPOS), 1000));
  }
  
  try {
    const response = await api.get("/repository/mine");
    return response.data;
  } catch (error) {
    console.warn("API Error (My Repos), using mock.", error);
    return new Promise((resolve) => resolve(MY_MOCK_REPOS));
  }
};

// 2. Funciones Mock
const getPopularMock = async (): Promise<Repository[]> => {
  return new Promise((resolve) => setTimeout(() => resolve(MOCK_REPOS), 1000));
};

// 3. Funciones Reales
const getPopularApi = async (): Promise<Repository[]> => {
  const response = await api.get("/repository/popular");
  return response.data;
};

// 4. Main Export (Fallback Logic)
export const getPopularRepositories = async (): Promise<Repository[]> => {
  if (import.meta.env.VITE_USE_MOCKS === "true") return getPopularMock();

  try {
    return await getPopularApi();
  } catch (error) {
    console.warn("API Error (Repository), using mock fallback.", error);
    return getPopularMock();
  }
};