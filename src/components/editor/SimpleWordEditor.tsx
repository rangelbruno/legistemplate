'use client'

import React, { useState, useCallback, useMemo, memo, useRef, useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TextAlign from '@tiptap/extension-text-align'
import TextStyle from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import FontFamily from '@tiptap/extension-font-family'
import Underline from '@tiptap/extension-underline'
import {
  Plus, Minus, Save, ZoomIn, ZoomOut, Maximize
} from 'lucide-react'
import './SimpleWordEditor.css'

// Constantes para o A4
const A4_DIMENSIONS = {
  width: 794,   // 21cm em pixels (96 DPI)
  height: 1123, // 29.7cm em pixels (96 DPI)
}

const ABNT_MARGINS = {
  top: 113,    // 3cm
  right: 76,   // 2cm  
  bottom: 76,  // 2cm
  left: 113    // 3cm
}

const CONTENT_AREA = {
  width: A4_DIMENSIONS.width - ABNT_MARGINS.left - ABNT_MARGINS.right,
  height: A4_DIMENSIONS.height - ABNT_MARGINS.top - ABNT_MARGINS.bottom
}

const MAX_CONTENT_HEIGHT = 850 // pixels aproximadamente

// Interface para página
interface Page {
  id: string
  content: string
  wordCount: number
  characterCount: number
}

// Interface das props
interface SimpleWordEditorProps {
  initialContent?: string
  onSave?: (content: string, html: string) => void
  onUpdate?: (content: string, html: string) => void
  className?: string
}

// Componente de página individual
const PageComponent = memo<{
  page: Page
  pageNumber: number
  isActive: boolean
  zoom: number
  onContentChange: (pageId: string, content: string) => void
  onPageOverflow: (pageId: string) => void
}>(({ page, pageNumber, isActive, zoom, onContentChange, onPageOverflow }) => {
  const editorRef = useRef<HTMLDivElement>(null)
  
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      TextStyle,
      Color,
      FontFamily,
      Underline,
    ],
    content: page.content,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      onContentChange(page.id, html)
      
      // Verificar overflow
      if (editorRef.current) {
        const contentHeight = editorRef.current.scrollHeight
        if (contentHeight > MAX_CONTENT_HEIGHT) {
          onPageOverflow(page.id)
        }
      }
    },
    editorProps: {
      attributes: {
        class: 'simple-page-editor',
        style: `font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.5;`
      }
    }
  })

  useEffect(() => {
    return () => {
      if (editor) {
        editor.destroy()
      }
    }
  }, [editor])

  return (
    <div 
      className={`simple-word-page ${isActive ? 'active' : ''}`}
      style={{ 
        transform: `scale(${zoom / 100})`,
        transformOrigin: 'top center'
      }}
    >
      {/* Header da página */}
      <div className="simple-page-header">
        <div className="simple-page-number">Página {pageNumber}</div>
        <div className="simple-page-stats">
          {page.wordCount} palavras • {page.characterCount} caracteres
        </div>
      </div>

      {/* Área de conteúdo da página */}
      <div 
        className="simple-page-content-area"
        style={{
          width: `${A4_DIMENSIONS.width}px`,
          height: `${A4_DIMENSIONS.height}px`,
          padding: `${ABNT_MARGINS.top}px ${ABNT_MARGINS.right}px ${ABNT_MARGINS.bottom}px ${ABNT_MARGINS.left}px`,
          background: 'white',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          borderRadius: '4px',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Editor content */}
        <div 
          ref={editorRef}
          className="simple-page-editor-content"
          style={{
            height: `${CONTENT_AREA.height}px`,
            overflow: 'hidden',
            position: 'relative'
          }}
        >
          <EditorContent editor={editor} />
        </div>

        {/* Rodapé da página */}
        <div className="simple-page-footer">
          <div className="footer-left">
            {new Date().toLocaleDateString('pt-BR')}
          </div>
          <div className="footer-center">
            Página {pageNumber}
          </div>
          <div className="footer-right">
            A4 • 21×29.7cm
          </div>
        </div>
      </div>
    </div>
  )
})

PageComponent.displayName = 'PageComponent'

// Hook para gerenciar páginas
const usePageManager = (initialContent: string) => {
  const [pages, setPages] = useState<Page[]>(() => [
    {
      id: '1',
      content: initialContent || '<p>Digite seu texto aqui...</p>',
      wordCount: 0,
      characterCount: 0,
    }
  ])

  const [activePage, setActivePage] = useState(0)

  const addPage = useCallback(() => {
    const newPage: Page = {
      id: String(pages.length + 1),
      content: '<p></p>',
      wordCount: 0,
      characterCount: 0,
    }
    setPages(prev => [...prev, newPage])
    return newPage.id
  }, [pages.length])

  const removePage = useCallback((pageId: string) => {
    if (pages.length <= 1) return
    setPages(prev => prev.filter(page => page.id !== pageId))
  }, [pages.length])

  const updatePageContent = useCallback((pageId: string, content: string) => {
    setPages(prev => prev.map(page => {
      if (page.id === pageId) {
        const text = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
        const wordCount = text ? text.split(' ').filter(word => word.length > 0).length : 0
        const characterCount = text.length

        return {
          ...page,
          content,
          wordCount,
          characterCount,
        }
      }
      return page
    }))
  }, [])

  const handlePageOverflow = useCallback((pageId: string) => {
    console.log(`📄 Overflow detectado na página ${pageId}, criando nova página...`)
    
    const newPageId = addPage()
    
    setTimeout(() => {
      const pageIndex = pages.findIndex(p => p.id === newPageId)
      setActivePage(pageIndex)
    }, 100)
  }, [addPage, pages])

  return {
    pages,
    activePage,
    setActivePage,
    addPage,
    removePage,
    updatePageContent,
    handlePageOverflow
  }
}

// Componente principal
const SimpleWordEditor: React.FC<SimpleWordEditorProps> = memo(({
  initialContent = '',
  onSave,
  onUpdate,
  className = ''
}) => {
  const [zoom, setZoom] = useState(100)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  const {
    pages,
    activePage,
    setActivePage,
    addPage,
    removePage,
    updatePageContent,
    handlePageOverflow
  } = usePageManager(initialContent)

  const totalStats = useMemo(() => {
    return pages.reduce((acc, page) => ({
      words: acc.words + page.wordCount,
      characters: acc.characters + page.characterCount
    }), { words: 0, characters: 0 })
  }, [pages])

  const handleSave = useCallback(async () => {
    if (!onSave) return
    
    setIsSaving(true)
    try {
      const fullContent = pages.map(p => p.content).join('\n\n')
      const fullText = pages.map(p => 
        p.content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
      ).join('\n\n')
      
      await onSave(fullText, fullContent)
      setLastSaved(new Date())
    } catch (error) {
      console.error('Erro ao salvar:', error)
    } finally {
      setIsSaving(false)
    }
  }, [pages, onSave])

  const handleUpdate = useCallback((pageId: string, content: string) => {
    updatePageContent(pageId, content)
    
    if (onUpdate) {
      const fullContent = pages.map(p => p.id === pageId ? content : p.content).join('\n\n')
      const fullText = fullContent.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
      onUpdate(fullText, fullContent)
    }
  }, [pages, updatePageContent, onUpdate])

  return (
    <div className={`simple-word-editor ${className} ${isFullscreen ? 'fullscreen' : ''}`}>
      {/* Header */}
      <div className="simple-editor-header">
        <div className="simple-header-left">
          <h3>Editor de Documentos</h3>
          <div className="simple-document-stats">
            <span>{totalStats.words} palavras</span>
            <span>{totalStats.characters} caracteres</span>
            <span>{pages.length} página{pages.length !== 1 ? 's' : ''}</span>
            {lastSaved && (
              <span>Salvo: {lastSaved.toLocaleTimeString('pt-BR')}</span>
            )}
          </div>
        </div>

        <div className="simple-header-actions">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="simple-btn simple-btn-success"
            title="Salvar documento"
          >
            <Save size={16} />
            {isSaving ? 'Salvando...' : 'Salvar'}
          </button>
          
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="simple-btn simple-btn-outline"
            title="Tela cheia"
          >
            <Maximize size={16} />
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="simple-editor-toolbar">
        <div className="simple-toolbar-section">
          <button onClick={() => setZoom(prev => Math.max(50, prev - 25))}>
            <ZoomOut size={16} />
          </button>
          <span className="simple-zoom-display">{zoom}%</span>
          <button onClick={() => setZoom(prev => Math.min(200, prev + 25))}>
            <ZoomIn size={16} />
          </button>
        </div>

        <div className="simple-toolbar-separator" />

        <div className="simple-toolbar-section">
          <button
            onClick={addPage}
            className="simple-btn simple-btn-primary"
            title="Adicionar nova página"
          >
            <Plus size={16} />
            Nova Página
          </button>
        </div>

        <div className="simple-toolbar-separator" />

        <div className="simple-toolbar-section">
          <span>Página {activePage + 1} de {pages.length}</span>
        </div>
      </div>

      {/* Área principal */}
      <div className="simple-editor-main">
        <div className="simple-pages-container">
          {pages.map((page, index) => (
            <PageComponent
              key={page.id}
              page={page}
              pageNumber={index + 1}
              isActive={index === activePage}
              zoom={zoom}
              onContentChange={handleUpdate}
              onPageOverflow={handlePageOverflow}
            />
          ))}
        </div>

        {/* Sidebar de navegação */}
        <div className="simple-pages-sidebar">
          <h4>Páginas</h4>
          <div className="simple-pages-list">
            {pages.map((page, index) => (
              <div
                key={page.id}
                className={`simple-page-thumb ${index === activePage ? 'active' : ''}`}
                onClick={() => setActivePage(index)}
              >
                <div className="simple-thumb-preview">
                  <div className="simple-thumb-number">{index + 1}</div>
                  <div className="simple-thumb-stats">
                    {page.wordCount}p
                  </div>
                </div>
                {pages.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      removePage(page.id)
                    }}
                    className="simple-remove-page"
                    title="Remover página"
                  >
                    <Minus size={12} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
})

SimpleWordEditor.displayName = 'SimpleWordEditor'

export default SimpleWordEditor 