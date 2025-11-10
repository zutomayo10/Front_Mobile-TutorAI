// src/components/UserInfo.jsx
import React from 'react'
import { useAuth } from '../contexts/AuthContext'

const UserInfo = ({ 
  variant = 'default', 
  showAge = true, 
  showRole = true,
  className = '' 
}) => {
  const { userInfo, user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className={`animate-pulse ${className}`}>
        {variant === 'compact' ? (
          <div className="h-4 bg-gray-300 rounded w-24"></div>
        ) : (
          <div className="space-y-2">
            <div className="h-4 bg-gray-300 rounded w-32"></div>
            <div className="h-3 bg-gray-300 rounded w-20"></div>
          </div>
        )}
      </div>
    )
  }

  if (!userInfo) {
    return (
      <div className={`text-gray-500 ${className}`}>
        {variant === 'compact' ? 'Usuario' : 'Información no disponible'}
      </div>
    )
  }

  const fullName = `${userInfo.name} ${userInfo.lastNames}`
  const role = user?.role || 'Estudiante'

  if (variant === 'compact') {
    return (
      <span className={className}>
        {fullName}
      </span>
    )
  }

  if (variant === 'card') {
    return (
      <div className={`bg-white rounded-lg p-4 shadow-sm ${className}`}>
        <div className="font-semibold text-gray-800">{fullName}</div>
        <div className="text-sm text-gray-600 space-y-1">
          {showAge && userInfo.age && <div>Edad: {userInfo.age} años</div>}
          {showRole && <div>Rol: {role}</div>}
        </div>
      </div>
    )
  }

  // variant === 'default'
  return (
    <div className={className}>
      <div className="font-semibold">{fullName}</div>
      <div className="text-sm opacity-80">
        {showAge && userInfo.age && `${userInfo.age} años`}
        {showAge && showRole && userInfo.age && ' | '}
        {showRole && role}
      </div>
    </div>
  )
}

export default UserInfo