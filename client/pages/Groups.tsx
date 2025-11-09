import { useMemo, useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Role = "estudiante" | "docente";

type User = { id: string; nombre: string };
const MOCK_USERS: User[] = [
  { id: "5XG8Z", nombre: "Juana Pérez" },
  { id: "7KQ2M", nombre: "Carlos Díaz" },
  { id: "91ABT", nombre: "María García" },
  { id: "L0MN3", nombre: "Ana Torres" },
];

type Invitacion = { id: string; mensaje?: string; estado: "enviada" | "aceptada" | "rechazada" };

type PDFItem = { id: string; file: File; url: string; titulo: string; autor: string; tags: string[] };

type ForoPregunta = {
  id: string;
  titulo: string;
  cuerpo: string;
  etiquetas: string[];
  votos: number;
  respondida: boolean;
  creadaEn: number;
};

type ChatMensaje =
  | { id: string; autor: string; tipo: "texto"; contenido: string }
  | { id: string; autor: string; tipo: "recurso"; titulo: string; descripcion: string; enlace?: string; imagen?: string };

export default function Groups() {
  const [role, setRole] = useState<Role>("estudiante");

  // RQ03: búsqueda global con autocompletar + agregar amigo
  const [q, setQ] = useState("");
  const [agregados, setAgregados] = useState<Record<string, boolean>>({});
  const sugerencias = useMemo(() => {
    if (!q) return [] as User[];
    const s = q.trim().toLowerCase();
    return MOCK_USERS.filter((u) => u.nombre.toLowerCase().includes(s) || u.id.toLowerCase().includes(s));
  }, [q]);

  // RQ10/RQ11: creación de grupos e invitaciones
  const [grupo, setGrupo] = useState({ nombre: "", descripcion: "", materia: "", visibilidad: "privado" as "privado" | "publico", icono: "" });
  const [invitaciones, setInvitaciones] = useState<Invitacion[]>([]);
  const [inv, setInv] = useState({ id: "", mensaje: "" });

  // RQ12: compartir PDFs
  const [pdfs, setPdfs] = useState<PDFItem[]>([]);
  const [pdfSel, setPdfSel] = useState<string | null>(null);

  // RQ42/RQ82/RQ85: foro con filtros, búsqueda y creación
  const [foro, setForo] = useState<ForoPregunta[]>([
    { id: "f1", titulo: "¿Consejos para probabilidad?", cuerpo: "Busco ejercicios recomendados.", etiquetas: ["matemáticas"], votos: 3, respondida: false, creadaEn: Date.now() - 1000 * 60 * 60 },
    { id: "f2", titulo: "Álgebra lineal: matrices", cuerpo: "¿Cómo iniciare?", etiquetas: ["álgebra"], votos: 8, respondida: true, creadaEn: Date.now() - 1000 * 60 * 60 * 5 },
  ]);
  const [foroFiltro, setForoFiltro] = useState<"recientes" | "sin-responder" | "populares">("recientes");
  const [foroQ, setForoQ] = useState("");
  const [nuevo, setNuevo] = useState({ titulo: "", cuerpo: "", etiquetas: "" });
  const [ambitoPublico, setAmbitoPublico] = useState(true); // público/privado (RQ85)

  // RQ71: chat + recomendar recurso
  const [chat, setChat] = useState<ChatMensaje[]>([
    { id: "c1", autor: "Juana", tipo: "texto", contenido: "Hola equipo 👋" },
  ]);
  const [recursoOpen, setRecursoOpen] = useState(false);
  const [recForm, setRecForm] = useState({ titulo: "", descripcion: "", enlace: "", imagen: "" });

  const onAddAmigo = (u: User) => {
    setAgregados((a) => ({ ...a, [u.id]: true }));
    toast.success(`Solicitud enviada a ${u.nombre}`);
  };

  const onCrearGrupo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!grupo.nombre || !grupo.materia) {
      toast.error("Completa nombre y materia");
      return;
    }
    toast.success("Grupo creado");
  };

  const onEnviarInv = () => {
    if (!inv.id.trim()) {
      toast.error("Ingresa el ID único");
      return;
    }
    const nuevo: Invitacion = { id: inv.id.trim(), mensaje: inv.mensaje || undefined, estado: "enviada" };
    setInvitaciones((arr) => [nuevo, ...arr]);
    setInv({ id: "", mensaje: "" });
    toast.success("Invitación enviada");
  };

  const onDropPDF = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter((f) => f.type === "application/pdf");
    if (!files.length) return;
    const mapped: PDFItem[] = files.map((file) => ({
      id: Math.random().toString(36).slice(2),
      file,
      url: URL.createObjectURL(file),
      titulo: file.name.replace(/\.pdf$/i, ""),
      autor: "",
      tags: [],
    }));
    setPdfs((p) => [...mapped, ...p]);
    setPdfSel(mapped[0].id);
    toast.success(`${mapped.length} PDF(s) añadido(s)`);
  };

  const foroFiltrado = useMemo(() => {
    let arr = foro.filter((p) => p.titulo.toLowerCase().includes(foroQ.toLowerCase()) || p.etiquetas.some((t) => t.includes(foroQ.toLowerCase())));
    if (foroFiltro === "sin-responder") arr = arr.filter((p) => !p.respondida);
    if (foroFiltro === "populares") arr = [...arr].sort((a, b) => b.votos - a.votos);
    if (foroFiltro === "recientes") arr = [...arr].sort((a, b) => b.creadaEn - a.creadaEn);
    return arr;
  }, [foro, foroQ, foroFiltro]);

  const crearPregunta = () => {
    if (!nuevo.titulo.trim() || !nuevo.cuerpo.trim()) {
      toast.error("Completa título y cuerpo");
      return;
    }
    const etiquetas = nuevo.etiquetas
      .split(",")
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);
    const creada: ForoPregunta = { id: Math.random().toString(36).slice(2), titulo: nuevo.titulo.trim(), cuerpo: nuevo.cuerpo.trim(), etiquetas, votos: 0, respondida: false, creadaEn: Date.now() };
    setForo((f) => [creada, ...f]);
    setNuevo({ titulo: "", cuerpo: "", etiquetas: "" });
    toast.success("Pregunta publicada");
  };

  const pdfActivo = pdfs.find((p) => p.id === pdfSel);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-contrast">Comunidades y Grupos de Estudio</h1>
          <p className="text-sm text-neutral-600">Conecta, comparte y aprende en comunidad</p>
        </div>
        <div className="flex items-center gap-3">
          <label className="text-sm text-neutral-700">Vista</label>
          <select value={role} onChange={(e) => setRole(e.target.value as Role)} className="rounded-lg border border-neutral-200 px-3 py-2 text-sm">
            <option value="estudiante">Estudiante</option>
            <option value="docente">Docente</option>
          </select>
        </div>
      </div>

      {/* RQ03: Búsqueda global */}
      <div className="rounded-2xl border border-neutral-200 p-4">
        <label className="mb-2 block text-sm font-medium text-contrast">Buscar por nombre o ID único</label>
        <div className="relative">
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 outline-none transition focus:border-contrast focus:ring-2 focus:ring-contrast/20"
            placeholder="Ej: Juana o 5XG8Z"
          />
          {!!sugerencias.length && (
            <div className="absolute z-10 mt-2 w-full rounded-xl border border-neutral-200 bg-white p-2 shadow-sm">
              {sugerencias.map((u) => (
                <div key={u.id} className="flex items-center justify-between rounded-lg px-2 py-2 hover:bg-neutral-50">
                  <div>
                    <div className="font-medium text-contrast">{u.nombre}</div>
                    <div className="text-xs text-neutral-600">ID: {u.id}</div>
                  </div>
                  <button
                    disabled={!!agregados[u.id]}
                    onClick={() => onAddAmigo(u)}
                    className={cn("rounded-lg px-3 py-1.5 text-sm font-semibold text-white", agregados[u.id] ? "bg-neutral-400" : "bg-brand hover:bg-brand/90")}
                  >
                    {agregados[u.id] ? "Enviado" : "Agregar amigo"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Columna izquierda: Foro + Chat */}
        <div className="space-y-6 lg:col-span-2">
          {/* Foro (RQ42/RQ82/RQ85) */}
          <section className="rounded-2xl border border-neutral-200 p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-contrast">Foro de preguntas y respuestas {ambitoPublico ? "(Público)" : "(Privado)"}</h2>
                <p className="text-sm text-neutral-600">Busca, filtra, vota y marca respuestas</p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  value={foroQ}
                  onChange={(e) => setForoQ(e.target.value)}
                  placeholder="Buscar en el foro"
                  className="w-48 rounded-lg border border-neutral-200 px-3 py-2 text-sm"
                />
                <select value={foroFiltro} onChange={(e) => setForoFiltro(e.target.value as any)} className="rounded-lg border border-neutral-200 px-3 py-2 text-sm">
                  <option value="recientes">Recientes</option>
                  <option value="sin-responder">Sin responder</option>
                  <option value="populares">Populares</option>
                </select>
                <label className="ml-2 inline-flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={ambitoPublico} onChange={(e) => setAmbitoPublico(e.target.checked)} />
                  Público
                </label>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              {foroFiltrado.map((p) => (
                <article key={p.id} className="flex items-start justify-between rounded-xl border border-neutral-200 p-3">
                  <div className="mr-4">
                    <button onClick={() => setForo((f) => f.map((x) => (x.id === p.id ? { ...x, votos: x.votos + 1 } : x)))} className="block rounded-lg bg-neutral-100 px-2 py-1 text-sm font-semibold text-contrast hover:bg-neutral-200">
                      ▲ {p.votos}
                    </button>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-contrast">{p.titulo}</h3>
                      {p.respondida && <span className="rounded bg-green-100 px-2 py-0.5 text-xs text-green-700">Aceptada</span>}
                    </div>
                    <p className="text-sm text-neutral-700">{p.cuerpo}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {p.etiquetas.map((t) => (
                        <span key={t} className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-700">#{t}</span>
                      ))}
                    </div>
                  </div>
                  <div className="ml-3 flex flex-col items-end gap-2">
                    <button onClick={() => setForo((f) => f.map((x) => (x.id === p.id ? { ...x, respondida: !x.respondida } : x)))} className="rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-medium text-contrast hover:bg-neutral-50">
                      {p.respondida ? "Desmarcar" : "Marcar aceptada"}
                    </button>
                  </div>
                </article>
              ))}
            </div>

            {/* Nueva pregunta (RQ82) */}
            <div className="mt-4 rounded-xl border border-neutral-200 p-3">
              <div className="text-sm font-semibold text-neutral-700">Proponer nueva pregunta</div>
              <div className="mt-2 grid gap-2 md:grid-cols-2">
                <input value={nuevo.titulo} onChange={(e) => setNuevo((v) => ({ ...v, titulo: e.target.value }))} placeholder="Título" className="rounded-lg border border-neutral-200 px-3 py-2 text-sm" />
                <input value={nuevo.etiquetas} onChange={(e) => setNuevo((v) => ({ ...v, etiquetas: e.target.value }))} placeholder="Etiquetas (coma separadas)" className="rounded-lg border border-neutral-200 px-3 py-2 text-sm" />
                <textarea value={nuevo.cuerpo} onChange={(e) => setNuevo((v) => ({ ...v, cuerpo: e.target.value }))} placeholder="Describe tu pregunta" className="md:col-span-2 rounded-lg border border-neutral-200 px-3 py-2 text-sm" />
              </div>
              <div className="mt-2 text-right">
                <button onClick={crearPregunta} className="rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand/90">Publicar</button>
              </div>
            </div>
          </section>

          {/* Chat + Recomendar recurso (RQ71) */}
          <section className="rounded-2xl border border-neutral-200 p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-contrast">Chat del grupo</h2>
              <button onClick={() => setRecursoOpen((v) => !v)} className="rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand/90">Recomendar recurso</button>
            </div>
            {recursoOpen && (
              <div className="mt-3 grid gap-2 rounded-xl border border-neutral-200 p-3 md:grid-cols-2">
                <input value={recForm.titulo} onChange={(e) => setRecForm((v) => ({ ...v, titulo: e.target.value }))} placeholder="Título del recurso" className="rounded-lg border border-neutral-200 px-3 py-2 text-sm" />
                <input value={recForm.enlace} onChange={(e) => setRecForm((v) => ({ ...v, enlace: e.target.value }))} placeholder="Enlace (opcional)" className="rounded-lg border border-neutral-200 px-3 py-2 text-sm" />
                <input value={recForm.imagen} onChange={(e) => setRecForm((v) => ({ ...v, imagen: e.target.value }))} placeholder="URL de imagen (opcional)" className="rounded-lg border border-neutral-200 px-3 py-2 text-sm" />
                <input value={recForm.descripcion} onChange={(e) => setRecForm((v) => ({ ...v, descripcion: e.target.value }))} placeholder="Descripción" className="rounded-lg border border-neutral-200 px-3 py-2 text-sm md:col-span-2" />
                <div className="text-right md:col-span-2">
                  <button
                    onClick={() => {
                      if (!recForm.titulo.trim()) return toast.error("Agrega un título");
                      setChat((c) => [
                        ...c,
                        { id: Math.random().toString(36).slice(2), autor: "Docente", tipo: "recurso", titulo: recForm.titulo, descripcion: recForm.descripcion, enlace: recForm.enlace || undefined, imagen: recForm.imagen || undefined },
                      ]);
                      setRecursoOpen(false);
                      setRecForm({ titulo: "", descripcion: "", enlace: "", imagen: "" });
                      toast.success("Recurso recomendado");
                    }}
                    className="rounded-xl bg-contrast px-4 py-2.5 text-sm font-semibold text-white hover:bg-contrast/90"
                  >
                    Publicar recurso
                  </button>
                </div>
              </div>
            )}

            <ul className="mt-4 space-y-3">
              {chat.map((m) => (
                <li key={m.id} className="rounded-xl border border-neutral-200 p-3">
                  {m.tipo === "texto" ? (
                    <p className="text-sm text-neutral-800"><span className="font-semibold text-contrast">{m.autor}: </span>{m.contenido}</p>
                  ) : (
                    <div className="flex items-start gap-3">
                      {m.imagen ? <img src={m.imagen} alt="img" className="h-16 w-24 rounded-lg object-cover" /> : <div className="h-16 w-24 rounded-lg bg-neutral-200" />}
                      <div className="flex-1">
                        <div className="font-semibold text-contrast">{m.titulo}</div>
                        <p className="text-sm text-neutral-700">{m.descripcion}</p>
                        {m.enlace && (
                          <a href={m.enlace} target="_blank" rel="noreferrer" className="text-sm font-semibold text-brand underline">Abrir enlace</a>
                        )}
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Columna derecha: Docente (creación) + Invitaciones + PDFs */}
        <div className="space-y-6">
          {role === "docente" && (
            <section className="rounded-2xl border border-neutral-200 p-4">
              <h2 className="text-lg font-semibold text-contrast">Crear grupo de estudio</h2>
              <form onSubmit={onCrearGrupo} className="mt-3 space-y-2">
                <input value={grupo.nombre} onChange={(e) => setGrupo((g) => ({ ...g, nombre: e.target.value }))} placeholder="Nombre del grupo" className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm" />
                <input value={grupo.materia} onChange={(e) => setGrupo((g) => ({ ...g, materia: e.target.value }))} placeholder="Materia" className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm" />
                <textarea value={grupo.descripcion} onChange={(e) => setGrupo((g) => ({ ...g, descripcion: e.target.value }))} placeholder="Descripción" className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm" />
                <div className="flex gap-3">
                  <select value={grupo.visibilidad} onChange={(e) => setGrupo((g) => ({ ...g, visibilidad: e.target.value as any }))} className="rounded-lg border border-neutral-200 px-3 py-2 text-sm">
                    <option value="privado">Privado</option>
                    <option value="publico">Público</option>
                  </select>
                  <input value={grupo.icono} onChange={(e) => setGrupo((g) => ({ ...g, icono: e.target.value }))} placeholder="URL de icono (opcional)" className="flex-1 rounded-lg border border-neutral-200 px-3 py-2 text-sm" />
                </div>
                <button type="submit" className="w-full rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand/90">Crear</button>
              </form>
            </section>
          )}

          <section className="rounded-2xl border border-neutral-200 p-4">
            <h2 className="text-lg font-semibold text-contrast">Invitar por ID</h2>
            <div className="mt-2 flex gap-2">
              <input value={inv.id} onChange={(e) => setInv((v) => ({ ...v, id: e.target.value }))} placeholder="ID único" className="flex-1 rounded-lg border border-neutral-200 px-3 py-2 text-sm" />
              <input value={inv.mensaje} onChange={(e) => setInv((v) => ({ ...v, mensaje: e.target.value }))} placeholder="Mensaje (opcional)" className="flex-1 rounded-lg border border-neutral-200 px-3 py-2 text-sm" />
              <button onClick={onEnviarInv} className="rounded-xl bg-contrast px-4 py-2.5 text-sm font-semibold text-white hover:bg-contrast/90">Enviar invitación</button>
            </div>
            <ul className="mt-3 space-y-2">
              {invitaciones.map((i, idx) => (
                <li key={idx} className="flex items-center justify-between rounded-lg border border-neutral-200 px-3 py-2 text-sm">
                  <div>
                    <div className="font-medium text-contrast">ID: {i.id}</div>
                    {i.mensaje && <div className="text-neutral-600">{i.mensaje}</div>}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={cn("rounded px-2 py-0.5 text-xs", i.estado === "enviada" && "bg-neutral-100 text-neutral-700", i.estado === "aceptada" && "bg-green-100 text-green-700", i.estado === "rechazada" && "bg-red-100 text-red-700")}>{i.estado}</span>
                    <button onClick={() => setInvitaciones((arr) => arr.map((x) => (x === i ? { ...x, estado: "aceptada" } : x)))} className="rounded-lg px-2 py-1 text-xs hover:bg-neutral-100">Aceptar</button>
                    <button onClick={() => setInvitaciones((arr) => arr.map((x) => (x === i ? { ...x, estado: "rechazada" } : x)))} className="rounded-lg px-2 py-1 text-xs hover:bg-neutral-100">Rechazar</button>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl border border-neutral-200 p-4">
            <h2 className="text-lg font-semibold text-contrast">Compartir archivos PDF</h2>
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={onDropPDF}
              className="mt-2 grid place-items-center rounded-xl border-2 border-dashed border-neutral-300 p-6 text-sm text-neutral-600"
            >
              Arrastra y suelta tus PDFs aquí
            </div>
            <div className="mt-3 space-y-2">
              {pdfs.map((p) => (
                <div key={p.id} className="flex items-start justify-between gap-3 rounded-lg border border-neutral-200 p-2">
                  <button onClick={() => setPdfSel(p.id)} className="flex-1 text-left">
                    <div className="font-medium text-contrast">{p.titulo}</div>
                    <div className="text-xs text-neutral-600">{(p.file.size / 1024).toFixed(0)} KB • PDF</div>
                    {p.autor && <div className="text-xs text-neutral-700">Autor: {p.autor}</div>}
                    {!!p.tags.length && (
                      <div className="mt-1 flex flex-wrap gap-2">
                        {p.tags.map((t) => (
                          <span key={t} className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-700">#{t}</span>
                        ))}
                      </div>
                    )}
                  </button>
                  <div className="w-40">
                    <input value={p.titulo} onChange={(e) => setPdfs((arr) => arr.map((x) => (x.id === p.id ? { ...x, titulo: e.target.value } : x)))} className="mb-1 w-full rounded-md border border-neutral-200 px-2 py-1 text-xs" placeholder="Título" />
                    <input value={p.autor} onChange={(e) => setPdfs((arr) => arr.map((x) => (x.id === p.id ? { ...x, autor: e.target.value } : x)))} className="mb-1 w-full rounded-md border border-neutral-200 px-2 py-1 text-xs" placeholder="Autor" />
                    <input
                      value={p.tags.join(",")}
                      onChange={(e) => setPdfs((arr) => arr.map((x) => (x.id === p.id ? { ...x, tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) } : x)))}
                      className="w-full rounded-md border border-neutral-200 px-2 py-1 text-xs"
                      placeholder="tags,coma,sep"
                    />
                  </div>
                </div>
              ))}
            </div>
            {pdfActivo && (
              <div className="mt-4 overflow-hidden rounded-xl border border-neutral-200">
                <embed src={pdfActivo.url} type="application/pdf" className="h-[420px] w-full" />
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
