import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const Sidebar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  
  const navItems = [
    {
      path: '/dashboard',
      name: 'AVENTURAS',
      icon: '🗺️',
      bgColor: 'from-purple-500 to-pink-500'
    },
    {
      path: '/profile',
      name: 'MI PERFIL',
      icon: '👤',
      bgColor: 'from-blue-500 to-cyan-500'
    }
  ]

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-orange-400 via-orange-500 to-orange-600 shadow-2xl z-40">
      <div className="p-6 relative z-10">
        {/* Logo/Título más divertido */}
        <div className="mb-8 text-center">
          <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl p-4 border-2 border-white border-opacity-30 shadow-lg">
            <div className="text-4xl mb-2">👤</div>
            <h1 className="text-white text-xl font-bold drop-shadow-lg">Juan Chavez</h1>
            <p className="text-yellow-200 text-sm font-semibold">Estudiante</p>
          </div>
        </div>
        
        {/* Navegación más divertida */}
        <nav className="space-y-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full group relative overflow-hidden rounded-2xl transition-all duration-300 transform hover:scale-105 ${
                  isActive
                    ? 'bg-white bg-opacity-30 shadow-lg scale-105'
                    : 'bg-white bg-opacity-10 hover:bg-opacity-20'
                }`}
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${item.bgColor} opacity-0 group-hover:opacity-20 transition-opacity duration-300`}></div>
                <div className="relative p-4 flex items-center space-x-3">
                  <div className={`text-2xl transform transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                    {item.icon}
                  </div>
                  <span className={`font-bold text-sm drop-shadow ${isActive ? 'text-white' : 'text-white text-opacity-90 group-hover:text-white'}`}>
                    {item.name}
                  </span>
                </div>
              </button>
            )
          })}
        </nav>
        

      </div>
    </div>
  )
}

export default Sidebar