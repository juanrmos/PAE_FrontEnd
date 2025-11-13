import { useState, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { Download, Eye, Search, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

type Repo = { id: string; titulo: string; docente: string; temas: string[]; descargas: number; vistas: number };

export default function Popular() {
  const [q, setQ] = useState("");
  const [favs, setFavs] = useState<Record<string, boolean>>({});

  const { data, isLoading, isError } = useQuery<{ repos: Repo[] }>({
    queryKey: ["repos", "popular"],
    queryFn: async () => {
      const res = await fetch("/api/repos/popular");
      if (!res.ok) throw new Error("Failed to load");
      return res.json();
    },
  });

  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    const base = data?.repos || [];
    if (!s) return base;
    return base.filter((r) => r.titulo.toLowerCase().includes(s) || r.docente.toLowerCase().includes(s) || r.temas.some((t) => t.toLowerCase().includes(s)));
  }, [q, data]);

  const location = useLocation();
  return (
    <div>
      <h2 className="text-lg font-semibold text-contrast">Repositorios Populares</h2>
      <p className="mt-1 text-sm text-neutral-600">Explora contenido educativo validado por la comunidad.</p>

      <div className="mt-4">
        <div className="relative mb-5">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-500" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar por palabra clave, tema o docente..." className="w-full rounded-xl border border-neutral-200 bg-white px-10 py-3 outline-none transition focus:border-contrast focus:ring-2 focus:ring-contrast/20" />
        </div>

        {isError && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">No se pudo cargar. Intenta de nuevo.</div>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {isLoading && (
            <>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-2xl border border-neutral-200 p-4">
                  <Skeleton className="mb-2 h-5 w-2/3 bg-neutral-200" />
                  <Skeleton className="h-3 w-1/3 bg-neutral-200" />
                  <div className="mt-3 flex gap-2">
                    <Skeleton className="h-5 w-12 rounded-full bg-neutral-200" />
                    <Skeleton className="h-5 w-16 rounded-full bg-neutral-200" />
                  </div>
                  <div className="mt-3 flex gap-4">
                    <Skeleton className="h-4 w-24 bg-neutral-200" />
                    <Skeleton className="h-4 w-24 bg-neutral-200" />
                  </div>
                  <Skeleton className="mt-4 h-9 w-32 rounded-xl bg-neutral-200" />
                </div>
              ))}
            </>
          )}

          {!isLoading && list.map((r) => (
            <article key={r.id} className="rounded-2xl border border-neutral-200 p-4 hover:bg-neutral-50">
              <div className="mb-2 flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-contrast">{r.titulo}</h3>
                  <div className="text-xs text-neutral-600">Por: {r.docente}</div>
                </div>
                <button aria-label="Marcar como favorito" onClick={() => { setFavs((f) => ({ ...f, [r.id]: !f[r.id] })); toast.success(favs[r.id] ? "Quitado de favoritos" : "Marcado como favorito"); }} className="rounded-lg p-1 hover:bg-neutral-100">
                  <Star className={cn("h-5 w-5", favs[r.id] ? "fill-brand stroke-brand" : "stroke-neutral-400")} />
                </button>
              </div>
              <div className="mb-3 flex flex-wrap gap-1">
                {r.temas.map((t) => (
                  <span key={t} className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-700">#{t}</span>
                ))}
              </div>
              <div className="mb-3 flex items-center gap-4 text-xs text-neutral-600">
                <span className="inline-flex items-center gap-1"><Download className="h-4 w-4" /> {r.descargas} descargas</span>
                <span className="inline-flex items-center gap-1"><Eye className="h-4 w-4" /> {r.vistas} vistas</span>
              </div>
              <Link to={`/repositorio/ver/${r.id}`} state={{ from: location.pathname }} className="inline-flex items-center justify-center rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand/90">Ver Recursos</Link>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
