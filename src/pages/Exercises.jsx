import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDeviceDetection } from '../hooks/useDeviceDetection'
import BottomNavigation from '../components/BottomNavigation'

const Exercises = () => {
  const { isMobile } = useDeviceDetection()
  const navigate = useNavigate()
  const location = useLocation()
  const challengeTitle = location.state?.challengeTitle || 'Operaciones Combinadas'
  
  const [exercises] = useState([
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
      title: 'Jefe Final',
      isCompleted: false,
      isUnlocked: false,
      position: { top: '25%', left: '90%' },
      mobilePosition: { top: '10%', left: '50%' }
    }
  ])

  const backgroundImage = isMobile 
    ? './images/bosque_ruta_mobile.png' 
    : './images/bosque_ruta_web.jpg'

  const handleExerciseClick = (exercise) => {
    if (exercise.isUnlocked) {
      console.log(`Iniciando ejercicio: ${exercise.title}`)
    }
  }

  const handleBackClick = () => {
    navigate('/dashboard')
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
            
            {exercises.map((exercise, index) => {
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

          {exercises.map((exercise, index) => {
            const position = isMobile ? exercise.mobilePosition : exercise.position
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
                        ? 'bg-gradient-to-br from-blue-400 to-blue-600 border-white shadow-blue-500/50'
                        : 'bg-gray-600 border-gray-400 shadow-gray-500/30'
                    }`}>
                      {exercise.isCompleted ? (
                        <svg className={`${isMobile ? 'w-10 h-10' : 'w-12 h-12'} text-white`} fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : exercise.isUnlocked ? (
                        <svg className={`${isMobile ? 'w-10 h-10' : 'w-12 h-12'} text-white`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
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

                    {exercise.id === 5 && (
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