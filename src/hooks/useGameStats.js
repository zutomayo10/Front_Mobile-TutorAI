// src/hooks/useGameStats.js
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

export const useGameStats = () => {
  const { isAuthenticated, userInfo } = useAuth();
  

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
    totalStudyTime: 0
  });

  const getStorageKey = () => {
    if (userInfo?.id) {
      return `gameStats_${userInfo.id}`;
    } else if (userInfo?.name && userInfo?.lastNames) {
      const uniqueId = `${userInfo.name}_${userInfo.lastNames}`.replace(/\s+/g, '_');
      return `gameStats_${uniqueId}`;
    }
    return 'gameStats_default';
  };

  useEffect(() => {
    if (isAuthenticated && userInfo) {
      const storageKey = getStorageKey();
      console.log('🔑 [useGameStats] Storage key:', storageKey);
      
      if (storageKey) {
        const savedStats = localStorage.getItem(storageKey);
        console.log('📦 [useGameStats] Stats guardados:', savedStats);
        
        if (savedStats) {
          try {
            const parsedStats = JSON.parse(savedStats);
            console.log('✅ [useGameStats] Stats cargados:', parsedStats);
            
            const validatedStats = {
              ...parsedStats,
              experience: {
                current: parsedStats.experience?.current || 0,
                total: parsedStats.experience?.total || 100
              }
            };
            
            console.log('🔍 [useGameStats] Stats validados:', validatedStats);
            setStats(prev => ({ ...prev, ...validatedStats }));
          } catch (error) {
            console.error('Error cargando estadísticas guardadas:', error);
          }
        } else {
          console.log('⚠️ [useGameStats] No hay stats guardados, usando valores iniciales');
        }
      }
    } else {
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
  }, [isAuthenticated, userInfo]);

  const resetStats = () => {
    const initialStats = {
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
    setStats(initialStats);
    const storageKey = getStorageKey();
    if (storageKey) {
      localStorage.removeItem(storageKey);
    }
  };

  const saveStats = (newStats) => {
    const storageKey = getStorageKey();
    if (storageKey) {
      localStorage.setItem(storageKey, JSON.stringify(newStats));
    }
    setStats(newStats);
  };

  const gainExperience = (amount) => {
    setStats(prevStats => {
      let newStats = { ...prevStats };
      newStats.experience.current += amount;

      while (newStats.experience.current >= newStats.experience.total) {
        newStats.experience.current -= newStats.experience.total;
        newStats.level += 1;
        newStats.experience.total = Math.floor(newStats.experience.total * 1.2); // Incrementar XP necesaria en 20%
      }

      saveStats(newStats);
      return newStats;
    });
  };

  const completeExercise = (isCorrect = true) => {
    setStats(prevStats => {
      const newStats = { 
        ...prevStats,
        exercisesCompleted: prevStats.exercisesCompleted + 1,
        totalAnswers: prevStats.totalAnswers + 1,
        correctAnswers: isCorrect ? prevStats.correctAnswers + 1 : prevStats.correctAnswers
      };

      const xpGained = isCorrect ? 15 : 5;
      newStats.experience.current += xpGained;

      while (newStats.experience.current >= newStats.experience.total) {
        newStats.experience.current -= newStats.experience.total;
        newStats.level += 1;
        newStats.experience.total = Math.floor(newStats.experience.total * 1.2); // Incrementar XP necesaria en 20%
      }

      saveStats(newStats);
      return newStats;
    });
  };

  const joinClassroom = () => {
    setStats(prevStats => {
      const newStats = { 
        ...prevStats,
        classroomsJoined: prevStats.classroomsJoined + 1
      };

      if (newStats.classroomsJoined === 1) {
        newStats.experience.current += 50;
        
        while (newStats.experience.current >= newStats.experience.total) {
          newStats.experience.current -= newStats.experience.total;
          newStats.level += 1;
          newStats.experience.total = Math.floor(newStats.experience.total * 1.2); // Incrementar XP necesaria en 20%
        }
      }

      saveStats(newStats);
      return newStats;
    });
  };

  const unlockTopic = () => {
    setStats(prevStats => {
      const newStats = { 
        ...prevStats,
        topicsUnlocked: prevStats.topicsUnlocked + 1
      };

      newStats.experience.current += 25;
      
      while (newStats.experience.current >= newStats.experience.total) {
        newStats.experience.current -= newStats.experience.total;
        newStats.level += 1;
        newStats.experience.total = Math.floor(newStats.experience.total * 1.2); // Incrementar XP necesaria en 20%
      }

      saveStats(newStats);
      return newStats;
    });
  };

  const completeLevel = (medalType = null, correctFirstAttempts = 0, totalQuestions = 0) => {
    console.log('🔴 [useGameStats] Iniciando completeLevel');
    console.log('📋 [useGameStats] Parámetros:', { medalType, correctFirstAttempts, totalQuestions });
    console.log('💾 [useGameStats] Stats actuales ANTES:', stats);
    
    setStats(prevStats => {
      const newStats = { 
        ...prevStats,
        levelsCompleted: prevStats.levelsCompleted + 1
      };

      let xpGained = 50;
      
      if (medalType === 'oro') {
        xpGained = 150;
      } else if (medalType === 'plata') {
        xpGained = 100;
      } else if (medalType === 'bronce') {
        xpGained = 75;
      }
      
      const bonusXP = correctFirstAttempts * 15;
      xpGained += bonusXP;
      
      console.log(`🎮 [useGameStats] XP ganada: ${xpGained} (Base medalla: ${xpGained - bonusXP}, Bonus: ${bonusXP})`);
      
      newStats.experience.current += xpGained;
      console.log(`📈 [useGameStats] XP nueva: ${newStats.experience.current}/${newStats.experience.total}`);
      
      let leveledUp = false;
      while (newStats.experience.current >= newStats.experience.total) {
        newStats.experience.current -= newStats.experience.total;
        newStats.level += 1;
        newStats.experience.total = Math.floor(newStats.experience.total * 1.2); // Incrementar XP necesaria en 20%
        leveledUp = true;
        console.log(`🎉 [useGameStats] ¡Subiste al nivel ${newStats.level}!`);
      }

      console.log('💾 [useGameStats] Stats DESPUÉS:', newStats);
      console.log('💾 [useGameStats] Guardando en localStorage...');
      saveStats(newStats);
      console.log('✅ [useGameStats] Guardado completo');
      return newStats;
    });
  };

  const accuracy = stats.totalAnswers > 0 ? Math.round((stats.correctAnswers / stats.totalAnswers) * 100) : 0;
  const validExp = stats.experience || { current: 0, total: 100 };
  const progressPercentage = validExp.total > 0 ? Math.round((validExp.current / validExp.total) * 100) : 0;

  useEffect(() => {
    console.log('🔄 [useGameStats] Stats actualizados en hook:', {
      level: stats.level,
      exp: stats.experience,
      progressPercentage
    });
  }, [stats, progressPercentage]);

  return {
    stats,
    accuracy,
    progressPercentage,
    
    gainExperience,
    completeExercise,
    joinClassroom,
    unlockTopic,
    completeLevel,
    resetStats,
    
    isNewUser: stats.exercisesCompleted === 0 && stats.classroomsJoined === 0,
    hasCompletedFirstExercise: stats.exercisesCompleted > 0,
    hasJoinedFirstClassroom: stats.classroomsJoined > 0
  };
};