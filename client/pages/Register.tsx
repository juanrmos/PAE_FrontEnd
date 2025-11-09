import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as Dialog from "@radix-ui/react-dialog";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { RegisterRequest, RegisterResponse } from "@shared/api";
import { toast } from "sonner";

const baseSchema = z.object({
  name: z.string().min(2, "El nombre es muy corto").max(80, "El nombre es muy largo"),
  email: z.string().min(1, "El correo es obligatorio").email("Ingresa un correo válido"),
  password: z
    .string()
    .min(8, "Al menos 8 caracteres")
    .max(128, "Demasiado larga")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, "Usa mayúsculas, minúsculas y números"),
});

const consentSchema = z.object({
  acceptTerms: z.literal(true, { errorMap: () => ({ message: "Debes aceptar los términos" }) }),
  isTeacher: z.boolean().optional().default(false),
  institutionEmail: z.string().email("Ingresa un correo académico válido").optional(),
}).refine((val) => !val.isTeacher || !!val.institutionEmail, {
  path: ["institutionEmail"],
  message: "El correo institucional es obligatorio para profesores",
}).refine((val) => !val.isTeacher || /\.(edu|school|ac|uni)\b/.test(val.institutionEmail ?? ""), {
  path: ["institutionEmail"],
  message: "Usa un dominio académico (p. ej., .edu)",
});

function strength(password: string) {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^\w\s]/.test(password)) score++;
  score = Math.min(score, 4);
  const labels = ["Very weak", "Weak", "Fair", "Good", "Strong"];
  return { score, label: labels[score] } as const;
}

export default function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2>(1);
  const [base, setBase] = useState({ name: "", email: "", password: "" });
  const [baseErrors, setBaseErrors] = useState<Partial<Record<keyof typeof base, string>>>({});
  const [consent, setConsent] = useState({ acceptTerms: false, isTeacher: false, institutionEmail: "" });
  const [consentErrors, setConsentErrors] = useState<Partial<Record<keyof typeof consent, string>>>({});
  const [loading, setLoading] = useState(false);

  const s = useMemo(() => strength(base.password), [base.password]);

  const next = () => {
    const parsed = baseSchema.safeParse(base);
    if (!parsed.success) {
      const f = parsed.error.flatten().fieldErrors;
      setBaseErrors({ name: f.name?.[0], email: f.email?.[0], password: f.password?.[0] });
      return;
    }
    setBaseErrors({});
    setStep(2);
  };

  const submit = async () => {
    const parsed = consentSchema.safeParse(consent);
    if (!parsed.success) {
      const f = parsed.error.flatten().fieldErrors as any;
      setConsentErrors({ acceptTerms: f.acceptTerms?.[0], institutionEmail: f.institutionEmail?.[0] });
      return;
    }
    setConsentErrors({});

    setLoading(true);
    try {
      const payload: RegisterRequest = {
        name: base.name,
        email: base.email,
        password: base.password,
        acceptTerms: parsed.data.acceptTerms,
        isTeacher: parsed.data.isTeacher,
        institutionEmail: parsed.data.isTeacher ? parsed.data.institutionEmail : undefined,
      };
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as RegisterResponse | any;
      if (!res.ok) {
        toast.error(data?.message || "Registration failed");
        return;
      }
      toast.success("Account created. Please log in.");
      navigate("/");
    } catch {
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="grid min-h-screen lg:grid-cols-5">
        <div className="relative flex items-center justify-center px-6 py-12 sm:px-10 lg:col-span-3 lg:px-16">
          <div className="absolute left-6 top-6 text-2xl font-extrabold tracking-tight text-contrast">
            <span className="inline-flex items-center gap-2">
              <span className="inline-block h-8 w-8 rounded-lg bg-brand" />
              <span>Pulse</span>
            </span>
          </div>

          <div className="w-full max-w-md">
            <h1 className="text-3xl font-bold text-contrast">Crea tu cuenta</h1>
            <p className="mt-2 text-sm text-neutral-600">Únete en segundos. Es gratis.</p>

            {step === 1 && (
              <div className="mt-8 space-y-5">
                <div>
                  <label htmlFor="name" className="mb-2 block text-sm font-medium">Nombre completo</label>
                  <input
                    id="name"
                    type="text"
                    className={cn(
                      "block w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-base outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/30",
                      baseErrors.name && "border-red-500 focus:border-red-500 focus:ring-red-200",
                    )}
                    placeholder="Juana Pérez"
                    value={base.name}
                    onChange={(e) => setBase((v) => ({ ...v, name: e.target.value }))}
                  />
                  {baseErrors.name && <p className="mt-1 text-sm text-red-600">{baseErrors.name}</p>}
                </div>

                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-medium">Correo electrónico</label>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    className={cn(
                      "block w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-base outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/30",
                      baseErrors.email && "border-red-500 focus:border-red-500 focus:ring-red-200",
                    )}
                    placeholder="you@example.com"
                    value={base.email}
                    onChange={(e) => setBase((v) => ({ ...v, email: e.target.value }))}
                  />
                  {baseErrors.email && <p className="mt-1 text-sm text-red-600">{baseErrors.email}</p>}
                </div>

                <div>
                  <label htmlFor="password" className="mb-2 block text-sm font-medium">Contraseña</label>
                  <input
                    id="password"
                    type="password"
                    autoComplete="new-password"
                    className={cn(
                      "block w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-base outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/30",
                      baseErrors.password && "border-red-500 focus:border-red-500 focus:ring-red-200",
                    )}
                    placeholder="Al menos 8 caracteres"
                    value={base.password}
                    onChange={(e) => setBase((v) => ({ ...v, password: e.target.value }))}
                  />
                  {baseErrors.password && <p className="mt-1 text-sm text-red-600">{baseErrors.password}</p>}

                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs text-neutral-600">
                      <span>Fortaleza de la contraseña</span>
                      <span className={cn(
                        s.score >= 3 ? "text-green-700" : s.score === 2 ? "text-amber-700" : "text-red-700",
                      )}>{s.label}</span>
                    </div>
                    <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-neutral-200">
                      <div
                        className={cn(
                          "h-full transition-all",
                          s.score === 0 && "w-1/12 bg-red-500",
                          s.score === 1 && "w-1/4 bg-red-500",
                          s.score === 2 && "w-1/2 bg-amber-500",
                          s.score === 3 && "w-3/4 bg-brand",
                          s.score >= 4 && "w-full bg-green-600",
                        )}
                      />
                    </div>
                  </div>
                </div>

                <button
                  onClick={next}
                  className="inline-flex w-full items-center justify-center rounded-xl bg-brand px-4 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-brand/90"
                >
                  Continuar
                </button>

                <p className="text-center text-sm text-neutral-600">
                  ¿Ya tienes una cuenta? {" "}
                  <Link to="/" className="font-semibold text-contrast hover:underline">Iniciar Sesión</Link>
                </p>
              </div>
            )}

            {step === 2 && (
              <div className="mt-8 space-y-5">
                <div className="rounded-xl border border-neutral-200 p-4">
                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      className="mt-1 h-4 w-4 rounded border-neutral-300 text-brand focus:ring-brand/30"
                      checked={consent.acceptTerms}
                      onChange={(e) => setConsent((v) => ({ ...v, acceptTerms: e.target.checked }))}
                    />
                    <span className="text-sm text-neutral-700">
                      Acepto la <LegalLink title="Política de Privacidad">Política de Privacidad</LegalLink> y <LegalLink title="Términos de Uso">Términos de Uso</LegalLink>.
                    </span>
                  </label>
                  {consentErrors.acceptTerms && <p className="mt-2 text-sm text-red-600">{consentErrors.acceptTerms}</p>}
                </div>

                <div className="rounded-xl border border-neutral-200 p-4">
                  <label className="flex items-center justify-between gap-3">
                    <span className="text-sm text-neutral-700">¿Eres profesor(a)?</span>
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-neutral-300 text-brand focus:ring-brand/30"
                      checked={consent.isTeacher}
                      onChange={(e) => setConsent((v) => ({ ...v, isTeacher: e.target.checked }))}
                    />
                  </label>

                  {consent.isTeacher && (
                    <div className="mt-4">
                      <label htmlFor="institutionEmail" className="mb-2 block text-sm font-medium">
                        Correo institucional (.edu o académico)
                      </label>
                      <input
                        id="institutionEmail"
                        type="email"
                        className={cn(
                          "block w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-base outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/30",
                          consentErrors.institutionEmail && "border-red-500 focus:border-red-500 focus:ring-red-200",
                        )}
                        placeholder="nombre@universidad.edu"
                        value={consent.institutionEmail}
                        onChange={(e) => setConsent((v) => ({ ...v, institutionEmail: e.target.value }))}
                      />
                      {consentErrors.institutionEmail && (
                        <p className="mt-1 text-sm text-red-600">{consentErrors.institutionEmail}</p>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(1)}
                    className="inline-flex flex-1 items-center justify-center rounded-xl px-4 py-3 text-base font-medium text-neutral-700 hover:bg-neutral-100"
                  >
                    Volver
                  </button>
                  <button
                    onClick={submit}
                    disabled={loading}
                    className="inline-flex flex-1 items-center justify-center rounded-xl bg-brand px-4 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-brand/90 disabled:opacity-60"
                  >
                    {loading ? "Creando…" : "Crear Cuenta"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="relative hidden overflow-hidden bg-gradient-to-br from-contrast to-contrast/80 lg:col-span-2 lg:block">
          <div className="absolute inset-0">
            <svg className="absolute -right-10 -top-24 h-[36rem] w-[36rem] opacity-20" viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg">
              <g transform="translate(300,300)">
                <path d="M120,-158.5C156.1,-139.8,184.2,-104.9,201.7,-65.5C219.2,-26.1,225.2,17.9,211.1,54.2C197.1,90.6,163,119.3,126.8,146.6C90.6,173.9,52.3,199.8,11.2,213.1C-29.9,226.4,-74.9,226.9,-116.3,212.3C-157.7,197.7,-195.5,168,-209.7,129.2C-223.8,90.5,-214.4,42.7,-200.5,1.4C-186.6,-39.9,-168.1,-79.9,-140.2,-102.5C-112.3,-125.2,-75.9,-130.5,-42.5,-148.7C-9.2,-166.8,21.7,-197.2,58.9,-207.5C96.1,-217.8,139.6,-207.1,120,-158.5Z" fill="currentColor" />
              </g>
            </svg>
            <div className="absolute inset-x-0 bottom-0 h-64 bg-[radial-gradient(ellipse_at_bottom,theme(colors.brand.DEFAULT)/0.35,transparent_60%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(600px_300px_at_20%_20%,theme(colors.brand.DEFAULT)/0.25,transparent_60%)]" />
          </div>
          <div className="relative z-10 flex h-full flex-col items-center justify-center p-10 text-white">
            <div className="rounded-2xl bg-white/10 p-6 backdrop-blur-md">
              <h2 className="text-2xl font-bold">Bienvenido a Pulse</h2>
              <p className="mt-2 max-w-xs text-white/90">Crea tu cuenta en dos pasos. Los profesores pueden verificar con un correo académico.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LegalLink({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button className="font-semibold text-contrast underline decoration-2 underline-offset-2 hover:opacity-90">
          {children}
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40" />
        <Dialog.Content className="fixed left-1/2 top-1/2 w-[92vw] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-xl">
          <Dialog.Title className="text-lg font-semibold text-contrast">{title}</Dialog.Title>
          <Dialog.Description className="mt-2 text-sm text-neutral-700">
            Este es un contenido temporal para {title}. Proporciona tu texto y lo integro aquí o enlazo a una página dedicada.
          </Dialog.Description>
          <div className="mt-6 text-right">
            <Dialog.Cerrar asChild>
              <button className="inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-100">
                Cerrar
              </button>
            </Dialog.Cerrar>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
