import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { MessageSquare, Users as UsersIcon, FileText, BarChart2, HelpCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

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

  const filesQuery = useQuery<{ files: { id: string; titulo: string; autor: string; sizeKB: number }[] }>({
    queryKey: ["group", id, "files"],
    enabled: !!id && tab === "archivos",
    queryFn: async () => {
      const res = await fetch(`/api/groups/${id}/files`);
      if (!res.ok) throw new Error("Failed to load files");
      return res.json();
    },
  });

  const analyticsQuery = useQuery<{ metrics: { estudiantesTotal: number; activosAhora: number; documentos: number; preguntas: number }; miembros: { id: string; nombre: string; rol: string }[] }>({
    queryKey: ["group", id, "analytics"],
    enabled: !!id && tab === "analiticas",
    queryFn: async () => {
      const res = await fetch(`/api/groups/${id}/analytics`);
      if (!res.ok) throw new Error("Failed to load analytics");
      return res.json();
    },
  });

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

      {tab === 'archivos' && (
        <section className="rounded-2xl border border-neutral-200 p-4">
          <h2 className="mb-3 text-lg font-semibold text-contrast">Archivos PDF</h2>
          {filesQuery.isLoading && (
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 rounded-xl border border-neutral-200 p-3">
                  <Skeleton className="h-10 w-10 rounded-md bg-neutral-200" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-1/2 bg-neutral-200" />
                    <Skeleton className="mt-1 h-3 w-1/3 bg-neutral-200" />
                  </div>
                </div>
              ))}
            </div>
          )}
          {!filesQuery.isLoading && filesQuery.data && (
            <ul className="space-y-2">
              {filesQuery.data.files.map((f) => (
                <li key={f.id} className="flex items-center justify-between rounded-xl border border-neutral-200 p-3">
                  <div>
                    <div className="font-medium text-contrast">{f.titulo}</div>
                    <div className="text-xs text-neutral-600">Autor: {f.autor} • {f.sizeKB} KB</div>
                  </div>
                  <button className="rounded-lg border border-neutral-200 px-3 py-1.5 text-xs hover:bg-neutral-50">Abrir</button>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {tab === 'analiticas' && (
        <section className="space-y-4 rounded-2xl border border-neutral-200 p-4">
          <h2 className="text-lg font-semibold text-contrast">Analíticas</h2>
          {analyticsQuery.isLoading ? (
            <div className="grid gap-3 md:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-20 rounded-xl bg-neutral-200" />
              ))}
            </div>
          ) : (
            analyticsQuery.data && (
              <div className="grid gap-3 md:grid-cols-4">
                <Stat title="Estudiantes Totales" value={analyticsQuery.data.metrics.estudiantesTotal} />
                <Stat title="Activos ahora" value={analyticsQuery.data.metrics.activosAhora} />
                <Stat title="Documentos" value={analyticsQuery.data.metrics.documentos} />
                <Stat title="Preguntas" value={analyticsQuery.data.metrics.preguntas} />
              </div>
            )
          )}

          <div className="mt-4">
            <div className="mb-2 text-sm font-semibold text-neutral-700">Miembros</div>
            {analyticsQuery.isLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 rounded-xl bg-neutral-200" />
                ))}
              </div>
            ) : (
              analyticsQuery.data && (
                <ul className="space-y-2">
                  {analyticsQuery.data.miembros.map((m) => (
                    <li key={m.id} className="flex items-center justify-between rounded-xl border border-neutral-200 p-2 text-sm">
                      <span className="font-medium text-contrast">{m.nombre}</span>
                      <span className="rounded bg-neutral-100 px-2 py-0.5 text-xs text-neutral-700">{m.rol}</span>
                    </li>
                  ))}
                </ul>
              )
            )}
          </div>
        </section>
      )}

      {tab !== 'foros' && tab !== 'archivos' && tab !== 'analiticas' && (
        <section className="rounded-2xl border border-neutral-200 p-6 text-sm text-neutral-600">Contenido de la pestaña "{tab}"</section>
      )}
    </div>
  );
}

function Stat({ title, value }: { title: string; value: number }) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-4">
      <div className="text-xs text-neutral-600">{title}</div>
      <div className="text-xl font-bold text-contrast">{value}</div>
    </div>
  );
}
