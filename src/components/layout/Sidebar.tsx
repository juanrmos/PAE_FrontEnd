import { NavLink, Link } from "react-router-dom";
import { cn } from "../../utils/cn";
import { ScrollArea } from "../../desingSystem/primitives";
import { type LucideIcon, ArrowLeft, Home } from "lucide-react"; // Importamos Home y ArrowLeft

export interface SidebarItem {
  label: string;
  to: string;
  icon: LucideIcon;
}

interface SidebarProps {
  className?: string;
  onClose?: () => void;
  items?: SidebarItem[];
  title?: string;
  backRoute?: string; 
}

const DEFAULT_ITEMS: SidebarItem[] = [];

export function Sidebar({ 
  className, 
  onClose, 
  items = DEFAULT_ITEMS, 
  title = "Pulse", 
  backRoute 
}: SidebarProps) {
  return (
    <aside className={cn("flex h-full w-72 flex-col border-r border-neutral-200 bg-neutral-white", className)}>
      
      <div className="p-6 pb-2">
        {/* 1. Lógica de Encabezado: ¿Mostrar Volver o Logo Principal? */}
        {backRoute ? (
          <Link 
            to={backRoute} 
            onClick={onClose}
            className="flex items-center gap-2 text-neutral-600 hover:text-brand-action transition-colors mb-4 group"
          >
            <div className="h-8 w-8 rounded-lg bg-neutral-100 flex items-center justify-center group-hover:bg-brand-action/10">
              <Home className="h-4 w-4" /> {/* Casita */}
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-medium text-neutral-400">Volver a</span>
              <span className="text-sm font-bold">Inicio</span>
            </div>
          </Link>
        ) : (
          <Link to="/" onClick={onClose} className="flex items-center gap-2 mb-2">
            <div className="h-8 w-8 rounded-lg bg-brand-action" />
            <span className="text-xl font-extrabold text-primary-contrast">{title}</span>
          </Link>
        )}

        {/* Título del contexto si es submenú (Opcional, si title cambia) */}
        {backRoute && (
          <h2 className="text-xl font-bold text-primary-contrast px-1 mb-2">{title}</h2>
        )}
      </div>

      <ScrollArea className="flex-1 px-4 py-2">
        <nav className="flex flex-col gap-1">
          {items.map((item) => (
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
              <item.icon className={cn("h-5 w-5")} />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </ScrollArea>
    </aside>
  );
}