import { useState, useEffect } from "react";
import { 
  getMyRepositories, 
  deleteRepository as deleteRepoService,
  createRepository as createRepoService,
  type Repository,
  type CreateRepoData
} from "../services/repositoryService";
import { useToast } from "../../../hooks/useToast";
import { useNavigate } from "react-router-dom";

export const useMyRepositories = () => {
  const [repos, setRepos] = useState<Repository[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  const loadRepos = async () => {
    setIsLoading(true);
    try {
      const data = await getMyRepositories();
      setRepos(data);
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "No se cargaron tus repositorios." });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRepos();
  }, []);

  // Acción: Eliminar
  const remove = async (id: string) => {
    try {
      await deleteRepoService(id);
      setRepos((prev) => prev.filter((r) => r.id !== id)); // Optimistic update
      toast({ title: "Eliminado", description: "El repositorio ha sido eliminado." });
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "No se pudo eliminar." });
    }
  };

  // Acción: Crear
  const create = async (data: CreateRepoData) => {
    setIsLoading(true);
    try {
      await createRepoService(data);
      toast({ title: "Éxito", description: "Repositorio creado correctamente." });
      navigate("/docente/repositorios");
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "No se pudo crear el repositorio." });
    } finally {
      setIsLoading(false);
    }
  };

  return { repos, isLoading, remove, create };
};