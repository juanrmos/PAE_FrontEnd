import { Link, NavLink, Outlet } from "react-router-dom";
import { useMemo, useState } from "react";
import { Home, Users } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

type User = { id: string; nombre: string };
const MOCK_USERS: User[] = [
  { id: "5XG8Z", nombre: "Juana Pérez" },
  { id: "7KQ2M", nombre: "Carlos Díaz" },
  { id: "91ABT", nombre: "María García" },
  { id: "L0MN3", nombre: "Ana Torres" },
];

export default function GroupsModuleLayout() {
  const [role, setRole] = useState<"Estudiante" | "Docente">("Estudiante");
  const [q, setQ] = useState("");

  const sugerencias = useMemo(() => {
    if (!q.trim()) return [] as User[];
    const s = q.trim().toLowerCase();
    return MOCK_USERS.filter((u) => u.nombre.toLowerCase().includes(s) || u.id.toLowerCase().includes(s));
  }, [q]);

  const onAdd = (u: User) => {
    toast.success(`Solicitud enviada a ${u.nombre}`);
  };

  const { data: counts, isLoading: loadingCounts } = useQuery<{ mis: number; publicos: number; foros: number }>({
    queryKey: ["groups-counts"],
    queryFn: async () => {
      const res = await fetch("/api/groups/counts");
      if (!res.ok) throw new Error("Failed to load counts");
      return res.json();
    },
  });

  return (
    <div className="md:flex">
      {/* Barra secundaria (nivel 2) */}
      <aside className="md:fixed md:inset-y-0 md:left-72 md:w-64 md:border-r md:border-neutral-200 md:bg-white">
        <div className="hidden md:block p-4">
          <Link to="/home" className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-contrast hover:opacity-90"><Home className="h-4 w-4" /> Volver a Inicio</Link>
          <h2 className="flex items-center gap-2 text-lg font-bold text-contrast"><Users className="h-5 w-5" /> Comunidades</h2>
          <nav className="mt-4 space-y-1 text-sm">
            <NavLink to="/grupos" end className={({ isActive }) => cn("flex items-center justify-between rounded-xl px-3 py-2 font-medium", isActive ? "bg-contrast/10 text-contrast" : "text-neutral-700 hover:bg-neutral-50")}>
              {({ isActive }) => (
                <>
                  <span className="mr-2">Mis Comunidades</span>
                  {loadingCounts ? (
                    <Skeleton className={cn("h-5 w-10 rounded bg-neutral-200", isActive && "bg-neutral-300")} />
                  ) : (
                    <span className={cn("rounded-full px-2 py-0.5 text-xs font-semibold", isActive ? "bg-brand text-white" : "bg-brand/10 text-brand")}>{counts?.mis ?? 0}</span>
                  )}
                </>
              )}
            </NavLink>
            <NavLink to="/grupos/publicos" className={({ isActive }) => cn("flex items-center justify-between rounded-xl px-3 py-2 font-medium", isActive ? "bg-contrast/10 text-contrast" : "text-neutral-700 hover:bg-neutral-50")}>
              {({ isActive }) => (
                <>
                  <span className="mr-2">Comunidades Públicas</span>
                  {loadingCounts ? (
                    <Skeleton className={cn("h-5 w-10 rounded bg-neutral-200", isActive && "bg-neutral-300")} />
                  ) : (
                    <span className={cn("rounded-full px-2 py-0.5 text-xs font-semibold", isActive ? "bg-brand text-white" : "bg-brand/10 text-brand")}>{counts?.publicos ?? 0}</span>
                  )}
                </>
              )}
            </NavLink>
            <NavLink to="/grupos/foros" className={({ isActive }) => cn("flex items-center justify-between rounded-xl px-3 py-2 font-medium", isActive ? "bg-contrast/10 text-contrast" : "text-neutral-700 hover:bg-neutral-50")}>
              {({ isActive }) => (
                <>
                  <span className="mr-2">Foros Públicos</span>
                  {loadingCounts ? (
                    <Skeleton className={cn("h-5 w-10 rounded bg-neutral-200", isActive && "bg-neutral-300")} />
                  ) : (
                    <span className={cn("rounded-full px-2 py-0.5 text-xs font-semibold", isActive ? "bg-brand text-white" : "bg-brand/10 text-brand")}>{counts?.foros ?? 0}</span>
                  )}
                </>
              )}
            </NavLink>
            <NavLink to="/grupos/recursos" className={({ isActive }) => cn("block rounded-xl px-3 py-2 font-medium", isActive ? "bg-contrast/10 text-contrast" : "text-neutral-700 hover:bg-neutral-50")}>Recursos</NavLink>
          </nav>
        </div>
      </aside>

      <section className="w-full md:pl-[calc(72px+16rem)]">
        {/* Encabezado con volver, título, rol y búsqueda global */}
        <div className="relative flex flex-col gap-4 border-b border-neutral-200 bg-white px-4 py-6 md:px-8">
          <div className="pointer-events-none absolute right-4 top-0 h-24 w-24 rounded-full bg-[radial-gradient(theme(colors.brand.DEFAULT)_0%,transparent_60%)] opacity-30" />
          <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
            <div className="flex items-center gap-3">
              <Link to="/home" className="inline-flex items-center gap-2 text-sm font-semibold text-contrast hover:opacity-90"><Home className="h-4 w-4" /> Volver a Inicio</Link>
              <h1 className="text-xl font-bold text-contrast">Comunidades y Grupos de Estudio</h1>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-neutral-700">Rol</label>
              <select value={role} onChange={(e) => setRole(e.target.value as any)} className="rounded-lg border border-neutral-200 px-3 py-2 text-sm">
                <option>Estudiante</option>
                <option>Docente</option>
              </select>
            </div>
          </div>

          <div className="relative">
            <label className="mb-2 block text-sm font-medium text-contrast">Buscar por nombre o ID único</label>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Ej: Juana o 5XG8Z" className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 outline-none transition focus:border-contrast focus:ring-2 focus:ring-contrast/20" />
            {!!sugerencias.length && (
              <div className="absolute z-20 mt-2 w-full rounded-xl border border-neutral-200 bg-white p-2 shadow-sm">
                {sugerencias.map((u) => (
                  <div key={u.id} className="flex items-center justify-between rounded-lg px-2 py-2 hover:bg-neutral-50">
                    <div>
                      <div className="font-medium text-contrast">{u.nombre}</div>
                      <div className="text-xs text-neutral-600">ID: {u.id}</div>
                    </div>
                    <button onClick={() => onAdd(u)} className="rounded-lg bg-brand px-3 py-1.5 text-sm font-semibold text-white hover:bg-brand/90">Agregar amigo</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="px-4 py-6 md:px-8">
          <Outlet />
        </div>
      </section>
    </div>
  );
}
