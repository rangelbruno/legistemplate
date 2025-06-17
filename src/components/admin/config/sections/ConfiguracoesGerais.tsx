'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useConfig } from '../../../../context/ConfigContext'

interface ConfiguracoesGeraisProps {
  config: any
  onChange: () => void
}

export function ConfiguracoesGerais({ config, onChange }: ConfiguracoesGeraisProps) {
  const { setConfiguration } = useConfig()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const cropAreaRef = useRef<HTMLDivElement>(null)
  
  const [formData, setFormData] = useState({
    nomeInstituicao: '',
    sigla: '',
    logoUrl: '',
    enderecoCompleto: '',
    telefone: '',
    email: '',
    website: '',
    cnpj: ''
  })

  const [logoPreview, setLogoPreview] = useState<string>('')
  const [showCropModal, setShowCropModal] = useState(false)
  const [cropData, setCropData] = useState({
    originalImage: '',
    cropX: 50,
    cropY: 50,
    cropWidth: 200,   // Tamanho fixo
    cropHeight: 80,   // Tamanho fixo
    imageWidth: 0,
    imageHeight: 0
  })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

  useEffect(() => {
    if (config) {
      setFormData({
        nomeInstituicao: config.nomeInstituicao || '',
        sigla: config.sigla || '',
        logoUrl: config.logoUrl || '',
        enderecoCompleto: config.enderecoCompleto || '',
        telefone: config.telefone || '',
        email: config.email || '',
        website: config.website || '',
        cnpj: config.cnpj || ''
      })
      
      if (config.logoUrl) {
        setLogoPreview(config.logoUrl)
      }
    }
  }, [config])

  // Atualizar preview do crop quando cropData mudar
  useEffect(() => {
    if (showCropModal && cropData.originalImage) {
      updateCropPreview()
    }
  }, [cropData, showCropModal])

  const handleInputChange = (field: string, value: string) => {
    const newFormData = { ...formData, [field]: value }
    setFormData(newFormData)
    setConfiguration('geral', newFormData)
    onChange()
  }

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        const imageUrl = reader.result as string
        // Criar uma imagem temporária para obter dimensões
        const tempImg = new Image()
        tempImg.onload = () => {
          setCropData(prev => ({ 
            ...prev, 
            originalImage: imageUrl,
            imageWidth: tempImg.width,
            imageHeight: tempImg.height,
            // Centralizar área de crop
            cropX: Math.max(0, (tempImg.width - 200) / 2),
            cropY: Math.max(0, (tempImg.height - 80) / 2)
          }))
          setShowCropModal(true)
        }
        tempImg.src = imageUrl
      }
      reader.readAsDataURL(file)
    }
  }

  const updateCropPreview = () => {
    const canvas = canvasRef.current
    if (canvas && cropData.originalImage) {
      const ctx = canvas.getContext('2d')
      const img = new Image()
      
      img.onload = () => {
        canvas.width = 200
        canvas.height = 80
        
        ctx?.drawImage(
          img,
          cropData.cropX,
          cropData.cropY,
          cropData.cropWidth,
          cropData.cropHeight,
          0,
          0,
          200,
          80
        )
      }
      
      img.src = cropData.originalImage
    }
  }

  const handleCropSave = () => {
    const canvas = canvasRef.current
    if (canvas) {
      const croppedImageUrl = canvas.toDataURL('image/png', 0.9)
      setLogoPreview(croppedImageUrl)
      handleInputChange('logoUrl', croppedImageUrl)
      setShowCropModal(false)
    }
  }

  const removeLogo = () => {
    setLogoPreview('')
    handleInputChange('logoUrl', '')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // Handlers para drag and drop da área de crop
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)
    const rect = e.currentTarget.getBoundingClientRect()
    setDragStart({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return

    const imageContainer = imageRef.current?.parentElement
    if (!imageContainer) return

    const containerRect = imageContainer.getBoundingClientRect()
    const imageRect = imageRef.current?.getBoundingClientRect()
    
    if (!imageRect) return

    // Calcular proporção entre imagem exibida e original
    const scaleX = cropData.imageWidth / imageRect.width
    const scaleY = cropData.imageHeight / imageRect.height

    // Posição relativa à imagem
    const relativeX = e.clientX - imageRect.left - dragStart.x
    const relativeY = e.clientY - imageRect.top - dragStart.y

    // Converter para coordenadas da imagem original
    const newCropX = Math.max(0, Math.min(relativeX * scaleX, cropData.imageWidth - cropData.cropWidth))
    const newCropY = Math.max(0, Math.min(relativeY * scaleY, cropData.imageHeight - cropData.cropHeight))

    setCropData(prev => ({
      ...prev,
      cropX: newCropX,
      cropY: newCropY
    }))
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // Calcular posição da área de crop na imagem exibida
  const getCropAreaStyle = () => {
    if (!imageRef.current) return {}

    const imageRect = imageRef.current.getBoundingClientRect()
    const scaleX = imageRect.width / cropData.imageWidth
    const scaleY = imageRect.height / cropData.imageHeight

    return {
      left: `${cropData.cropX * scaleX}px`,
      top: `${cropData.cropY * scaleY}px`,
      width: `${cropData.cropWidth * scaleX}px`,
      height: `${cropData.cropHeight * scaleY}px`
    }
  }

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">
          <h3 className="fw-bold text-gray-800">
            <i className="bi bi-building text-primary me-2"></i>
            Identidade Institucional
          </h3>
        </div>
      </div>
      <div className="card-body">
        <div className="row g-7">
          {/* Informações Básicas */}
          <div className="col-lg-6">
            <div className="fv-row mb-7">
              <label className="required fw-semibold fs-6 mb-2">Nome da Instituição</label>
              <input
                type="text"
                className="form-control form-control-solid"
                placeholder="Ex: Câmara Municipal de São Paulo"
                value={formData.nomeInstituicao}
                onChange={(e) => handleInputChange('nomeInstituicao', e.target.value)}
              />
              <div className="form-text">
                Nome oficial da instituição parlamentar
              </div>
            </div>

            <div className="fv-row mb-7">
              <label className="fw-semibold fs-6 mb-2">Sigla</label>
              <input
                type="text"
                className="form-control form-control-solid"
                placeholder="Ex: CMSP"
                value={formData.sigla}
                onChange={(e) => handleInputChange('sigla', e.target.value)}
              />
            </div>

            <div className="fv-row mb-7">
              <label className="fw-semibold fs-6 mb-2">CNPJ</label>
              <input
                type="text"
                className="form-control form-control-solid"
                placeholder="00.000.000/0000-00"
                value={formData.cnpj}
                onChange={(e) => handleInputChange('cnpj', e.target.value)}
              />
            </div>
          </div>

          {/* Contato */}
          <div className="col-lg-6">
            <div className="fv-row mb-7">
              <label className="fw-semibold fs-6 mb-2">Email Institucional</label>
              <input
                type="email"
                className="form-control form-control-solid"
                placeholder="contato@instituicao.gov.br"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
              />
            </div>

            <div className="fv-row mb-7">
              <label className="fw-semibold fs-6 mb-2">Telefone</label>
              <input
                type="text"
                className="form-control form-control-solid"
                placeholder="(11) 3000-0000"
                value={formData.telefone}
                onChange={(e) => handleInputChange('telefone', e.target.value)}
              />
            </div>

            <div className="fv-row mb-7">
              <label className="fw-semibold fs-6 mb-2">Website</label>
              <input
                type="url"
                className="form-control form-control-solid"
                placeholder="https://www.instituicao.gov.br"
                value={formData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
              />
            </div>
          </div>

          {/* Endereço */}
          <div className="col-12">
            <div className="fv-row mb-7">
              <label className="fw-semibold fs-6 mb-2">Endereço Completo</label>
              <textarea
                className="form-control form-control-solid"
                rows={3}
                placeholder="Endereço completo da instituição..."
                value={formData.enderecoCompleto}
                onChange={(e) => handleInputChange('enderecoCompleto', e.target.value)}
              />
            </div>
          </div>

          {/* Logo da Câmara */}
          <div className="col-12">
            <div className="separator my-7"></div>
            <h4 className="fw-bold text-gray-800 mb-5">
              <i className="bi bi-image text-primary me-2"></i>
              Logo da Câmara
            </h4>
          </div>

          <div className="col-12">
            <div className="fv-row mb-7">
              <label className="fw-semibold fs-6 mb-2">Upload da Logo</label>
              
              {/* Preview da Logo */}
              {logoPreview && (
                <div className="d-flex align-items-center bg-light-primary rounded p-5 mb-5">
                  <div className="symbol symbol-60px me-5">
                    <img src={logoPreview} alt="Logo da Câmara" className="w-100 h-100 object-fit-contain" />
                  </div>
                  <div className="flex-grow-1">
                    <h5 className="text-gray-800 fw-bold mb-1">Logo Atual</h5>
                    <p className="text-muted mb-0">Dimensões: 200x80px</p>
                  </div>
                  <button
                    type="button"
                    className="btn btn-sm btn-light-danger"
                    onClick={removeLogo}
                  >
                    <i className="bi bi-trash fs-4"></i>
                  </button>
                </div>
              )}

              {/* Upload de Nova Logo */}
              <div className="d-flex align-items-center gap-3">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="form-control form-control-solid"
                  style={{ display: 'none' }}
                />
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <i className="bi bi-upload fs-4 me-2"></i>
                  {logoPreview ? 'Alterar Logo' : 'Carregar Logo'}
                </button>
                <div className="text-muted">
                  <small>
                    Formatos aceitos: PNG, JPG, JPEG, SVG<br/>
                    Tamanho máximo: 5MB | Dimensões finais: 200x80px
                  </small>
                </div>
              </div>
            </div>
          </div>


        </div>
      </div>

      {/* Modal de Crop da Imagem */}
      {showCropModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-xl">
            <div className="modal-content">
              <div className="modal-header">
                <h3 className="modal-title">Ajustar Logo</h3>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowCropModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-8">
                    <div className="position-relative d-inline-block">
                      <img
                        ref={imageRef}
                        src={cropData.originalImage}
                        alt="Imagem original"
                        className="img-fluid"
                        style={{ maxHeight: '500px', maxWidth: '100%' }}
                      />
                      {/* Área de crop arrastável */}
                      <div
                        ref={cropAreaRef}
                        className="position-absolute border border-2 border-primary"
                        style={{
                          ...getCropAreaStyle(),
                          backgroundColor: 'rgba(0, 123, 255, 0.2)',
                          cursor: isDragging ? 'grabbing' : 'grab',
                          borderRadius: '4px'
                        }}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                      >
                        <div className="position-absolute top-50 start-50 translate-middle">
                          <i className="bi bi-arrows-move text-primary fs-3"></i>
                        </div>
                        {/* Indicadores de canto */}
                        <div className="position-absolute" style={{ top: '-4px', left: '-4px', width: '8px', height: '8px', backgroundColor: '#009ef7', borderRadius: '50%' }}></div>
                        <div className="position-absolute" style={{ top: '-4px', right: '-4px', width: '8px', height: '8px', backgroundColor: '#009ef7', borderRadius: '50%' }}></div>
                        <div className="position-absolute" style={{ bottom: '-4px', left: '-4px', width: '8px', height: '8px', backgroundColor: '#009ef7', borderRadius: '50%' }}></div>
                        <div className="position-absolute" style={{ bottom: '-4px', right: '-4px', width: '8px', height: '8px', backgroundColor: '#009ef7', borderRadius: '50%' }}></div>
                      </div>
                    </div>
                  </div>
                  <div className="col-4">
                    <h5 className="mb-3">Preview Final</h5>
                    <div className="bg-light rounded p-4 text-center mb-4">
                      <canvas
                        ref={canvasRef}
                        width="200"
                        height="80"
                        className="border rounded"
                        style={{ maxWidth: '100%' }}
                      />
                      <div className="mt-2 text-muted">
                        <small>200px × 80px</small>
                      </div>
                    </div>
                    
                    <div className="alert alert-light-primary">
                      <div className="d-flex align-items-center">
                        <i className="bi bi-info-circle text-primary me-3 fs-4"></i>
                        <div>
                          <h6 className="mb-1">Como usar:</h6>
                          <p className="mb-0 small">
                            Arraste a área azul sobre a imagem para selecionar a parte que será usada como logo.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="d-flex gap-2 mt-4">
                      <div className="text-center flex-fill">
                        <div className="bg-light-success rounded p-2">
                          <i className="bi bi-aspect-ratio text-success fs-3"></i>
                          <div className="small text-muted mt-1">Proporção 5:2</div>
                        </div>
                      </div>
                      <div className="text-center flex-fill">
                        <div className="bg-light-info rounded p-2">
                          <i className="bi bi-image text-info fs-3"></i>
                          <div className="small text-muted mt-1">Alta Qualidade</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowCropModal(false)}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleCropSave}
                >
                  <i className="bi bi-check fs-4 me-2"></i>
                  Aplicar Corte
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 