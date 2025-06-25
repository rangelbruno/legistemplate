'use client'

import React, { useState, useCallback } from 'react'
import SimpleWordEditor from '../../../../components/editor/SimpleWordEditor'

export default function EditorPage() {
  const [content, setContent] = useState('')
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  const handleSave = useCallback(async (content: string, html: string) => {
    try {
      console.log('💾 Salvando documento...')
      console.log('Conteúdo texto:', content.substring(0, 200) + '...')
      console.log('HTML:', html.substring(0, 200) + '...')
      
      // Simular salvamento (aqui você faria a chamada para API)
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setLastSaved(new Date())
      console.log('✅ Documento salvo com sucesso!')
    } catch (error) {
      console.error('❌ Erro ao salvar documento:', error)
    }
  }, [])

  const handleUpdate = useCallback((content: string, html: string) => {
    setContent(content)
    console.log('📝 Documento atualizado')
  }, [])

  return (
    <div style={{ height: '100vh', overflow: 'hidden' }}>
      <SimpleWordEditor
        initialContent="<h1>DOCUMENTO LEGISLATIVO</h1><p>Digite aqui o conteúdo do seu documento seguindo as normas ABNT. Este editor simula o Microsoft Word com múltiplas páginas virtuais para uma melhor experiência do usuário.</p><p>O sistema automaticamente criará novas páginas quando o conteúdo exceder o limite da página atual, mantendo a formatação e organização adequadas.</p>"
        onSave={handleSave}
        onUpdate={handleUpdate}
        className="admin-editor"
      />
      
      {/* Informações de debug */}
      {lastSaved && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          background: '#27ae60',
          color: 'white',
          padding: '8px 16px',
          borderRadius: '6px',
          fontSize: '12px',
          zIndex: 1000,
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
        }}>
          ✅ Salvo: {lastSaved.toLocaleTimeString('pt-BR')}
        </div>
      )}
    </div>
  )
} 