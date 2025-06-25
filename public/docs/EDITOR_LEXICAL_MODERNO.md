# Editor de Documentos Lexical - Implementação Moderna

## Resumo da Implementação

Foi implementado um novo editor de documentos legislativos usando a biblioteca **Lexical** da Meta, substituindo os editores anteriores (ReactQuill e ProseMirror) por uma solução mais moderna, performática e open source.

## Características Principais

### 🚀 Performance e Tecnologia
- **Lexical Editor**: Biblioteca moderna da Meta, com excelente performance
- **TypeScript**: Tipagem completa para melhor desenvolvimento
- **React 18**: Aproveitamento das últimas funcionalidades do React
- **CSS Moderno**: Design responsivo com CSS Grid/Flexbox

### 🎨 Design e UX
- **Interface Limpa**: Design minimalista e profissional
- **Responsivo**: Funciona perfeitamente em desktop, tablet e mobile
- **Dark Mode**: Suporte completo ao modo escuro
- **Animações Suaves**: Transições e micro-interações elegantes

### ⚙️ Funcionalidades

#### Editor Principal
- **Toolbar Rica**: Botões para formatação, listas, títulos, etc.
- **Atalhos de Teclado**: Ctrl+S para salvar, Ctrl+B para negrito, etc.
- **Auto-save**: Salvamento automático com indicador visual
- **Templates**: Templates pré-definidos para documentos legislativos

#### Tipos de Documentos Suportados
1. **Requerimentos**
2. **Projetos de Lei**
3. **Atas de Sessão**
4. **Decretos Legislativos**
5. **Ofícios**
6. **Relatórios**

#### Recursos Avançados
- **Status do Documento**: Rascunho, Finalizado, Publicado
- **Histórico de Edição**: Undo/Redo com histórico completo
- **Modo de Impressão**: Layout otimizado para impressão
- **Exportação**: Geração de HTML limpo

## Estrutura de Arquivos

```
src/
├── components/
│   └── editor/
│       ├── LexicalEditor.tsx       # Componente principal do editor
│       └── LexicalEditor.css       # Estilos do editor
│
└── app/admin/configuracoes/documentos-templates/
    ├── page.tsx                    # Página principal de templates
    └── editor/
        ├── page.tsx                # Página do editor de documentos
        └── editor.css              # Estilos da página do editor
```

## Componentes Implementados

### 1. LexicalEditor Component
```typescript
interface LexicalEditorProps {
  initialContent?: string
  placeholder?: string
  onChange?: (content: string, html: string) => void
  onSave?: (content: string, html: string) => void
  readOnly?: boolean
  className?: string
  autoFocus?: boolean
}
```

**Funcionalidades:**
- Toolbar completa com formatação
- Plugin de salvamento com Ctrl+S
- Plugin de conteúdo inicial
- Tratamento de erros customizado
- Tema personalizável

### 2. DocumentEditorPage Component
- **Header**: Título editável, status, controles de salvamento
- **Content**: Editor Lexical embutido
- **Footer**: Informações do documento e ações

## Melhorias Implementadas

### Performance
- ✅ **Renderização Otimizada**: Uso de `useCallback` e `useMemo`
- ✅ **Debouncing**: Evita chamadas excessivas à API
- ✅ **Lazy Loading**: Carregamento sob demanda de recursos
- ✅ **Bundle Size**: Lexical é menor que ReactQuill + ProseMirror

### UX/UI
- ✅ **Design Consistente**: Seguindo o padrão do Metronic
- ✅ **Feedback Visual**: Indicadores de salvamento e carregamento
- ✅ **Responsividade**: Funciona em todos os dispositivos
- ✅ **Acessibilidade**: Suporte a leitores de tela e navegação por teclado

### Desenvolvimento
- ✅ **TypeScript**: Tipagem completa
- ✅ **Componentização**: Código reutilizável e modular
- ✅ **Manutenibilidade**: Código limpo e bem documentado
- ✅ **Testabilidade**: Estrutura preparada para testes

## Como Usar

### 1. Criar Novo Documento
```typescript
// Na página principal de templates
const handleNovoDocumento = (templateId: string) => {
  const params = new URLSearchParams()
  params.set('template', templateId)
  params.set('novo', 'true')
  
  const editorUrl = `${baseUrl}/admin/configuracoes/documentos-templates/editor?${params.toString()}`
  window.open(editorUrl, '_blank')
}
```

### 2. Editar Documento Existente
```typescript
const handleEditarDocumento = (documentoId: string) => {
  const params = new URLSearchParams()
  params.set('id', documentoId)
  
  const editorUrl = `${baseUrl}/admin/configuracoes/documentos-templates/editor?${params.toString()}`
  window.open(editorUrl, '_blank')
}
```

### 3. Usar o Editor Standalone
```tsx
import LexicalEditor from '@/components/editor/LexicalEditor'

function MyPage() {
  return (
    <LexicalEditor
      initialContent="<p>Conteúdo inicial</p>"
      placeholder="Digite aqui..."
      onChange={(content, html) => console.log('Changed:', content)}
      onSave={(content, html) => console.log('Saved:', content)}
      autoFocus={true}
    />
  )
}
```

## Configuração dos Templates

Os templates são definidos como strings HTML:

```typescript
const documentTemplates: Record<string, string> = {
  'requerimento': `
    <h1>REQUERIMENTO Nº ___/2025</h1>
    <p><strong>Senhor Presidente,</strong></p>
    // ... resto do template
  `,
  'projeto-lei': `
    <h1>PROJETO DE LEI Nº ___/2025</h1>
    // ... template específico
  `
}
```

## Customização de Estilo

### Tema do Editor
```javascript
const theme = {
  paragraph: 'editor-paragraph',
  heading: {
    h1: 'editor-heading-h1',
    h2: 'editor-heading-h2',
    // ...
  },
  text: {
    bold: 'editor-text-bold',
    italic: 'editor-text-italic',
    // ...
  }
}
```

### CSS Customizável
- **Cores**: Facilmente alteráveis via CSS variables
- **Tipografia**: Fontes e tamanhos configuráveis
- **Layout**: Grid/Flexbox responsivo
- **Animações**: Transições suaves customizáveis

## Próximos Passos

### Funcionalidades Planejadas
1. **Colaboração em Tempo Real**: Múltiplos usuários editando
2. **Versionamento**: Histórico de versões do documento
3. **Comentários**: Sistema de revisão e comentários
4. **Integração com APIs**: Salvamento automático no backend
5. **Exportação Avançada**: PDF, DOCX, etc.

### Melhorias Técnicas
1. **Testes Unitários**: Cobertura completa de testes
2. **Testes E2E**: Testes de integração com Playwright
3. **Performance Monitoring**: Métricas de performance
4. **Error Boundary**: Tratamento robusto de erros

## Conclusão

O novo editor Lexical representa uma evolução significativa na experiência de criação de documentos legislativos, oferecendo:

- **Melhor Performance**: Carregamento mais rápido e interface mais responsiva
- **UX Superior**: Interface moderna e intuitiva
- **Manutenibilidade**: Código mais limpo e organizado
- **Escalabilidade**: Arquitetura preparada para crescimento
- **Acessibilidade**: Melhor suporte para usuários com necessidades especiais

A implementação segue as melhores práticas de desenvolvimento moderno, garantindo que o sistema seja robusto, performático e fácil de manter. 