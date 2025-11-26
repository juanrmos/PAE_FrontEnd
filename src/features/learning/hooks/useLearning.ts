// src/features/learning/hooks/useLearning.ts
import { useState, useEffect } from "react";
import {
  getUniversities,
  startSimulacro,
  getChallengeRooms,
  createChallengeRoom,
  getDailyTrivia,
  type University,
  type SimulacroConfig,
  type SimulacroResult,
  type ChallengeRoom,
  type TriviaQuestion,
} from "../services/learningService";
import { useToast } from "../../../hooks/useToast";

// Hook para Simulacros
export const useSimulacros = () => {
  const [universities, setUniversities] = useState<University[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [simulacro, setSimulacro] = useState<SimulacroResult | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadUniversities();
  }, []);

  const loadUniversities = async () => {
    setIsLoading(true);
    try {
      const data = await getUniversities();
      setUniversities(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudieron cargar las universidades.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const startExam = async (config: SimulacroConfig) => {
    setIsLoading(true);
    try {
      const result = await startSimulacro(config);
      setSimulacro(result);
      toast({
        title: "Simulacro iniciado",
        description: "¡Buena suerte! Recuerda que el tiempo corre.",
      });
      return result;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo iniciar el simulacro.",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { universities, simulacro, isLoading, startExam };
};

// Hook para Desafíos Colaborativos
export const useChallenges = () => {
  const [rooms, setRooms] = useState<ChallengeRoom[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    setIsLoading(true);
    try {
      const data = await getChallengeRooms();
      setRooms(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudieron cargar las salas.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createRoom = async (roomData: any) => {
    setIsLoading(true);
    try {
      const newRoom = await createChallengeRoom(roomData);
      setRooms((prev) => [newRoom, ...prev]);
      toast({
        title: "Sala creada",
        description: "Tu sala está lista. ¡Espera a que se unan otros jugadores!",
      });
      return newRoom;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo crear la sala.",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const joinRoom = async (roomId: string) => {
    toast({
      title: "Uniéndose a la sala",
      description: "Preparando el desafío...",
    });
    // Lógica de unirse (por implementar)
  };

  return { rooms, isLoading, createRoom, joinRoom, refresh: loadRooms };
};

// Hook para Trivia Diaria
export const useTrivia = () => {
  const [questions, setQuestions] = useState<TriviaQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadTrivia();
  }, []);

  const loadTrivia = async () => {
    setIsLoading(true);
    try {
      const data = await getDailyTrivia();
      setQuestions(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo cargar la trivia del día.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const answerQuestion = (answerIndex: number) => {
    if (answered) return;

    setSelectedAnswer(answerIndex);
    setAnswered(true);

    const isCorrect = answerIndex === questions[currentIndex].correctAnswer;
    if (isCorrect) {
      setScore((prev) => prev + questions[currentIndex].points);
      toast({
        title: "¡Correcto!",
        description: `+${questions[currentIndex].points} puntos`,
      });
    } else {
      toast({
        variant: "destructive",
        title: "Incorrecto",
        description: "Sigue intentando en la próxima pregunta.",
      });
    }
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setAnswered(false);
      setSelectedAnswer(null);
    }
  };

  const reset = () => {
    setCurrentIndex(0);
    setScore(0);
    setAnswered(false);
    setSelectedAnswer(null);
    loadTrivia();
  };

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;
  const isCompleted = answered && isLastQuestion;

  return {
    currentQuestion,
    currentIndex,
    totalQuestions: questions.length,
    score,
    answered,
    selectedAnswer,
    isLastQuestion,
    isCompleted,
    isLoading,
    answerQuestion,
    nextQuestion,
    reset,
  };
};