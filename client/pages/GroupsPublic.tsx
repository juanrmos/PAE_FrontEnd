import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

type PublicGroup = { id: string; nombre: string; miembros: number; imagen: string };

export default function GroupsPublic() {
  const { data, isLoading, isError } = useQuery<{ groups: PublicGroup[] }>({
    queryKey: ["public-groups"],
    queryFn: async () => {
      const res = await fetch("/api/groups/public");
      if (!res.ok) throw new Error("Failed to load");
      return res.json();
    },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-contrast">Grupos Públicos</h1>
      <p className="mt-1 text-sm text-neutral-600">Explora comunidades abiertas y únete para aprender en equipo.</p>

      {isError && (
        <div className="mt-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">No se pudo cargar. Intenta de nuevo.</div>
      )}

      <div className="mt-5 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {isLoading && (
          <>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="overflow-hidden rounded-2xl border border-neutral-200">
                <Skeleton className="h-36 w-full bg-neutral-200" />
                <div className="p-4">
                  <Skeleton className="h-5 w-2/3 bg-neutral-200" />
                  <Skeleton className="mt-2 h-3 w-24 bg-neutral-200" />
                </div>
              </div>
            ))}
          </>
        )}

        {!isLoading && data?.groups.map((g) => (
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
