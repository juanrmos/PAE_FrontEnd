import { Search } from "lucide-react";
import { Input } from "../../../desingSystem/primitives";
import { RepositoryList } from "../../../features/repository/components/RepositoryList";
import { useRepository } from "../../../features/repository/hooks/useRepository"; // Reutilizamos hook
// Usamos los mismos estilos del repositorio porque es la misma UI base
import styles from "../../../features/repository/components/repository.module.css"; 

const StudentExplore = () => {
  const { repositories, isLoading } = useRepository();

  return (
    <div className={styles.pageContainer}>
      {/* Hero Section Simple para Estudiante */}
      <div className="bg-primary-contrast text-white rounded-2xl p-8 mb-8 relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">Explora y Aprende</h1>
          <p className="text-blue-100 max-w-lg mb-6">
            Accede a miles de recursos compartidos por docentes de toda la red.
          </p>
          
          {/* Buscador Integrado en Hero */}
          <div className="relative w-full max-w-md text-neutral-900">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="¿Qué quieres aprender hoy?" 
              className="pl-10 h-12 rounded-xl border-0 shadow-lg"
            />
          </div>
        </div>
        
        {/* Decoración de fondo (Círculos) */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-brand-action/20 rounded-full blur-2xl" />
      </div>

      <div>
        <h2 className="text-xl font-bold text-primary-contrast mb-4">Tendencias esta semana</h2>
        <RepositoryList isLoading={isLoading} repositories={repositories} />
      </div>
    </div>
  );
};

export default StudentExplore;