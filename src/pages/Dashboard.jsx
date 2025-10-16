import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDeviceDetection } from '../hooks/useDeviceDetection'
import { useUserProfile } from '../hooks/useUserProfile'
import Sidebar from '../components/Sidebar'
import BottomNavigation from '../components/BottomNavigation'
import Avatar from '../components/Avatar'
import ExperienceBar from '../components/ExperienceBar'
import ChallengeList from '../components/ChallengeList'
import DashboardHeader from '../components/DashboardHeader'

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
              <div className={`${isMobile ? 'flex flex-col' : 'flex items-start'} mb-4`}>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Avatar
                      profileImage={profileImage}
                      uploadedImageUrl={uploadedImageUrl}
                      isLoading={isLoading}
                      size={isMobile ? "sm" : "md"}
                      className="border-white border-opacity-50 shadow-lg"
                    />
                  </div>
                  <div>
                    <h2 className="text-white font-bold text-xl drop-shadow-lg">{userName}</h2>
                    <p className="text-yellow-200 text-sm font-semibold drop-shadow">Nivel {userLevel}</p>
                  </div>
                </div>
                <ExperienceBar 
                  currentExp={userExp.current}
                  totalExp={userExp.total}
                  isMobile={isMobile}
                />
              </div>
            </div>

            <DashboardHeader />
            <ChallengeList 
              challenges={challenges}
              onPlayChallenge={handlePlayChallenge}
            />
          </div>
        </div>
      </div>
      {isMobile && <BottomNavigation />}
    </div>
  )
}

export default Dashboard