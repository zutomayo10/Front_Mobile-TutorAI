import React from 'react'

const ChestButton = ({ 
  option, 
  selectedAnswer, 
  onSelect, 
  isCorrectAnswer,
  showResult,
  isMobile,
  chestSize = { mobile: 200, desktop: 240 },
  fontSize = { mobile: 36, desktop: 60 }
}) => {
  
  const isSelected = selectedAnswer?.id === option.id
  const isCorrect = showResult && isCorrectAnswer(option.value)
  const isIncorrect = showResult && isSelected && !isCorrectAnswer(option.value)

  const containerStyle = {
    width: `${isMobile ? chestSize.mobile : chestSize.desktop}px`,
    height: `${isMobile ? chestSize.mobile : chestSize.desktop}px`,
  }

  const textStyle = {
    fontSize: `${isMobile ? fontSize.mobile : fontSize.desktop}px`,
  }

  return (
    <div
      className="relative flex flex-col items-center"
      style={{ opacity: selectedAnswer && !isSelected ? 0.5 : 1 }}
    >
      {option.text && (
        <div className="mb-3 max-w-xs text-center pointer-events-none">
          <div className="rounded-lg px-4 py-2 shadow-lg border-2 border-green-400" style={{backgroundColor: 'rgba(35, 155, 86, 0.9)'}}>
            <p className="text-white font-semibold text-sm leading-tight">
              {option.text}
            </p>
          </div>
        </div>
      )}
      
      <div 
        onClick={() => !selectedAnswer && onSelect(option.id, option.value)}
        className={`relative flex items-center justify-center cursor-pointer transform transition-all duration-300 rounded-2xl ${
          !selectedAnswer ? 'hover:scale-110' : ''
        } ${isSelected ? 'scale-110' : ''} shadow-2xl overflow-hidden`}
        style={containerStyle}
      >
        <img 
          src="/images/cofre_cerrado.png"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          draggable="false"
        />
        
        {isCorrect && (
          <div className="absolute inset-0 bg-green-500 opacity-40"></div>
        )}
        {isIncorrect && (
          <div className="absolute inset-0 bg-red-500 opacity-40"></div>
        )}
        
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
          <span 
            className="font-bold text-white drop-shadow-2xl"
            style={textStyle}
          >
            {option.value}
          </span>
        </div>
        
        {isCorrect && (
          <div className="absolute -top-4 -right-4 w-16 h-16 bg-green-400 rounded-full flex items-center justify-center shadow-lg animate-bounce z-20">
            <span className="text-4xl">✔️</span>
          </div>
        )}
        
        {isIncorrect && (
          <div className="absolute -top-4 -right-4 w-16 h-16 bg-red-400 rounded-full flex items-center justify-center shadow-lg animate-bounce z-20">
            <span className="text-4xl">❌</span>
          </div>
        )}
        
        {isSelected && !showResult && (
          <div className="absolute inset-0 rounded-2xl animate-pulse" style={{
            boxShadow: '0 0 30px 10px rgba(255, 255, 0, 0.6)'
          }}></div>
        )}
      </div>
    </div>
  )
}

export default ChestButton