import { useState } from "react";
import { useParams } from "react-router-dom";
import { FileText, Link2, Trash2, UploadCloud } from "lucide-react";
import { toast } from "sonner";

export default function Manage() {
  const params = useParams();
  const [repoData, setRepoData] = useState({ titulo: "", materia: "", docente: "", estado: "Borrador" as "Borrador" | "Publicado" });
  const [files, setFiles] = useState<File[]>([]);
  const [links, setLinks] = useState<{ titulo: string; descripcion: string; url: string }[]>([
    { titulo: "", descripcion: "", url: "" },
  ]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFiles(Array.from(e.target.files));
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const picked = Array.from(e.dataTransfer.files).filter((f) => ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"].includes(f.type));
    setFiles((prev) => [...prev, ...picked]);
  };

  const removeFile = (i: number) => setFiles((arr) => arr.filter((_, idx) => idx !== i));

  return (
    <div className="rounded-2xl border border-neutral-200 p-6">
      <h2 className="text-lg font-semibold text-contrast">Gestión de Repositorio</h2>
      {params.id && <div className="mb-2 text-xs text-neutral-600">Editando: {params.id}</div>}

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <input value={repoData.titulo} onChange={(e) => setRepoData((d) => ({ ...d, titulo: e.target.value }))} placeholder="Título del Repositorio" className="rounded-xl border border-neutral-200 px-4 py-3 text-sm" />
        <input value={repoData.materia} onChange={(e) => setRepoData((d) => ({ ...d, materia: e.target.value }))} placeholder="Materia o Tema" className="rounded-xl border border-neutral-200 px-4 py-3 text-sm" />
        <input value={repoData.docente} onChange={(e) => setRepoData((d) => ({ ...d, docente: e.target.value }))} placeholder="Docente Creador" className="rounded-xl border border-neutral-200 px-4 py-3 text-sm" />
        <select value={repoData.estado} onChange={(e) => setRepoData((d) => ({ ...d, estado: e.target.value as any }))} className="rounded-xl border border-neutral-200 px-4 py-3 text-sm">
          <option value="Borrador">Borrador</option>
          <option value="Publicado">Publicado</option>
        </select>
      </div>

      <section className="mt-6">
        <h3 className="mb-2 text-base font-semibold text-contrast">Carga de Archivos (PDF/DOC)</h3>
        <div onDragOver={(e) => e.preventDefault()} onDrop={onDrop} className="grid place-items-center rounded-xl border-2 border-dashed border-brand p-6 text-sm text-neutral-600 bg-[radial-gradient(theme(colors.contrast.DEFAULT)/0.08,transparent_60%)]">
          <label className="flex cursor-pointer flex-col items-center gap-2">
            <UploadCloud className="h-6 w-6 text-brand" />
            <span className="font-medium">Arrastra y suelta o haz clic para seleccionar</span>
            <input type="file" accept=".pdf,.doc,.docx" multiple onChange={onFileChange} className="hidden" />
          </label>
        </div>
        {!!files.length && (
          <ul className="mt-3 space-y-2">
            {files.map((f, i) => (
              <li key={i} className="flex items-center justify-between rounded-lg border border-neutral-200 p-3 text-sm">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-contrast" />
                  <div>
                    <div className="font-medium text-contrast">{f.name}</div>
                    <div className="text-xs text-neutral-600">{(f.size / 1024).toFixed(0)} KB</div>
                  </div>
                </div>
                <button onClick={() => removeFile(i)} className="inline-flex items-center gap-1 text-red-600 hover:underline"><Trash2 className="h-4 w-4" /> Eliminar</button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-6">
        <h3 className="mb-2 text-base font-semibold text-contrast">Enlace de Recursos Externos</h3>
        {links.map((l, idx) => (
          <div key={idx} className="mb-2 rounded-xl border border-neutral-200 p-3">
            <div className="grid gap-2 md:grid-cols-2">
              <input value={l.titulo} onChange={(e) => setLinks((arr) => arr.map((x, i) => (i === idx ? { ...x, titulo: e.target.value } : x)))} placeholder="Título del Recurso" className="rounded-lg border border-neutral-200 px-3 py-2 text-sm" />
              <input value={l.url} onChange={(e) => setLinks((arr) => arr.map((x, i) => (i === idx ? { ...x, url: e.target.value } : x)))} placeholder="URL del Enlace" className="rounded-lg border border-neutral-200 px-3 py-2 text-sm" />
              <input value={l.descripcion} onChange={(e) => setLinks((arr) => arr.map((x, i) => (i === idx ? { ...x, descripcion: e.target.value } : x)))} placeholder="Descripción" className="md:col-span-2 rounded-lg border border-neutral-200 px-3 py-2 text-sm" />
            </div>
          </div>
        ))}
        <button onClick={() => setLinks((arr) => [...arr, { titulo: "", descripcion: "", url: "" }])} className="mt-1 rounded-lg px-3 py-1.5 text-sm font-medium text-brand hover:bg-brand/10"><Link2 className="mr-1 inline h-4 w-4" /> Añadir otro enlace</button>
      </section>

      <div className="mt-6 text-right">
        <button onClick={async () => { try { const res = await fetch('/api/repos/save', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...repoData, files: files.map(f=>f.name), links }) }); if (!res.ok) throw new Error(); toast.success('Repositorio guardado'); } catch { toast.error('No se pudo guardar'); } }} className="rounded-xl bg-brand px-5 py-3 text-base font-semibold text-white hover:bg-brand/90">Guardar Repositorio</button>
      </div>
    </div>
  );
}
