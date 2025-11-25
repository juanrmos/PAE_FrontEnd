import { RepositoryCard } from "./RepositoryCard";
import { Skeleton, Card } from "../../../desingSystem/primitives";
import styles from "./repository.module.css";
import type { Repository } from "../services/repositoryService";
import { Search } from "lucide-react";

interface Props {
  isLoading: boolean;
  repositories: Repository[];
}

export function RepositoryList({ isLoading, repositories }: Props) {
  
  // 1. Estado de Carga (Skeletons)
  if (isLoading) {
    return (
      <div className={styles.gridContainer}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-[180px] w-full rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // 2. Empty State (Si no hay datos)
  if (repositories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="bg-neutral-100 p-6 rounded-full mb-4">
          <Search className="h-10 w-10 text-neutral-400" />
        </div>
        <h3 className="text-lg font-semibold text-primary-contrast">No se encontraron repositorios</h3>
        <p className="text-muted-foreground max-w-sm mt-2">
          Parece que aún no hay contenido popular disponible. Intenta buscar con otros términos.
        </p>
      </div>
    );
  }

  // 3. Lista Real
  return (
    <div className={styles.gridContainer}>
      {repositories.map((repo) => (
        <RepositoryCard key={repo.id} repo={repo} />
      ))}
    </div>
  );
}