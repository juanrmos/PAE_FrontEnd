import { api } from "../../../services/api";

export interface Group {
  id: string;
  name: string;
  subject: string;
  membersCount: number;
  nextSession?: string;
}

const MOCK_GROUPS: Group[] = [
  { id: "1", name: "Grupo A - Matemáticas", subject: "Álgebra", membersCount: 24, nextSession: "Lunes 10:00 AM" },
  { id: "2", name: "Taller de Historia", subject: "Historia", membersCount: 15 },
];

export const getTeacherGroups = async (): Promise<Group[]> => {
  if (import.meta.env.VITE_USE_MOCKS === "true") {
    return new Promise((resolve) => setTimeout(() => resolve(MOCK_GROUPS), 1000));
  }
  const response = await api.get("/groups/teacher");
  return response.data;
};