import React, { useState } from 'react'
import { useDeviceDetection } from '../hooks/useDeviceDetection'
import { useUserProfile } from '../hooks/useUserProfile'
import Sidebar from '../components/Sidebar'
import BottomNavigation from '../components/BottomNavigation'
import Avatar from '../components/Avatar'

const Profile = () => {
  const { isMobile } = useDeviceDetection()
  const { 
    profileImage, 
    uploadedImageUrl, 
    userName, 
    isLoading,
    updateProfileImage, 
    updateUploadedImage, 
    getCurrentAvatar 
  } = useUserProfile()
  
  const [userLevel] = useState(15)
  const [userExp] = useState({ current: 240, total: 400 })
  const [completedChallenges] = useState(3)
  const [totalChallenges] = useState(15)
  const [achievements] = useState(10)
  const [totalAchievements] = useState(20)
  
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)
  
  const [tempProfileImage, setTempProfileImage] = useState(null)
  const [tempUploadedImageUrl, setTempUploadedImageUrl] = useState(null)

  const avatarOptions = [
    '🧙‍♂️', '🧙‍♀️', '👦', '👧', '🦸‍♂️', '🦸‍♀️', 
    '🧑‍🎓', '👩‍🎓', '🤓', '😊', '🤗', '🥳',
    '🦄', '🐉', '🦋', '🌟', '⚡', '🔥'
  ]

  const handleImageChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setTempUploadedImageUrl(e.target.result)
        setTempProfileImage(null)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAvatarSelect = (emoji) => {
    setTempProfileImage(emoji)
    setTempUploadedImageUrl(null)
  }

  const handleSaveChanges = () => {
    if (tempUploadedImageUrl) {
      updateUploadedImage(tempUploadedImageUrl)
    } else if (tempProfileImage) {
      updateProfileImage(tempProfileImage)
    }
    handleCloseModal()
  }

  const handleCloseModal = () => {
    setTempProfileImage(null)
    setTempUploadedImageUrl(null)
    setIsImageModalOpen(false)
  }

  const getPreviewAvatar = () => {
    if (tempUploadedImageUrl) {
      return { type: 'image', value: tempUploadedImageUrl }
    }
    if (tempProfileImage) {
      return { type: 'emoji', value: tempProfileImage }
    }
    if (uploadedImageUrl) {
      return { type: 'image', value: uploadedImageUrl }
    }
    return { type: 'emoji', value: profileImage }
  }

  const logros = [
    {
      id: 1,
      name: 'Primer Desafío',
      icon: '🥉',
      color: 'from-orange-400 to-orange-600',
      achieved: true
    },
    {
      id: 2,
      name: 'Matemático Plata',
      icon: '🥈',
      color: 'from-gray-400 to-gray-600',
      achieved: true
    },
    {
      id: 3,
      name: 'Experto Oro',
      icon: '🏆',
      color: 'from-yellow-400 to-yellow-600',
      achieved: false
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-green-500 to-green-600 relative">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('./images/perfil_bosque.jpeg')`,
          filter: 'brightness(0.85)'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/10 via-blue-900/5 to-purple-900/10"></div>
      </div>

      <div className="relative z-10 flex">
        {!isMobile && <Sidebar />}

        <div className={`flex-1 ${!isMobile ? 'ml-64' : ''} ${isMobile ? 'pb-20' : ''} min-h-screen flex flex-col p-6`}>
          
          <div className="bg-gradient-to-b from-green-600/30 to-green-800/40 backdrop-blur-md rounded-3xl shadow-2xl border-4 border-green-400/30 flex-1 overflow-hidden">
            
            <div className="p-6 h-full flex flex-col">
              
              <div className="text-center mb-8">
                <div className="relative inline-block mb-4">
                  <Avatar
                    profileImage={profileImage}
                    uploadedImageUrl={uploadedImageUrl}
                    isLoading={isLoading}
                    size="xl"
                    className="transform hover:scale-110 transition-all duration-300 cursor-pointer group"
                    onClick={() => setIsImageModalOpen(true)}
                  />
                  
                  {!isLoading && (
                    <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center cursor-pointer"
                         onClick={() => setIsImageModalOpen(true)}>
                      <span className="text-white text-2xl">📷</span>
                    </div>
                  )}
                  
                  {!isLoading && (
                    <button
                      onClick={() => setIsImageModalOpen(true)}
                      className="absolute -bottom-1 -right-1 w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center border-3 border-white shadow-lg hover:scale-110 transition-all duration-300 z-10"
                    >
                      <span className="text-white text-lg">✏️</span>
                    </button>
                  )}
                  
                  <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-bold rounded-full w-12 h-12 flex items-center justify-center border-3 border-white shadow-lg z-0">
                    <span className="text-lg">{userLevel}</span>
                  </div>
                  <div className="absolute -top-2 -left-2 text-yellow-300 text-2xl">✨</div>
                  <div className="absolute -top-3 right-4 text-yellow-300 text-xl">⭐</div>
                  <div className="absolute bottom-2 -left-3 text-yellow-300 text-lg">💫</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-3 inline-block border-2 border-white/30 shadow-xl">
                  <h1 className="text-white text-3xl font-bold drop-shadow-2xl mb-1">🌟 {userName} 🌟</h1>
                  <p className="text-yellow-200 text-lg font-semibold drop-shadow">¡Mago Matemático en Entrenamiento!</p>
                </div>
              </div>

              <div className="mb-8">
                <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-3xl p-6 border-2 border-white/30 shadow-xl">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-white text-xl font-bold flex items-center">
                      <span className="mr-2 text-2xl">⚡</span>
                      <span className="bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">Energía Mágica</span>
                      <span className="ml-2 text-2xl">🔮</span>
                    </span>
                    <div className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-full px-5 py-2 border-2 border-white/50 shadow-lg">
                      <span className="text-white text-lg font-bold drop-shadow">{userExp.current}/{userExp.total} XP</span>
                    </div>
                  </div>
                  <div className="w-full bg-black/40 rounded-full h-6 overflow-hidden shadow-inner mb-4 border-2 border-white/20">
                    <div 
                      className="bg-gradient-to-r from-yellow-300 via-orange-400 to-red-500 h-full rounded-full transition-all duration-1000 shadow-lg relative overflow-hidden"
                      style={{ width: `${(userExp.current / userExp.total) * 100}%` }}
                    >
                      <div className="absolute inset-0 bg-white/40 rounded-full"></div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="bg-gradient-to-br from-blue-500/40 to-cyan-500/40 backdrop-blur-sm rounded-2xl p-4 text-center border-2 border-blue-400/50 shadow-lg transform hover:scale-105 transition-all duration-300">
                      <div className="text-3xl mb-2">📚</div>
                      <div className="text-white text-xs font-bold">Lecciones</div>
                      <div className="text-yellow-300 text-xl font-bold drop-shadow">8</div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-500/40 to-pink-500/40 backdrop-blur-sm rounded-2xl p-4 text-center border-2 border-purple-400/50 shadow-lg transform hover:scale-105 transition-all duration-300">
                      <div className="text-3xl mb-2">⭐</div>
                      <div className="text-white text-xs font-bold">Estrellas</div>
                      <div className="text-yellow-300 text-xl font-bold drop-shadow">24</div>
                    </div>
                    <div className="bg-gradient-to-br from-green-500/40 to-emerald-500/40 backdrop-blur-sm rounded-2xl p-4 text-center border-2 border-green-400/50 shadow-lg transform hover:scale-105 transition-all duration-300">
                      <div className="text-3xl mb-2">🎯</div>
                      <div className="text-white text-xs font-bold">Precisión</div>
                      <div className="text-yellow-300 text-xl font-bold drop-shadow">87%</div>
                    </div>
                  </div>
                  
                  <div className="bg-indigo-500/30 backdrop-blur-sm rounded-2xl p-3 border border-indigo-400/50">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <span className="text-xl">🎯</span>
                        <span className="text-white font-bold">Precisión</span>
                      </div>
                      <span className="text-yellow-300 text-xl font-bold">87%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex-1 flex flex-col">
                <div className="mb-6">
                  <div className="bg-gradient-to-r from-yellow-400/20 to-orange-500/20 backdrop-blur-sm rounded-3xl p-6 border-2 border-yellow-400/30 shadow-xl mb-6">
                    <h2 className="text-white text-3xl font-bold mb-6 text-center drop-shadow-lg">
                      <span className="inline-block">🏆</span>
                      <span className="mx-3 bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">Tus Increíbles Logros</span>
                      <span className="inline-block">🏆</span>
                    </h2>
                    <div className="flex justify-center space-x-8 mb-6">
                      {logros.map((logro, index) => (
                        <div
                          key={logro.id}
                          className="relative cursor-pointer group"
                        >
                          <div
                            className={`w-24 h-24 rounded-full flex items-center justify-center border-4 shadow-2xl relative transform transition-all duration-300 group-hover:scale-110 ${
                              logro.achieved
                                ? `bg-gradient-to-br ${logro.color} border-white`
                                : 'bg-gray-600 border-gray-500 opacity-60'
                            }`}
                          >
                            <span className="text-4xl filter drop-shadow-lg">{logro.icon}</span>
                            {logro.achieved && (
                              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/40 to-transparent opacity-80"></div>
                            )}
                            {logro.achieved && (
                              <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                                <span className="text-sm">✨</span>
                              </div>
                            )}
                            {logro.achieved && (
                              <>
                                <div className="absolute -top-3 -left-3 text-yellow-300 text-lg">⭐</div>
                                <div className="absolute -bottom-3 -right-3 text-yellow-300 text-lg">💫</div>
                              </>
                            )}
                          </div>
                          <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 backdrop-blur-sm text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap border border-white/20">
                            {logro.name}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="text-center">
                    <button className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 hover:from-orange-600 hover:via-red-600 hover:to-pink-600 text-white font-bold py-4 px-10 rounded-full shadow-xl transform hover:scale-110 transition-all duration-300 border-3 border-white/50">
                      <span className="flex items-center space-x-3">
                        <span className="text-xl">🎯</span>
                        <span className="text-lg">¡Ver Todos los Logros!</span>
                        <span className="text-xl">✨</span>
                      </span>
                    </button>
                  </div>
                </div>

                <div className="mt-auto">
                  <div className="bg-gradient-to-r from-purple-600/40 to-blue-600/40 backdrop-blur-md rounded-3xl p-6 border-2 border-white/30 shadow-2xl">
                    <h3 className="text-white text-2xl font-bold mb-6 text-center flex items-center justify-center">
                      <span className="mr-3 text-3xl">📊</span>
                      <span className="bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">Tu Progreso Fantástico</span>
                      <span className="ml-3 text-3xl">🚀</span>
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/30">
                        <div className="text-3xl mb-2">🎯</div>
                        <div className="text-white font-bold text-lg">Desafíos</div>
                        <div className="text-yellow-300 text-2xl font-bold">{completedChallenges}/{totalChallenges}</div>
                        <div className="w-full bg-black/30 rounded-full h-2 mt-2">
                          <div 
                            className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full"
                            style={{ width: `${(completedChallenges / totalChallenges) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/30">
                        <div className="text-3xl mb-2">🏅</div>
                        <div className="text-white font-bold text-lg">Logros</div>
                        <div className="text-yellow-300 text-2xl font-bold">{achievements}/{totalAchievements}</div>
                        <div className="w-full bg-black/30 rounded-full h-2 mt-2">
                          <div 
                            className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full"
                            style={{ width: `${(achievements / totalAchievements) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isImageModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-purple-600/90 to-blue-600/90 backdrop-blur-md rounded-3xl p-6 max-w-md w-full border-2 border-white/30 shadow-2xl">
            <div className="text-center mb-6">
              <h3 className="text-white text-2xl font-bold mb-2">
                🎨 ¡Cambia tu Avatar! 🎨
              </h3>
              <p className="text-white/80">Elige un emoji divertido o sube tu propia foto</p>
            </div>

            <div className="mb-6">
              <h4 className="text-white font-semibold mb-3 text-center">📱 Avatares Divertidos</h4>
              <div className="grid grid-cols-6 gap-3">
                {avatarOptions.map((emoji, index) => (
                  <button
                    key={index}
                    onClick={() => handleAvatarSelect(emoji)}
                    className={`w-12 h-12 rounded-xl border-2 transition-all duration-300 hover:scale-110 flex items-center justify-center text-2xl ${
                      tempProfileImage === emoji
                        ? 'border-yellow-400 bg-yellow-400/20 shadow-lg'
                        : 'border-white/30 bg-white/10 hover:border-yellow-400/50'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-white font-semibold mb-3 text-center">📷 Tu Propia Foto</h4>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="imageUpload"
                />
                <label
                  htmlFor="imageUpload"
                  className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold py-3 px-6 rounded-xl cursor-pointer transition-all duration-300 flex items-center justify-center space-x-2 border-2 border-white/30"
                >
                  <span className="text-xl">📸</span>
                  <span>Subir Foto</span>
                </label>
              </div>
              {tempUploadedImageUrl && (
                <div className="mt-3 text-center">
                  <div className="w-16 h-16 mx-auto rounded-full overflow-hidden border-2 border-white/50">
                    <img src={tempUploadedImageUrl} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                  <p className="text-white/80 text-sm mt-2">¡Foto lista para guardar!</p>
                </div>
              )}
            </div>

            <div className="mb-6">
              <h4 className="text-white font-semibold mb-3 text-center">👀 Vista Previa</h4>
              <div className="flex justify-center">
                <Avatar
                  profileImage={tempProfileImage || profileImage}
                  uploadedImageUrl={tempUploadedImageUrl || (tempProfileImage ? null : uploadedImageUrl)}
                  isLoading={false}
                  size="lg"
                  showLoading={false}
                />
              </div>
              <p className="text-center text-white/80 text-sm mt-2">
                {tempProfileImage || tempUploadedImageUrl ? '¡Así se verá tu nuevo avatar!' : 'Tu avatar actual'}
              </p>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleCloseModal}
                className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300"
              >
                ❌ Cancelar
              </button>
              <button
                onClick={handleSaveChanges}
                disabled={!tempProfileImage && !tempUploadedImageUrl}
                className={`flex-1 font-bold py-3 px-6 rounded-xl transition-all duration-300 ${
                  tempProfileImage || tempUploadedImageUrl
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white'
                    : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                }`}
              >
                ✅ Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}

      {isMobile && <BottomNavigation />}
    </div>
  )
}

export default Profile