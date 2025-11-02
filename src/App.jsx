import React, { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import Exercises from './pages/Exercises'
import Question from './pages/Question'
import JoinClassroom from './pages/JoinClassroom'
import { useDeviceDetection } from './hooks/useDeviceDetection'
import { useAuth } from './contexts/AuthContext'

// Componente para rutas protegidas
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth()
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-800">
        <div className="text-white text-xl">Cargando...</div>
      </div>
    )
  }
  
  return isAuthenticated ? children : <Navigate to="/" replace />
}

function App() {
  const { isMobile, isTablet, isDesktop } = useDeviceDetection()
  const { isAuthenticated } = useAuth()
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  useEffect(() => {
    const handleOnlineStatus = () => setIsOnline(navigator.onLine)
    
    window.addEventListener('online', handleOnlineStatus)
    window.addEventListener('offline', handleOnlineStatus)
    
    return () => {
      window.removeEventListener('online', handleOnlineStatus)
      window.removeEventListener('offline', handleOnlineStatus)
    }
  }, [])

  return (
    <div className={`app ${isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop'}`}>
      {!isOnline && (
        <div className="fixed top-0 left-0 right-0 bg-red-500 text-white text-center py-2 text-sm z-50">
          Sin conexión a Internet
        </div>
      )}
      
      <main>
        <Routes>
          <Route 
            path="/" 
            element={
              isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/exercises" 
            element={
              <ProtectedRoute>
                <Exercises />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/question" 
            element={
              <ProtectedRoute>
                <Question />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/join-classroom" 
            element={
              <ProtectedRoute>
                <JoinClassroom />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </main>
    </div>
  )
}

export default App