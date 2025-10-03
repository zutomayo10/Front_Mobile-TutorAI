import React, { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import Exercises from './pages/Exercises'
import { useDeviceDetection } from './hooks/useDeviceDetection'

function App() {
  const { isMobile, isTablet, isDesktop } = useDeviceDetection()
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
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/exercises" element={<Exercises />} />
        </Routes>
      </main>
    </div>
  )
}

export default App