import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

const INIT = [
  { id: "r2", titulo: "Física Cuántica: Conceptos Clave", docente: "Prof. Javier Soto", temas: ["física", "cuántica"] },
  { id: "r6", titulo: "Programación en JavaScript", docente: "Ing. Diego Mena", temas: ["programación", "javascript"] },
];

export default function Favorites() {
  const [favs, setFavs] = useState<Record<string, boolean>>({ r2: true, r6: true });

  const location = useLocation();
  return (
    <div>
      <h2 className="text-lg font-semibold text-contrast">Favoritos</h2>
      <p className="mt-1 text-sm text-neutral-600">Acceso rápido a tus repositorios guardados.</p>
      <div className="mt-4 space-y-3">
        {INIT.map((r) => (
          <div key={r.id} className="flex items-center justify-between rounded-xl border border-neutral-200 p-3">
            <div>
              <div className="font-medium text-contrast">{r.titulo}</div>
              <div className="text-xs text-neutral-600">Por: {r.docente}</div>
              <div className="mt-1 flex flex-wrap gap-1">{r.temas.map((t) => <span key={t} className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-700">#{t}</span>)}</div>
            </div>
            <div className="flex items-center gap-2">
              <Link to={`/repositorio/ver/${r.id}`} state={{ from: location.pathname }} className="rounded-lg bg-brand px-3 py-1.5 text-sm font-semibold text-white hover:bg-brand/90">Ver Recursos</Link>
              <button onClick={() => setFavs((f) => ({ ...f, [r.id]: !f[r.id] }))} className="rounded-lg p-2 hover:bg-neutral-100" aria-label="Quitar favorito">
                <Star className={cn("h-5 w-5", favs[r.id] ? "fill-brand stroke-brand" : "stroke-neutral-400")} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
