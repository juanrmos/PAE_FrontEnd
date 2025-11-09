import { useMemo, useState } from "react";

type ForoPregunta = { id: string; titulo: string; cuerpo: string; etiquetas: string[]; votos: number; respondida: boolean; creadaEn: number };

export default function Forums() {
  const [foro, setForo] = useState<ForoPregunta[]>([
    { id: "f1", titulo: "¿Consejos para probabilidad?", cuerpo: "Busco ejercicios recomendados.", etiquetas: ["matemáticas"], votos: 3, respondida: false, creadaEn: Date.now() - 1000 * 60 * 60 },
    { id: "f2", titulo: "Álgebra lineal: matrices", cuerpo: "¿Cómo iniciar?", etiquetas: ["álgebra"], votos: 8, respondida: true, creadaEn: Date.now() - 1000 * 60 * 60 * 5 },
  ]);
  const [filtro, setFiltro] = useState<"recientes" | "sin-responder" | "populares">("recientes");
  const [q, setQ] = useState("");
  const [nuevo, setNuevo] = useState({ titulo: "", cuerpo: "", etiquetas: "" });

  const lista = useMemo(() => {
    let arr = foro.filter((p) => p.titulo.toLowerCase().includes(q.toLowerCase()) || p.etiquetas.some((t) => t.includes(q.toLowerCase())));
    if (filtro === "sin-responder") arr = arr.filter((p) => !p.respondida);
    if (filtro === "populares") arr = [...arr].sort((a, b) => b.votos - a.votos);
    if (filtro === "recientes") arr = [...arr].sort((a, b) => b.creadaEn - a.creadaEn);
    return arr;
  }, [foro, q, filtro]);

  return (
    <div>
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <h2 className="text-lg font-semibold text-contrast">Foros Públicos</h2>
        <div className="flex items-center gap-2">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar en el foro" className="w-48 rounded-lg border border-neutral-200 px-3 py-2 text-sm" />
          <select value={filtro} onChange={(e) => setFiltro(e.target.value as any)} className="rounded-lg border border-neutral-200 px-3 py-2 text-sm">
            <option value="recientes">Recientes</option>
            <option value="sin-responder">Sin responder</option>
            <option value="populares">Populares</option>
          </select>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {lista.map((p) => (
          <article key={p.id} className="flex items-start justify-between rounded-xl border border-neutral-200 p-3">
            <div className="mr-4">
              <button onClick={() => setForo((f) => f.map((x) => (x.id === p.id ? { ...x, votos: x.votos + 1 } : x)))} className="block rounded-lg bg-neutral-100 px-2 py-1 text-sm font-semibold text-contrast hover:bg-neutral-200">
                ▲ {p.votos}
              </button>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-contrast">{p.titulo}</h3>
                {p.respondida && <span className="rounded bg-green-100 px-2 py-0.5 text-xs text-green-700">Aceptada</span>}
              </div>
              <p className="text-sm text-neutral-700">{p.cuerpo}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {p.etiquetas.map((t) => (
                  <span key={t} className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-700">#{t}</span>
                ))}
              </div>
            </div>
            <div className="ml-3 flex flex-col items-end gap-2">
              <button onClick={() => setForo((f) => f.map((x) => (x.id === p.id ? { ...x, respondida: !x.respondida } : x)))} className="rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-medium text-contrast hover:bg-neutral-50">
                {p.respondida ? "Desmarcar" : "Marcar aceptada"}
              </button>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-4 rounded-2xl border border-neutral-200 p-4 bg-white">
        <div className="text-sm font-semibold text-neutral-700">Proponer Pregunta</div>
        <div className="mt-2 grid gap-2 md:grid-cols-2">
          <input value={nuevo.titulo} onChange={(e) => setNuevo((v) => ({ ...v, titulo: e.target.value }))} placeholder="Título" className="rounded-lg border border-neutral-200 px-3 py-2 text-sm" />
          <input value={nuevo.etiquetas} onChange={(e) => setNuevo((v) => ({ ...v, etiquetas: e.target.value }))} placeholder="Etiquetas (coma separadas)" className="rounded-lg border border-neutral-200 px-3 py-2 text-sm" />
          <textarea value={nuevo.cuerpo} onChange={(e) => setNuevo((v) => ({ ...v, cuerpo: e.target.value }))} placeholder="Describe tu pregunta" className="md:col-span-2 rounded-lg border border-neutral-200 px-3 py-2 text-sm" />
        </div>
        <div className="mt-2 text-right">
          <button onClick={() => {
            if (!nuevo.titulo.trim() || !nuevo.cuerpo.trim()) return;
            const etiquetas = nuevo.etiquetas.split(',').map((t) => t.trim()).filter(Boolean);
            setForo((f) => [{ id: Math.random().toString(36).slice(2), titulo: nuevo.titulo.trim(), cuerpo: nuevo.cuerpo.trim(), etiquetas, votos: 0, respondida: false, creadaEn: Date.now() }, ...f]);
            setNuevo({ titulo: '', cuerpo: '', etiquetas: '' });
          }} className="rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand/90">Publicar</button>
        </div>
      </div>
    </div>
  );
}
