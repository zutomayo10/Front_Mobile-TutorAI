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

  const getStorageKey = () => {
    if (userInfo?.id) {
      return `levelStars_${userInfo.id}`;
    } else if (userInfo?.name && userInfo?.lastNames) {
      const uniqueId = `${userInfo.name}_${userInfo.lastNames}`.replace(/\s+/g, '_');
      return `levelStars_${uniqueId}`;
    }
    return 'levelStars_default';
  };

  const getTotalStars = () => {
    try {
      const storageKey = getStorageKey();
      console.log('🔑 [useUserStats] Storage key para estrellas:', storageKey);
      
      const savedStars = localStorage.getItem(storageKey);
      console.log('📦 [useUserStats] Estrellas guardadas:', savedStars);
      
      if (!savedStars || savedStars === 'null' || savedStars === 'undefined') {
        console.log('📊 Usuario nuevo: Sin estrellas guardadas');
        return 0;
      }
      
      const starsData = JSON.parse(savedStars);
      if (!starsData || typeof starsData !== 'object' || Object.keys(starsData).length === 0) {
        console.log('📊 Usuario nuevo: Objeto de estrellas vacío');
        return 0;
      }
      
      const total = Object.values(starsData).reduce((sum, stars) => sum + (typeof stars === 'number' && stars > 0 ? stars : 0), 0);
      console.log('📊 Total de estrellas calculadas:', total, 'de', starsData);
      return total;
    } catch (error) {
      console.error('Error contando estrellas:', error);
      return 0;
    }
  };

  const getCompletedLevels = async () => {
    try {
      const classrooms = await studentGetClassrooms();
      
      if (!classrooms || classrooms.length === 0) {
        console.log('📚 Usuario sin aulas asignadas');
        return { totalLevels: 0, completedLevels: 0, totalClassrooms: 0 };
      }
      
      let totalLevels = 0;
      let completedLevels = 0;
      
      for (const classroom of classrooms) {
        if (classroom.courses && classroom.courses.length > 0) {
          for (const course of classroom.courses) {
            if (course.topics && course.topics.length > 0) {
              for (const topic of course.topics) {
                try {
                  const levels = await studentGetLevels(topic.topicId);
                  totalLevels += levels.length;
                  
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
      if (error.response?.status === 403) {
        console.log('📚 Usuario sin aulas asignadas (403)');
        return { totalLevels: 0, completedLevels: 0, totalClassrooms: 0 };
      }
      console.error('Error obteniendo niveles completados:', error);
      return { totalLevels: 0, completedLevels: 0, totalClassrooms: 0 };
    }
  };

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
        const legacyStars = localStorage.getItem('level-stars');
        if (legacyStars) {
          console.log('🔄 Migrando estrellas de clave legacy a clave por usuario');
          const storageKey = getStorageKey();
          if (storageKey && storageKey !== 'levelStars_default') {
            try {
              const parsed = JSON.parse(legacyStars);
              if (parsed && typeof parsed === 'object') {
                localStorage.setItem(storageKey, legacyStars);
                console.log('✅ Estrellas migradas a:', storageKey);
              }
            } catch (e) {
              console.warn('⚠️ No se pudo migrar estrellas legacy');
            }
          }
          localStorage.removeItem('level-stars');
        }

        const storageKey = getStorageKey();
        try {
          const savedStars = localStorage.getItem(storageKey);
          if (savedStars && savedStars !== 'null' && savedStars !== 'undefined') {
            const parsed = JSON.parse(savedStars);
            if (!parsed || typeof parsed !== 'object') {
              console.warn('⚠️ Limpiando localStorage de estrellas corrupto');
              localStorage.removeItem(storageKey);
            }
          }
        } catch (cleanupError) {
          console.warn('⚠️ Error limpiando localStorage, removiendo datos corruptos');
          localStorage.removeItem(storageKey);
        }

        const { totalLevels, completedLevels, totalClassrooms } = await getCompletedLevels();
        
        const totalStars = getTotalStars();

        setStats({
          totalLevels,
          completedLevels,
          totalStars: totalStars || 0,
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

  const progressPercentage = stats.totalLevels > 0 
    ? Math.round((stats.completedLevels / stats.totalLevels) * 100)
    : 0;

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
