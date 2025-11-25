import { api } from "../../../services/api";
import type { Repository } from "./repositoryService";

// --- MOCK DATA ---
const MOCK_FAVORITES: Repository[] = [
  {
    id: "2",
    title: "Historia Universal: Siglo XX",
    author: "Dra. Ana María",
    role: "Docente",
    views: 980,
    downloads: 120,
    tags: ["Historia", "Humanidades"],
    isFavorite: true,
    updatedAt: "12/03/2024",
  },
  {
    id: "5",
    title: "Química Orgánica: Fundamentos",
    author: "Ing. Roberto",
    role: "Docente",
    views: 450,
    downloads: 80,
    tags: ["Química", "Ciencias"],
    isFavorite: true,
    updatedAt: "20/03/2024",
  }
];

export const getFavorites = async (): Promise<Repository[]> => {
  if (import.meta.env.VITE_USE_MOCKS === "true") {
    return new Promise((resolve) => setTimeout(() => resolve(MOCK_FAVORITES), 800));
  }
  try {
    const response = await api.get("/student/favorites");
    return response.data;
  } catch (error) {
    console.warn("API Error (Favorites), using mock.", error);
    return MOCK_FAVORITES;
  }
};