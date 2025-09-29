import React from 'react'

const Avatar = ({ 
  profileImage, 
  uploadedImageUrl, 
  isLoading = false, 
  size = 'md', 
  className = '', 
  showLoading = true,
  ...props 
}) => {
  const sizeClasses = {
    sm: 'w-12 h-12 text-xl',
    md: 'w-16 h-16 text-3xl',
    lg: 'w-20 h-20 text-4xl',
    xl: 'w-28 h-28 text-6xl'
  }

  const baseClasses = `
    bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 
    rounded-full flex items-center justify-center border-4 border-white 
    shadow-2xl ${sizeClasses[size]} ${className}
  `

  if (isLoading && showLoading) {
    return (
      <div className={`${baseClasses} animate-pulse bg-gray-300`} {...props}>
        <div className="w-6 h-6 bg-gray-400 rounded-full"></div>
      </div>
    )
  }

  return (
    <div className={baseClasses} {...props}>
      {uploadedImageUrl ? (
        <img 
          src={uploadedImageUrl} 
          alt="Profile" 
          className="w-full h-full rounded-full object-cover"
          onError={(e) => {
            e.target.style.display = 'none'
            e.target.nextSibling.style.display = 'block'
          }}
        />
      ) : (
        <span className="text-white filter drop-shadow-lg">
          {profileImage}
        </span>
      )}
      {uploadedImageUrl && (
        <span 
          className="text-white filter drop-shadow-lg" 
          style={{ display: 'none' }}
        >
          {profileImage || '🧙‍♂️'}
        </span>
      )}
    </div>
  )
}

export default Avatar