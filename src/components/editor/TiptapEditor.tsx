'use client'

import React, { useCallback, useRef, useEffect, useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TextAlign from '@tiptap/extension-text-align'
import TextStyle from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import FontFamily from '@tiptap/extension-font-family'
import Underline from '@tiptap/extension-underline'
import ResizableImage from './extensions/ResizableImage'
import AutoPagination from './extensions/AutoPagination'
import ImageUploader from './ImageUploader'
import './extensions/ResizableImage.css'
import './extensions/AutoPagination.css'
import './ImageUploader.css'
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableHeader from '@tiptap/extension-table-header'
import TableCell from '@tiptap/extension-table-cell'
import ListItem from '@tiptap/extension-list-item'
import BulletList from '@tiptap/extension-bullet-list'
import OrderedList from '@tiptap/extension-ordered-list'

import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  List, ListOrdered, Quote, Code, Image as ImageIcon,
  Table as TableIcon, Plus, Minus, Save, Eye, Download,
  Type, Palette, FileText, Hash, Calendar, User,
  MapPin, Mail, Phone, FileSignature, AlertCircle,
  Undo2, Redo2, Printer, ZoomIn, ZoomOut, Maximize
} from 'lucide-react'

import './TiptapEditor.css'

interface TiptapEditorProps {
  initialContent?: string
  onSave?: (content: string, html: string) => void
  onUpdate?: (content: string, html: string) => void
  className?: string
}

// Extensão customizada para elementos legislativos
const LegislativeElements = {
  artigo: () => '<p><strong>Art. ___º</strong> - </p>',
  paragrafo: () => '<p><strong>Parágrafo único.</strong> </p>',
  inciso: () => '<p style="margin-left: 2rem;"><strong>I -</strong> </p>',
  alinea: () => '<p style="margin-left: 4rem;"><strong>a)</strong> </p>',
  ementa: () => '<p><strong>EMENTA:</strong> </p>',
  justificativa: () => '<h3>JUSTIFICATIVA</h3><p></p>',
  assinatura: () => `
    <div style="text-align: center; margin-top: 3rem;">
      <p>_________________________________</p>
      <p><strong>[Nome do Responsável]</strong></p>
      <p>[Cargo]</p>
    </div>
  `,
  cabecalho: () => '<h1 style="text-align: center;">[TÍTULO DO DOCUMENTO]</h1>',
  protocolo: () => '<p><strong>Protocolo nº:</strong> ___/2025</p>',
  endereco: () => '<p><strong>Endereço:</strong> [Endereço completo]</p>',
  contato: () => '<p><strong>Contato:</strong> [Informações de contato]</p>',
  email: () => '<p><strong>E-mail:</strong> [email@exemplo.com]</p>',
  data: () => `<p><strong>Data:</strong> ${new Date().toLocaleDateString('pt-BR')}</p>`,
  urgente: () => '<p style="color: red; font-weight: bold;">🚨 URGENTE</p>',
  observacao: () => '<blockquote><strong>Observação:</strong> [Texto da observação]</blockquote>'
}

const TiptapEditor: React.FC<TiptapEditorProps> = ({
  initialContent = '',
  onSave,
  onUpdate,
  className = ''
}) => {
  const [pages, setPages] = useState([{ id: '1', content: initialContent }])
  const [currentPage, setCurrentPage] = useState(0)
  const [zoom, setZoom] = useState(100)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [wordCount, setWordCount] = useState(0)
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [pageInfo, setPageInfo] = useState({ currentPage: 1, totalPages: 1, lineCount: 0 })
  const [showOverflowWarning, setShowOverflowWarning] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      TextStyle,
      Color,
      FontFamily,
      Underline,
      ResizableImage,
      AutoPagination.configure({
        enableAutoBreak: true,
        maxLinesPerPage: 39, // ~39 linhas por página A4
        onPageBreak: (pageNumber) => {
          console.log(`Nova página criada: ${pageNumber}`)
          setPageInfo(prev => ({ ...prev, totalPages: pageNumber }))
        },
        onPageOverflow: (pageNumber, overflowHeight) => {
          console.log(`Overflow na página ${pageNumber}: ${overflowHeight}px`)
          setShowOverflowWarning(true)
          setTimeout(() => setShowOverflowWarning(false), 3000)
        }
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      ListItem,
      BulletList.configure({
        keepMarks: true,
        keepAttributes: false,
      }),
      OrderedList.configure({
        keepMarks: true,
        keepAttributes: false,
      }),
    ],
    content: pages[currentPage]?.content || initialContent,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      const text = editor.getText()
      
      // Atualizar contagem de palavras
      const words = text.split(/\s+/).filter(word => word.length > 0).length
      setWordCount(words)
      
      // Calcular linhas aproximadas (assumindo ~10 palavras por linha)
      const estimatedLines = Math.ceil(words / 10)
      
      // Obter informações de paginação da extensão
      const autoPagination = editor.extensionManager.extensions.find(ext => ext.name === 'autoPagination')
      if (autoPagination) {
        try {
          const paginationInfo = (autoPagination as any).getPageInfo?.()
          if (paginationInfo) {
            setPageInfo({
              currentPage: paginationInfo.currentPage,
              totalPages: paginationInfo.totalPages,
              lineCount: estimatedLines
            })
          }
        } catch (error) {
          console.warn('Erro ao obter informações de paginação:', error)
        }
      }
      
      // Atualizar conteúdo da página atual
      setPages(prev => prev.map((page, index) => 
        index === currentPage ? { ...page, content: html } : page
      ))
      
      if (onUpdate) {
        onUpdate(text, html)
      }
    },
  })

  // Atualizar editor quando mudar de página
  useEffect(() => {
    if (editor && pages[currentPage]) {
      editor.commands.setContent(pages[currentPage].content)
    }
  }, [currentPage, editor])

  // Função para salvar
  const handleSave = useCallback(async () => {
    if (!editor || !onSave) return
    
    setIsSaving(true)
    try {
      const html = editor.getHTML()
      const text = editor.getText()
      await onSave(text, html)
      setLastSaved(new Date())
    } catch (error) {
      console.error('Erro ao salvar:', error)
    } finally {
      setIsSaving(false)
    }
  }, [editor, onSave])

  // Função para adicionar página
  const addPage = useCallback(() => {
    const newPage = {
      id: String(pages.length + 1),
      content: '<p></p>'
    }
    setPages(prev => [...prev, newPage])
    setCurrentPage(pages.length)
  }, [pages.length])

  // Função para remover página
  const removePage = useCallback((index: number) => {
    if (pages.length <= 1) return
    
    setPages(prev => prev.filter((_, i) => i !== index))
    if (currentPage >= pages.length - 1) {
      setCurrentPage(Math.max(0, pages.length - 2))
    }
  }, [pages.length, currentPage])

  // Função para inserir elemento legislativo
  const insertLegislativeElement = useCallback((type: keyof typeof LegislativeElements) => {
    if (!editor) return

    const content = LegislativeElements[type]()
    editor.commands.insertContent(content)
    editor.commands.focus()
  }, [editor])

  // Estado para controlar o modal de upload
  const [showImageUploader, setShowImageUploader] = useState(false)

  // Função para inserir imagem
  const insertImage = useCallback(() => {
    setShowImageUploader(true)
  }, [])

  // Função para lidar com seleção de imagem
  const handleImageSelect = useCallback((file: File, optimizedDataUrl: string) => {
    if (editor) {
      editor.commands.insertContent({
        type: 'resizableImage',
        attrs: {
          src: optimizedDataUrl,
          alt: file.name
        }
      })
    }
  }, [editor])

  // Função para inserir tabela
  const insertTable = useCallback(() => {
    if (!editor) return
    editor.commands.insertTable({ rows: 3, cols: 3, withHeaderRow: true })
  }, [editor])

  // Atalhos de teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 's':
            e.preventDefault()
            handleSave()
            break
          case '=':
          case '+':
            e.preventDefault()
            setZoom(prev => Math.min(200, prev + 25))
            break
          case '-':
            e.preventDefault()
            setZoom(prev => Math.max(50, prev - 25))
            break
        }
      }
      
      if (e.key === 'F11') {
        e.preventDefault()
        setIsFullscreen(prev => !prev)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleSave])

  if (!editor) {
    return (
      <div className="tiptap-loading">
        <div className="loading-spinner"></div>
        <p>Carregando editor...</p>
      </div>
    )
  }

  return (
    <div className={`tiptap-editor ${className} ${isFullscreen ? 'fullscreen' : ''}`}>
      {/* Header com ferramentas */}
      <div className="tiptap-header">
        <div className="header-section">
          <h3>Editor de Documentos</h3>
          <div className="document-stats">
            <span>{wordCount} palavras</span>
            {lastSaved && (
              <span>Salvo: {lastSaved.toLocaleTimeString('pt-BR')}</span>
            )}
          </div>
        </div>

        <div className="header-actions">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="btn-save"
            title="Salvar (Ctrl+S)"
          >
            <Save size={16} />
            {isSaving ? 'Salvando...' : 'Salvar'}
          </button>
          
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="btn-fullscreen"
            title="Tela cheia (F11)"
          >
            <Maximize size={16} />
          </button>
        </div>
      </div>

      <div className="tiptap-content">
        {/* Sidebar de páginas */}
        <div className="pages-sidebar">
          <div className="pages-header">
            <h4>Páginas</h4>
            <button onClick={addPage} className="btn-add-page" title="Nova página">
              <Plus size={16} />
            </button>
          </div>
          
          <div className="pages-list">
            {pages.map((page, index) => (
              <div
                key={page.id}
                className={`page-item ${index === currentPage ? 'active' : ''}`}
                onClick={() => setCurrentPage(index)}
              >
                <div className="page-preview">
                  <div className="page-number">{index + 1}</div>
                  {pages.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        removePage(index)
                      }}
                      className="btn-remove-page"
                      title="Remover página"
                    >
                      <Minus size={12} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Controles de zoom */}
          <div className="zoom-controls">
            <label>Zoom: {zoom}%</label>
            <div className="zoom-buttons">
              <button onClick={() => setZoom(prev => Math.max(50, prev - 25))}>
                <ZoomOut size={14} />
              </button>
              <button onClick={() => setZoom(100)}>100%</button>
              <button onClick={() => setZoom(prev => Math.min(200, prev + 25))}>
                <ZoomIn size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Área principal do editor */}
        <div className="editor-main">
          {/* Toolbar */}
          <div className="tiptap-toolbar">
            {/* Formatação básica */}
            <div className="toolbar-group">
              <button
                onClick={() => editor.commands.undo()}
                disabled={!editor.can().undo()}
                title="Desfazer"
              >
                <Undo2 size={16} />
              </button>
              <button
                onClick={() => editor.commands.redo()}
                disabled={!editor.can().redo()}
                title="Refazer"
              >
                <Redo2 size={16} />
              </button>
            </div>

            <div className="toolbar-separator"></div>

            <div className="toolbar-group">
              <button
                onClick={() => editor.commands.toggleBold()}
                className={editor.isActive('bold') ? 'active' : ''}
                title="Negrito"
              >
                <Bold size={16} />
              </button>
              <button
                onClick={() => editor.commands.toggleItalic()}
                className={editor.isActive('italic') ? 'active' : ''}
                title="Itálico"
              >
                <Italic size={16} />
              </button>
              <button
                onClick={() => editor.commands.toggleUnderline()}
                className={editor.isActive('underline') ? 'active' : ''}
                title="Sublinhado"
              >
                <UnderlineIcon size={16} />
              </button>
              <button
                onClick={() => editor.commands.toggleStrike()}
                className={editor.isActive('strike') ? 'active' : ''}
                title="Riscado"
              >
                <Strikethrough size={16} />
              </button>
            </div>

            <div className="toolbar-separator"></div>

            {/* Alinhamento */}
            <div className="toolbar-group">
              <button
                onClick={() => editor.commands.setTextAlign('left')}
                className={editor.isActive({ textAlign: 'left' }) ? 'active' : ''}
                title="Alinhar à esquerda"
              >
                <AlignLeft size={16} />
              </button>
              <button
                onClick={() => editor.commands.setTextAlign('center')}
                className={editor.isActive({ textAlign: 'center' }) ? 'active' : ''}
                title="Centralizar"
              >
                <AlignCenter size={16} />
              </button>
              <button
                onClick={() => editor.commands.setTextAlign('right')}
                className={editor.isActive({ textAlign: 'right' }) ? 'active' : ''}
                title="Alinhar à direita"
              >
                <AlignRight size={16} />
              </button>
              <button
                onClick={() => editor.commands.setTextAlign('justify')}
                className={editor.isActive({ textAlign: 'justify' }) ? 'active' : ''}
                title="Justificar"
              >
                <AlignJustify size={16} />
              </button>
            </div>

            <div className="toolbar-separator"></div>

            {/* Listas */}
            <div className="toolbar-group">
              <button
                onClick={() => editor.commands.toggleBulletList()}
                className={editor.isActive('bulletList') ? 'active' : ''}
                title="Lista com marcadores"
              >
                <List size={16} />
              </button>
              <button
                onClick={() => editor.commands.toggleOrderedList()}
                className={editor.isActive('orderedList') ? 'active' : ''}
                title="Lista numerada"
              >
                <ListOrdered size={16} />
              </button>
              <button
                onClick={() => editor.commands.toggleBlockquote()}
                className={editor.isActive('blockquote') ? 'active' : ''}
                title="Citação"
              >
                <Quote size={16} />
              </button>
            </div>

            <div className="toolbar-separator"></div>

            {/* Mídia */}
            <div className="toolbar-group">
              <button onClick={insertImage} title="Inserir imagem">
                <ImageIcon size={16} />
              </button>
              <button onClick={insertTable} title="Inserir tabela">
                <TableIcon size={16} />
              </button>
            </div>
          </div>

          {/* Área do documento */}
          <div className="document-area" style={{ transform: `scale(${zoom / 100})` }}>
            <div className="auto-paginated-content">
              {/* Indicador de página atual */}
              <div className="current-page-indicator">
                Página {pageInfo.currentPage} de {pageInfo.totalPages}
              </div>
              
              {/* Contador de linhas */}
              <div className="page-line-counter">
                {pageInfo.lineCount} linhas
              </div>
              
              {/* Indicador de overflow */}
              {showOverflowWarning && (
                <div className="page-overflow-indicator">
                  Página cheia! Nova página será criada automaticamente.
                </div>
              )}
              
              {/* Margens ABNT visuais */}
              <div className="abnt-margins">
                <div className="abnt-margin-guide top"></div>
                <div className="abnt-margin-guide bottom"></div>
                <div className="abnt-margin-guide left"></div>
                <div className="abnt-margin-guide right"></div>
              </div>
              
              {/* Área de conteúdo */}
              <div className="content-area">
                <EditorContent editor={editor} />
              </div>
              
              {/* Rodapé com informações */}
              <div className="page-footer" style={{ 
                position: 'absolute', 
                bottom: '20px', 
                left: '50%', 
                transform: 'translateX(-50%)',
                fontSize: '11px',
                color: '#64748b'
              }}>
                {new Date().toLocaleDateString('pt-BR')} | {wordCount} palavras | A4 - 21×29.7cm
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar de elementos legislativos */}
        <div className="legislative-sidebar">
          <h4>Elementos Legislativos</h4>
          
          <div className="elements-grid">
            <button
              onClick={() => insertLegislativeElement('artigo')}
              className="element-btn"
              title="Inserir artigo"
            >
              <Hash size={16} />
              <span>Artigo</span>
            </button>
            
            <button
              onClick={() => insertLegislativeElement('paragrafo')}
              className="element-btn"
              title="Inserir parágrafo"
            >
              <FileText size={16} />
              <span>Parágrafo</span>
            </button>
            
            <button
              onClick={() => insertLegislativeElement('inciso')}
              className="element-btn"
              title="Inserir inciso"
            >
              <Type size={16} />
              <span>Inciso</span>
            </button>
            
            <button
              onClick={() => insertLegislativeElement('alinea')}
              className="element-btn"
              title="Inserir alínea"
            >
              <Type size={16} />
              <span>Alínea</span>
            </button>
            
            <button
              onClick={() => insertLegislativeElement('ementa')}
              className="element-btn"
              title="Inserir ementa"
            >
              <FileSignature size={16} />
              <span>Ementa</span>
            </button>
            
            <button
              onClick={() => insertLegislativeElement('justificativa')}
              className="element-btn"
              title="Inserir justificativa"
            >
              <AlertCircle size={16} />
              <span>Justificativa</span>
            </button>
            
            <button
              onClick={() => insertLegislativeElement('assinatura')}
              className="element-btn"
              title="Inserir área de assinatura"
            >
              <User size={16} />
              <span>Assinatura</span>
            </button>
            
            <button
              onClick={() => insertLegislativeElement('cabecalho')}
              className="element-btn"
              title="Inserir cabeçalho"
            >
              <FileText size={16} />
              <span>Cabeçalho</span>
            </button>
            
            <button
              onClick={() => insertLegislativeElement('protocolo')}
              className="element-btn"
              title="Inserir protocolo"
            >
              <Hash size={16} />
              <span>Protocolo</span>
            </button>
            
            <button
              onClick={() => insertLegislativeElement('data')}
              className="element-btn"
              title="Inserir data atual"
            >
              <Calendar size={16} />
              <span>Data</span>
            </button>
            
            <button
              onClick={() => insertLegislativeElement('endereco')}
              className="element-btn"
              title="Inserir endereço"
            >
              <MapPin size={16} />
              <span>Endereço</span>
            </button>
            
            <button
              onClick={() => insertLegislativeElement('email')}
              className="element-btn"
              title="Inserir e-mail"
            >
              <Mail size={16} />
              <span>E-mail</span>
            </button>
            
            <button
              onClick={() => insertLegislativeElement('urgente')}
              className="element-btn urgent"
              title="Marcar como urgente"
            >
              <AlertCircle size={16} />
              <span>Urgente</span>
            </button>
            
            <button
              onClick={() => insertLegislativeElement('observacao')}
              className="element-btn"
              title="Inserir observação"
            >
              <Quote size={16} />
              <span>Observação</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modal de upload de imagens */}
      {showImageUploader && (
        <ImageUploader
          onImageSelect={handleImageSelect}
          onClose={() => setShowImageUploader(false)}
          maxFileSize={10}
          maxWidth={1920}
          maxHeight={1080}
          quality={0.85}
        />
      )}

      {/* Barra de progresso de página */}
      <div className="page-progress">
        <div 
          className="page-progress-bar" 
          style={{ width: `${(pageInfo.currentPage / pageInfo.totalPages) * 100}%` }}
        ></div>
      </div>
      
      {/* Botão flutuante para adicionar página */}
      <button 
        className="add-page-floating-btn"
        onClick={() => {
          if (editor) {
            editor.commands.insertContent('<div class="page-break"></div>')
          }
        }}
        title="Adicionar nova página (Ctrl+Enter)"
      >
        +
      </button>
    </div>
  )
}

export default TiptapEditor 