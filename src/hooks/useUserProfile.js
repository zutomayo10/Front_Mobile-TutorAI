import { useState, useEffect } from 'react'

export const useUserProfile = () => {
  const [profileImage, setProfileImage] = useState('🧙‍♂️')
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null)
  const [userName] = useState('Juan Chavez')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadProfileData = () => {
      const savedProfileImage = localStorage.getItem('tutor-ai-profile-image')
      const savedUploadedImage = localStorage.getItem('tutor-ai-uploaded-image')
      
      if (savedUploadedImage) {
        setUploadedImageUrl(savedUploadedImage)
        setProfileImage(null)
      } else if (savedProfileImage) {
        setProfileImage(savedProfileImage)
        setUploadedImageUrl(null)
      }
      
      setIsLoading(false)
    }

    const timeoutId = setTimeout(loadProfileData, 20)
    
    return () => clearTimeout(timeoutId)
  }, [])

  const updateProfileImage = (emoji) => {
    setProfileImage(emoji)
    setUploadedImageUrl(null)
    localStorage.setItem('tutor-ai-profile-image', emoji)
    localStorage.removeItem('tutor-ai-uploaded-image')
  }

  const updateUploadedImage = (imageUrl) => {
    setUploadedImageUrl(imageUrl)
    setProfileImage(null)
    localStorage.setItem('tutor-ai-uploaded-image', imageUrl)
    localStorage.removeItem('tutor-ai-profile-image')
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