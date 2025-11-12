import { RequestHandler } from "express";

export interface RepoItem {
  id: string;
  titulo: string;
  docente: string;
  temas: string[];
  descargas: number;
  vistas: number;
}

export interface PopularReposResponse { repos: RepoItem[] }
export interface MyReposResponse { repos: { id: string; nombre: string; fecha: string; estado: "Publicado" | "Borrador" }[] }

const popular: RepoItem[] = [
  { id: "r1", titulo: "Introducción al Cálculo", docente: "Dra. Elena Ríos", temas: ["matemáticas", "cálculo"], descargas: 1523, vistas: 4820 },
  { id: "r2", titulo: "Física Cuántica: Conceptos Clave", docente: "Prof. Javier Soto", temas: ["física", "cuántica"], descargas: 980, vistas: 2130 },
  { id: "r3", titulo: "Gramática Española Avanzada", docente: "Mtra. Lucía Prado", temas: ["lengua", "gramática"], descargas: 712, vistas: 1695 },
  { id: "r4", titulo: "Química Orgánica I", docente: "Dr. Martín Ledesma", temas: ["química", "orgánica"], descargas: 1230, vistas: 3055 },
  { id: "r5", titulo: "Historia de América Latina", docente: "Lic. Sofía Campos", temas: ["historia", "américa"], descargas: 645, vistas: 1420 },
  { id: "r6", titulo: "Programación en JavaScript", docente: "Ing. Diego Mena", temas: ["programación", "javascript"], descargas: 2045, vistas: 5210 },
];

const my: MyReposResponse["repos"] = [
  { id: "t1", nombre: "Guía de Laboratorio - Química", fecha: "2024-10-26", estado: "Publicado" },
  { id: "t2", nombre: "Ejercicios de Álgebra", fecha: "2024-10-25", estado: "Borrador" },
  { id: "t3", nombre: "Lecturas de Historia Moderna", fecha: "2024-09-10", estado: "Publicado" },
];

export const getPopular: RequestHandler = (_req, res) => {
  const response: PopularReposResponse = { repos: popular };
  res.json(response);
};

export const getMyRepos: RequestHandler = (_req, res) => {
  const response: MyReposResponse = { repos: my };
  res.json(response);
};

export const saveRepo: RequestHandler = (req, res) => {
  // Simulate save OK
  res.status(200).json({ message: "Repositorio guardado" });
};
