import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const Confetti = ({ isActive = false, duration = 3000 }) => {
  const [confettiPieces, setConfettiPieces] = useState([])

  useEffect(() => {
    if (isActive) {
      // Generate confetti pieces
      const pieces = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: -10,
        rotation: Math.random() * 360,
        color: getRandomColor(),
        shape: Math.random() > 0.5 ? 'circle' : 'rectangle',
        size: Math.random() * 10 + 5
      }))
      
      setConfettiPieces(pieces)

      // Clear confetti after duration
      const timer = setTimeout(() => {
        setConfettiPieces([])
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [isActive, duration])

  const getRandomColor = () => {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
      '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
    ]
    return colors[Math.floor(Math.random() * colors.length)]
  }

  if (!isActive || confettiPieces.length === 0) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {confettiPieces.map((piece) => (
        <motion.div
          key={piece.id}
          initial={{
            x: `${piece.x}vw`,
            y: `${piece.y}vh`,
            rotate: piece.rotation,
            scale: 0
          }}
          animate={{
            x: `${piece.x + (Math.random() - 0.5) * 50}vw`,
            y: '100vh',
            rotate: piece.rotation + 360,
            scale: 1
          }}
          transition={{
            duration: Math.random() * 2 + 1,
            ease: "easeOut"
          }}
          className="absolute"
          style={{
            width: piece.size,
            height: piece.size,
            backgroundColor: piece.color,
            borderRadius: piece.shape === 'circle' ? '50%' : '2px'
          }}
        />
      ))}
    </div>
  )
}

export default Confetti