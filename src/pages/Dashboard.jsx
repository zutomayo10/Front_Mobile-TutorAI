import React, { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDeviceDetection } from '../hooks/useDeviceDetection'
import { useUserProfile } from '../hooks/useUserProfile'
import { useClassroomData } from '../hooks/useClassroomData'
import { useGameStats } from '../hooks/useGameStats'
import { useAuth } from '../contexts/AuthContext'
import { getCourses, getTopics, studentGetLevels, studentCheckLevelPassed } from '../services/api'
import Sidebar from '../components/Sidebar'
import BottomNavigation from '../components/BottomNavigation'
import Avatar from '../components/Avatar'
import ExperienceBar from '../components/ExperienceBar'
import ChallengeList from '../components/ChallengeList'
import DashboardHeader from '../components/DashboardHeader'

const Dashboard = () => {
  const { isMobile } = useDeviceDetection()
  const { profileImage, isLoading: profileLoading } = useUserProfile()
  const { classrooms, courses, topics, selectedClassroom, selectedCourse, isLoading: dataLoading } = useClassroomData()
  const { user, userInfo } = useAuth()
  const { stats, accuracy, progressPercentage, isNewUser } = useGameStats()
  const navigate = useNavigate()
  
  useEffect(() => {
    console.log('🎮 [Dashboard] userInfo:', userInfo);
    console.log('📊 [Dashboard] stats recibidos:', stats);
  }, [userInfo, stats]);
  const [levelsCompletedByClassroom, setLevelsCompletedByClassroom] = useState(() => {
    try {
      const cached = localStorage.getItem('classroomProgress');
      if (cached) {
        const parsed = JSON.parse(cached);
        console.log('📦 [Dashboard] Cargado desde cache:', parsed);
        return parsed;
      }
    } catch (error) {
      console.error('Error cargando cache:', error);
    }
    return {};
  })
  
  const [totalLevelsByClassroom, setTotalLevelsByClassroom] = useState(() => {
    try {
      const cached = localStorage.getItem('classroomTotals');
      if (cached) {
        const parsed = JSON.parse(cached);
        console.log('📦 [Dashboard] Totales cargados desde cache:', parsed);
        return parsed;
      }
    } catch (error) {
      console.error('Error cargando cache de totales:', error);
    }
    return {};
  })

  useEffect(() => {
    console.log('📊 [Dashboard] Stats actualizados:', {
      level: stats.level,
      currentExp: stats.experience.current,
      totalExp: stats.experience.total,
      levelsCompleted: stats.levelsCompleted,
      exercisesCompleted: stats.exercisesCompleted
    });
    console.log('🎯 [Dashboard] Progreso de experiencia:', `${stats.experience.current}/${stats.experience.total} (${progressPercentage}%)`);
  }, [stats, progressPercentage]);

  useEffect(() => {
    const loadLevelsData = async () => {
      if (!classrooms || classrooms.length === 0) return;
      
      console.log('🔄 [Dashboard] Actualizando niveles completados y totales...');
      const completedData = {};
      const totalsData = {};
      
      try {
        await Promise.all(classrooms.map(async (classroom) => {
          try {
            let totalCompleted = 0;
            let totalLevels = 0;
            
            const coursesData = await getCourses(classroom.id);
            
            if (coursesData && coursesData.length > 0) {
              const courseResults = await Promise.all(coursesData.map(async (course) => {
                try {
                  const topicsData = await getTopics(classroom.id, course.courseId);
                  
                  if (topicsData && topicsData.length > 0) {
                    const topicResults = await Promise.all(topicsData.map(async (topic) => {
                      try {
                        const levels = await studentGetLevels(topic.topicId);
                        
                        if (levels && levels.length > 0) {
                          const totalInTopic = levels.length;
                          
                          const levelChecks = await Promise.all(levels.map(async (level) => {
                            try {
                              return await studentCheckLevelPassed(level.levelId);
                            } catch {
                              return false;
                            }
                          }));
                          
                          const completedInTopic = levelChecks.filter(passed => passed).length;
                          
                          return { completed: completedInTopic, total: totalInTopic };
                        }
                        return { completed: 0, total: 0 };
                      } catch {
                        return { completed: 0, total: 0 };
                      }
                    }));
                    
                    return {
                      completed: topicResults.reduce((sum, item) => sum + item.completed, 0),
                      total: topicResults.reduce((sum, item) => sum + item.total, 0)
                    };
                  }
                  return { completed: 0, total: 0 };
                } catch {
                  return { completed: 0, total: 0 };
                }
              }));
              
              totalCompleted = courseResults.reduce((sum, item) => sum + item.completed, 0);
              totalLevels = courseResults.reduce((sum, item) => sum + item.total, 0);
            }
            
            completedData[classroom.id] = totalCompleted;
            totalsData[classroom.id] = totalLevels;
            console.log(`✅ Classroom ${classroom.name}: ${totalCompleted}/${totalLevels} niveles`);
          } catch (error) {
            console.error(`Error en classroom ${classroom.id}:`, error);
            completedData[classroom.id] = 0;
            totalsData[classroom.id] = 0;
          }
        }));
        
        localStorage.setItem('classroomProgress', JSON.stringify(completedData));
        localStorage.setItem('classroomTotals', JSON.stringify(totalsData));
        setLevelsCompletedByClassroom(completedData);
        setTotalLevelsByClassroom(totalsData);
        console.log('💾 [Dashboard] Progreso y totales guardados en cache');
      } catch (error) {
        console.error('Error general:', error);
      }
    };
    
    const timeoutId = setTimeout(() => {
      loadLevelsData();
    }, 100);
    
    return () => clearTimeout(timeoutId);
  }, [classrooms]);

  const handlePlayChallenge = (challenge) => {
    if (challenge.classroomData) {
      navigate('/topics', { 
        state: { 
          classroomId: challenge.classroomData.id,
          classroomName: challenge.classroomData.name
        } 
      })
    } else {
      navigate('/exercises', { 
        state: { 
          challengeTitle: challenge.title
        } 
      })
    }
  }

  const challenges = useMemo(() => {
    return classrooms.map((classroom, index) => {
      const classroomId = classroom.id;
      
      const completedLevelsInClassroom = levelsCompletedByClassroom[classroomId] || 0;
      const totalLevelsInClassroom = totalLevelsByClassroom[classroomId] || 0;
      
      const progress = totalLevelsInClassroom > 0 
        ? Math.min(Math.round((completedLevelsInClassroom / totalLevelsInClassroom) * 100), 100) 
        : 0;
      
      console.log(`🏫 [Dashboard] Classroom ${classroomId} - ${classroom.name}:`, {
        completedLevels: completedLevelsInClassroom,
        totalLevels: totalLevelsInClassroom,
        progress
      });
      
      return {
        title: classroom.name || `Aula ${classroom.id}`,
        completed: completedLevelsInClassroom,
        total: totalLevelsInClassroom,
        progress: progress,
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
  }, [classrooms, levelsCompletedByClassroom, totalLevelsByClassroom])

  return (
    <div className="min-h-screen relative dashboard-container" style={{ minHeight: '100dvh' }}>
      <div 
        className="fixed inset-0 fixed-background"
        style={{
          backgroundImage: `url("/images/fondo_playa.jpg")`,
          backgroundAttachment: 'fixed',
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat'
        }}
      />

      <div className="relative z-10 flex">
        {!isMobile && <Sidebar />}
        
        <div className={`flex-1 ${isMobile ? 'pb-20 main-content-mobile' : 'pl-64'}`}>
          <div className="p-4 md:p-6">
            <div className="mb-6">
              <div className="relative">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Avatar
                      profileImage={profileImage}
                      uploadedImageUrl={null}
                      isLoading={profileLoading}
                      size={isMobile ? "sm" : "md"}
                      className="border-white border-opacity-50 shadow-lg"
                    />
                  </div>
                  <div className="flex-1 xl2:pr-80">
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
                  currentExp={stats?.experience?.current || 0}
                  totalExp={stats?.experience?.total || 100}
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
              <div className="flex justify-center py-8">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-xl border-2 border-white/20 max-w-md">
                  <div className="text-center mb-6">
                    <div className="text-6xl mb-4">🏫</div>
                    <h3 className="text-white text-2xl font-bold mb-3">
                      Aún no tienes aulas asignadas
                    </h3>
                    <p className="text-white text-base opacity-90 leading-relaxed">
                      Contacta a tu profesor para que te agregue a un aula o únete usando un código de invitación
                    </p>
                  </div>
                  <button
                    onClick={() => navigate('/join-classroom')}
                    className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center space-x-2"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    <span>Unirse a un Aula</span>
                  </button>
                </div>
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