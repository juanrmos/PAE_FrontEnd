import { Link, NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Home,
  BookOpen,
  ClipboardList,
  LibraryBig,
  Users,
  BarChart3,
  CalendarCheck2,
  UserCog,
  X,
} from "lucide-react";

export type UserRole = "estudiante" | "docente" | "admin";

const items = [
  { label: "Inicio", to: "/home", icon: Home, color: "text-brand", roles: ["estudiante", "docente", "admin"] },
  { label: "Cursos", to: "/cursos", icon: BookOpen, color: "text-contrast", roles: ["estudiante", "docente", "admin"] },
  { label: "Evaluaciones", to: "/evaluaciones", icon: ClipboardList, color: "text-brand", roles: ["estudiante", "docente", "admin"] },
  { label: "Repositorio Académico", to: "/repositorio", icon: LibraryBig, color: "text-contrast", roles: ["estudiante", "docente", "admin"] },
  { label: "Grupos de Estudio", to: "/grupos", icon: Users, color: "text-brand", roles: ["estudiante", "docente", "admin"] },
  { label: "Grupos Públicos", to: "/grupos-publicos", icon: Users, color: "text-contrast", roles: ["estudiante", "docente", "admin"] },
  { label: "Dashboard Docente", to: "/docente", icon: BarChart3, color: "text-contrast", roles: ["docente", "admin"] },
  { label: "Planificación y Hábitos", to: "/habitos", icon: CalendarCheck2, color: "text-brand", roles: ["estudiante"] },
  { label: "Mi Perfil / Configuración", to: "/profile", icon: UserCog, color: "text-black", roles: ["estudiante", "docente", "admin"] },
] as const;

export function Sidebar({ role = "estudiante", mobile, onClose }: { role?: UserRole; mobile?: boolean; onClose?: () => void }) {
  const location = useLocation();
  const content = (
    <div className="flex h-full w-72 flex-col bg-white px-4 py-4">
      <div className="mb-6 flex items-center justify-between px-2">
        <Link to="/home" className="inline-flex items-center gap-2 text-xl font-extrabold text-contrast">
          <span className="inline-block h-7 w-7 rounded-lg bg-brand" />
          <span>Pulse</span>
        </Link>
        {mobile && (
          <button aria-label="Cerrar" onClick={onClose} className="rounded-lg p-2 hover:bg-neutral-100">
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
      <nav className="space-y-1">
        {items
          .filter((it) => it.roles.includes(role))
          .map((it) => {
            const Icon = it.icon;
            const active = location.pathname === it.to;
            return (
              <NavLink
                key={it.to}
                to={it.to}
                className={cn(
                  "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium",
                  active ? "bg-neutral-100 text-contrast" : "text-neutral-700 hover:bg-neutral-50",
                )}
                onClick={mobile ? onClose : undefined}
              >
                <Icon className={cn("h-5 w-5", it.color)} />
                <span>{it.label}</span>
              </NavLink>
            );
          })}
      </nav>
      <div className="mt-auto px-3 pt-6 text-xs text-neutral-500">© {new Date().getFullYear()} Pulse</div>
    </div>
  );

  if (!mobile) return <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-neutral-200 bg-white md:block">{content}</aside>;

  return (
    <div className="fixed inset-0 z-50 flex md:hidden">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative ml-auto h-full w-72 animate-in slide-in-from-right duration-200 bg-white shadow-xl">
        {content}
      </div>
    </div>
  );
}
