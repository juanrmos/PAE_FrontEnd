import { useState, useEffect } from "react";
import { getTeacherGroups, type Group } from "../services/groupsService";
import { useToast } from "../../../hooks/useToast";

export const useTeacherGroups = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const loadGroups = async () => {
    setIsLoading(true);
    try {
      const data = await getTeacherGroups();
      setGroups(data);
    } catch (error) {
      toast({ 
        variant: "destructive", 
        title: "Error", 
        description: "No se pudieron cargar tus grupos." 
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadGroups();
  }, []);

  const deleteGroup = (id: string) => {
    // Simulación de eliminación optimista
    setGroups((prev) => prev.filter((g) => g.id !== id));
    toast({ title: "Grupo eliminado", description: "La comunidad ha sido cerrada." });
  };

  return { groups, isLoading, deleteGroup };
};