import { Link } from "react-router-dom";

const mis = [
  { id: "g1", nombre: "Matemáticas I", progreso: 86, materia: "Cálculo diferencial", descripcion: "Grupo para reforzar conceptos clave y resolver dudas semanales." },
  { id: "g2", nombre: "Química Básica", progreso: 62, materia: "Estructura atómica", descripcion: "Apuntes, guías y prácticas de laboratorio." },
  { id: "g3", nombre: "Historia Moderna", progreso: 41, materia: "Revoluciones del s. XIX", descripcion: "Lecturas guiadas y debates históricos." },
];

export default function MyCommunities() {
  const color = (p: number) => (p >= 80 ? "bg-green-600" : p >= 50 ? "bg-brand" : "bg-[#D93636]");
  const width = (p: number) => `${Math.min(100, Math.max(0, p))}%`;

  return (
    <div>
      <div className="mb-2">
        <h2 className="text-lg font-semibold text-contrast">Mis Comunidades</h2>
        <p className="text-sm text-neutral-600">Gestiona tus comunidades de estudio colaborativo</p>
      </div>
      <div className="mt-4 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mis.map((g) => (
          <Link key={g.id} to={`/grupos/${g.id}`} className="overflow-hidden rounded-2xl border border-neutral-200 hover:bg-neutral-50">
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
                  <span>💬 24</span>
                  <span>🗂️ 156</span>
                  <span>👥 18</span>
                </div>
                <span className="rounded-lg bg-contrast/10 px-2 py-0.5 font-semibold text-contrast">Propietario</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
