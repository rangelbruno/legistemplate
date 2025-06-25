import {
  DecoratorNode,
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  EditorConfig,
  LexicalNode,
  NodeKey,
  SerializedLexicalNode,
  Spread,
} from 'lexical'
import { useState, useRef, useEffect, useCallback } from 'react'

export interface ImagePayload {
  altText: string
  height?: number
  key?: NodeKey
  src: string
  width?: number
  alignment?: 'left' | 'center' | 'right' | 'inline'
  wrapText?: boolean
  zIndex?: number
}

function convertImageElement(domNode: Node): null | DOMConversionOutput {
  if (domNode instanceof HTMLImageElement) {
    const { alt: altText, src, width, height } = domNode
    const node = $createImageNode({ altText, src, width, height })
    return { node }
  }
  return null
}

export type SerializedImageNode = Spread<
  {
    altText: string
    height?: number
    src: string
    width?: number
    alignment?: 'left' | 'center' | 'right' | 'inline'
    wrapText?: boolean
    zIndex?: number
  },
  SerializedLexicalNode
>

export class ImageNode extends DecoratorNode<JSX.Element> {
  __src: string
  __altText: string
  __width: 'inherit' | number
  __height: 'inherit' | number
  __alignment: 'left' | 'center' | 'right' | 'inline'
  __wrapText: boolean
  __zIndex: number

  static getType(): string {
    return 'image'
  }

  static clone(node: ImageNode): ImageNode {
    return new ImageNode(
      node.__src,
      node.__altText,
      node.__width,
      node.__height,
      node.__alignment,
      node.__wrapText,
      node.__zIndex,
      node.__key,
    )
  }

  static importJSON(serializedNode: SerializedImageNode): ImageNode {
    const { altText, height, width, src } = serializedNode
    const node = $createImageNode({
      altText,
      height,
      src,
      width,
    })
    return node
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement('img')
    element.setAttribute('src', this.__src)
    element.setAttribute('alt', this.__altText)
    element.setAttribute('width', this.__width.toString())
    element.setAttribute('height', this.__height.toString())
    element.style.maxWidth = '100%'
    element.style.height = 'auto'
    element.style.display = 'block'
    element.style.margin = '10px auto'
    return { element }
  }

  static importDOM(): DOMConversionMap | null {
    return {
      img: (node: Node) => ({
        conversion: convertImageElement,
        priority: 0,
      }),
    }
  }

  constructor(
    src: string,
    altText: string,
    width?: 'inherit' | number,
    height?: 'inherit' | number,
    alignment?: 'left' | 'center' | 'right' | 'inline',
    wrapText?: boolean,
    zIndex?: number,
    key?: NodeKey,
  ) {
    super(key)
    this.__src = src
    this.__altText = altText
    this.__width = width || 'inherit'
    this.__height = height || 'inherit'
    this.__alignment = alignment || 'inline'
    this.__wrapText = wrapText || false
    this.__zIndex = zIndex || 1
  }

  exportJSON(): SerializedImageNode {
    return {
      altText: this.getAltText(),
      height: this.__height === 'inherit' ? 0 : this.__height,
      src: this.getSrc(),
      type: 'image',
      version: 1,
      width: this.__width === 'inherit' ? 0 : this.__width,
    }
  }

  setWidthAndHeight(
    width: 'inherit' | number,
    height: 'inherit' | number,
  ): void {
    const writable = this.getWritable()
    writable.__width = width
    writable.__height = height
  }

  createDOM(config: EditorConfig): HTMLElement {
    const span = document.createElement('span')
    const theme = config.theme
    const className = theme.image
    if (className !== undefined) {
      span.className = className
    }
    // Garantir que o container seja totalmente transparente
    span.style.background = 'transparent'
    span.style.backgroundColor = 'transparent'
    span.style.backgroundImage = 'none'
    span.style.backgroundSize = 'auto'
    span.style.backgroundRepeat = 'no-repeat'
    span.style.backgroundPosition = 'center'
    span.style.setProperty('background', 'transparent', 'important')
    span.style.setProperty('background-color', 'transparent', 'important')
    span.style.setProperty('background-image', 'none', 'important')
    return span
  }

  updateDOM(): false {
    return false
  }

  getSrc(): string {
    return this.__src
  }

  getAltText(): string {
    return this.__altText
  }

  decorate(): JSX.Element {
    return <AdvancedImageComponent node={this} />
  }
}

export function $createImageNode({
  altText,
  height,
  src,
  width,
  alignment,
  wrapText,
  zIndex,
  key,
}: ImagePayload): ImageNode {
  return new ImageNode(src, altText, width, height, alignment, wrapText, zIndex, key)
}

export function $isImageNode(
  node: LexicalNode | null | undefined,
): node is ImageNode {
  return node instanceof ImageNode
}

function AdvancedImageComponent({ node }: { node: ImageNode }) {
  const [isSelected, setIsSelected] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [resizeDirection, setResizeDirection] = useState<string>('')
  const [dimensions, setDimensions] = useState({
    width: node.__width === 'inherit' ? 300 : node.__width,
    height: node.__height === 'inherit' ? 200 : node.__height,
  })
  const [position, setPosition] = useState({ x: 0, y: 0 })
  
  const imageRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef({ startX: 0, startY: 0, startPosX: 0, startPosY: 0 })
  const resizeRef = useRef({ startX: 0, startY: 0, startWidth: 0, startHeight: 0 })

  const getAlignmentStyle = () => {
    switch (node.__alignment) {
      case 'left':
        return {
          float: 'left' as const,
          marginRight: '15px',
          marginBottom: '10px',
        }
      case 'right':
        return {
          float: 'right' as const,
          marginLeft: '15px',
          marginBottom: '10px',
        }
      case 'center':
        return {
          display: 'block' as const,
          marginLeft: 'auto',
          marginRight: 'auto',
          marginBottom: '15px',
        }
      case 'inline':
      default:
        return {
          display: 'inline-block' as const,
          verticalAlign: 'baseline',
          margin: '0 5px 5px 0',
          maxWidth: '100%',
          position: 'relative' as const,
        }
    }
  }

  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsSelected(true)
  }

  const handleResizeStart = (e: React.MouseEvent, direction: string) => {
    e.stopPropagation()
    e.preventDefault()
    setIsResizing(true)
    setResizeDirection(direction)
    resizeRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startWidth: dimensions.width,
      startHeight: dimensions.height,
    }
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing) return
    const dx = e.clientX - resizeRef.current.startX
    const dy = e.clientY - resizeRef.current.startY
    let newWidth = resizeRef.current.startWidth
    let newHeight = resizeRef.current.startHeight

    if (resizeDirection.includes('right')) newWidth += dx
    if (resizeDirection.includes('left')) newWidth -= dx
    if (resizeDirection.includes('bottom')) newHeight += dy
    if (resizeDirection.includes('top')) newHeight -= dy

    setDimensions({
      width: Math.max(newWidth, 50),
      height: Math.max(newHeight, 50),
    })
  }

  const handleMouseUp = () => {
    setIsResizing(false)
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
    // Aqui você pode querer atualizar o node do Lexical com as novas dimensões
  }
  
  const handleClickOutside = (e: MouseEvent) => {
    if (imageRef.current && !imageRef.current.contains(e.target as Node)) {
      setIsSelected(false)
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div
      ref={imageRef}
      style={{ ...getAlignmentStyle(), width: dimensions.width, height: dimensions.height, zIndex: node.__zIndex }}
      className={`image-container ${isSelected ? 'selected' : ''}`}
      onClick={handleImageClick}
    >
      <img
        src={node.__src}
        alt={node.__altText}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          pointerEvents: isResizing || isDragging ? 'none' : 'auto',
        }}
      />
      {isSelected && (
        <>
          <div className="resize-handle top-left" onMouseDown={(e) => handleResizeStart(e, 'top-left')} />
          <div className="resize-handle top-right" onMouseDown={(e) => handleResizeStart(e, 'top-right')} />
          <div className="resize-handle bottom-left" onMouseDown={(e) => handleResizeStart(e, 'bottom-left')} />
          <div className="resize-handle bottom-right" onMouseDown={(e) => handleResizeStart(e, 'bottom-right')} />
          <div className="resize-handle top" onMouseDown={(e) => handleResizeStart(e, 'top')} />
          <div className="resize-handle bottom" onMouseDown={(e) => handleResizeStart(e, 'bottom')} />
          <div className="resize-handle left" onMouseDown={(e) => handleResizeStart(e, 'left')} />
          <div className="resize-handle right" onMouseDown={(e) => handleResizeStart(e, 'right')} />
        </>
      )}
    </div>
  )
} 