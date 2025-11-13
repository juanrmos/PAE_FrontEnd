import { Link, useLocation } from "react-router-dom";

const MOCK = [
  { id: "mg1", nombre: "Álgebra Avanzado II", materia: "Espacios vectoriales", descripcion: "Ejemplo visual de comunidad.", progreso: 72, miembros: 24, documentos: 156, mensajes: 90 },
  { id: "mg2", nombre: "Historia Moderna", materia: "Revoluciones s. XIX", descripcion: "Diseño de tarjeta de comunidad.", progreso: 41, miembros: 18, documentos: 42, mensajes: 12 },
  { id: "mg3", nombre: "Química Básica", materia: "Estructura atómica", descripcion: "Contenido de ejemplo para DEV.", progreso: 58, miembros: 16, documentos: 87, mensajes: 21 },
];

export default function GroupsMock() {
  const location = useLocation();
  const color = (p: number) => (p >= 80 ? "bg-green-600" : p >= 50 ? "bg-brand" : "bg-[#D93636]");
  const width = (p: number) => `${Math.min(100, Math.max(0, p))}%`;
  return (
    <>
      {MOCK.map((g) => (
        <Link key={g.id} to={`/grupos/${g.id}`} state={{ from: location.pathname }} className="overflow-hidden rounded-2xl border border-neutral-200 hover:bg-neutral-50">
          <div className="h-16 w-full bg-gradient-to-r from-contrast to-brand" />
          <div className="p-4">
            <div className="font-semibold text-contrast">{g.nombre}</div>
            <div className="text-xs text-neutral-600">Materia: {g.materia}</div>
            <p className="mt-1 text-sm text-neutral-700">{g.descripcion}</p>
            <div className="mt-3 text-xs font-medium text-neutral-700">Tu Progreso</div>
            <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-neutral-200">
              <div className={`${color(g.progreso)} h-full`} style={{ width: width(g.progreso) }} />
            </div>
            <div className="mt-1 text-xs text-neutral-600">{g.progreso}%</div>
            <div className="mt-3 flex items-center justify-between text-xs text-neutral-700">
              <div className="flex items-center gap-3">
                <span>💬 {g.mensajes}</span>
                <span>🗂️ {g.documentos}</span>
                <span>👥 {g.miembros}</span>
              </div>
              <span className="rounded-lg bg-contrast/10 px-2 py-0.5 font-semibold text-contrast">Propietario</span>
            </div>
          </div>
        </Link>
      ))}
    </>
  );
}
