import React from 'react';

const DashboardHeader = () => {
  return (
    <div className="mb-8">
      <div className="text-center">
        <div className="inline-flex items-center rounded-full px-6 py-3 shadow-lg border border-white border-opacity-30 mb-4" style={{backgroundColor: '#239B56'}}>
          <span className="text-3xl mr-3 animate-pulse">⚔️</span>
          <h1 className="text-white text-2xl md:text-3xl font-bold drop-shadow-lg">
            ¡Tus Aventuras Matemáticas!
          </h1>
          <span className="text-3xl ml-3 animate-pulse">🏆</span>
        </div>
        <p className="text-white text-opacity-90 text-lg font-medium drop-shadow">
          ¡Completa los desafíos y conviértete en el mejor!
        </p>
      </div>
    </div>
  );
};

export default DashboardHeader;