import React, { useEffect, useState, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDeviceDetection } from '../hooks/useDeviceDetection'
import { useExercises } from '../hooks/useExercises'
import { useGameStats } from '../hooks/useGameStats'
import { useAuth } from '../contexts/AuthContext'
import { studentGetLevelRunResult } from '../services/api'
import ChestButton from '../components/ChestButton'
import SolucionesDetalladas from '../components/SolucionesDetalladas'

const Exercises = () => {
  const { isMobile } = useDeviceDetection()
  const navigate = useNavigate()
  const location = useLocation()
  const { completeExercise, completeLevel } = useGameStats()
  const { userInfo } = useAuth()
  
  const getStarsStorageKey = () => {
    if (userInfo?.id) {
      return `levelStars_${userInfo.id}`;
    } else if (userInfo?.name && userInfo?.lastNames) {
      const uniqueId = `${userInfo.name}_${userInfo.lastNames}`.replace(/\s+/g, '_');
      return `levelStars_${uniqueId}`;
    }
    return 'levelStars_default';
  };
  
  const { 
    classroomId, 
    courseId, 
    topicId,
    topicName,
    levelId,
    levelNumber, 
    levelName 
  } = location.state || {}

  const {
    exercises,
    currentExercise,
    exerciseProgress,
    levelRunInfo,
    attemptHistory,
    loadExercises,
    markAnswer,
    reloadAttemptHistory,
    getLevelResults,
    getLevelSolutions,
    repeatLevel,
    nextExercise,
    previousExercise,
    isLoading,
    error,
    isFirstExercise,
    isLastExercise,
    progressPercentage
  } = useExercises()

  const [selectedOption, setSelectedOption] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const [answerResult, setAnswerResult] = useState(null)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [userAnswers, setUserAnswers] = useState([])
  const [showSolucionesDetalladas, setShowSolucionesDetalladas] = useState(false)
  const [solucionesData, setSolucionesData] = useState([])
  const [isNavigating, setIsNavigating] = useState(false)
  const [showLevelResults, setShowLevelResults] = useState(false)
  const [levelResults, setLevelResults] = useState(null)
  const [firstAttemptResults, setFirstAttemptResults] = useState({})
  const [exerciseAttempts, setExerciseAttempts] = useState({})
  const isFinishingQuizRef = useRef(false)

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
    if (!levelId) {
      navigate('/dashboard')
      return
    }
    loadExercises(classroomId, courseId, topicId, levelId)
  }, [levelId])

  const handleOptionSelect = async (optionId, value) => {
    if (showResult) return
    
    const selectedOpt = { id: optionId, value }
    setSelectedOption(selectedOpt)

    const correctOption = currentExercise.correctOption?.toUpperCase()?.trim()
    const selectedValue = value?.toUpperCase()?.trim()
    const isCorrect = selectedValue === correctOption
    
    const exerciseNum = currentExercise.exerciseNumber
    
    const isFirstAttempt = !exerciseAttempts[exerciseNum]
    
    setExerciseAttempts(prev => ({
      ...prev,
      [exerciseNum]: (prev[exerciseNum] || 0) + 1
    }))
    
    if (isFirstAttempt) {
      setFirstAttemptResults(prev => ({
        ...prev,
        [exerciseNum]: isCorrect
      })
    }
    
    setUserAnswers(prev => [...prev, {
      exerciseNumber: exerciseNum,
      question: currentExercise.question,
      markedOption: value,
      correctOption: correctOption,
      isCorrect,
      isFirstAttempt
    }])
    
    const optionKeys = ['optionA', 'optionB', 'optionC', 'optionD', 'optionE']
    const optionLetters = ['A', 'B', 'C', 'D', 'E']
    const correctOptionIndex = optionLetters.indexOf(correctOption)
    const correctOptionText = correctOptionIndex >= 0 
      : currentExercise[optionKeys[correctOptionIndex]] 
      : correctOption
    
    setAnswerResult({
      isCorrect: isCorrect,
      correctOption: correctOption,
      correctOptionText: correctOptionText
    })
    
    if (levelRunInfo?.levelRunId && 
        levelRunInfo?.status === 'IN_PROGRESS' &&
        isFirstAttempt && 
        currentExercise?.exerciseId) {
      markAnswer(levelRunInfo.levelRunId, currentExercise.exerciseId, value).catch(err => {
        console.error('Error enviando respuesta al backend:', err)
        if (err.response?.status === 400) {
          console.warn('⚠️ El LevelRun ya está finalizado, el backend rechazó la respuesta')
          console.warn('💡 Las respuestas locales seguirán funcionando pero no se guardarán en el servidor')
        }
      })
    } else if (levelRunInfo?.status !== 'IN_PROGRESS') {
      console.warn('⚠️ LevelRun no está en progreso (status:', levelRunInfo?.status, '). Las respuestas no se enviarán al backend.')
      console.warn('💡 Puedes completar el nivel localmente, pero usa "Repetir Nivel" para guardar en el servidor.')
    }
    
    setTimeout(() => {
      setShowResult(true)
    }, 800)
  }

  const handleNextOrRetry = () => {
    if (answerResult && !answerResult.isCorrect) {
      setSelectedOption(null)
      setShowResult(false)
      setAnswerResult(null)
      return
    }
    
    if (isLastExercise) {
      handleFinishQuiz()
      return
    }
    
    setSelectedOption(null)
    setShowResult(false)
    setAnswerResult(null)
    
    const moved = nextExercise()
    if (!moved) {
      handleFinishQuiz()
    }
  }

  const handleFinishQuiz = async () => {
    console.log('🔍 handleFinishQuiz llamado, isFinishingQuiz actual:', isFinishingQuizRef.current);
    
    if (isFinishingQuizRef.current) {
      console.log('⚠️ handleFinishQuiz ya está en ejecución, ignorando llamada duplicada');
      return;
    }
    
    isFinishingQuizRef.current = true;
    console.log('🔴 Iniciando handleFinishQuiz (flag activado)');
    
    if (levelRunInfo?.levelRunId) {
      console.log('📚 Cargando soluciones detalladas del backend...');
      const result = await getLevelSolutions(levelRunInfo.levelRunId);
      
      if (result.success && result.data) {
        console.log('✅ Soluciones cargadas exitosamente:', result.data);
        setSolucionesData(result.data);
      } else {
        console.error('❌ Error cargando soluciones:', result.error);
        setSolucionesData([]);
      }
    } else {
      console.warn('⚠️ No hay levelRunId disponible para cargar soluciones');
      setSolucionesData([]);
    }
    
    setShowSolucionesDetalladas(true);
  }
  
  const handleContinueFromSoluciones = async () => {
    setIsNavigating(true);
    
    await new Promise(resolve => setTimeout(resolve, 50));
    
    setShowSolucionesDetalladas(false);
    
    const correctFirstAttempts = Object.values(firstAttemptResults).filter(result => result === true).length
    const totalQuestions = exerciseProgress.total
    const scoreOver20 = Math.ceil((correctFirstAttempts / totalQuestions) * 20)
    
    console.log('📊 Finalizando quiz:', {
      correctFirstAttempts,
      totalQuestions,
      scoreOver20
    });
    
    let stars = 0;
    let medalType = 'ninguna';
    
    if (scoreOver20 >= 17) {
      stars = 3;
      medalType = 'oro';
    } else if (scoreOver20 >= 14) {
      stars = 2;
      medalType = 'plata';
    } else if (scoreOver20 >= 11) {
      stars = 1;
      medalType = 'bronce';
    }
    
    console.log('🏅 Medalla calculada:', { stars, medalType });
    
    if (levelId && stars > 0) {
      try {
        const storageKey = getStarsStorageKey();
        console.log('🔑 [Exercises] Storage key para estrellas:', storageKey);
        
        const starsData = localStorage.getItem(storageKey)
        const stars_obj = starsData ? JSON.parse(starsData) : {}
        
        if (!stars_obj[levelId] || stars > stars_obj[levelId]) {
          stars_obj[levelId] = stars
          localStorage.setItem(storageKey, JSON.stringify(stars_obj))
          console.log(`⭐ Guardadas ${stars} estrellas para nivel ${levelId} en ${storageKey}`)
        }
      } catch (error) {
        console.error('Error al guardar estrellas:', error)
      }
    }
    
    let backendResult = null;
    try {
      if (levelRunInfo?.levelRunId) {
        console.log('📊 Obteniendo resultado del nivel del backend...');
        backendResult = await studentGetLevelRunResult(levelRunInfo.levelRunId);
        console.log('✅ Resultado del backend:', backendResult);
        
        if (backendResult?.status === 'PASSED') {
          console.log('🎉 Nivel PASADO según el backend');
        } else if (backendResult?.status === 'FAILED') {
          console.log('❌ Nivel FALLADO según el backend');
        } else {
          console.log('⚠️ Estado del nivel:', backendResult?.status);
        }
      }
    } catch (error) {
      console.error('Error obteniendo resultado del nivel:', error);
    }
    
    console.log('🎮 Llamando completeLevel con:', { medalType, correctFirstAttempts, totalQuestions });
    completeLevel(medalType, correctFirstAttempts, totalQuestions);
    console.log('✅ completeLevel ejecutado');
    
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('⏳ Esperando a que el backend actualice...');
    
    let xpGained = 50;
    if (medalType === 'oro') {
      xpGained = 150;
    } else if (medalType === 'plata') {
      xpGained = 100;
    } else if (medalType === 'bronce') {
      xpGained = 75;
    }
    const bonusXP = correctFirstAttempts * 15;
    xpGained += bonusXP;
    
    navigate('/levels', {
      state: {
        classroomId,
        courseId,
        topicId,
        topicName,
        forceReload: Date.now(),
        message: `¡Nivel completado! Puntuación: ${scoreOver20}/20`,
        quizResults: {
          score: scoreOver20,
          correctAnswers: correctFirstAttempts,
          totalQuestions,
          stars,
          medalType,
          experienceGained: xpGained
        }
      }
    })
  }

  const handleViewResults = async () => {
    if (!levelRunInfo?.levelRunId) {
      console.error('No hay levelRunId disponible para obtener resultados')
      return
    }

    try {
      console.log('Obteniendo resultados del nivel run:', levelRunInfo.levelRunId)
      const result = await getLevelResults(levelRunInfo.levelRunId)
      
      if (result.success) {
        setLevelResults(result.data)
        setShowLevelResults(true)
        console.log('Resultados del nivel cargados:', result.data)
      } else {
        console.error('Error obteniendo resultados:', result.error)
        showNotification({
          type: 'error',
          message: result.error || 'Error al cargar los resultados'
        })
      }
    } catch (error) {
      console.error('Error inesperado obteniendo resultados:', error)
      showNotification({
        type: 'error',
        message: 'Error inesperado al cargar los resultados'
      })
    }
  }

  const handleRepeatLevel = async () => {
    if (!levelId) {
      console.error('No hay levelId disponible para repetir el nivel')
      return
    }

    try {
      console.log('Repitiendo nivel:', levelId)
      const result = await repeatLevel(levelId)
      
      if (result.success) {
        console.log('Nivel preparado para repetir:', result.data)
        
        setShowLevelResults(false)
        setQuizCompleted(false)
        setUserAnswers([])
        setSelectedOption(null)
        setShowResult(false)
        setAnswerResult(null)
        
        await loadExercises(classroomId, courseId, topicId, levelId)
        
        showNotification({
          type: 'success',
          message: '¡Nivel reiniciado! Ahora puedes volver a intentarlo'
        })
      } else {
        console.error('Error repitiendo nivel:', result.error)
        showNotification({
          type: 'error',
          message: result.error || 'Error al repetir el nivel'
        })
      }
    } catch (error) {
      console.error('Error inesperado repitiendo nivel:', error)
      showNotification({
        type: 'error',
        message: 'Error inesperado al repetir el nivel'
      })
    }
  }

  const handlePreviousExercise = () => {
    const moved = previousExercise()
    if (moved) {
    }
  }

  const handleBack = () => {
    navigate('/levels', {
      state: {
        classroomId,
        courseId,
        topicId,
        topicName,
        forceReload: Date.now()
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

  const getExerciseOptions = () => {
    const options = []
    const optionKeys = ['optionA', 'optionB', 'optionC', 'optionD', 'optionE']
    
    optionKeys.forEach((key, index) => {
      const text = currentExercise[key]
      if (text) {
        options.push({
          id: index + 1,
          key,
          letter: String.fromCharCode(65 + index),
          value: String.fromCharCode(65 + index),
          text
        })
      }
    })
    return options
  }

  const exerciseOptions = getExerciseOptions()

  const isCorrectAnswer = (value) => {
    return answerResult?.isCorrect && selectedOption?.value === value
  }

  const getCurrentExerciseAttempts = () => {
    if (!currentExercise || !attemptHistory.length) return []
    
    return attemptHistory.filter(attempt => 
      attempt.exerciseNumber === currentExercise.exerciseNumber
    ).sort((a, b) => a.attemptNumber - b.attemptNumber)
  }

  const progress = exerciseProgress.total > 0 
    ? ((exerciseProgress.current + 1) / exerciseProgress.total) * 100 
    : 0

  if (showLevelResults && levelResults) {
    return (
      <div className="min-h-screen relative flex items-center justify-center" style={{ minHeight: '100dvh' }}>
        <div 
          className="fixed inset-0"
          style={{
            backgroundColor: '#1a472a',
            backgroundImage: `url("/images/fondo_playa.jpeg")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        />

        <div className="fixed inset-0 bg-black bg-opacity-60" />
        
        <div className="relative z-10 max-w-md w-full mx-4">
          <div className="rounded-3xl p-6 shadow-2xl relative overflow-hidden" style={{backgroundColor: '#2d5016'}}>
            
            <div className="mb-4 flex items-center justify-between">
              <h1 className="text-white text-2xl font-bold drop-shadow-lg">
                Resultados del Nivel
              </h1>
              <button 
                onClick={() => setShowLevelResults(false)}
                className="text-white hover:text-gray-300 text-2xl font-bold"
              >
                ×
              </button>
            </div>

            <div className="space-y-4 text-white">
              <div className="bg-black bg-opacity-30 rounded-2xl p-4">
                <h3 className="text-lg font-semibold mb-2">Información General</h3>
                <p>Run ID: {levelResults.levelRunId || 'N/A'}</p>
                <p>Nivel: {levelResults.levelName || 'N/A'}</p>
                <p>Estado: {levelResults.status || 'N/A'}</p>
              </div>

              {levelResults.statistics && (
                <div className="bg-black bg-opacity-30 rounded-2xl p-4">
                  <h3 className="text-lg font-semibold mb-2">Estadísticas</h3>
                  <p>Puntuación Final: {levelResults.statistics.finalScore || 'N/A'}</p>
                  <p>Respuestas Correctas: {levelResults.statistics.correctAnswers || 'N/A'}</p>
                  <p>Total de Preguntas: {levelResults.statistics.totalQuestions || 'N/A'}</p>
                  <p>Tiempo Total: {levelResults.statistics.totalTime || 'N/A'}</p>
                </div>
              )}

              {levelResults.attempts && levelResults.attempts.length > 0 && (
                <div className="bg-black bg-opacity-30 rounded-2xl p-4 max-h-48 overflow-y-auto">
                  <h3 className="text-lg font-semibold mb-2">Historial de Intentos</h3>
                  {levelResults.attempts.map((attempt, index) => (
                    <div key={index} className="mb-2 p-2 bg-white bg-opacity-10 rounded-lg">
                      <p className="text-sm">Ejercicio {attempt.exerciseNumber}: {attempt.markedOption}</p>
                      <p className="text-xs text-gray-300">
                        {attempt.isCorrect ? '✓ Correcto' : '✗ Incorrecto'} - 
                        {new Date(attempt.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-6 space-y-3">
              <button 
                onClick={handleRepeatLevel}
                disabled={isLoading}
                className="w-full py-3 px-6 rounded-2xl text-white font-bold text-lg shadow-xl transition-all duration-300 hover:opacity-90 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{backgroundColor: '#58A399'}}
              >
                {isLoading ? 'PROCESANDO...' : 'REPETIR NIVEL'}
              </button>
              
              <button 
                onClick={() => setShowLevelResults(false)}
                className="w-full py-3 px-6 rounded-2xl text-white font-bold text-lg shadow-xl transition-all duration-300 hover:opacity-90 transform hover:scale-105"
                style={{backgroundColor: '#F19506'}}
              >
                CERRAR
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (isNavigating) {
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
        <div className="fixed inset-0 bg-black bg-opacity-70" />
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
          
          <div className="mb-4">
            <button
              onClick={() => navigate('/levels', {
                state: {
                  classroomId,
                  courseId,
                  topicId,
                  topicName
                }
              })}
              className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 text-white font-semibold px-4 py-2 rounded-lg transition-all duration-200 backdrop-blur-sm border border-white/30"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Volver a Niveles</span>
            </button>
          </div>
          
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
            
            <div className="mb-6 flex justify-center">
              <div className="rounded-2xl p-6 shadow-xl border border-white/20 w-full max-w-3xl" style={{backgroundColor: 'rgba(35, 155, 86, 0.9)'}}>
                <p className="text-white text-lg leading-relaxed text-center">
                  {currentExercise.question}
                </p>
              </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center">
              <div className={`${isMobile ? 'grid grid-cols-2 gap-4 justify-items-center' : 'flex justify-center space-x-8'} w-full mb-8`}>
                {exerciseOptions.map((option) => (
                  <ChestButton
                    key={option.id}
                    option={option}
                    selectedAnswer={selectedOption}
                    onSelect={handleOptionSelect}
                    isCorrectAnswer={isCorrectAnswer}
                    showResult={showResult}
                    isMobile={isMobile}
                    chestSize={{ mobile: 200, desktop: 240 }}
                    fontSize={{ mobile: 40, desktop: 60 }}
                  />
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
      
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
                : 'Esa no era la respuesta correcta'}
            </h3>
            {!answerResult.isCorrect && (
              <p className="text-white text-lg mb-4 opacity-90">
                ¡Inténtalo de nuevo!
              </p>
            )}
            
            <div className="flex justify-center">
              <button 
                className="w-full max-w-xs py-4 px-6 rounded-full text-white font-bold text-lg shadow-xl transition-all duration-300 hover:opacity-90 transform hover:scale-105"
                style={{backgroundColor: '#F19506'}}
                onClick={handleNextOrRetry}
              >
                {answerResult.isCorrect 
                  ? (isLastExercise ? 'Finalizar' : 'Siguiente →')
                  : '🔄 Reintentar'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {showSolucionesDetalladas && (
        <SolucionesDetalladas
          exercises={exercises}
          userAnswers={userAnswers}
          solucionesData={solucionesData}
          onContinue={handleContinueFromSoluciones}
        />
      )}
      
    </div>
  )
}

export default Exercises

