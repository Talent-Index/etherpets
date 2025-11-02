import { useState, useEffect } from 'react'

export const useTimer = (initialTime = 0, active = false) => {
  const [time, setTime] = useState(initialTime)
  const [isActive, setIsActive] = useState(active)

  useEffect(() => {
    let interval = null

    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime(time => time - 1)
      }, 1000)
    } else if (time === 0) {
      setIsActive(false)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive, time])

  const start = (duration = null) => {
    if (duration !== null) {
      setTime(duration)
    }
    setIsActive(true)
  }

  const pause = () => {
    setIsActive(false)
  }

  const reset = (duration = null) => {
    setIsActive(false)
    setTime(duration !== null ? duration : initialTime)
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return {
    time,
    isActive,
    start,
    pause,
    reset,
    formatTime
  }
}