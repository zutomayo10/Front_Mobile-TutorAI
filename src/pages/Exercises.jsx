import React, { useState, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDeviceDetection } from '../hooks/useDeviceDetection'
import BottomNavigation from '../components/BottomNavigation'

const Exercises = () => {
  const { isMobile } = useDeviceDetection()
  const navigate = useNavigate()
  const location = useLocation()
  const challengeTitle = location.state?.challengeTitle || 'Operaciones Combinadas'
  
  const [currentPage, setCurrentPage] = useState(0)
  const LEVELS_PER_PAGE = 5

  const getExercisesByChallenge = (challengeTitle) => {
    switch (challengeTitle) {
      case 'Operaciones Combinadas':
        return [
          {
            id: 1,
            title: 'Suma Básica',
            isCompleted: true,
            isUnlocked: true,
            position: { top: '75%', left: '10%' },
            mobilePosition: { top: '70%', left: '20%' }
          },
          {
            id: 2,
            title: 'Resta Simple',
            isCompleted: true,
            isUnlocked: true,
            position: { top: '50%', left: '30%' },
            mobilePosition: { top: '55%', left: '70%' }
          },
          {
            id: 3,
            title: 'Multiplicación',
            isCompleted: false,
            isUnlocked: true,
            position: { top: '75%', left: '50%' },
            mobilePosition: { top: '40%', left: '25%' }
          },
          {
            id: 4,
            title: 'División',
            isCompleted: false,
            isUnlocked: false,
            position: { top: '50%', left: '70%' },
            mobilePosition: { top: '25%', left: '75%' }
          },
          {
            id: 5,
            title: 'Operaciones Mixtas',
            isCompleted: false,
            isUnlocked: false,
            position: { top: '25%', left: '90%' },
            mobilePosition: { top: '10%', left: '50%' }
          },
          {
            id: 6,
            title: 'Paréntesis',
            isCompleted: false,
            isUnlocked: false,
            position: { top: '75%', left: '10%' },
            mobilePosition: { top: '70%', left: '20%' }
          },
          {
            id: 7,
            title: 'Orden de Operaciones',
            isCompleted: false,
            isUnlocked: false,
            position: { top: '50%', left: '30%' },
            mobilePosition: { top: '55%', left: '70%' }
          },
          {
            id: 8,
            title: 'Expresiones Complejas',
            isCompleted: false,
            isUnlocked: false,
            position: { top: '75%', left: '50%' },
            mobilePosition: { top: '40%', left: '25%' }
          },
          {
            id: 9,
            title: 'Problemas Aplicados',
            isCompleted: false,
            isUnlocked: false,
            position: { top: '50%', left: '70%' },
            mobilePosition: { top: '25%', left: '75%' }
          },
          {
            id: 10,
            title: 'Jefe Final',
            isCompleted: false,
            isUnlocked: false,
            position: { top: '25%', left: '90%' },
            mobilePosition: { top: '10%', left: '50%' }
          }
        ];
      case 'Fracciones':
        return [
          {
            id: 1,
            title: 'Fracciones Básicas',
            isCompleted: false,
            isUnlocked: true,
            position: { top: '75%', left: '10%' },
            mobilePosition: { top: '70%', left: '20%' }
          },
          {
            id: 2,
            title: 'Suma de Fracciones',
            isCompleted: false,
            isUnlocked: false,
            position: { top: '50%', left: '30%' },
            mobilePosition: { top: '55%', left: '70%' }
          },
          {
            id: 3,
            title: 'Resta de Fracciones',
            isCompleted: false,
            isUnlocked: false,
            position: { top: '75%', left: '50%' },
            mobilePosition: { top: '40%', left: '25%' }
          },
          {
            id: 4,
            title: 'Multiplicación de Fracciones',
            isCompleted: false,
            isUnlocked: false,
            position: { top: '50%', left: '70%' },
            mobilePosition: { top: '25%', left: '75%' }
          },
          {
            id: 5,
            title: 'Jefe Final - División de Fracciones',
            isCompleted: false,
            isUnlocked: false,
            position: { top: '25%', left: '90%' },
            mobilePosition: { top: '10%', left: '50%' }
          }
        ];
      default:
        return [
          {
            id: 1,
            title: 'Nivel Básico',
            isCompleted: false,
            isUnlocked: true,
            position: { top: '75%', left: '10%' },
            mobilePosition: { top: '70%', left: '20%' }
          },
          {
            id: 2,
            title: 'Nivel Intermedio',
            isCompleted: false,
            isUnlocked: false,
            position: { top: '50%', left: '30%' },
            mobilePosition: { top: '55%', left: '70%' }
          },
          {
            id: 3,
            title: 'Nivel Avanzado',
            isCompleted: false,
            isUnlocked: false,
            position: { top: '75%', left: '50%' },
            mobilePosition: { top: '40%', left: '25%' }
          },
          {
            id: 4,
            title: 'Nivel Experto',
            isCompleted: false,
            isUnlocked: false,
            position: { top: '50%', left: '70%' },
            mobilePosition: { top: '25%', left: '75%' }
          },
          {
            id: 5,
            title: 'Jefe Final',
            isCompleted: false,
            isUnlocked: false,
            position: { top: '25%', left: '90%' },
            mobilePosition: { top: '10%', left: '50%' }
          }
        ]
    }
  }

  const [exercises] = useState(getExercisesByChallenge(challengeTitle))

  // Calcular paginación
  const totalPages = Math.ceil(exercises.length / LEVELS_PER_PAGE)
  const currentExercises = useMemo(() => {
    const startIndex = currentPage * LEVELS_PER_PAGE
    return exercises.slice(startIndex, startIndex + LEVELS_PER_PAGE)
  }, [exercises, currentPage])

  const backgroundImage = isMobile 
    ? './images/bosque_ruta_mobile.png' 
    : './images/bosque_ruta_web.jpg'

  const handleExerciseClick = (exercise) => {
    if (exercise.isUnlocked) {
      console.log(`Iniciando ejercicio: ${exercise.title}`)
      
      // Si es el ejercicio de Multiplicación, navegar a la página de pregunta (solo para pruebas)
      if (exercise.id === 3 && exercise.title === 'Multiplicación') {
        navigate('/question', { 
          state: { 
            exerciseTitle: exercise.title,
            exerciseId: exercise.id 
          } 
        })
      }
    }
  }

  const handleBackClick = () => {
    navigate('/dashboard')
  }

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('${backgroundImage}')`,
        }}
      />
      
      <div className="absolute inset-0 bg-black/10" />

      <div className="relative z-10 h-screen flex flex-col">
        <div className="p-4 flex items-center justify-between">
          <button 
            onClick={handleBackClick}
            className="w-12 h-12 bg-white/20 backdrop-blur-sm border-2 border-white/30 rounded-2xl flex items-center justify-center hover:bg-white/30 transition-all shadow-lg"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>

          <div className="bg-white/20 backdrop-blur-sm border-2 border-white/30 rounded-2xl px-6 py-3 shadow-xl">
            <h1 className="text-white text-xl font-bold text-center drop-shadow-lg">
              {challengeTitle}
            </h1>
          </div>

          <div className="w-12" />
        </div>

        {/* Controles de paginación */}
        {totalPages > 1 && (
          <div className="px-4 pb-4">
            <div className="flex items-center justify-center space-x-4 bg-black/30 backdrop-blur-md border border-white/20 rounded-2xl px-6 py-3 shadow-2xl">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 0}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all ${
                  currentPage === 0
                    ? 'bg-gray-600/50 cursor-not-allowed opacity-50 text-gray-300'
                    : 'bg-blue-600/80 hover:bg-blue-600 text-white hover:scale-105'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span>Anterior</span>
              </button>

              <div className="flex flex-col items-center space-y-1">
                <span className="text-white font-bold text-lg drop-shadow-lg">
                  Página {currentPage + 1} de {totalPages}
                </span>
                <div className="flex space-x-2">
                  {Array.from({ length: totalPages }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentPage(index)}
                      className={`w-3 h-3 rounded-full transition-all ${
                        index === currentPage
                          ? 'bg-yellow-400 scale-125'
                          : 'bg-white/50 hover:bg-white/80'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages - 1}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all ${
                  currentPage === totalPages - 1
                    ? 'bg-gray-600/50 cursor-not-allowed opacity-50 text-gray-300'
                    : 'bg-green-600/80 hover:bg-green-600 text-white hover:scale-105'
                }`}
              >
                <span>Siguiente</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        )}

        <div className="flex-1 relative">
          <svg 
            className="absolute pointer-events-none z-0 w-full h-full"
            style={{ top: 0, left: 0 }}
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FFA726" />
                <stop offset="25%" stopColor="#FFEB3B" />
                <stop offset="50%" stopColor="#66BB6A" />
                <stop offset="75%" stopColor="#42A5F5" />
                <stop offset="100%" stopColor="#AB47BC" />
              </linearGradient>
              
              <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#4CAF50" />
                <stop offset="100%" stopColor="#8BC34A" />
              </linearGradient>
              
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge> 
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            

            {isMobile ? (
              <>
                <path
                  d="M 20,70 
                     Q 30,62 70,55 
                     Q 80,52 25,40 
                     Q 15,27 75,25 
                     Q 85,22 50,10"
                  stroke="rgba(0,0,0,0.4)"
                  strokeWidth="2.2"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                
                <path
                  d="M 20,70 
                     Q 30,62 70,55 
                     Q 80,52 25,40 
                     Q 15,27 75,25 
                     Q 85,22 50,10"
                  stroke="#8D6E63"
                  strokeWidth="1.8"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                
                <path
                  d="M 20,70 
                     Q 30,62 70,55 
                     Q 80,52 25,40 
                     Q 15,27 75,25 
                     Q 85,22 50,10"
                  stroke="url(#pathGradient)"
                  strokeWidth="1.4"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  filter="url(#glow)"
                />
                
                <path
                  d="M 20,70 
                     Q 30,62 70,55 
                     Q 80,52 25,40"
                  stroke="url(#progressGradient)"
                  strokeWidth="1.6"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="0.8,0.4"
                  filter="url(#glow)"
                >
                  <animate 
                    attributeName="stroke-dashoffset" 
                    values="0;-1.2;0" 
                    dur="3s" 
                    repeatCount="indefinite"
                  />
                </path>
                
                <path
                  d="M 20,70 
                     Q 30,62 70,55 
                     Q 80,52 25,40 
                     Q 15,27 75,25 
                     Q 85,22 50,10"
                  stroke="#FFFFFF"
                  strokeWidth="0.4"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="1,1"
                  opacity="0.8"
                />
              </>
            ) : (
              <>
                <path
                  d="M 10,75 
                     Q 20,65 30,50 
                     Q 40,35 50,75 
                     Q 60,85 70,50 
                     Q 80,35 90,25"
                  stroke="rgba(0,0,0,0.4)"
                  strokeWidth="2.2"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                
                <path
                  d="M 10,75 
                     Q 20,65 30,50 
                     Q 40,35 50,75 
                     Q 60,85 70,50 
                     Q 80,35 90,25"
                  stroke="#8D6E63"
                  strokeWidth="1.8"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                
                <path
                  d="M 10,75 
                     Q 20,65 30,50 
                     Q 40,35 50,75 
                     Q 60,85 70,50 
                     Q 80,35 90,25"
                  stroke="url(#pathGradient)"
                  strokeWidth="1.4"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  filter="url(#glow)"
                />
                
                <path
                  d="M 10,75 
                     Q 20,65 30,50 
                     Q 40,35 50,75"
                  stroke="url(#progressGradient)"
                  strokeWidth="1.6"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="0.8,0.4"
                  filter="url(#glow)"
                >
                  <animate 
                    attributeName="stroke-dashoffset" 
                    values="0;-1.2;0" 
                    dur="3s" 
                    repeatCount="indefinite"
                  />
                </path>
                
                <path
                  d="M 10,75 
                     Q 20,65 30,50 
                     Q 40,35 50,75 
                     Q 60,85 70,50 
                     Q 80,35 90,25"
                  stroke="#FFFFFF"
                  strokeWidth="0.4"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="1,1"
                  opacity="0.8"
                />
              </>
            )}
            
            {currentExercises.map((exercise, index) => {
              const position = isMobile ? exercise.mobilePosition : exercise.position
              const x = parseFloat(position.left)
              const y = parseFloat(position.top)
              const isCompleted = exercise.isCompleted
              const isUnlocked = exercise.isUnlocked
              
              return (
                <g key={exercise.id}>
                  <circle 
                    cx={x} 
                    cy={y} 
                    r="1.2" 
                    fill={isCompleted ? "#4CAF50" : isUnlocked ? "#FF9800" : "#9E9E9E"}
                    stroke="#FFFFFF"
                    strokeWidth="0.3"
                    filter="url(#glow)"
                  />
                  
                  {isUnlocked && !isCompleted && (
                    <circle 
                      cx={x} 
                      cy={y} 
                      r="1.2" 
                      fill="none"
                      stroke="#FF9800"
                      strokeWidth="0.2"
                      opacity="0.7"
                    >
                      <animate 
                        attributeName="r" 
                        values="1.2;2.5;1.2" 
                        dur="2s" 
                        repeatCount="indefinite"
                      />
                      <animate 
                        attributeName="opacity" 
                        values="0.7;0;0.7" 
                        dur="2s" 
                        repeatCount="indefinite"
                      />
                    </circle>
                  )}
                </g>
              )
            })}
          </svg>

          {currentExercises.map((exercise, index) => {
            const position = isMobile ? exercise.mobilePosition : exercise.position
            const isBoss = exercise.title.toLowerCase().includes('jefe final')
            
            return (
              <div key={exercise.id}>
                <div
                  className="absolute z-10 transform -translate-x-1/2 -translate-y-1/2"
                  style={{
                    top: position.top,
                    left: position.left
                  }}
                >
                  <button
                    onClick={() => handleExerciseClick(exercise)}
                    className={`relative group ${
                      exercise.isUnlocked
                        ? 'cursor-pointer hover:scale-110'
                        : 'cursor-not-allowed'
                    } transition-all duration-300`}
                    disabled={!exercise.isUnlocked}
                  >
                    <div className={`${isMobile ? 'w-20 h-20' : 'w-24 h-24'} rounded-full flex items-center justify-center border-6 shadow-2xl relative ${
                      exercise.isCompleted
                        ? 'bg-gradient-to-br from-green-400 to-green-600 border-white shadow-green-500/50'
                        : exercise.isUnlocked
                        ? isBoss 
                          ? 'bg-gradient-to-br from-red-500 to-purple-600 border-yellow-400 shadow-red-500/50'
                          : 'bg-gradient-to-br from-blue-400 to-blue-600 border-white shadow-blue-500/50'
                        : 'bg-gray-600 border-gray-400 shadow-gray-500/30'
                    }`}>
                      {exercise.isCompleted ? (
                        <svg className={`${isMobile ? 'w-10 h-10' : 'w-12 h-12'} text-white`} fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : exercise.isUnlocked ? (
                        isBoss ? (
                          <svg className={`${isMobile ? 'w-10 h-10' : 'w-12 h-12'} text-yellow-300`} fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ) : (
                          <svg className={`${isMobile ? 'w-10 h-10' : 'w-12 h-12'} text-white`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        )
                      ) : (
                        <svg className={`${isMobile ? 'w-10 h-10' : 'w-12 h-12'} text-gray-300`} fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>

                    {exercise.isUnlocked && (
                      <div className={`absolute ${isMobile ? '-bottom-8' : '-bottom-10'} left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 backdrop-blur-sm text-white ${isMobile ? 'text-xs' : 'text-sm'} rounded-lg px-3 py-2 whitespace-nowrap border border-white/20`}>
                        {exercise.title}
                      </div>
                    )}

                    {isBoss && (
                      <div className={`absolute ${isMobile ? '-top-8' : '-top-10'} left-1/2 transform -translate-x-1/2 bg-red-600/90 backdrop-blur-sm text-white ${isMobile ? 'text-sm' : 'text-base'} font-bold rounded-lg px-3 py-1 border-2 border-red-400/50 shadow-lg whitespace-nowrap`}>
                        JEFE FINAL
                      </div>
                    )}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      
      {isMobile && <BottomNavigation />}
    </div>
  )
}

export default Exercises