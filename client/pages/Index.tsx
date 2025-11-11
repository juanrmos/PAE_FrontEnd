import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { DemoResponse, LoginRequest, LoginResponse, Verify2FARequest, Verify2FAResponse } from "@shared/api";
import * as Dialog from "@radix-ui/react-dialog";
import { OTPInput, SlotProps } from "input-otp";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const loginSchema = z.object({
  email: z.string().min(1, "El correo es obligatorio").email("Ingresa un correo válido"),
  password: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .max(128, "La contrase��a debe tener como máximo 128 caracteres"),
});

type LoginValues = z.infer<typeof loginSchema>;

export default function Index() {
  const navigate = useNavigate();
  const [exampleFromServer, setExampleFromServer] = useState("");
  const [twoFA, setTwoFA] = useState<{ open: boolean; challengeId?: string }>({ open: false });
  const [verifying, setVerifying] = useState(false);
  const [otp, setOtp] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [soyDocente, setSoyDocente] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const [values, setValues] = useState<LoginValues>({ email: "", password: "" });
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof LoginValues, string>>>({});

  useEffect(() => {
    fetchDemo();
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setFieldErrors({});
    const parsed = loginSchema.safeParse(values);
    if (!parsed.success) {
      const f = parsed.error.flatten().fieldErrors;
      setFieldErrors({ email: f.email?.[0], password: f.password?.[0] });
      return;
    }

    setLoginLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data as LoginRequest),
      });
      if (!res.ok) {
        const data = await res.json();
        const msg = data?.message || "Fallo al iniciar sesión";
        setLoginError(msg);
        toast.error(msg);
        return;
      }
      const data = (await res.json()) as LoginResponse;
      if ("need2FA" in data && data.need2FA) {
        setTwoFA({ open: true, challengeId: data.challengeId });
      } else if ("token" in data) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", soyDocente ? "docente" : "estudiante");
        navigate("/profile");
      }
    } catch {
      setLoginError("Error de red");
    } finally {
      setLoginLoading(false);
    }
  };

  const fetchDemo = async () => {
    try {
      const response = await fetch("/api/demo");
      const data = (await response.json()) as DemoResponse;
      setExampleFromServer(data.message);
    } catch (error) {
      console.error("Error fetching hello:", error);
    }
  };

  const disabledVerify = useMemo(() => otp.length !== 6, [otp]);

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="grid min-h-screen lg:grid-cols-5">
        {/* Form side */}
        <div className="relative flex items-center justify-center px-6 py-12 sm:px-10 lg:col-span-3 lg:px-16">
          <div className="absolute left-6 top-6 text-2xl font-extrabold tracking-tight text-contrast">
            <span className="inline-flex items-center gap-2">
              <span className="inline-block h-8 w-8 rounded-lg bg-brand" />
              <span>Pulse</span>
            </span>
          </div>
          <div className="w-full max-w-md">
            <h1 className="text-3xl font-bold text-contrast">¡Bienvenido!</h1>
            <p className="mt-2 text-sm text-neutral-600">Por favor, inicia sesión para continuar</p>

            <form onSubmit={onSubmit} className="mt-8 space-y-5">
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium">
                  Correo electrónico
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  className={cn(
                    "block w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-base outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/30",
                    fieldErrors.email && "border-red-500 focus:border-red-500 focus:ring-red-200",
                  )}
                  placeholder="you@example.com"
                  value={values.email}
                  onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
                />
                {fieldErrors.email && <p className="mt-1 text-sm text-red-600">{fieldErrors.email}</p>}
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="mb-2 block text-sm font-medium">
                    Contraseña
                  </label>
                  <Link to="/forgot-password" className="text-sm font-semibold text-contrast hover:underline">
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  className={cn(
                    "block w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-base outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/30",
                    fieldErrors.password && "border-red-500 focus:border-red-500 focus:ring-red-200",
                  )}
                  placeholder="••••••••"
                  value={values.password}
                  onChange={(e) => setValues((v) => ({ ...v, password: e.target.value }))}
                />
                {fieldErrors.password && <p className="mt-1 text-sm text-red-600">{fieldErrors.password}</p>}
              </div>

              {loginError && <div className="text-sm text-red-600">{loginError}</div>}

              <label className="flex items-center gap-2 text-sm text-neutral-700">
                <input type="checkbox" checked={soyDocente} onChange={(e) => setSoyDocente(e.target.checked)} className="h-4 w-4 rounded border-neutral-300 text-brand focus:ring-brand" />
                Ingresar como Docente
              </label>

              <button
                type="submit"
                className={cn(
                  "inline-flex w-full items-center justify-center rounded-xl bg-brand px-4 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-brand/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/50 disabled:cursor-not-allowed disabled:opacity-60",
                )}
                disabled={loginLoading}
              >
                {loginLoading ? "Iniciando…" : "Iniciar Sesión"}
              </button>

              <p className="text-center text-sm text-neutral-600">
                ¿No tienes una cuenta?{" "}
                <Link to="/register" className="font-semibold text-contrast hover:underline">
                  Crear una
                </Link>
              </p>
            </form>

            <p className="mt-8 hidden text-xs text-neutral-400">{exampleFromServer}</p>
          </div>
        </div>

        {/* Visual side */}
        <div className="relative hidden overflow-hidden bg-gradient-to-br from-contrast to-contrast/80 lg:col-span-2 lg:block">
          <div className="absolute inset-0">
            <svg className="absolute -left-20 -top-24 h-[36rem] w-[36rem] opacity-20" viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg">
              <g transform="translate(300,300)">
                <path d="M120,-158.5C156.1,-139.8,184.2,-104.9,201.7,-65.5C219.2,-26.1,225.2,17.9,211.1,54.2C197.1,90.6,163,119.3,126.8,146.6C90.6,173.9,52.3,199.8,11.2,213.1C-29.9,226.4,-74.9,226.9,-116.3,212.3C-157.7,197.7,-195.5,168,-209.7,129.2C-223.8,90.5,-214.4,42.7,-200.5,1.4C-186.6,-39.9,-168.1,-79.9,-140.2,-102.5C-112.3,-125.2,-75.9,-130.5,-42.5,-148.7C-9.2,-166.8,21.7,-197.2,58.9,-207.5C96.1,-217.8,139.6,-207.1,120,-158.5Z" fill="currentColor" />
              </g>
            </svg>
            <div className="absolute inset-x-0 bottom-0 h-64 bg-[radial-gradient(ellipse_at_bottom,theme(colors.brand.DEFAULT)/0.35,transparent_60%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(600px_300px_at_80%_20%,theme(colors.brand.DEFAULT)/0.25,transparent_60%)]" />
          </div>

          <div className="relative z-10 flex h-full flex-col items-center justify-center p-10 text-white">
            <div className="rounded-2xl bg-white/10 p-6 backdrop-blur-md">
              <h2 className="text-2xl font-bold">Acceso seguro</h2>
              <p className="mt-2 max-w-xs text-white/90">
                La Autenticación de Dos Factores protege tu cuenta. Ingresa el código enviado a tu dispositivo después de iniciar sesión.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2FA Dialog */}
      <Dialog.Root open={twoFA.open} onOpenChange={(open) => setTwoFA((s) => ({ ...s, open }))}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/40" />
          <Dialog.Content className="fixed left-1/2 top-1/2 w-[92vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-xl">
            <Dialog.Title className="text-lg font-semibold text-contrast">Autenticación de Dos Factores</Dialog.Title>
            <Dialog.Description className="mt-1 text-sm text-neutral-600">
              Ingresa el código de 6 dígitos de tu app de autenticación o SMS.
            </Dialog.Description>

            <div className="mt-6 flex justify-center">
              <OTPInput
                autoFocus
                maxLength={6}
                value={otp}
                onChange={setOtp}
                containerClassName="flex gap-2"
                render={({ slots }) => (
                  <>
                    {slots.map((slot, idx) => (
                      <OTPSlot key={idx} {...slot} />
                    ))}
                  </>
                )}
              />
            </div>

            <div className="mt-6 flex items-center gap-3">
              <button
                className="inline-flex flex-1 items-center justify-center rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand/90 disabled:opacity-60"
                disabled={disabledVerify || verifying}
                onClick={async () => {
                  if (!twoFA.challengeId) return;
                  setVerifying(true);
                  try {
                    const res = await fetch("/api/auth/verify-2fa", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ challengeId: twoFA.challengeId, code: otp } as Verify2FARequest),
                    });
                    if (!res.ok) {
                      const data = await res.json();
                      toast.error(data?.message || "Código inválido");
                      return;
                    }
                    const data = (await res.json()) as Verify2FAResponse;
                    setTwoFA({ open: false });
                    localStorage.setItem("token", data.token);
                    localStorage.setItem("role", soyDocente ? "docente" : "estudiante");
                    navigate("/profile");
                  } finally {
                    setVerifying(false);
                  }
                }}
              >
                {verifying ? "Verifying…" : "Verify"}
              </button>
              <Dialog.Close asChild>
                <button className="inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-100">
                  Cancelar
                </button>
              </Dialog.Close>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}

function OTPSlot({ char, hasFakeCaret, isActive }: SlotProps) {
  return (
    <div
      className={cn(
        "relative flex h-12 w-10 items-center justify-center rounded-lg border border-neutral-200 bg-white text-lg font-semibold text-contrast shadow-sm",
        isActive && "border-brand ring-2 ring-brand/30",
      )}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-5 w-px animate-pulse bg-brand" />
        </div>
      )}
    </div>
  );
}
