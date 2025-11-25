import { useState } from "react";
import { useLocation } from "react-router-dom"; // Importante
import { Menu } from "lucide-react";
import { Toaster } from "../ui/Toaster";
import { Sidebar } from "./Sidebar";
import { Sheet, SheetContent, SheetTrigger } from "../../desingSystem/primitives";
import { Button } from "../../desingSystem/primitives";
import { useIsMobile } from "../../hooks/useMobile";
// Importamos todos los menús
import { STUDENT_MAIN_MENU, REPO_MENU_STUDENT, GROUPS_MENU_STUDENT } from "../../config/menus";

interface Props {
  children: React.ReactNode;
}

export const StudentLayout = ({ children }: Props) => {
  const isMobile = useIsMobile();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation(); // Hook para leer la URL actual

  // --- LÓGICA DE SELECCIÓN DE MENÚ ---
  let currentMenu = STUDENT_MAIN_MENU;
  let sidebarTitle = "Docente";
  let backRoute = undefined;

  if (location.pathname.includes("/repositorios")) {
    currentMenu = REPO_MENU_STUDENT;
    sidebarTitle = "Repositorio";
    backRoute = "/docente"; // Volver al Dashboard
  } else if (location.pathname.includes("/grupos")) {
    currentMenu = GROUPS_MENU_STUDENT;
    sidebarTitle = "Comunidades";
    backRoute = "/docente";
  }
  // -----------------------------------

  return (
    <div className="flex min-h-screen w-full bg-neutral-50">
      {/* Sidebar Desktop */}
      <div className="hidden md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-[80]">
        <Sidebar 
          className="bg-white border-r-neutral-200" 
          items={currentMenu} 
          title={sidebarTitle}
          backRoute={backRoute} // Pasamos la ruta de retorno
        /> 
      </div>

      <div className="flex flex-col flex-1 md:pl-72 transition-all duration-300">
        {isMobile && (
           <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-white px-6 shadow-sm md:hidden">
             <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
               <SheetTrigger asChild>
                 <Button variant="ghost" size="icon" className="-ml-2">
                   <Menu className="h-6 w-6 text-primary-contrast" />
                 </Button>
               </SheetTrigger>
               <SheetContent side="left" className="p-0 w-72">
                 <Sidebar 
                   onClose={() => setIsSidebarOpen(false)} 
                   items={currentMenu} 
                   title={sidebarTitle}
                   backRoute={backRoute}
                 />
               </SheetContent>
             </Sheet>
             <div className="font-bold text-lg text-primary-contrast">Pulse {sidebarTitle}</div>
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