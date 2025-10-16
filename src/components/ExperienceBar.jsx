import React from 'react';

const ExperienceBar = ({ currentExp, totalExp, isMobile }) => {
  if (isMobile) {
    return (
      <div className="mt-4 flex items-center bg-[#239B56] rounded-xl px-4 py-2 border border-white/30">
        <div className="flex items-center space-x-2 mr-2">
          <span className="text-yellow-300 text-sm">⚡</span>
          <span className="text-white text-sm font-semibold">EXP</span>
        </div>
        <div className="flex-1 flex items-center space-x-2">
          <div className="flex-1 bg-black/40 rounded-full h-2 overflow-hidden border border-white/20">
            <div 
              className="bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 h-full rounded-full transition-all duration-1000 relative"
              style={{ width: `${(currentExp / totalExp) * 100}%` }}
            >
              <div className="absolute inset-0 bg-white/30 rounded-full"></div>
            </div>
          </div>
          <div className="rounded-full px-2 py-0.5 border border-white/30" style={{backgroundColor: '#F19506'}}>
            <span className="text-white text-xs font-bold">{currentExp}/{totalExp}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute right-4 top-4 flex items-center">
      <div className="flex items-center bg-[#239B56] rounded-xl px-6 py-3 border border-white/30">
        <div className="flex items-center space-x-3 mr-4">
          <span className="text-yellow-300 text-xl">⚡</span>
          <span className="text-white font-semibold">Experiencia</span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="w-48 bg-black/40 rounded-full h-3 overflow-hidden border border-white/20">
            <div 
              className="bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 h-full rounded-full transition-all duration-1000 relative"
              style={{ width: `${(currentExp / totalExp) * 100}%` }}
            >
              <div className="absolute inset-0 bg-white/30 rounded-full"></div>
            </div>
          </div>
          <div className="rounded-full px-4 py-1 border border-white/30" style={{backgroundColor: '#F19506'}}>
            <span className="text-white text-sm font-bold">{currentExp}/{totalExp} EXP</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExperienceBar;