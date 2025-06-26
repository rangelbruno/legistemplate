'use client'

import React, { useState, useCallback } from 'react'
import { Editor } from '@tiptap/react'

interface TiptapToolbarProps {
  editor: Editor
  onSave?: () => void
  onImageUpload?: (file: File) => void
  className?: string
}

export function TiptapToolbar({ editor, onSave, onImageUpload, className = '' }: TiptapToolbarProps) {
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [showFontPicker, setShowFontPicker] = useState(false)

  const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && onImageUpload) {
      onImageUpload(file)
    }
    // Reset input
    event.target.value = ''
  }, [onImageUpload])

  const handleLinkToggle = useCallback(() => {
    if (editor.isActive('link')) {
      // editor.chain().focus().unsetLink().run() // Extension not available
      editor.chain().focus().toggleMark('link').run()
    } else {
      const url = window.prompt('Digite a URL:')
      if (url) {
        // editor.chain().focus().setLink({ href: url }).run() // Extension not available
        editor.chain().focus().setMark('link', { href: url }).run()
      }
    }
  }, [editor])

  const insertTable = useCallback((rows: number, cols: number) => {
    editor.chain().focus().insertTable({ rows, cols, withHeaderRow: true }).run()
  }, [editor])

  if (!editor) return null

  return (
    <div className={`tiptap-toolbar ${className}`}>
      {/* Grupo: Arquivo */}
      <div className="toolbar-group">
        {onSave && (
          <button
            type="button"
            onClick={onSave}
            className="toolbar-btn btn-primary"
            title="Salvar (Ctrl+S)"
          >
            <i className="ki-duotone ki-save-2 fs-5">
              <span className="path1"></span>
              <span className="path2"></span>
            </i>
            <span className="d-none d-md-inline ms-1">Salvar</span>
          </button>
        )}
        
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="toolbar-btn"
          title="Desfazer (Ctrl+Z)"
        >
          <i className="ki-duotone ki-arrow-left fs-5">
            <span className="path1"></span>
            <span className="path2"></span>
          </i>
        </button>
        
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="toolbar-btn"
          title="Refazer (Ctrl+Y)"
        >
          <i className="ki-duotone ki-arrow-right fs-5">
            <span className="path1"></span>
            <span className="path2"></span>
          </i>
        </button>
      </div>

      <div className="toolbar-separator"></div>

      {/* Grupo: Formatação básica */}
      <div className="toolbar-group">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`toolbar-btn ${editor.isActive('bold') ? 'active' : ''}`}
          title="Negrito (Ctrl+B)"
        >
          <i className="ki-duotone ki-text-bold fs-5">
            <span className="path1"></span>
          </i>
        </button>
        
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`toolbar-btn ${editor.isActive('italic') ? 'active' : ''}`}
          title="Itálico (Ctrl+I)"
        >
          <i className="ki-duotone ki-text-italic fs-5">
            <span className="path1"></span>
          </i>
        </button>
        
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`toolbar-btn ${editor.isActive('underline') ? 'active' : ''}`}
          title="Sublinhado (Ctrl+U)"
        >
          <i className="ki-duotone ki-text-underline fs-5">
            <span className="path1"></span>
          </i>
        </button>
        
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`toolbar-btn ${editor.isActive('strike') ? 'active' : ''}`}
          title="Riscado"
        >
          <i className="ki-duotone ki-text-strike fs-5">
            <span className="path1"></span>
          </i>
        </button>
      </div>

      <div className="toolbar-separator"></div>

      {/* Grupo: Títulos */}
      <div className="toolbar-group">
        <select
          value={
            editor.isActive('heading', { level: 1 }) ? 'h1' :
            editor.isActive('heading', { level: 2 }) ? 'h2' :
            editor.isActive('heading', { level: 3 }) ? 'h3' :
            editor.isActive('heading', { level: 4 }) ? 'h4' :
            editor.isActive('heading', { level: 5 }) ? 'h5' :
            editor.isActive('heading', { level: 6 }) ? 'h6' :
            'p'
          }
          onChange={(e) => {
            const value = e.target.value
            if (value === 'p') {
              editor.chain().focus().setParagraph().run()
            } else {
              const level = parseInt(value.replace('h', '')) as 1 | 2 | 3 | 4 | 5 | 6
              editor.chain().focus().toggleHeading({ level }).run()
            }
          }}
          className="form-select form-select-sm toolbar-select"
        >
          <option value="p">Parágrafo</option>
          <option value="h1">Título 1</option>
          <option value="h2">Título 2</option>
          <option value="h3">Título 3</option>
          <option value="h4">Título 4</option>
          <option value="h5">Título 5</option>
          <option value="h6">Título 6</option>
        </select>
      </div>

      <div className="toolbar-separator"></div>

      {/* Grupo: Alinhamento */}
      <div className="toolbar-group">
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={`toolbar-btn ${editor.isActive({ textAlign: 'left' }) ? 'active' : ''}`}
          title="Alinhar à esquerda"
        >
          <i className="ki-duotone ki-text-align-left fs-5">
            <span className="path1"></span>
            <span className="path2"></span>
            <span className="path3"></span>
            <span className="path4"></span>
          </i>
        </button>
        
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={`toolbar-btn ${editor.isActive({ textAlign: 'center' }) ? 'active' : ''}`}
          title="Centralizar"
        >
          <i className="ki-duotone ki-text-align-center fs-5">
            <span className="path1"></span>
            <span className="path2"></span>
            <span className="path3"></span>
            <span className="path4"></span>
          </i>
        </button>
        
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={`toolbar-btn ${editor.isActive({ textAlign: 'right' }) ? 'active' : ''}`}
          title="Alinhar à direita"
        >
          <i className="ki-duotone ki-text-align-right fs-5">
            <span className="path1"></span>
            <span className="path2"></span>
            <span className="path3"></span>
            <span className="path4"></span>
          </i>
        </button>
        
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
          className={`toolbar-btn ${editor.isActive({ textAlign: 'justify' }) ? 'active' : ''}`}
          title="Justificar"
        >
          <i className="ki-duotone ki-text-align-justify fs-5">
            <span className="path1"></span>
            <span className="path2"></span>
            <span className="path3"></span>
            <span className="path4"></span>
          </i>
        </button>
      </div>

      <div className="toolbar-separator"></div>

      {/* Grupo: Listas */}
      <div className="toolbar-group">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`toolbar-btn ${editor.isActive('bulletList') ? 'active' : ''}`}
          title="Lista com marcadores"
        >
          <i className="ki-duotone ki-bullet-list fs-5">
            <span className="path1"></span>
            <span className="path2"></span>
            <span className="path3"></span>
            <span className="path4"></span>
            <span className="path5"></span>
            <span className="path6"></span>
          </i>
        </button>
        
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`toolbar-btn ${editor.isActive('orderedList') ? 'active' : ''}`}
          title="Lista numerada"
        >
          <i className="ki-duotone ki-numbered-list fs-5">
            <span className="path1"></span>
            <span className="path2"></span>
            <span className="path3"></span>
            <span className="path4"></span>
            <span className="path5"></span>
          </i>
        </button>
      </div>

      <div className="toolbar-separator"></div>

      {/* Grupo: Inserir */}
      <div className="toolbar-group">
        <button
          type="button"
          onClick={handleLinkToggle}
          className={`toolbar-btn ${editor.isActive('link') ? 'active' : ''}`}
          title="Inserir/remover link"
        >
          <i className="ki-duotone ki-link fs-5">
            <span className="path1"></span>
            <span className="path2"></span>
            <span className="path3"></span>
            <span className="path4"></span>
            <span className="path5"></span>
          </i>
        </button>
        
        {onImageUpload && (
          <>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: 'none' }}
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="toolbar-btn"
              title="Inserir imagem"
            >
              <i className="ki-duotone ki-picture fs-5">
                <span className="path1"></span>
                <span className="path2"></span>
              </i>
            </label>
          </>
        )}
        
        <div className="dropdown">
          <button
            type="button"
            className="toolbar-btn dropdown-toggle"
            data-bs-toggle="dropdown"
            title="Inserir tabela"
          >
            <i className="ki-duotone ki-row-horizontal fs-5">
              <span className="path1"></span>
              <span className="path2"></span>
            </i>
          </button>
          <ul className="dropdown-menu">
            <li>
              <button
                className="dropdown-item"
                onClick={() => insertTable(3, 3)}
              >
                Tabela 3x3
              </button>
            </li>
            <li>
              <button
                className="dropdown-item"
                onClick={() => insertTable(5, 5)}
              >
                Tabela 5x5
              </button>
            </li>
            <li>
              <button
                className="dropdown-item"
                onClick={() => insertTable(2, 4)}
              >
                Tabela 2x4
              </button>
            </li>
          </ul>
        </div>
      </div>

      <div className="toolbar-separator"></div>

      {/* Grupo: Formatação avançada */}
      <div className="toolbar-group">
        <button
          type="button"
          onClick={() => {
            // editor.chain().focus().toggleSubscript().run() // Extension not available
            console.warn('Subscript extension not available')
          }}
          className={`toolbar-btn ${editor.isActive('subscript') ? 'active' : ''}`}
          title="Subscrito (não disponível)"
          disabled
        >
          <i className="ki-duotone ki-subscript fs-5">
            <span className="path1"></span>
          </i>
        </button>
        
        <button
          type="button"
          onClick={() => {
            // editor.chain().focus().toggleSuperscript().run() // Extension not available
            console.warn('Superscript extension not available')
          }}
          className={`toolbar-btn ${editor.isActive('superscript') ? 'active' : ''}`}
          title="Sobrescrito (não disponível)"
          disabled
        >
          <i className="ki-duotone ki-superscript fs-5">
            <span className="path1"></span>
          </i>
        </button>
        
        <button
          type="button"
          onClick={() => {
            // editor.chain().focus().toggleHighlight().run() // Extension not available
            console.warn('Highlight extension not available')
          }}
          className={`toolbar-btn ${editor.isActive('highlight') ? 'active' : ''}`}
          title="Destacar texto (não disponível)"
          disabled
        >
          <i className="ki-duotone ki-text-highlight fs-5">
            <span className="path1"></span>
            <span className="path2"></span>
          </i>
        </button>
      </div>

      <div className="toolbar-separator"></div>

      {/* Grupo: Cores */}
      <div className="toolbar-group">
        <div className="dropdown">
          <button
            type="button"
            className="toolbar-btn dropdown-toggle"
            data-bs-toggle="dropdown"
            title="Cor do texto"
          >
            <i className="ki-duotone ki-color-palette fs-5">
              <span className="path1"></span>
              <span className="path2"></span>
              <span className="path3"></span>
              <span className="path4"></span>
            </i>
          </button>
          <div className="dropdown-menu p-3" style={{ minWidth: '200px' }}>
            <div className="color-grid">
              {[
                '#000000', '#333333', '#666666', '#999999', '#CCCCCC', '#FFFFFF',
                '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF',
                '#800000', '#008000', '#000080', '#808000', '#800080', '#008080',
                '#FFA500', '#FFC0CB', '#800080', '#4B0082', '#008B8B', '#32CD32'
              ].map((color) => (
                <button
                  key={color}
                  type="button"
                  className="color-btn"
                  style={{ backgroundColor: color }}
                  onClick={() => editor.chain().focus().setColor(color).run()}
                  title={color}
                />
              ))}
            </div>
            <hr />
            <button
              type="button"
              className="btn btn-sm btn-light w-100"
              onClick={() => editor.chain().focus().unsetColor().run()}
            >
              Remover cor
            </button>
          </div>
        </div>
      </div>

      <div className="toolbar-separator"></div>

      {/* Grupo: Limpar formatação */}
      <div className="toolbar-group">
        <button
          type="button"
          onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
          className="toolbar-btn"
          title="Limpar formatação"
        >
          <i className="ki-duotone ki-eraser fs-5">
            <span className="path1"></span>
            <span className="path2"></span>
            <span className="path3"></span>
            <span className="path4"></span>
          </i>
        </button>
      </div>
    </div>
  )
} 