// src/hooks/useExercises.js
import { useState, useEffect } from 'react';
import { studentGetLevels, studentGetExercises, studentMarkOption, studentCheckLevelPassed, studentPlayLevel, studentGetLevelRunAttempts, studentGetLevelRunResult, studentRepeatLevel, studentGetLevelRunSolutions } from '../services/api';

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
  const [levelRunInfo, setLevelRunInfo] = useState(null);
  const [attemptHistory, setAttemptHistory] = useState([]);

  const loadLevels = async (classroomId, courseId, topicId) => {
    try {
      setLevels([]);
      setIsLoading(true);
      setError(null);
      console.log('Cargando niveles para topicId:', topicId);
      
      const data = await studentGetLevels(topicId);
      console.log('Niveles cargados:', data);
      
      if (data && Array.isArray(data)) {
        const levelsWithProgress = await Promise.all(
          data.map(async (level) => {
            try {
              const levelId = level.levelId || level.id || level.levelNumber;
              const hasPassed = await studentCheckLevelPassed(levelId);
              
              console.log(`🔍 Nivel ${level.levelNumber} (ID: ${levelId}):`, {
                name: level.name,
                hasPassed,
                levelId
              });
              
              return {
                ...level,
                hasPassed,
                isAccessible: false
              };
            } catch (err) {
              console.error(`Error verificando nivel ${level.levelNumber}:`, err);
              return {
                ...level,
                hasPassed: false,
                isAccessible: false
              };
            }
          })
        );
        
        let foundFirstNotPassed = false;
        const accessibleLevels = levelsWithProgress.map((level, index) => {
          if (level.hasPassed) {
            return { ...level, isAccessible: true };
          } else if (!foundFirstNotPassed) {
            foundFirstNotPassed = true;
            return { ...level, isAccessible: true };
          } else {
            return { ...level, isAccessible: false };
          }
        });
        
        console.log('Niveles con progreso:', accessibleLevels);
        setLevels(accessibleLevels);
        return { success: true, data: accessibleLevels };
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

  const loadExercises = async (classroomId, courseId, topicId, levelId) => {
    try {
      setExercises([]);
      setCurrentExercise(null);
      setLevelRunInfo(null);
      setAttemptHistory([]);
      setIsLoading(true);
      setError(null);
      console.log('Cargando ejercicios para levelId:', levelId);
      
      let playInfo = await studentPlayLevel(levelId);
      console.log('Información del level run:', playInfo);
      console.log('🔍 Validación: levelId =', levelId, ', levelRunId =', playInfo.levelRunId);
      console.log('📊 Estado del run:', playInfo.status);
      
      if (playInfo.status === 'PASSED' || playInfo.status === 'FAILED') {
        console.warn('⚠️ Este nivel ya tiene un intento completado con status:', playInfo.status);
        console.log('🔄 Intentando crear un nuevo LevelRun...');
        
        try {
          await studentRepeatLevel(levelId);
          console.log('✅ Nuevo LevelRun creado exitosamente');
          
          playInfo = await studentPlayLevel(levelId);
          console.log('🆕 Nuevo run cargado:', playInfo);
          console.log('📊 Nuevo estado del run:', playInfo.status);
          
          if (playInfo.status !== 'IN_PROGRESS') {
            console.error('❌ El nuevo run no tiene status IN_PROGRESS:', playInfo.status);
            throw new Error('El nuevo run no está en progreso');
          }
        } catch (repeatErr) {
          console.error('❌ Error al crear nuevo LevelRun:', repeatErr);
          console.error('Código de error:', repeatErr.response?.status);
          console.error('Mensaje:', repeatErr.response?.data);
          
          if (repeatErr.response?.status === 403) {
            console.warn('⚠️ No tienes permiso para repetir este nivel automáticamente');
            console.warn('💡 Usa el botón "Repetir Nivel" al finalizar si quieres intentarlo de nuevo');
          } else {
            throw new Error('No se pudo preparar el nivel para jugar: ' + (repeatErr.response?.data?.message || repeatErr.message));
          }
        }
      }
      
      setLevelRunInfo(playInfo);
      
      let loadedAttempts = [];
      if (playInfo.levelRunId) {
        try {
          const attempts = await studentGetLevelRunAttempts(playInfo.levelRunId);
          console.log('Historial de intentos cargado:', attempts);
          setAttemptHistory(attempts);
          loadedAttempts = attempts;
        } catch (attemptsErr) {
          console.warn('Error cargando historial de intentos:', attemptsErr);
        }
      }
      
      const data = await studentGetExercises(levelId);
      console.log('Ejercicios cargados:', data);
      console.log('🔍 IDs de ejercicios:', data?.map(ex => ({ id: ex.exerciseId, num: ex.exerciseNumber })));
      
      if (data && Array.isArray(data) && data.length > 0) {
        setExercises(data);
        setExerciseProgress({
          current: 0,
          total: data.length,
          answers: {}
        });
        setCurrentExercise(data[0]);
        return { success: true, data, levelRunInfo: playInfo, attemptHistory: loadedAttempts };
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
      setLevelRunInfo(null);
      setAttemptHistory([]);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const markAnswer = async (levelRunId, exerciseId, markedOption) => {
    try {
      setError(null);
      console.log('Marcando respuesta:', { 
        levelRunId,
        exerciseId, 
        markedOption 
      });
      
      const result = await studentMarkOption(
        levelRunId,
        exerciseId, 
        markedOption
      );
      
      console.log('Respuesta marcada exitosamente:', result);
      console.log('Status recibido:', result.status);
      console.log('Data recibida:', result.data);
      
      const exercise = exercises.find(ex => ex.exerciseId === exerciseId);
      const exerciseNumber = exercise?.exerciseNumber;
      
      if (exerciseNumber) {
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
      }
      
      return { 
        success: true, 
        data: result.data || {},
        status: result.status 
      };
    } catch (err) {
      console.error('Error marcando respuesta:', err);
      console.error('Detalle del error:', err.response);
      const errorMessage = err.response?.data?.message || err.message || 'Error al marcar la respuesta';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const reloadAttemptHistory = async () => {
    if (levelRunInfo?.levelRunId) {
      try {
        const attempts = await studentGetLevelRunAttempts(levelRunInfo.levelRunId);
        console.log('Historial de intentos actualizado:', attempts);
        setAttemptHistory(attempts);
        return attempts;
      } catch (err) {
        console.warn('Error recargando historial de intentos:', err);
        return attemptHistory;
      }
    }
    return attemptHistory;
  };

  const getLevelResults = async (levelRunId) => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('Obteniendo resultados del nivel run:', levelRunId);
      
      const result = await studentGetLevelRunResult(levelRunId);
      console.log('Resultados del nivel:', result);
      
      return { 
        success: true, 
        data: result 
      };
    } catch (err) {
      console.error('Error obteniendo resultados del nivel:', err);
      const errorMessage = err.response?.data?.message || 'Error al obtener los resultados del nivel';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const repeatLevel = async (levelId) => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('Repitiendo nivel:', levelId);
      
      const result = await studentRepeatLevel(levelId);
      console.log('Nuevo run para repetir nivel:', result);
      
      setExercises([]);
      setCurrentExercise(null);
      setExerciseProgress({
        current: 0,
        total: 0,
        answers: {}
      });
      setAttemptHistory([]);
      setLevelRunInfo(result);
      
      return { 
        success: true, 
        data: result 
      };
    } catch (err) {
      console.error('Error repitiendo nivel:', err);
      const errorMessage = err.response?.data?.message || 'Error al repetir el nivel';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const nextExercise = () => {
    if (exerciseProgress.current < exercises.length - 1) {
      const nextIndex = exerciseProgress.current + 1;
      setExerciseProgress(prev => ({ ...prev, current: nextIndex }));
      setCurrentExercise(exercises[nextIndex]);
      return true;
    }
    return false;
  };

  const previousExercise = () => {
    if (exerciseProgress.current > 0) {
      const prevIndex = exerciseProgress.current - 1;
      setExerciseProgress(prev => ({ ...prev, current: prevIndex }));
      setCurrentExercise(exercises[prevIndex]);
      return true;
    }
    return false;
  };

  const getLevelSolutions = async (levelRunId) => {
    try {
      console.log('📚 Obteniendo soluciones detalladas para levelRunId:', levelRunId);
      const solutions = await studentGetLevelRunSolutions(levelRunId);
      console.log('✅ Soluciones obtenidas:', solutions);
      return { success: true, data: solutions };
    } catch (err) {
      console.error('❌ Error obteniendo soluciones:', err);
      const errorMessage = err.response?.data?.message || 'Error al cargar las soluciones';
      return { success: false, error: errorMessage };
    }
  };

  const goToExercise = (exerciseIndex) => {
    if (exerciseIndex >= 0 && exerciseIndex < exercises.length) {
      setExerciseProgress(prev => ({ ...prev, current: exerciseIndex }));
      setCurrentExercise(exercises[exerciseIndex]);
      return true;
    }
    return false;
  };

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
    levels,
    exercises,
    currentExercise,
    selectedLevel,
    exerciseProgress,
    levelRunInfo,
    attemptHistory,
    isLoading,
    error,
    
    loadLevels,
    loadExercises,
    markAnswer,
    setSelectedLevel,
    reloadAttemptHistory,
    getLevelResults,
    getLevelSolutions,
    repeatLevel,
    
    nextExercise,
    previousExercise,
    goToExercise,
    
    resetExercises,
    resetLevels,
    clearError: () => setError(null),
    
    isFirstExercise: exerciseProgress.current === 0,
    isLastExercise: exerciseProgress.current === exerciseProgress.total - 1,
    completedExercises: Object.keys(exerciseProgress.answers).length,
    progressPercentage: exerciseProgress.total > 0 
      ? Math.round((Object.keys(exerciseProgress.answers).length / exerciseProgress.total) * 100)
      : 0
  };
};