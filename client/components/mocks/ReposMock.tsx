import { Link, useLocation } from "react-router-dom";

const MOCK = [
  { id: "r1", nombre: "Introducción al Cálculo", fecha: "2025-02-10", estado: "Publicado" as const },
  { id: "r2", nombre: "Física Cuántica: Conceptos Clave", fecha: "2025-02-03", estado: "Borrador" as const },
];

export default function ReposMock() {
  const location = useLocation();
  return (
    <div className="space-y-3">
      {MOCK.map((r) => (
        <div key={r.id} className="flex items-center justify-between rounded-xl border border-neutral-200 p-3">
          <div>
            <div className="font-medium text-contrast">{r.nombre}</div>
            <div className="text-xs text-neutral-600">Creado: {r.fecha} • Estado: {r.estado}</div>
          </div>
          <Link to={`/repositorio/ver/${r.id}`} state={{ from: location.pathname }} className="rounded-lg bg-brand px-3 py-1.5 text-sm font-semibold text-white hover:bg-brand/90">Ver Recursos</Link>
        </div>
      ))}
    </div>
  );
}
