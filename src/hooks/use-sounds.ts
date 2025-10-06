import { useCallback } from 'react'

export function useSounds() {
  // Create sound effects using Web Audio API
  const createTone = useCallback((frequency: number, duration: number, type: OscillatorType = 'sine') => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)
    
    oscillator.frequency.value = frequency
    oscillator.type = type
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration)
    
    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + duration)
  }, [])

  const playSelectionSound = useCallback(() => {
    // Pleasant selection sound - major chord
    createTone(523, 0.15) // C5
    setTimeout(() => createTone(659, 0.1), 50) // E5
    setTimeout(() => createTone(784, 0.1), 100) // G5
  }, [createTone])

  const playEliminationSound = useCallback(() => {
    // Subtle elimination sound - descending tone
    createTone(400, 0.2, 'triangle')
    setTimeout(() => createTone(300, 0.3, 'triangle'), 100)
  }, [createTone])

  return {
    playSelectionSound,
    playEliminationSound
  }
}