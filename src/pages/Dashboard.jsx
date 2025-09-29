import React, { useState } from 'react'
import { useDeviceDetection } from '../hooks/useDeviceDetection'
import Sidebar from '../components/Sidebar'
import BottomNavigation from '../components/BottomNavigation'

const Dashboard = () => {
  const { isMobile } = useDeviceDetection()
  const [userLevel] = useState(15)
  const [userExp] = useState({ current: 240, total: 400 })

  const challenges = [
    {
      title: 'Operaciones Combinadas',
      completed: 3,
      total: 4,
      progress: 75,
      icon: '🧮',
      color: 'from-purple-500 to-pink-500',
      shadowColor: 'shadow-purple-500/30',
      stars: 3,
      isUnlocked: true
    },
    {
      title: 'Fracciones',
      completed: 3,
      total: 4,
      progress: 75,
      icon: '🍕',
      color: 'from-orange-500 to-red-500',
      shadowColor: 'shadow-orange-500/30',
      stars: 3,
      isUnlocked: true
    },
    {
      title: 'Geometría Básica',
      completed: 2,
      total: 5,
      progress: 40,
      icon: '📐',
      color: 'from-blue-500 to-cyan-500',
      shadowColor: 'shadow-blue-500/30',
      stars: 2,
      isUnlocked: true
    },
    {
      title: 'Álgebra Simple',
      completed: 1,
      total: 6,
      progress: 16,
      icon: '�',
      color: 'from-green-500 to-emerald-500',
      shadowColor: 'shadow-green-500/30',
      stars: 1,
      isUnlocked: false
    }
  ]

  return (
    <div className="min-h-screen relative">
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundColor: '#2d5016',
          backgroundImage: `
            url("/images/bosque.jpeg"),
            linear-gradient(135deg, #2d5016 0%, #4a7c23 30%, #3d6b1a 60%, #2d5016 100%),
            radial-gradient(ellipse at top, rgba(106, 170, 100, 0.3) 0%, transparent 50%),
            radial-gradient(ellipse at bottom, rgba(45, 80, 22, 0.4) 0%, transparent 50%)
          `
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
      </div>

      <div className="relative z-10 flex">
        {!isMobile && <Sidebar />}
        
        <div className={`flex-1 ${isMobile ? 'pb-20' : 'pl-64'}`}>
          <div className="p-4 md:p-6">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center border-4 border-white border-opacity-50 shadow-lg">
                      <span className="text-white text-3xl filter drop-shadow-lg">👤</span>
                    </div>
                  </div>
                  <div>
                    <h2 className="text-white font-bold text-xl drop-shadow-lg">Juan Chavez</h2>
                    <p className="text-yellow-200 text-sm font-semibold drop-shadow">Nivel {userLevel}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-full p-2 shadow-lg">
                <div className="flex items-center justify-between mb-2 px-2">
                  <span className="text-white text-sm font-bold flex items-center">
                    <span className="mr-1">⚡</span> 
                    Experiencia
                  </span>
                  <span className="text-white text-sm font-bold">{userExp.current}/{userExp.total} EXP</span>
                </div>
                <div className="w-full bg-black bg-opacity-30 rounded-full h-4 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 h-4 rounded-full transition-all duration-1000 shadow-inner relative"
                    style={{ width: `${(userExp.current / userExp.total) * 100}%` }}
                  >
                    <div className="absolute inset-0 bg-white bg-opacity-30 rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <div className="text-center">
                <div className="inline-flex items-center bg-white bg-opacity-20 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg border border-white border-opacity-30 mb-4">
                  <span className="text-3xl mr-3 animate-pulse">⚔️</span>
                  <h1 className="text-white text-2xl md:text-3xl font-bold drop-shadow-lg">
                    ¡Tus Aventuras Matemáticas!
                  </h1>
                  <span className="text-3xl ml-3 animate-pulse">🏆</span>
                </div>
                <p className="text-white text-opacity-90 text-lg font-medium drop-shadow">
                  ¡Completa los desafíos y conviértete en el mejor!
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {challenges.map((challenge, index) => (
                <div 
                  key={index}
                  className={`relative bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-6 border-2 border-white border-opacity-20 hover:bg-opacity-20 hover:scale-105 transform transition-all duration-300 cursor-pointer shadow-xl ${challenge.shadowColor} ${!challenge.isUnlocked ? 'opacity-60' : ''}`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 hover:opacity-10 rounded-2xl transition-opacity duration-300"></div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className={`w-16 h-16 bg-gradient-to-br ${challenge.color} rounded-xl flex items-center justify-center text-3xl shadow-lg transform hover:rotate-12 transition-transform duration-300`}>
                        {challenge.icon}
                      </div>
                      <div>
                        <h3 className="text-white font-bold text-xl drop-shadow-lg mb-1">
                          {challenge.title}
                        </h3>
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <span 
                              key={i} 
                              className={`text-lg ${i < challenge.stars ? 'text-yellow-400' : 'text-gray-400'} drop-shadow`}
                            >
                              ⭐
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    {challenge.isUnlocked ? (
                      <div className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                        ¡DISPONIBLE!
                      </div>
                    ) : (
                      <div className="bg-gray-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center">
                        🔒 BLOQUEADO
                      </div>
                    )}
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-white text-opacity-90 font-semibold flex items-center">
                        <span className="mr-2">🎯</span>
                        {challenge.completed}/{challenge.total} misiones completadas
                      </p>
                      <p className="text-yellow-300 font-bold text-lg">
                        {challenge.progress}%
                      </p>
                    </div>
                    
                    <div className="w-full bg-black bg-opacity-30 rounded-full h-3 overflow-hidden shadow-inner">
                      <div
                        className={`bg-gradient-to-r ${challenge.color} h-3 rounded-full transition-all duration-1000 shadow-lg relative`}
                        style={{ width: `${challenge.progress}%` }}
                      >
                        <div className="absolute inset-0 bg-white bg-opacity-30 rounded-full animate-pulse"></div>
                      </div>
                    </div>
                  </div>

                  <button className={`w-full bg-gradient-to-r ${challenge.color} hover:scale-105 transform transition-all duration-200 text-white font-bold py-3 px-6 rounded-xl shadow-lg flex items-center justify-center space-x-2`}>
                    {challenge.isUnlocked ? (
                      <span>¡JUGAR AHORA!</span>
                    ) : (
                      <span>Completa desafíos anteriores</span>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>


      {isMobile && <BottomNavigation />}
    </div>
  )
}

export default Dashboard