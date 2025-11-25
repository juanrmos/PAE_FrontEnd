import { useState, useEffect } from "react";
import { getStudentGroups, type Group } from "../services/groupsService";

export const useStudentGroups = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getStudentGroups().then(setGroups).finally(() => setIsLoading(false));
  }, []);

  return { groups, isLoading };
};