// src/pages/JoinClassroom.jsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useClassroomData } from '../hooks/useClassroomData'
import { useDeviceDetection } from '../hooks/useDeviceDetection'

const JoinClassroom = () => {
  const { isMobile } = useDeviceDetection()
  const { joinClassroom, isLoading } = useClassroomData()
  const navigate = useNavigate()
  const [classroomId, setClassroomId] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!classroomId.trim()) {
      setError('Por favor ingresa el ID del aula')
      return
    }

    try {
      const result = await joinClassroom(classroomId.trim())
      
      if (result.success) {
        setSuccess('Te has unido al aula exitosamente')
        setTimeout(() => {
          navigate('/dashboard')
        }, 2000)
      } else {
        setError(result.error || 'Error al unirse al aula')
      }
    } catch (err) {
      setError('Error de conexión. Verifica tu conexión a internet.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
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

      <div className="relative z-10 w-full max-w-sm mx-4">
        <div className="text-center mb-8">
          <h1 className="text-white text-4xl font-bold leading-tight mb-4">
            Unirse a<br />un Aula
          </h1>
          <p className="text-white text-lg opacity-90 leading-relaxed px-2">
            Ingresa el ID del aula que te proporcionó tu profesor
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500 text-white rounded-lg text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-500 text-white rounded-lg text-sm">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              ID del Aula:
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                value={classroomId}
                onChange={(e) => setClassroomId(e.target.value)}
                placeholder="Ej: 12345"
                className="w-full pl-10 pr-4 py-3 bg-white rounded-lg border border-gray-200 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-base"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-lg text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 mt-6 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? 'UNIÉNDOSE...' : 'UNIRSE AL AULA'}
          </button>

          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="w-full bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg text-base transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Volver al Dashboard
          </button>
        </form>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-green-900 to-transparent opacity-30 pointer-events-none"></div>
    </div>
  )
}

export default JoinClassroom