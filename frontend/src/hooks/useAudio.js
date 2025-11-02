import { useState, useEffect, useRef } from 'react'

export const useAudio = (url, options = {}) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(options.volume || 1)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const audioRef = useRef(null)

  useEffect(() => {
    const audio = new Audio(url)
    audioRef.current = audio

    const setAudioData = () => {
      setDuration(audio.duration)
      setCurrentTime(audio.currentTime)
    }

    const setAudioTime = () => setCurrentTime(audio.currentTime)
    const setAudioEnd = () => setIsPlaying(false)

    audio.addEventListener('loadeddata', setAudioData)
    audio.addEventListener('timeupdate', setAudioTime)
    audio.addEventListener('ended', setAudioEnd)

    return () => {
      audio.removeEventListener('loadeddata', setAudioData)
      audio.removeEventListener('timeupdate', setAudioTime)
      audio.removeEventListener('ended', setAudioEnd)
      audio.pause()
    }
  }, [url])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

  const play = async () => {
    if (audioRef.current) {
      try {
        await audioRef.current.play()
        setIsPlaying(true)
      } catch (error) {
        console.error('Error playing audio:', error)
      }
    }
  }

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      setIsPlaying(false)
    }
  }

  const toggle = () => {
    if (isPlaying) {
      pause()
    } else {
      play()
    }
  }

  const seek = (time) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time
      setCurrentTime(time)
    }
  }

  const setAudioVolume = (newVolume) => {
    setVolume(Math.max(0, Math.min(1, newVolume)))
  }

  return {
    isPlaying,
    volume,
    duration,
    currentTime,
    play,
    pause,
    toggle,
    seek,
    setVolume: setAudioVolume
  }
}