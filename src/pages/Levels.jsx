import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useDeviceDetection } from '../hooks/useDeviceDetection'
import { useExercises } from '../hooks/useExercises'
import { useAuth } from '../contexts/AuthContext'
import Sidebar from '../components/Sidebar'
import BottomNavigation from '../components/BottomNavigation'

const Levels = () => {
  const { isMobile } = useDeviceDetection()
  const navigate = useNavigate()
  const location = useLocation()
  const { levels, loadLevels, isLoading, error } = useExercises()
  const { userInfo } = useAuth()
  const [showLockedModal, setShowLockedModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [successMessage, setSuccessMessage] = useState(null)
  
  const { classroomId, courseId, topicId, topicName, forceReload, message, quizResults } = location.state || {}

  const getStarsStorageKey = () => {
    if (userInfo?.id) {
      return `levelStars_${userInfo.id}`;
    } else if (userInfo?.name && userInfo?.lastNames) {
      const uniqueId = `${userInfo.name}_${userInfo.lastNames}`.replace(/\s+/g, '_');
      return `levelStars_${uniqueId}`;
    }
    return 'levelStars_default';
  };

  const getLevelStars = (levelId) => {
    try {
      const storageKey = getStarsStorageKey();
      const starsData = localStorage.getItem(storageKey)
      if (starsData) {
        const stars = JSON.parse(starsData)
        return stars[levelId] || 0
      }
      return 0
    } catch (error) {
      console.error('Error al obtener estrellas:', error)
      return 0
    }
  }

  useEffect(() => {
    if (!topicId) {
      navigate('/dashboard')
      return
    }

    loadLevels(classroomId, courseId, topicId)
  }, [topicId, forceReload])

  useEffect(() => {
    if (message && quizResults) {
      setSuccessMessage({ message, quizResults })
      setShowSuccessModal(true)
      localStorage.removeItem('classroomProgress')
      localStorage.removeItem('classroomTotals')
      console.log('🗑️ Cache de progreso y totales invalidado - se recargará en Dashboard')
      window.history.replaceState({}, document.title)
    }
  }, [message, quizResults])

  const handleSelectLevel = (level) => {
    if (!level.isAccessible) {
      setShowLockedModal(true)
      return;
    }
    
    navigate('/exercises', {
      state: {
        classroomId,
        courseId,
        topicId,
        topicName,
        levelId: level.levelId,
        levelNumber: level.levelNumber,
        levelName: level.name
      }
    })
  }

  const handleBack = () => {
    navigate('/topics', {
      state: {
        classroomId,
        classroomName: topicName,
        forceReload: Date.now()
      }
    })
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
          backgroundImage: `url("/images/fondo_playa.jpg")`,
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

            {error && (
              <div className="mb-6 p-4 bg-red-500 text-white rounded-lg">
                {error}
              </div>
            )}

            {levels.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {levels.map((level, index) => {
                  const levelStars = getLevelStars(level.levelId);
                  const isCompleted = level.hasPassed;
                  
                  return (
                    <div
                      key={level.levelNumber}
                      onClick={() => handleSelectLevel(level)}
                      className={`backdrop-blur-sm rounded-xl p-6 transform transition-all duration-200 border ${
                        isCompleted
                          ? 'bg-green-700 bg-opacity-70 border-green-400 border-opacity-40 cursor-pointer hover:scale-105 hover:bg-opacity-80'
                          : level.isAccessible 
                            ? 'bg-white bg-opacity-20 border-white border-opacity-20 cursor-pointer hover:scale-105 hover:bg-opacity-30' 
                            : 'bg-white bg-opacity-10 border-white border-opacity-20 cursor-not-allowed grayscale opacity-60'
                      }`}
                    >
                      <div className="flex items-center space-x-4 mb-4">
                        <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg ${
                          isCompleted
                            ? 'bg-gradient-to-br from-green-400 to-green-600'
                            : level.isAccessible 
                              ? 'bg-gradient-to-br from-yellow-400 to-orange-500'
                              : 'bg-gradient-to-br from-gray-400 to-gray-600'
                        }`}>
                          {isCompleted ? (
                            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            level.levelNumber
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-white font-bold text-lg drop-shadow flex items-center space-x-2">
                            <span>Nivel {level.levelNumber}</span>
                            {!level.isAccessible && (
                              <svg className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </h3>
                          <p className="text-white text-sm opacity-90">
                            {level.name}
                          </p>
                          {isCompleted && (
                            <div className="flex items-center space-x-1 mt-2">
                              {[1, 2, 3].map((star) => (
                                <svg
                                  key={star}
                                  className={`w-6 h-6 transition-all duration-300 ${
                                    star <= levelStars
                                      ? 'text-yellow-300 fill-current drop-shadow-[0_2px_8px_rgba(251,191,36,0.8)]'
                                      : 'text-gray-400 fill-current opacity-30'
                                  }`}
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                                </svg>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="text-white text-sm font-medium opacity-90">
                          {level.isAccessible 
                            ? isCompleted 
                              ? 'Repetir nivel'
                              : 'Clic para iniciar'
                            : 'Nivel bloqueado'
                          }
                        </div>
                        <svg className={`w-6 h-6 text-white ${!level.isAccessible ? 'opacity-50' : 'opacity-90'}`} fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  );
                })}
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
      
      {showLockedModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-gradient-to-br from-red-500 to-red-700 rounded-2xl p-8 shadow-2xl border-4 border-red-300 text-center max-w-md w-full transform transition-all duration-500 scale-100 animate-bounce-in">
            <div className="text-6xl mb-4 animate-shake">
              🔒
            </div>
            <h3 className="text-white text-2xl md:text-3xl font-bold mb-4">
              ¡Nivel Bloqueado!
            </h3>
            <p className="text-white text-lg mb-6 opacity-90">
              Debes completar el nivel anterior para desbloquear este nivel.
            </p>
            <button 
              className="w-full py-4 px-6 rounded-full text-white font-bold text-lg shadow-xl transition-all duration-300 hover:opacity-90 transform hover:scale-105"
              style={{backgroundColor: '#F19506'}}
              onClick={() => setShowLockedModal(false)}
            >
              Entendido
            </button>
          </div>
        </div>
      )}

      {showSuccessModal && successMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-gradient-to-br from-green-500 to-green-700 rounded-2xl p-8 shadow-2xl border-4 border-green-300 text-center max-w-md w-full transform transition-all duration-500 scale-100 animate-bounce-in">
            <div className="text-6xl mb-4">
              🎉
            </div>
            <h3 className="text-white text-2xl md:text-3xl font-bold mb-4">
              ¡Nivel Completado!
            </h3>
            <div className="bg-white bg-opacity-20 rounded-xl p-4 mb-6">
              <p className="text-white text-lg font-semibold mb-2">
                {successMessage.message}
              </p>
              {successMessage.quizResults && (
                <div className="space-y-2 text-white">
                  {successMessage.quizResults.stars > 0 && (
                    <div className="flex justify-center space-x-1">
                      {[1, 2, 3].map((star) => (
                        <svg
                          key={star}
                          className={`w-8 h-8 ${
                            star <= successMessage.quizResults.stars
                              ? 'text-yellow-300 fill-current drop-shadow-lg'
                              : 'text-gray-400 fill-current opacity-30'
                          }`}
                          viewBox="0 0 20 20"
                        >
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                        </svg>
                      ))}
                    </div>
                  )}
                  <p className="text-sm">
                    Respuestas correctas: {successMessage.quizResults.correctAnswers}/{successMessage.quizResults.totalQuestions}
                  </p>
                  <p className="text-sm font-bold text-yellow-300">
                    +{successMessage.quizResults.experienceGained} XP ganada
                  </p>
                </div>
              )}
            </div>
            <button 
              className="w-full py-4 px-6 rounded-full text-white font-bold text-lg shadow-xl transition-all duration-300 hover:opacity-90 transform hover:scale-105"
              style={{backgroundColor: '#F19506'}}
              onClick={() => setShowSuccessModal(false)}
            >
              ¡Genial!
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Levels