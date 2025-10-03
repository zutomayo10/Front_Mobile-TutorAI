import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDeviceDetection } from '../hooks/useDeviceDetection'
import { useUserProfile } from '../hooks/useUserProfile'
import Sidebar from '../components/Sidebar'
import BottomNavigation from '../components/BottomNavigation'
import Avatar from '../components/Avatar'

const Dashboard = () => {
  const { isMobile } = useDeviceDetection()
  const { profileImage, uploadedImageUrl, userName, isLoading } = useUserProfile()
  const navigate = useNavigate()
  const [userLevel] = useState(15)
  const [userExp] = useState({ current: 240, total: 400 })

  const handlePlayChallenge = (challenge) => {
    navigate('/exercises', { 
      state: { 
        challengeTitle: challenge.title 
      } 
    })
  }

  const challenges = [
    {
      title: 'Operaciones Combinadas',
      completed: 3,
      total: 4,
      progress: 75,
      icon: '🧮',
      color: 'from-purple-500 to-pink-500',
      shadowColor: 'shadow-purple-500/30'
    },
    {
      title: 'Fracciones',
      completed: 3,
      total: 4,
      progress: 75,
      icon: '🍕',
      color: 'from-orange-500 to-red-500',
      shadowColor: 'shadow-orange-500/30'
    },
    {
      title: 'Geometría Básica',
      completed: 2,
      total: 5,
      progress: 40,
      icon: '📐',
      color: 'from-blue-500 to-cyan-500',
      shadowColor: 'shadow-blue-500/30'
    }
  ]

  return (
    <div className="min-h-screen relative dashboard-container" style={{ minHeight: '100dvh' }}>
      <div 
        className="fixed inset-0 fixed-background"
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
        className="fixed inset-0 background-layer"
        style={{
          background: `
            linear-gradient(135deg, rgba(45, 80, 22, 0.3) 0%, rgba(74, 124, 35, 0.2) 30%, rgba(61, 107, 26, 0.3) 60%, rgba(45, 80, 22, 0.4) 100%),
            radial-gradient(ellipse at top, rgba(106, 170, 100, 0.2) 0%, transparent 50%),
            radial-gradient(ellipse at bottom, rgba(45, 80, 22, 0.3) 0%, transparent 50%)
          `
        }}
      />
      
      <div className="fixed inset-0 bg-black bg-opacity-20 background-layer" />

      <div className="relative z-10 flex">
        {!isMobile && <Sidebar />}
        
        <div className={`flex-1 ${isMobile ? 'pb-20 main-content-mobile' : 'pl-64'}`}>
          <div className="p-4 md:p-6">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Avatar
                      profileImage={profileImage}
                      uploadedImageUrl={uploadedImageUrl}
                      isLoading={isLoading}
                      size="md"
                      className="border-white border-opacity-50 shadow-lg"
                    />
                  </div>
                  <div>
                    <h2 className="text-white font-bold text-xl drop-shadow-lg">{userName}</h2>
                    <p className="text-yellow-200 text-sm font-semibold drop-shadow">Nivel {userLevel}</p>
                  </div>
                </div>
              </div>
              
              <div className="rounded-2xl p-4 shadow-xl border border-white/20" style={{backgroundColor: '#239B56'}}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-yellow-300 text-xl">⚡</span>
                    <span className="text-white font-semibold">Experiencia</span>
                  </div>
                  <div className="rounded-full px-4 py-1 border border-white/30" style={{backgroundColor: '#F19506'}}>
                    <span className="text-white text-sm font-bold">{userExp.current}/{userExp.total} EXP</span>
                  </div>
                </div>
                <div className="relative">
                  <div className="w-full bg-black/40 rounded-full h-3 overflow-hidden border border-white/20">
                    <div 
                      className="bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 h-full rounded-full transition-all duration-1000 relative"
                      style={{ width: `${(userExp.current / userExp.total) * 100}%` }}
                    >
                      <div className="absolute inset-0 bg-white/30 rounded-full"></div>
                    </div>
                  </div>
                  <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold drop-shadow-lg">
                      {Math.round((userExp.current / userExp.total) * 100)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <div className="text-center">
                <div className="inline-flex items-center rounded-full px-6 py-3 shadow-lg border border-white border-opacity-30 mb-4" style={{backgroundColor: '#239B56'}}>
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
                  className={`relative bg-green-800 bg-opacity-90 backdrop-blur-md rounded-2xl p-6 border-2 border-white border-opacity-20 transform transition-all duration-300 cursor-pointer shadow-xl ${challenge.shadowColor}`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 hover:opacity-10 rounded-2xl transition-opacity duration-300"></div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-green-600 rounded-xl flex items-center justify-center text-3xl shadow-lg transform hover:rotate-12 transition-transform duration-300">
                        {challenge.icon}
                      </div>
                      <div>
                        <h3 className="text-white font-bold text-xl drop-shadow-lg mb-1">
                          {challenge.title}
                        </h3>
                      </div>
                    </div>
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
                        className="bg-green-500 h-3 rounded-full transition-all duration-1000 shadow-lg relative"
                        style={{ width: `${challenge.progress}%` }}
                      >
                        <div className="absolute inset-0 bg-white bg-opacity-30 rounded-full animate-pulse"></div>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => handlePlayChallenge(challenge)}
                    className="w-full hover:opacity-90 transform transition-all duration-200 text-white font-bold py-3 px-6 rounded-xl shadow-lg flex items-center justify-center space-x-2 cursor-pointer"
                    style={{ backgroundColor: '#F19506' }}
                  >
                    <span>¡JUGAR AHORA!</span>
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