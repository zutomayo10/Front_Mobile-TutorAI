import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'

export const useUserProfile = () => {
  const { userInfo } = useAuth()
  const userId = userInfo?.id || userInfo?.userId || 'default'
  const STORAGE_KEY = `tutor-ai-profile-image_${userId}`
  
  const [profileImage, setProfileImage] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) || '🧙‍♂️'
  })
  const [userName] = useState('Juan Chavez')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const savedImage = localStorage.getItem(STORAGE_KEY)
    if (savedImage) {
      setProfileImage(savedImage)
    }
  }, [userId, STORAGE_KEY])

  const updateProfileImage = (emoji) => {
    setProfileImage(emoji)
    localStorage.setItem(STORAGE_KEY, emoji)
    console.log('✅ Avatar guardado:', emoji, 'Key:', STORAGE_KEY)
  }

  const getCurrentAvatar = () => {
    return { type: 'emoji', value: profileImage }
  }

  return {
    profileImage,
    uploadedImageUrl: null,
    userName,
    isLoading,
    updateProfileImage,
    getCurrentAvatar
  }
}