import { useCallback, useRef, useState, useEffect } from 'react'

interface ResizeOptions {
  minWidth?: number
  maxWidth?: number
  aspectRatio?: number
  throttleMs?: number
  onResize?: (width: number, height: number) => void
  onResizeStart?: () => void
  onResizeEnd?: () => void
}

interface ResizeState {
  isResizing: boolean
  tempDimensions: { width: number; height: number } | null
}

export const useOptimizedResize = (options: ResizeOptions = {}) => {
  const {
    minWidth = 50,
    maxWidth = 800,
    aspectRatio = 1,
    throttleMs = 16, // 60fps
    onResize,
    onResizeStart,
    onResizeEnd
  } = options

  // Performance refs
  const rafIdRef = useRef<number>()
  const lastUpdateTimeRef = useRef<number>(0)
  const isResizingRef = useRef<boolean>(false)
  const startPositionRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
  const startDimensionsRef = useRef<{ width: number; height: number }>({ width: 0, height: 0 })

  // State
  const [resizeState, setResizeState] = useState<ResizeState>({
    isResizing: false,
    tempDimensions: null
  })

  // Optimized dimension calculator
  const calculateDimensions = useCallback((
    corner: string,
    deltaX: number,
    deltaY: number,
    startWidth: number,
    startHeight: number
  ) => {
    let newWidth = startWidth
    
    switch (corner) {
      case 'se':
      case 'ne':
        newWidth = Math.max(minWidth, startWidth + deltaX)
        break
      case 'sw':
      case 'nw':
        newWidth = Math.max(minWidth, startWidth - deltaX)
        break
    }

    // Apply constraints
    newWidth = Math.min(maxWidth, Math.max(minWidth, newWidth))
    const newHeight = newWidth / aspectRatio

    return { width: newWidth, height: newHeight }
  }, [minWidth, maxWidth, aspectRatio])

  // Throttled update function
  const throttledUpdate = useCallback((width: number, height: number) => {
    const now = performance.now() // Use high-resolution timer
    const timeSinceLastUpdate = now - lastUpdateTimeRef.current

    // Cancel previous RAF if still pending
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current)
    }

    if (timeSinceLastUpdate >= throttleMs) {
      // Immediate update
      rafIdRef.current = requestAnimationFrame(() => {
        onResize?.(width, height)
        lastUpdateTimeRef.current = now
        setResizeState(prev => ({ ...prev, tempDimensions: null }))
      })
    } else {
      // Show temporary dimensions for immediate visual feedback
      setResizeState(prev => ({ ...prev, tempDimensions: { width, height } }))
      
      // Schedule update for next frame
      const delay = throttleMs - timeSinceLastUpdate
      setTimeout(() => {
        rafIdRef.current = requestAnimationFrame(() => {
          onResize?.(width, height)
          lastUpdateTimeRef.current = performance.now()
          setResizeState(prev => ({ ...prev, tempDimensions: null }))
        })
      }, delay)
    }
  }, [throttleMs, onResize])

  // Mouse move handler factory
  const createMouseMoveHandler = useCallback((corner: string) => {
    return (e: MouseEvent) => {
      if (!isResizingRef.current) return

      const deltaX = e.clientX - startPositionRef.current.x
      const deltaY = e.clientY - startPositionRef.current.y

      const { width, height } = calculateDimensions(
        corner,
        deltaX,
        deltaY,
        startDimensionsRef.current.width,
        startDimensionsRef.current.height
      )

      throttledUpdate(width, height)
    }
  }, [calculateDimensions, throttledUpdate])

  // Start resize handler
  const handleResizeStart = useCallback((
    e: React.MouseEvent,
    corner: string,
    currentWidth: number,
    currentHeight: number
  ) => {
    e.preventDefault()
    e.stopPropagation()

    // Set initial state
    isResizingRef.current = true
    startPositionRef.current = { x: e.clientX, y: e.clientY }
    startDimensionsRef.current = { width: currentWidth, height: currentHeight }

    setResizeState({
      isResizing: true,
      tempDimensions: null
    })

    onResizeStart?.()

    // Create optimized handlers
    const handleMouseMove = createMouseMoveHandler(corner)
    const handleMouseUp = () => {
      isResizingRef.current = false
      
      setResizeState(prev => ({
        ...prev,
        isResizing: false,
        tempDimensions: null
      }))

      // Cancel any pending updates
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current)
      }

      onResizeEnd?.()

      // Remove listeners
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    // Add passive listeners for better performance
    document.addEventListener('mousemove', handleMouseMove, { passive: true })
    document.addEventListener('mouseup', handleMouseUp, { passive: true })
  }, [createMouseMoveHandler, onResizeStart, onResizeEnd])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current)
      }
    }
  }, [])

  // Performance monitoring (development only)
  const performanceMonitor = useCallback(() => {
    if (process.env.NODE_ENV === 'development') {
      const startTime = performance.now()
      return () => {
        const endTime = performance.now()
        const duration = endTime - startTime
        if (duration > 16.67) { // More than 1 frame at 60fps
          console.warn(`Resize operation took ${duration.toFixed(2)}ms (>16.67ms)`)
        }
      }
    }
    return () => {}
  }, [])

  return {
    isResizing: resizeState.isResizing,
    tempDimensions: resizeState.tempDimensions,
    handleResizeStart,
    performanceMonitor
  }
}

export default useOptimizedResize 