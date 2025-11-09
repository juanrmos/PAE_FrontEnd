import { Link } from "react-router-dom";

export default function GroupsPublic() {
  const grupos = [
    { id: "g1", nombre: "Matemáticas Avanzadas", miembros: 128, imagen: "https://picsum.photos/seed/mate/400/200" },
    { id: "g2", nombre: "Historia Universal", miembros: 76, imagen: "https://picsum.photos/seed/hist/400/200" },
    { id: "g3", nombre: "Programación en JS", miembros: 210, imagen: "https://picsum.photos/seed/js/400/200" },
  ];
  return (
    <div>
      <h1 className="text-2xl font-bold text-contrast">Grupos Públicos</h1>
      <p className="mt-1 text-sm text-neutral-600">Explora comunidades abiertas y únete para aprender en equipo.</p>
      <div className="mt-5 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {grupos.map((g) => (
          <Link key={g.id} to={`/grupos/${g.id}`} className="overflow-hidden rounded-2xl border border-neutral-200 hover:bg-neutral-50">
            <img src={g.imagen} alt="cover" className="h-36 w-full object-cover" />
            <div className="p-4">
              <div className="font-semibold text-contrast">{g.nombre}</div>
              <div className="text-sm text-neutral-600">{g.miembros} miembros</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
