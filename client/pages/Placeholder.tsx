import { Link } from "react-router-dom";

export default function Placeholder({ title, to }: { title: string; to?: string }) {
  return (
    <div className="grid min-h-[60vh] place-items-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-contrast">{title}</h1>
        <p className="mt-2 text-neutral-600">Contenido en construcción. Próximamente.</p>
        {to && (
          <Link to={to} className="mt-4 inline-flex rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand/90">
            Ir
          </Link>
        )}
      </div>
    </div>
  );
}
