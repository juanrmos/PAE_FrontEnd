import { RequestHandler } from "express";

// Types for responses
export interface GroupSummary {
  id: string;
  nombre: string;
  progreso?: number; // for "my" communities
  materia?: string;
  descripcion?: string;
  miembros?: number;
  documentos?: number;
  mensajes?: number;
  imagen?: string;
}

export interface MyGroupsResponse {
  groups: GroupSummary[];
}

export interface PublicGroupsResponse {
  groups: GroupSummary[];
}

export interface GroupFileItem {
  id: string;
  titulo: string;
  autor: string;
  sizeKB: number;
}

export interface GroupFilesResponse {
  files: GroupFileItem[];
}

export interface GroupAnalyticsResponse {
  metrics: {
    estudiantesTotal: number;
    activosAhora: number;
    documentos: number;
    preguntas: number;
  };
  miembros: { id: string; nombre: string; rol: "estudiante" | "docente" }[];
}

export interface GroupsCountsResponse {
  mis: number;
  publicos: number;
  foros: number;
}

// Chat types and in-memory store for realtime-ready polling
export interface ChatMessage {
  id: string;
  autor: string;
  rol: "estudiante" | "docente";
  contenido: string;
  ts: number;
}

export interface GroupChatResponse {
  messages: ChatMessage[];
}

const messagesByGroup: Record<string, ChatMessage[]> = {
  g1: [
    { id: "m1", autor: "Prof. Carlos", rol: "docente", contenido: "Bienvenidos al grupo. Revisen la guía 1.", ts: Date.now() - 600000 },
    { id: "m2", autor: "Juana", rol: "estudiante", contenido: "Gracias profe, ya la descargué.", ts: Date.now() - 300000 },
  ],
  g2: [],
  g3: [],
};

// Public forums (in-memory)
export interface ForoPregunta { id: string; titulo: string; cuerpo: string; etiquetas: string[]; votos: number; respondida: boolean; creadaEn: number }
const forumsPublic: ForoPregunta[] = [];

// Demo in-memory dataset
const myGroups: GroupSummary[] = [
  { id: "g1", nombre: "Matemáticas I", progreso: 86, materia: "Cálculo diferencial", descripcion: "Grupo para reforzar conceptos clave y resolver dudas semanales.", miembros: 18, documentos: 156, mensajes: 24 },
  { id: "g2", nombre: "Química Básica", progreso: 62, materia: "Estructura atómica", descripcion: "Apuntes, guías y prácticas de laboratorio.", miembros: 12, documentos: 87, mensajes: 12 },
  { id: "g3", nombre: "Historia Moderna", progreso: 41, materia: "Revoluciones del s. XIX", descripcion: "Lecturas guiadas y debates históricos.", miembros: 21, documentos: 42, mensajes: 9 },
];

const publicGroups: GroupSummary[] = [
  { id: "g1", nombre: "Matemáticas Avanzadas", miembros: 128, imagen: "https://picsum.photos/seed/mate/400/200" },
  { id: "g2", nombre: "Historia Universal", miembros: 76, imagen: "https://picsum.photos/seed/hist/400/200" },
  { id: "g3", nombre: "Programación en JS", miembros: 210, imagen: "https://picsum.photos/seed/js/400/200" },
];

const filesByGroup: Record<string, GroupFileItem[]> = {
  g1: [
    { id: "p1", titulo: "Guía de Integrales", autor: "Juana", sizeKB: 842 },
    { id: "p2", titulo: "Ejercicios Semanales #3", autor: "Carlos", sizeKB: 512 },
  ],
  g2: [
    { id: "p3", titulo: "Tabla Periódica Interactiva", autor: "María", sizeKB: 1042 },
  ],
  g3: [
    { id: "p4", titulo: "Revoluciones del XIX", autor: "Ana", sizeKB: 678 },
  ],
};

const analyticsByGroup: Record<string, GroupAnalyticsResponse> = {
  g1: {
    metrics: { estudiantesTotal: 24, activosAhora: 3, documentos: 12, preguntas: 56 },
    miembros: [
      { id: "u1", nombre: "Juana Pérez", rol: "estudiante" },
      { id: "u2", nombre: "Carlos Díaz", rol: "estudiante" },
      { id: "u3", nombre: "Ana Torres", rol: "docente" },
    ],
  },
  g2: {
    metrics: { estudiantesTotal: 18, activosAhora: 1, documentos: 7, preguntas: 22 },
    miembros: [
      { id: "u4", nombre: "María García", rol: "estudiante" },
      { id: "u5", nombre: "Luis Fernández", rol: "estudiante" },
    ],
  },
  g3: {
    metrics: { estudiantesTotal: 31, activosAhora: 4, documentos: 16, preguntas: 71 },
    miembros: [
      { id: "u6", nombre: "Pedro López", rol: "docente" },
      { id: "u7", nombre: "Lucía Gómez", rol: "estudiante" },
    ],
  },
};

export const getMyGroups: RequestHandler = (_req, res) => {
  const response: MyGroupsResponse = { groups: myGroups };
  res.json(response);
};

export const getPublicGroups: RequestHandler = (_req, res) => {
  const response: PublicGroupsResponse = { groups: publicGroups };
  res.json(response);
};

export const getGroupFiles: RequestHandler = (req, res) => {
  const id = req.params.id ?? "";
  const files = filesByGroup[id] ?? [];
  const response: GroupFilesResponse = { files };
  res.json(response);
};

export const getGroupAnalytics: RequestHandler = (req, res) => {
  const id = req.params.id ?? "";
  const data = analyticsByGroup[id] ?? {
    metrics: { estudiantesTotal: 0, activosAhora: 0, documentos: 0, preguntas: 0 },
    miembros: [],
  } satisfies GroupAnalyticsResponse;
  res.json(data);
};

export const getGroupsCounts: RequestHandler = (_req, res) => {
  const response: GroupsCountsResponse = {
    mis: myGroups.length,
    publicos: publicGroups.length,
    foros: 5,
  };
  res.json(response);
};

export const getGroupChat: RequestHandler = (req, res) => {
  const id = req.params.id ?? "";
  const messages = messagesByGroup[id] ?? [];
  const response: GroupChatResponse = { messages };
  res.json(response);
};

export const postGroupChat: RequestHandler = (req, res) => {
  const id = req.params.id ?? "";
  const { contenido, autor, rol } = req.body || {};
  if (typeof contenido !== "string" || !contenido.trim()) {
    return res.status(400).json({ error: "contenido requerido" });
  }
  const message: ChatMessage = {
    id: Math.random().toString(36).slice(2),
    autor: typeof autor === "string" && autor.trim() ? autor.slice(0, 80) : "Anónimo",
    rol: rol === "docente" ? "docente" : "estudiante",
    contenido: contenido.slice(0, 2000),
    ts: Date.now(),
  };
  (messagesByGroup[id] ||= []).push(message);
  res.json({ ok: true, message });
};

export const getPublicForums: RequestHandler = (_req, res) => {
  res.json({ posts: forumsPublic });
};

export const postPublicForum: RequestHandler = (req, res) => {
  const { titulo, cuerpo, etiquetas } = req.body || {};
  if (!titulo || !cuerpo) return res.status(400).json({ error: "faltan campos" });
  const item: ForoPregunta = {
    id: Math.random().toString(36).slice(2),
    titulo: String(titulo).slice(0, 200),
    cuerpo: String(cuerpo).slice(0, 2000),
    etiquetas: Array.isArray(etiquetas) ? etiquetas.slice(0, 10).map((e) => String(e).slice(0, 30)) : [],
    votos: 0,
    respondida: false,
    creadaEn: Date.now(),
  };
  forumsPublic.unshift(item);
  res.json({ ok: true, item });
};
