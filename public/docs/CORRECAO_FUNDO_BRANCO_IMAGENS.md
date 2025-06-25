# Correção do Fundo Branco nas Imagens do Editor

## Problema Identificado

Quando uma imagem era inserida no editor Lexical, aparecia uma div com fundo branco ao redor da imagem. Este problema ocorria porque:

1. O Lexical cria um elemento `span` como wrapper para nós decorativos (incluindo imagens)
2. Este span estava herdando estilos de background branco de outras regras CSS
3. O container avançado de imagem também não tinha proteção contra backgrounds indesejados

## Soluções Implementadas

### 1. Correção no CSS (LexicalEditor.css)

**Adicionada proteção para spans decorativos:**
```css
/* Container para nós de imagem do Lexical */
span[data-lexical-decorator] {
  display: block;
  margin: 15px 0;
  text-align: center;
  background: transparent !important;
  background-color: transparent !important;
}
```

**Proteção para containers avançados:**
```css
.advanced-image-container {
  position: relative;
  display: inline-block;
  user-select: none;
  background: transparent !important;
  background-color: transparent !important;
}
```

**Proteção para editor-image:**
```css
.editor-image {
  display: block;
  margin: 15px auto;
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  background: transparent !important;
  background-color: transparent !important;
}
```

**Regra global de proteção:**
```css
/* Garantir que todos os containers de imagem sejam transparentes */
.lexical-editor span[data-lexical-decorator],
.lexical-editor .editor-image,
.lexical-editor .advanced-image-container,
.lexical-editor [class*="image"] {
  background: transparent !important;
  background-color: transparent !important;
}
```

### 2. Correção no JavaScript (ImageNode.tsx)

**Modificação do método createDOM:**
```tsx
createDOM(config: EditorConfig): HTMLElement {
  const span = document.createElement('span')
  const theme = config.theme
  const className = theme.image
  if (className !== undefined) {
    span.className = className
  }
  // Garantir que o container seja transparente
  span.style.background = 'transparent'
  span.style.backgroundColor = 'transparent'
  return span
}
```

**Proteção no componente React:**
```tsx
const containerStyle = {
  position: 'relative' as const,
  display: 'inline-block',
  cursor: isDragging ? 'grabbing' : 'grab',
  zIndex: node.__zIndex,
  background: 'transparent',
  backgroundColor: 'transparent',
  // ... resto das propriedades
}
```

## Resultado

✅ **Problema resolvido**: As imagens agora são inseridas sem fundo branco
✅ **Compatibilidade mantida**: Todos os estilos de imagem funcionam normalmente
✅ **Performance preservada**: As correções não impactam o desempenho do editor

## Arquivos Modificados

1. `src/components/editor/LexicalEditor.css` - Adicionadas regras de proteção CSS
2. `src/components/editor/ImageNode.tsx` - Modificados createDOM e containerStyle

## Como Testar

1. Abrir o editor de documentos
2. Inserir uma imagem usando o botão de imagem
3. Verificar que não há fundo branco ao redor da imagem
4. Testar diferentes alinhamentos (esquerda, centro, direita)
5. Confirmar que as funcionalidades de redimensionamento funcionam normalmente 