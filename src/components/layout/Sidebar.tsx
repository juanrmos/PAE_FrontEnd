import { Link, NavLink, useLocation } from "react-router-dom";
import {
  Home,
  BookOpen,
  ClipboardList,
  LibraryBig,
  Users,
  BarChart3,
  CalendarCheck2,
  UserCog,
  ArrowLeft,
  Search,
  Star,
  FolderOpen,
  Globe
} from "lucide-react";
import { cn } from "../../utils/cn";
import { ScrollArea } from "../../desingSystem/primitives/Scrollarea";

// --- Configuración de Menús ---

// 1. Menú Global (El principal)
const GLOBAL_ITEMS = [
  { label: "Inicio", to: "/home", icon: Home, roles: ["estudiante", "docente"] },
  { label: "Cursos", to: "/cursos", icon: BookOpen, roles: ["estudiante", "docente"] },
  { label: "Evaluaciones", to: "/evaluaciones", icon: ClipboardList, roles: ["estudiante", "docente"] },
  { label: "Repositorio Académico", to: "/repositorio", icon: LibraryBig, roles: ["estudiante", "docente"] },
  { label: "Grupos de Estudio", to: "/grupos", icon: Users, roles: ["estudiante", "docente"] },
  { label: "Planificación", to: "/habitos", icon: CalendarCheck2, roles: ["estudiante"] },
  { label: "Dashboard Docente", to: "/docente", icon: BarChart3, roles: ["docente"] },
  { label: "Configuración", to: "/profile", icon: UserCog, roles: ["estudiante", "docente"] },
];

// 2. Menú Contextual: Repositorio
const REPO_ITEMS = [
  { label: "Repositorios Populares", to: "/repositorio/populares", icon: Globe, roles: ["estudiante"] }, // Default estudiante
  { label: "Mis Repositorios", to: "/repositorio/mis-repos", icon: FolderOpen, roles: ["docente"] }, // Default docente
  { label: "Buscador Global", to: "/repositorio/buscar", icon: Search, roles: ["estudiante", "docente"] },
  { label: "Favoritos", to: "/repositorio/favoritos", icon: Star, roles: ["estudiante", "docente"] },
];

// 3. Menú Contextual: Comunidades (Grupos)
const GROUPS_ITEMS = [
  { label: "Mis Comunidades", to: "/grupos/mis-grupos", icon: Users, roles: ["estudiante", "docente"] },
  { label: "Comunidades Públicas", to: "/grupos/explorar", icon: Globe, roles: ["estudiante", "docente"] },
  { label: "Foros Públicos", to: "/grupos/foros", icon: ClipboardList, roles: ["estudiante", "docente"] },
];

interface SidebarProps {
  className?: string;
  onClose?: () => void; // Para cerrar en móvil
}

export function Sidebar({ className, onClose }: SidebarProps) {
  const location = useLocation();
  const pathname = location.pathname;
  

  const userRole = (localStorage.getItem("role") || "estudiante") as string;

  // Lógica de Selección de Menú
  let currentMenu = GLOBAL_ITEMS;
  let isContextual = false;
  let moduleTitle = "";
  let backLink = "/home";

  if (pathname.startsWith("/repositorio")) {
    currentMenu = REPO_ITEMS;
    isContextual = true;
    moduleTitle = "Repositorio Académico";
    backLink = "/home";
  } else if (pathname.startsWith("/grupos")) {
    currentMenu = GROUPS_ITEMS;
    isContextual = true;
    moduleTitle = "Comunidades";
    backLink = "/home";
  }

  return (
    <aside className={cn("flex h-full w-72 flex-col border-r border-neutral-200 bg-neutral-white", className)}>
      {/* Header del Sidebar */}
      <div className="p-6 pb-2">
        {isContextual ? (
          <div className="flex flex-col gap-4">
            {/* Botón Volver a Inicio (RQ121) */}
            <Link 
              to={backLink} 
              onClick={onClose}
              className="flex items-center gap-2 text-sm font-medium text-neutral-500 hover:text-brand-action transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver a Inicio
            </Link>
            {/* Título del Módulo */}
            <h2 className="text-xl font-bold text-primary-contrast">{moduleTitle}</h2>
          </div>
        ) : (
          /* Logo Principal */
          <Link to="/home" onClick={onClose} className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-brand-action" /> {/* Placeholder Logo */}
            <span className="text-xl font-extrabold text-primary-contrast">Pulse</span>
          </Link>
        )}
      </div>

      {/* Lista de Navegación con Scroll */}
      <ScrollArea className="flex-1 px-4 py-4">
        <nav className="flex flex-col gap-1">
          {currentMenu
            .filter((item) => item.roles.includes(userRole))
            .map((item) => {
              const isActive = pathname === item.to || pathname.startsWith(item.to + "/");
              
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onClose}
                  className={({ isActive }) => cn(
                    "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                    isActive 
                      ? "bg-primary-contrast/5 text-primary-contrast font-semibold shadow-sm" 
                      : "text-neutral-600 hover:bg-neutral-100 hover:text-primary-contrast"
                  )}
                >
                  {/* Icono con color dinámico */}
                  <item.icon className={cn(
                    "h-5 w-5 transition-colors",
                    isActive ? "text-brand-action" : "text-neutral-400 group-hover:text-brand-action"
                  )} />
                  {item.label}
                </NavLink>
              );
            })}
        </nav>
      </ScrollArea>

      {/* Footer del Sidebar (Opcional: Perfil rápido) */}
      <div className="border-t border-neutral-200 p-4">
        <div className="flex items-center gap-3 rounded-lg bg-neutral-50 p-3">
          <div className="h-8 w-8 rounded-full bg-primary-contrast/10" />
          <div className="flex flex-col">
            <span className="text-xs font-bold text-primary-contrast capitalize">{userRole}</span>
            <span className="text-[10px] text-neutral-500">Ver perfil</span>
          </div>
        </div>
      </div>
    </aside>
  );
}