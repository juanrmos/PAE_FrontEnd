import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { SessionsResponse } from "@shared/api";

function copy(text: string) {
  navigator.clipboard.writeText(text).catch(() => {});
}

export default function Profile() {
  const [user] = useState(() => ({ id: "5XG8Z", name: "Jane Doe", email: "jane@example.com", major: "Computer Science" }));
  const [editing, setEditing] = useState({ name: user.name, email: user.email, major: user.major });
  const [sessions, setSessions] = useState<SessionsResponse["sessions"]>([]);
  const [tab, setTab] = useState<"personal" | "security">("personal");
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const [step, setStep] = useState(1);
  const totalSteps = 3;

  useEffect(() => {
    if (!localStorage.getItem("onboardingDone")) {
      setOnboardingOpen(true);
    }
  }, []);

  useEffect(() => {
    fetch("/api/auth/sessions").then((r) => r.json()).then((d: SessionsResponse) => setSessions(d.sessions)).catch(() => {});
  }, []);

  const progress = useMemo(() => Math.round((step / totalSteps) * 100), [step]);

  return (
    <div className="min-h-screen bg-white text-black">
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
          <div className="flex items-center gap-4">
            <img src="https://api.dicebear.com/9.x/initials/svg?seed=JD" alt="avatar" className="h-14 w-14 rounded-2xl border border-neutral-200" />
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-contrast">{user.name}</h1>
                <div className="inline-flex items-center gap-2 rounded-lg bg-neutral-100 px-3 py-1.5 text-xs text-neutral-700">
                  <span>ID: {user.id}</span>
                  <button onClick={() => copy(user.id)} className="rounded bg-neutral-200 px-1.5 py-0.5 text-[11px] font-semibold hover:bg-neutral-300">Copiar</button>
                </div>
              </div>
              <p className="text-sm text-neutral-600">{user.email}</p>
            </div>
          </div>
          <Link to="/" className="rounded-lg px-3 py-2 text-sm font-semibold text-contrast hover:bg-neutral-100">Cerrar sesión</Link>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-6 py-10 lg:grid-cols-4">
        <aside className="lg:col-span-1">
          <nav className="space-y-2">
            <button onClick={() => setTab("personal")} className={cn("w-full rounded-xl px-4 py-3 text-left font-medium", tab === "personal" ? "bg-neutral-100 text-contrast" : "hover:bg-neutral-50")}>Datos Personales</button>
            <button onClick={() => setTab("security")} className={cn("w-full rounded-xl px-4 py-3 text-left font-medium", tab === "security" ? "bg-neutral-100 text-contrast" : "hover:bg-neutral-50")}>Seguridad</button>
          </nav>
        </aside>

        <section className="lg:col-span-3">
          {tab === "personal" && (
            <div className="rounded-2xl border border-neutral-200 p-6">
              <h2 className="text-lg font-semibold text-contrast">Datos Personales</h2>
              <p className="mt-1 text-sm text-neutral-600">Actualiza tu perfil e intereses.</p>
              <div className="mt-6 grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium">Nombre completo</label>
                  <input className="block w-full rounded-xl border border-neutral-200 bg-white px-4 py-3" value={editing.name} onChange={(e) => setEditing((v) => ({ ...v, name: e.target.value }))} />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">Correo electrónico</label>
                  <input className="block w-full rounded-xl border border-neutral-200 bg-white px-4 py-3" value={editing.email} onChange={(e) => setEditing((v) => ({ ...v, email: e.target.value }))} />
                </div>
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium">Carrera de interés</label>
                  <input className="block w-full rounded-xl border border-neutral-200 bg-white px-4 py-3" placeholder="p. ej., Ciencia de Datos" value={editing.major} onChange={(e) => setEditing((v) => ({ ...v, major: e.target.value }))} />
                </div>
              </div>
              <div className="mt-6">
                <button className="inline-flex items-center justify-center rounded-xl bg-brand px-5 py-3 font-semibold text-white hover:bg-brand/90">Guardar Cambios</button>
              </div>
            </div>
          )}

          {tab === "security" && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-neutral-200 p-6">
                <h2 className="text-lg font-semibold text-contrast">Cambiar Contraseña</h2>
                <div className="mt-4 grid gap-4 md:grid-cols-3">
                  <input type="password" placeholder="Contraseña actual" className="rounded-xl border border-neutral-200 px-4 py-3" />
                  <input type="password" placeholder="Nueva contraseña" className="rounded-xl border border-neutral-200 px-4 py-3" />
                  <input type="password" placeholder="Confirmar nueva contraseña" className="rounded-xl border border-neutral-200 px-4 py-3" />
                </div>
                <div className="mt-4">
                  <button className="rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand/90">Actualizar Contraseña</button>
                </div>
              </div>

              <div className="rounded-2xl border border-neutral-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-contrast">Sesiones Activas</h3>
                    <p className="text-sm text-neutral-600">Administra dispositivos conectados a tu cuenta.</p>
                  </div>
                  <button onClick={async () => { await fetch("/api/auth/logout-all", { method: "POST" }); setSessions((s) => s.map((x) => ({ ...x, current: false })) ); }} className="rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand/90">Cerrar sesión en todos los dispositivos</button>
                </div>
                <ul className="mt-4 divide-y divide-neutral-200">
                  {sessions.map((s) => (
                    <li key={s.id} className="flex items-center justify-between py-3">
                      <div>
                        <div className="font-medium text-contrast">{s.device} {s.current && <span className="ml-2 rounded bg-green-100 px-2 py-0.5 text-xs text-green-700">Actual</span>}</div>
                        <div className="text-sm text-neutral-600">IP {s.ip} • Última actividad {new Date(s.lastActive).toLocaleString()}</div>
                      </div>
                      <button className="rounded-lg px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100">Cerrar sesión</button>
                    </li>
                  ))}
                </ul>
                <div className="mt-3 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">Las notificaciones de inicio de sesión en nuevos dispositivos están activadas. Recibirás alertas cuando un nuevo dispositivo inicie sesión.</div>
              </div>
            </div>
          )}
        </section>
      </main>

      {onboardingOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-contrast">¡Bienvenido! Personalicemos tu plan de estudio</h2>
              <button className="rounded-lg px-2 py-1 text-sm text-neutral-700 hover:bg-neutral-100" onClick={() => { localStorage.setItem("onboardingDone", "1"); setOnboardingOpen(false);} }>Omitir</button>
            </div>

            <div className="mb-3 h-2 w-full overflow-hidden rounded-full bg-neutral-200">
              <div className="h-full bg-brand transition-all" style={{ width: `${progress}%` }} />
            </div>

            {step === 1 && (
              <div className="space-y-4">
                <p className="text-neutral-700">¿Cuál es tu nivel académico actual?</p>
                <div className="grid grid-cols-2 gap-3">
                  {['High School', 'Undergraduate', 'Graduate', 'Other'].map((l) => (
                    <button key={l} className="rounded-xl border border-neutral-200 px-4 py-3 text-left hover:bg-neutral-50">{l}</button>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <p className="text-neutral-700">¿En qué carrera estás más interesado(a)?</p>
                <input placeholder="p. ej., Ciencia de Datos" className="w-full rounded-xl border border-neutral-200 px-4 py-3" />
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <p className="text-neutral-700">¿Cuántas horas por semana puedes dedicar al estudio?</p>
                <div className="grid grid-cols-3 gap-3">
                  {["<5", "5-10", "10-20", ">20"].map((l) => (
                    <button key={l} className="rounded-xl border border-neutral-200 px-4 py-3 text-left hover:bg-neutral-50">{l}</button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-neutral-600">Paso {step} de {totalSteps}</div>
              <div className="flex gap-3">
                {step > 1 && (
                  <button onClick={() => setStep((s) => Math.max(1, s - 1))} className="rounded-xl px-4 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-100">Volver</button>
                )}
                {step < totalSteps ? (
                  <button onClick={() => setStep((s) => Math.min(totalSteps, s + 1))} className="rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand/90">Continuar</button>
                ) : (
                  <button onClick={() => { localStorage.setItem("onboardingDone", "1"); setOnboardingOpen(false); }} className="rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand/90">Finalizar</button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
