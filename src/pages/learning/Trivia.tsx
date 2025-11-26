// src/pages/learning/Trivia.tsx
import { Zap, Trophy, RotateCcw, CheckCircle, XCircle } from "lucide-react";
import {
  Card,
  CardContent,
  Button,
  Badge,
  Skeleton,
} from "../../desingSystem/primitives";
import { useTrivia } from "../../features/learning/hooks/useLearning";
import styles from "../../features/learning/components/learning.module.css";

const Trivia = () => {
  const {
    currentQuestion,
    currentIndex,
    totalQuestions,
    score,
    answered,
    selectedAnswer,
    isLastQuestion,
    isCompleted,
    isLoading,
    answerQuestion,
    nextQuestion,
    reset,
  } = useTrivia();

  if (isLoading) {
    return (
      <div className={styles.triviaContainer}>
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className={styles.triviaContainer}>
        <Card>
          <CardContent className="p-12 text-center">
            <Zap className="h-12 w-12 mx-auto mb-4 text-neutral-300" />
            <p className="text-muted-foreground">
              No hay preguntas de trivia disponibles
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-brand-action/10 rounded-xl">
            <Zap className="h-6 w-6 text-brand-action" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-primary-contrast">
              Trivia Diaria
            </h1>
            <p className="text-muted-foreground">
              5 minutos de aprendizaje rápido • Gana puntos cada día
            </p>
          </div>
        </div>
        <Badge className="bg-brand-action/10 text-brand-action text-lg px-4 py-2">
          <Trophy className="h-4 w-4 mr-2" />
          {score} pts
        </Badge>
      </div>

      {/* Contenedor de Trivia */}
      <div className={styles.triviaContainer}>
        {!isCompleted ? (
          <Card className={styles.triviaCard}>
            {/* Progreso */}
            <div className={styles.triviaProgress}>
              <span>
                Pregunta {currentIndex + 1} de {totalQuestions}
              </span>
              <Badge variant="outline">{currentQuestion.category}</Badge>
            </div>

            {/* Pregunta */}
            <h2 className={styles.triviaQuestion}>{currentQuestion.question}</h2>

            {/* Opciones */}
            <div className={styles.triviaOptions}>
              {currentQuestion.options.map((option, index) => {
                const isCorrect = index === currentQuestion.correctAnswer;
                const isSelected = index === selectedAnswer;
                
                let buttonClass = styles.triviaOption;
                if (answered) {
                  if (isCorrect) {
                    buttonClass += ` ${styles.triviaOptionCorrect}`;
                  } else if (isSelected && !isCorrect) {
                    buttonClass += ` ${styles.triviaOptionIncorrect}`;
                  }
                }

                return (
                  <button
                    key={index}
                    onClick={() => answerQuestion(index)}
                    disabled={answered}
                    className={buttonClass}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span>{option}</span>
                      {answered && isCorrect && (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      )}
                      {answered && isSelected && !isCorrect && (
                        <XCircle className="h-5 w-5 text-red-600" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Botón de Siguiente */}
            {answered && (
              <div className={styles.triviaActions}>
                <Button
                  size="lg"
                  onClick={nextQuestion}
                  disabled={isLastQuestion}
                  className="bg-brand-action hover:bg-brand-action/90 text-white px-8"
                >
                  {isLastQuestion ? "Ver Resultados" : "Siguiente Pregunta →"}
                </Button>
              </div>
            )}
          </Card>
        ) : (
          /* Vista de Completado */
          <Card className={styles.triviaCard}>
            <div className={styles.triviaCompleted}>
              <div className="animate-bounce mb-6">
                <Trophy className="h-20 w-20 mx-auto text-brand-action" />
              </div>
              
              <h2 className="text-3xl font-bold text-primary-contrast mb-2">
                ¡Trivia Completada!
              </h2>
              
              <p className={styles.triviaScore}>{score}</p>
              <p className={styles.triviaScoreLabel}>
                Puntos ganados de {totalQuestions * 15} posibles
              </p>

              {/* Estadísticas */}
              <div className="bg-neutral-50 rounded-xl p-6 mb-8 max-w-md mx-auto">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-green-600">
                      {Math.round((score / (totalQuestions * 15)) * totalQuestions)}
                    </p>
                    <p className="text-sm text-muted-foreground">Correctas</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-red-600">
                      {totalQuestions - Math.round((score / (totalQuestions * 15)) * totalQuestions)}
                    </p>
                    <p className="text-sm text-muted-foreground">Incorrectas</p>
                  </div>
                </div>
              </div>

              {/* Mensaje de Motivación */}
              <div className="bg-brand-action/10 border-l-4 border-brand-action rounded p-4 mb-6 max-w-md mx-auto">
                <p className="text-sm text-primary-contrast">
                  {score >= totalQuestions * 12
                    ? "¡Excelente! Dominas estos temas a la perfección."
                    : score >= totalQuestions * 8
                    ? "¡Buen trabajo! Sigue así y mejorarás cada día."
                    : "Sigue practicando, cada día aprenderás más."}
                </p>
              </div>

              {/* Botones */}
              <div className="flex gap-4 justify-center">
                <Button
                  size="lg"
                  variant="outline"
                  onClick={reset}
                  className="gap-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  Intentar de Nuevo
                </Button>
                <Button
                  size="lg"
                  className="bg-brand-action hover:bg-brand-action/90 text-white"
                  onClick={() => alert("Compartir en redes próximamente")}
                >
                  Compartir Resultado
                </Button>
              </div>

              {/* Racha Diaria */}
              <div className="mt-8 pt-8 border-t border-neutral-200">
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Zap className="h-4 w-4 text-brand-action" />
                  <span>
                    ¡Racha de <strong className="text-brand-action">7 días</strong> consecutivos!
                  </span>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Información Adicional */}
      <Card className="bg-neutral-50/50">
        <CardContent className="p-6">
          <h3 className="font-semibold text-primary-contrast mb-3">
            Sobre la Trivia Diaria
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex gap-3">
              <Zap className="h-5 w-5 text-brand-action flex-shrink-0" />
              <div>
                <p className="font-medium text-primary-contrast">5 Minutos</p>
                <p className="text-xs text-muted-foreground">
                  Sesiones cortas de microaprendizaje
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Trophy className="h-5 w-5 text-brand-action flex-shrink-0" />
              <div>
                <p className="font-medium text-primary-contrast">Gana Puntos</p>
                <p className="text-xs text-muted-foreground">
                  Acumula puntos por respuestas correctas
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <CheckCircle className="h-5 w-5 text-brand-action flex-shrink-0" />
              <div>
                <p className="font-medium text-primary-contrast">Temas Variados</p>
                <p className="text-xs text-muted-foreground">
                  Nuevas preguntas cada día
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Trivia;