# Sistema de Controle Preciso de Páginas A4

## Visão Geral

O editor foi aprimorado para ter controle **preciso** sobre as dimensões da folha A4 e quebras automáticas de página baseadas no tamanho real do documento.

## Dimensões Exatas Implementadas

### Folha A4 - Especificações Técnicas
```
• Largura: 21,0 cm = 210 mm = 8,3 pol = 794 px (96 DPI)
• Altura: 29,7 cm = 297 mm = 11,7 pol = 1123 px (96 DPI)
```

### Margens ABNT (NBR 14724)
```
• Superior: 3,0 cm = 113 px
• Inferior: 2,0 cm = 76 px  
• Esquerda: 3,0 cm = 113 px
• Direita: 2,0 cm = 76 px
```

### Área Útil de Conteúdo
```
• Largura útil: 16,0 cm = 605 px (794 - 113 - 76)
• Altura útil: 24,7 cm = 934 px (1123 - 113 - 76)
```

## Funcionalidades de Controle de Páginas

### 1. Detecção Automática de Overflow
- **Medição em tempo real** do conteúdo
- **Indicador visual** quando o conteúdo excede a altura da página
- **Cálculo automático** do número de páginas necessárias

### 2. Quebra Automática de Páginas
```typescript
// Sistema de medição precisa
const calculatePages = (htmlContent: string) => {
  const tempDiv = document.createElement('div')
  tempDiv.style.width = `${CONTENT_AREA.width}px`
  tempDiv.style.fontFamily = 'Times New Roman, Times, serif'
  tempDiv.style.fontSize = '12pt'
  tempDiv.style.lineHeight = '1.5'
  
  // Medir altura real do conteúdo
  const contentHeight = tempDiv.scrollHeight
  const pagesNeeded = Math.ceil(contentHeight / CONTENT_AREA.height)
}
```

### 3. Navegação Entre Páginas
- **Controles na toolbar** para navegar entre páginas
- **Indicador atual** da página ativa
- **Contagem total** de páginas
- **Botões anterior/próximo** com estados desabilitados apropriados

### 4. Visualização Aprimorada
- **Páginas separadas visualmente** com sombras realistas
- **Indicadores de margem** que aparecem no hover
- **Numeração automática** das páginas
- **Informações dimensionais** no cabeçalho

## Variáveis CSS para Dimensões Precisas

```css
:root {
  /* Dimensões exatas A4 em pixels (96 DPI) */
  --a4-width: 794px;  /* 21cm */
  --a4-height: 1123px; /* 29.7cm */
  
  /* Margens ABNT em pixels */
  --abnt-margin-top: 113px;    /* 3cm */
  --abnt-margin-right: 76px;   /* 2cm */
  --abnt-margin-bottom: 76px;  /* 2cm */
  --abnt-margin-left: 113px;   /* 3cm */
  
  /* Área útil de conteúdo */
  --content-width: 605px;  /* 794 - 113 - 76 = 605px */
  --content-height: 934px; /* 1123 - 113 - 76 = 934px */
}
```

## Componentes Principais

### 1. PageA4 Component
```typescript
function PageA4({ 
  children, 
  pageNumber, 
  zoom = 100,
  showPageInfo = true,
  isActive = false
}: PageA4Props) {
  // Controle de overflow em tempo real
  const [contentHeight, setContentHeight] = useState(0)
  const isOverflowing = contentHeight > CONTENT_AREA.height
  
  // Observer para medir conteúdo
  useEffect(() => {
    const observer = new ResizeObserver(entries => {
      setContentHeight(entry.contentRect.height)
    })
  }, [])
}
```

### 2. useAdvancedPagination Hook
```typescript
function useAdvancedPagination(content: string, zoom: number) {
  const calculatePages = useCallback((htmlContent: string) => {
    // Criar elemento temporário para medir o conteúdo
    const tempDiv = document.createElement('div')
    // ... configurações de medição
    
    const contentHeight = tempDiv.scrollHeight
    const pagesNeeded = Math.ceil(contentHeight / CONTENT_AREA.height)
    
    // Dividir conteúdo em páginas
    const newPages = dividirConteudoEmPaginas(htmlContent, pagesNeeded)
    
    setPages(newPages)
    setTotalPages(newPages.length)
  }, [])
}
```

## Interface de Controle na Toolbar

### Controles de Página
```
[⟨] Página 1 de 3 [⟩]
```

- **Botão anterior** (⟨): Navega para página anterior
- **Indicador atual**: Mostra "Página X de Y"
- **Botão próximo** (⟩): Navega para próxima página

### Informações Técnicas
```
A4 (21×29.7cm)
Área útil: 605×934px
```

## Indicadores Visuais

### 1. Overflow Warning
Quando o conteúdo excede a altura da página:
```
[📄] Conteúdo continua na próxima página
```

### 2. Guias de Margem
- **Aparecem no hover** da página
- **Linhas azuis** indicando as margens ABNT
- **Tooltips informativos** com as medidas

### 3. Réguas Precisas
- **Marcações a cada 0,5cm** para maior precisão
- **Indicadores de margem** nas réguas
- **Zoom responsivo** mantendo a precisão

## Responsividade

### Desktop (>1200px)
```css
--a4-width: 794px;   /* Tamanho real */
--a4-height: 1123px;
```

### Tablet (768px - 1200px)
```css
--a4-width: 635px;   /* 80% do tamanho */
--a4-height: 898px;
```

### Mobile (<768px)
```css
--a4-width: 476px;   /* 60% do tamanho */
--a4-height: 674px;
```

## Impressão Otimizada

### Configuração de Página
```css
@media print {
  @page {
    size: A4;
    margin: 0;
  }
  
  .page-a4-content {
    width: 21cm !important;
    height: 29.7cm !important;
  }
  
  .page-content-area {
    margin: 3cm 2cm 2cm 3cm !important;
  }
}
```

### Quebras de Página
- **page-break-after: always** entre páginas
- **page-break-after: auto** na última página
- **Remoção de elementos de interface** na impressão

## Performance

### Otimizações Implementadas
1. **ResizeObserver** para detecção eficiente de mudanças
2. **useCallback** para evitar recálculos desnecessários
3. **CSS Grid** para layout das réguas
4. **Transform CSS** para zoom sem reflow
5. **Elementos virtuais** para medição offline

### Medição de Conteúdo
- **Elemento temporário invisível** para cálculos
- **Font matching** com o editor principal
- **Cleanup automático** dos elementos de teste

## Exemplo de Uso

```typescript
// Controle básico
<WordLikeEditor
  showPageBreaks={true}
  pageFormat="A4"
  zoom={100}
  onChange={(text, html) => {
    // html já dividido em páginas conforme necessário
  }}
/>

// Com controle avançado
const { pages, currentPage, totalPages } = useAdvancedPagination(content, zoom)
```

## Benefícios

1. **Precisão total** nas dimensões A4
2. **Conformidade ABNT** nas margens e espaçamentos
3. **Previsão exata** de impressão
4. **Navegação fluida** entre páginas
5. **Feedback visual** em tempo real
6. **Performance otimizada** para documentos longos

## Casos de Uso

### Documentos Legislativos
- **Proposições** com múltiplas páginas
- **Ementas** com formatação específica
- **Justificativas** extensas
- **Anexos** e documentos técnicos

### Controle de Qualidade
- **Validação de limites** de página
- **Verificação de margens** ABNT
- **Controle de espaçamento** entre elementos
- **Preview fiel** para impressão

---

*Este sistema garante que o editor produza documentos com dimensões e formatação idênticas ao Microsoft Word, seguindo rigorosamente as normas ABNT para documentos legislativos.* 