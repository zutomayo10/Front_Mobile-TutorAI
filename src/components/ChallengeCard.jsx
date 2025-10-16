import React from 'react';

const ChallengeCard = ({ challenge, onPlay }) => {
  return (
    <div 
      className={`relative bg-green-800 bg-opacity-90 backdrop-blur-md rounded-2xl p-4 md:p-6 border-2 border-white border-opacity-20 transform transition-all duration-300 cursor-pointer shadow-xl h-full flex flex-col ${challenge.shadowColor}`}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 hover:opacity-10 rounded-2xl transition-opacity duration-300"></div>
      
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3 md:space-x-4">
          <div className="w-12 h-12 md:w-14 md:h-14 bg-green-600 rounded-xl flex items-center justify-center text-2xl md:text-3xl shadow-lg transform hover:rotate-12 transition-transform duration-300">
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
          <p className="text-white text-opacity-90 font-semibold flex items-center">
            <span className="mr-2">🎯</span>
            {challenge.completed}/{challenge.total} misiones completadas
          </p>
          <p className="text-yellow-300 font-bold text-lg">
            {challenge.progress}%
          </p>
        </div>
        
        <div className="w-full bg-black bg-opacity-30 rounded-full h-3 overflow-hidden shadow-inner">
          <div
            className="bg-green-500 h-3 rounded-full transition-all duration-1000 shadow-lg relative"
            style={{ width: `${challenge.progress}%` }}
          >
            <div className="absolute inset-0 bg-white bg-opacity-30 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>

      <button 
        onClick={() => onPlay(challenge)}
        className="w-full hover:opacity-90 transform transition-all duration-200 text-white font-bold py-3 px-6 rounded-xl shadow-lg flex items-center justify-center space-x-2 cursor-pointer"
        style={{ backgroundColor: '#F19506' }}
      >
        <span>¡JUGAR AHORA!</span>
      </button>
    </div>
  );
};

export default ChallengeCard;