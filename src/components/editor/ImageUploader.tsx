'use client'

import React, { useState, useRef, useCallback, useEffect } from 'react'
import { Upload, Image as ImageIcon, X, Check, AlertCircle, Loader2 } from 'lucide-react'

interface ImageUploaderProps {
  onImageSelect: (file: File, optimizedDataUrl: string) => void
  onClose: () => void
  maxFileSize?: number // em MB
  acceptedFormats?: string[]
  maxWidth?: number
  maxHeight?: number
  quality?: number
}

interface UploadedImage {
  file: File
  preview: string
  optimized?: string
  size: { width: number; height: number }
  fileSize: number
  status: 'uploading' | 'optimizing' | 'ready' | 'error'
  error?: string
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageSelect,
  onClose,
  maxFileSize = 10, // 10MB por padrão
  acceptedFormats = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  maxWidth = 1920,
  maxHeight = 1080,
  quality = 0.85
}) => {
  const [dragActive, setDragActive] = useState(false)
  const [images, setImages] = useState<UploadedImage[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Função para otimizar imagem
  const optimizeImage = useCallback(async (file: File): Promise<{
    optimizedDataUrl: string
    size: { width: number; height: number }
  }> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()

      img.onload = () => {
        try {
          let { width: imgWidth, height: imgHeight } = img

          // Calcular dimensões otimizadas
          if (imgWidth > maxWidth || imgHeight > maxHeight) {
            const ratio = Math.min(maxWidth / imgWidth, maxHeight / imgHeight)
            imgWidth = Math.round(imgWidth * ratio)
            imgHeight = Math.round(imgHeight * ratio)
          }

          canvas.width = imgWidth
          canvas.height = imgHeight

          // Configurar contexto para melhor qualidade
          if (ctx) {
            ctx.imageSmoothingEnabled = true
            ctx.imageSmoothingQuality = 'high'
            
            // Desenhar imagem otimizada
            ctx.drawImage(img, 0, 0, imgWidth, imgHeight)

            // Determinar formato de saída
            const outputFormat = file.type === 'image/png' ? 'image/png' : 'image/jpeg'
            const outputQuality = outputFormat === 'image/jpeg' ? quality : undefined

            const optimizedDataUrl = canvas.toDataURL(outputFormat, outputQuality)
            
            resolve({
              optimizedDataUrl,
              size: { width: imgWidth, height: imgHeight }
            })
          } else {
            reject(new Error('Não foi possível obter contexto do canvas'))
          }
        } catch (error) {
          reject(error)
        }
      }

      img.onerror = () => reject(new Error('Erro ao carregar imagem'))
      img.src = URL.createObjectURL(file)
    })
  }, [maxWidth, maxHeight, quality])

  // Função para processar arquivos
  const processFiles = useCallback(async (files: FileList | File[]) => {
    const fileArray = Array.from(files)
    
    for (const file of fileArray) {
      // Validar tipo de arquivo
      if (!acceptedFormats.includes(file.type)) {
        console.warn(`Formato ${file.type} não suportado`)
        continue
      }

      // Validar tamanho do arquivo
      if (file.size > maxFileSize * 1024 * 1024) {
        console.warn(`Arquivo muito grande: ${(file.size / 1024 / 1024).toFixed(2)}MB`)
        continue
      }

      const imageId = Date.now() + Math.random()
      const preview = URL.createObjectURL(file)

      // Adicionar imagem com status inicial
      const newImage: UploadedImage = {
        file,
        preview,
        size: { width: 0, height: 0 },
        fileSize: file.size,
        status: 'uploading'
      }

      setImages(prev => [...prev, newImage])

      try {
        // Otimizar imagem
        setImages(prev => prev.map(img => 
          img.file === file ? { ...img, status: 'optimizing' } : img
        ))

        const { optimizedDataUrl, size } = await optimizeImage(file)

        // Atualizar com resultado otimizado
        setImages(prev => prev.map(img => 
          img.file === file ? {
            ...img,
            optimized: optimizedDataUrl,
            size,
            status: 'ready'
          } : img
        ))

      } catch (error) {
        console.error('Erro ao otimizar imagem:', error)
        setImages(prev => prev.map(img => 
          img.file === file ? {
            ...img,
            status: 'error',
            error: error instanceof Error ? error.message : 'Erro desconhecido'
          } : img
        ))
      }
    }
  }, [acceptedFormats, maxFileSize, optimizeImage])

  // Handlers para drag and drop
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(true)
  }, [])

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files)
    }
  }, [processFiles])

  // Handler para input de arquivo
  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files)
    }
  }, [processFiles])

  // Selecionar imagem
  const selectImage = useCallback((image: UploadedImage) => {
    if (image.status === 'ready' && image.optimized) {
      onImageSelect(image.file, image.optimized)
      onClose()
    }
  }, [onImageSelect, onClose])

  // Remover imagem
  const removeImage = useCallback((index: number) => {
    setImages(prev => {
      const newImages = [...prev]
      URL.revokeObjectURL(newImages[index].preview)
      if (newImages[index].optimized) {
        URL.revokeObjectURL(newImages[index].optimized!)
      }
      newImages.splice(index, 1)
      return newImages
    })
  }, [])

  // Limpar URLs ao desmontar
  useEffect(() => {
    return () => {
      images.forEach(image => {
        URL.revokeObjectURL(image.preview)
        if (image.optimized) {
          URL.revokeObjectURL(image.optimized)
        }
      })
    }
  }, [images])

  // Formatar tamanho do arquivo
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="image-uploader-overlay" onClick={onClose}>
      <div className="image-uploader-modal" onClick={(e) => e.stopPropagation()}>
        <div className="uploader-header">
          <h3>Inserir Imagem</h3>
          <button onClick={onClose} className="close-btn">
            <X size={20} />
          </button>
        </div>

        <div className="uploader-content">
          {/* Área de upload */}
          <div
            className={`upload-area ${dragActive ? 'drag-active' : ''}`}
            onDragEnter={handleDragIn}
            onDragLeave={handleDragOut}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept={acceptedFormats.join(',')}
              onChange={handleFileInput}
              style={{ display: 'none' }}
            />
            
            <div className="upload-content">
              <Upload size={48} className="upload-icon" />
              <h4>Arraste imagens aqui ou clique para selecionar</h4>
              <p>
                Formatos suportados: {acceptedFormats.map(f => f.split('/')[1].toUpperCase()).join(', ')}
              </p>
              <p className="size-limit">
                Tamanho máximo: {maxFileSize}MB | Resolução máxima: {maxWidth}x{maxHeight}px
              </p>
            </div>
          </div>

          {/* Lista de imagens */}
          {images.length > 0 && (
            <div className="images-list">
              <h4>Imagens Carregadas</h4>
              <div className="images-grid">
                {images.map((image, index) => (
                  <div key={index} className="image-item">
                    <div className="image-preview">
                      <img
                        src={image.optimized || image.preview}
                        alt="Preview"
                      />
                      
                      {/* Status overlay */}
                      <div className={`status-overlay ${image.status}`}>
                        {image.status === 'uploading' && (
                          <Loader2 size={24} className="spinning" />
                        )}
                        {image.status === 'optimizing' && (
                          <Loader2 size={24} className="spinning" />
                        )}
                        {image.status === 'ready' && (
                          <Check size={24} />
                        )}
                        {image.status === 'error' && (
                          <AlertCircle size={24} />
                        )}
                      </div>

                      {/* Botão remover */}
                      <button
                        onClick={() => removeImage(index)}
                        className="remove-btn"
                      >
                        <X size={16} />
                      </button>
                    </div>

                    <div className="image-info">
                      <div className="image-name">{image.file.name}</div>
                      <div className="image-details">
                        {image.size.width > 0 && (
                          <span>{image.size.width}×{image.size.height}px</span>
                        )}
                        <span>{formatFileSize(image.fileSize)}</span>
                      </div>
                      
                      {image.status === 'ready' && (
                        <button
                          onClick={() => selectImage(image)}
                          className="select-btn"
                        >
                          Inserir Imagem
                        </button>
                      )}
                      
                      {image.status === 'error' && (
                        <div className="error-message">
                          {image.error || 'Erro ao processar imagem'}
                        </div>
                      )}
                      
                      {(image.status === 'uploading' || image.status === 'optimizing') && (
                        <div className="processing-message">
                          {image.status === 'uploading' ? 'Carregando...' : 'Otimizando...'}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="uploader-footer">
          <div className="upload-tips">
            <h5>💡 Dicas de Otimização:</h5>
            <ul>
              <li>Imagens serão redimensionadas automaticamente para {maxWidth}×{maxHeight}px</li>
              <li>JPEGs são comprimidos com qualidade {Math.round(quality * 100)}%</li>
              <li>PNGs mantêm transparência quando necessário</li>
              <li>Use JPEGs para fotos e PNGs para gráficos com transparência</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ImageUploader 