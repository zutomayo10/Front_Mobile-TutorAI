import React, { useState } from 'react'
import { useDeviceDetection } from '../hooks/useDeviceDetection'
import Sidebar from '../components/Sidebar'
import BottomNavigation from '../components/BottomNavigation'

const Profile = () => {
  const { isMobile } = useDeviceDetection()
  const [userLevel] = useState(15)
  const [userExp] = useState({ current: 240, total: 400 })
  const [completedChallenges] = useState(3)
  const [totalChallenges] = useState(15)
  const [achievements] = useState(10)
  const [totalAchievements] = useState(20)

  const logros = [
    {
      id: 1,
      name: 'Primer Desafío',
      icon: '🥉',
      color: 'from-orange-400 to-orange-600',
      achieved: true
    },
    {
      id: 2,
      name: 'Matemático Plata',
      icon: '🥈',
      color: 'from-gray-400 to-gray-600',
      achieved: true
    },
    {
      id: 3,
      name: 'Experto Oro',
      icon: '🏆',
      color: 'from-yellow-400 to-yellow-600',
      achieved: false
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-green-500 to-green-600 relative">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('./images/perfil_bosque.jpeg')`,
          filter: 'brightness(0.7)'
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
      </div>

      <div className="relative z-10 flex">
        {!isMobile && <Sidebar />}

        <div className={`flex-1 ${!isMobile ? 'ml-64' : ''} ${isMobile ? 'pb-20' : ''} min-h-screen flex flex-col p-6`}>
          
          <div className="bg-gradient-to-b from-green-600/80 to-green-800/80 backdrop-blur-sm rounded-3xl shadow-2xl border-4 border-green-400/50 flex-1 overflow-hidden">
            
            <div className="p-6 h-full flex flex-col">
              
              <div className="text-center mb-8">
                <div className="relative inline-block mb-4">
                  <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 rounded-full flex items-center justify-center border-4 border-white shadow-2xl transform hover:scale-110 transition-all duration-300">
                    <span className="text-white text-5xl">👤</span>
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-purple-600 text-white text-sm font-bold rounded-full w-10 h-10 flex items-center justify-center border-3 border-white shadow-lg">
                    {userLevel}
                  </div>
                </div>
                <h1 className="text-white text-3xl font-bold drop-shadow-2xl mb-2">Juan Chavez</h1>
              </div>

              <div className="mb-8">
                <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-6 border-2 border-white/30 shadow-xl">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-white text-lg font-bold flex items-center">
                      ⚡ Energía Mágica
                    </span>
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full px-4 py-2">
                      <span className="text-white text-lg font-bold">{userExp.current}/{userExp.total}</span>
                    </div>
                  </div>
                  <div className="w-full bg-black/40 rounded-full h-4 overflow-hidden shadow-inner mb-4">
                    <div 
                      className="bg-gradient-to-r from-yellow-300 via-orange-400 to-red-500 h-full rounded-full transition-all duration-1000 shadow-lg relative overflow-hidden"
                      style={{ width: `${(userExp.current / userExp.total) * 100}%` }}
                    >
                      <div className="absolute inset-0 bg-white/30 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-blue-500/30 backdrop-blur-sm rounded-2xl p-3 text-center border border-blue-400/50">
                      <div className="text-2xl mb-1">📚</div>
                      <div className="text-white text-xs font-bold">Lecciones</div>
                      <div className="text-yellow-300 text-lg font-bold">8</div>
                    </div>
                    <div className="bg-purple-500/30 backdrop-blur-sm rounded-2xl p-3 text-center border border-purple-400/50">
                      <div className="text-2xl mb-1">⭐</div>
                      <div className="text-white text-xs font-bold">Estrellas</div>
                      <div className="text-yellow-300 text-lg font-bold">24</div>
                    </div>
                  </div>
                  
                  <div className="bg-indigo-500/30 backdrop-blur-sm rounded-2xl p-3 border border-indigo-400/50">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <span className="text-xl">🎯</span>
                        <span className="text-white font-bold">Precisión</span>
                      </div>
                      <span className="text-yellow-300 text-xl font-bold">87%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex-1 flex flex-col">
                <div className="mb-6">
                  <h2 className="text-white text-2xl font-bold mb-6 text-center drop-shadow-lg">
                    🏆 Tus Increíbles Logros 🏆
                  </h2>
                  <div className="flex justify-center space-x-6 mb-6">
                    {logros.map((logro) => (
                      <div
                        key={logro.id}
                        className="relative cursor-pointer"
                      >
                        <div
                          className={`w-20 h-20 rounded-full flex items-center justify-center border-4 shadow-2xl relative ${
                            logro.achieved
                              ? `bg-gradient-to-br ${logro.color} border-white`
                              : 'bg-gray-600 border-gray-500 opacity-60'
                          }`}
                        >
                          <span className="text-3xl">{logro.icon}</span>
                          {logro.achieved && (
                            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/30 to-transparent opacity-60 animate-pulse"></div>
                          )}
                          {logro.achieved && (
                            <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                              <span className="text-xs">✨</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="text-center">
                    <button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-3 px-8 rounded-full shadow-xl transform hover:scale-110 transition-all duration-300 border-2 border-white border-opacity-50">
                      <span className="flex items-center space-x-2">
                        <span>🎯</span>
                        <span>¡Ver Todos los Logros!</span>
                        <span>✨</span>
                      </span>
                    </button>
                  </div>
                </div>

                <div className="mt-auto">
                  <div className="bg-gradient-to-r from-purple-600/70 to-blue-600/70 backdrop-blur-sm rounded-3xl p-6 border-2 border-white/30 shadow-2xl">
                    <h3 className="text-white text-xl font-bold mb-4 text-center flex items-center justify-center">
                      <span className="mr-2">📊</span>
                      Tu Progreso Fantástico
                      <span className="ml-2">🚀</span>
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/30">
                        <div className="text-3xl mb-2">🎯</div>
                        <div className="text-white font-bold text-lg">Desafíos</div>
                        <div className="text-yellow-300 text-2xl font-bold">{completedChallenges}/{totalChallenges}</div>
                        <div className="w-full bg-black/30 rounded-full h-2 mt-2">
                          <div 
                            className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full"
                            style={{ width: `${(completedChallenges / totalChallenges) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/30">
                        <div className="text-3xl mb-2">🏅</div>
                        <div className="text-white font-bold text-lg">Logros</div>
                        <div className="text-yellow-300 text-2xl font-bold">{achievements}/{totalAchievements}</div>
                        <div className="w-full bg-black/30 rounded-full h-2 mt-2">
                          <div 
                            className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full"
                            style={{ width: `${(achievements / totalAchievements) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isMobile && <BottomNavigation />}
    </div>
  )
}

export default Profile