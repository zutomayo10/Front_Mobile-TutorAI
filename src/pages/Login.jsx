import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDeviceDetection } from '../hooks/useDeviceDetection'

const Login = () => {
  const navigate = useNavigate()
  const { isMobile } = useDeviceDetection()
  const [formData, setFormData] = useState({
    nombre: '',
    contrasena: ''
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Datos del formulario:', formData)
    
    alert('¡Login exitoso! Bienvenido a TutorAI')
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundColor: '#2d5016',
          backgroundImage: `
            url("/images/bosque.jpg"),
            linear-gradient(135deg, #2d5016 0%, #4a7c23 30%, #3d6b1a 60%, #2d5016 100%),
            radial-gradient(ellipse at top, rgba(106, 170, 100, 0.3) 0%, transparent 50%),
            radial-gradient(ellipse at bottom, rgba(45, 80, 22, 0.4) 0%, transparent 50%)
          `
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
      </div>

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-32 h-48 opacity-60">
        </div>
        <div className="absolute top-10 right-0 w-24 h-36 opacity-40">
        </div>
      </div>

      <div className="relative z-10 w-full max-w-sm mx-4">
        <div className="text-center mb-8">
          <h1 className="text-white text-4xl font-bold leading-tight mb-4">
            ¡Hola, Futuro<br />Genio!
          </h1>
          <p className="text-white text-lg opacity-90 leading-relaxed px-2">
            ¡Regístrate y comienza tu aventura<br />
            en el mundo de las matemáticas!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Ingresa tu nombre:
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                placeholder="Nombre"
                className="w-full pl-10 pr-4 py-3 bg-white rounded-lg border border-gray-200 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-base"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Ingresa tu contraseña:
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="password"
                name="contrasena"
                value={formData.contrasena}
                onChange={handleInputChange}
                placeholder="Contraseña"
                className="w-full pl-10 pr-4 py-3 bg-white rounded-lg border border-gray-200 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-base"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-6 rounded-lg text-lg transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 transition-transform mt-6"
          >
            INICIO
          </button>
        </form>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-green-900 to-transparent opacity-30 pointer-events-none"></div>
    </div>
  )
}

export default Login