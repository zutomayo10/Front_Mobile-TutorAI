// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  getToken, 
  getRoleBasedOnToken, 
  logout as apiLogout,
  loginStudent,
  registerStudent,
  getUserInfo
} from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Cargar información del usuario autenticado
  const loadUserInfo = async () => {
    try {
      const info = await getUserInfo();
      setUserInfo(info);
      return info;
    } catch (error) {
      console.error('Error cargando información del usuario:', error);
      return null;
    }
  };

  // Verificar si hay un token válido al cargar la aplicación
  useEffect(() => {
    const token = getToken();
    if (token) {
      try {
        const role = getRoleBasedOnToken();
        if (role) {
          setUser({ role });
          setIsAuthenticated(true);
          // Cargar información del usuario
          loadUserInfo();
        }
      } catch (error) {
        console.error('Error al verificar token:', error);
        apiLogout();
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      setIsLoading(true);
      
      console.log('Intentando login con:', credentials);
      
      // Para estudiantes (usando name, lastNames, passwordNumber)
      const response = await loginStudent({
        name: credentials.name,
        lastNames: credentials.lastNames,
        passwordNumber: credentials.passwordNumber
      });
      
      console.log('Respuesta del login:', response);
      
      if (response) {
        setUser({ role: response });
        setIsAuthenticated(true);
        // Cargar información del usuario después del login exitoso
        await loadUserInfo();
        return { success: true, role: response };
      }
      
      throw new Error('Respuesta inválida del servidor');
    } catch (error) {
      console.error('Error completo en login:', error);
      console.error('Status:', error.response?.status);
      console.error('Data:', error.response?.data);
      
      let errorMessage = 'Error en el login';
      
      if (error.response?.status === 403) {
        errorMessage = 'Credenciales incorrectas. Verifica tu nombre, apellidos y número de contraseña.';
      } else if (error.response?.status === 404) {
        errorMessage = 'Usuario no encontrado. ¿Necesitas registrarte primero?';
      } else if (error.response?.status === 500) {
        errorMessage = 'Error del servidor. Intenta de nuevo más tarde.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      return { 
        success: false, 
        error: errorMessage,
        statusCode: error.response?.status
      };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setIsLoading(true);
      
      console.log('Intentando registro con:', userData);
      
      // Para estudiantes
      const response = await registerStudent({
        name: userData.name,
        lastNames: userData.lastNames,
        age: userData.age,
        passwordNumber: userData.passwordNumber
      });
      
      console.log('Respuesta del registro:', response);
      
      if (response) {
        const role = getRoleBasedOnToken();
        setUser({ role });
        setIsAuthenticated(true);
        // Cargar información del usuario después del registro exitoso
        await loadUserInfo();
        return { success: true, data: response };
      }
      
      throw new Error('Respuesta inválida del servidor');
    } catch (error) {
      console.error('Error completo en registro:', error);
      console.error('Status:', error.response?.status);
      console.error('Data:', error.response?.data);
      
      let errorMessage = 'Error en el registro';
      
      if (error.response?.status === 400) {
        errorMessage = 'Datos inválidos. Verifica que todos los campos estén correctos.';
      } else if (error.response?.status === 409) {
        errorMessage = 'Ya existe un usuario con estos datos.';
      } else if (error.response?.status === 500) {
        errorMessage = 'Error del servidor. Intenta de nuevo más tarde.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      return { 
        success: false, 
        error: errorMessage,
        statusCode: error.response?.status
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    apiLogout();
    setUser(null);
    setUserInfo(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    userInfo,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    loadUserInfo
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
