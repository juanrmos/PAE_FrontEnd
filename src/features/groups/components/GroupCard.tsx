import { Users, Calendar, Settings, Trash2 } from "lucide-react";
import { 
  Card, CardContent, CardHeader, CardTitle, Badge, Button 
} from "../../../desingSystem/primitives";
import type { Group } from "../services/groupsService";
import styles from "./groups.module.css";

interface GroupCardProps {
  group: Group;
  onDelete?: (id: string) => void;
  role: "docente" | "estudiante";
}

export function GroupCard({ group, onDelete, role }: GroupCardProps) {
  return (
    <Card className={styles.groupCard}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <Badge variant="secondary">{group.subject}</Badge>
        </div>
        <CardTitle className="text-xl mt-2 text-primary-contrast">
          {group.name}
        </CardTitle>
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
          
          {role === "docente" && (
            <div className="flex gap-2 mt-4 pt-2 border-t border-neutral-100">
              <Button variant="outline" size="sm" className="flex-1 gap-2">
                <Settings className="h-3 w-3" /> Gestionar
              </Button>
              {onDelete && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                  onClick={() => onDelete(group.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}