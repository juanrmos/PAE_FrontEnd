import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export default function Home() {
  const nombre = "Juana";
  return (
    <div className="space-y-8">
      {/* Header Superior */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-contrast">¡Hola, {nombre}!</h1>
          <p className="text-sm text-neutral-600">Encuentra cursos, repositorios y personas</p>
        </div>
        <div className="w-full md:w-[460px]">
          <div className="relative">
            <input
              type="search"
              placeholder="Buscar recursos, cursos o usuarios"
              className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 pr-10 outline-none transition focus:border-contrast focus:ring-2 focus:ring-contrast/20"
            />
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-contrast">⌘K</div>
          </div>
        </div>
      </div>

      {/* Tarjetas principales */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Progreso Rápido */}
        <div className="rounded-2xl border border-neutral-200 p-6">
          <div className="mb-3 text-sm font-semibold text-neutral-700">Progreso rápido</div>
          <div className="text-lg font-bold text-contrast">Ruta de Estudio: Matemáticas I</div>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-neutral-200">
            <div className="h-full w-1/2 bg-brand" />
          </div>
          <div className="mt-2 text-sm text-neutral-600">50% completado • Próximo paso: Álgebra lineal</div>
          <div className="mt-4">
            <Link to="/cursos" className="inline-flex items-center justify-center rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand/90">Ir a mi ruta</Link>
          </div>
        </div>

        {/* Misiones/Retos diarios */}
        <div className="rounded-2xl border border-neutral-200 p-6">
          <div className="mb-3 text-sm font-semibold text-neutral-700">Misiones diarias</div>
          <div className="text-lg font-bold text-contrast">Reto de hoy: 10 preguntas de probabilidad</div>
          <p className="mt-2 text-sm text-neutral-600">Microaprendizaje para mantener el hábito (5-7 min).</p>
          <div className="mt-4">
            <Link to="/evaluaciones" className="inline-flex items-center justify-center rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand/90">Empezar misión</Link>
          </div>
        </div>
      </div>

      {/* Novedades y Tendencias */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-contrast">Novedades y tendencias</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { title: "Cálculo diferencial - Guía rápida", href: "/repositorio" },
            { title: "Historia: línea de tiempo interactiva", href: "/repositorio" },
            { title: "Física: ejercicios de cinemática", href: "/repositorio" },
          ].map((n) => (
            <Link key={n.title} to={n.href} className="rounded-2xl border border-neutral-200 p-4 hover:bg-neutral-50">
              <div className="text-sm text-neutral-600">Repositorio</div>
              <div className="mt-1 font-medium text-contrast">{n.title}</div>
              <div className="mt-2 text-xs text-contrast">Ver más →</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Zona de Descanso */}
      <section className="rounded-2xl border border-neutral-200 bg-white p-6">
        <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
          <div>
            <div className="text-lg font-semibold text-contrast">Zona de descanso</div>
            <p className="text-sm text-neutral-600">Toma 5 minutos para respirar. Tips de manejo de ansiedad y pausas activas.</p>
          </div>
          <Link to="/habitos" className="inline-flex items-center justify-center rounded-xl border border-neutral-200 px-4 py-2.5 text-sm font-semibold text-contrast hover:bg-neutral-50">Ver recomendaciones</Link>
        </div>
      </section>
    </div>
  );
}
