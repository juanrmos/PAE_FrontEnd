import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { MessageSquare, Users as UsersIcon, FileText, BarChart2, HelpCircle } from "lucide-react";

export default function GroupDetail() {
  const { id } = useParams();
  const nombre = useMemo(() => {
    const map: Record<string, string> = { g1: "Álgebra Avanzado II", g2: "Química Básica", g3: "Historia Moderna" };
    return map[id ?? ""] || `Grupo ${id}`;
  }, [id]);

  const [tab, setTab] = useState<"chat" | "archivos" | "foros" | "retos" | "analiticas">("foros");

  const posts = [
    { id: "f1", titulo: "¿Consejos para probabilidad?", autor: "Juana", etiquetas: ["matemáticas"], votos: 3, respondida: false },
    { id: "f2", titulo: "Álgebra lineal: matrices", autor: "Carlos", etiquetas: ["álgebra"], votos: 8, respondida: true },
  ];

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-2xl border border-neutral-200">
        <div className="bg-contrast p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">{nombre}</h1>
              <div className="text-sm opacity-90">Espacios vectoriales y aplicaciones</div>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="inline-flex items-center gap-1"><UsersIcon className="h-4 w-4" /> 24 miembros</div>
              <div className="inline-flex items-center gap-1"><MessageSquare className="h-4 w-4" /> 156 mensajes</div>
            </div>
          </div>
        </div>
        <div className="border-t border-neutral-200 bg-white">
          <div className="flex gap-6 px-4 pt-3 md:px-6">
            {([['chat', 'Chat', HelpCircle], ['archivos', 'Archivos', FileText], ['foros', 'Foros', MessageSquare], ['retos', 'Retos', HelpCircle], ['analiticas', 'Analíticas', BarChart2]] as const).map(([key, label, Icon]) => (
              <button key={key} onClick={() => setTab(key as any)} className={`relative pb-3 text-sm font-medium ${tab === key ? 'text-contrast' : 'text-neutral-600 hover:text-contrast'}`}>
                <Icon className="mr-1 inline h-4 w-4" /> {label}
                {tab === key && <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-brand" />}
              </button>
            ))}
          </div>
        </div>
      </div>

      {tab === 'foros' && (
        <section className="rounded-2xl border border-neutral-200 p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-contrast">Foros</h2>
            <button className="rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand/90">+ Nueva Pregunta</button>
          </div>
          <div className="space-y-2">
            {posts.map((p) => (
              <article key={p.id} className="flex items-start justify-between rounded-xl border border-neutral-200 p-3">
                <button className="mr-3 rounded-lg bg-neutral-100 px-2 py-1 text-sm font-semibold text-contrast hover:bg-neutral-200">▲ {p.votos}</button>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-contrast">{p.titulo}</h3>
                    {p.respondida && <span className="rounded bg-green-100 px-2 py-0.5 text-xs text-green-700">Respondida</span>}
                  </div>
                  <div className="text-xs text-neutral-600">Autor: {p.autor}</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {p.etiquetas.map((t) => (
                      <span key={t} className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-700">#{t}</span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {tab !== 'foros' && (
        <section className="rounded-2xl border border-neutral-200 p-6 text-sm text-neutral-600">Contenido de la pestaña "{tab}"</section>
      )}
    </div>
  );
}
