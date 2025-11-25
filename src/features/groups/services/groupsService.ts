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

const MOCK_STUDENT_GROUPS: Group[] = [
  { id: "101", name: "Círculo de Matemáticas", subject: "Álgebra", membersCount: 45, nextSession: "Martes 4:00 PM" },
  { id: "102", name: "Debate Histórico", subject: "Historia", membersCount: 12 },
];

export const getStudentGroups = async (): Promise<Group[]> => {
  if (import.meta.env.VITE_USE_MOCKS === "true") {
    return new Promise((resolve) => setTimeout(() => resolve(MOCK_STUDENT_GROUPS), 1000));
  }
  const response = await api.get("/groups/student");
  return response.data;
};

export const getTeacherGroups = async (): Promise<Group[]> => {
  if (import.meta.env.VITE_USE_MOCKS === "true") {
    return new Promise((resolve) => setTimeout(() => resolve(MOCK_GROUPS), 1000));
  }
  const response = await api.get("/groups/teacher");
  return response.data;
};