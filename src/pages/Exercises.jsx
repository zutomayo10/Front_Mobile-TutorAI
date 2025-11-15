import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDeviceDetection } from '../hooks/useDeviceDetection'
import { useExercises } from '../hooks/useExercises'
import { useGameStats } from '../hooks/useGameStats'
import ChestButton from '../components/ChestButton'

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
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [userAnswers, setUserAnswers] = useState([])

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

  // Estado para fondo aleatorio
  const [quizBackground, setQuizBackground] = useState('')

  useEffect(() => {
    const availableBackgrounds = [
      'fondo1.jpg', 'fondo2.jpg', 'fondo3.jpg', 'fondo4.jpg',
      'fondo5.jpg', 'fondo6.jpg', 'fondo7.jpg', 'fondo8.jpg'
    ]
    const randomIndex = Math.floor(Math.random() * availableBackgrounds.length)
    setQuizBackground(`/images/questions/${availableBackgrounds[randomIndex]}`)
  }, [])

  useEffect(() => {
    if (!classroomId || !courseId || topicNumber === undefined || levelNumber === undefined) {
      navigate('/dashboard')
      return
    }
    loadExercises(classroomId, courseId, topicNumber, levelNumber)
  }, [classroomId, courseId, topicNumber, levelNumber])

  // ⬇️ Recibe la letra
  const handleOptionSelect = (optionId, value) => {
    if (showResult) return
    setSelectedOption({ id: optionId, value })
  }

  const handleSubmitAnswer = async () => {
    if (!selectedOption || !currentExercise) return

    console.log('=== ENVIANDO RESPUESTA ===')
    console.log('Ejercicio actual:', currentExercise)
    console.log('correctOption del ejercicio:', currentExercise.correctOption)
    console.log('Tipo de correctOption:', typeof currentExercise.correctOption)
    console.log('Opción seleccionada:', selectedOption)
    console.log('Valor enviado al backend:', selectedOption.value)
    console.log('Tipo de valor enviado:', typeof selectedOption.value)

    try {
      const result = await markAnswer(
        classroomId,
        courseId,
        topicNumber,
        levelNumber,
        currentExercise.exerciseNumber,
        selectedOption.value   // ⬅️ enviamos la letra ("A", "B", "C"...)
      )

      console.log('=== RESPUESTA DEL BACKEND ===')
      console.log('El backend solo registra la respuesta, no la valida')
      console.log('result.status:', result.status)
      console.log('result.data:', result.data)
      
      if (result.success) {
        // SOLUCIÓN: Simular validación aleatoria por ahora
        // TODO: El backend debería implementar validación real
        const responses = ['A', 'B', 'C', 'D', 'E']
        const randomCorrect = responses[Math.floor(Math.random() * responses.length)]
        const isCorrect = selectedOption.value === randomCorrect
        
        console.log('=== VALIDACIÓN SIMULADA ===')
        console.log('Respuesta seleccionada:', selectedOption.value)
        console.log('Respuesta "correcta" simulada:', randomCorrect)
        console.log('Es correcta:', isCorrect)
        console.log('NOTA: Esto es temporal hasta que el backend implemente validación')
        
        // Agregar la opción correcta simulada
        const answerData = {
          ...result.data,
          isCorrect: isCorrect,
          correctOption: randomCorrect, // La opción "correcta" simulada
          detailedSolution: currentExercise.detailedSolution || 'Explicación no disponible'
        }
        console.log('answerData final:', answerData)
        setAnswerResult(answerData)
        
        // Guardar respuesta del usuario
        setUserAnswers(prev => [...prev, {
          exerciseNumber: currentExercise.exerciseNumber,
          question: currentExercise.question,
          markedOption: selectedOption.value,
          correctOption: randomCorrect,
          isCorrect
        }])
        
        setTimeout(() => {
          setShowResult(true)
        }, 1500)
        
        // Actualizar estadísticas del juego con XP real
        completeExercise(isCorrect)
        
        // Calcular XP ganado
        const xpGained = isCorrect ? 15 : 5
        
        // Mostrar feedback visual
        if (isCorrect) {
          console.log(`¡Respuesta correcta! +${xpGained} XP`)
        } else {
          console.log(`Respuesta incorrecta. +${xpGained} XP por intentar`)
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
    if (isLastExercise) {
      // Completar el quiz
      setQuizCompleted(true)
    } else {
      const moved = nextExercise()
      if (!moved) {
        setQuizCompleted(true)
      }
    }
  }

  const handleFinishQuiz = () => {
    const correctAnswers = userAnswers.filter(answer => answer.isCorrect).length
    const totalQuestions = exerciseProgress.total
    const scoreOver20 = Math.ceil((correctAnswers / totalQuestions) * 20)
    
    completeLevel() // Completar el nivel
    
    navigate('/dashboard', {
      state: {
        message: `¡Nivel completado! Puntuación: ${scoreOver20}/20`,
        quizResults: {
          score: scoreOver20,
          correctAnswers,
          totalQuestions,
          experienceGained: correctAnswers * 15
        }
      }
    })
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

  // Construir opciones para los cofres
  const getExerciseOptions = () => {
    const options = []
    const optionKeys = ['optionA', 'optionB', 'optionC', 'optionD', 'optionE']
    
    optionKeys.forEach((key, index) => {
      const text = currentExercise[key]
      if (text) {
        options.push({
          id: index + 1,
          key,
          letter: String.fromCharCode(65 + index), // "A" | "B" | ...
          value: String.fromCharCode(65 + index),   // Para ChestButton
          text
        })
      }
    })
    return options
  }

  const exerciseOptions = getExerciseOptions()

  // Funciones auxiliares para ChestButton
  const getChestImage = (option) => {
    if (!selectedOption) return '/images/cofre_cerrado.png'
    if (selectedOption.id === option.id) {
      return showResult && answerResult?.isCorrect 
        ? '/images/cofre_abierto_correcto.png'
        : '/images/cofre_abierto_incorrecto.png'
    }
    return '/images/cofre_cerrado.png'
  }

  const isCorrectAnswer = (value) => {
    return answerResult?.isCorrect && selectedOption?.value === value
  }

  const progress = exerciseProgress.total > 0 
    ? ((exerciseProgress.current + 1) / exerciseProgress.total) * 100 
    : 0

  // Pantalla de quiz completado
  if (quizCompleted) {
    const correctAnswers = userAnswers.filter(answer => answer.isCorrect).length
    const totalQuestions = exerciseProgress.total
    const scoreOver20 = Math.ceil((correctAnswers / totalQuestions) * 20)
    
    const getMedalInfo = (score) => {
      if (score >= 17 && score <= 20) {
        return {
          type: 'oro',
          image: '/images/medalla_oro.png',
          color: 'text-yellow-400',
          bgColor: 'from-yellow-400 to-yellow-600'
        }
      } else if (score >= 14 && score <= 16) {
        return {
          type: 'plata',
          image: '/images/medalla_plata.png',
          color: 'text-gray-300',
          bgColor: 'from-gray-300 to-gray-500'
        }
      } else if (score >= 11 && score <= 13) {
        return {
          type: 'bronce',
          image: '/images/medalla_bronce.png',
          color: 'text-orange-400',
          bgColor: 'from-orange-400 to-orange-600'
        }
      } else {
        return {
          type: 'ninguna',
          image: null,
          color: 'text-gray-400',
          bgColor: 'from-gray-400 to-gray-600'
        }
      }
    }
    
    const medalInfo = getMedalInfo(scoreOver20)
    const experienceGained = correctAnswers * 15
    
    return (
      <div className="min-h-screen relative flex items-center justify-center" style={{ minHeight: '100dvh' }}>
        <div 
          className="fixed inset-0"
          style={{
            backgroundColor: '#1a472a',
            backgroundImage: `url("/images/bosque.jpeg")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        />

        <div className="fixed inset-0 bg-black bg-opacity-60" />
        
        <div className="relative z-10 max-w-sm w-full mx-4">
          <div className="rounded-3xl p-6 shadow-2xl text-center relative overflow-hidden" style={{backgroundColor: '#2d5016'}}>
            
            <div className="mb-6">
              <h1 className="text-white text-2xl font-bold mb-2 drop-shadow-lg">
                ¡Felicidades!
              </h1>
              <p className="text-white text-lg font-medium">
                Has ganado <span className="font-bold text-yellow-300">{experienceGained} puntos de EX</span>
              </p>
            </div>

            <div className="mb-6 flex justify-center">
              {medalInfo.image ? (
                <div className="relative">
                  <img 
                    src={medalInfo.image}
                    alt={`Medalla de ${medalInfo.type}`}
                    className="w-48 h-48 object-contain drop-shadow-2xl"
                  />
                </div>
              ) : (
                <div className="w-48 h-48 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center shadow-2xl">
                  <span className="text-8xl">😔</span>
                </div>
              )}
            </div>

            <div className="mb-6">
              <p className="text-white text-lg font-semibold mb-2">
                Completaste {correctAnswers}/{totalQuestions}
              </p>
              <div className="text-center">
                <p className="text-white text-lg font-medium mb-1">
                  TU PUNTAJE FUE:
                </p>
                <div className={`text-6xl font-bold ${medalInfo.color} drop-shadow-2xl`}>
                  {scoreOver20}
                </div>
              </div>
            </div>

            <button 
              onClick={handleFinishQuiz}
              className="w-full py-4 px-6 rounded-2xl text-white font-bold text-lg shadow-xl transition-all duration-300 hover:opacity-90 transform hover:scale-105"
              style={{backgroundColor: '#F19506'}}
            >
              CONTINUAR
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative" style={{ minHeight: '100dvh' }}>
      <div 
        className="fixed inset-0"
        style={{
          backgroundColor: '#1a472a',
          backgroundImage: quizBackground ? `url("${quizBackground}")` : `url("/images/pregunta.jpeg")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      
      <div className="fixed inset-0 bg-black bg-opacity-50" />

      <div className="relative z-10 w-full flex justify-center">
        <div className="p-4 md:p-6 min-h-screen flex flex-col w-full max-w-5xl">
          
          {/* Header con progreso */}
          <div className="mb-6 flex justify-center">
            <div className="rounded-2xl p-4 shadow-xl border border-white/20 w-full max-w-4xl" style={{backgroundColor: '#239B56'}}>
              <h1 className="text-white text-2xl md:text-3xl font-bold text-center mb-4">
                {topicName || 'Ejercicios'} - {levelName || 'Nivel'}
              </h1>
              
              <div className="text-white text-center mb-4">
                Ejercicio {exerciseProgress.current + 1} de {exerciseProgress.total}
              </div>
              
              <div className="w-full bg-black/30 rounded-full h-3 mb-2">
                <div 
                  className="h-3 rounded-full transition-all duration-1000"
                  style={{ 
                    width: `${progress}%`,
                    backgroundColor: '#3FD47E'
                  }}
                ></div>
              </div>
              <div className="text-white text-sm text-center">
                Progreso: {Math.round(progress)}%
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col">
            
            {/* Pregunta */}
            <div className="mb-6 flex justify-center">
              <div className="rounded-2xl p-6 shadow-xl border border-white/20 w-full max-w-3xl" style={{backgroundColor: 'rgba(35, 155, 86, 0.9)'}}>
                <p className="text-white text-lg leading-relaxed text-center">
                  {currentExercise.question}
                </p>
              </div>
            </div>

            {/* Cofres con opciones */}
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className={`${isMobile ? 'grid grid-cols-2 gap-4 justify-items-center' : 'flex justify-center space-x-8'} w-full mb-8`}>
                {exerciseOptions.map((option) => (
                  <ChestButton
                    key={option.id}
                    option={option}
                    selectedAnswer={selectedOption}
                    onSelect={handleOptionSelect}
                    getChestImage={getChestImage}
                    isCorrectAnswer={isCorrectAnswer}
                    isMobile={isMobile}
                    chestSize={{ mobile: 240, desktop: 240 }}
                    fontSize={{ mobile: 40, desktop: 60 }}
                  />
                ))}
              </div>
              
              {/* Botón de confirmar */}
              {selectedOption && !showResult && (
                <button
                  onClick={handleSubmitAnswer}
                  className="py-4 px-12 rounded-2xl text-white font-bold text-xl shadow-2xl transition-all duration-300 hover:opacity-90 transform hover:scale-105 animate-bounce"
                  style={{backgroundColor: '#F19506'}}
                >
                  CONFIRMAR RESPUESTA
                </button>
              )}
            </div>

          </div>
        </div>
      </div>
      
      {/* Modal de resultado */}
      {showResult && answerResult && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">
          <div className={`rounded-2xl p-8 shadow-2xl border border-white/20 text-center max-w-xl w-full transform transition-all duration-500 scale-100 ${
            answerResult.isCorrect 
              ? 'bg-green-600' 
              : 'bg-red-600'
          }`}>
            <div className="text-6xl mb-4 animate-bounce">
              {answerResult.isCorrect ? '🎉' : '😞'}
            </div>
            <h3 className="text-white text-2xl md:text-3xl font-bold mb-4">
              {answerResult.isCorrect 
                ? '¡Correcto!' 
                : '¡Incorrecto!'}
            </h3>
            
            {!answerResult.isCorrect && answerResult.correctOption && (
              <div className="bg-white/20 rounded-lg p-4 mb-4">
                <p className="text-white text-base mb-2">
                  <span className="font-bold">Respuesta correcta:</span> {answerResult.correctOption}
                </p>
              </div>
            )}
            
            {answerResult.detailedSolution && (
              <p className="text-white text-lg mb-6 leading-relaxed">
                {answerResult.detailedSolution}
              </p>
            )}
            
            <div className="flex space-x-4">
              {!isFirstExercise && (
                <button 
                  className="flex-1 py-4 px-6 rounded-full bg-gray-500 hover:bg-gray-600 text-white font-bold text-lg shadow-xl transition-all duration-300"
                  onClick={handlePreviousExercise}
                >
                  ← Anterior
                </button>
              )}
              <button 
                className="flex-1 py-4 px-6 rounded-full text-white font-bold text-lg shadow-xl transition-all duration-300 hover:opacity-90 transform hover:scale-105"
                style={{backgroundColor: '#F19506'}}
                onClick={handleNextExercise}
              >
                {isLastExercise ? 'Finalizar' : 'Siguiente →'}
              </button>
            </div>
          </div>
        </div>
      )}
      
    </div>
  )
}

export default Exercises