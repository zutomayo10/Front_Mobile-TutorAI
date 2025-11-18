// src/pages/Levels.jsx
import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useDeviceDetection } from '../hooks/useDeviceDetection'
import { useExercises } from '../hooks/useExercises'
import Sidebar from '../components/Sidebar'
import BottomNavigation from '../components/BottomNavigation'

const Levels = () => {
  const { isMobile } = useDeviceDetection()
  const navigate = useNavigate()
  const location = useLocation()
  const { levels, loadLevels, isLoading, error } = useExercises()
  
  // Obtener datos del estado de navegación
  const { classroomId, courseId, topicNumber, topicName } = location.state || {}

  useEffect(() => {
    if (!classroomId || !courseId || topicNumber === undefined) {
      navigate('/dashboard')
      return
    }

    loadLevels(classroomId, courseId, topicNumber)
  }, [classroomId, courseId, topicNumber])

  const handleSelectLevel = (level) => {
    if (!level.isAccessible) {
      // Mostrar mensaje de que el nivel está bloqueado
      alert('Este nivel está bloqueado. Debes completar el nivel anterior primero.');
      return;
    }
    
    navigate('/exercises', {
      state: {
        classroomId,
        courseId,
        topicNumber,
        topicName,
        levelNumber: level.levelNumber,
        levelName: level.name
      }
    })
  }

  const handleBack = () => {
    navigate('/dashboard')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-800">
        <div className="text-white text-xl">Cargando niveles...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative" style={{ minHeight: '100dvh' }}>
      <div 
        className="fixed inset-0"
        style={{
          backgroundColor: '#2d5016',
          backgroundImage: `url("/images/bosque.jpeg")`,
          backgroundAttachment: 'fixed',
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      
      <div 
        className="fixed inset-0"
        style={{
          background: `
            linear-gradient(135deg, rgba(45, 80, 22, 0.3) 0%, rgba(74, 124, 35, 0.2) 30%, rgba(61, 107, 26, 0.3) 60%, rgba(45, 80, 22, 0.4) 100%),
            radial-gradient(ellipse at top, rgba(106, 170, 100, 0.2) 0%, transparent 50%),
            radial-gradient(ellipse at bottom, rgba(45, 80, 22, 0.3) 0%, transparent 50%)
          `
        }}
      />
      
      <div className="fixed inset-0 bg-black bg-opacity-20" />

      <div className="relative z-10 flex">
        {!isMobile && <Sidebar />}
        
        <div className={`flex-1 ${isMobile ? 'pb-20' : 'pl-64'}`}>
          <div className="p-4 md:p-6">
            {/* Header */}
            <div className="mb-6">
              <button
                onClick={handleBack}
                className="mb-4 text-white hover:text-yellow-200 transition-colors duration-200 flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                <span>Volver al Dashboard</span>
              </button>
              
              <h1 className="text-white text-3xl font-bold drop-shadow-lg mb-2">
                Niveles de {topicName || 'Tema'}
              </h1>
              <p className="text-white text-lg opacity-90 drop-shadow">
                Selecciona un nivel para comenzar con los ejercicios
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-500 text-white rounded-lg">
                {error}
              </div>
            )}

            {/* Levels Grid */}
            {levels.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {levels.map((level, index) => (
                  <div
                    key={level.levelNumber}
                    onClick={() => handleSelectLevel(level)}
                    className={`bg-white backdrop-blur-sm rounded-xl p-6 transform transition-all duration-200 border border-white border-opacity-20 ${
                      level.isAccessible 
                        ? 'bg-opacity-20 cursor-pointer hover:scale-105 hover:bg-opacity-30' 
                        : 'bg-opacity-10 cursor-not-allowed grayscale opacity-60'
                    }`}
                  >
                    <div className="flex items-center space-x-4 mb-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg ${
                        level.isAccessible 
                          ? level.hasPassed
                            ? 'bg-gradient-to-br from-green-400 to-green-600'  // Verde para completado
                            : 'bg-gradient-to-br from-yellow-400 to-orange-500' // Amarillo para disponible
                          : 'bg-gradient-to-br from-gray-400 to-gray-600'       // Gris para bloqueado
                      }`}>
                        {level.hasPassed ? '✓' : level.levelNumber}
                      </div>
                      <div>
                        <h3 className="text-white font-bold text-lg drop-shadow flex items-center space-x-2">
                          <span>Nivel {level.levelNumber}</span>
                          {!level.isAccessible && (
                            <svg className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </h3>
                        <p className="text-white text-sm opacity-80">
                          {level.name}
                        </p>
                        {level.hasPassed && (
                          <p className="text-green-300 text-xs font-semibold">
                            ✓ Completado
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="text-white text-sm opacity-80">
                        {level.isAccessible 
                          ? level.hasPassed 
                            ? 'Repetir nivel'
                            : 'Clic para iniciar'
                          : 'Nivel bloqueado'
                        }
                      </div>
                      <svg className={`w-6 h-6 text-white ${!level.isAccessible ? 'opacity-50' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-white text-xl mb-4">
                  No hay niveles disponibles para este tema
                </div>
                <p className="text-white text-sm opacity-80">
                  Contacta a tu profesor para que configure los niveles
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {isMobile && <BottomNavigation />}
    </div>
  )
}

export default Levels