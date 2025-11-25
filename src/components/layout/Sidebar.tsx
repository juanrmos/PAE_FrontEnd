import { NavLink, Link } from "react-router-dom";
import { cn } from "../../utils/cn";
import { ScrollArea } from "../../desingSystem/primitives";
import { LucideIcon } from "lucide-react"; // Importar tipo

// Definimos la estructura de un ítem de menú
export interface SidebarItem {
  label: string;
  to: string;
  icon: LucideIcon;
}

interface SidebarProps {
  className?: string;
  onClose?: () => void;
  items: SidebarItem[]; // ✅ Recibe los items explícitamente
  title?: string;       // ✅ Título opcional (ej. "Panel Docente")
}

export function Sidebar({ className, onClose, items, title = "Pulse" }: SidebarProps) {
  return (
    <aside className={cn("flex h-full w-72 flex-col border-r border-neutral-200 bg-neutral-white", className)}>
      <div className="p-6 pb-2">
        <Link to="/" onClick={onClose} className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-brand-action" />
          <span className="text-xl font-extrabold text-primary-contrast">{title}</span>
        </Link>
      </div>

      <ScrollArea className="flex-1 px-4 py-4">
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