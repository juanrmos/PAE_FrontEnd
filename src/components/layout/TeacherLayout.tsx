import { useState } from "react";
import { Menu } from "lucide-react";
import { Toaster } from "../ui/Toaster";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header"; // Reutilizamos el Header móvil que ya creamos
import { Sheet, SheetContent, SheetTrigger } from "../../desingSystem/primitives";
import { Button } from "../../desingSystem/primitives";
import { useIsMobile } from "../../hooks/useMobile";

interface Props {
  children: React.ReactNode;
}

export const TeacherLayout = ({ children }: Props) => {
  const isMobile = useIsMobile();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Forzamos el rol 'docente' para que el Sidebar muestre el menú correcto
  // NOTA: Aunque el Sidebar lee localStorage, aquí podríamos pasarle props si quisiéramos forzarlo visualmente.
  // Por ahora, confiamos en que el usuario logueado es docente.

  return (
    <div className="flex min-h-screen w-full bg-neutral-50">
      {/* Sidebar Desktop - Estilo específico para docentes si se requiere (ej. fondo más oscuro) */}
      <div className="hidden md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-[80]">
        <Sidebar className="bg-white border-r-neutral-200" /> 
      </div>

      {/* Contenido */}
      <div className="flex flex-col flex-1 md:pl-72 transition-all duration-300">
        
        {/* Header Móvil Reutilizable */}
        {isMobile && (
           <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-white px-6 shadow-sm md:hidden">
             <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
               <SheetTrigger asChild>
                 <Button variant="ghost" size="icon" className="-ml-2">
                   <Menu className="h-6 w-6 text-primary-contrast" />
                 </Button>
               </SheetTrigger>
               <SheetContent side="left" className="p-0 w-72">
                 <Sidebar onClose={() => setIsSidebarOpen(false)} />
               </SheetContent>
             </Sheet>
             <div className="font-bold text-lg text-primary-contrast">Pulse Docente</div>
           </header>
        )}

        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <div className="mx-auto max-w-7xl animate-in fade-in duration-500">
            {children}
          </div>
        </main>
      </div>
      <Toaster />
    </div>
  );
};