// src/features/repository/components/RepositoryCard.tsx - MEJORADO
import { FolderGit2, Trash2, Settings, Star, Eye, Download } from "lucide-react";
import { Card, Button, Badge } from "../../../desingSystem/primitives";
import type { Repository } from "../services/repositoryService";
import { BRAND_CONFIG } from "../../../config/brandConfig";
import styles from "./repository.module.css";

interface Props {
  repo: Repository;
  variant?: "view" | "manage";
  onDelete?: (id: string) => void;
  onToggleFavorite?: (id: string) => void;
}

export function RepositoryCard({ repo, variant = "view", onDelete, onToggleFavorite }: Props) {
  const displayTags = repo.tags.slice(0, 3);

  return (
    <Card className={`${styles.cardHorizontal} group hover:shadow-xl transition-all duration-300`}>
      {/* Ícono Izquierdo con color de marca */}
      <div className={styles.iconContainer} 
           style={{ backgroundColor: `${BRAND_CONFIG.colors.primary}15` }}>
        <FolderGit2 className="h-6 w-6" 
                     style={{ color: BRAND_CONFIG.colors.primary }} />
      </div>

      {/* Contenido Central */}
      <div className={styles.contentContainer}>
        <div className="flex justify-between items-start pr-4">
          <h3 className={styles.cardTitle} title={repo.title}>
            {repo.title}
          </h3>
          
          {/* Botón de Favorito */}
          {variant === "view" && (
            <button
              onClick={() => onToggleFavorite?.(repo.id)}
              className="flex-shrink-0 p-2 rounded-lg hover:bg-neutral-100 transition-colors group"
            >
              <Star 
                className={`h-5 w-5 transition-all ${
                  repo.isFavorite 
                    ? 'fill-current' 
                    : 'group-hover:scale-110'
                }`}
                style={{ 
                  color: repo.isFavorite 
                    ? BRAND_CONFIG.colors.primary 
                    : '#9CA3AF' 
                }}
              />
            </button>
          )}
        </div>
        
        {/* Tags */}
        <div className={styles.cardTags}>
          {displayTags.map((tag, index) => (
            <span key={tag} className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {tag}
              </Badge>
              {index < displayTags.length - 1 && (
                <span className={styles.tagSeparator} />
              )}
            </span>
          ))}
        </div>

        {/* Meta Info */}
        <div className={styles.cardMeta}>
          <span className="font-medium text-primary-contrast">{repo.role}</span>
          <span>•</span>
          <span>Por {repo.author}</span>
          <span>•</span>
          <span>{repo.updatedAt}</span>
        </div>

        {/* Estadísticas (Solo en modo view) */}
        {variant === "view" && (
          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              <span>{repo.views}</span>
            </div>
            <div className="flex items-center gap-1">
              <Download className="h-3 w-3" />
              <span>{repo.downloads}</span>
            </div>
          </div>
        )}
      </div>

      {/* Acciones */}
      <div className={styles.actionContainer}>
        {variant === "manage" ? (
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
          <Button className={styles.viewButton} size="sm"
                  style={{ 
                    backgroundColor: BRAND_CONFIG.colors.primary,
                  }}>
            Ver Detalles
          </Button>
        )}
      </div>
    </Card>
  );
}