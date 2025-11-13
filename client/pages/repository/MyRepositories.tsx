import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FolderEdit, Share2, UploadCloud } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

 type Repo = { id: string; nombre: string; fecha: string; estado: "Publicado" | "Borrador" };

import ReposMock from "@/components/mocks/ReposMock";

export default function MyRepositories() {
  const [subiendo, setSubiendo] = useState(false);
  const { data, isLoading, isError } = useQuery<{ repos: Repo[] }>({
    queryKey: ["repos", "my"],
    queryFn: async () => {
      const res = await fetch("/api/repos/my");
      if (!res.ok) throw new Error("Failed to load");
      return res.json();
    },
  });

  const onUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    setSubiendo(true);
    setTimeout(() => { setSubiendo(false); toast.success("Archivos subidos"); }, 900);
  };

  const location = useLocation();

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h2 className="text-lg font-semibold text-contrast">Mis Repositorios</h2>
        {((localStorage.getItem("role") as any) || "estudiante") === "docente" && (
          <div className="flex gap-3">
            <Link to="/repositorio/gestionar/nuevo" state={{ from: location.pathname }} className="inline-flex items-center gap-1 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand/90"><FolderEdit className="h-4 w-4" /> Crear Nuevo Repositorio</Link>
            <label className="inline-flex cursor-pointer items-center gap-1 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand/90">
              <UploadCloud className="h-4 w-4" /> Subir Recurso (PDF/DOC)
              <input type="file" accept=".pdf,.doc,.docx" multiple className="hidden" onChange={onUpload} />
            </label>
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-neutral-200 p-4">
        <h3 className="text-base font-semibold text-contrast">Tus Repositorios</h3>
        {isError && <div className="mt-2 rounded-lg border border-red-200 bg-red-50 p-2 text-sm text-red-700">No se pudo cargar.</div>}
        <div className="mt-3 space-y-3">
          {isLoading && (
            <>
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between rounded-xl border border-neutral-200 p-3">
                  <div>
                    <Skeleton className="h-4 w-56 bg-neutral-200" />
                    <Skeleton className="mt-1 h-3 w-40 bg-neutral-200" />
                  </div>
                  <Skeleton className="h-7 w-40 rounded bg-neutral-200" />
                </div>
              ))}
            </>
          )}

          {!isLoading && data?.repos && data.repos.length > 0 && data.repos.map((r) => (
            <div key={r.id} className="flex items-center justify-between rounded-xl border border-neutral-200 p-3">
              <div>
                <div className="font-medium text-contrast">{r.nombre}</div>
                <div className="text-xs text-neutral-600">Creado: {r.fecha} • Estado: {r.estado}</div>
              </div>
              <div className="flex gap-2">
                <Link to={`/repositorio/gestionar/${r.id}`} state={{ from: location.pathname }} className="rounded-lg px-3 py-1.5 text-sm font-medium text-contrast hover:bg-neutral-100">Gestionar / Editar</Link>
                <button className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium text-brand hover:bg-brand/10"><Share2 className="h-4 w-4" /> Compartir</button>
              </div>
            </div>
          ))}

          {!isLoading && (!data?.repos || data.repos.length === 0) && (
            import.meta.env.DEV ? (
              <ReposMock />
            ) : (
              <div className="rounded-2xl border border-neutral-200 p-6 text-center">
                <div className="text-sm text-neutral-700">No has creado ningún repositorio.</div>
                <Link to="/repositorio/gestionar/nuevo" className="mt-3 inline-flex items-center justify-center rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand/90">Crear Nuevo Repositorio</Link>
              </div>
            )
          )}

          {subiendo && <div className="rounded-lg border border-neutral-200 p-3 text-sm text-neutral-600">Subiendo archivos...</div>}
        </div>
      </div>
    </div>
  );
}
