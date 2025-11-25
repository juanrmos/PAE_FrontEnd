import { useState, useEffect } from "react";
import { getFavorites, type Repository } from "../services/repositoryService";
import { useToast } from "../../../hooks/useToast";

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<Repository[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchFavorites = async () => {
      setIsLoading(true);
      try {
        const data = await getFavorites();
        setFavorites(data);
      } catch (error) {
        toast({ 
          variant: "destructive", 
          title: "Error", 
          description: "No se pudieron cargar tus favoritos." 
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  return { favorites, isLoading };
};