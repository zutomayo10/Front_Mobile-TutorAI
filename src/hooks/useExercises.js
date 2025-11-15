// src/hooks/useExercises.js
import { useState, useEffect } from 'react';
import { studentGetLevels, studentGetExercises, studentMarkOption } from '../services/api';

export const useExercises = () => {
  const [levels, setLevels] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [currentExercise, setCurrentExercise] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [exerciseProgress, setExerciseProgress] = useState({
    current: 0,
    total: 0,
    answers: {}
  });

  // Cargar niveles de un tema específico
  const loadLevels = async (classroomId, courseId, topicNumber) => {
    try {
      // Limpiar estado previo ANTES de cargar
      setLevels([]);
      setIsLoading(true);
      setError(null);
      console.log('Cargando niveles para:', { classroomId, courseId, topicNumber });
      
      const data = await studentGetLevels(classroomId, courseId, topicNumber);
      console.log('Niveles cargados:', data);
      
      // Solo actualizar si la petición fue exitosa
      if (data && Array.isArray(data)) {
        setLevels(data);
        return { success: true, data };
      } else {
        setLevels([]);
        return { success: false, error: 'No se encontraron niveles' };
      }
    } catch (err) {
      console.error('Error cargando niveles:', err);
      const errorMessage = err.response?.data?.message || 'Error al cargar los niveles';
      setError(errorMessage);
      setLevels([]);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  // Cargar ejercicios de un nivel específico
  const loadExercises = async (classroomId, courseId, topicNumber, levelNumber) => {
    try {
      // Limpiar estado previo ANTES de cargar
      setExercises([]);
      setCurrentExercise(null);
      setIsLoading(true);
      setError(null);
      console.log('Cargando ejercicios para:', { classroomId, courseId, topicNumber, levelNumber });
      
      const data = await studentGetExercises(classroomId, courseId, topicNumber, levelNumber);
      console.log('Ejercicios cargados:', data);
      
      // Solo actualizar si la petición fue exitosa
      if (data && Array.isArray(data) && data.length > 0) {
        setExercises(data);
        setExerciseProgress({
          current: 0,
          total: data.length,
          answers: {}
        });
        setCurrentExercise(data[0]);
        return { success: true, data };
      } else {
        setExercises([]);
        setCurrentExercise(null);
        return { success: false, error: 'No se encontraron ejercicios' };
      }
    } catch (err) {
      console.error('Error cargando ejercicios:', err);
      const errorMessage = err.response?.data?.message || 'Error al cargar los ejercicios';
      setError(errorMessage);
      setExercises([]);
      setCurrentExercise(null);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  // Marcar una opción para un ejercicio
  const markAnswer = async (classroomId, courseId, topicNumber, levelNumber, exerciseNumber, markedOption) => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('Marcando respuesta:', { 
        classroomId, 
        courseId, 
        topicNumber, 
        levelNumber, 
        exerciseNumber, 
        markedOption 
      });
      
      const result = await studentMarkOption(
        classroomId, 
        courseId, 
        topicNumber, 
        levelNumber, 
        exerciseNumber, 
        markedOption
      );
      
      console.log('Respuesta marcada:', result);
      
      // Actualizar el progreso local
      setExerciseProgress(prev => ({
        ...prev,
        answers: {
          ...prev.answers,
          [exerciseNumber]: {
            markedOption,
            isCorrect: result.data?.isCorrect,
            timestamp: new Date().toISOString()
          }
        }
      }));
      
      return { 
        success: true, 
        data: result.data,
        status: result.status 
      };
    } catch (err) {
      console.error('Error marcando respuesta:', err);
      const errorMessage = err.response?.data?.message || 'Error al marcar la respuesta';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  // Navegar al siguiente ejercicio
  const nextExercise = () => {
    if (exerciseProgress.current < exercises.length - 1) {
      const nextIndex = exerciseProgress.current + 1;
      setExerciseProgress(prev => ({ ...prev, current: nextIndex }));
      setCurrentExercise(exercises[nextIndex]);
      return true;
    }
    return false;
  };

  // Navegar al ejercicio anterior
  const previousExercise = () => {
    if (exerciseProgress.current > 0) {
      const prevIndex = exerciseProgress.current - 1;
      setExerciseProgress(prev => ({ ...prev, current: prevIndex }));
      setCurrentExercise(exercises[prevIndex]);
      return true;
    }
    return false;
  };

  // Ir a un ejercicio específico
  const goToExercise = (exerciseIndex) => {
    if (exerciseIndex >= 0 && exerciseIndex < exercises.length) {
      setExerciseProgress(prev => ({ ...prev, current: exerciseIndex }));
      setCurrentExercise(exercises[exerciseIndex]);
      return true;
    }
    return false;
  };

  // Resetear estado
  const resetExercises = () => {
    setExercises([]);
    setCurrentExercise(null);
    setExerciseProgress({ current: 0, total: 0, answers: {} });
    setError(null);
  };

  const resetLevels = () => {
    setLevels([]);
    setSelectedLevel(null);
    resetExercises();
  };

  return {
    // Estados
    levels,
    exercises,
    currentExercise,
    selectedLevel,
    exerciseProgress,
    isLoading,
    error,
    
    // Acciones
    loadLevels,
    loadExercises,
    markAnswer,
    setSelectedLevel,
    
    // Navegación
    nextExercise,
    previousExercise,
    goToExercise,
    
    // Utilidades
    resetExercises,
    resetLevels,
    clearError: () => setError(null),
    
    // Getters útiles
    isFirstExercise: exerciseProgress.current === 0,
    isLastExercise: exerciseProgress.current === exerciseProgress.total - 1,
    completedExercises: Object.keys(exerciseProgress.answers).length,
    progressPercentage: exerciseProgress.total > 0 
      ? Math.round((Object.keys(exerciseProgress.answers).length / exerciseProgress.total) * 100)
      : 0
  };
};