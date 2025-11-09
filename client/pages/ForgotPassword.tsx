import { useState } from "react";
import { Link } from "react-router-dom";
import { z } from "zod";
import { cn } from "@/lib/utils";

const schema = z.object({ email: z.string().min(1, "El correo es obligatorio").email("Ingresa un correo válido") });

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSent(null);
    const parsed = schema.safeParse({ email });
    if (!parsed.success) {
      setError(parsed.error.flatten().fieldErrors.email?.[0] || "Correo inválido");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.message || "Algo salió mal");
        return;
      }
      setSent(data?.message || "Si existe una cuenta, hemos enviado un enlace de restablecimiento.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white px-6 py-12 text-black sm:px-10">
      <div className="mx-auto w-full max-w-md">
        <Link to="/" className="text-sm text-contrast hover:underline">← Volver a iniciar sesión</Link>
        <h1 className="mt-4 text-3xl font-bold text-contrast">Restablecer tu contraseña</h1>
        <p className="mt-2 text-sm text-neutral-600">Te enviaremos instrucciones por correo para restablecerla.</p>

        <form onSubmit={submit} className="mt-8 space-y-5">
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium">Correo electrónico</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={cn(
                "block w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-base outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/30",
                error && "border-red-500 focus:border-red-500 focus:ring-red-200",
              )}
              placeholder="tu@ejemplo.com"
            />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
          </div>

          <button
            type="submit"
            className="inline-flex w-full items-center justify-center rounded-xl bg-brand px-4 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-brand/90 disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Enviando…" : "Enviar enlace de restablecimiento"}
          </button>

          {sent && <p className="text-sm text-green-700">{sent}</p>}
        </form>
      </div>
    </div>
  );
}
