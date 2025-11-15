import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDeviceDetection } from '../hooks/useDeviceDetection'
import { useUserProfile } from '../hooks/useUserProfile'
import { useClassroomData } from '../hooks/useClassroomData'
import { useGameStats } from '../hooks/useGameStats'
import { useAuth } from '../contexts/AuthContext'
import Sidebar from '../components/Sidebar'
import BottomNavigation from '../components/BottomNavigation'
import Avatar from '../components/Avatar'
import ExperienceBar from '../components/ExperienceBar'
import ChallengeList from '../components/ChallengeList'
import DashboardHeader from '../components/DashboardHeader'

const Dashboard = () => {
  const { isMobile } = useDeviceDetection()
  const { profileImage, uploadedImageUrl, isLoading: profileLoading } = useUserProfile()
  const { classrooms, courses, topics, selectedClassroom, selectedCourse, isLoading: dataLoading } = useClassroomData()
  const { user, userInfo } = useAuth()
  const { stats, accuracy, progressPercentage, isNewUser } = useGameStats()
  const navigate = useNavigate()

  const handlePlayChallenge = (challenge) => {
    // Si el desafío tiene datos de aula real, navegar a los temas
    if (challenge.classroomData) {
      navigate('/topics', { 
        state: { 
          classroomId: challenge.classroomData.id,
          classroomName: challenge.classroomData.name
        } 
      })
    } else {
      // Fallback al sistema anterior
      navigate('/exercises', { 
        state: { 
          challengeTitle: challenge.title
        } 
      })
    }
  }

  // Convertir aulas/cursos en desafíos para la interfaz existente
  const challenges = classrooms.map((classroom, index) => {
    // Calcular progreso real basado en ejercicios completados
    const totalExercisesCompleted = stats.exercisesCompleted || 0
    const totalLevelsCompleted = stats.levelsCompleted || 0
    
    // Si no hay progreso, mostrar 0 en todo
    if (totalExercisesCompleted === 0) {
      return {
        title: classroom.name || `Aula ${classroom.id}`,
        completed: 0,
        total: 4,
        progress: 0,
        icon: ['🧮', '🍕', '📐', '📚', '🎯'][index % 5],
        color: [
          'from-purple-500 to-pink-500',
          'from-orange-500 to-red-500', 
          'from-blue-500 to-cyan-500',
          'from-green-500 to-teal-500',
          'from-yellow-500 to-orange-500'
        ][index % 5],
        shadowColor: [
          'shadow-purple-500/30',
          'shadow-orange-500/30',
          'shadow-blue-500/30', 
          'shadow-green-500/30',
          'shadow-yellow-500/30'
        ][index % 5],
        classroomData: classroom
      }
    }
    
    // Calcular progreso por aula (distribución estimada)
    const estimatedExercisesPerClassroom = 10
    const startRange = estimatedExercisesPerClassroom * index
    const endRange = estimatedExercisesPerClassroom * (index + 1)
    const completedInThisClassroom = Math.max(0, Math.min(totalExercisesCompleted - startRange, estimatedExercisesPerClassroom))
    const progressInClassroom = Math.min(Math.round((completedInThisClassroom / estimatedExercisesPerClassroom) * 100), 100)
    
    // Calcular misiones completadas basado en niveles reales completados
    const totalMissions = 4
    const levelsForThisClassroom = Math.floor(totalLevelsCompleted / classrooms.length) + (index < (totalLevelsCompleted % classrooms.length) ? 1 : 0)
    const completedMissions = Math.min(levelsForThisClassroom, totalMissions)
    
    return {
      title: classroom.name || `Aula ${classroom.id}`,
      completed: completedMissions,
      total: totalMissions,
      progress: progressInClassroom,
      icon: ['🧮', '🍕', '📐', '📚', '🎯'][index % 5],
      color: [
        'from-purple-500 to-pink-500',
        'from-orange-500 to-red-500', 
        'from-blue-500 to-cyan-500',
        'from-green-500 to-teal-500',
        'from-yellow-500 to-orange-500'
      ][index % 5],
      shadowColor: [
        'shadow-purple-500/30',
        'shadow-orange-500/30',
        'shadow-blue-500/30', 
        'shadow-green-500/30',
        'shadow-yellow-500/30'
      ][index % 5],
      classroomData: classroom
    }
  })

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
                      isLoading={profileLoading}
                      size={isMobile ? "sm" : "md"}
                      className="border-white border-opacity-50 shadow-lg"
                    />
                  </div>
                  <div>
                    <h2 className="text-white font-bold text-xl drop-shadow-lg">
                      {userInfo ? `${userInfo.name} ${userInfo.lastNames}` : 'Estudiante'}
                    </h2>
                    <p className="text-yellow-200 text-sm font-semibold drop-shadow">
                      Nivel {stats.level} | Rol: {user?.role || 'Estudiante'}
                      {userInfo?.age && ` | Edad: ${userInfo.age}`}
                    </p>
                    <div className="text-green-200 text-xs drop-shadow space-y-1">
                      {classrooms.length > 0 && (
                        <p>{classrooms.length} aula{classrooms.length !== 1 ? 's' : ''} disponible{classrooms.length !== 1 ? 's' : ''}</p>
                      )}
                      {stats.exercisesCompleted > 0 && (
                        <p>✅ {stats.exercisesCompleted} ejercicios completados</p>
                      )}
                      {accuracy > 0 && (
                        <p>🎯 {accuracy}% de precisión</p>
                      )}
                      {isNewUser && (
                        <p>🌟 ¡Bienvenido! Comienza tu aventura matemática</p>
                      )}
                    </div>
                  </div>
                </div>
                <ExperienceBar 
                  currentExp={stats.experience.current}
                  totalExp={stats.experience.total}
                  isMobile={isMobile}
                />
              </div>
            </div>

            <DashboardHeader />
            
            {dataLoading ? (
              <div className="text-center py-8">
                <div className="text-white text-lg">Cargando tus aulas...</div>
              </div>
            ) : challenges.length > 0 ? (
              <>
                <ChallengeList 
                  challenges={challenges}
                  onPlayChallenge={handlePlayChallenge}
                />
                
                {/* Botón flotante para unirse a más aulas */}
                <div className="fixed bottom-24 right-4 z-30">
                  <button
                    onClick={() => navigate('/join-classroom')}
                    className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200"
                    title="Unirse a un aula"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="text-white text-lg mb-4">
                  Aún no tienes aulas asignadas
                </div>
                <p className="text-white text-sm opacity-80 mb-4">
                  Contacta a tu profesor para que te agregue a un aula
                </p>
                <button
                  onClick={() => navigate('/join-classroom')}
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Unirse a un Aula
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      {isMobile && <BottomNavigation />}
    </div>
  )
}

export default Dashboard