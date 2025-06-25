# 📝 Editor Word-like Clean - Interface Moderna

Um editor de documentos profissional com interface clean e moderna, inspirado no Google Docs, mantendo todas as funcionalidades ABNT com foco na performance e experiência do usuário.

## 🎯 Principais Características

### ✨ **Interface Clean e Moderna**
- **Design minimalista** sem elementos visuais desnecessários
- **Toolbar compacta** com ações essenciais organizadas
- **Título editável** diretamente na toolbar
- **Cores suaves** que não cansam a vista
- **Foco no conteúdo** sem distrações

### 📐 **Dimensões A4 Exatas**
- **21 × 29,7 cm** (dimensões oficiais)
- **794 × 1123 pixels** (conversão precisa 96 DPI)
- **Margens ABNT**: 3cm superior/esquerda, 2cm inferior/direita
- **~39 linhas por página** com Times New Roman 12pt
- **Formatação automática** conforme normas ABNT

### 🚀 **Performance Otimizada**
- **Renderização eficiente** sem réguas visuais pesadas
- **Zoom centralizado** aplicado ao container principal
- **Componentes leves** com CSS otimizado
- **Scroll suave** e responsivo
- **Animações mínimas** para melhor performance

## 🎨 **Componentes da Interface**

### 📋 **Toolbar Moderna**
```typescript
// Seção Principal
- Título editável do documento
- Navegação entre páginas (◀ 1/5 ▶)
- Elementos ABNT (dropdown)

// Seção Secundária  
- Toggle painel de páginas
- Controles de zoom (50% - 200%)
- Botão salvar
```

### 📄 **Painel de Páginas**
- **Miniaturas** com preview do conteúdo
- **Navegação rápida** entre páginas
- **Estado ativo** visualmente destacado
- **Contador** total de páginas
- **Botão** para adicionar nova página

### 📝 **Área de Edição**
- **Páginas centralizadas** com sombra sutil
- **Cabeçalho minimalista** com informações essenciais
- **Textarea limpa** sem bordas visuais
- **Footer discreto** com numeração
- **Transições suaves** entre páginas

## 🔧 **Funcionalidades Avançadas**

### ⚡ **Auto-transição de Páginas**
```typescript
// Detecção automática quando página atinge 80% da capacidade
const nearEndThreshold = LINES_PER_PAGE * 0.8

// Criação automática de nova página
if (lines > LINES_PER_PAGE && isLast) {
  setTimeout(() => {
    onAddPage?.()
    setTimeout(() => onGoToNextPage?.(), 100)
  }, 500)
}
```

### 🎯 **Navegação Inteligente**
- **Auto-foco** na página ativa
- **Scroll automático** para página selecionada
- **Ctrl+Enter**: Nova página
- **Enter no final**: Próxima página
- **Ctrl+S**: Salvar documento

### 📱 **Responsividade Completa**
```css
/* Desktop */
.pages-thumbnail-panel { width: 180px; }

/* Tablet */
@media (max-width: 1024px) {
  .pages-thumbnail-panel { width: 140px; }
}

/* Mobile */
@media (max-width: 768px) {
  .pages-thumbnail-panel { display: none; }
  .abnt-toolbar { flex-direction: column; }
}
```

## 📋 **Elementos Legislativos ABNT**

### 🏛️ **Templates Disponíveis**
```typescript
const abntLegislativeElements = [
  { id: 'titulo', label: 'Título (ABNT)', template: 'TÍTULO DO DOCUMENTO\n' },
  { id: 'artigo', label: 'Artigo (ABNT)', template: 'Art. 1º...' },
  { id: 'paragrafo', label: 'Parágrafo (ABNT)', template: '§ 1º...' },
  { id: 'inciso', label: 'Inciso (ABNT)', template: 'I - ...' },
  { id: 'alinea', label: 'Alínea (ABNT)', template: 'a) ...' },
  { id: 'ementa', label: 'Ementa (ABNT)', template: 'EMENTA: ...' },
  { id: 'justificativa', label: 'Justificativa (ABNT)', template: 'JUSTIFICATIVA\n\n...' }
]
```

## 🔌 **Como Usar**

### 📦 **Importação Básica**
```tsx
import WordLikeEditor from '@/components/editor/WordLikeEditor'

function MeuComponente() {
  const [conteudo, setConteudo] = useState('')
  
  return (
    <WordLikeEditor
      initialContent={conteudo}
      placeholder="Digite seu documento..."
      onChange={(content, html) => setConteudo(content)}
      onSave={(content, html) => console.log('Salvando:', content)}
      autoFocus={true}
      showPageBreaks={true}
      zoom={100}
    />
  )
}
```

### ⚙️ **Props Disponíveis**
```typescript
interface WordLikeEditorProps {
  initialContent?: string
  placeholder?: string
  onChange?: (content: string, html: string) => void
  onSave?: (content: string, html: string) => void
  readOnly?: boolean
  className?: string
  autoFocus?: boolean
  showRulers?: boolean // false por padrão (interface clean)
  pageFormat?: 'A4' | 'Letter' | 'Legal'
  zoom?: number
  showPageBreaks?: boolean
}
```

## 🎨 **Customização de Estilos**

### 🎨 **Variáveis CSS Principais**
```css
/* Cores principais */
--editor-bg: #f9fbfd
--page-bg: #ffffff
--toolbar-bg: #ffffff
--border-color: #e2e8f0
--text-color: #2d3748
--accent-color: #3182ce

/* Tipografia ABNT */
--font-family: 'Times New Roman', Georgia, serif
--font-size: 12pt
--line-height: 1.6
```

### 🔧 **Classes CSS Customizáveis**
```css
.word-like-editor-advanced { /* Container principal */ }
.abnt-toolbar { /* Toolbar clean */ }
.pages-thumbnail-panel { /* Painel lateral */ }
.page-a4-container { /* Container da página */ }
.page-editor-textarea { /* Área de texto */ }
```

## 📊 **Comparação com Versão Anterior**

| Recurso | Versão Anterior | Versão Clean |
|---------|----------------|--------------|
| **Interface** | Réguas visuais + Toolbar complexa | Clean + Toolbar compacta |
| **Performance** | Renderização pesada | Otimizada |
| **Responsividade** | Limitada | Completa |
| **UX** | Funcional | Intuitiva |
| **Manutenibilidade** | Complexa | Simplificada |
| **Tamanho CSS** | ~2500 linhas | ~1200 linhas |

## 🎯 **Benefícios da Nova Versão**

### ✅ **Para Desenvolvedores**
- **Código mais limpo** e organizado
- **CSS otimizado** com melhor performance
- **Componentes modulares** e reutilizáveis
- **Props bem definidas** e documentadas
- **TypeScript completo** com tipagem forte

### ✅ **Para Usuários Finais**
- **Interface familiar** similar ao Google Docs
- **Navegação intuitiva** entre páginas
- **Performance superior** sem travamentos
- **Foco no conteúdo** sem distrações
- **Experiência móvel** otimizada

### ✅ **Para o Sistema**
- **Carregamento mais rápido** da página
- **Menor uso de memória** do navegador
- **Compatibilidade total** com normas ABNT
- **Escalabilidade** para documentos grandes
- **Manutenção facilitada** do código

## 🚀 **Próximos Passos**

- [ ] Integração com sistema de versionamento
- [ ] Colaboração em tempo real
- [ ] Exportação para PDF com formatação ABNT
- [ ] Sistema de comentários e revisões
- [ ] Templates inteligentes com variáveis
- [ ] Integração com assinatura digital

---

**Desenvolvido com ❤️ para criar a melhor experiência de edição de documentos legislativos** 

# TiptapEditor - Editor Moderno para Documentos Legislativos

## Visão Geral

O TiptapEditor é um editor de texto rico e moderno baseado na biblioteca Tiptap, projetado especificamente para a criação de documentos legislativos. Ele oferece uma experiência similar ao Microsoft Word com performance superior e uma interface limpa.

## Características Principais

### ✨ Funcionalidades do Editor

- **Interface Moderna**: Design limpo e intuitivo
- **Toolbar Completa**: Todos os controles de formatação necessários
- **Bubble Menu**: Menu contextual que aparece ao selecionar texto
- **Floating Menu**: Menu flutuante para inserir elementos em linhas vazias
- **Upload de Imagens**: Arrastar e soltar ou colar imagens
- **Tabelas**: Criação e edição de tabelas
- **Auto-save**: Salvamento automático a cada 30 segundos
- **Shortcuts**: Atalhos de teclado (Ctrl+S para salvar, etc.)
- **Responsivo**: Funciona perfeitamente em dispositivos móveis

### 🎨 Formatação de Texto

- Negrito, Itálico, Sublinhado, Riscado
- Títulos (H1-H6)
- Alinhamento (esquerda, centro, direita, justificado)
- Listas (marcadores e numeradas)
- Cores de texto
- Destacar texto
- Subscrito e sobrescrito
- Links
- Código inline e blocos de código

### 📄 Templates Legislativos

O editor inclui templates pré-configurados para:

- **Requerimento**: Template para requerimentos diversos
- **Projeto de Lei**: Template para projetos de lei municipal
- **Decreto**: Template para decretos legislativos
- **Ofício**: Template para ofícios e comunicações oficiais
- **Relatório**: Template para relatórios de comissão
- **Ata de Sessão**: Template para atas de sessões ordinárias
- **Indicação**: Template para indicações ao Executivo

## Como Usar

### Uso Básico

```tsx
import TiptapEditor from '@/components/editor/TiptapEditor'

function MyPage() {
  const handleSave = (textContent: string, htmlContent: string) => {
    console.log('Salvando:', { textContent, htmlContent })
  }

  const handleImageUpload = async (file: File): Promise<string> => {
    // Implementar upload da imagem
    return URL.createObjectURL(file)
  }

  return (
    <TiptapEditor
      content="<p>Conteúdo inicial</p>"
      placeholder="Digite seu texto aqui..."
      onSave={handleSave}
      onImageUpload={handleImageUpload}
      autoFocus={true}
    />
  )
}
```

### Uso Avançado com Ref

```tsx
import TiptapEditor, { TiptapEditorRef } from '@/components/editor/TiptapEditor'

function MyPage() {
  const editorRef = useRef<TiptapEditorRef>(null)

  const insertImage = () => {
    editorRef.current?.insertImage('/path/to/image.jpg', 'Alt text')
  }

  const insertTable = () => {
    editorRef.current?.insertTable(3, 3)
  }

  const getContent = () => {
    const text = editorRef.current?.getContent()
    const html = editorRef.current?.getHTML()
    console.log({ text, html })
  }

  return (
    <TiptapEditor
      ref={editorRef}
      content=""
      onSave={(text, html) => console.log('Saved:', { text, html })}
    />
  )
}
```

## Propriedades

### TiptapEditorProps

| Propriedade | Tipo | Padrão | Descrição |
|-------------|------|--------|-----------|
| `content` | `string` | `''` | Conteúdo HTML inicial |
| `placeholder` | `string` | `'Digite seu texto aqui...'` | Placeholder do editor |
| `editable` | `boolean` | `true` | Se o editor é editável |
| `onUpdate` | `(text: string, html: string) => void` | - | Callback chamado a cada mudança |
| `onSave` | `(text: string, html: string) => void` | - | Callback chamado ao salvar |
| `className` | `string` | `''` | Classe CSS adicional |
| `showToolbar` | `boolean` | `true` | Mostrar/ocultar toolbar |
| `showBubbleMenu` | `boolean` | `true` | Mostrar/ocultar bubble menu |
| `showFloatingMenu` | `boolean` | `true` | Mostrar/ocultar floating menu |
| `autoFocus` | `boolean` | `false` | Focar automaticamente |
| `characterLimit` | `number` | - | Limite de caracteres |
| `onImageUpload` | `(file: File) => Promise<string>` | - | Função para upload de imagens |

### TiptapEditorRef

| Método | Tipo | Descrição |
|--------|------|-----------|
| `getContent()` | `() => string` | Obtém o texto puro |
| `getHTML()` | `() => string` | Obtém o HTML |
| `setContent(content)` | `(content: string) => void` | Define o conteúdo |
| `focus()` | `() => void` | Foca o editor |
| `blur()` | `() => void` | Remove o foco |
| `clearContent()` | `() => void` | Limpa o conteúdo |
| `insertImage(src, alt)` | `(src: string, alt?: string) => void` | Insere imagem |
| `insertTable(rows, cols)` | `(rows?: number, cols?: number) => void` | Insere tabela |

## Atalhos de Teclado

| Atalho | Ação |
|--------|------|
| `Ctrl+S` | Salvar documento |
| `Ctrl+B` | Negrito |
| `Ctrl+I` | Itálico |
| `Ctrl+U` | Sublinhado |
| `Ctrl+Z` | Desfazer |
| `Ctrl+Y` | Refazer |

## Customização

### Estilos CSS

O editor usa classes CSS bem definidas que podem ser customizadas:

```css
.tiptap-wrapper {
  /* Container principal */
}

.tiptap-toolbar {
  /* Barra de ferramentas */
}

.tiptap-editor {
  /* Área de edição */
}

.tiptap-bubble-menu {
  /* Menu contextual */
}

.tiptap-floating-menu {
  /* Menu flutuante */
}
```

### Extensões Personalizadas

Para adicionar extensões personalizadas do Tiptap:

```tsx
import CustomExtension from '@tiptap/extension-custom'

// Modificar o arquivo TiptapEditor.tsx para incluir:
const editor = useEditor({
  extensions: [
    // ... extensões existentes
    CustomExtension.configure({
      // configurações
    }),
  ],
})
```

## Performance

- ✅ **Lazy Loading**: Componentes carregados sob demanda
- ✅ **Memoização**: Callbacks memoizados para evitar re-renders
- ✅ **Debounce**: Auto-save com debounce
- ✅ **Virtual Scrolling**: Para documentos muito longos
- ✅ **Otimização de Imagens**: Upload e compressão automática

## Acessibilidade

- ✅ **ARIA Labels**: Todos os botões têm labels descritivos
- ✅ **Navegação por Teclado**: Suporte completo
- ✅ **Alto Contraste**: Suporte a modo de alto contraste
- ✅ **Screen Readers**: Compatibilidade com leitores de tela
- ✅ **Focus Management**: Gerenciamento adequado do foco

## Browser Support

| Browser | Versão Mínima |
|---------|---------------|
| Chrome | 90+ |
| Firefox | 88+ |
| Safari | 14+ |
| Edge | 90+ |

## Migração do Editor Anterior

Para migrar do WordLikeEditor para o TiptapEditor:

1. Substitua as importações:
```tsx
// Antes
import WordLikeEditor from '@/components/editor/WordLikeEditor'

// Depois
import TiptapEditor from '@/components/editor/TiptapEditor'
```

2. Atualize as props:
```tsx
// Antes
<WordLikeEditor
  initialContent={content}
  onChange={(newContent) => setContent(newContent)}
  placeholder="Digite aqui..."
/>

// Depois
<TiptapEditor
  content={content}
  onUpdate={(text, html) => setContent(html)}
  placeholder="Digite aqui..."
/>
```

## Roadmap

- [ ] **Export PDF**: Exportação direta para PDF
- [ ] **Comentários**: Sistema de comentários colaborativos
- [ ] **Histórico de Versões**: Controle de versões integrado
- [ ] **Sync Real-time**: Colaboração em tempo real
- [ ] **OCR**: Reconhecimento de texto em imagens
- [ ] **Voice Input**: Entrada por voz
- [ ] **AI Assistant**: Assistente AI para redação

## Contribuição

Para contribuir com o desenvolvimento do TiptapEditor:

1. Fork o repositório
2. Crie uma branch para sua feature
3. Implemente suas mudanças
4. Adicione testes
5. Envie um pull request

## Licença

Este projeto está licenciado sob a MIT License. 