import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDeviceDetection } from '../hooks/useDeviceDetection'
import ChestButton from '../components/ChestButton'

const Question = () => {
  const { isMobile } = useDeviceDetection()
  const location = useLocation()
  const navigate = useNavigate()
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState([])
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [showIntro, setShowIntro] = useState(true)
  const [countdown, setCountdown] = useState(3)

  const exerciseTitle = location.state?.exerciseTitle || 'Multiplicación'
  const exerciseId = location.state?.exerciseId || 3

  // Estados para el sistema de pistas
  const [consecutiveErrors, setConsecutiveErrors] = useState(0)
  const [showHintButton, setShowHintButton] = useState(false)
  const [showHintModal, setShowHintModal] = useState(false)

  const questions = [
    {
      id: 1,
      title: "Pregunta 1 - Sumas y Restas",
      problem: "Joaquín tiene 5 monedas en su mano, su amigo José luego le regala 2 monedas. Pero cuando Joaquín está de regreso a su casa se le caen 3 monedas del bolsillo.",
      question: "¿Cuántas monedas tiene Joaquín al final?",
      correctAnswer: 4,
      explanation: "5 + 2 - 3 = 4 monedas",
      hint: "💡 Pista: Primero suma las monedas que recibe (5 + 2), luego resta las que se le caen. ¿Cuántas le quedan?",
      options: [
        { id: 1, value: 5 },
        { id: 2, value: 4 },
        { id: 3, value: 3 },
        { id: 4, value: 2 }
      ]
    },
    {
      id: 2,
      title: "Pregunta 2 - Multiplicación",
      problem: "María tiene 3 cajas y cada caja contiene 4 chocolates. Luego compra 2 chocolates más sueltos.",
      question: "¿Cuántos chocolates tiene María en total?",
      correctAnswer: 14,
      explanation: "(3 × 4) + 2 = 12 + 2 = 14 chocolates",
      hint: "💡 Pista: Multiplica el número de cajas por los chocolates por caja (3 × 4), luego suma los chocolates sueltos.",
      options: [
        { id: 1, value: 12 },
        { id: 2, value: 14 },
        { id: 3, value: 16 },
        { id: 4, value: 10 }
      ]
    },
    {
      id: 3,
      title: "Pregunta 3 - Multiplicación",
      problem: "En un salón de clases hay 6 filas de pupitres y cada fila tiene 7 pupitres.",
      question: "¿Cuántos pupitres hay en total en el salón?",
      correctAnswer: 42,
      explanation: "6 × 7 = 42 pupitres",
      hint: "💡 Pista: Multiplica el número de filas (6) por la cantidad de pupitres en cada fila (7). ¿Cuántos pupitres hay en total?",
      options: [
        { id: 1, value: 40 },
        { id: 2, value: 42 },
        { id: 3, value: 45 },
        { id: 4, value: 38 }
      ]
    },
    {
      id: 4,
      title: "Pregunta 4 - Multiplicación",
      problem: "Ana compra 4 paquetes de stickers. Cada paquete contiene 8 stickers. Al llegar a casa regala 5 stickers a su hermana.",
      question: "¿Cuántos stickers le quedan a Ana?",
      correctAnswer: 27,
      explanation: "(4 × 8) - 5 = 32 - 5 = 27 stickers",
      hint: "💡 Pista: Primero calcula cuántos stickers tiene en total (4 × 8), luego resta los que regala (5). ¿Cuántos le quedan?",
      options: [
        { id: 1, value: 25 },
        { id: 2, value: 27 },
        { id: 3, value: 30 },
        { id: 4, value: 32 }
      ]
    },
    {
      id: 5,
      title: "Pregunta 5 - Multiplicación",
      problem: "En una granja hay 5 corrales. En cada corral hay 9 conejos. Después llegan 3 conejos más a la granja.",
      question: "¿Cuántos conejos hay en total en la granja?",
      correctAnswer: 48,
      explanation: "(5 × 9) + 3 = 45 + 3 = 48 conejos",
      hint: "💡 Pista: Multiplica los corrales por los conejos en cada uno (5 × 9), luego suma los 3 conejos que llegan después.",
      options: [
        { id: 1, value: 45 },
        { id: 2, value: 47 },
        { id: 3, value: 48 },
        { id: 4, value: 50 }
      ]
    }
  ]

  const currentQuestion = questions[currentQuestionIndex]
  const totalQuestions = questions.length
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault()
      e.returnValue = ''
    }

    const handlePopState = (e) => {
      e.preventDefault()
      window.history.pushState(null, '', window.location.pathname)
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    window.addEventListener('popstate', handlePopState)
    
    window.history.pushState(null, '', window.location.pathname)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      window.removeEventListener('popstate', handlePopState)
    }
  }, [])

  useEffect(() => {
    if (!showIntro) return

    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval)
          setShowIntro(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(countdownInterval)
  }, [showIntro])

  const handleAnswerSelect = (optionId, value) => {
    setSelectedAnswer({ id: optionId, value })
    
    const answer = {
      questionId: currentQuestion.id,
      selectedValue: value,
      correctAnswer: currentQuestion.correctAnswer,
      isCorrect: value === currentQuestion.correctAnswer
    }
    
    setUserAnswers(prev => [...prev, answer])
    
    // Sistema de seguimiento de errores consecutivos
    if (!answer.isCorrect) {
      setConsecutiveErrors(prev => prev + 1)
    } else {
      setConsecutiveErrors(0) // Reinicia el contador si responde correctamente
    }
    
    setTimeout(() => {
      setShowResult(true)
    }, 1500)
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
      setSelectedAnswer(null)
      setShowResult(false)
      
      // Mostrar botón de pista si ha fallado 2 veces consecutivas
      if (consecutiveErrors >= 2) {
        setShowHintButton(true)
      }
    } else {
      setQuizCompleted(true)
    }
  }

  const handleFinishQuiz = () => {
    const correctAnswers = userAnswers.filter(answer => answer.isCorrect).length
    const scoreOver20 = Math.ceil((correctAnswers / totalQuestions) * 20)
    
    navigate('/exercises', {
      state: {
        completedExercise: exerciseId,
        quizResults: {
          score: scoreOver20,
          correctAnswers,
          totalQuestions,
          answers: userAnswers,
          experienceGained: 100
        },
        message: `¡Quiz completado! Puntuación: ${scoreOver20}/20`
      }
    })
  }

  const handleShowHint = () => {
    setShowHintModal(true)
  }

  const handleCloseHint = () => {
    setShowHintModal(false)
  }

  const isCorrectAnswer = (value) => {
    return value === currentQuestion.correctAnswer
  }

  const getChestImage = (option) => {
    if (!selectedAnswer || selectedAnswer.id !== option.id) {
      return "/images/cofre_cerrado.png"
    }
    
    return isCorrectAnswer(option.value) 
      ? "/images/cofre_tesoro.png" 
      : "/images/cofre_vacio.png"
  }

  if (quizCompleted) {
    const correctAnswers = userAnswers.filter(answer => answer.isCorrect).length
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
                Has ganado <span className="font-bold text-yellow-300">100 puntos de EX</span>
              </p>
            </div>

            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                  15
                </div>
                <div className="flex-1 mx-3">
                  <div className="w-full bg-gray-600 rounded-full h-3 shadow-inner">
                    <div 
                      className="bg-gradient-to-r from-green-400 to-green-500 h-3 rounded-full transition-all duration-1000 shadow-lg"
                      style={{ width: '80%' }}
                    ></div>
                  </div>
                </div>
                <div className="w-10 h-10 bg-gray-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                  16
                </div>
              </div>
            </div>

            <div className="mb-6 flex justify-center">
              {medalInfo.image ? (
                <div className="relative">
                  <img 
                    src={medalInfo.image}
                    alt={`Medalla de ${medalInfo.type}`}
                    className="w-120 h-120 object-contain drop-shadow-2xl"
                  />
                </div>
              ) : (
                <div className="w-56 h-56 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center shadow-2xl">
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

  if (showIntro) {
    return (
      <div className="min-h-screen relative flex items-center justify-center" style={{ minHeight: '100dvh' }}>
        <div 
          className="fixed inset-0"
          style={{
            backgroundColor: '#1a472a',
            backgroundImage: `url("/images/pregunta.jpeg")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        />
        
        <div className="fixed inset-0 bg-black bg-opacity-60" />
        
        <div className="relative z-10 w-full px-4">
          <div className={`${isMobile ? 'flex flex-col items-center space-y-6' : 'flex flex-col items-center justify-center space-y-8 max-w-4xl mx-auto'} w-full`}>
            
            <div className={`animate-fade-in-down ${isMobile ? 'text-center' : 'text-center'}`}>
              <h1 className={`text-white font-bold drop-shadow-2xl animate-pulse ${isMobile ? 'text-3xl mb-2' : 'text-5xl lg:text-6xl mb-4'}`}>
                Quiz de {exerciseTitle} 🎯
              </h1>
              <p className={`text-white font-semibold drop-shadow-lg ${isMobile ? 'text-lg' : 'text-2xl lg:text-3xl'}`}>
                ¡Prepárate para el desafío!
              </p>
            </div>

            <div className={`${isMobile ? 'text-center' : 'text-center'}`}>
              <div className={`text-white mb-4 font-medium ${isMobile ? 'text-base' : 'text-xl lg:text-2xl'}`}>Comenzando en...</div>
              <div className={`text-white font-bold animate-ping ${isMobile ? 'text-3xl' : 'text-6xl lg:text-7xl'}`}>
                {countdown}
              </div>
            </div>

            <div className={`bg-black/30 rounded-full h-3 border border-white/20 ${isMobile ? 'w-full max-w-xs' : 'w-full max-w-lg'}`}>
              <div 
                className="bg-gradient-to-r from-yellow-400 to-orange-500 h-3 rounded-full transition-all duration-1000 ease-out shadow-lg"
                style={{ 
                  width: `${((3 - countdown) / 3) * 100}%`
                }}
              ></div>
            </div>

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
          backgroundImage: `url("/images/pregunta.jpeg")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      
      <div className="fixed inset-0 bg-black bg-opacity-50" />

      <div className="relative z-10 w-full flex justify-center">
        <div className="p-4 md:p-6 min-h-screen flex flex-col w-full max-w-5xl">
          
          <div className="mb-6 flex justify-center">
            <div className="rounded-2xl p-4 shadow-xl border border-white/20 w-full max-w-4xl" style={{backgroundColor: '#239B56'}}>
              <h1 className="text-white text-2xl md:text-3xl font-bold text-center mb-4">
                {currentQuestion.title}
              </h1>
              
              <div className="text-white text-center mb-4">
                Pregunta {currentQuestionIndex + 1} de {totalQuestions}
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
            
            <div className="mb-6 flex justify-center">
              <div className="rounded-2xl p-6 shadow-xl border border-white/20 w-full max-w-3xl" style={{backgroundColor: 'rgba(35, 155, 86, 0.9)'}}>
                <p className="text-white text-lg leading-relaxed text-center">
                  {currentQuestion.problem} <span className="font-bold">{currentQuestion.question}</span>
                </p>
              </div>
            </div>

            {/* Botón de pista */}
            {showHintButton && (
              <div className="mb-4 flex justify-center">
                <button
                  onClick={handleShowHint}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
                >
                  <span>💡</span>
                  <span>Ver Pista</span>
                </button>
              </div>
            )}

            <div className="flex-1 flex items-center justify-center">
              <div className={`${isMobile ? 'grid grid-cols-2 gap-4 justify-items-center' : 'flex justify-center space-x-8'} w-full`}>
                {currentQuestion.options.map((option) => (
                  <ChestButton
                    key={option.id}
                    option={option}
                    selectedAnswer={selectedAnswer}
                    onSelect={handleAnswerSelect}
                    getChestImage={getChestImage}
                    isCorrectAnswer={isCorrectAnswer}
                    isMobile={isMobile}
                    chestSize={{ mobile: 240, desktop: 240 }}
                    fontSize={{ mobile: 40, desktop: 60 }}
                  />
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
      
      {showResult && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">
          <div className={`rounded-2xl p-8 shadow-2xl border border-white/20 text-center max-w-xl w-full transform transition-all duration-500 scale-100 ${
            isCorrectAnswer(selectedAnswer.value) 
              ? 'bg-green-600' 
              : 'bg-red-600'
          }`}>
            <div className="text-6xl mb-4 animate-bounce">
              {isCorrectAnswer(selectedAnswer.value) ? '🎉' : '😞'}
            </div>
            <h3 className="text-white text-2xl md:text-3xl font-bold mb-4">
              {isCorrectAnswer(selectedAnswer.value) 
                ? '¡Correcto!' 
                : '¡Incorrecto!'}
            </h3>
            <p className="text-white text-lg mb-6 leading-relaxed">
              {currentQuestion.explanation}
            </p>
            
            <button 
              className="w-full py-4 px-6 rounded-full text-white font-bold text-lg shadow-xl transition-all duration-300 hover:opacity-90 transform hover:scale-105"
              style={{backgroundColor: '#F19506'}}
              onClick={handleNextQuestion}
            >
              {currentQuestionIndex < totalQuestions - 1 ? 'Siguiente Pregunta →' : 'Ver Resultados'}
            </button>
          </div>
        </div>
      )}

      {/* Modal de pista */}
      {showHintModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 shadow-2xl border border-gray-200 text-center max-w-md w-full transform transition-all duration-500 scale-100">
            <div className="text-4xl mb-4">💡</div>
            <h3 className="text-gray-800 text-xl font-bold mb-4">
              Pista para ayudarte
            </h3>
            <p className="text-gray-600 text-base mb-6 leading-relaxed">
              {currentQuestion.hint}
            </p>
            
            <button 
              className="w-full py-3 px-6 rounded-full bg-blue-500 hover:bg-blue-600 text-white font-bold text-lg shadow-xl transition-all duration-300 hover:opacity-90 transform hover:scale-105"
              onClick={handleCloseHint}
            >
              Entendido
            </button>
          </div>
        </div>
      )}
      
    </div>
  )
}

export default Question