import { useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search as SearchIcon, Star } from "lucide-react";
import { cn } from "@/lib/utils";

const DATA = [
  { id: "r1", titulo: "Introducción al Cálculo", docente: "Dra. Elena Ríos", temas: ["matemáticas", "cálculo"] },
  { id: "r2", titulo: "Física Cuántica: Conceptos Clave", docente: "Prof. Javier Soto", temas: ["física", "cuántica"] },
  { id: "r6", titulo: "Programación en JavaScript", docente: "Ing. Diego Mena", temas: ["programación", "javascript"] },
];

export default function Search() {
  const [q, setQ] = useState("");
  const [favs, setFavs] = useState<Record<string, boolean>>({});

  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return [] as typeof DATA;
    return DATA.filter((r) => r.titulo.toLowerCase().includes(s) || r.docente.toLowerCase().includes(s) || r.temas.some((t) => t.toLowerCase().includes(s)));
  }, [q]);

  const location = useLocation();
  return (
    <div>
      <h2 className="text-lg font-semibold text-contrast">Buscador Global</h2>
      <p className="mt-1 text-sm text-neutral-600">Encuentra repositorios por palabra clave, tema o docente.</p>
      <div className="relative mt-4">
        <SearchIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-500" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar por palabra clave, tema o docente..." className="w-full rounded-xl border border-neutral-200 bg-white px-10 py-3 outline-none transition focus:border-contrast focus:ring-2 focus:ring-contrast/20" />
      </div>
      <ul className="mt-4 space-y-3">
        {list.map((r) => (
          <li key={r.id} className="flex items-center justify-between rounded-xl border border-neutral-200 p-3">
            <div>
              <div className="font-medium text-contrast">{r.titulo}</div>
              <div className="text-xs text-neutral-600">Por: {r.docente}</div>
              <div className="mt-1 flex flex-wrap gap-1">{r.temas.map((t) => <span key={t} className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-700">#{t}</span>)}</div>
            </div>
            <div className="flex items-center gap-2">
              <Link to={`/repositorio/ver/${r.id}`} state={{ from: location.pathname }} className="rounded-lg bg-brand px-3 py-1.5 text-sm font-semibold text-white hover:bg-brand/90">Ver Recursos</Link>
              <button onClick={() => setFavs((f) => ({ ...f, [r.id]: !f[r.id] }))} className="rounded-lg p-2 hover:bg-neutral-100" aria-label="Marcar favorito">
                <Star className={cn("h-5 w-5", favs[r.id] ? "fill-brand stroke-brand" : "stroke-neutral-400")} />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
