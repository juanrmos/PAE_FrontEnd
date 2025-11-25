import { 
  BarChart3, FolderOpen, Users, Globe, Star, Search, BookOpen 
} from "lucide-react";
import type { SidebarItem } from "../components/layout/Sidebar";

export const TEACHER_MENU: SidebarItem[] = [
  { label: "Dashboard", to: "/docente", icon: BarChart3 },
  { label: "Mis Repositorios", to: "/docente/repositorios", icon: FolderOpen },
  { label: "Mis Grupos", to: "/docente/grupos", icon: Users },
];

export const STUDENT_MENU: SidebarItem[] = [
  { label: "Explorar", to: "/estudiante/explorar", icon: Globe },
  { label: "Mis Recursos", to: "/estudiante/biblioteca", icon: Star },
  { label: "Recursos de Grupo", to: "/estudiante/grupos/recursos", icon: FolderOpen },
  // { label: "Mis Comunidades", to: "/estudiante/grupos/mis-grupos", icon: Users },
];