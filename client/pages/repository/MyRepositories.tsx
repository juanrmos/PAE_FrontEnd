import { useState } from "react";
import { Link } from "react-router-dom";
import { FolderEdit, Share2, UploadCloud } from "lucide-react";

 type Repo = { id: string; nombre: string; fecha: string; estado: "Publicado" | "Borrador" };

const MIS: Repo[] = [
  { id: "t1", nombre: "Guía de Laboratorio - Química", fecha: "2024-10-26", estado: "Publicado" },
  { id: "t2", nombre: "Ejercicios de Álgebra", fecha: "2024-10-25", estado: "Borrador" },
  { id: "t3", nombre: "Lecturas de Historia Moderna", fecha: "2024-09-10", estado: "Publicado" },
];

export default function MyRepositories() {
  const [subiendo, setSubiendo] = useState(false);

  const onUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    setSubiendo(true);
    setTimeout(() => setSubiendo(false), 1000);
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h2 className="text-lg font-semibold text-contrast">Mis Repositorios</h2>
        <div className="flex gap-3">
          <Link to="/repositorio/gestionar/nuevo" className="inline-flex items-center gap-1 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand/90"><FolderEdit className="h-4 w-4" /> Crear Nuevo Repositorio</Link>
          <label className="inline-flex cursor-pointer items-center gap-1 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand/90">
            <UploadCloud className="h-4 w-4" /> Subir Recurso (PDF/DOC)
            <input type="file" accept=".pdf,.doc,.docx" multiple className="hidden" onChange={onUpload} />
          </label>
        </div>
      </div>

      <div className="rounded-2xl border border-neutral-200 p-4">
        <h3 className="text-base font-semibold text-contrast">Tus Repositorios</h3>
        <div className="mt-3 space-y-3">
          {MIS.map((r) => (
            <div key={r.id} className="flex items-center justify-between rounded-xl border border-neutral-200 p-3">
              <div>
                <div className="font-medium text-contrast">{r.nombre}</div>
                <div className="text-xs text-neutral-600">Creado: {r.fecha} • Estado: {r.estado}</div>
              </div>
              <div className="flex gap-2">
                <Link to={`/repositorio/gestionar/${r.id}`} className="rounded-lg px-3 py-1.5 text-sm font-medium text-contrast hover:bg-neutral-100">Gestionar / Editar</Link>
                <button className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium text-brand hover:bg-brand/10"><Share2 className="h-4 w-4" /> Compartir</button>
              </div>
            </div>
          ))}
          {subiendo && <div className="rounded-lg border border-neutral-200 p-3 text-sm text-neutral-600">Subiendo archivos...</div>}
        </div>
      </div>
    </div>
  );
}
