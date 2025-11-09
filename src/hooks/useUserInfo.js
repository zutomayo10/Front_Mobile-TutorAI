// src/hooks/useUserInfo.js
import { useState, useEffect } from 'react';
import { getUserInfo } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

export const useUserInfo = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();

  const loadUserInfo = async () => {
    if (!isAuthenticated) {
      setUserInfo(null);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      console.log('Cargando información del usuario...');
      
      const data = await getUserInfo();
      console.log('Información del usuario cargada:', data);
      
      setUserInfo(data);
      return { success: true, data };
    } catch (err) {
      console.error('Error cargando información del usuario:', err);
      const errorMessage = err.response?.data?.message || 'Error al cargar la información del usuario';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  // Cargar información automáticamente cuando el usuario esté autenticado
  useEffect(() => {
    if (isAuthenticated) {
      loadUserInfo();
    } else {
      setUserInfo(null);
      setError(null);
    }
  }, [isAuthenticated]);

  // Función para refrescar la información manualmente
  const refreshUserInfo = () => {
    return loadUserInfo();
  };

  // Función para limpiar la información
  const clearUserInfo = () => {
    setUserInfo(null);
    setError(null);
  };

  // Getters útiles
  const fullName = userInfo ? `${userInfo.name} ${userInfo.lastNames}` : null;
  const firstName = userInfo?.name || null;
  const lastName = userInfo?.lastNames || null;
  const age = userInfo?.age || null;

  return {
    // Estados
    userInfo,
    isLoading,
    error,
    
    // Acciones
    refreshUserInfo,
    clearUserInfo,
    
    // Getters útiles
    fullName,
    firstName,
    lastName,
    age,
    
    // Utilidades
    clearError: () => setError(null)
  };
};