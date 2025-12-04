import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useUserProfile } from '../hooks/useUserProfile'
import { useAuth } from '../contexts/AuthContext'
import Avatar from './Avatar'
import UserInfo from './UserInfo'

const Sidebar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { profileImage, isLoading } = useUserProfile()
  const { userInfo, logout } = useAuth()
  
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
    <div className="sidebar-desktop fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-orange-400 via-orange-500 to-orange-600 shadow-2xl z-40 flex flex-col">
      <div className="p-6 relative z-10 flex-1 flex flex-col">
        <div className="mb-8 text-center">
          <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl p-4 border-2 border-white border-opacity-30 shadow-lg">
            <div className="mb-3 flex justify-center">
              <Avatar
                profileImage={profileImage}
                uploadedImageUrl={null}
                isLoading={isLoading}
                size="md"
                className="border-2 border-white shadow-lg"
              />
            </div>
            <div className="text-white text-lg font-bold drop-shadow-lg">
              {userInfo ? `${userInfo.name} ${userInfo.lastNames}` : 'Estudiante'}
            </div>
            <p className="text-yellow-200 text-sm font-semibold">
              {userInfo?.age ? `${userInfo.age} años | Estudiante` : 'Estudiante'}
            </p>
          </div>
        </div>
        
        <nav className="space-y-4 flex-1">
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
        
        <div className="mt-8">
          <button
            onClick={() => {
              logout()
              navigate('/login')
            }}
            className="w-full group relative overflow-hidden rounded-2xl transition-all duration-300 transform hover:scale-105 bg-red-500 bg-opacity-20 hover:bg-opacity-30 border border-red-400 border-opacity-50"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
            <div className="relative p-4 flex items-center space-x-3">
              <div className="text-2xl transform transition-transform duration-300 group-hover:scale-110">
                🚪
              </div>
              <span className="font-bold text-sm drop-shadow text-white text-opacity-90 group-hover:text-white">
                CERRAR SESIÓN
              </span>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Sidebar