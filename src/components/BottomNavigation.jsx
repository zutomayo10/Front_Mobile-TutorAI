import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const BottomNavigation = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { logout } = useAuth()
  
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
    },
    {
      path: 'logout',
      name: 'SALIR',
      emoji: '🚪',
      color: 'text-red-600',
      action: () => {
        logout()
        navigate('/login')
      }
    }
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-orange-500 to-orange-400 shadow-2xl border-t-4 border-orange-300 z-50 bottom-nav-fixed">
      <div className="flex items-center py-2 px-4 relative z-10">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path && item.path !== 'logout'
          const isLogout = item.path === 'logout'
          return (
            <button
              key={item.path}
              onClick={() => item.action ? item.action() : navigate(item.path)}
              className={`flex flex-col items-center space-y-1 py-2 px-2 rounded-2xl transition-all duration-300 transform flex-1 ${
                isActive
                  ? 'bg-white bg-opacity-30 backdrop-blur-sm scale-110 shadow-lg border border-white border-opacity-30'
                  : isLogout
                  ? 'hover:bg-red-500 hover:bg-opacity-30 hover:scale-105'
                  : 'hover:bg-white hover:bg-opacity-20 hover:scale-105'
              }`}
            >
              <div className={`text-xl transition-all duration-300 ${isLogout ? 'text-2xl' : ''}`}>
                {item.emoji}
              </div>
              <span className={`text-xs font-bold drop-shadow-sm ${
                isActive 
                  ? 'text-white' 
                  : isLogout
                  ? 'text-red-100'
                  : 'text-white text-opacity-90'
              }`}>
                {item.name}
              </span>
              {isActive && (
                <div className="w-6 h-1 bg-yellow-300 rounded-full animate-pulse"></div>
              )}
            </button>
          )
        })}
      </div>


    </div>
  )
}

export default BottomNavigation