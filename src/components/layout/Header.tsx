import { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "../../desingSystem/primitives/Button";
import { Sheet, SheetContent, SheetTrigger } from "../../desingSystem/primitives/Sheet";
import { Sidebar } from "./Sidebar";



//!Inconsistencia en nombre de marca (Landing usa "PAE", Header usa "Pulse"). MANTENER PAE

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-neutral-white px-6 shadow-sm md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="-ml-2">
            <Menu className="h-6 w-6 text-primary-contrast" />
            <span className="sr-only">Abrir menú</span>
          </Button>
        </SheetTrigger>
        
        {/* Contenido del Menú Móvil */}
        <SheetContent side="left" className="p-0 w-72">
          {/* Pasamos onClose para que al hacer clic en un link se cierre el menú */}
          <Sidebar onClose={() => setOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Logo en versión móvil */}
      <div className="flex items-center gap-2 font-bold text-lg text-primary-contrast">
        <div className="h-6 w-6 rounded bg-brand-action" />
        <span>Pulse</span>
      </div>
    </header>
  );
}