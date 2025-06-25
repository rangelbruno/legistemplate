import React, { useRef, useEffect, useState, useCallback } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import './ReactQuillEditor.css'

interface ReactQuillEditorProps {
  initialContent?: string
  onChange?: (content: string, html: string) => void
  onSave?: (content: string, html: string) => void
  className?: string
}

// Componente interno estável
const StableQuillEditor: React.FC<ReactQuillEditorProps> = ({ 
  initialContent = '', 
  onChange, 
  onSave, 
  className = '' 
}) => {
  const quillRef = useRef<ReactQuill>(null)
  const hasInitialized = useRef(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const editorInstanceId = useRef(Math.random().toString(36).substr(2, 9))
  
  const [isReady, setIsReady] = useState(false)
  const [content, setContent] = useState('')
  const [showImageModal, setShowImageModal] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  
  // Inicialização única e definitiva
  useEffect(() => {
    if (hasInitialized.current) {
      console.log(`ReactQuillEditor [${editorInstanceId.current}]: Já inicializado, ignorando...`)
      return
    }
    
    hasInitialized.current = true
    console.log(`ReactQuillEditor [${editorInstanceId.current}]: Inicializando editor - PRIMEIRA E ÚNICA VEZ`)
    
    // Definir conteúdo inicial se fornecido
    if (initialContent && initialContent.trim()) {
      setContent(initialContent)
      console.log(`ReactQuillEditor [${editorInstanceId.current}]: Conteúdo inicial definido`)
    }
    
    // Aguardar um pouco para o DOM estar pronto
    const timer = setTimeout(() => {
      setIsReady(true)
      console.log(`ReactQuillEditor [${editorInstanceId.current}]: Editor pronto para uso`)
    }, 100)
    
    return () => clearTimeout(timer)
  }, []) // Dependências vazias - NUNCA re-executar

  // Função para salvar (com Ctrl+S)
  const handleSave = useCallback(() => {
    if (onSave && quillRef.current && isReady) {
      const quill = quillRef.current.getEditor()
      const html = quill.root.innerHTML
      const plainText = quill.getText()
      onSave(plainText, html)
      console.log(`ReactQuillEditor [${editorInstanceId.current}]: Documento salvo via Ctrl+S`)
    }
  }, [onSave, isReady])

  // Atalho Ctrl+S
  useEffect(() => {
    if (!isReady) return
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault()
        handleSave()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleSave, isReady])

  // Função para inserir texto legislativo
  const insertLegislativeText = useCallback((text: string) => {
    if (!quillRef.current || !isReady) {
      console.warn(`ReactQuillEditor [${editorInstanceId.current}]: Editor não está pronto`)
      return
    }

    try {
      const quill = quillRef.current.getEditor()
      quill.focus()
      
      const selection = quill.getSelection(true)
      const index = selection ? selection.index : quill.getLength()
      
      quill.insertText(index, text, 'user')
      quill.setSelection(index + text.length)
      
      console.log(`ReactQuillEditor [${editorInstanceId.current}]: Texto inserido com sucesso:`, text)
    } catch (error) {
      console.error(`ReactQuillEditor [${editorInstanceId.current}]: Erro ao inserir texto:`, error)
    }
  }, [isReady])

  // Função para upload de imagem
  const handleImageUpload = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }, [])

  // Função para processar arquivo de imagem
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Verificar se é uma imagem
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione apenas arquivos de imagem.')
      return
    }

    // Verificar tamanho (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('A imagem deve ter no máximo 5MB.')
      return
    }

    // Converter para base64 e inserir
    const reader = new FileReader()
    reader.onload = (event) => {
      const base64 = event.target?.result as string
      insertImage(base64)
    }
    reader.readAsDataURL(file)

    // Limpar o input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [])

  // Função para inserir imagem no editor
  const insertImage = useCallback((src: string) => {
    if (!quillRef.current || !isReady) {
      console.warn(`ReactQuillEditor [${editorInstanceId.current}]: Editor não está pronto`)
      return
    }

    try {
      const quill = quillRef.current.getEditor()
      quill.focus()
      
      const selection = quill.getSelection(true)
      const index = selection ? selection.index : quill.getLength()
      
      // Inserir a imagem
      quill.insertEmbed(index, 'image', src, 'user')
      quill.setSelection(index + 1)
      
      console.log(`ReactQuillEditor [${editorInstanceId.current}]: Imagem inserida com sucesso`)
    } catch (error) {
      console.error(`ReactQuillEditor [${editorInstanceId.current}]: Erro ao inserir imagem:`, error)
    }
  }, [isReady])

  // Função para inserir imagem via URL
  const handleImageUrl = useCallback(() => {
    if (!imageUrl.trim()) {
      alert('Por favor, digite uma URL válida.')
      return
    }

    // Verificar se é uma URL de imagem válida
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg']
    const isValidImageUrl = imageExtensions.some(ext => 
      imageUrl.toLowerCase().includes(ext)
    ) || imageUrl.startsWith('data:image/')

    if (!isValidImageUrl && !imageUrl.startsWith('http')) {
      alert('Por favor, digite uma URL de imagem válida.')
      return
    }

    insertImage(imageUrl)
    setImageUrl('')
    setShowImageModal(false)
  }, [imageUrl, insertImage])

  // Handler de mudança de conteúdo (otimizado)
  const handleChange = useCallback((value: string) => {
    setContent(value)
    
    if (onChange && quillRef.current && isReady) {
      const quill = quillRef.current.getEditor()
      const plainText = quill.getText()
      onChange(plainText, value)
    }
  }, [onChange, isReady])

  // Configuração estável do editor
  const editorModules = {
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'align': [] }],
        ['link'],
        ['clean']
      ],
      handlers: {
        image: () => {
          // Não fazer nada - usaremos nossos botões customizados
        }
      }
    },
    clipboard: {
      matchVisual: false
    }
  }

  const editorFormats = [
    'header', 'bold', 'italic', 'underline',
    'list', 'bullet', 'align', 'link', 'image'
  ]

  if (!isReady) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando editor...</span>
        </div>
      </div>
    )
  }

  return (
    <div className={`react-quill-editor-container ${className}`}>
      {/* Input oculto para upload de imagem */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      {/* Botões de ação */}
      <div className="editor-actions mb-3 p-2 bg-light border rounded">
        {/* Botões legislativos */}
        <div className="btn-group me-3">
          <small className="text-muted me-2 align-self-center">Elementos Legislativos:</small>
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              insertLegislativeText('Art. º - ')
            }}
            title="Inserir Artigo"
          >
            Art.
          </button>
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              insertLegislativeText('§ º - ')
            }}
            title="Inserir Parágrafo"
          >
            §
          </button>
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              insertLegislativeText('I - ')
            }}
            title="Inserir Inciso"
          >
            Inc.
          </button>
        </div>

        {/* Botões de imagem */}
        <div className="btn-group me-3">
          <small className="text-muted me-2 align-self-center">Imagens:</small>
          <button
            type="button"
            className="btn btn-sm btn-outline-info"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              handleImageUpload()
            }}
            title="Upload de Imagem"
          >
            <i className="ki-duotone ki-picture fs-3 me-1">
              <span className="path1"></span>
              <span className="path2"></span>
            </i>
            Upload
          </button>
          <button
            type="button"
            className="btn btn-sm btn-outline-info"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setShowImageModal(true)
            }}
            title="Inserir Imagem via URL"
          >
            <i className="ki-duotone ki-link fs-3 me-1">
              <span className="path1"></span>
              <span className="path2"></span>
            </i>
            URL
          </button>
        </div>

        {/* Botão salvar */}
        <button
          type="button"
          className="btn btn-sm btn-outline-primary"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            handleSave()
          }}
          title="Salvar (Ctrl+S)"
        >
          <i className="ki-duotone ki-check fs-3 me-1">
            <span className="path1"></span>
            <span className="path2"></span>
          </i>
          Salvar
        </button>
      </div>

      {/* Editor Quill */}
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={content}
        onChange={handleChange}
        modules={editorModules}
        formats={editorFormats}
        style={{
          minHeight: '400px',
          fontFamily: 'Times New Roman, serif'
        }}
        placeholder="Digite o conteúdo do documento aqui..."
      />

      {/* Modal para inserir imagem via URL */}
      {showImageModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Inserir Imagem via URL</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowImageModal(false)
                    setImageUrl('')
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">URL da Imagem:</label>
                  <input
                    type="url"
                    className="form-control"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://exemplo.com/imagem.jpg"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleImageUrl()
                      }
                    }}
                  />
                  <small className="text-muted">
                    Formatos suportados: JPG, PNG, GIF, WebP, SVG
                  </small>
                </div>
                {imageUrl && (
                  <div className="mb-3">
                    <label className="form-label">Pré-visualização:</label>
                    <div className="border rounded p-2 text-center">
                      <img
                        src={imageUrl}
                        alt="Pré-visualização"
                        style={{ maxWidth: '100%', maxHeight: '200px' }}
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none'
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowImageModal(false)
                    setImageUrl('')
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleImageUrl}
                  disabled={!imageUrl.trim()}
                >
                  Inserir Imagem
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Wrapper com React.memo mais rigoroso
const ReactQuillEditor = React.memo(StableQuillEditor, (prevProps, nextProps) => {
  // Comparação customizada para evitar re-renders desnecessários
  return (
    prevProps.initialContent === nextProps.initialContent &&
    prevProps.className === nextProps.className &&
    prevProps.onChange === nextProps.onChange &&
    prevProps.onSave === nextProps.onSave
  )
})

ReactQuillEditor.displayName = 'ReactQuillEditor'

export default ReactQuillEditor 