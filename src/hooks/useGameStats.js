// src/hooks/useGameStats.js
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

export const useGameStats = () => {
  const { isAuthenticated } = useAuth();
  
  // Estadísticas base para un usuario nuevo
  const [stats, setStats] = useState({
    level: 1,
    experience: {
      current: 0,
      total: 100
    },
    exercisesCompleted: 0,
    exercisesTotal: 0,
    correctAnswers: 0,
    totalAnswers: 0,
    classroomsJoined: 0,
    topicsUnlocked: 0,
    levelsCompleted: 0,
    achievements: [],
    streakDays: 0,
    totalStudyTime: 0 // en minutos
  });

  // Cargar estadísticas desde localStorage o API
  useEffect(() => {
    if (isAuthenticated) {
      const savedStats = localStorage.getItem('gameStats');
      if (savedStats) {
        try {
          const parsedStats = JSON.parse(savedStats);
          setStats(prev => ({ ...prev, ...parsedStats }));
        } catch (error) {
          console.error('Error cargando estadísticas guardadas:', error);
        }
      }
    } else {
      // Reset stats when not authenticated
      setStats({
        level: 1,
        experience: { current: 0, total: 100 },
        exercisesCompleted: 0,
        exercisesTotal: 0,
        correctAnswers: 0,
        totalAnswers: 0,
        classroomsJoined: 0,
        topicsUnlocked: 0,
        levelsCompleted: 0,
        achievements: [],
        streakDays: 0,
        totalStudyTime: 0
      });
    }
  }, [isAuthenticated]);

  // Guardar estadísticas en localStorage
  const saveStats = (newStats) => {
    localStorage.setItem('gameStats', JSON.stringify(newStats));
    setStats(newStats);
  };

  // Ganar experiencia
  const gainExperience = (amount) => {
    setStats(prevStats => {
      let newStats = { ...prevStats };
      newStats.experience.current += amount;

      // Verificar si subió de nivel
      while (newStats.experience.current >= newStats.experience.total) {
        newStats.experience.current -= newStats.experience.total;
        newStats.level += 1;
        newStats.experience.total = Math.floor(newStats.experience.total * 1.2); // Incrementar XP necesaria
      }

      saveStats(newStats);
      return newStats;
    });
  };

  // Completar ejercicio
  const completeExercise = (isCorrect = true) => {
    setStats(prevStats => {
      const newStats = { 
        ...prevStats,
        exercisesCompleted: prevStats.exercisesCompleted + 1,
        totalAnswers: prevStats.totalAnswers + 1,
        correctAnswers: isCorrect ? prevStats.correctAnswers + 1 : prevStats.correctAnswers
      };

      // Ganar XP por completar ejercicio
      const xpGained = isCorrect ? 15 : 5; // Más XP por respuesta correcta
      newStats.experience.current += xpGained;

      // Verificar subida de nivel
      while (newStats.experience.current >= newStats.experience.total) {
        newStats.experience.current -= newStats.experience.total;
        newStats.level += 1;
        newStats.experience.total = Math.floor(newStats.experience.total * 1.2);
      }

      saveStats(newStats);
      return newStats;
    });
  };

  // Unirse a aula
  const joinClassroom = () => {
    setStats(prevStats => {
      const newStats = { 
        ...prevStats,
        classroomsJoined: prevStats.classroomsJoined + 1
      };

      // XP por unirse a primera aula
      if (newStats.classroomsJoined === 1) {
        newStats.experience.current += 50;
        
        // Verificar subida de nivel
        while (newStats.experience.current >= newStats.experience.total) {
          newStats.experience.current -= newStats.experience.total;
          newStats.level += 1;
          newStats.experience.total = Math.floor(newStats.experience.total * 1.2);
        }
      }

      saveStats(newStats);
      return newStats;
    });
  };

  // Desbloquear tema
  const unlockTopic = () => {
    setStats(prevStats => {
      const newStats = { 
        ...prevStats,
        topicsUnlocked: prevStats.topicsUnlocked + 1
      };

      // XP por desbloquear temas
      newStats.experience.current += 25;
      
      // Verificar subida de nivel
      while (newStats.experience.current >= newStats.experience.total) {
        newStats.experience.current -= newStats.experience.total;
        newStats.level += 1;
        newStats.experience.total = Math.floor(newStats.experience.total * 1.2);
      }

      saveStats(newStats);
      return newStats;
    });
  };

  // Completar nivel
  const completeLevel = () => {
    setStats(prevStats => {
      const newStats = { 
        ...prevStats,
        levelsCompleted: prevStats.levelsCompleted + 1
      };

      // XP por completar nivel completo
      newStats.experience.current += 100;
      
      // Verificar subida de nivel
      while (newStats.experience.current >= newStats.experience.total) {
        newStats.experience.current -= newStats.experience.total;
        newStats.level += 1;
        newStats.experience.total = Math.floor(newStats.experience.total * 1.2);
      }

      saveStats(newStats);
      return newStats;
    });
  };

  // Resetear estadísticas (para testing o nuevo usuario)
  const resetStats = () => {
    const freshStats = {
      level: 1,
      experience: { current: 0, total: 100 },
      exercisesCompleted: 0,
      exercisesTotal: 0,
      correctAnswers: 0,
      totalAnswers: 0,
      classroomsJoined: 0,
      topicsUnlocked: 0,
      levelsCompleted: 0,
      achievements: [],
      streakDays: 0,
      totalStudyTime: 0
    };
    saveStats(freshStats);
  };

  // Calcular estadísticas derivadas
  const accuracy = stats.totalAnswers > 0 ? Math.round((stats.correctAnswers / stats.totalAnswers) * 100) : 0;
  const progressPercentage = Math.round((stats.experience.current / stats.experience.total) * 100);

  return {
    // Estados
    stats,
    accuracy,
    progressPercentage,
    
    // Acciones
    gainExperience,
    completeExercise,
    joinClassroom,
    unlockTopic,
    completeLevel,
    resetStats,
    
    // Getters útiles
    isNewUser: stats.exercisesCompleted === 0 && stats.classroomsJoined === 0,
    hasCompletedFirstExercise: stats.exercisesCompleted > 0,
    hasJoinedFirstClassroom: stats.classroomsJoined > 0
  };
};