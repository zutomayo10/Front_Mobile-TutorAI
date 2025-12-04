import React, { useState } from 'react'

const SolucionesDetalladas = ({ exercises, userAnswers, solucionesData = [], onContinue }) => {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)
  
  const generateDetailedSolution = (exercise) => {
    const backendSolution = solucionesData.find(sol => sol.exerciseNumber === exercise.exerciseNumber)
    if (backendSolution?.detailedSolution) {
      return backendSolution.detailedSolution
    }
    
    if (exercise.detailedSolution || exercise.explanation) {
      return exercise.detailedSolution || exercise.explanation
    }
    
    const correctOption = exercise.correctOption?.toUpperCase()
    const optionKeys = { 'A': 'optionA', 'B': 'optionB', 'C': 'optionC', 'D': 'optionD', 'E': 'optionE' }
    const correctText = exercise[optionKeys[correctOption]]
    
    return `La respuesta correcta es la opción ${correctOption}: "${correctText}".\n\nRevisa bien el enunciado de la pregunta y compara con esta opción para entender por qué es la correcta.`
  }
  
  const exercisesWithAnswers = exercises.map((exercise, index) => {
    const userAnswer = userAnswers.find(ans => ans.exerciseNumber === exercise.exerciseNumber)
    const backendSolution = solucionesData.find(sol => sol.exerciseNumber === exercise.exerciseNumber)
    
    return {
      ...exercise,
      userAnswer: userAnswer?.markedOption || null,
      correctAnswer: exercise.correctOption,
      isCorrect: userAnswer?.isCorrect || false,
      question: backendSolution?.question || exercise.question,
      detailedSolution: generateDetailedSolution(exercise)
    }
  })
  
  const currentExercise = exercisesWithAnswers[currentExerciseIndex]
  const totalExercises = exercisesWithAnswers.length
  
  const handleNext = () => {
    if (currentExerciseIndex < totalExercises - 1) {
      setCurrentExerciseIndex(prev => prev + 1)
    }
  }
  
  const handlePrevious = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(prev => prev - 1)
    }
  }
  
  const getOptionLabel = (optionLetter) => {
    const labels = {
      'A': 'A',
      'B': 'B', 
      'C': 'C',
      'D': 'D',
      'E': 'E'
    }
    return labels[optionLetter?.toUpperCase()] || optionLetter
  }
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" style={{ minHeight: '100dvh' }}>
      <div 
        className="fixed inset-0"
        style={{
          backgroundImage: 'url("/images/fondo_playa.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      <div className="fixed inset-0 bg-black bg-opacity-60" />
      
      <div className="relative z-10 min-h-screen flex items-center justify-center p-2 sm:p-3 md:p-4">
        <div className="w-full max-w-3xl my-2 sm:my-3 md:my-4">
          <div className="bg-white/95 backdrop-blur-sm rounded-t-2xl sm:rounded-t-3xl p-3 sm:p-4 md:p-5 shadow-xl">
            <div className="text-center mb-2 sm:mb-3">
              <div className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 rounded-full text-sm sm:text-base md:text-lg font-bold mb-1 sm:mb-2">
                📚 Soluciones Detalladas
              </div>
            </div>
            <p className="text-gray-700 text-center text-xs sm:text-sm md:text-base">
              Revisa las soluciones de los ejercicios
            </p>
          </div>
          
          <div className="bg-white/95 backdrop-blur-sm p-3 sm:p-4 md:p-5 shadow-xl">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="bg-gradient-to-r from-purple-500 to-purple-700 text-white w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center text-lg sm:text-xl md:text-2xl font-bold shadow-lg">
                {currentExercise.exerciseNumber}
              </div>
              <div className={`px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 rounded-full text-white font-bold text-xs sm:text-sm md:text-base shadow-md ${
                currentExercise.isCorrect ? 'bg-green-500' : 'bg-red-500'
              }`}>
                {currentExercise.isCorrect ? '✓ Correcto' : '✗ Incorrecto'}
              </div>
            </div>
            
            <div className="mb-3 sm:mb-4 bg-gray-50 rounded-xl p-3 sm:p-4 border-2 border-gray-200">
              <div className="text-xs sm:text-sm text-gray-500 font-semibold mb-1.5">Pregunta:</div>
              <p className="text-gray-800 text-xs sm:text-sm md:text-base leading-relaxed">
                {currentExercise.question}
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 mb-3 sm:mb-4">
              <div className={`rounded-xl p-3 sm:p-4 border-2 ${
                currentExercise.isCorrect 
                  ? 'bg-green-50 border-green-300' 
                  : 'bg-red-50 border-red-300'
              }`}>
                <div className="text-xs sm:text-sm font-semibold mb-1.5" style={{ color: currentExercise.isCorrect ? '#059669' : '#dc2626' }}>
                  Tu respuesta:
                </div>
                <div className={`text-xl sm:text-2xl md:text-3xl font-bold ${
                  currentExercise.isCorrect ? 'text-green-600' : 'text-red-600'
                }`}>
                  {getOptionLabel(currentExercise.userAnswer) || '-'}
                </div>
              </div>
              
              <div className="bg-green-50 rounded-xl p-3 sm:p-4 border-2 border-green-300">
                <div className="text-xs sm:text-sm font-semibold mb-1.5 text-green-700">
                  Respuesta correcta:
                </div>
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-green-600">
                  {getOptionLabel(currentExercise.correctAnswer)}
                </div>
              </div>
            </div>
            
            {currentExercise.isCorrect ? (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-3 sm:p-4 border-2 border-green-300">
                <div className="flex items-center mb-2">
                  <div className="text-lg sm:text-xl mr-2">🎉</div>
                  <div className="text-green-800 font-bold text-sm sm:text-base md:text-lg">¡Excelente trabajo!</div>
                </div>
                <p className="text-gray-700 text-xs sm:text-sm leading-relaxed">
                  ¡Felicidades! Respondiste correctamente esta pregunta. Sigue así, lo estás haciendo muy bien. 🌟
                </p>
              </div>
            ) : (
              <div className="bg-blue-50 rounded-xl p-3 sm:p-4 border-2 border-blue-200">
                <div className="flex items-center mb-2">
                  <div className="text-lg sm:text-xl mr-2">💡</div>
                  <div className="text-blue-800 font-bold text-sm sm:text-base">Solución Detallada:</div>
                </div>
                <p className="text-gray-700 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                  {currentExercise.detailedSolution}
                </p>
              </div>
            )}
          </div>
          
          <div className="bg-white/95 backdrop-blur-sm rounded-b-2xl sm:rounded-b-3xl p-3 sm:p-4 shadow-xl">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-3 mb-3">
              <button
                onClick={handlePrevious}
                disabled={currentExerciseIndex === 0}
                className={`w-full sm:w-auto px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 rounded-full font-bold text-xs sm:text-sm md:text-base transition-all duration-300 ${
                  currentExerciseIndex === 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-600 hover:bg-gray-700 text-white shadow-lg transform hover:scale-105'
                }`}
              >
                ← Anterior
              </button>
              
              <div className="text-gray-700 font-semibold text-xs sm:text-sm md:text-base order-first sm:order-none">
                {currentExerciseIndex + 1} / {totalExercises}
              </div>
              
              {currentExerciseIndex < totalExercises - 1 ? (
                <button
                  onClick={handleNext}
                  className="w-full sm:w-auto px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm md:text-base transition-all duration-300 shadow-lg transform hover:scale-105"
                >
                  Siguiente →
                </button>
              ) : (
                <button
                  onClick={onContinue}
                  className="w-full sm:w-auto px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 rounded-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold text-xs sm:text-sm md:text-base transition-all duration-300 shadow-lg transform hover:scale-105"
                >
                  Continuar a Resultados →
                </button>
              )}
            </div>
            
            <div className="flex justify-center flex-wrap gap-1.5 sm:gap-2 mt-2 sm:mt-3">
              {exercisesWithAnswers.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 sm:h-2.5 rounded-full transition-all duration-300 ${
                    index === currentExerciseIndex
                      ? 'bg-blue-600 w-5 sm:w-6'
                      : index < currentExerciseIndex
                      ? 'bg-green-500 w-2 sm:w-2.5'
                      : 'bg-gray-300 w-2 sm:w-2.5'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SolucionesDetalladas
