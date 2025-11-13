const MOCK = [
  { id: "f1", titulo: "¿Consejos para probabilidad?", cuerpo: "Busco ejercicios recomendados.", etiquetas: ["matemáticas"], votos: 3, respondida: false, creadaEn: Date.now() - 1000 * 60 * 60 },
  { id: "f2", titulo: "Álgebra lineal: matrices", cuerpo: "¿Cómo iniciar?", etiquetas: ["álgebra"], votos: 8, respondida: true, creadaEn: Date.now() - 1000 * 60 * 60 * 5 },
];

export default function ForumsMock() {
  return (
    <div className="space-y-2">
      {MOCK.map((p) => (
        <article key={p.id} className="flex items-start justify-between rounded-xl border border-neutral-200 p-3">
          <div className="mr-4">
            <button className="block rounded-lg bg-neutral-100 px-2 py-1 text-sm font-semibold text-contrast">▲ {p.votos}</button>
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
            <button className="rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-medium text-contrast">Marcar aceptada</button>
          </div>
        </article>
      ))}
    </div>
  );
}
