'use client'

import React, { useState, useRef, useCallback, useEffect } from 'react'
import { $getRoot, $getSelection, $isRangeSelection } from 'lexical'
import { $generateHtmlFromNodes, $generateNodesFromDOM } from '@lexical/html'
import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin'
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin'
import { ListPlugin } from '@lexical/react/LexicalListPlugin'
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { mergeRegister } from '@lexical/utils'
import { 
  $setBlocksType
} from '@lexical/selection'
import { 
  $isListNode, 
  INSERT_ORDERED_LIST_COMMAND, 
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
  ListItemNode,
  ListNode
} from '@lexical/list'
import { 
  $isHeadingNode, 
  $createHeadingNode, 
  $createQuoteNode,
  HeadingNode,
  QuoteNode,
  HeadingTagType
} from '@lexical/rich-text'
import { $createLinkNode, $isLinkNode, LinkNode } from '@lexical/link'
import { $createCodeNode, CodeNode } from '@lexical/code'
import { 
  FORMAT_TEXT_COMMAND,
  UNDO_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
  $createParagraphNode,
  EditorState,
  LexicalEditor as BaseLexicalEditor,
  TextFormatType,
  ElementNode,
  LexicalNode,
  $insertNodes,
  $createTextNode
} from 'lexical'
import { ImageNode, $createImageNode } from './nodes/ImageNode'
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary'
import './LexicalEditor.css'

// Importar ícones do Lucide React
import {
  Undo2,
  Redo2,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  Image,
  ChevronDown,
  Type,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Code,
  Upload,
  Link,
  FileText,
  Scale,
  FileCheck,
  MessageSquare,
  PenTool,
  X,
  Check
} from 'lucide-react'

// Importar ícones do Phosphor React
import {
  TextAa,
  TextAlignLeft,
  TextAlignCenter,
  TextAlignRight,
  TextAlignJustify,
  Palette,
  Printer,
  FloppyDisk,
  Eye,
  MagnifyingGlass,
  Download,
  Share,
  BookOpen,
  Notebook,
  Archive,
  Folder,
  Tag,
  Warning,
  Info,
  CheckCircle,
  XCircle,
  Table,
  Columns,
  Rows,
  Plus,
  Minus,
  ArrowCounterClockwise,
  ArrowClockwise,
  Selection,
  Copy,
  Scissors,
  ClipboardText,
  PaintBucket,
  Eraser,
  MagicWand,
  GridFour,
  Lightbulb,
  Star,
  Heart,
  Smiley,
  Calendar,
  Clock,
  MapPin,
  Phone,
  Envelope
} from 'phosphor-react'

// Configuração do tema
const theme = {
  ltr: 'ltr',
  rtl: 'rtl',
  placeholder: 'editor-placeholder',
  paragraph: 'editor-paragraph',
  quote: 'editor-quote',
  heading: {
    h1: 'editor-heading-h1',
    h2: 'editor-heading-h2',
    h3: 'editor-heading-h3',
    h4: 'editor-heading-h4',
    h5: 'editor-heading-h5',
    h6: 'editor-heading-h6',
  },
  list: {
    nested: {
      listitem: 'editor-nested-listitem',
    },
    ol: 'editor-list-ol',
    ul: 'editor-list-ul',
    listitem: 'editor-listitem',
  },
  image: 'editor-image',
  link: 'editor-link',
  text: {
    bold: 'editor-text-bold',
    italic: 'editor-text-italic',
    underline: 'editor-text-underline',
    strikethrough: 'editor-text-strikethrough',
    code: 'editor-text-code',
  },
  code: 'editor-code',
}

// Configuração de nós
const nodes = [
  HeadingNode,
  QuoteNode,
  ListNode,
  ListItemNode,
  LinkNode,
  CodeNode,
  ImageNode,
]

interface LexicalEditorProps {
  initialContent?: string
  placeholder?: string
  onChange?: (content: string, html: string) => void
  onSave?: (content: string, html: string) => void
  readOnly?: boolean
  className?: string
  autoFocus?: boolean
}

// Elementos legislativos disponíveis com mix de ícones Lucide + Phosphor
const legislativeElements = [
  // Elementos básicos (Lucide)
  { id: 'artigo', label: 'Artigo', icon: Scale, template: '<p><strong>Art. 1º</strong> - [Conteúdo do artigo]</p>' },
  { id: 'paragrafo', label: 'Parágrafo', icon: FileText, template: '<p><strong>§ 1º</strong> - [Conteúdo do parágrafo]</p>' },
  { id: 'inciso', label: 'Inciso', icon: List, template: '<p>I - [Conteúdo do inciso]</p>' },
  { id: 'alinea', label: 'Alínea', icon: ListOrdered, template: '<p>a) [Conteúdo da alínea]</p>' },
  { id: 'justificativa', label: 'Justificativa', icon: MessageSquare, template: '<p><strong>JUSTIFICATIVA</strong></p><p>[Fundamentação da proposta]</p>' },
  { id: 'assinatura', label: 'Assinatura', icon: PenTool, template: '<p><br></p><p>[Local], [data]</p><p><br></p><p>_________________________________</p><p>[Nome]</p><p>[Cargo]</p>' },
  
  // Elementos avançados (Phosphor)
  { id: 'ementa', label: 'Ementa', icon: BookOpen, template: '<p><strong>EMENTA:</strong> [Descrição sucinta do objeto]</p>' },
  { id: 'documento', label: 'Cabeçalho Documento', icon: Notebook, template: '<div style="text-align: center;"><p><strong>CÂMARA MUNICIPAL</strong></p><p><strong>[MUNICÍPIO - UF]</strong></p></div>' },
  { id: 'arquivo', label: 'Protocolo/Arquivo', icon: Archive, template: '<p><strong>Protocolo:</strong> _____ / <strong>Data:</strong> ___/___/2025</p>' },
  { id: 'endereco', label: 'Endereço/Local', icon: MapPin, template: '<p><strong>📍 Endereço:</strong> [Rua, número, bairro, cidade]</p>' },
  { id: 'contato', label: 'Contato/Telefone', icon: Phone, template: '<p><strong>📞 Telefone:</strong> (00) 0000-0000</p>' },
  { id: 'email', label: 'E-mail', icon: Envelope, template: '<p><strong>✉️ E-mail:</strong> [email@exemplo.com]</p>' },
  { id: 'destacar', label: 'Texto Destacado', icon: Lightbulb, template: '<p style="background-color: #fff3cd; padding: 10px; border-left: 4px solid #ffc107;"><strong>💡 IMPORTANTE:</strong> [Texto de destaque]</p>' },
  { id: 'observacao', label: 'Observação', icon: Info, template: '<p style="color: #6c757d; font-style: italic;"><strong>ℹ️ Observação:</strong> [Nota adicional]</p>' },
  { id: 'urgente', label: 'Urgente/Importante', icon: Warning, template: '<p style="color: #dc3545; font-weight: bold;"><strong>⚠️ URGENTE:</strong> [Conteúdo urgente]</p>' }
]

// Modal de inserção de imagem simplificado
function ImageModal({ isOpen, onClose, onInsert }: {
  isOpen: boolean
  onClose: () => void
  onInsert: (url: string) => void
}) {
  const [imageUrl, setImageUrl] = useState('')
  const [previewUrl, setPreviewUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (imageUrl.trim()) {
      onInsert(imageUrl.trim())
      resetForm()
      onClose()
    }
  }

  const resetForm = () => {
    setImageUrl('')
    setPreviewUrl('')
    setIsLoading(false)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione apenas arquivos de imagem.')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('A imagem deve ter no máximo 10MB.')
      return
    }

    setIsLoading(true)
    const reader = new FileReader()
    reader.onload = (event) => {
      const base64 = event.target?.result as string
      setImageUrl(base64)
      setPreviewUrl(base64)
      setIsLoading(false)
    }
    reader.readAsDataURL(file)
  }

  const handleUrlChange = (url: string) => {
    setImageUrl(url)
    if (url.trim() && (url.startsWith('http') || url.startsWith('data:'))) {
      setPreviewUrl(url)
    } else {
      setPreviewUrl('')
    }
  }

  // Drag and Drop functionality
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    const files = Array.from(e.dataTransfer.files)
    const imageFile = files.find(file => file.type.startsWith('image/'))
    
    if (imageFile) {
      // Simular o comportamento do input file diretamente
      if (fileInputRef.current) {
        const dataTransfer = new DataTransfer()
        dataTransfer.items.add(imageFile)
        fileInputRef.current.files = dataTransfer.files
        
        // Criar evento sintético compatível
        const syntheticEvent = {
          target: fileInputRef.current,
          currentTarget: fileInputRef.current
        } as React.ChangeEvent<HTMLInputElement>
        
        handleFileChange(syntheticEvent)
      }
    }
  }

  if (!isOpen) return null

  return (
    <div 
      className="image-modal-overlay" 
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)', // Overlay escuro
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        backdropFilter: 'blur(2px)', // Desfoque sutil
      }}
    >
      <div 
        className="image-modal-advanced" 
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: '#ffffff', // Fundo branco sólido
          borderRadius: '12px',
          padding: '0',
          maxWidth: '500px',
          width: '90%',
          maxHeight: '90vh',
          overflow: 'auto',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
          border: '1px solid #e0e0e0',
        }}
      >
        <div 
          className="image-modal-header"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '20px 24px',
            borderBottom: '1px solid #e0e0e0',
            backgroundColor: '#f8f9fa',
            borderRadius: '12px 12px 0 0',
          }}
        >
          <h3 style={{ 
            margin: 0, 
            fontSize: '18px', 
            fontWeight: '600',
            color: '#333'
          }}>
            🖼️ Inserir Imagem
          </h3>
          <button 
            className="image-modal-close" 
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '6px',
              color: '#666',
              fontSize: '20px',
              lineHeight: 1,
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#e9ecef'
              e.currentTarget.style.color = '#333'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.color = '#666'
            }}
          >
            <X size={20} />
          </button>
        </div>
        
        <form 
          onSubmit={handleSubmit} 
          className="image-modal-content"
          style={{
            padding: '24px',
            backgroundColor: '#ffffff', // Garantir fundo branco
          }}
        >
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label 
              htmlFor="imageUrl"
              style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: '500',
                color: '#333',
                fontSize: '14px',
              }}
            >
              🌐 URL da Imagem:
            </label>
            <input
              type="url"
              id="imageUrl"
              value={imageUrl}
              onChange={(e) => handleUrlChange(e.target.value)}
              placeholder="https://exemplo.com/imagem.jpg"
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '14px',
                backgroundColor: '#ffffff',
                transition: 'border-color 0.2s ease',
                boxSizing: 'border-box',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#007bff'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e0e0e0'
              }}
            />
          </div>
          
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '500',
              color: '#333',
              fontSize: '14px',
            }}>
              📁 Ou arraste uma imagem aqui / faça upload:
            </label>
            <div 
              className="upload-area"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              style={{
                border: '2px dashed #007bff',
                borderRadius: '8px',
                padding: '30px',
                textAlign: 'center',
                backgroundColor: '#f8f9fa', // Fundo claro
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                minHeight: '120px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onClick={() => fileInputRef.current?.click()}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#e3f2fd'
                e.currentTarget.style.borderColor = '#0056b3'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#f8f9fa'
                e.currentTarget.style.borderColor = '#007bff'
              }}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                style={{ display: 'none' }}
              />
              {isLoading ? (
                <>
                  <div 
                    className="spinner-border spinner-border-sm" 
                    style={{ 
                      width: '24px', 
                      height: '24px',
                      marginBottom: '10px',
                      borderWidth: '3px',
                      borderStyle: 'solid',
                      borderColor: '#007bff transparent #007bff transparent',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite',
                    }}
                  />
                  <p style={{ margin: 0, color: '#666' }}>Carregando imagem...</p>
                </>
              ) : (
                <>
                  <Upload size={32} style={{ color: '#007bff', marginBottom: '10px' }} />
                  <p style={{ margin: '0 0 5px 0', fontWeight: '600', color: '#333' }}>
                    <strong>Clique aqui ou arraste uma imagem</strong>
                  </p>
                  <p style={{ 
                    fontSize: '12px', 
                    color: '#666',
                    margin: 0,
                  }}>
                    Suporta JPG, PNG, GIF, WebP (máx. 10MB)
                  </p>
                </>
              )}
            </div>
          </div>

          {previewUrl && (
            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: '500',
                color: '#333',
                fontSize: '14px',
              }}>
                👀 Preview:
              </label>
              <div 
                className="image-preview" 
                style={{
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  padding: '15px',
                  backgroundColor: '#f8f9fa', // Fundo claro
                  textAlign: 'center',
                }}
              >
                <img 
                  src={previewUrl} 
                  alt="Preview" 
                  style={{ 
                    maxWidth: '100%', 
                    maxHeight: '250px', 
                    objectFit: 'contain',
                    borderRadius: '6px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    backgroundColor: '#ffffff', // Fundo branco para a imagem
                  }}
                />
                <p style={{ 
                  marginTop: '10px', 
                  fontSize: '12px', 
                  color: '#666',
                  margin: '10px 0 0 0',
                }}>
                  ✨ A imagem será inserida livremente no editor
                </p>
              </div>
            </div>
          )}

          <div 
            className="image-modal-actions" 
            style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'flex-end',
              paddingTop: '20px',
              borderTop: '1px solid #e0e0e0',
            }}
          >
            <button 
              type="button" 
              onClick={onClose}
              style={{
                padding: '10px 20px',
                border: '2px solid #6c757d',
                backgroundColor: '#ffffff',
                color: '#6c757d',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#6c757d'
                e.currentTarget.style.color = '#ffffff'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#ffffff'
                e.currentTarget.style.color = '#6c757d'
              }}
            >
              Cancelar
            </button>
            <button 
              type="submit"
              disabled={!imageUrl.trim()}
              style={{
                padding: '10px 20px',
                border: '2px solid #007bff',
                backgroundColor: imageUrl.trim() ? '#007bff' : '#e9ecef',
                color: imageUrl.trim() ? '#ffffff' : '#6c757d',
                borderRadius: '6px',
                cursor: imageUrl.trim() ? 'pointer' : 'not-allowed',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                if (imageUrl.trim()) {
                  e.currentTarget.style.backgroundColor = '#0056b3'
                  e.currentTarget.style.borderColor = '#0056b3'
                }
              }}
              onMouseLeave={(e) => {
                if (imageUrl.trim()) {
                  e.currentTarget.style.backgroundColor = '#007bff'
                  e.currentTarget.style.borderColor = '#007bff'
                }
              }}
            >
              ✅ Inserir Imagem
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Plugin da toolbar
function ToolbarPlugin({ 
  readOnly = false 
}: { 
  readOnly?: boolean 
}) {
  const [editor] = useLexicalComposerContext()
  const [activeEditor, setActiveEditor] = useState(editor)
  const [blockType, setBlockType] = useState('paragraph')
  const [selectedElementKey, setSelectedElementKey] = useState<string | null>(null)
  const [showImageModal, setShowImageModal] = useState(false)
  const [isBold, setIsBold] = useState(false)
  const [isItalic, setIsItalic] = useState(false)
  const [isUnderline, setIsUnderline] = useState(false)
  const [isStrikethrough, setIsStrikethrough] = useState(false)
  const [isCode, setIsCode] = useState(false)
  const [isLegislativeDropdownOpen, setIsLegislativeDropdownOpen] = useState(false)

  const updateToolbar = useCallback(() => {
    const selection = $getSelection()
    if ($isRangeSelection(selection)) {
      const anchorNode = selection.anchor.getNode()
      const element = 
        anchorNode.getKey() === 'root'
          ? anchorNode
          : anchorNode.getTopLevelElementOrThrow()
      const elementKey = element.getKey()
      const elementDOM = activeEditor.getElementByKey(elementKey)

      // Update text format
      setIsBold(selection.hasFormat('bold'))
      setIsItalic(selection.hasFormat('italic'))
      setIsUnderline(selection.hasFormat('underline'))
      setIsStrikethrough(selection.hasFormat('strikethrough'))
      setIsCode(selection.hasFormat('code'))

      // Update block type
      if ($isListNode(element)) {
        const parentList = element
        const type = parentList.getListType()
        setBlockType(type)
      } else {
        const type = $isHeadingNode(element)
          ? element.getTag()
          : element.getType()
        if (type in blockTypeToBlockName) {
          setBlockType(type as keyof typeof blockTypeToBlockName)
        }
      }
    }
  }, [activeEditor])

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      (_payload, newEditor) => {
        updateToolbar()
        setActiveEditor(newEditor)
        return false
      },
      COMMAND_PRIORITY_CRITICAL,
    )
  }, [editor, updateToolbar])

  const formatText = (format: TextFormatType) => {
    activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, format)
  }

  const formatParagraph = () => {
    activeEditor.update(() => {
      const selection = $getSelection()
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createParagraphNode())
      }
    })
  }

  const formatHeading = (headingSize: HeadingTagType) => {
    if (blockType !== headingSize) {
      activeEditor.update(() => {
        const selection = $getSelection()
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createHeadingNode(headingSize))
        }
      })
    }
  }

  const formatBulletList = () => {
    if (blockType !== 'bullet') {
      activeEditor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)
    } else {
      activeEditor.dispatchCommand(REMOVE_LIST_COMMAND, undefined)
    }
  }

  const formatNumberedList = () => {
    if (blockType !== 'number') {
      activeEditor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)
    } else {
      activeEditor.dispatchCommand(REMOVE_LIST_COMMAND, undefined)
    }
  }

  const formatQuote = () => {
    if (blockType !== 'quote') {
      activeEditor.update(() => {
        const selection = $getSelection()
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createQuoteNode())
        }
      })
    }
  }

  const formatCode = () => {
    if (blockType !== 'code') {
      activeEditor.update(() => {
        const selection = $getSelection()
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createCodeNode())
        }
      })
    }
  }

  const insertImage = (url: string) => {
    activeEditor.update(() => {
      const selection = $getSelection()
      if ($isRangeSelection(selection)) {
        // Criar o nó de imagem com configurações livres e flexíveis
        const imageNode = $createImageNode({
          altText: 'Imagem',
          src: url,
          alignment: 'inline', // Padrão inline para maior flexibilidade
          wrapText: false, // Sem quebra automática para maior controle
          zIndex: 1
        })
        
        // Inserir o nó de imagem
        $insertNodes([imageNode])
        
        // Adicionar um parágrafo vazio para continuar a edição
        const emptyParagraph = $createParagraphNode()
        $insertNodes([emptyParagraph])
      }
    })
    setShowImageModal(false)
  }

  const insertLegislativeElement = (template: string) => {
    activeEditor.update(() => {
      const selection = $getSelection()
      if ($isRangeSelection(selection)) {
        const parser = new DOMParser()
        const dom = parser.parseFromString(template, 'text/html')
        const nodes = $generateNodesFromDOM(activeEditor, dom)
        $insertNodes(nodes)
      }
    })
    setIsLegislativeDropdownOpen(false)
  }

  const blockTypeToBlockName = {
    bullet: 'Lista com Marcadores',
    check: 'Lista de Verificação',
    code: 'Bloco de Código',
    h1: 'Título 1',
    h2: 'Título 2',
    h3: 'Título 3',
    h4: 'Título 4',
    h5: 'Título 5',
    h6: 'Título 6',
    number: 'Lista Numerada',
    paragraph: 'Parágrafo',
    quote: 'Citação',
  }

  if (readOnly) {
    return null
  }

  return (
    <>
      <div className="toolbar">
        {/* Grupo 1: Desfazer/Refazer */}
        <div className="toolbar-group">
          <button
            onClick={() => activeEditor.dispatchCommand(UNDO_COMMAND, undefined)}
            className="toolbar-item"
            title="Desfazer"
          >
            <Undo2 size={16} />
          </button>
          <button
            onClick={() => activeEditor.dispatchCommand(REDO_COMMAND, undefined)}
            className="toolbar-item"
            title="Refazer"
          >
            <Redo2 size={16} />
          </button>
        </div>

        <div className="toolbar-divider"></div>

        {/* Grupo 2: Tipos de bloco */}
        <div className="toolbar-group">
          <select
            className="toolbar-item dropdown"
            value={blockType}
            onChange={(e) => {
              const newBlockType = e.target.value
              if (newBlockType === 'paragraph') {
                formatParagraph()
              } else if (newBlockType in blockTypeToBlockName) {
                if (newBlockType.startsWith('h')) {
                  formatHeading(newBlockType as HeadingTagType)
                } else if (newBlockType === 'bullet') {
                  formatBulletList()
                } else if (newBlockType === 'number') {
                  formatNumberedList()
                } else if (newBlockType === 'quote') {
                  formatQuote()
                } else if (newBlockType === 'code') {
                  formatCode()
                }
              }
            }}
          >
            {Object.entries(blockTypeToBlockName).map(([key, name]) => (
              <option key={key} value={key}>
                {name}
              </option>
            ))}
          </select>
        </div>

        <div className="toolbar-divider"></div>

        {/* Grupo 3: Formatação de texto */}
        <div className="toolbar-group">
          <button
            onClick={() => formatText('bold')}
            className={`toolbar-item ${isBold ? 'active' : ''}`}
            title="Negrito"
          >
            <Bold size={16} />
          </button>
          <button
            onClick={() => formatText('italic')}
            className={`toolbar-item ${isItalic ? 'active' : ''}`}
            title="Itálico"
          >
            <Italic size={16} />
          </button>
          <button
            onClick={() => formatText('underline')}
            className={`toolbar-item ${isUnderline ? 'active' : ''}`}
            title="Sublinhado"
          >
            <Underline size={16} />
          </button>
          <button
            onClick={() => formatText('strikethrough')}
            className={`toolbar-item ${isStrikethrough ? 'active' : ''}`}
            title="Tachado"
          >
            <Strikethrough size={16} />
          </button>
        </div>

        <div className="toolbar-divider"></div>

        {/* Grupo 4: Listas */}
        <div className="toolbar-group">
          <button
            onClick={formatBulletList}
            className={`toolbar-item ${blockType === 'bullet' ? 'active' : ''}`}
            title="Lista com marcadores"
          >
            <List size={16} />
          </button>
          <button
            onClick={formatNumberedList}
            className={`toolbar-item ${blockType === 'number' ? 'active' : ''}`}
            title="Lista numerada"
          >
            <ListOrdered size={16} />
          </button>
        </div>

        <div className="toolbar-divider"></div>

        {/* Grupo 5: Mídia */}
        <div className="toolbar-group">
          <button
            onClick={() => setShowImageModal(true)}
            className="toolbar-item"
            title="Inserir Imagem"
          >
            <Image size={16} />
          </button>
          <button
            onClick={() => formatText('code')}
            className={`toolbar-item ${isCode ? 'active' : ''}`}
            title="Código inline"
          >
            <Code size={16} />
          </button>
        </div>

        <div className="toolbar-divider"></div>

        {/* Grupo 6: Elementos Legislativos */}
        <div className="toolbar-group">
          <div className="legislative-dropdown">
            <button 
              className="toolbar-item dropdown"
              onClick={() => setIsLegislativeDropdownOpen(!isLegislativeDropdownOpen)}
              title="Elementos Legislativos"
            >
              <Scale size={16} />
              Elementos Legislativos
              <ChevronDown size={14} className="ml-1" />
            </button>
            
            {isLegislativeDropdownOpen && (
              <div className="dropdown-menu">
                {legislativeElements.map((element) => {
                  const IconComponent = element.icon
                  return (
                    <button
                      key={element.id}
                      className="dropdown-item"
                      onClick={() => insertLegislativeElement(element.template)}
                    >
                      <IconComponent size={16} className="me-2" />
                      {element.label}
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        <div className="toolbar-divider"></div>

        {/* Grupo 7: Ferramentas Avançadas (Phosphor Icons) */}
        <div className="toolbar-group">
          <button
            onClick={() => window.print()}
            className="toolbar-item"
            title="Imprimir Documento"
          >
            <Printer size={16} />
          </button>
          <button
            onClick={() => {
              const selection = window.getSelection();
              if (selection) {
                const text = selection.toString();
                if (text) {
                  navigator.clipboard.writeText(text);
                }
              }
            }}
            className="toolbar-item"
            title="Buscar/Localizar"
          >
            <MagnifyingGlass size={16} />
          </button>
          <button
            onClick={() => {
              // Funcionalidade de exportar
              const editorContent = activeEditor.getEditorState().toJSON();
              console.log('Exportar documento:', editorContent);
            }}
            className="toolbar-item"
            title="Exportar Documento"
          >
            <Download size={16} />
          </button>
        </div>

        <div className="toolbar-divider"></div>

        {/* Grupo 8: Alinhamento de Texto */}
        <div className="toolbar-group">
          <button
            onClick={() => {
              activeEditor.update(() => {
                const selection = $getSelection();
                if ($isRangeSelection(selection)) {
                  $setBlocksType(selection, () => $createParagraphNode());
                }
              });
            }}
            className="toolbar-item"
            title="Alinhar à Esquerda"
          >
            <TextAlignLeft size={16} />
          </button>
          <button
            onClick={() => {
              activeEditor.update(() => {
                const selection = $getSelection();
                if ($isRangeSelection(selection)) {
                  $setBlocksType(selection, () => $createParagraphNode());
                }
              });
            }}
            className="toolbar-item"
            title="Centralizar"
          >
            <TextAlignCenter size={16} />
          </button>
          <button
            onClick={() => {
              activeEditor.update(() => {
                const selection = $getSelection();
                if ($isRangeSelection(selection)) {
                  $setBlocksType(selection, () => $createParagraphNode());
                }
              });
            }}
            className="toolbar-item"
            title="Alinhar à Direita"
          >
            <TextAlignRight size={16} />
          </button>
          <button
            onClick={() => {
              activeEditor.update(() => {
                const selection = $getSelection();
                if ($isRangeSelection(selection)) {
                  $setBlocksType(selection, () => $createParagraphNode());
                }
              });
            }}
            className="toolbar-item"
            title="Justificar"
          >
            <TextAlignJustify size={16} />
          </button>
        </div>

        <div className="toolbar-divider"></div>

        {/* Grupo 9: Ferramentas de Edição */}
        <div className="toolbar-group">
          <button
            onClick={() => {
              const selection = window.getSelection();
              if (selection) {
                const text = selection.toString();
                if (text) {
                  navigator.clipboard.writeText(text);
                }
              }
            }}
            className="toolbar-item"
            title="Copiar"
          >
            <Copy size={16} />
          </button>
          <button
            onClick={() => {
              const selection = window.getSelection();
              if (selection && selection.rangeCount > 0) {
                selection.deleteFromDocument();
                navigator.clipboard.writeText(selection.toString());
              }
            }}
            className="toolbar-item"
            title="Recortar"
          >
            <Scissors size={16} />
          </button>
          <button
            onClick={async () => {
              try {
                const text = await navigator.clipboard.readText();
                activeEditor.update(() => {
                  const selection = $getSelection();
                  if ($isRangeSelection(selection)) {
                    selection.insertText(text);
                  }
                });
              } catch (err) {
                console.log('Não foi possível colar:', err);
              }
            }}
            className="toolbar-item"
            title="Colar"
          >
            <ClipboardText size={16} />
          </button>
        </div>

        <div className="toolbar-divider"></div>

        {/* Grupo 10: Elementos Especiais */}
        <div className="toolbar-group">
          <button
            onClick={() => {
              activeEditor.update(() => {
                const selection = $getSelection();
                if ($isRangeSelection(selection)) {
                  selection.insertText('📅 ' + new Date().toLocaleDateString('pt-BR'));
                }
              });
            }}
            className="toolbar-item"
            title="Inserir Data"
          >
            <Calendar size={16} />
          </button>
          <button
            onClick={() => {
              activeEditor.update(() => {
                const selection = $getSelection();
                if ($isRangeSelection(selection)) {
                  selection.insertText('🕐 ' + new Date().toLocaleTimeString('pt-BR'));
                }
              });
            }}
            className="toolbar-item"
            title="Inserir Hora"
          >
            <Clock size={16} />
          </button>
          <button
            onClick={() => {
              activeEditor.update(() => {
                const selection = $getSelection();
                if ($isRangeSelection(selection)) {
                  selection.insertText('⭐ ');
                }
              });
            }}
            className="toolbar-item"
            title="Inserir Símbolo"
          >
            <Star size={16} />
          </button>
        </div>

        <div className="toolbar-divider"></div>

        {/* Grupo 11: Visualização */}
        <div className="toolbar-group">
          <button
            onClick={() => {
              // Toggle modo visualização
              console.log('Modo visualização');
            }}
            className="toolbar-item"
            title="Visualizar Documento"
          >
            <Eye size={16} />
          </button>
          <button
            onClick={() => {
              // Compartilhar documento
              console.log('Compartilhar documento');
            }}
            className="toolbar-item"
            title="Compartilhar"
          >
            <Share size={16} />
          </button>
          <button
            onClick={() => {
              activeEditor.update(() => {
                const root = $getRoot();
                const html = $generateHtmlFromNodes(activeEditor, null);
                console.log('Salvando documento:', html);
              });
            }}
            className="toolbar-item"
            title="Salvar Manualmente"
          >
            <FloppyDisk size={16} />
          </button>
        </div>
      </div>

      <ImageModal
        isOpen={showImageModal}
        onClose={() => setShowImageModal(false)}
        onInsert={insertImage}
      />
    </>
  )
}

// Plugin para capturar mudanças e salvar com Ctrl+S
function SavePlugin({ onSave }: { onSave?: (content: string, html: string) => void }) {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    if (!onSave) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === 's') {
        event.preventDefault()
        editor.update(() => {
          const root = $getRoot()
          const html = $generateHtmlFromNodes(editor, null)
          const content = root.getTextContent()
          onSave(content, html)
        })
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [editor, onSave])

  return null
}

// Plugin para definir conteúdo inicial
function InitialContentPlugin({ initialContent }: { initialContent?: string }) {
  const [editor] = useLexicalComposerContext()
  const hasSet = useRef(false)

  useEffect(() => {
    if (!initialContent || hasSet.current) return

    hasSet.current = true
    editor.update(() => {
      try {
        const parser = new DOMParser()
        const dom = parser.parseFromString(initialContent, 'text/html')
        const nodes = $generateNodesFromDOM(editor, dom)
        const root = $getRoot()
        root.clear()
        
        // Filtrar apenas nós válidos (ElementNode ou DecoratorNode)
        const validNodes = nodes.filter(node => {
          return node && (node.getType() === 'paragraph' || node.getType() === 'heading' || node.getType() === 'quote' || node.getType() === 'list' || node.getType() === 'listitem')
        })
        
        if (validNodes.length > 0) {
          root.append(...validNodes)
        } else {
          // Fallback: criar um parágrafo simples
          const paragraph = $createParagraphNode()
          const textNode = $createTextNode(initialContent.replace(/<[^>]*>/g, ''))
          paragraph.append(textNode)
          root.append(paragraph)
        }
      } catch (error) {
        console.error('Erro ao definir conteúdo inicial:', error)
        // Fallback em caso de erro
        const root = $getRoot()
        root.clear()
        const paragraph = $createParagraphNode()
        const textNode = $createTextNode(initialContent.replace(/<[^>]*>/g, ''))
        paragraph.append(textNode)
        root.append(paragraph)
      }
    })
  }, [editor, initialContent])

  return null
}

// Componente principal do editor
export default function LexicalEditor({
  initialContent,
  placeholder = 'Digite seu conteúdo aqui...',
  onChange,
  onSave,
  readOnly = false,
  className = '',
  autoFocus = false
}: LexicalEditorProps) {
  const initialConfig = {
    namespace: 'LexicalEditor',
    theme,
    nodes,
    onError: (error: Error) => {
      console.error('Erro no editor:', error)
    },
    editable: !readOnly,
  }

  const handleChange = useCallback((editorState: EditorState, editor: BaseLexicalEditor) => {
    if (!onChange) return

    editor.update(() => {
      const root = $getRoot()
      const html = $generateHtmlFromNodes(editor, null)
      const content = root.getTextContent()
      onChange(content, html)
    })
  }, [onChange])

  const placeholderElement = useCallback((isEditable: boolean) => {
    return isEditable ? <div className="editor-placeholder">{placeholder}</div> : null
  }, [placeholder])

  return (
    <div className={`lexical-editor ${className}`}>
      <LexicalComposer initialConfig={initialConfig}>
        <div className="editor-container">
          <ToolbarPlugin readOnly={readOnly} />
          <div className="editor-inner">
            <RichTextPlugin
              contentEditable={
                <ContentEditable className="editor-input" />
              }
              placeholder={placeholderElement}
              ErrorBoundary={LexicalErrorBoundary}
            />
            <OnChangePlugin onChange={handleChange} />
            <HistoryPlugin />
            <LinkPlugin />
            <ListPlugin />
            <SavePlugin onSave={onSave} />
            <InitialContentPlugin initialContent={initialContent} />
            {autoFocus && <AutoFocusPlugin />}
          </div>
        </div>
      </LexicalComposer>
    </div>
  )
} 