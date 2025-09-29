export const isTouchDevice = () => {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0
}

export const getDeviceType = () => {
  const width = window.innerWidth
  if (width < 768) return 'mobile'
  if (width < 1024) return 'tablet'
  return 'desktop'
}

export const isIOS = () => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent)
}

export const isAndroid = () => {
  return /Android/.test(navigator.userAgent)
}

export const canInstallPWA = () => {
  return 'serviceWorker' in navigator && 'PushManager' in window
}

export const getViewportHeight = () => {
  // Para manejar correctamente la altura en móviles considerando barras del navegador
  return window.visualViewport ? window.visualViewport.height : window.innerHeight
}

// Utilidad para manejar el scroll
export const smoothScrollTo = (element, options = {}) => {
  const defaultOptions = {
    behavior: 'smooth',
    block: 'start',
    inline: 'nearest'
  }
  
  if (element) {
    element.scrollIntoView({ ...defaultOptions, ...options })
  }
}
//resize
export const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}