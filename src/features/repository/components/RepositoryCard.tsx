import { Eye, Download, Star, User } from "lucide-react";
import { 
  Card, CardContent, CardFooter, CardHeader, Badge, Button, Separator 
} from "../../../desingSystem/primitives";
import type { Repository } from "../services/repositoryService";
import styles from "./repository.module.css";

interface Props {
  repo: Repository;
}

export function RepositoryCard({ repo }: Props) {
  return (
    <Card className={styles.card}>
      <CardHeader className={styles.cardHeader}>
        <div className="flex justify-between items-start">
          <Badge variant="secondary" className="mb-2">{repo.role}</Badge>
          {repo.isFavorite && <Star className="h-4 w-4 text-brand-action fill-brand-action" />}
        </div>
        <h3 className={styles.cardTitle} title={repo.title}>{repo.title}</h3>
        <div className={styles.cardAuthor}>
          <User className="h-3 w-3" />
          {repo.author}
        </div>
      </CardHeader>
      
      <CardContent className="flex-1">
        <div className={styles.tagsContainer}>
          {repo.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs font-normal">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-3 pt-0">
        <Separator />
        <div className="flex w-full justify-between items-center">
          <div className={styles.statsContainer}>
            <span className={styles.statItem}>
              <Eye className="h-3 w-3" /> {repo.views}
            </span>
            <span className={styles.statItem}>
              <Download className="h-3 w-3" /> {repo.downloads}
            </span>
          </div>
          <span className="text-[10px] text-muted-foreground">{repo.updatedAt}</span>
        </div>
        <Button className={styles.actionButton} size="sm">
          Ver Recursos
        </Button>
      </CardFooter>
    </Card>
  );
}