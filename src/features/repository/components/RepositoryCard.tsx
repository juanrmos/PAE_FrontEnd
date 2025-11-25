import { FolderGit2, Trash2, Settings, Star } from "lucide-react";
import { Card, Button } from "../../../desingSystem/primitives";
import type { Repository } from "../services/repositoryService";
import styles from "./repository.module.css";

interface Props {
  repo: Repository;
  variant?: "view" | "manage"; // ✅ Nueva prop de control
  onDelete?: (id: string) => void;
}

export function RepositoryCard({ repo, variant = "view", onDelete }: Props) {
  const displayTags = repo.tags.slice(0, 3);

  return (
    <Card className={styles.cardHorizontal}>
      {/* 1. Ícono Izquierdo */}
      <div className={styles.iconContainer}>
        <FolderGit2 className="h-6 w-6" />
      </div>

      {/* 2. Contenido Central */}
      <div className={styles.contentContainer}>
        <div className="flex justify-between items-start pr-4">
          <h3 className={styles.cardTitle} title={repo.title}>
            {repo.title}
          </h3>
          {/* Mostrar Estrella si es favorito en modo vista */}
          {variant === "view" && repo.isFavorite && (
            <Star className="h-4 w-4 text-brand-action fill-brand-action flex-shrink-0" />
          )}
        </div>
        
        <div className={styles.cardTags}>
          {displayTags.map((tag, index) => (
            <span key={tag} className="flex items-center gap-2">
              {tag}
              {index < displayTags.length - 1 && (
                <span className={styles.tagSeparator} />
              )}
            </span>
          ))}
        </div>

        <div className={styles.cardMeta}>
          <span className="font-medium text-primary-contrast">{repo.role}</span>
          <span>•</span>
          <span>Por {repo.author}</span>
          <span>•</span>
          <span>{repo.updatedAt}</span>
        </div>
      </div>

      {/* 3. Acciones (Dinámicas según variant) */}
      <div className={styles.actionContainer}>
        {variant === "manage" ? (
          // MODO GESTIÓN (Mis Repositorios)
          <>
            <Button size="sm" variant="outline" className="gap-2 text-xs h-9">
              <Settings className="h-3 w-3" /> Gestionar
            </Button>
            {onDelete && (
              <Button
                variant="ghost"
                size="icon"
                className={styles.deleteIconButton}
                onClick={() => onDelete(repo.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </>
        ) : (
          // MODO VISTA (Públicos / Favoritos)
          <Button className={styles.viewButton} size="sm">
            Ver
          </Button>
        )}
      </div>
    </Card>
  );
}