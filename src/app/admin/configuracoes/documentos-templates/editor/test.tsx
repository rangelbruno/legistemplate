import React from 'react'
import WordLikeEditor from '../../../../../components/editor/WordLikeEditor'

const TestEditor = () => {
  return (
    <div style={{ height: '100vh', padding: '20px' }}>
      <h1>Teste do WordLikeEditor</h1>
      <div style={{ height: 'calc(100vh - 100px)', border: '1px solid #ccc' }}>
        <WordLikeEditor
          initialContent="Teste do editor"
          onChange={(content) => console.log('Conteúdo:', content)}
          placeholder="Digite aqui..."
        />
      </div>
    </div>
  )
}

export default TestEditor 