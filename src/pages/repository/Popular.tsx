import { Search } from "lucide-react";
import { Input } from "../../desingSystem/primitives";
import { RepositoryList } from "../../features/repository/components/RepositoryList";
import { useRepository } from "../../features/repository/hooks/useRepository";
import styles from "../../features/repository/components/repository.module.css";

const Popular = () => {
  const { repositories, isLoading } = useRepository();

  return (
    <div className={styles.pageContainer}>
      
      {/* Header de la Página */}
      <div className={styles.headerSection}>
        <div>
          <h1 className="text-3xl font-bold text-primary-contrast">Repositorios Populares</h1>
          <p className="text-muted-foreground">
            Descubre el contenido más solicitado por la comunidad estudiantil.
          </p>
        </div>
        
        {/* Buscador Local */}
        <div className={styles.searchContainer}>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar por palabra clave, tema o docente..." 
            className="pl-10"
          />
        </div>
      </div>

      {/* Contenido Principal */}
      <RepositoryList isLoading={isLoading} repositories={repositories} />
    </div>
  );
};

export default Popular;