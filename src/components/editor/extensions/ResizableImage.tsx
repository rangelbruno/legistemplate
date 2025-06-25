import React, { useState, useRef, useCallback, useEffect } from 'react'
import { Node, mergeAttributes, nodeInputRule } from '@tiptap/core'
import { NodeViewWrapper, ReactNodeViewRenderer } from '@tiptap/react'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import { Decoration, DecorationSet } from '@tiptap/pm/view'

// Tipos para as propriedades da imagem
interface ImageAttributes {
  src: string
  alt?: string
  title?: string
  width?: number
  height?: number
  'data-width'?: number
  'data-height'?: number
}

// Componente React para a imagem redimensionável
const ResizableImageComponent: React.FC<{
  node: any
  updateAttributes: (attrs: Partial<ImageAttributes>) => void
  selected: boolean
}> = ({ node, updateAttributes, selected }) => {
  const [isResizing, setIsResizing] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [originalSize, setOriginalSize] = useState({ width: 0, height: 0 })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)
  const imageRef = useRef<HTMLImageElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const { src, alt, title, width, height } = node.attrs

  // Função para otimizar a imagem
  const optimizeImage = useCallback(async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()

      img.onload = () => {
        // Calcular dimensões otimizadas (máximo 1920x1080 para performance)
        const maxWidth = 1920
        const maxHeight = 1080
        let { width: imgWidth, height: imgHeight } = img

        if (imgWidth > maxWidth || imgHeight > maxHeight) {
          const ratio = Math.min(maxWidth / imgWidth, maxHeight / imgHeight)
          imgWidth *= ratio
          imgHeight *= ratio
        }

        canvas.width = imgWidth
        canvas.height = imgHeight

        // Desenhar com qualidade otimizada
        ctx!.imageSmoothingEnabled = true
        ctx!.imageSmoothingQuality = 'high'
        ctx!.drawImage(img, 0, 0, imgWidth, imgHeight)

        // Converter para base64 com compressão
        const optimizedDataUrl = canvas.toDataURL('image/jpeg', 0.85)
        resolve(optimizedDataUrl)
      }

      img.onerror = () => reject(new Error('Erro ao carregar imagem'))
      img.src = URL.createObjectURL(file)
    })
  }, [])

  // Carregar dimensões originais da imagem
  useEffect(() => {
    if (src && imageRef.current) {
      const img = imageRef.current
      
      const handleLoad = () => {
        setIsLoading(false)
        if (!width || !height) {
          const naturalWidth = img.naturalWidth
          const naturalHeight = img.naturalHeight
          
          // Definir tamanho inicial (máximo 600px de largura)
          const maxInitialWidth = 600
          const ratio = Math.min(maxInitialWidth / naturalWidth, 1)
          const initialWidth = naturalWidth * ratio
          const initialHeight = naturalHeight * ratio

          setOriginalSize({ width: naturalWidth, height: naturalHeight })
          updateAttributes({
            width: initialWidth,
            height: initialHeight,
            'data-width': naturalWidth,
            'data-height': naturalHeight
          })
        } else {
          setOriginalSize({ 
            width: node.attrs['data-width'] || width, 
            height: node.attrs['data-height'] || height 
          })
        }
      }

      const handleError = () => {
        setIsLoading(false)
        setError(true)
      }

      img.addEventListener('load', handleLoad)
      img.addEventListener('error', handleError)

      return () => {
        img.removeEventListener('load', handleLoad)
        img.removeEventListener('error', handleError)
      }
    }
  }, [src, width, height, updateAttributes, node.attrs])

  // Performance optimizations
  const rafIdRef = useRef<number>()
  const lastUpdateTimeRef = useRef<number>(0)
  const [tempDimensions, setTempDimensions] = useState<{ width: number; height: number } | null>(null)

  // Throttled update function for better performance
  const throttledUpdate = useCallback((newWidth: number, newHeight: number) => {
    const now = Date.now()
    const timeSinceLastUpdate = now - lastUpdateTimeRef.current

    // Cancel previous RAF if still pending
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current)
    }

    // Throttle updates to max 60fps (16.67ms)
    if (timeSinceLastUpdate >= 16) {
      rafIdRef.current = requestAnimationFrame(() => {
        updateAttributes({
          width: Math.round(newWidth),
          height: Math.round(newHeight)
        })
        lastUpdateTimeRef.current = now
        setTempDimensions(null)
      })
    } else {
      // Show temporary dimensions for immediate visual feedback
      setTempDimensions({ width: newWidth, height: newHeight })
      
      // Schedule update for next available frame
      rafIdRef.current = requestAnimationFrame(() => {
        updateAttributes({
          width: Math.round(newWidth),
          height: Math.round(newHeight)
        })
        lastUpdateTimeRef.current = Date.now()
        setTempDimensions(null)
      })
    }
  }, [updateAttributes])

  // Optimized mouse move handler with memoized calculations
  const createMouseMoveHandler = useCallback((corner: string, startX: number, startY: number, startWidth: number, startHeight: number, aspectRatio: number) => {
    return (moveEvent: MouseEvent) => {
      if (!containerRef.current) return

      // Use movement delta from start position for better precision
      const deltaX = moveEvent.clientX - startX
      const deltaY = moveEvent.clientY - startY
      
      let newWidth = startWidth
      let newHeight = startHeight

      // Optimized dimension calculations
      switch (corner) {
        case 'se': // Sudeste (canto inferior direito)
          newWidth = Math.max(50, startWidth + deltaX)
          break
        case 'sw': // Sudoeste (canto inferior esquerdo)
          newWidth = Math.max(50, startWidth - deltaX)
          break
        case 'ne': // Nordeste (canto superior direito)
          newWidth = Math.max(50, startWidth + deltaX)
          break
        case 'nw': // Noroeste (canto superior esquerdo)
          newWidth = Math.max(50, startWidth - deltaX)
          break
      }

      // Maintain aspect ratio
      newHeight = newWidth / aspectRatio

      // Apply size constraints
      const maxWidth = 800
      const minWidth = 50
      
      if (newWidth > maxWidth) {
        newWidth = maxWidth
        newHeight = newWidth / aspectRatio
      } else if (newWidth < minWidth) {
        newWidth = minWidth
        newHeight = newWidth / aspectRatio
      }

      // Use throttled update for performance
      throttledUpdate(newWidth, newHeight)
    }
  }, [throttledUpdate])

  // Iniciar redimensionamento com otimizações
  const handleMouseDown = useCallback((e: React.MouseEvent, corner: string) => {
    e.preventDefault()
    e.stopPropagation()
    
    setIsResizing(true)
    
    // Capture initial values for better performance
    const startX = e.clientX
    const startY = e.clientY
    const startWidth = width || originalSize.width
    const startHeight = height || originalSize.height
    const aspectRatio = originalSize.width / originalSize.height

    // Create optimized mouse move handler
    const handleMouseMove = createMouseMoveHandler(corner, startX, startY, startWidth, startHeight, aspectRatio)

    const handleMouseUp = () => {
      setIsResizing(false)
      setTempDimensions(null)
      
      // Cancel any pending RAF
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current)
      }
      
      // Clean up event listeners
      document.removeEventListener('mousemove', handleMouseMove, { passive: true } as any)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    // Add passive listeners for better scroll performance
    document.addEventListener('mousemove', handleMouseMove, { passive: true } as any)
    document.addEventListener('mouseup', handleMouseUp)
  }, [width, height, originalSize, createMouseMoveHandler])

  // Cleanup RAF on unmount
  useEffect(() => {
    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current)
      }
    }
  }, [])

  // Reset para tamanho original
  const resetSize = useCallback(() => {
    const maxWidth = 600
    const ratio = Math.min(maxWidth / originalSize.width, 1)
    updateAttributes({
      width: Math.round(originalSize.width * ratio),
      height: Math.round(originalSize.height * ratio)
    })
  }, [originalSize, updateAttributes])

  // Ajustar para largura da página
  const fitToWidth = useCallback(() => {
    const pageWidth = 700 // Largura aproximada da página A4
    const ratio = pageWidth / originalSize.width
    updateAttributes({
      width: Math.round(originalSize.width * ratio),
      height: Math.round(originalSize.height * ratio)
    })
  }, [originalSize, updateAttributes])

  if (error) {
    return (
      <NodeViewWrapper className="resizable-image-wrapper error">
        <div className="image-error">
          <span>❌ Erro ao carregar imagem</span>
        </div>
      </NodeViewWrapper>
    )
  }

  return (
    <NodeViewWrapper className={`resizable-image-wrapper ${selected ? 'selected' : ''} ${isResizing ? 'resizing' : ''}`}>
      <div 
        ref={containerRef}
        className="image-container"
        style={{ 
          width: tempDimensions?.width || width || 'auto', 
          height: tempDimensions?.height || height || 'auto',
          position: 'relative',
          display: 'inline-block'
        }}
      >
        {isLoading && (
          <div className="image-loading">
            <div className="loading-spinner"></div>
            <span>Carregando imagem...</span>
          </div>
        )}
        
        <img
          ref={imageRef}
          src={src}
          alt={alt || ''}
          title={title || ''}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            display: isLoading ? 'none' : 'block'
          }}
          draggable={false}
        />

        {selected && !isLoading && (
          <>
            {/* Handles de redimensionamento */}
            <div 
              className="resize-handle nw"
              onMouseDown={(e) => handleMouseDown(e, 'nw')}
            />
            <div 
              className="resize-handle ne"
              onMouseDown={(e) => handleMouseDown(e, 'ne')}
            />
            <div 
              className="resize-handle sw"
              onMouseDown={(e) => handleMouseDown(e, 'sw')}
            />
            <div 
              className="resize-handle se"
              onMouseDown={(e) => handleMouseDown(e, 'se')}
            />

            {/* Toolbar de ações */}
            <div className="image-toolbar">
              <button
                onClick={resetSize}
                className="toolbar-btn"
                title="Tamanho original"
              >
                🔄
              </button>
              <button
                onClick={fitToWidth}
                className="toolbar-btn"
                title="Ajustar à largura"
              >
                📏
              </button>
              <span className="size-info">
                {Math.round(width || 0)} × {Math.round(height || 0)}px
              </span>
            </div>
          </>
        )}
      </div>
    </NodeViewWrapper>
  )
}

// Extensão Tiptap para imagens redimensionáveis
export const ResizableImage = Node.create({
  name: 'resizableImage',
  
  group: 'block',
  
  atom: true,

  addAttributes() {
    return {
      src: {
        default: null,
        parseHTML: element => element.getAttribute('src'),
        renderHTML: attributes => ({ src: attributes.src })
      },
      alt: {
        default: null,
        parseHTML: element => element.getAttribute('alt'),
        renderHTML: attributes => ({ alt: attributes.alt })
      },
      title: {
        default: null,
        parseHTML: element => element.getAttribute('title'),
        renderHTML: attributes => ({ title: attributes.title })
      },
      width: {
        default: null,
        parseHTML: element => {
          const width = element.getAttribute('width')
          return width ? parseInt(width, 10) : null
        },
        renderHTML: attributes => ({ width: attributes.width })
      },
      height: {
        default: null,
        parseHTML: element => {
          const height = element.getAttribute('height')
          return height ? parseInt(height, 10) : null
        },
        renderHTML: attributes => ({ height: attributes.height })
      },
      'data-width': {
        default: null,
        parseHTML: element => {
          const width = element.getAttribute('data-width')
          return width ? parseInt(width, 10) : null
        },
        renderHTML: attributes => ({ 'data-width': attributes['data-width'] })
      },
      'data-height': {
        default: null,
        parseHTML: element => {
          const height = element.getAttribute('data-height')
          return height ? parseInt(height, 10) : null
        },
        renderHTML: attributes => ({ 'data-height': attributes['data-height'] })
      }
    }
  },

  parseHTML() {
    return [
      {
        tag: 'img[src]',
        getAttrs: element => {
          const img = element as HTMLImageElement
          return {
            src: img.getAttribute('src'),
            alt: img.getAttribute('alt'),
            title: img.getAttribute('title'),
            width: img.getAttribute('width') ? parseInt(img.getAttribute('width')!, 10) : null,
            height: img.getAttribute('height') ? parseInt(img.getAttribute('height')!, 10) : null,
            'data-width': img.getAttribute('data-width') ? parseInt(img.getAttribute('data-width')!, 10) : null,
            'data-height': img.getAttribute('data-height') ? parseInt(img.getAttribute('data-height')!, 10) : null
          }
        }
      }
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['img', mergeAttributes(HTMLAttributes)]
  },

  addNodeView() {
    return ReactNodeViewRenderer(ResizableImageComponent)
  },

  addInputRules() {
    return [
      nodeInputRule({
        find: /!\[(.+|:?)]\((\S+)(?:(?:\s+)["'](\S+)["'])?\)/,
        type: this.type,
        getAttributes: match => {
          const [, alt, src, title] = match
          return { src, alt, title }
        }
      })
    ]
  },


})

export default ResizableImage 