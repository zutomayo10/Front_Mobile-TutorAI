import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDeviceDetection } from '../hooks/useDeviceDetection'

const Question = () => {
  const { isMobile } = useDeviceDetection()
  const location = useLocation()
  const navigate = useNavigate()
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState([])
  const [quizCompleted, setQuizCompleted] = useState(false)

  const exerciseTitle = location.state?.exerciseTitle || 'Multiplicación'
  const exerciseId = location.state?.exerciseId || 3

  const questions = [
    {
      id: 1,
      title: "Pregunta 1 - Sumas y Restas",
      problem: "Joaquín tiene 5 monedas en su mano, su amigo José luego le regala 2 monedas. Pero cuando Joaquín está de regreso a su casa se le caen 3 monedas del bolsillo.",
      question: "¿Cuántas monedas tiene Joaquín al final?",
      correctAnswer: 4,
      explanation: "5 + 2 - 3 = 4 monedas",
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
      options: [
        { id: 1, value: 12 },
        { id: 2, value: 14 },
        { id: 3, value: 16 },
        { id: 4, value: 10 }
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

  const handleAnswerSelect = (optionId, value) => {
    setSelectedAnswer({ id: optionId, value })
    
    const answer = {
      questionId: currentQuestion.id,
      selectedValue: value,
      correctAnswer: currentQuestion.correctAnswer,
      isCorrect: value === currentQuestion.correctAnswer
    }
    
    setUserAnswers(prev => [...prev, answer])
    
    setTimeout(() => {
      setShowResult(true)
    }, 1500)
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
      setSelectedAnswer(null)
      setShowResult(false)
    } else {
      setQuizCompleted(true)
    }
  }

  const handleFinishQuiz = () => {
    const correctAnswers = userAnswers.filter(answer => answer.isCorrect).length
    const score = Math.round((correctAnswers / totalQuestions) * 100)
    
    navigate('/exercises', {
      state: {
        completedExercise: exerciseId,
        quizResults: {
          score,
          correctAnswers,
          totalQuestions,
          answers: userAnswers
        },
        message: `¡Quiz completado! Puntuación: ${score}%`
      }
    })
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

  const getChestStyle = (option) => {
    if (!selectedAnswer) return {}
    
    if (selectedAnswer.id === option.id) {
      return isCorrectAnswer(option.value) 
        ? { transform: 'scale(1.1)' }
        : { transform: 'scale(1.1)' }
    }
    
    return { opacity: 0.6 }
  }

  if (quizCompleted) {
    const correctAnswers = userAnswers.filter(answer => answer.isCorrect).length
    const score = Math.round((correctAnswers / totalQuestions) * 100)
    
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
        
        <div className="fixed inset-0 bg-black bg-opacity-70" />
        
        <div className="relative z-10 max-w-md w-full mx-4">
          <div className="rounded-2xl p-8 shadow-2xl border border-white/20 text-center" style={{backgroundColor: '#239B56'}}>
            <div className="text-6xl mb-4">
              {score >= 70 ? '🎉' : score >= 50 ? '😊' : '😔'}
            </div>
            <h1 className="text-white text-3xl font-bold mb-4">
              ¡Quiz Completado!
            </h1>
            <div className="text-white text-xl mb-6">
              <div className="mb-2">Puntuación: <span className="font-bold text-yellow-300">{score}%</span></div>
              <div>Respuestas correctas: <span className="font-bold">{correctAnswers}/{totalQuestions}</span></div>
            </div>
            
            <div className="mb-6 space-y-2">
              {userAnswers.map((answer, index) => (
                <div key={index} className="flex items-center justify-between text-sm text-white bg-black/20 rounded-lg p-2">
                  <span>Pregunta {index + 1}</span>
                  <span className={answer.isCorrect ? 'text-green-300' : 'text-red-300'}>
                    {answer.isCorrect ? '✓ Correcto' : '✗ Incorrecto'}
                  </span>
                </div>
              ))}
            </div>
            
            <button 
              onClick={handleFinishQuiz}
              className="w-full py-3 px-6 rounded-full text-white font-bold shadow-xl transition-all duration-300 hover:opacity-90"
              style={{backgroundColor: '#F19506'}}
            >
              Finalizar y Volver
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
          backgroundImage: `url("/images/pregunta.jpeg")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      
      <div className="fixed inset-0 bg-black bg-opacity-50" />

      <div className="relative z-10 w-full">
        <div className="p-4 md:p-6 min-h-screen flex flex-col">
          
          <div className="mb-6">
            <div className="rounded-2xl p-4 shadow-xl border border-white/20" style={{backgroundColor: '#239B56'}}>
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
            
            <div className="mb-6">
              <div className="rounded-2xl p-6 shadow-xl border border-white/20" style={{backgroundColor: 'rgba(35, 155, 86, 0.9)'}}>
                <p className="text-white text-lg leading-relaxed text-center">
                  {currentQuestion.problem} <span className="font-bold">{currentQuestion.question}</span>
                </p>
              </div>
            </div>

            <div className="flex-1 flex items-center justify-center">
              <div className={`${isMobile ? 'grid grid-cols-2 gap-6 max-w-lg' : 'flex justify-center space-x-8'} w-full`}>
                {currentQuestion.options.map((option) => (
                  <div
                    key={option.id}
                    onClick={() => !selectedAnswer && handleAnswerSelect(option.id, option.value)}
                    className={`relative cursor-pointer transform transition-all duration-300 ${
                      !selectedAnswer ? 'hover:scale-110' : ''
                    }`}
                    style={getChestStyle(option)}
                  >
                    <div className="relative flex items-center justify-center">
                      <img 
                        src={getChestImage(option)}
                        alt="Cofre"
                        className={`object-contain drop-shadow-2xl transition-all duration-500 ${
                          isMobile ? 'w-40 h-40' : 'w-64 h-64'
                        }`}
                      />
                      
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <span className={`font-bold text-white drop-shadow-2xl transition-all duration-300 ${
                          isMobile ? 'text-5xl' : 'text-7xl'
                        }`} style={{textShadow: '2px 2px 4px rgba(0,0,0,0.8)'}}>
                          {option.value}
                        </span>
                      </div>
                      
                      {selectedAnswer?.id === option.id && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          {isCorrectAnswer(option.value) ? (
                            <div className="absolute inset-0 animate-pulse">
                              <div className="absolute inset-0 bg-green-400 opacity-20 rounded-full"></div>
                              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 text-4xl animate-bounce">✨</div>
                              <div className="absolute top-1/4 right-0 text-3xl animate-pulse delay-100">🎉</div>
                              <div className="absolute top-1/4 left-0 text-3xl animate-pulse delay-200">⭐</div>
                            </div>
                          ) : (
                            <div className="absolute inset-0 animate-pulse">
                              <div className="absolute inset-0 bg-red-400 opacity-20 rounded-full"></div>
                              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 text-4xl animate-bounce">😞</div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
      
      {showResult && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">
          <div className={`rounded-2xl p-8 shadow-2xl border border-white/20 text-center max-w-md w-full transform transition-all duration-500 scale-100 ${
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
      
    </div>
  )
}

export default Question