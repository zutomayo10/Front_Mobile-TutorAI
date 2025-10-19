import React from 'react'

const ChestButton = ({ 
  option, 
  selectedAnswer, 
  onSelect, 
  getChestImage, 
  isCorrectAnswer, 
  isMobile,
  chestSize = { mobile: 200, desktop: 320 },
  fontSize = { mobile: 36, desktop: 60 }
}) => {
  
  const getChestStyle = () => {
    if (!selectedAnswer) return {}
    
    if (selectedAnswer.id === option.id) {
      return { transform: 'scale(1.1)' }
    }
    
    return { opacity: 0.6 }
  }

  const containerStyle = {
    width: `${isMobile ? chestSize.mobile : chestSize.desktop}px`,
    height: `${isMobile ? chestSize.mobile : chestSize.desktop}px`,
  }

  const textStyle = {
    fontSize: `${isMobile ? fontSize.mobile : fontSize.desktop}px`,
    textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
  }

  return (
    <div
      onClick={() => !selectedAnswer && onSelect(option.id, option.value)}
      className="relative cursor-pointer transform transition-all duration-300 hover:scale-110"
      style={getChestStyle()}
    >
      <div 
        className="relative flex items-center justify-center"
        style={containerStyle}
      >
        <img 
          src={getChestImage(option)}
          alt="Cofre"
          className="w-full h-full object-contain drop-shadow-2xl transition-all duration-500"
        />
        
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <span 
            className="font-bold text-white drop-shadow-2xl transition-all duration-300"
            style={textStyle}
          >
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
  )
}

export default ChestButton