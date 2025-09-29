import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const BottomNavigation = () => {
  const location = useLocation()
  const navigate = useNavigate()
  
  const navItems = [
    {
      path: '/dashboard',
      name: 'AVENTURAS',
      emoji: '🗺️',
      color: 'text-purple-600'
    },
    {
      path: '/profile',
      name: 'PERFIL',
      emoji: '👤',
      color: 'text-blue-600'
    }
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-orange-500 to-orange-400 shadow-2xl border-t-4 border-orange-300 z-50">
      <div className="flex items-center justify-around py-2 px-4 relative z-10">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center space-y-1 py-2 px-4 rounded-2xl transition-all duration-300 transform ${
                isActive
                  ? 'bg-white bg-opacity-30 backdrop-blur-sm scale-110 shadow-lg border border-white border-opacity-30'
                  : 'hover:bg-white hover:bg-opacity-20 hover:scale-105'
              }`}
            >
              <div className={`text-2xl transition-all duration-300`}>
                {item.emoji}
              </div>
              <span className={`text-xs font-bold drop-shadow-sm ${
                isActive 
                  ? 'text-white' 
                  : 'text-white text-opacity-90'
              }`}>
                {item.name}
              </span>
              {isActive && (
                <div className="w-8 h-1 bg-yellow-300 rounded-full animate-pulse"></div>
              )}
            </button>
          )
        })}
      </div>


    </div>
  )
}

export default BottomNavigation