import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDeviceDetection } from '../hooks/useDeviceDetection'
import { useExercises } from '../hooks/useExercises'
import { useGameStats } from '../hooks/useGameStats'
import BottomNavigation from '../components/BottomNavigation'
import Sidebar from '../components/Sidebar'

const Exercises = () => {
  const { isMobile } = useDeviceDetection()
  const navigate = useNavigate()
  const location = useLocation()
  const { completeExercise, completeLevel } = useGameStats()
  
  // Datos desde la navegación
  const { 
    classroomId, 
    courseId, 
    topicNumber, 
    topicName,
    levelNumber, 
    levelName 
  } = location.state || {}

  const {
    exercises,
    currentExercise,
    exerciseProgress,
    loadExercises,
    markAnswer,
    nextExercise,
    previousExercise,
    isLoading,
    error,
    isFirstExercise,
    isLastExercise,
    progressPercentage
  } = useExercises()

  // ⬇️ Ahora guarda solo la letra: "A" | "B" | "C" | "D" | "E"
  const [selectedOption, setSelectedOption] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const [answerResult, setAnswerResult] = useState(null)

  // Efecto para verificar si el ejercicio actual ya fue respondido
  useEffect(() => {
    if (currentExercise && exerciseProgress.answers) {
      const exerciseAnswer = exerciseProgress.answers[currentExercise.exerciseNumber]
      
      if (exerciseAnswer) {
        // Este ejercicio ya fue respondido, mostrar el estado bloqueado
        setSelectedOption(exerciseAnswer.markedOption)
        setShowResult(true)
        setAnswerResult({
          isCorrect: exerciseAnswer.isCorrect,
          markedOption: exerciseAnswer.markedOption
        })
      } else {
        // Ejercicio nuevo, resetear estado
        setSelectedOption(null)
        setShowResult(false)
        setAnswerResult(null)
      }
    }
  }, [currentExercise, exerciseProgress.answers])

  useEffect(() => {
    if (!classroomId || !courseId || topicNumber === undefined || levelNumber === undefined) {
      navigate('/dashboard')
      return
    }
    loadExercises(classroomId, courseId, topicNumber, levelNumber)
  }, [classroomId, courseId, topicNumber, levelNumber])

  // ⬇️ Recibe la letra
  const handleOptionSelect = (letter) => {
    if (showResult) return
    setSelectedOption(letter)
  }

  const handleSubmitAnswer = async () => {
    if (!selectedOption || !currentExercise) return

    try {
      const result = await markAnswer(
        classroomId,
        courseId,
        topicNumber,
        levelNumber,
        currentExercise.exerciseNumber,
        selectedOption   // ⬅️ enviamos la letra ("A", "B", "C"...)
      )

      if (result.success) {
        setAnswerResult(result.data)
        setShowResult(true)
        
        // Actualizar estadísticas del juego
        const isCorrect = result.data?.isCorrect || false
        completeExercise(isCorrect)
        
        // Mostrar feedback visual
        if (isCorrect) {
          console.log('¡Respuesta correcta! +15 XP')
        } else {
          console.log('Respuesta incorrecta. +5 XP por intentar')
        }
      } else {
        alert('Error al enviar la respuesta: ' + result.error)
      }
    } catch (err) {
      console.error('Error al enviar respuesta:', err)
      alert('Error de conexión al enviar la respuesta')
    }
  }

  const handleNextExercise = () => {
    const moved = nextExercise()
    if (moved) {
      // No resetear estado aquí - el useEffect se encarga de manejar el estado según si el ejercicio fue respondido
    } else {
      alert('¡Felicidades! Has completado todos los ejercicios de este nivel.')
      navigate('/dashboard')
    }
  }

  const handlePreviousExercise = () => {
    const moved = previousExercise()
    if (moved) {
      // No resetear estado aquí - el useEffect se encarga de manejar el estado según si el ejercicio fue respondido
    }
  }

  const handleBack = () => {
    navigate('/levels', {
      state: {
        classroomId,
        courseId,
        topicNumber,
        topicName
      }
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-800">
        <div className="text-white text-xl">Cargando ejercicios...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-800">
        <div className="text-center">
          <div className="text-white text-xl mb-4">Error: {error}</div>
          <button
            onClick={handleBack}
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded"
          >
            Volver a Niveles
          </button>
        </div>
      </div>
    )
  }

  if (!currentExercise) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-800">
        <div className="text-center">
          <div className="text-white text-xl mb-4">No hay ejercicios disponibles</div>
          <button
            onClick={handleBack}
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded"
          >
            Volver a Niveles
          </button>
        </div>
      </div>
    )
  }

  // Construir opciones: mantenemos key para leer el texto, pero la selección usa la letra
  const getExerciseOptions = () => {
    const options = []
    const optionKeys = ['optionA', 'optionB', 'optionC', 'optionD', 'optionE']
    
    optionKeys.forEach((key, index) => {
      const text = currentExercise[key]
      if (text) {
        options.push({
          key,                               // optionA | optionB | ...
          letter: String.fromCharCode(65 + index), // "A" | "B" | ...
          text
        })
      }
    })
    return options
  }

  const exerciseOptions = getExerciseOptions()

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
                <span>Volver a Niveles</span>
              </button>
              
              <h1 className="text-white text-2xl font-bold drop-shadow-lg mb-2">
                {topicName} - {levelName}
              </h1>
              
              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-white text-sm mb-2">
                  <span>Progreso: {exerciseProgress.current + 1} de {exerciseProgress.total}</span>
                  <span>{progressPercentage}%</span>
                </div>
                <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Exercise Card */}
            <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-xl p-6 mb-6 shadow-xl">
              <div className="mb-6">
                <h2 className="text-gray-800 text-lg font-bold mb-4">
                  Ejercicio {currentExercise.exerciseNumber}
                </h2>
                <div className="text-gray-700 text-base leading-relaxed">
                  {currentExercise.question}
                </div>
              </div>

              {/* Options */}
              <div className="space-y-3 mb-6">
                {exerciseOptions.map((option) => (
                  <button
                    key={option.key}
                    onClick={() => handleOptionSelect(option.letter)}
                    disabled={showResult}
                    className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                      selectedOption === option.letter
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    } ${showResult ? 'cursor-not-allowed' : 'cursor-pointer hover:shadow-md'}`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold ${
                        selectedOption === option.letter
                          ? 'border-orange-500 bg-orange-500 text-white'
                          : 'border-gray-300 text-gray-600'
                      }`}>
                        {option.letter}
                      </div>
                      <span className="text-gray-700">{option.text}</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Result Message */}
              {showResult && answerResult && (
                <div className={`p-4 rounded-lg mb-6 ${
                  answerResult.isCorrect 
                    ? 'bg-green-100 border border-green-300' 
                    : 'bg-red-100 border border-red-300'
                }`}>
                  <div className={`font-bold ${
                    answerResult.isCorrect ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {answerResult.isCorrect ? '¡Correcto!' : 'Incorrecto'}
                  </div>
                  {answerResult.explanation && (
                    <div className={`mt-2 text-sm ${
                      answerResult.isCorrect ? 'text-green-700' : 'text-red-700'
                    }`}>
                      {answerResult.explanation}
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-between">
                <button
                  onClick={handlePreviousExercise}
                  disabled={isFirstExercise}
                  className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  Anterior
                </button>

                {!showResult ? (
                  <button
                    onClick={handleSubmitAnswer}
                    disabled={!selectedOption || isLoading}
                    className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    {isLoading ? 'Enviando...' : 'Enviar Respuesta'}
                  </button>
                ) : (
                  <button
                    onClick={handleNextExercise}
                    className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-200"
                  >
                    {isLastExercise ? 'Finalizar' : 'Siguiente'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {isMobile && <BottomNavigation />}
    </div>
  )
}

export default Exercises