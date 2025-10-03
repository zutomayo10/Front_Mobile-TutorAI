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
    <div className="min-h-screen relative overflow-hidden">
      <div
        className="fixed inset-0 fixed-background"
        style={{
          backgroundImage: `url('./images/perfil_bosque.jpeg')`,
          backgroundAttachment: 'fixed',
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
          filter: 'brightness(0.85)'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/10 via-blue-900/5 to-purple-900/10"></div>
      </div>

      <div className="relative z-10 flex h-screen">
        {!isMobile && <Sidebar />}

        <div className={`flex-1 ${isMobile ? 'pb-20 main-content-mobile' : 'pl-64'} overflow-y-auto`}>
          <div className="p-4 md:p-6">
            
            <div className="mb-6">
              <div className="rounded-2xl p-4 shadow-xl border border-white/20" style={{backgroundColor: '#2ECC71'}}>
                <div className="text-center">
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
                  <div className="rounded-2xl px-6 py-3 inline-block border-2 border-white/30 shadow-xl" style={{backgroundColor: '#CBF3DC'}}>
                    <h1 className="text-gray-800 text-3xl font-bold drop-shadow-2xl mb-1">🌟 {userName} 🌟</h1>
                    <p className="text-green-700 text-lg font-semibold drop-shadow">¡Mago Matemático en Entrenamiento!</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <div className="rounded-2xl p-4 shadow-xl border border-white/20" style={{backgroundColor: '#239B56'}}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-yellow-300 text-xl">⚡</span>
                    <span className="text-white font-semibold">Energía Mágica</span>
                  </div>
                  <div className="rounded-full px-4 py-1 border border-white/30" style={{backgroundColor: '#F19506'}}>
                    <span className="text-white text-sm font-bold">{userExp.current}/{userExp.total} XP</span>
                  </div>
                </div>
                <div className="relative">
                  <div className="w-full bg-black/40 rounded-full h-3 overflow-hidden border border-white/20">
                    <div 
                      className="h-full rounded-full transition-all duration-1000 relative"
                      style={{ width: `${(userExp.current / userExp.total) * 100}%`, backgroundColor: '#3FD47E' }}
                    >
                    </div>
                  </div>
                  <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold drop-shadow-lg">
                      {Math.round((userExp.current / userExp.total) * 100)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <div className="rounded-2xl p-4 shadow-xl border border-white/20" style={{backgroundColor: '#239B56'}}>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="rounded-2xl p-4 text-center border border-white/30" style={{backgroundColor: '#CBF3DC'}}>
                    <div className="text-3xl mb-2">📚</div>
                    <div className="text-gray-700 text-xs font-bold">Lecciones Completadas</div>
                    <div className="text-green-700 text-xl font-bold drop-shadow">8</div>
                  </div>
                  <div className="rounded-2xl p-4 text-center border border-white/30" style={{backgroundColor: '#CBF3DC'}}>
                    <div className="text-3xl mb-2">🎯</div>
                    <div className="text-gray-700 text-xs font-bold">Precisión</div>
                    <div className="text-green-700 text-xl font-bold drop-shadow">87%</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <div className="rounded-2xl p-4 shadow-xl border border-white/20" style={{backgroundColor: '#239B56'}}>
                <h2 className="text-white text-2xl font-bold mb-4 text-center drop-shadow-lg">
                  <span className="inline-block">🏆</span>
                  <span className="mx-3">Tus Increíbles Logros</span>
                  <span className="inline-block">🏆</span>
                </h2>
                <div className="flex justify-center space-x-8 mb-4">
                  {logros.map((logro, index) => (
                    <div
                      key={logro.id}
                      className="relative cursor-pointer group"
                    >
                      <div
                        className={`w-20 h-20 rounded-full flex items-center justify-center border-4 shadow-2xl relative transform transition-all duration-300 ${
                          logro.achieved
                            ? `bg-gradient-to-br ${logro.color} border-white`
                            : 'bg-gray-600 border-gray-500 opacity-60'
                        }`}
                      >
                        <span className="text-3xl filter drop-shadow-lg">{logro.icon}</span>
                        {logro.achieved && (
                          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/40 to-transparent opacity-80"></div>
                        )}
                        {logro.achieved && (
                          <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                            <span className="text-xs">✨</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="text-center">
                  <button className="text-white font-bold py-3 px-8 rounded-full shadow-xl transition-all duration-300 border-2 border-white/50 hover:opacity-90" style={{backgroundColor: '#F19506'}}>
                    <span className="flex items-center space-x-2">
                      <span className="text-lg">🎯</span>
                      <span>¡Ver Todos los Logros!</span>
                      <span className="text-lg">✨</span>
                    </span>
                  </button>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <div className="rounded-2xl p-4 shadow-xl border border-white/20" style={{backgroundColor: '#239B56'}}>
                <h3 className="text-white text-xl font-bold mb-4 text-center flex items-center justify-center">
                  <span className="mr-2 text-2xl">📊</span>
                  <span>Tu Progreso Fantástico</span>
                  <span className="ml-2 text-2xl">🚀</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="rounded-2xl p-4 text-center border border-white/30" style={{backgroundColor: '#CBF3DC'}}>
                    <div className="text-3xl mb-2">🎯</div>
                    <div className="text-gray-700 font-bold text-lg">Desafíos</div>
                    <div className="text-green-700 text-2xl font-bold">{completedChallenges}/{totalChallenges}</div>
                    <div className="w-full bg-gray-300 rounded-full h-2 mt-2">
                      <div 
                        className="h-2 rounded-full"
                        style={{ width: `${(completedChallenges / totalChallenges) * 100}%`, backgroundColor: '#3FD47E' }}
                      ></div>
                    </div>
                  </div>
                  <div className="rounded-2xl p-4 text-center border border-white/30" style={{backgroundColor: '#CBF3DC'}}>
                    <div className="text-3xl mb-2">🏅</div>
                    <div className="text-gray-700 font-bold text-lg">Logros</div>
                    <div className="text-green-700 text-2xl font-bold">{achievements}/{totalAchievements}</div>
                    <div className="w-full bg-gray-300 rounded-full h-2 mt-2">
                      <div 
                        className="h-2 rounded-full"
                        style={{ width: `${(achievements / totalAchievements) * 100}%`, backgroundColor: '#3FD47E' }}
                      ></div>
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
              {isMobile ? (
                // AJUSTE PARA MOBILE
                <div className="overflow-x-auto pb-2">
                  <div className="flex gap-3 px-2" style={{ width: 'max-content' }}>
                    {avatarOptions.map((emoji, index) => (
                      <button
                        key={index}
                        onClick={() => handleAvatarSelect(emoji)}
                        className={`w-12 h-12 rounded-xl border-2 transition-all duration-300 hover:scale-110 flex items-center justify-center text-2xl flex-shrink-0 ${
                          tempProfileImage === emoji
                            ? 'border-yellow-400 bg-yellow-400/20 shadow-lg'
                            : 'border-white/30 bg-white/10 hover:border-yellow-400/50'
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-center mt-2">
                    <span className="text-white/60 text-xs">⬅️ Desliza para ver más ➡️</span>
                  </div>
                </div>
              ) : (
                // AJUSTE PARA PC
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
              )}
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