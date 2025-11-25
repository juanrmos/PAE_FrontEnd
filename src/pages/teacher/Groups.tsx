import { Plus, Users, Calendar, Trash2, Settings } from "lucide-react";
import { 
  Button, Card, CardContent, CardHeader, CardTitle, Skeleton, Badge 
} from "../../desingSystem/primitives";
import { useTeacherGroups } from "../../features/groups/hooks/useTeacherGroups";
import styles from "../../features/groups/components/groups.module.css";

const TeacherGroups = () => {
  const { groups, isLoading, deleteGroup } = useTeacherGroups();

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary-contrast">Mis Grupos de Estudio</h1>
          <p className="text-muted-foreground">Administra tus comunidades y alumnos.</p>
        </div>
        <Button className={styles.createButton}>
          <Plus className="h-4 w-4" /> Crear Grupo
        </Button>
      </div>

      {isLoading ? (
        <div className={styles.groupsGrid}>
          {/* Skeletons para carga */}
          <Skeleton className="h-48 w-full rounded-xl" />
          <Skeleton className="h-48 w-full rounded-xl" />
          <Skeleton className="h-48 w-full rounded-xl" />
        </div>
      ) : groups.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-xl">
          No tienes grupos activos. ¡Crea uno para empezar!
        </div>
      ) : (
        <div className="groupsGrid grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"> 
          {/* Nota: Asegúrate que groups.module.css tenga .groupsGrid definidos como grid */}
          {groups.map((group) => (
            <Card key={group.id} className={styles.groupCard}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <Badge variant="secondary">{group.subject}</Badge>
                  {/* Menú de acciones rápido */}
                </div>
                <CardTitle className="text-xl mt-2 text-primary-contrast">{group.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className={styles.memberCount}>
                    <Users className="h-4 w-4" /> {group.membersCount} Estudiantes
                  </div>
                  
                  {group.nextSession && (
                    <div className="flex items-center gap-2 text-xs text-brand-action font-medium bg-brand-action/5 p-2 rounded-lg">
                      <Calendar className="h-3 w-3" /> 
                      Próxima sesión: {group.nextSession}
                    </div>
                  )}
                  
                  <div className="flex gap-2 mt-4 pt-2 border-t border-neutral-100">
                    <Button variant="outline" size="sm" className="flex-1 gap-2">
                      <Settings className="h-3 w-3" /> Gestionar
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={() => deleteGroup(group.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeacherGroups;