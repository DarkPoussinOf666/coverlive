import { useState, useEffect, useRef, useCallback } from 'react'

interface UseAutoScrollOptions {
  speedPps: number // Pixels par seconde
  onFinished?: () => void
}

export function useAutoScroll({ speedPps, onFinished }: UseAutoScrollOptions) {
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const speedRef = useRef<number>(speedPps)
  const animationFrameRef = useRef<number | null>(null)
  const lastTimeRef = useRef<number | null>(null)
  
  // Accumulateur flottant crucial : évite la troncature à 0 de scrollTop par les navigateurs à 60fps
  const scrollPosRef = useRef<number>(0)
  const isProgrammaticScrollRef = useRef<boolean>(false)

  // Synchroniser la vitesse
  useEffect(() => {
    speedRef.current = speedPps
  }, [speedPps])

  // Synchroniser la position initiale et écouter les scrolls manuels de l'utilisateur
  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const handleManualScroll = () => {
      if (!isProgrammaticScrollRef.current) {
        scrollPosRef.current = el.scrollTop
      }
    }

    el.addEventListener('scroll', handleManualScroll, { passive: true })
    scrollPosRef.current = el.scrollTop

    return () => {
      el.removeEventListener('scroll', handleManualScroll)
    }
  }, [])

  const scrollStep = useCallback((time: number) => {
    const el = containerRef.current
    if (el) {
      if (lastTimeRef.current !== null) {
        const deltaSec = (time - lastTimeRef.current) / 1000
        // Limiter deltaSec à 0.1s max pour éviter les sauts brutaux si l'onglet perd le focus
        const clampedDelta = Math.min(deltaSec, 0.1)
        const distance = speedRef.current * clampedDelta
        
        const maxScroll = el.scrollHeight - el.clientHeight

        // Ne s'arrêter que s'il y a réellement du contenu scrollable et qu'on atteint le bas
        if (maxScroll > 10 && scrollPosRef.current >= maxScroll - 4) {
          setIsPlaying(false)
          lastTimeRef.current = null
          if (onFinished) onFinished()
          return
        }

        // Avancer la position flottante
        scrollPosRef.current += distance
        if (maxScroll > 0) {
          scrollPosRef.current = Math.min(scrollPosRef.current, maxScroll)
        }

        // Appliquer au DOM
        isProgrammaticScrollRef.current = true
        el.scrollTop = scrollPosRef.current
        isProgrammaticScrollRef.current = false
      }
    }

    lastTimeRef.current = time
    animationFrameRef.current = requestAnimationFrame(scrollStep)
  }, [onFinished])

  const start = useCallback(() => {
    if (containerRef.current) {
      scrollPosRef.current = containerRef.current.scrollTop
    }
    setIsPlaying(true)
    lastTimeRef.current = null
  }, [])

  const pause = useCallback(() => {
    setIsPlaying(false)
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }
    lastTimeRef.current = null
    if (containerRef.current) {
      scrollPosRef.current = containerRef.current.scrollTop
    }
  }, [])

  const toggle = useCallback(() => {
    setIsPlaying((prev) => {
      if (prev) {
        if (animationFrameRef.current !== null) {
          cancelAnimationFrame(animationFrameRef.current)
          animationFrameRef.current = null
        }
        lastTimeRef.current = null
        if (containerRef.current) {
          scrollPosRef.current = containerRef.current.scrollTop
        }
        return false
      } else {
        if (containerRef.current) {
          scrollPosRef.current = containerRef.current.scrollTop
        }
        lastTimeRef.current = null
        return true
      }
    })
  }, [])

  const resetToTop = useCallback(() => {
    if (containerRef.current) {
      scrollPosRef.current = 0
      isProgrammaticScrollRef.current = true
      containerRef.current.scrollTop = 0
      isProgrammaticScrollRef.current = false
    }
  }, [])

  useEffect(() => {
    if (isPlaying) {
      if (containerRef.current) {
        scrollPosRef.current = containerRef.current.scrollTop
      }
      lastTimeRef.current = null
      animationFrameRef.current = requestAnimationFrame(scrollStep)
    } else {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current)
        animationFrameRef.current = null
      }
      lastTimeRef.current = null
    }

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [isPlaying, scrollStep])

  return {
    containerRef,
    isPlaying,
    start,
    pause,
    toggle,
    resetToTop,
  }
}
