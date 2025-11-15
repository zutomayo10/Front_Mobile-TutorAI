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
      className="relative flex flex-col items-center"
      style={getChestStyle()}
    >
      {/* Texto de la opción ENCIMA del cofre */}
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
        className="relative flex items-center justify-center cursor-pointer transform transition-all duration-300 hover:scale-110"
        style={containerStyle}
      >
        <img 
          src={getChestImage(option)}
          alt=""
          className="w-full h-full object-contain drop-shadow-2xl transition-all duration-500 select-none"
          draggable="false"
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
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {isCorrectAnswer(option.value) ? (
              <div className="absolute inset-0 animate-pulse">
                <div className="absolute inset-0 bg-green-400 opacity-20 rounded-full"></div>
              </div>
            ) : (
              <div className="absolute inset-0 animate-pulse">
                <div className="absolute inset-0 bg-red-400 opacity-20 rounded-full"></div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default ChestButton