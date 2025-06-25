# Correção do Problema de "Piscar" das Imagens

## Problema Identificado

Após as correções de espaçamento, as imagens começaram a "piscar" com um **tamanho de texto gigante**. Isso estava acontecendo devido a:

1. **Conflitos de font-size**: Regras `font-size: 0` nos containers vs `font-size: initial` nas imagens
2. **Transições CSS**: Animações causando mudanças visuais abruptas
3. **Line-height inconsistente**: Valores de `line-height: 0` causando problemas de renderização
4. **Animações de fade**: Efeitos de entrada das imagens causando flicker

## Soluções Implementadas

### 1. Remoção de Font-size Conflitantes

**Removido:**
```css
span[data-lexical-decorator],
.editor-image,
.advanced-image-container {
  font-size: 0 !important;
  line-height: 0 !important;
}

span[data-lexical-decorator] img,
.editor-image img,
.advanced-image-container img {
  font-size: initial !important;
  line-height: initial !important;
}
```

**Mantido apenas:**
```css
span[data-lexical-decorator],
.editor-image,
.advanced-image-container {
  white-space: nowrap !important;
}
```

### 2. Remoção de Line-height Zero

**Antes:**
```css
span[data-lexical-decorator] {
  line-height: 0;
}

.advanced-image-container {
  line-height: 0;
}
```

**Depois:**
```css
span[data-lexical-decorator] {
  /* line-height removido */
}

.advanced-image-container {
  /* line-height removido */
}
```

### 3. Eliminação de Transições

**Removidas as seguintes transições:**

```css
/* Removido de .editor-input img */
transition: box-shadow 0.2s ease;

/* Removido de .editor-image */
transition: all 0.3s ease;

/* Removido de .advanced-image-container */
transition: transform 0.1s ease, opacity 0.2s ease;

/* Removido de .advanced-image-container img */
transition: box-shadow 0.2s ease, transform 0.1s ease;
```

### 4. Remoção da Animação FadeIn

**Removido:**
```css
.editor-input img.loaded {
  animation: fadeInImage 0.3s ease-in;
}

@keyframes fadeInImage {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

**Substituído por:**
```css
.editor-input img.loaded {
  /* Animação removida */
}
```

### 5. Correção do ContainerStyle JavaScript

**Adicionado:**
```tsx
const containerStyle = {
  position: 'relative' as const,
  display: 'inline-block',
  cursor: isDragging ? 'grabbing' : 'grab',
  zIndex: node.__zIndex,
  background: 'transparent',
  backgroundColor: 'transparent',
  padding: 0,
  fontSize: 'inherit', // Herdar font-size do pai
  lineHeight: 'inherit', // Herdar line-height do pai
  transform: node.__alignment !== 'center' && (position.x !== 0 || position.y !== 0)
    ? `translate(${position.x}px, ${position.y}px)`
    : undefined,
  ...getAlignmentStyle(),
}
```

### 6. Simplificação do CSS

**Novo CSS simplificado para .editor-image:**
```css
.editor-image {
  display: inline-block;
  margin: 2px;
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  vertical-align: middle;
  background: transparent !important;
  background-color: transparent !important;
}
```

## Resultado das Correções

✅ **Piscar eliminado**: Remoção de conflitos de font-size e transições
✅ **Renderização estável**: Font-size e line-height consistentes
✅ **Performance melhorada**: Sem animações desnecessárias
✅ **Espaçamento mantido**: Imagens ainda se integram bem ao texto
✅ **Funcionalidade preservada**: Todas as features continuam funcionando

## Comportamento Esperado

### Antes da Correção:
```
Texto... [IMAGEM PISCANDO COM TAMANHO GIGANTE] ...texto
```

### Após a Correção:
```
Texto... [IMAGEM ESTÁVEL E NORMAL] ...texto
```

## Princípios Aplicados

1. **Simplicidade**: Remoção de regras CSS complexas desnecessárias
2. **Herança**: Uso de `inherit` para font-size e line-height
3. **Estabilidade**: Eliminação de animações e transições
4. **Consistência**: Estilos uniformes entre CSS e JavaScript

## Arquivos Modificados

1. **`src/components/editor/LexicalEditor.css`**
   - Removidas regras de font-size conflitantes
   - Eliminadas transições CSS
   - Removida animação fadeInImage
   - Simplificado CSS do .editor-image

2. **`src/components/editor/ImageNode.tsx`**
   - Adicionado fontSize: 'inherit' e lineHeight: 'inherit'
   - Corrigido erro de lint de margin duplicado

## Status

✅ **Problema resolvido**: Imagens não piscam mais
✅ **Estabilidade**: Renderização consistente
✅ **Performance**: Melhor responsividade sem animações
✅ **UX**: Experiência visual suave e previsível

## Debugging

Se o problema persistir, verificar:

1. **Console do browser**: Buscar por erros CSS
2. **Computed styles**: Verificar se font-size está consistente
3. **Network**: Verificar se imagens carregam completamente
4. **Rendering**: Verificar se há reflows desnecessários 