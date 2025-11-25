import { useState, useEffect } from "react";
import { getPopularRepositories, type Repository } from "../services/repositoryService";
import { useToast } from "../../../hooks/useToast";

export const useRepository = () => {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadPopular();
  }, []);

  const loadPopular = async () => {
    setIsLoading(true);
    try {
      const data = await getPopularRepositories();
      setRepositories(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error al cargar",
        description: "No se pudieron obtener los repositorios.",
      });
      setRepositories([]); // Disparará el Empty State en la vista
    } finally {
      setIsLoading(false);
    }
  };

  return {
    repositories,
    isLoading,
    refresh: loadPopular
  };
};