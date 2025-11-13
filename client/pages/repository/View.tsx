import { Link, useLocation, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

export default function RepoView() {
  const { id } = useParams();
  const location = useLocation();
  const from = (location.state as any)?.from as string | undefined;
  let backTo = "/repositorio";
  let backLabel = "Volver al Módulo";
  if (from?.startsWith("/repositorio/populares") || from === "/repositorio") { backTo = "/repositorio/populares"; backLabel = "Volver a Populares"; }
  else if (from?.startsWith("/repositorio/mis")) { backTo = "/repositorio/mis"; backLabel = "Volver a Mis Repositorios"; }
  else if (from?.startsWith("/repositorio/favoritos")) { backTo = "/repositorio/favoritos"; backLabel = "Volver a Favoritos"; }
  else if (from?.startsWith("/repositorio/buscar")) { backTo = "/repositorio/buscar"; backLabel = "Volver a Buscador"; }

  const { data, isLoading, isError } = useQuery<{ repos: { id: string; titulo: string; docente: string; temas: string[] }[] }>({
    queryKey: ["repos", "popular", "detail-fallback"],
    enabled: !!id,
    queryFn: async () => {
      const res = await fetch("/api/repos/popular");
      if (!res.ok) throw new Error("Failed to load");
      return res.json();
    },
  });
  const repo = data?.repos.find((r) => r.id === id);

  return (
    <div className="space-y-4">
      <div>
        <Link to={backTo} className="inline-flex items-center gap-2 text-sm font-semibold text-contrast hover:opacity-90">← {backLabel}</Link>
      </div>

      <div className="rounded-2xl border border-neutral-200 p-4">
        {isLoading && (
          <div>
            <Skeleton className="mb-2 h-6 w-2/3 bg-neutral-200" />
            <Skeleton className="h-4 w-1/3 bg-neutral-200" />
          </div>
        )}
        {isError && <div className="rounded-lg border border-red-200 bg-red-50 p-2 text-sm text-red-700">No se pudo cargar.</div>}
        {!isLoading && repo && (
          <div>
            <h2 className="text-lg font-semibold text-contrast">{repo.titulo}</h2>
            <div className="text-sm text-neutral-700">Docente: {repo.docente}</div>
            <div className="mt-2 flex flex-wrap gap-2">{repo.temas.map((t) => <span key={t} className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-700">#{t}</span>)}</div>
          </div>
        )}
        {!isLoading && !repo && (
          <div className="text-sm text-neutral-700">No se encontró el repositorio.</div>
        )}
      </div>
    </div>
  );
}
