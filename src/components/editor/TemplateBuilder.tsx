'use client'

import React, { useState, useRef, useCallback } from 'react'
import { 
  Type, Image, Square, Circle, Minus, Plus, Save, Eye, 
  Download, Upload, Copy, Trash2, Settings, Move, Edit,
  AlignLeft, AlignCenter, AlignRight, Bold, Italic, Underline
} from 'lucide-react'
import './TemplateBuilder.css'

interface TemplateComponent {
  id: string
  type: 'text' | 'input' | 'textarea' | 'checkbox' | 'radio' | 'select' | 'table' | 'image' | 'line' | 'signature'
  x: number
  y: number
  width: number
  height: number
  properties: {
    label?: string
    placeholder?: string
    required?: boolean
    options?: string[]
    fontSize?: number
    fontWeight?: string
    textAlign?: string
    backgroundColor?: string
    borderColor?: string
    borderWidth?: number
  }
  content?: string
}

interface Page {
  id: string
  name: string
  components: TemplateComponent[]
}

interface TemplateBuilderProps {
  initialTemplate?: any
  onSave?: (template: any) => void
  className?: string
}

const TemplateBuilder: React.FC<TemplateBuilderProps> = ({
  initialTemplate,
  onSave,
  className = ''
}) => {
  const [pages, setPages] = useState<Page[]>([
    { id: '1', name: 'Page 1', components: [] }
  ])
  const [currentPageId, setCurrentPageId] = useState('1')
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null)
  const [zoom, setZoom] = useState(100)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })

  const canvasRef = useRef<HTMLDivElement>(null)

  // Componentes disponíveis na sidebar
  const componentTypes = [
    { type: 'text', icon: Type, label: 'Texto', color: '#3b82f6' },
    { type: 'input', icon: Minus, label: 'Campo de Texto', color: '#10b981' },
    { type: 'textarea', icon: Square, label: 'Área de Texto', color: '#f59e0b' },
    { type: 'checkbox', icon: Square, label: 'Checkbox', color: '#8b5cf6' },
    { type: 'radio', icon: Circle, label: 'Radio Button', color: '#ef4444' },
    { type: 'select', icon: Settings, label: 'Select', color: '#06b6d4' },
    { type: 'table', icon: Settings, label: 'Tabela', color: '#84cc16' },
    { type: 'image', icon: Image, label: 'Imagem', color: '#f97316' },
    { type: 'line', icon: Minus, label: 'Linha', color: '#6b7280' },
    { type: 'signature', icon: Edit, label: 'Assinatura', color: '#ec4899' }
  ]

  const currentPage = pages.find(p => p.id === currentPageId)
  const selectedComponent = currentPage?.components.find(c => c.id === selectedComponentId)

  // Função para adicionar nova página
  const addNewPage = useCallback(() => {
    const newPageId = String(pages.length + 1)
    const newPage: Page = {
      id: newPageId,
      name: `Page ${pages.length + 1}`,
      components: []
    }
    setPages(prev => [...prev, newPage])
    setCurrentPageId(newPageId)
  }, [pages.length])

  // Função para deletar página
  const deletePage = useCallback((pageIndex: number) => {
    if (pages.length <= 1) return; // Não deletar se houver apenas uma página
    
    const newPages = pages.filter((_, index) => index !== pageIndex)
    setPages(newPages)
    
    // Se a página atual foi deletada, mover para a primeira página
    if (currentPageId === pages[pageIndex].id) {
      setCurrentPageId(newPages[0].id)
    }
  }, [pages, currentPageId])

  // Função para adicionar componente
  const addComponent = useCallback((type: string, x: number = 100, y: number = 100) => {
    const newComponent: TemplateComponent = {
      id: `${type}-${Date.now()}`,
      type: type as any,
      x,
      y,
      width: getDefaultWidth(type),
      height: getDefaultHeight(type),
      properties: getDefaultProperties(type),
      content: getDefaultContent(type)
    }

    setPages(prev => prev.map(page => 
      page.id === currentPageId 
        ? { ...page, components: [...page.components, newComponent] }
        : page
    ))
    setSelectedComponentId(newComponent.id)
  }, [currentPageId])

  // Função para obter largura padrão
  const getDefaultWidth = (type: string): number => {
    switch (type) {
      case 'text': return 200
      case 'input': return 250
      case 'textarea': return 300
      case 'checkbox': return 20
      case 'radio': return 20
      case 'select': return 200
      case 'table': return 400
      case 'image': return 200
      case 'line': return 300
      case 'signature': return 250
      default: return 200
    }
  }

  // Função para obter altura padrão
  const getDefaultHeight = (type: string): number => {
    switch (type) {
      case 'text': return 30
      case 'input': return 40
      case 'textarea': return 100
      case 'checkbox': return 20
      case 'radio': return 20
      case 'select': return 40
      case 'table': return 200
      case 'image': return 150
      case 'line': return 2
      case 'signature': return 80
      default: return 40
    }
  }

  // Função para obter propriedades padrão
  const getDefaultProperties = (type: string) => {
    switch (type) {
      case 'text':
        return {
          fontSize: 14,
          fontWeight: 'normal',
          textAlign: 'left',
          backgroundColor: 'transparent',
          borderColor: 'transparent',
          borderWidth: 0
        }
      case 'input':
        return {
          placeholder: 'Digite aqui...',
          required: false,
          fontSize: 14,
          backgroundColor: '#ffffff',
          borderColor: '#d1d5db',
          borderWidth: 1
        }
      case 'textarea':
        return {
          placeholder: 'Digite seu texto aqui...',
          required: false,
          fontSize: 14,
          backgroundColor: '#ffffff',
          borderColor: '#d1d5db',
          borderWidth: 1
        }
      case 'checkbox':
        return {
          label: 'Opção',
          required: false
        }
      case 'radio':
        return {
          label: 'Opção',
          options: ['Opção 1', 'Opção 2'],
          required: false
        }
      case 'select':
        return {
          placeholder: 'Selecione...',
          options: ['Opção 1', 'Opção 2', 'Opção 3'],
          required: false
        }
      default:
        return {}
    }
  }

  // Função para obter conteúdo padrão
  const getDefaultContent = (type: string): string => {
    switch (type) {
      case 'text': return 'Texto de exemplo'
      case 'input': return ''
      case 'textarea': return ''
      case 'line': return ''
      case 'signature': return 'Área de Assinatura'
      default: return ''
    }
  }

  // Função para deletar componente
  const deleteComponent = useCallback((componentId: string) => {
    setPages(prev => prev.map(page => 
      page.id === currentPageId 
        ? { ...page, components: page.components.filter(c => c.id !== componentId) }
        : page
    ))
    setSelectedComponentId(null)
  }, [currentPageId])

  // Função para atualizar propriedades do componente
  const updateComponentProperty = useCallback((componentId: string, property: string, value: any) => {
    setPages(prev => prev.map(page => 
      page.id === currentPageId 
        ? {
            ...page,
            components: page.components.map(comp => 
              comp.id === componentId 
                ? { 
                    ...comp, 
                    properties: { ...comp.properties, [property]: value },
                    ...(property === 'x' || property === 'y' || property === 'width' || property === 'height') && { [property]: value }
                  }
                : comp
            )
          }
        : page
    ))
  }, [currentPageId])

  // Função para renderizar propriedades específicas de cada componente
  const renderComponentProperties = (component: TemplateComponent) => {
    switch (component.type) {
      case 'text':
        return (
          <>
            <div className="property-field">
              <label>Conteúdo:</label>
              <input
                type="text"
                value={component.content || ''}
                onChange={(e) => setPages(prev => prev.map(page => 
                  page.id === currentPageId 
                    ? {
                        ...page,
                        components: page.components.map(comp => 
                          comp.id === component.id 
                            ? { ...comp, content: e.target.value }
                            : comp
                        )
                      }
                    : page
                ))}
              />
            </div>
            <div className="property-field">
              <label>Tamanho da Fonte:</label>
              <input
                type="number"
                value={component.properties.fontSize || 14}
                onChange={(e) => updateComponentProperty(component.id, 'fontSize', Number(e.target.value))}
              />
            </div>
          </>
        );
      
      case 'input':
      case 'textarea':
        return (
          <>
            <div className="property-field">
              <label>Placeholder:</label>
              <input
                type="text"
                value={component.properties.placeholder || ''}
                onChange={(e) => updateComponentProperty(component.id, 'placeholder', e.target.value)}
              />
            </div>
            <div className="property-field">
              <label>
                <input
                  type="checkbox"
                  checked={component.properties.required || false}
                  onChange={(e) => updateComponentProperty(component.id, 'required', e.target.checked)}
                />
                Obrigatório
              </label>
            </div>
          </>
        );
      
      case 'checkbox':
      case 'radio':
        return (
          <div className="property-field">
            <label>Label:</label>
            <input
              type="text"
              value={component.properties.label || ''}
              onChange={(e) => updateComponentProperty(component.id, 'label', e.target.value)}
            />
          </div>
        );
      
      default:
        return null;
    }
  }

  // Função para salvar template
  const handleSave = useCallback(() => {
    const template = {
      pages,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    if (onSave) {
      onSave(template)
    }
    
    console.log('Template salvo:', template)
  }, [pages, onSave])

  // Renderizar componente no canvas
  const renderComponent = (component: TemplateComponent) => {
    const style = {
      position: 'absolute' as const,
      left: `${component.x}px`,
      top: `${component.y}px`,
      width: `${component.width}px`,
      height: `${component.height}px`,
      fontSize: `${component.properties.fontSize || 14}px`,
      fontWeight: component.properties.fontWeight || 'normal',
      textAlign: component.properties.textAlign as any || 'left',
      backgroundColor: component.properties.backgroundColor || 'transparent',
      border: `${component.properties.borderWidth || 0}px solid ${component.properties.borderColor || 'transparent'}`,
      cursor: 'pointer',
      outline: selectedComponentId === component.id ? '2px solid #3b82f6' : 'none',
      zIndex: selectedComponentId === component.id ? 10 : 1
    }

    switch (component.type) {
      case 'text':
        return (
          <div
            key={component.id}
            style={style}
            onClick={() => setSelectedComponentId(component.id)}
            className="template-component"
          >
            {component.content}
          </div>
        )
      
      case 'input':
        return (
          <input
            key={component.id}
            type="text"
            placeholder={component.properties.placeholder}
            style={style}
            onClick={() => setSelectedComponentId(component.id)}
            className="template-component"
          />
        )
      
      case 'textarea':
        return (
          <textarea
            key={component.id}
            placeholder={component.properties.placeholder}
            style={style}
            onClick={() => setSelectedComponentId(component.id)}
            className="template-component"
          />
        )
      
      case 'checkbox':
        return (
          <div
            key={component.id}
            style={style}
            onClick={() => setSelectedComponentId(component.id)}
            className="template-component checkbox-wrapper"
          >
            <input type="checkbox" />
            <label>{component.properties.label}</label>
          </div>
        )
      
      case 'line':
        return (
          <hr
            key={component.id}
            style={style}
            onClick={() => setSelectedComponentId(component.id)}
            className="template-component"
          />
        )
      
      case 'signature':
        return (
          <div
            key={component.id}
            style={{
              ...style,
              border: '1px dashed #ccc',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#f9f9f9'
            }}
            onClick={() => setSelectedComponentId(component.id)}
            className="template-component"
          >
            {component.content}
          </div>
        )
      
      default:
        return (
          <div
            key={component.id}
            style={style}
            onClick={() => setSelectedComponentId(component.id)}
            className="template-component"
          >
            {component.type}
          </div>
        )
    }
  }

  return (
    <div className="template-builder">
      {/* Layout de 3 colunas: Páginas | Canvas | Componentes */}
      <div className="template-builder-content">
        {/* Sidebar Esquerda - Páginas */}
        <div className="pages-sidebar">
          <div className="pages-header">
            <h3>Páginas</h3>
            <button
              className="add-page-btn"
              onClick={addNewPage}
              title="Adicionar Página"
            >
              <Plus size={16} />
            </button>
          </div>
          
          <div className="pages-list">
            {pages.map((page, index) => (
              <div
                key={page.id}
                className={`page-thumbnail ${currentPageId === page.id ? 'active' : ''}`}
                onClick={() => setCurrentPageId(page.id)}
              >
                <div className="page-preview">
                  <div className="page-preview-content">
                    {page.components.map((comp) => (
                      <div
                        key={comp.id}
                        className="preview-component"
                        style={{
                          left: `${(comp.x / 794) * 100}%`,
                          top: `${(comp.y / 1123) * 100}%`,
                          width: `${(comp.width / 794) * 100}%`,
                          height: `${(comp.height / 1123) * 100}%`,
                        }}
                      />
                    ))}
                  </div>
                </div>
                <div className="page-info">
                  <span>Página {index + 1}</span>
                  {pages.length > 1 && (
                    <button
                      className="delete-page-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        deletePage(index);
                      }}
                      title="Deletar Página"
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Controles de Zoom */}
                        <div className="zoom-controls">
            <label>Zoom: {Math.round(zoom)}%</label>
            <input
              type="range"
              min="25"
              max="200"
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="zoom-slider"
            />
            <div className="zoom-buttons">
              <button onClick={() => setZoom(Math.max(25, zoom - 25))}>-</button>
              <button onClick={() => setZoom(100)}>100%</button>
              <button onClick={() => setZoom(Math.min(200, zoom + 25))}>+</button>
            </div>
          </div>
        </div>

        {/* Área Central - Canvas */}
        <div className="canvas-area">
          <div className="canvas-container" style={{ transform: `scale(${zoom / 100})` }}>
            <div
              className="canvas-page"
              ref={canvasRef}
              onClick={() => setSelectedComponentId(null)}
              onMouseDown={(e) => {
                setIsDragging(true);
                setDragOffset({ x: e.clientX, y: e.clientY });
              }}
              onMouseMove={(e) => {
                if (isDragging) {
                  setPages(prev => prev.map(page => ({
                    ...page,
                    components: page.components.map(comp => ({
                      ...comp,
                      x: comp.x + (e.clientX - dragOffset.x),
                      y: comp.y + (e.clientY - dragOffset.y)
                    }))
                  })));
                  setDragOffset({ x: e.clientX, y: e.clientY });
                }
              }}
              onMouseUp={() => setIsDragging(false)}
            >
              {/* Cabeçalho da Página */}
              <div className="page-header">
                <div
                  contentEditable
                  suppressContentEditableWarning
                  className="editable-header"
                  onBlur={(e) => {
                    if (selectedComponentId) {
                      updateComponentProperty(selectedComponentId, 'content', e.currentTarget.textContent || '');
                    }
                  }}
                >
                  {selectedComponent?.content || 'Cabeçalho do Documento'}
                </div>
              </div>

              {/* Conteúdo da Página */}
              <div className="page-content">
                {currentPage?.components.map((component) => (
                  <div
                    key={component.id}
                    className={`canvas-component ${selectedComponentId === component.id ? 'selected' : ''}`}
                    style={{
                      left: component.x,
                      top: component.y,
                      width: component.width,
                      height: component.height,
                      position: 'absolute',
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedComponentId(component.id);
                    }}
                  >
                    {renderComponent(component)}
                    {selectedComponentId === component.id && (
                      <div className="component-handles">
                        <div className="handle nw-resize" data-handle="nw" />
                        <div className="handle ne-resize" data-handle="ne" />
                        <div className="handle sw-resize" data-handle="sw" />
                        <div className="handle se-resize" data-handle="se" />
                        <div className="handle n-resize" data-handle="n" />
                        <div className="handle s-resize" data-handle="s" />
                        <div className="handle e-resize" data-handle="e" />
                        <div className="handle w-resize" data-handle="w" />
                      </div>
                    )}
                  </div>
                ))}

                {/* Overlay de seleção */}
                {selectedComponent && (
                  <div
                    className="selection-box"
                    style={{
                      left: Math.min(selectedComponent.x, selectedComponent.x + selectedComponent.width),
                      top: Math.min(selectedComponent.y, selectedComponent.y + selectedComponent.height),
                      width: Math.abs(selectedComponent.width),
                      height: Math.abs(selectedComponent.height),
                    }}
                  />
                )}
              </div>

              {/* Rodapé da Página */}
              <div className="page-footer">
                <div className="footer-content">
                  <span>Página {pages.findIndex(p => p.id === currentPageId) + 1} de {pages.length}</span>
                  <span>{new Date().toLocaleDateString('pt-BR')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Direita - Componentes e Propriedades */}
        <div className="components-sidebar">
          {/* Painel de Componentes */}
          <div className="components-panel">
            <h3>Componentes</h3>
            <div className="component-grid">
              {componentTypes.map((type) => (
                <button
                  key={type.type}
                  className="component-btn"
                  onClick={() => addComponent(type.type)}
                  title={type.label}
                >
                  <type.icon size={20} style={{ color: type.color }} />
                  <span>{type.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Painel de Propriedades */}
          {selectedComponent && (
            <div className="properties-panel">
              <div className="properties-header">
                <h3>Propriedades</h3>
                <button
                  className="delete-component-btn"
                  onClick={() => deleteComponent(selectedComponent.id)}
                  title="Deletar Componente"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="properties-form">
                {/* Posição e Tamanho */}
                <div className="property-group">
                  <label>Posição & Tamanho</label>
                  <div className="property-row">
                    <div className="property-field">
                      <label>X:</label>
                      <input
                        type="number"
                        value={Math.round(selectedComponent.x)}
                        onChange={(e) => updateComponentProperty(selectedComponent.id, 'x', Number(e.target.value))}
                      />
                    </div>
                    <div className="property-field">
                      <label>Y:</label>
                      <input
                        type="number"
                        value={Math.round(selectedComponent.y)}
                        onChange={(e) => updateComponentProperty(selectedComponent.id, 'y', Number(e.target.value))}
                      />
                    </div>
                  </div>
                  <div className="property-row">
                    <div className="property-field">
                      <label>Largura:</label>
                      <input
                        type="number"
                        value={Math.round(selectedComponent.width)}
                        onChange={(e) => updateComponentProperty(selectedComponent.id, 'width', Number(e.target.value))}
                      />
                    </div>
                    <div className="property-field">
                      <label>Altura:</label>
                      <input
                        type="number"
                        value={Math.round(selectedComponent.height)}
                        onChange={(e) => updateComponentProperty(selectedComponent.id, 'height', Number(e.target.value))}
                      />
                    </div>
                  </div>
                </div>

                {/* Propriedades Específicas por Tipo */}
                <div className="property-group">
                  <label>Propriedades do Componente</label>
                  {renderComponentProperties(selectedComponent)}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TemplateBuilder 