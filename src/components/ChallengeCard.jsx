import React from 'react';

const ChallengeCard = ({ challenge, onPlay }) => {
  const isCompleted = challenge.progress >= 100;
  
  return (
    <div 
      className="relative bg-green-800 bg-opacity-90 backdrop-blur-md rounded-2xl p-4 md:p-6 border-2 border-white border-opacity-20 transform transition-all duration-300 cursor-pointer shadow-xl h-full flex flex-col"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 hover:opacity-10 rounded-2xl transition-opacity duration-300"></div>
      
      {isCompleted && (
        <div className="absolute -top-3 -right-3 z-10">
          <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white font-bold text-xs px-3 py-1 rounded-full shadow-lg border-2 border-white flex items-center space-x-1 animate-bounce">
            <span>🏆</span>
            <span>COMPLETADO</span>
          </div>
        </div>
      )}
      
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3 md:space-x-4">
          <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-green-600 flex items-center justify-center text-2xl md:text-3xl shadow-lg transform hover:rotate-12 transition-transform duration-300">
            {challenge.icon}
          </div>
          <div>
            <h3 className="text-white font-bold text-lg md:text-xl drop-shadow-lg mb-1">
              {challenge.title}
            </h3>
          </div>
        </div>
      </div>
      
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <p className="font-semibold flex items-center text-white text-opacity-90">
            <span className="mr-2">🎯</span>
            {challenge.completed}/{challenge.total} misiones completadas
          </p>
          <p className="font-bold text-lg text-yellow-300">
            {challenge.progress}%
          </p>
        </div>
        
        <div className="w-full bg-black bg-opacity-30 rounded-full h-3 overflow-hidden shadow-inner">
          <div
            className="h-3 rounded-full transition-all duration-1000 shadow-lg relative bg-green-500"
            style={{ width: `${challenge.progress}%` }}
          >
            <div className="absolute inset-0 rounded-full bg-white bg-opacity-30 animate-pulse"></div>
          </div>
        </div>
      </div>

      <button 
        onClick={() => onPlay(challenge)}
        className="w-full hover:opacity-90 transform transition-all duration-200 text-white font-bold py-3 px-6 rounded-xl shadow-lg flex items-center justify-center space-x-2 cursor-pointer"
        style={{ backgroundColor: '#F19506' }}
      >
        <span>{isCompleted ? '🎉 ¡REPETIR AVENTURA!' : '¡JUGAR AHORA!'}</span>
      </button>
    </div>
  );
};

export default ChallengeCard;