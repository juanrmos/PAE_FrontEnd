// src/config/menus.ts
import { 
  BarChart3, FolderOpen, Users, Globe, Star, 
  LibraryBig, MessageSquare, ClipboardList, 
  Gamepad2, Zap
} from "lucide-react";
import type { SidebarItem } from "../components/layout/Sidebar";

// --- 1. MENÚS PRINCIPALES (DASHBOARD) ---

export const TEACHER_MAIN_MENU: SidebarItem[] = [
  { label: "Dashboard", to: "/docente", icon: BarChart3 },
  { label: "Biblioteca de Repositorios", to: "/docente/repositorios", icon: LibraryBig }, 
  { label: "Comunidades", to: "/docente/grupos", icon: Users },
  { label: "Simulacros", to: "/docente/aprendizaje/simulacros", icon: ClipboardList },
  { label: "Desafíos", to: "/docente/aprendizaje/desafios", icon: Gamepad2 },
  { label: "Trivia Diaria", to: "/docente/aprendizaje/trivia", icon: Zap },
];

export const STUDENT_MAIN_MENU: SidebarItem[] = [
  { label: "Explorar", to: "/estudiante/explorar", icon: Globe },
  { label: "Biblioteca de Repositorios", to: "/estudiante/repositorios", icon: LibraryBig },
  { label: "Comunidades", to: "/estudiante/grupos", icon: Users },
  { label: "Simulacros", to: "/estudiante/aprendizaje/simulacros", icon: ClipboardList },
  { label: "Desafíos", to: "/estudiante/aprendizaje/desafios", icon: Gamepad2 },
  { label: "Trivia Diaria", to: "/estudiante/aprendizaje/trivia", icon: Zap },
];

// --- 2. SUB-MENÚS: REPOSITORIO (Contextual) ---

export const REPO_MENU_TEACHER: SidebarItem[] = [
  { label: "Repositorios", to: "/docente/repositorios/explorar", icon: Globe },
  { label: "Mis Repositorios", to: "/docente/repositorios/mis-repos", icon: FolderOpen },
  { label: "Favoritos", to: "/docente/repositorios/favoritos", icon: Star },
];

export const REPO_MENU_STUDENT: SidebarItem[] = [
  { label: "Repositorios (Públicos)", to: "/estudiante/repositorios/explorar", icon: Globe },
  { label: "Favoritos", to: "/estudiante/biblioteca", icon: Star },
];

// --- 3. SUB-MENÚS: GRUPOS (Contextual) ---

export const GROUPS_MENU_TEACHER: SidebarItem[] = [
  { label: "Mis Comunidades", to: "/docente/grupos/mis-grupos", icon: Users },
  { label: "Explorar Comunidades", to: "/docente/grupos/explorar", icon: Globe },
  { label: "Foros", to: "/docente/grupos/foros", icon: MessageSquare },
  { label: "Mis Foros", to: "/docente/grupos/mis-foros", icon: ClipboardList },
];

export const GROUPS_MENU_STUDENT: SidebarItem[] = [
  { label: "Mis Comunidades", to: "/estudiante/grupos/mis-grupos", icon: Users },
  { label: "Explorar Comunidades", to: "/estudiante/grupos/explorar", icon: Globe },
  { label: "Foros Públicos", to: "/estudiante/grupos/foros", icon: MessageSquare },
  { label: "Mis Foros", to: "/estudiante/grupos/mis-foros", icon: ClipboardList },
];

// --- 4. SUB-MENÚ: ZONA DE APRENDIZAJE (Nuevo - Compartido) ---
// Nota: Este menú no se usa actualmente porque cada item va directo en el menú principal
// Pero lo dejamos por si en el futuro se quiere agrupar

export const LEARNING_MENU_TEACHER: SidebarItem[] = [
  { label: "Simulacros", to: "/docente/aprendizaje/simulacros", icon: ClipboardList },
  { label: "Desafíos", to: "/docente/aprendizaje/desafios", icon: Gamepad2 },
  { label: "Trivia Diaria", to: "/docente/aprendizaje/trivia", icon: Zap },
];

export const LEARNING_MENU_STUDENT: SidebarItem[] = [
  { label: "Simulacros", to: "/estudiante/aprendizaje/simulacros", icon: ClipboardList },
  { label: "Desafíos", to: "/estudiante/aprendizaje/desafios", icon: Gamepad2 },
  { label: "Trivia Diaria", to: "/estudiante/aprendizaje/trivia", icon: Zap },
];