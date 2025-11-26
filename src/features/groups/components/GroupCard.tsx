// src/features/groups/components/GroupCard.tsx
import { Users, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge, Button, Avatar, AvatarImage, AvatarFallback } from "../../../desingSystem/primitives";
import type { Group } from "../services/groupsService";
import styles from "./groups.module.css";

interface GroupCardProps {
  group: Group;
  role?: "docente" | "estudiante";
}

export function GroupCard({ group, role }: GroupCardProps) {
  const navigate = useNavigate();
  
  // Determinar el rol automáticamente desde localStorage si no se proporciona
  const userRole = role || (localStorage.getItem("role") as "docente" | "estudiante");

  const handleEnter = () => {
    const basePath = userRole === "docente" ? "/docente" : "/estudiante";
    navigate(`${basePath}/grupos/${group.id}`);
  };

  return (
    <div className={styles.groupCard} onClick={handleEnter}>
      <div className={styles.groupHeader}>
        <div className={styles.groupAvatar}>
          <Avatar className="w-full h-full">
            <AvatarImage src={group.avatar} alt={group.name} />
            <AvatarFallback className="bg-brand-action/10 text-brand-action font-bold">
              {group.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      <div>
        <Badge className={styles.groupSubject}>{group.subject}</Badge>
        <h3 className={styles.groupTitle}>{group.name}</h3>
      </div>

      <div className={styles.groupMeta}>
        <div className={styles.groupMetaItem}>
          <Users className="h-4 w-4" />
          <span>{group.membersCount} miembros</span>
        </div>
        {group.lastActivity && (
          <div className={styles.groupMetaItem}>
            <Clock className="h-4 w-4" />
            <span>{group.lastActivity}</span>
          </div>
        )}
      </div>

      {group.status && (
        <div className={styles.groupStatus}>
          <div className="w-2 h-2 rounded-full bg-success-progress animate-pulse" />
          {group.status}
        </div>
      )}

      <Button className={styles.groupEnterButton} onClick={(e) => {
        e.stopPropagation();
        handleEnter();
      }}>
        Ingresar al Grupo
      </Button>
    </div>
  );
}