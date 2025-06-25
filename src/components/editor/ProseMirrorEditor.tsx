'use client'

import React, { useRef, useEffect, useState, useCallback, forwardRef, useImperativeHandle, useMemo } from 'react'
import { EditorState, Transaction, Plugin } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import { Schema, DOMParser, DOMSerializer } from 'prosemirror-model'
import { undo, redo, history } from 'prosemirror-history'
import { keymap } from 'prosemirror-keymap'
import { baseKeymap, toggleMark, setBlockType, wrapIn, lift } from 'prosemirror-commands'
import { dropCursor } from 'prosemirror-dropcursor'
import { gapCursor } from 'prosemirror-gapcursor'
import { menuBar, MenuItem } from 'prosemirror-menu'
import { buildMenuItems } from './menu'
import { createDocumentSchema } from './schema'
import { createDocumentTemplate } from './templates'
import './prosemirror.css'

interface ProseMirrorEditorProps {
  initialContent?: string
  template?: string
  headerData?: {
    logoUrl?: string
    camaraInfo?: {
      nome: string
      endereco: string
      telefone: string
      email: string
      site: string
    }
  }
  footerData?: {
    logoUrl?: string
    camaraInfo?: {
      nome: string
      endereco: string
      telefone: string
      email: string
      site: string
    }
  }
  onChange?: (content: string, html: string) => void
  onSave?: (content: string, html: string) => void
  readOnly?: boolean
  className?: string
}

interface EditorMethods {
  getContent: () => { content: string; html: string }
  setContent: (content: string) => void
  focus: () => void
  getView: () => EditorView | null
  insertText: (text: string) => void
  formatText: (format: 'bold' | 'italic' | 'underline') => void
  insertHeading: (level: 1 | 2 | 3 | 4 | 5 | 6) => void
  insertList: (type: 'bullet' | 'ordered') => void
}

const ProseMirrorEditor = forwardRef<EditorMethods, ProseMirrorEditorProps>(({
  initialContent,
  template,
  headerData,
  footerData,
  onChange,
  onSave,
  readOnly = false,
  className = ''
}, ref) => {
  const editorRef = useRef<HTMLDivElement>(null)
  const toolbarRef = useRef<HTMLDivElement>(null)
  const editorViewRef = useRef<EditorView | null>(null)
  const [isReady, setIsReady] = useState(false)
  const [schema] = useState(() => createDocumentSchema())
  const [activeFormats, setActiveFormats] = useState<Set<string>>(new Set())

  // Otimização: debounce para onChange
  const debouncedOnChange = useCallback(
    debounce((content: string, html: string) => {
      onChange?.(content, html)
    }, 300),
    [onChange]
  )

  // Atualizar estado dos botões da toolbar
  const updateToolbarState = useCallback((state: EditorState) => {
    const newActiveFormats = new Set<string>()
    
    // Verificar marks ativas
    const { from, $from, to, empty } = state.selection
    if (empty) {
      const marks = state.storedMarks || $from.marks()
      marks.forEach(mark => newActiveFormats.add(mark.type.name))
    } else {
      state.doc.nodesBetween(from, to, (node) => {
        node.marks.forEach(mark => newActiveFormats.add(mark.type.name))
      })
    }
    
    // Verificar node ativo
    const { $head } = state.selection
    if ($head.parent.type.name === 'heading') {
      newActiveFormats.add(`heading-${$head.parent.attrs.level}`)
    } else {
      newActiveFormats.add($head.parent.type.name)
    }
    
    setActiveFormats(newActiveFormats)
  }, [])

  // Plugin para atualizar estado da toolbar (memoizado)
  const toolbarUpdatePlugin = useMemo(() => new Plugin({
    view() {
      return {
        update: (view: EditorView) => {
          updateToolbarState(view.state)
        }
      }
    }
  }), [updateToolbarState])

  // Função para converter estado para HTML
  const getHTML = useCallback((state: EditorState) => {
    const div = document.createElement('div')
    const fragment = DOMSerializer.fromSchema(schema).serializeFragment(state.doc.content)
    div.appendChild(fragment)
    return div.innerHTML
  }, [schema])

  // Criação do estado inicial do editor
  const createInitialState = useCallback(() => {
    let doc
    
    try {
      if (initialContent) {
        // Parse conteúdo existente
        const element = document.createElement('div')
        element.innerHTML = initialContent
        doc = DOMParser.fromSchema(schema).parse(element)
      } else if (template) {
        // Criar documento a partir do template
        doc = createDocumentTemplate(template, schema, {
          header: headerData,
          footer: footerData
        })
      } else {
        // Documento vazio simples
        doc = schema.nodes.doc.create({}, [
          schema.nodes.paragraph.create({}, schema.text('Digite seu conteúdo aqui...'))
        ])
      }
    } catch (error) {
      console.error('Erro ao criar documento:', error)
      // Fallback para documento simples
      doc = schema.nodes.doc.create({}, [
        schema.nodes.paragraph.create({}, schema.text('Digite seu conteúdo aqui...'))
      ])
    }

    const plugins = [
      history(),
      keymap({
        'Mod-z': undo,
        'Mod-y': redo,
        'Mod-Shift-z': redo,
        'Mod-s': (state, dispatch) => {
          // Salvar documento
          if (onSave) {
            const html = getHTML(state)
            const content = JSON.stringify(state.doc.toJSON())
            onSave(content, html)
          }
          return true
        },
        'Mod-b': toggleMark(schema.marks.strong),
        'Mod-i': toggleMark(schema.marks.em),
      }),
      keymap(baseKeymap),
      dropCursor(),
      gapCursor(),
      toolbarUpdatePlugin
    ]

    if (!readOnly) {
      plugins.push(menuBar({
        floating: false,
        content: buildMenuItems(schema).fullMenu
      }))
    }

    return EditorState.create({
      doc,
      plugins
    })
  }, [initialContent, template, schema, headerData, footerData, getHTML, onSave, readOnly, toolbarUpdatePlugin])

  // Inicialização do editor
  useEffect(() => {
    if (!editorRef.current) return

    const state = createInitialState()
    
    const view = new EditorView(editorRef.current, {
      state,
      dispatchTransaction: (transaction: Transaction) => {
        const newState = view.state.apply(transaction)
        view.updateState(newState)

        // Trigger onChange com debounce para performance
        if (transaction.docChanged) {
          const html = getHTML(newState)
          const content = JSON.stringify(newState.doc.toJSON())
          debouncedOnChange(content, html)
        }
      },
      editable: () => !readOnly,
      attributes: {
        class: `prosemirror-editor ${readOnly ? 'readonly' : ''}`,
        spellcheck: 'true'
      }
    })

    editorViewRef.current = view
    setIsReady(true)
    updateToolbarState(state)

    return () => {
      view.destroy()
      editorViewRef.current = null
    }
  }, [createInitialState, debouncedOnChange, getHTML, readOnly, updateToolbarState])

  // Métodos públicos
  const getContent = useCallback(() => {
    if (!editorViewRef.current) return { content: '', html: '' }
    
    const state = editorViewRef.current.state
    return {
      content: JSON.stringify(state.doc.toJSON()),
      html: getHTML(state)
    }
  }, [getHTML])

  const setContent = useCallback((content: string) => {
    if (!editorViewRef.current) return

    const element = document.createElement('div')
    element.innerHTML = content
    const doc = DOMParser.fromSchema(schema).parse(element)
    
    const newState = EditorState.create({
      doc,
      plugins: editorViewRef.current.state.plugins
    })
    
    editorViewRef.current.updateState(newState)
  }, [schema])

  const focus = useCallback(() => {
    editorViewRef.current?.focus()
  }, [])

  const insertText = useCallback((text: string) => {
    if (!editorViewRef.current) return
    
    const { state, dispatch } = editorViewRef.current
    const tr = state.tr.insertText(text)
    dispatch(tr)
  }, [])

  const formatText = useCallback((format: 'bold' | 'italic' | 'underline') => {
    if (!editorViewRef.current) return
    
    const { state, dispatch } = editorViewRef.current
    const markType = format === 'bold' ? schema.marks.strong :
                    format === 'italic' ? schema.marks.em :
                    schema.marks.underline || schema.marks.em
    
    if (markType) {
      toggleMark(markType)(state, dispatch)
    }
  }, [schema])

  const insertHeading = useCallback((level: 1 | 2 | 3 | 4 | 5 | 6) => {
    if (!editorViewRef.current) return
    
    const { state, dispatch } = editorViewRef.current
    setBlockType(schema.nodes.heading, { level })(state, dispatch)
  }, [schema])

  const insertList = useCallback((type: 'bullet' | 'ordered') => {
    if (!editorViewRef.current) return
    
    const { state, dispatch } = editorViewRef.current
    const listType = type === 'bullet' ? schema.nodes.bullet_list : schema.nodes.ordered_list
    
    if (listType) {
      wrapIn(listType)(state, dispatch)
    }
  }, [schema])

  // Exposição dos métodos através de ref
  useImperativeHandle(ref, () => ({
    getContent,
    setContent,
    focus,
    getView: () => editorViewRef.current,
    insertText,
    formatText,
    insertHeading,
    insertList
  }))

  // Toolbar customizada
  const renderToolbar = () => {
    if (readOnly) return null

    return (
      <div ref={toolbarRef} className="prosemirror-toolbar border-bottom p-2 bg-light">
        <div className="d-flex flex-wrap gap-1">
          {/* Grupo: Desfazer/Refazer */}
          <div className="btn-group me-2">
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={() => undo(editorViewRef.current!.state, editorViewRef.current!.dispatch)}
              title="Desfazer (Ctrl+Z)"
            >
              <i className="ki-duotone ki-arrow-left fs-3"></i>
            </button>
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={() => redo(editorViewRef.current!.state, editorViewRef.current!.dispatch)}
              title="Refazer (Ctrl+Y)"
            >
              <i className="ki-duotone ki-arrow-right fs-3"></i>
            </button>
          </div>

          {/* Grupo: Formatação */}
          <div className="btn-group me-2">
            <button
              className={`btn btn-sm ${activeFormats.has('strong') ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={() => formatText('bold')}
              title="Negrito (Ctrl+B)"
            >
              <strong>B</strong>
            </button>
            <button
              className={`btn btn-sm ${activeFormats.has('em') ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={() => formatText('italic')}
              title="Itálico (Ctrl+I)"
            >
              <em>I</em>
            </button>
            <button
              className={`btn btn-sm ${activeFormats.has('underline') ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={() => formatText('underline')}
              title="Sublinhado (Ctrl+U)"
            >
              <u>U</u>
            </button>
          </div>

          {/* Grupo: Cabeçalhos */}
          <div className="btn-group me-2">
            <button
              className="btn btn-sm btn-outline-secondary dropdown-toggle"
              data-bs-toggle="dropdown"
              title="Cabeçalhos"
            >
              H
            </button>
            <ul className="dropdown-menu">
              {[1, 2, 3, 4, 5, 6].map(level => (
                <li key={level}>
                  <a
                    className={`dropdown-item ${activeFormats.has(`heading-${level}`) ? 'active' : ''}`}
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      insertHeading(level as 1 | 2 | 3 | 4 | 5 | 6)
                    }}
                  >
                    <strong>H{level}</strong> - Título nível {level}
                  </a>
                </li>
              ))}
              <li><hr className="dropdown-divider" /></li>
              <li>
                <a
                  className={`dropdown-item ${activeFormats.has('paragraph') ? 'active' : ''}`}
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    setBlockType(schema.nodes.paragraph)(editorViewRef.current!.state, editorViewRef.current!.dispatch)
                  }}
                >
                  P - Parágrafo normal
                </a>
              </li>
            </ul>
          </div>

          {/* Grupo: Listas */}
          <div className="btn-group me-2">
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={() => insertList('bullet')}
              title="Lista com marcadores"
            >
              <i className="ki-duotone ki-menu fs-3"></i>
            </button>
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={() => insertList('ordered')}
              title="Lista numerada"
            >
              <i className="ki-duotone ki-row-horizontal fs-3"></i>
            </button>
          </div>

          {/* Grupo: Elementos Legislativos */}
          <div className="btn-group me-2">
            <button
              className="btn btn-sm btn-outline-primary dropdown-toggle"
              data-bs-toggle="dropdown"
              title="Elementos Legislativos"
            >
              <i className="ki-duotone ki-law fs-3"></i>
            </button>
            <ul className="dropdown-menu">
              <li>
                <a className="dropdown-item" href="#" onClick={(e) => {
                  e.preventDefault()
                  insertText('Art. [NÚMERO]º - ')
                }}>
                  <i className="ki-duotone ki-document fs-3 me-2"></i>
                  Artigo
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#" onClick={(e) => {
                  e.preventDefault()
                  insertText('I - ')
                }}>
                  <i className="ki-duotone ki-right-square fs-3 me-2"></i>
                  Inciso
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#" onClick={(e) => {
                  e.preventDefault()
                  insertText('a) ')
                }}>
                  <i className="ki-duotone ki-right fs-3 me-2"></i>
                  Alínea
                </a>
              </li>
              <li><hr className="dropdown-divider" /></li>
              <li>
                <a className="dropdown-item" href="#" onClick={(e) => {
                  e.preventDefault()
                  insertText('CONSIDERANDO que ')
                }}>
                  <i className="ki-duotone ki-notepad fs-3 me-2"></i>
                  Considerando
                </a>
              </li>
            </ul>
          </div>

          {/* Grupo: Ações */}
          <div className="btn-group ms-auto">
            <button
              className="btn btn-sm btn-success"
              onClick={() => {
                const content = getContent()
                onSave?.(content.content, content.html)
              }}
              title="Salvar documento"
            >
              <i className="ki-duotone ki-check fs-3 me-1"></i>
              Salvar
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`prosemirror-wrapper ${className}`}>
      {!isReady && (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Carregando editor...</span>
          </div>
        </div>
      )}
      
      {isReady && (
        <div className="border rounded">
          {renderToolbar()}
          <div 
            ref={editorRef} 
            className="prosemirror-content"
            style={{ 
              minHeight: '500px',
              maxHeight: '80vh',
              overflowY: 'auto',
              padding: '20px'
            }}
          />
        </div>
      )}
    </div>
  )
})

ProseMirrorEditor.displayName = 'ProseMirrorEditor'

// Utility function para debounce
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export default ProseMirrorEditor 