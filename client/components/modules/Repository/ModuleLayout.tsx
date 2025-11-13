import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { LibraryBig } from "lucide-react";
import { cn } from "@/lib/utils";

export default function RepositoryModuleLayout() {
  const [role, setRole] = useState<"docente" | "estudiante">(() => (localStorage.getItem("role") as any) || "estudiante");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "role") setRole((e.newValue as any) || "estudiante");
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    if (location.pathname === "/repositorio") {
      if (role === "docente") navigate("/repositorio/mis", { replace: true });
      else navigate("/repositorio/populares", { replace: true });
    }
  }, [role, location.pathname, navigate]);

  return (
    <div className="md:flex">
      {/* Barra secundaria (nivel 2) */}
      <aside className="md:fixed md:inset-y-0 md:left-0 md:w-64 md:border-r md:border-neutral-200 md:bg-white">
        <div className="hidden md:block p-4">
          <Link to="/home" className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-contrast hover:opacity-90"><Home className="h-4 w-4" /> Volver a Inicio</Link>
          <h2 className="flex items-center gap-2 text-lg font-bold text-contrast"><LibraryBig className="h-5 w-5" /> Repositorio Académico</h2>
          <nav className="mt-4 space-y-1 text-sm">
            <NavLink to="/repositorio/populares" end className={({ isActive }) => cn("block rounded-xl px-3 py-2 font-medium", isActive ? "bg-contrast/10 text-contrast" : "text-neutral-700 hover:bg-neutral-50")}>Repositorios Populares</NavLink>
            <NavLink to="/repositorio/mis" className={({ isActive }) => cn("block rounded-xl px-3 py-2 font-medium", isActive ? "bg-contrast/10 text-contrast" : "text-neutral-700 hover:bg-neutral-50")}>Mis Repositorios</NavLink>
            <NavLink to="/repositorio/buscar" className={({ isActive }) => cn("block rounded-xl px-3 py-2 font-medium", isActive ? "bg-contrast/10 text-contrast" : "text-neutral-700 hover:bg-neutral-50")}>Buscador Global</NavLink>
            <NavLink to="/repositorio/favoritos" className={({ isActive }) => cn("block rounded-xl px-3 py-2 font-medium", isActive ? "bg-contrast/10 text-contrast" : "text-neutral-700 hover:bg-neutral-50")}>Favoritos</NavLink>
          </nav>
        </div>
      </aside>

      <section className="w-full md:pl-64">
        <div className="relative flex flex-col gap-4 border-b border-neutral-200 bg-white px-4 py-6 md:px-8">
          <div className="pointer-events-none absolute right-4 top-0 h-24 w-24 rounded-full bg-[radial-gradient(theme(colors.brand.DEFAULT)_0%,transparent_60%)] opacity-30" />
          <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
            <div>
              <h1 className="text-xl font-bold text-contrast">Repositorio Académico</h1>
            </div>
            <div className="text-sm text-neutral-700">Rol: <span className="font-semibold text-contrast">{role === "docente" ? "Docente" : "Estudiante"}</span></div>
          </div>
        </div>

        <div className="px-4 py-6 md:px-8">
          <Outlet />
        </div>
      </section>
    </div>
  );
}
