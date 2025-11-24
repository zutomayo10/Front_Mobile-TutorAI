// src/hooks/useUserStats.js
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { studentGetClassrooms, studentGetLevels, studentCheckLevelPassed } from '../services/api';

export const useUserStats = () => {
  const { isAuthenticated, userInfo } = useAuth();
  const [stats, setStats] = useState({
    totalLevels: 0,
    completedLevels: 0,
    totalStars: 0,
    totalClassrooms: 0,
    isLoading: true
  });

  // Función para contar estrellas totales desde localStorage
  const getTotalStars = () => {
    try {
      const savedStars = localStorage.getItem('level-stars');
      if (savedStars) {
        const starsData = JSON.parse(savedStars);
        return Object.values(starsData).reduce((sum, stars) => sum + stars, 0);
      }
    } catch (error) {
      console.error('Error contando estrellas:', error);
    }
    return 0;
  };

  // Función para obtener niveles completados desde backend
  const getCompletedLevels = async () => {
    try {
      const classrooms = await studentGetClassrooms();
      let totalLevels = 0;
      let completedLevels = 0;
      
      // Iterar por cada classroom para obtener sus niveles
      for (const classroom of classrooms) {
        if (classroom.courses && classroom.courses.length > 0) {
          for (const course of classroom.courses) {
            if (course.topics && course.topics.length > 0) {
              for (const topic of course.topics) {
                try {
                  const levels = await studentGetLevels(topic.topicId);
                  totalLevels += levels.length;
                  
                  // Verificar cuántos niveles están completados
                  for (const level of levels) {
                    const hasPassed = await studentCheckLevelPassed(level.levelId);
                    if (hasPassed) {
                      completedLevels++;
                    }
                  }
                } catch (err) {
                  console.warn(`Error obteniendo niveles para topic ${topic.topicId}:`, err);
                }
              }
            }
          }
        }
      }
      
      return { totalLevels, completedLevels, totalClassrooms: classrooms.length };
    } catch (error) {
      console.error('Error obteniendo niveles completados:', error);
      return { totalLevels: 0, completedLevels: 0, totalClassrooms: 0 };
    }
  };

  // Cargar estadísticas al montar el componente
  useEffect(() => {
    const loadStats = async () => {
      if (!isAuthenticated || !userInfo) {
        setStats({
          totalLevels: 0,
          completedLevels: 0,
          totalStars: 0,
          totalClassrooms: 0,
          isLoading: false
        });
        return;
      }

      setStats(prev => ({ ...prev, isLoading: true }));

      try {
        // Obtener datos del backend
        const { totalLevels, completedLevels, totalClassrooms } = await getCompletedLevels();
        
        // Obtener estrellas de localStorage
        const totalStars = getTotalStars();

        setStats({
          totalLevels,
          completedLevels,
          totalStars,
          totalClassrooms,
          isLoading: false
        });
      } catch (error) {
        console.error('Error cargando estadísticas del usuario:', error);
        setStats(prev => ({ ...prev, isLoading: false }));
      }
    };

    loadStats();
  }, [isAuthenticated, userInfo]);

  // Función para recargar estadísticas manualmente
  const refreshStats = async () => {
    setStats(prev => ({ ...prev, isLoading: true }));
    
    try {
      const { totalLevels, completedLevels, totalClassrooms } = await getCompletedLevels();
      const totalStars = getTotalStars();

      setStats({
        totalLevels,
        completedLevels,
        totalStars,
        totalClassrooms,
        isLoading: false
      });
    } catch (error) {
      console.error('Error recargando estadísticas:', error);
      setStats(prev => ({ ...prev, isLoading: false }));
    }
  };

  // Calcular porcentaje de progreso
  const progressPercentage = stats.totalLevels > 0 
    ? Math.round((stats.completedLevels / stats.totalLevels) * 100)
    : 0;

  // Calcular promedio de estrellas por nivel completado
  const averageStars = stats.completedLevels > 0
    ? (stats.totalStars / stats.completedLevels).toFixed(1)
    : 'N/A';

  return {
    stats,
    progressPercentage,
    averageStars,
    refreshStats
  };
};
