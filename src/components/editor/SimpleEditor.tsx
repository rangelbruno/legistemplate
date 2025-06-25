import React, { useState } from 'react'

interface SimpleEditorProps {
  initialContent?: string
  placeholder?: string
  onChange?: (content: string) => void
}

export default function SimpleEditor({
  initialContent = '',
  placeholder = 'Digite aqui...',
  onChange
}: SimpleEditorProps) {
  const [content, setContent] = useState(initialContent)

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value
    setContent(newContent)
    onChange?.(newContent)
  }

  console.log('SimpleEditor renderizando...', { content: content.length })

  return (
    <div style={{ 
      width: '100%', 
      height: '500px', 
      border: '1px solid #ccc', 
      borderRadius: '8px',
      padding: '16px',
      backgroundColor: 'white' 
    }}>
      <div style={{ 
        padding: '8px 12px', 
        backgroundColor: '#f5f5f5', 
        borderBottom: '1px solid #ccc',
        marginBottom: '16px'
      }}>
        <strong>Editor Simples (Teste)</strong>
      </div>
      
      <textarea
        value={content}
        onChange={handleChange}
        placeholder={placeholder}
        style={{
          width: '100%',
          height: '400px',
          border: 'none',
          outline: 'none',
          resize: 'none',
          fontFamily: 'Arial, sans-serif',
          fontSize: '14px',
          lineHeight: '1.5'
        }}
      />
      
      <div style={{ 
        marginTop: '8px', 
        fontSize: '12px', 
        color: '#666' 
      }}>
        Caracteres: {content.length}
      </div>
    </div>
  )
} 