import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Download, Eye, Search, Star } from "lucide-react";
import { cn } from "@/lib/utils";

type Repo = { id: string; titulo: string; docente: string; temas: string[]; descargas: number; vistas: number };

const DATA: Repo[] = [
  { id: "r1", titulo: "Introducción al Cálculo", docente: "Dra. Elena Ríos", temas: ["matemáticas", "cálculo"], descargas: 1523, vistas: 4820 },
  { id: "r2", titulo: "Física Cuántica: Conceptos Clave", docente: "Prof. Javier Soto", temas: ["física", "cuántica"], descargas: 980, vistas: 2130 },
  { id: "r3", titulo: "Gramática Española Avanzada", docente: "Mtra. Lucía Prado", temas: ["lengua", "gramática"], descargas: 712, vistas: 1695 },
  { id: "r4", titulo: "Química Orgánica I", docente: "Dr. Martín Ledesma", temas: ["química", "orgánica"], descargas: 1230, vistas: 3055 },
  { id: "r5", titulo: "Historia de América Latina", docente: "Lic. Sofía Campos", temas: ["historia", "américa"], descargas: 645, vistas: 1420 },
  { id: "r6", titulo: "Programación en JavaScript", docente: "Ing. Diego Mena", temas: ["programación", "javascript"], descargas: 2045, vistas: 5210 },
];

export default function Popular() {
  const [q, setQ] = useState("");
  const [favs, setFavs] = useState<Record<string, boolean>>({ r2: true });

  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return DATA;
    return DATA.filter((r) => r.titulo.toLowerCase().includes(s) || r.docente.toLowerCase().includes(s) || r.temas.some((t) => t.toLowerCase().includes(s)));
  }, [q]);

  return (
    <div>
      <h2 className="text-lg font-semibold text-contrast">Repositorios Populares</h2>
      <p className="mt-1 text-sm text-neutral-600">Explora contenido educativo validado por la comunidad.</p>

      <div className="mt-4">
        <div className="relative mb-5">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-500" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar por palabra clave, tema o docente..." className="w-full rounded-xl border border-neutral-200 bg-white px-10 py-3 outline-none transition focus:border-contrast focus:ring-2 focus:ring-contrast/20" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {list.map((r) => (
            <article key={r.id} className="rounded-2xl border border-neutral-200 p-4 hover:bg-neutral-50">
              <div className="mb-2 flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-contrast">{r.titulo}</h3>
                  <div className="text-xs text-neutral-600">Por: {r.docente}</div>
                </div>
                <button aria-label="Marcar como favorito" onClick={() => setFavs((f) => ({ ...f, [r.id]: !f[r.id] }))} className="rounded-lg p-1 hover:bg-neutral-100">
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
              <Link to={`/repositorio/ver/${r.id}`} className="inline-flex items-center justify-center rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand/90">Ver Recursos</Link>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
