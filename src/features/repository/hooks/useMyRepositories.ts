import { useState, useEffect } from "react";
import { getMyRepositories, type Repository } from "../services/repositoryService";
import { useToast } from "../../../hooks/useToast";

export const useMyRepositories = () => {
  const [repos, setRepos] = useState<Repository[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const loadRepos = async () => {
    setIsLoading(true);
    try {
      const data = await getMyRepositories();
      setRepos(data);
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "No cargaron tus repositorios" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRepos();
  }, []);


  const deleteRepo = async (id: string) => {
    // Aquí iría la llamada a la API real: await api.delete(`/repos/${id}`)
    setRepos((prev) => prev.filter((r) => r.id !== id)); // Optimistic update
    toast({ title: "Eliminado", description: "El repositorio ha sido eliminado." });
  };

  return { repos, isLoading, deleteRepo };
};