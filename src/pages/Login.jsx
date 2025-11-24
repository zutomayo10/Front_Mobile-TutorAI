import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useDeviceDetection } from '../hooks/useDeviceDetection'
import { useAuth } from '../contexts/AuthContext'

const Login = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { isMobile } = useDeviceDetection()
  const { login, register, isLoading } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    lastNames: '',
    passwordNumber: '',
    age: ''
  })
  const [error, setError] = useState('')
  
  // Determinar si está en modo login o registro basado en la ruta
  const isLogin = location.pathname === '/login'

  // Limpiar formulario cuando cambia la ruta
  useEffect(() => {
    setFormData({
      name: '',
      lastNames: '',
      passwordNumber: '',
      age: ''
    })
    setError('')
  }, [location.pathname])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    
    // Para el campo de contraseña numérica, solo permitir números
    if (name === 'passwordNumber') {
      const numericValue = value.replace(/[^0-9]/g, '')
      setFormData(prev => ({
        ...prev,
        [name]: numericValue
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
    
    // Limpiar error cuando el usuario empiece a escribir
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!formData.name || !formData.lastNames || !formData.passwordNumber) {
      setError('Todos los campos son obligatorios')
      return
    }

    if (!isLogin && !formData.age) {
      setError('La edad es requerida para el registro')
      return
    }

    try {
      let result;
      
      if (isLogin) {
        // Intentar login
        result = await login({
          name: formData.name,
          lastNames: formData.lastNames,
          passwordNumber: formData.passwordNumber
        })
      } else {
        // Intentar registro
        result = await register({
          name: formData.name,
          lastNames: formData.lastNames,
          passwordNumber: formData.passwordNumber,
          age: parseInt(formData.age)
        })
      }

      if (result.success) {
        console.log(`${isLogin ? 'Login' : 'Registro'} exitoso, rol:`, result.role || result.data)
        navigate('/dashboard')
      } else {
        setError(result.error || `Error en el ${isLogin ? 'login' : 'registro'}`)
        
        // Si es error 403 en login, sugerir registro
        if (isLogin && result.statusCode === 403) {
          setError(result.error + ' ¿Necesitas registrarte?')
        }
      }
    } catch (err) {
      console.error(`Error en ${isLogin ? 'login' : 'registro'}:`, err)
      setError('Error de conexión. Verifica tu conexión a internet.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundColor: '#2d5016',
          backgroundImage: `url("/images/nuevo_fondo.jpg")`
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
            ¡Hola Genio!
          </h1>
          <p className="text-white text-lg opacity-90 leading-relaxed px-2">
            {isLogin ? '¡Inicia sesión y continúa tu aventura en las matemáticas!' : '¡Regístrate y comienza tu aventura en el mundo de las matemáticas!'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500 text-white rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Nombre:
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Nombre"
                className="w-full pl-10 pr-4 py-3 bg-white rounded-lg border border-gray-200 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-base"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Apellidos:
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                name="lastNames"
                value={formData.lastNames}
                onChange={handleInputChange}
                placeholder="Apellidos"
                className="w-full pl-10 pr-4 py-3 bg-white rounded-lg border border-gray-200 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-base"
                required
              />
            </div>
          </div>

          {!isLogin && (
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Edad:
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  placeholder="Edad"
                  min="5"
                  max="100"
                  className="w-full pl-10 pr-4 py-3 bg-white rounded-lg border border-gray-200 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-base"
                  required={!isLogin}
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Número de contraseña:
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="password"
                name="passwordNumber"
                value={formData.passwordNumber}
                onChange={handleInputChange}
                placeholder="Número de contraseña"
                className="w-full pl-10 pr-4 py-3 bg-white rounded-lg border border-gray-200 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-base"
                pattern="[0-9]*"
                inputMode="numeric"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-6 rounded-lg text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 mt-6 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? 
              (isLogin ? 'INICIANDO...' : 'REGISTRANDO...') : 
              (isLogin ? 'INICIAR SESIÓN' : 'REGISTRARSE')
            }
          </button>

          <div className="text-center mt-4">
            <button
              type="button"
              onClick={() => {
                navigate(isLogin ? '/register' : '/login')
              }}
              className="text-white text-sm underline hover:text-yellow-200 transition-colors duration-200"
            >
              {isLogin ? '¿No tienes cuenta? Regístrate aquí' : '¿Ya tienes cuenta? Inicia sesión aquí'}
            </button>
          </div>
        </form>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-green-900 to-transparent opacity-30 pointer-events-none"></div>
    </div>
  )
}

export default Login