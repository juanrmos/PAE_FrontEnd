import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

type Group = {
  id: string;
  nombre: string;
  progreso: number;
  materia: string;
  descripcion: string;
  miembros?: number;
  documentos?: number;
  mensajes?: number;
};

export default function MyCommunities() {
  const color = (p: number) => (p >= 80 ? "bg-green-600" : p >= 50 ? "bg-brand" : "bg-[#D93636]");
  const width = (p: number) => `${Math.min(100, Math.max(0, p))}%`;

  const { data, isLoading, isError } = useQuery<{ groups: Group[] }>({
    queryKey: ["my-groups"],
    queryFn: async () => {
      const res = await fetch("/api/groups/my");
      if (!res.ok) throw new Error("Failed to load");
      return res.json();
    },
  });

  return (
    <div>
      <div className="mb-2">
        <h2 className="text-lg font-semibold text-contrast">Mis Comunidades</h2>
        <p className="text-sm text-neutral-600">Gestiona tus comunidades de estudio colaborativo</p>
      </div>

      {isError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">No se pudo cargar. Intenta de nuevo.</div>
      )}

      <div className="mt-4 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {isLoading && (
          <>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="overflow-hidden rounded-2xl border border-neutral-200">
                <Skeleton className="h-16 w-full bg-neutral-200" />
                <div className="p-4">
                  <Skeleton className="h-5 w-2/3 bg-neutral-200" />
                  <Skeleton className="mt-2 h-3 w-1/2 bg-neutral-200" />
                  <Skeleton className="mt-4 h-2 w-full bg-neutral-200" />
                  <Skeleton className="mt-2 h-3 w-12 bg-neutral-200" />
                </div>
              </div>
            ))}
          </>
        )}

        {!isLoading && data?.groups.map((g) => (
          <Link key={g.id} to={`/grupos/${g.id}`} className="overflow-hidden rounded-2xl border border-neutral-200 hover:bg-neutral-50">
            <div className="h-16 w-full bg-gradient-to-r from-contrast to-brand" />
            <div className="p-4">
              <div className="font-semibold text-contrast">{g.nombre}</div>
              <div className="text-xs text-neutral-600">Materia: {g.materia}</div>
              <p className="mt-1 text-sm text-neutral-700">{g.descripcion}</p>
              <div className="mt-3 text-xs font-medium text-neutral-700">Tu Progreso</div>
              <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-neutral-200">
                <div className={`${color(g.progreso)} h-full`} style={{ width: width(g.progreso) }} />
              </div>
              <div className="mt-1 text-xs text-neutral-600">{g.progreso}%</div>
              <div className="mt-3 flex items-center justify-between text-xs text-neutral-700">
                <div className="flex items-center gap-3">
                  <span>💬 {g.mensajes ?? 0}</span>
                  <span>🗂�� {g.documentos ?? 0}</span>
                  <span>👥 {g.miembros ?? 0}</span>
                </div>
                <span className="rounded-lg bg-contrast/10 px-2 py-0.5 font-semibold text-contrast">Propietario</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
