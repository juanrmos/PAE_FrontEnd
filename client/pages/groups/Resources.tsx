import { useState } from "react";
import { toast } from "sonner";

export default function Resources() {
  const [role, setRole] = useState<"Estudiante" | "Docente">("Estudiante");

  const [grupo, setGrupo] = useState({ nombre: "", descripcion: "", materia: "", institucion: "", visibilidad: "privado" as "privado" | "publico", icono: "" });
  const [inv, setInv] = useState({ id: "", mensaje: "" });

  const [chat, setChat] = useState<any[]>([]);
  const [rec, setRec] = useState({ titulo: "", descripcion: "", enlace: "", imagen: "" });

  const [pdfs, setPdfs] = useState<{ id: string; url: string; nombre: string }[]>([]);

  const onDropPDF = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter((f) => f.type === "application/pdf");
    const mapped = files.map((f) => ({ id: Math.random().toString(36).slice(2), url: URL.createObjectURL(f), nombre: f.name }));
    setPdfs((p) => [...mapped, ...p]);
    toast.success(`${mapped.length} PDF(s) añadido(s)`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <label className="text-sm text-neutral-700">Rol</label>
        <select value={role} onChange={(e) => setRole(e.target.value as any)} className="rounded-lg border border-neutral-200 px-3 py-2 text-sm">
          <option>Estudiante</option>
          <option>Docente</option>
        </select>
      </div>

      {role === "Docente" && (
        <section className="rounded-2xl border border-neutral-200 p-4">
          <h2 className="text-lg font-semibold text-contrast">Crear Grupo</h2>
          <div className="mt-3 grid gap-2 md:grid-cols-2">
            <input value={grupo.nombre} onChange={(e) => setGrupo((g) => ({ ...g, nombre: e.target.value }))} placeholder="Nombre del Grupo" className="rounded-lg border border-neutral-200 px-3 py-2 text-sm" />
            <input value={grupo.materia} onChange={(e) => setGrupo((g) => ({ ...g, materia: e.target.value }))} placeholder="Materia o Tema" className="rounded-lg border border-neutral-200 px-3 py-2 text-sm" />
            <input value={grupo.institucion} onChange={(e) => setGrupo((g) => ({ ...g, institucion: e.target.value }))} placeholder="Institución Afiliada" className="rounded-lg border border-neutral-200 px-3 py-2 text-sm" />
            <input value={grupo.icono} onChange={(e) => setGrupo((g) => ({ ...g, icono: e.target.value }))} placeholder="URL de imagen/ícono" className="rounded-lg border border-neutral-200 px-3 py-2 text-sm" />
            <textarea value={grupo.descripcion} onChange={(e) => setGrupo((g) => ({ ...g, descripcion: e.target.value }))} placeholder="Descripción" className="md:col-span-2 rounded-lg border border-neutral-200 px-3 py-2 text-sm" />
            <select value={grupo.visibilidad} onChange={(e) => setGrupo((g) => ({ ...g, visibilidad: e.target.value as any }))} className="rounded-lg border border-neutral-200 px-3 py-2 text-sm">
              <option value="privado">Privado</option>
              <option value="publico">Público</option>
            </select>
            <button onClick={() => toast.success("Grupo creado")} className="rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand/90">Crear Grupo</button>
          </div>
        </section>
      )}

      <section className="rounded-2xl border border-neutral-200 p-4">
        <h2 className="text-lg font-semibold text-contrast">Recomendar recurso</h2>
        <div className="mt-3 grid gap-2 md:grid-cols-2">
          <input value={rec.titulo} onChange={(e) => setRec((v) => ({ ...v, titulo: e.target.value }))} placeholder="Título" className="rounded-lg border border-neutral-200 px-3 py-2 text-sm" />
          <input value={rec.enlace} onChange={(e) => setRec((v) => ({ ...v, enlace: e.target.value }))} placeholder="Enlace (opcional)" className="rounded-lg border border-neutral-200 px-3 py-2 text-sm" />
          <input value={rec.imagen} onChange={(e) => setRec((v) => ({ ...v, imagen: e.target.value }))} placeholder="URL de imagen (opcional)" className="rounded-lg border border-neutral-200 px-3 py-2 text-sm" />
          <input value={rec.descripcion} onChange={(e) => setRec((v) => ({ ...v, descripcion: e.target.value }))} placeholder="Descripción" className="rounded-lg border border-neutral-200 px-3 py-2 text-sm md:col-span-2" />
        </div>
        <div className="mt-2 text-right">
          <button onClick={() => { if (!rec.titulo.trim()) return; setChat((c) => [...c, { ...rec, id: Math.random().toString(36).slice(2) }]); setRec({ titulo: "", descripcion: "", enlace: "", imagen: "" }); toast.success("Recurso recomendado"); }} className="rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand/90">Publicar recurso</button>
        </div>
        <ul className="mt-4 space-y-3">
          {chat.map((m) => (
            <li key={m.id} className="flex items-start gap-3 rounded-xl border border-neutral-200 p-3">
              {m.imagen ? <img src={m.imagen} className="h-16 w-24 rounded-lg object-cover" /> : <div className="h-16 w-24 rounded-lg bg-neutral-200" />}
              <div className="flex-1">
                <div className="font-semibold text-contrast">{m.titulo}</div>
                <p className="text-sm text-neutral-700">{m.descripcion}</p>
                {m.enlace && <a href={m.enlace} target="_blank" rel="noreferrer" className="text-sm font-semibold text-brand underline">Abrir enlace</a>}
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-neutral-200 p-4">
        <h2 className="text-lg font-semibold text-contrast">Invitar por ID</h2>
        <div className="mt-2 flex gap-2">
          <input value={inv.id} onChange={(e) => setInv((v) => ({ ...v, id: e.target.value }))} placeholder="ID único" className="flex-1 rounded-lg border border-neutral-200 px-3 py-2 text-sm" />
          <input value={inv.mensaje} onChange={(e) => setInv((v) => ({ ...v, mensaje: e.target.value }))} placeholder="Mensaje (opcional)" className="flex-1 rounded-lg border border-neutral-200 px-3 py-2 text-sm" />
          <button onClick={() => { if (!inv.id.trim()) return toast.error('Ingresa el ID'); toast.success('Invitación enviada'); setInv({ id: '', mensaje: '' }); }} className="rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand/90">Enviar invitación</button>
        </div>
      </section>

      <section className="rounded-2xl border border-neutral-200 p-4">
        <h2 className="text-lg font-semibold text-contrast">Compartir Archivo PDF</h2>
        <div onDragOver={(e) => e.preventDefault()} onDrop={onDropPDF} className="mt-2 grid place-items-center rounded-xl border-2 border-dashed border-brand p-6 text-sm text-neutral-600 bg-[radial-gradient(theme(colors.contrast.DEFAULT)/0.08,transparent_60%)]">Arrastra y suelta tus PDFs aquí</div>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          {pdfs.map((p) => (
            <div key={p.id} className="overflow-hidden rounded-xl border border-neutral-200">
              <div className="h-28 bg-neutral-100" />
              <div className="p-3 text-sm">
                <div className="font-medium text-contrast">{p.nombre}</div>
                <a href={p.url} target="_blank" rel="noreferrer" className="text-brand underline">Ver PDF</a>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
