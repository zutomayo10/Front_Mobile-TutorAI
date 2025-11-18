// src/pages/Topics.jsx
import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useDeviceDetection } from '../hooks/useDeviceDetection'
import { useClassroomData } from '../hooks/useClassroomData'
import Sidebar from '../components/Sidebar'
import BottomNavigation from '../components/BottomNavigation'

const Topics = () => {
  const { isMobile } = useDeviceDetection()
  const navigate = useNavigate()
  const location = useLocation()
  const { courses, topics, loadCourses, loadTopics, isLoading, error } = useClassroomData()
  
  // Obtener datos del estado de navegación
  const { classroomId, classroomName } = location.state || {}
  const [selectedCourse, setSelectedCourse] = useState(null)

  useEffect(() => {
    if (!classroomId) {
      navigate('/dashboard')
      return
    }

    loadCourses(classroomId)
  }, [classroomId])

  useEffect(() => {
    if (selectedCourse) {
      loadTopics(classroomId, selectedCourse.courseId)
    }
  }, [selectedCourse, classroomId])

  const handleSelectTopic = (topic, index) => {
    // Extraer topicId y nombre del topic
    const topicId = topic.topicId || topic.id;
    const topicName = topic.name || topic;
    
    if (!topicId) {
      console.error('Topic sin ID:', topic);
      return;
    }
    
    navigate('/levels', {
      state: {
        classroomId,
        courseId: selectedCourse.courseId,
        topicId: topicId,
        topicName: topicName
      }
    })
  }

  const handleBack = () => {
    navigate('/dashboard')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-800">
        <div className="text-white text-xl">Cargando cursos...</div>
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
                {classroomName || 'Aula'}
              </h1>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-500 text-white rounded-lg">
                {error}
              </div>
            )}

            {/* Course Selection */}
            {!selectedCourse && courses.length > 0 && (
              <div>
                <h2 className="text-white text-xl font-bold mb-4 drop-shadow">
                  Selecciona un Curso
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {courses.map((course, index) => (
                    <div
                      key={course.courseId}
                      onClick={() => setSelectedCourse(course)}
                      className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-6 cursor-pointer transform hover:scale-105 transition-all duration-200 hover:bg-opacity-30 border border-white border-opacity-20"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                          {course.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="text-white font-bold text-lg drop-shadow">
                            {course.name}
                          </h3>
                          <p className="text-white text-sm opacity-80">
                            Clic para ver temas
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Topic Selection */}
            {selectedCourse && (
              <div>
                <div className="flex items-center space-x-4 mb-6">
                  <button
                    onClick={() => setSelectedCourse(null)}
                    className="text-white hover:text-yellow-200 transition-colors duration-200"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <h2 className="text-white text-xl font-bold drop-shadow">
                    Temas de {selectedCourse.name}
                  </h2>
                </div>

                {topics.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {topics.map((topic, index) => (
                      <div
                        key={topic.id?.topicNumber || topic.topicNumber || index}
                        onClick={() => handleSelectTopic(topic)}
                        className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-6 cursor-pointer transform hover:scale-105 transition-all duration-200 hover:bg-opacity-30 border border-white border-opacity-20"
                      >
                        <div className="flex items-center space-x-4 mb-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                            {topic.id?.topicNumber || topic.topicNumber || index + 1}
                          </div>
                          <div>
                            <h3 className="text-white font-bold text-lg drop-shadow">
                              {topic.name}
                            </h3>
                            <p className="text-white text-sm opacity-80">
                              Clic para ver niveles
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex justify-end">
                          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-white text-xl mb-4">
                      No hay temas disponibles en este curso
                    </div>
                    <p className="text-white text-sm opacity-80">
                      Contacta a tu profesor para que agregue temas al curso
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* No Courses Available */}
            {courses.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <div className="text-white text-xl mb-4">
                  No hay cursos disponibles en esta aula
                </div>
                <p className="text-white text-sm opacity-80">
                  Contacta a tu profesor para que agregue cursos al aula
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

export default Topics