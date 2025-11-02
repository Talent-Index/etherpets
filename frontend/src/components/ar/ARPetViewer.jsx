import React, { useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Camera, Scan, Volume2, VolumeX, RotateCcw, Zap } from 'lucide-react'

const ARPetViewer = ({ pet, onClose }) => {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [isARActive, setIsARActive] = useState(false)
  const [hasCameraAccess, setHasCameraAccess] = useState(false)
  const [isSoundOn, setIsSoundOn] = useState(true)
  const [petScale, setPetScale] = useState(1)
  const [petRotation, setPetRotation] = useState(0)

  useEffect(() => {
    if (isARActive) {
      startCamera()
    } else {
      stopCamera()
    }

    return () => {
      stopCamera()
    }
  }, [isARActive])

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      })
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setHasCameraAccess(true)
      }
    } catch (error) {
      console.error('Error accessing camera:', error)
      setHasCameraAccess(false)
    }
  }

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks()
      tracks.forEach(track => track.stop())
      videoRef.current.srcObject = null
    }
  }

  const toggleAR = () => {
    setIsARActive(!isARActive)
  }

  const toggleSound = () => {
    setIsSoundOn(!isSoundOn)
  }

  const handleScaleChange = (delta) => {
    setPetScale(prev => Math.max(0.5, Math.min(3, prev + delta)))
  }

  const handleRotate = () => {
    setPetRotation(prev => (prev + 45) % 360)
  }

  const capturePhoto = () => {
    if (canvasRef.current && videoRef.current) {
      const context = canvasRef.current.getContext('2d')
      canvasRef.current.width = videoRef.current.videoWidth
      canvasRef.current.height = videoRef.current.videoHeight
      context.drawImage(videoRef.current, 0, 0)
      
      // Add pet to the photo
      drawPetOnCanvas(context)
      
      // Convert to image and download
      const image = canvasRef.current.toDataURL('image/png')
      downloadImage(image, `etherpets-${pet.name}-${Date.now()}.png`)
    }
  }

  const drawPetOnCanvas = (context) => {
    // This would draw the pet on the canvas
    // For now, we'll just draw a placeholder
    const centerX = canvasRef.current.width / 2
    const centerY = canvasRef.current.height / 2
    
    context.fillStyle = 'rgba(91, 192, 190, 0.8)'
    context.beginPath()
    context.arc(centerX, centerY, 100, 0, 2 * Math.PI)
    context.fill()
    
    context.fillStyle = 'white'
    context.font = 'bold 24px Arial'
    context.textAlign = 'center'
    context.fillText(pet.name, centerX, centerY + 120)
  }

  const downloadImage = (dataUrl, filename) => {
    const link = document.createElement('a')
    link.href = dataUrl
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="fixed inset-0 bg-black z-50">
      {/* AR View */}
      <div className="relative w-full h-full">
        {/* Camera Feed */}
        {isARActive && (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        )}
        
        {/* Pet Overlay */}
        {isARActive && hasCameraAccess && (
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                y: [0, -10, 0]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              style={{
                transform: `scale(${petScale}) rotate(${petRotation}deg)`
              }}
              className="relative"
            >
              {/* Pet Visualization */}
              <div className="w-48 h-48 bg-gradient-to-br from-accent-cyan to-accent-teal rounded-full flex items-center justify-center shadow-2xl">
                <div className="text-6xl">
                  {getPetEmoji(pet.type)}
                </div>
              </div>
              
              {/* Pet Aura */}
              <motion.div
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 0.8, 0.5]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute inset-0 border-4 border-accent-mint rounded-full"
              />
            </motion.div>
          </div>
        )}

        {/* AR Controls Overlay */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
          <button
            onClick={onClose}
            className="bg-black/50 text-white p-3 rounded-full backdrop-blur-sm"
          >
            ✕
          </button>
          
          <div className="flex space-x-2">
            <button
              onClick={toggleSound}
              className="bg-black/50 text-white p-3 rounded-full backdrop-blur-sm"
            >
              {isSoundOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>
            
            <button
              onClick={capturePhoto}
              className="bg-black/50 text-white p-3 rounded-full backdrop-blur-sm"
            >
              <Camera className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Bottom Controls */}
        <div className="absolute bottom-4 left-4 right-4">
          {/* AR Toggle */}
          <div className="flex justify-center mb-4">
            <button
              onClick={toggleAR}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 flex items-center space-x-2 ${
                isARActive
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-accent-teal hover:bg-accent-mint text-primary'
              }`}
            >
              <Scan className="w-5 h-5" />
              <span>{isARActive ? 'Stop AR' : 'Start AR'}</span>
            </button>
          </div>

          {/* Pet Controls */}
          {isARActive && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-black/50 backdrop-blur-sm rounded-2xl p-4"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold">Pet Controls</h3>
                <div className="flex items-center space-x-2 text-accent-mint">
                  <Zap className="w-4 h-4" />
                  <span>AR Mode</span>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => handleScaleChange(-0.1)}
                  className="bg-white/20 text-white p-3 rounded-xl hover:bg-white/30 transition-colors"
                >
                  Zoom -
                </button>
                
                <button
                  onClick={handleRotate}
                  className="bg-white/20 text-white p-3 rounded-xl hover:bg-white/30 transition-colors flex items-center justify-center"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
                
                <button
                  onClick={() => handleScaleChange(0.1)}
                  className="bg-white/20 text-white p-3 rounded-xl hover:bg-white/30 transition-colors"
                >
                  Zoom +
                </button>
              </div>
              
              {/* Scale Indicator */}
              <div className="mt-3">
                <div className="flex justify-between text-xs text-gray-300 mb-1">
                  <span>Size: {Math.round(petScale * 100)}%</span>
                  <span>Rotation: {petRotation}°</span>
                </div>
                <div className="w-full bg-gray-600 rounded-full h-2">
                  <div 
                    className="h-2 bg-accent-mint rounded-full transition-all duration-300"
                    style={{ width: `${((petScale - 0.5) / 2.5) * 100}%` }}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Instructions */}
        {!isARActive && (
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-black/70 backdrop-blur-sm rounded-2xl p-8 max-w-sm text-center"
            >
              <Scan className="w-16 h-16 text-accent-cyan mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-4">AR Mode</h3>
              <p className="text-gray-300 mb-6">
                Place your {pet.name} in the real world using augmented reality. 
                Take photos and interact with your pet in your environment.
              </p>
              <button
                onClick={toggleAR}
                className="btn-primary w-full"
              >
                Start AR Experience
              </button>
            </motion.div>
          </div>
        )}

        {/* Hidden canvas for photo capture */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  )
}

const getPetEmoji = (type) => {
  const emojis = {
    'spirit_fox': '🦊',
    'moon_rabbit': '🐇',
    'star_cat': '🐈',
    'crystal_dragon': '🐲',
    'forest_deer': '🦌',
    'ocean_whale': '🐋'
  }
  return emojis[type] || '🐾'
}

export default ARPetViewer