# Editor Estilo Microsoft Word

## Visão Geral

Implementação de um editor de documentos que simula a experiência do Microsoft Word com múltiplas páginas virtuais, criação automática de páginas e UX otimizada.

## Características Principais

### 🏗️ Arquitetura Baseada em Componentes
- **Componentes React otimizados** com `React.memo()`, `useCallback()`, `useMemo()`
- **Páginas virtuais independentes** - cada página é um componente separado
- **Gerenciamento de estado eficiente** com hooks customizados
- **Performance otimizada** para documentos grandes

### 📄 Sistema de Páginas
- **Múltiplas páginas A4** com dimensões exatas (794x1123px)
- **Criação automática** quando conteúdo excede altura da página
- **Navegação visual** com sidebar de miniaturas das páginas
- **Indicadores visuais** de estatísticas (palavras, caracteres)

### 🎨 UX Moderna
- **Interface limpa** inspirada no Microsoft Word
- **Zoom interativo** (50% - 200%)
- **Modo tela cheia** disponível
- **Responsivo** para diferentes tamanhos de tela
- **Animações fluidas** e feedback visual

### ⚡ Performance
- **Lazy loading** de componentes de página
- **Otimizações de re-render** com React.memo
- **Callbacks memoizados** para evitar re-criações desnecessárias
- **Debounce automático** em mudanças de conteúdo

## Estrutura dos Arquivos

```
src/components/editor/
├── SimpleWordEditor.tsx      # Componente principal
├── SimpleWordEditor.css      # Estilos otimizados
├── WordLikeEditor.tsx        # Versão avançada (com react-window)
└── WordLikeEditor.css        # Estilos da versão avançada
```

## Uso Básico

```tsx
import SimpleWordEditor from '@/components/editor/SimpleWordEditor'

export default function DocumentPage() {
  const handleSave = async (content: string, html: string) => {
    // Implementar salvamento
    console.log('Salvando:', { content, html })
  }

  const handleUpdate = (content: string, html: string) => {
    // Implementar auto-salvamento
    console.log('Atualizado:', content.length, 'caracteres')
  }

  return (
    <SimpleWordEditor
      initialContent="<h1>MEU DOCUMENTO</h1><p>Conteúdo inicial...</p>"
      onSave={handleSave}
      onUpdate={handleUpdate}
      className="my-editor"
    />
  )
}
```

## Props da Interface

```typescript
interface SimpleWordEditorProps {
  initialContent?: string                          // Conteúdo inicial HTML
  onSave?: (content: string, html: string) => void // Callback de salvamento
  onUpdate?: (content: string, html: string) => void // Callback de atualização
  className?: string                               // Classes CSS adicionais
}
```

## Funcionalidades

### 1. Criação Automática de Páginas
```typescript
// Sistema detecta automaticamente quando conteúdo excede altura máxima
const MAX_CONTENT_HEIGHT = 850 // pixels (~40 linhas)

// Nova página é criada automaticamente
const handlePageOverflow = (pageId: string) => {
  console.log(`📄 Criando nova página após overflow da página ${pageId}`)
  const newPageId = addPage()
  setActivePage(newPageIndex)
}
```

### 2. Estatísticas em Tempo Real
```typescript
// Calculadas automaticamente para cada página
interface Page {
  id: string
  content: string
  wordCount: number      // Contagem de palavras
  characterCount: number // Contagem de caracteres
}

// Estatísticas totais do documento
const totalStats = useMemo(() => {
  return pages.reduce((acc, page) => ({
    words: acc.words + page.wordCount,
    characters: acc.characters + page.characterCount
  }), { words: 0, characters: 0 })
}, [pages])
```

### 3. Controles de Zoom
```tsx
// Zoom de 50% a 200%
<div className="toolbar-section">
  <button onClick={() => setZoom(prev => Math.max(50, prev - 25))}>
    <ZoomOut size={16} />
  </button>
  <span>{zoom}%</span>
  <button onClick={() => setZoom(prev => Math.min(200, prev + 25))}>
    <ZoomIn size={16} />
  </button>
</div>
```

### 4. Sidebar de Navegação
```tsx
// Miniaturas clicáveis das páginas
<div className="pages-sidebar">
  {pages.map((page, index) => (
    <div 
      key={page.id}
      className={`page-thumb ${index === activePage ? 'active' : ''}`}
      onClick={() => setActivePage(index)}
    >
      <div className="thumb-number">{index + 1}</div>
      <div className="thumb-stats">{page.wordCount}p</div>
    </div>
  ))}
</div>
```

## Padrões ABNT Implementados

### Dimensões A4
```typescript
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
```

### Formatação Tipográfica
```css
.simple-page-editor .ProseMirror {
  font-family: 'Times New Roman', serif;
  font-size: 12pt;
  line-height: 1.5;
}

.simple-page-editor .ProseMirror p {
  margin: 0 0 12px 0;
  text-align: justify;
  line-height: 1.5;
}

.simple-page-editor .ProseMirror h1 {
  font-size: 14pt;
  text-transform: uppercase;
  text-align: center;
  margin: 18px 0 12px 0;
}
```

## Otimizações de Performance

### 1. React.memo para Componentes
```typescript
const PageComponent = memo<PageComponentProps>(({ 
  page, pageNumber, isActive, zoom, onContentChange, onPageOverflow 
}) => {
  // Componente só re-renderiza se props mudarem
  return <div>...</div>
}, areEqual) // Comparação customizada opcional
```

### 2. Hooks Memoizados
```typescript
const handleSave = useCallback(async () => {
  // Função só é recriada se dependências mudarem
}, [pages, onSave])

const totalStats = useMemo(() => {
  // Cálculo só é refeito se páginas mudarem
  return pages.reduce(...)
}, [pages])
```

### 3. Cleanup de Editores
```typescript
useEffect(() => {
  return () => {
    if (editor) {
      editor.destroy() // Limpar recursos do TipTap
    }
  }
}, [editor])
```

## Controles de Teclado

| Atalho | Função |
|--------|--------|
| `Ctrl+S` | Salvar documento |
| `Ctrl++` | Aumentar zoom |
| `Ctrl+-` | Diminuir zoom |
| `F11` | Modo tela cheia |

## Estados do Editor

### 1. Header Informativo
```tsx
<div className="document-stats">
  <span>{totalStats.words} palavras</span>
  <span>{totalStats.characters} caracteres</span>
  <span>{pages.length} página{pages.length !== 1 ? 's' : ''}</span>
  {lastSaved && <span>Salvo: {lastSaved.toLocaleTimeString('pt-BR')}</span>}
</div>
```

### 2. Indicadores Visuais
```tsx
// Página ativa destaque visual
<div className={`word-page ${isActive ? 'active' : ''}`}>
  
// Overflow warning
{page.overflow && <span className="overflow-indicator">⚠️ Overflow</span>}

// Loading state
<button disabled={isSaving}>
  {isSaving ? 'Salvando...' : 'Salvar'}
</button>
```

## Responsividade

### Desktop (>1200px)
- Sidebar completa (200px)
- Zoom 100%
- Todas as funcionalidades disponíveis

### Tablet (768px - 1200px)
- Sidebar reduzida (160px)
- Zoom automático 80%
- Funcionalidades principais mantidas

### Mobile (<768px)
- Sidebar oculta
- Zoom automático 60%
- Interface simplificada
- Controles touch-friendly

## Troubleshooting

### Problema: Editor não carrega
```bash
# Verificar dependências
npm list @tiptap/react @tiptap/starter-kit

# Reinstalar se necessário
npm install @tiptap/react @tiptap/starter-kit
```

### Problema: Performance lenta
```typescript
// Verificar se callbacks estão memoizados
const handleUpdate = useCallback((pageId, content) => {
  // Lógica aqui
}, [/* dependências corretas */])

// Verificar se componentes estão memoizados
const PageComponent = memo(({ ...props }) => {
  // Componente aqui
})
```

### Problema: Zoom não funciona
```css
/* Verificar se transform-origin está correto */
.word-page {
  transform: scale(var(--zoom));
  transform-origin: top center; /* Importante! */
}
```

## Roadmap

### Próximas Funcionalidades
- [ ] **Virtualização** com react-window para documentos muito grandes
- [ ] **Colaboração em tempo real** com WebSockets
- [ ] **Controle de versões** do documento
- [ ] **Exportação PDF** direta
- [ ] **Templates pré-definidos** para documentos legislativos
- [ ] **Spell checker** integrado
- [ ] **Comentários e revisões**
- [ ] **Modo escuro**

### Melhorias de Performance
- [ ] **Service Workers** para cache
- [ ] **Lazy loading** de extensões TipTap
- [ ] **Debounce inteligente** baseado em contexto
- [ ] **Compressão** de conteúdo para storage
- [ ] **Indexação** para busca rápida

Este editor representa uma solução moderna e performática para edição de documentos legislativos, combinando a familiaridade do Microsoft Word com as melhores práticas de desenvolvimento React. 