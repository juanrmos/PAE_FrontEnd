import { useEffect, useState } from "react";
import { Sidebar, type UserRole } from "./Sidebar";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";

export default function AppLayout({ children, role: roleProp, hideSidebar }: { children: React.ReactNode; role?: UserRole; hideSidebar?: boolean }) {
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState<UserRole>(() => (localStorage.getItem("role") as UserRole) || (roleProp ?? "estudiante"));

  useEffect(() => {
    const stored = (localStorage.getItem("role") as UserRole) || null;
    if (stored && stored !== role) setRole(stored);
    const onStorage = (e: StorageEvent) => {
      if (e.key === "role") setRole((e.newValue as UserRole) || "estudiante");
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [role, roleProp]);
  return (
    <div className="min-h-screen bg-white text-black">
      {!hideSidebar && <Sidebar role={role} />}
      <div className={cn(hideSidebar ? "md:pl-0" : "md:pl-72")}>
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-neutral-200 bg-white px-4 py-3 md:hidden">
          <button aria-label="Abrir menú" className="rounded-lg p-2 hover:bg-neutral-100" onClick={() => setOpen(true)}>
            <Menu className="h-5 w-5" />
          </button>
          <div className={cn("inline-flex items-center gap-2 text-lg font-extrabold text-contrast")}>Pulse</div>
        </header>
        <main className="px-4 py-6 md:px-8">{children}</main>
      </div>
      {open && <Sidebar role={role} mobile onClose={() => setOpen(false)} />}
    </div>
  );
}
