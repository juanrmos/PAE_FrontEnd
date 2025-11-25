import { Skeleton } from "../../../desingSystem/primitives";
import { GroupCard } from "./GroupCard";
import { useStudentGroups } from "../hooks/useStudentsGroups";
import styles from "./groups.module.css";

export function StudentGroupList() {
  const { groups, isLoading } = useStudentGroups();

  if (isLoading) {
    return (
      <div className={styles.groupsGrid}>
        <Skeleton className="h-48 w-full rounded-xl" />
        <Skeleton className="h-48 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-primary-contrast">Mis Comunidades</h2>
      
      {groups.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-xl">
          Aún no te has unido a ninguna comunidad.
        </div>
      ) : (
        <div className={styles.groupsGrid}>
          {groups.map((group) => (
            // Reutilizamos GroupCard con rol estudiante
            <GroupCard key={group.id} group={group} role="estudiante" />
          ))}
        </div>
      )}
    </div>
  );
}