import { Handle, Position, NodeProps } from 'reactflow'
import { memo, useState } from 'react'

interface CustomNodeData {
  label: string
  description?: string
  type?: 'start' | 'process' | 'decision' | 'end'
  status?: 'active' | 'completed' | 'pending'
  icon?: string
}

const CustomNode = ({ data, selected }: NodeProps<CustomNodeData>) => {
  const [isEditing, setIsEditing] = useState(false)
  const [label, setLabel] = useState(data.label || 'Nova Etapa')
  const [description, setDescription] = useState(data.description || '')

  const getNodeStyle = () => {
    const baseStyle = {
      padding: '12px',
      borderRadius: '8px',
      border: '2px solid',
      background: '#fff',
      minWidth: '180px',
      fontSize: '14px',
    }

    switch (data.type) {
      case 'start':
        return { ...baseStyle, borderColor: '#198754', backgroundColor: '#d1e7dd' }
      case 'end':
        return { ...baseStyle, borderColor: '#dc3545', backgroundColor: '#f8d7da' }
      case 'decision':
        return { 
          ...baseStyle, 
          borderColor: '#ffc107', 
          backgroundColor: '#fff3cd',
          clipPath: 'polygon(20% 0%, 80% 0%, 100% 50%, 80% 100%, 20% 100%, 0% 50%)'
        }
      default:
        return { ...baseStyle, borderColor: '#0d6efd', backgroundColor: '#cfe2ff' }
    }
  }

  const getStatusIndicator = () => {
    switch (data.status) {
      case 'completed':
        return '✅'
      case 'active':
        return '🔄'
      case 'pending':
        return '⏳'
      default:
        return data.icon || '📋'
    }
  }

  const handleDoubleClick = () => {
    setIsEditing(true)
  }

  const handleSave = () => {
    data.label = label
    data.description = description
    setIsEditing(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSave()
    }
    if (e.key === 'Escape') {
      setIsEditing(false)
      setLabel(data.label || 'Nova Etapa')
      setDescription(data.description || '')
    }
  }

  return (
    <div 
      style={getNodeStyle()}
      className={`custom-node ${selected ? 'selected' : ''}`}
      onDoubleClick={handleDoubleClick}
    >
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: '#6c757d' }}
      />
      
      <div className="d-flex align-items-center gap-2 mb-1">
        <span className="fs-5">{getStatusIndicator()}</span>
        {isEditing ? (
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyPress}
            className="form-control form-control-sm"
            autoFocus
          />
        ) : (
          <div className="fw-bold">{label}</div>
        )}
      </div>
      
      {(description || isEditing) && (
        <div className="fs-7 text-muted">
          {isEditing ? (
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onBlur={handleSave}
              onKeyDown={handleKeyPress}
              className="form-control form-control-sm"
              rows={2}
              placeholder="Descrição..."
            />
          ) : (
            description
          )}
        </div>
      )}

      <Handle
        type="source"
        position={Position.Bottom}
        style={{ background: '#6c757d' }}
      />
      
      {selected && (
        <div className="position-absolute top-0 end-0 translate-middle">
          <div className="btn-group-vertical">
            <button 
              className="btn btn-sm btn-outline-primary"
              onClick={() => setIsEditing(true)}
              title="Editar"
            >
              ✏️
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default memo(CustomNode) 