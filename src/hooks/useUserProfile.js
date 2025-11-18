import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'

export const useUserProfile = () => {
  const { userInfo } = useAuth()
  const [profileImage, setProfileImage] = useState('🧙‍♂️')
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null)
  const [userName] = useState('Juan Chavez')
  const [isLoading, setIsLoading] = useState(true)

  // Función para obtener claves específicas del usuario
  const getStorageKeys = () => {
    if (userInfo?.id) {
      return {
        profileImage: `tutor-ai-profile-image_${userInfo.id}`,
        uploadedImage: `tutor-ai-uploaded-image_${userInfo.id}`
      };
    }
    return null;
  };

  useEffect(() => {
    const loadProfileData = () => {
      const keys = getStorageKeys();
      if (keys) {
        const savedProfileImage = localStorage.getItem(keys.profileImage)
        const savedUploadedImage = localStorage.getItem(keys.uploadedImage)
        
        if (savedUploadedImage) {
          setUploadedImageUrl(savedUploadedImage)
          setProfileImage(null)
        } else if (savedProfileImage) {
          setProfileImage(savedProfileImage)
          setUploadedImageUrl(null)
        }
      }
      
      setIsLoading(false)
    }

    if (userInfo) {
      const timeoutId = setTimeout(loadProfileData, 20)
      return () => clearTimeout(timeoutId)
    } else {
      setIsLoading(false)
    }
  }, [userInfo])

  const updateProfileImage = (emoji) => {
    const keys = getStorageKeys();
    if (keys) {
      setProfileImage(emoji)
      setUploadedImageUrl(null)
      localStorage.setItem(keys.profileImage, emoji)
      localStorage.removeItem(keys.uploadedImage)
    }
  }

  const updateUploadedImage = (imageUrl) => {
    const keys = getStorageKeys();
    if (keys) {
      setUploadedImageUrl(imageUrl)
      setProfileImage(null)
      localStorage.setItem(keys.uploadedImage, imageUrl)
      localStorage.removeItem(keys.profileImage)
    }
  }

  const getCurrentAvatar = () => {
    if (uploadedImageUrl) {
      return { type: 'image', value: uploadedImageUrl }
    }
    return { type: 'emoji', value: profileImage }
  }

  return {
    profileImage,
    uploadedImageUrl,
    userName,
    isLoading,
    updateProfileImage,
    updateUploadedImage,
    getCurrentAvatar
  }
}