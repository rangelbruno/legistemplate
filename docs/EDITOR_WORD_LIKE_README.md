# Editor no Estilo Word com Normas ABNT

## Visão Geral

Este é um editor de texto avançado que reproduz a experiência do Microsoft Word, com foco especial em documentos legislativos e acadêmicos que seguem as normas ABNT. O editor inclui réguas, formatação A4, paginação automática e todos os elementos necessários para criar documentos profissionais.

## Características Principais

### 🎯 Interface Semelhante ao Word
- **Réguas horizontais e verticais** com marcações em centímetros
- **Páginas A4** com sombra e visualização realista
- **Toolbar avançada** com elementos legislativos e formatação ABNT
- **Zoom** de 50% a 200% para melhor visualização
- **Paginação automática** quando o conteúdo excede uma página

### 📏 Formatação ABNT Completa
- **Margens**: 3cm (esquerda/superior), 2cm (direita/inferior)
- **Fonte**: Times New Roman 12pt
- **Espaçamento**: 1.5 entre linhas
- **Alinhamento**: Justificado por padrão
- **Recuo**: 1.25cm na primeira linha dos parágrafos

### ⚖️ Elementos Legislativos
- **Artigos** com numeração automática
- **Parágrafos** com formatação específica
- **Incisos** e **Alíneas** com recuos apropriados
- **Ementa** centralizada e em negrito
- **Justificativa** com formatação acadêmica
- **Citações longas** com recuo de 4cm
- **Assinatura** com campos personalizáveis

## Como Usar

### Importação
```tsx
import WordLikeEditor from '@/components/editor/WordLikeEditor'
```

### Uso Básico
```tsx
function DocumentEditor() {
  const [content, setContent] = useState('')
  
  const handleSave = (textContent: string, htmlContent: string) => {
    console.log('Salvando documento:', htmlContent)
  }
  
  return (
    <WordLikeEditor
      placeholder="Digite seu documento seguindo as normas ABNT..."
      onChange={(text, html) => setContent(html)}
      onSave={handleSave}
      showRulers={true}
      pageFormat="A4"
      zoom={100}
    />
  )
}
```

### Propriedades Disponíveis

| Propriedade | Tipo | Padrão | Descrição |
|-------------|------|--------|-----------|
| `initialContent` | `string` | `''` | Conteúdo HTML inicial |
| `placeholder` | `string` | `'Digite seu documento...'` | Texto de placeholder |
| `onChange` | `function` | - | Callback para mudanças no conteúdo |
| `onSave` | `function` | - | Callback para salvar (Ctrl+S) |
| `readOnly` | `boolean` | `false` | Modo somente leitura |
| `showRulers` | `boolean` | `true` | Mostrar réguas |
| `pageFormat` | `'A4' \| 'Letter' \| 'Legal'` | `'A4'` | Formato da página |
| `zoom` | `number` | `100` | Nível de zoom inicial |

## Funcionalidades da Toolbar

### Primeira Linha - Ações Gerais
- **Salvar**: Salva o documento (Ctrl+S)
- **Desfazer**: Desfaz a última ação (Ctrl+Z)
- **Refazer**: Refaz a última ação (Ctrl+Y)
- **Zoom**: Controles de zoom (-/+)

### Segunda Linha - Formatação ABNT
- **Elementos ABNT**: Dropdown com elementos legislativos pré-formatados
- **Negrito/Itálico/Sublinhado**: Formatação básica de texto
- **Alinhamento**: Esquerda, Centro, Justificado (padrão ABNT)
- **Listas**: Marcadores e numeração

## Elementos Legislativos Disponíveis

### 1. Título (ABNT)
```html
<h1 class="abnt-title">TÍTULO DO DOCUMENTO</h1>
```
- Fonte: 14pt, negrito, maiúsculo, centralizado

### 2. Artigo (ABNT)
```html
<p class="abnt-article"><strong>Art. 1º</strong> Texto do artigo...</p>
```
- Numeração sequencial, espaçamento adequado

### 3. Parágrafo (ABNT)
```html
<p class="abnt-paragraph"><strong>§ 1º</strong> Texto do parágrafo...</p>
```
- Recuo de 1.25cm na primeira linha

### 4. Inciso (ABNT)
```html
<p class="abnt-inciso">I - Texto do inciso;</p>
```
- Alinhamento específico com recuo apropriado

### 5. Alínea (ABNT)
```html
<p class="abnt-alinea">a) texto da alínea;</p>
```
- Letras minúsculas com parênteses

### 6. Ementa (ABNT)
```html
<p class="abnt-ementa"><strong>EMENTA:</strong> Descrição sucinta...</p>
```
- Centralizada e em negrito

### 7. Justificativa (ABNT)
```html
<h2 class="abnt-section">JUSTIFICATIVA</h2>
<p class="abnt-justify">Texto da fundamentação...</p>
```
- Seção com título e conteúdo justificado

### 8. Citação (ABNT)
```html
<blockquote class="abnt-citation">
  Citação longa recuada 4cm (AUTOR, ano, p. XX).
</blockquote>
```
- Recuo de 4cm, fonte 10pt, espaçamento simples

### 9. Assinatura (ABNT)
```html
<div class="abnt-signature">
  <p class="signature-location">[Local], [data]</p>
  <p class="signature-line">_________________________________</p>
  <p class="signature-name">[Nome Completo]</p>
  <p class="signature-title">[Cargo/Função]</p>
</div>
```
- Formatação padrão para assinaturas oficiais

## Réguas e Medidas

### Régua Horizontal
- **Marcações**: De 0 a 21cm (largura A4)
- **Intervalos**: Maiores a cada 5cm, menores a cada 1cm
- **Zoom**: Acompanha o nível de zoom do documento

### Régua Vertical
- **Marcações**: De 0 a 29.7cm (altura A4)
- **Intervalos**: Mesma lógica da régua horizontal
- **Posicionamento**: Lateral esquerda da página

## Paginação Automática

O editor monitora o conteúdo e cria novas páginas automaticamente quando:
- O texto excede aproximadamente 500 palavras por página
- O conteúdo ultrapassa a altura disponível da página A4

### Recursos de Página
- **Numeração**: Automática no rodapé (- 1 -, - 2 -, etc.)
- **Quebra**: Visual entre páginas
- **Cabeçalho**: Indicador de página atual
- **Margem**: Respeitando normas ABNT

## Atalhos de Teclado

| Atalho | Ação |
|--------|------|
| `Ctrl + S` | Salvar documento |
| `Ctrl + Z` | Desfazer |
| `Ctrl + Y` | Refazer |
| `Ctrl + B` | Negrito |
| `Ctrl + I` | Itálico |
| `Ctrl + U` | Sublinhado |

## Responsividade

O editor se adapta a diferentes tamanhos de tela:

### Desktop (> 1200px)
- Visualização completa com zoom 100%
- Todas as funcionalidades disponíveis

### Tablet (768px - 1200px)
- Zoom automático para 80%
- Toolbar compacta

### Mobile (< 768px)
- Zoom automático para 60%
- Toolbar minimizada (apenas ícones)
- Réguas reduzidas (20px)

## Impressão

O editor inclui estilos específicos para impressão:
- Remove toolbar e réguas
- Ajusta páginas para impressão real
- Mantém formatação ABNT
- Quebras de página automáticas

## Integração com Sistema

### Salvamento
```tsx
const handleSave = (textContent: string, htmlContent: string) => {
  // Salvar no banco de dados
  api.post('/documentos', {
    titulo: 'Documento ABNT',
    conteudo: htmlContent,
    formato: 'abnt'
  })
}
```

### Carregamento
```tsx
const [documento, setDocumento] = useState(null)

useEffect(() => {
  api.get('/documentos/123').then(response => {
    setDocumento(response.data)
  })
}, [])

return (
  <WordLikeEditor
    initialContent={documento?.conteudo}
    onChange={handleChange}
    onSave={handleSave}
  />
)
```

## Personalização

### Temas Customizados
```css
:root {
  --abnt-bg: #ffffff;
  --abnt-text: #000000;
  --abnt-border: #d0d0d0;
  --abnt-ruler-bg: #f0f0f0;
  /* Personalizar outras variáveis */
}
```

### Elementos Personalizados
```tsx
const customElements = [
  {
    id: 'meu-elemento',
    label: 'Meu Elemento',
    icon: CustomIcon,
    template: '<p class="custom-element">Conteúdo personalizado</p>'
  }
]
```

## Considerações Técnicas

### Performance
- **Lazy Loading**: Componentes carregados sob demanda
- **Virtual Scrolling**: Para documentos muito longos
- **Debounce**: Salvamento automático otimizado

### Acessibilidade
- **ARIA Labels**: Em todos os controles
- **Navegação por teclado**: Suporte completo
- **Screen Readers**: Compatibilidade total

### Compatibilidade
- **Navegadores**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Frameworks**: React 18+, Next.js 13+
- **TypeScript**: Suporte nativo

## Troubleshooting

### Problemas Comuns

1. **Réguas não aparecem**
   - Verificar propriedade `showRulers={true}`
   - Conferir CSS importado corretamente

2. **Formatação ABNT não aplicada**
   - Verificar se o CSS está carregado
   - Conferir se as classes ABNT estão sendo aplicadas

3. **Paginação não funciona**
   - Verificar se o conteúdo tem palavras suficientes
   - Conferir se o CSS das páginas está correto

4. **Zoom não responde**
   - Verificar se os callbacks estão configurados
   - Conferir limites mínimo (50%) e máximo (200%)

### Logs de Debug
```tsx
<WordLikeEditor
  onChange={(text, html) => {
    console.log('Conteúdo alterado:', { text, html })
  }}
  onSave={(text, html) => {
    console.log('Salvando:', { text, html })
  }}
/>
```

## Exemplos de Uso

### Documento Legislativo Completo
```tsx
function ProjetoLei() {
  return (
    <WordLikeEditor
      initialContent={`
        <h1 class="abnt-title">PROJETO DE LEI Nº XXX/2024</h1>
        <p class="abnt-ementa"><strong>EMENTA:</strong> Dispõe sobre...</p>
        <p class="abnt-article"><strong>Art. 1º</strong> Esta lei...</p>
        <p class="abnt-paragraph"><strong>§ 1º</strong> Para efeitos...</p>
        <p class="abnt-inciso">I - definição primeira;</p>
        <p class="abnt-alinea">a) subdivisão da definição;</p>
      `}
      pageFormat="A4"
      showRulers={true}
      zoom={100}
    />
  )
}
```

### Documento Acadêmico
```tsx
function TrabalhoAcademico() {
  return (
    <WordLikeEditor
      initialContent={`
        <h1 class="abnt-title">TÍTULO DO TRABALHO</h1>
        <h2 class="abnt-section">1 INTRODUÇÃO</h2>
        <p class="abnt-paragraph">Este trabalho apresenta...</p>
        <blockquote class="abnt-citation">
          Citação longa que demonstra... (AUTOR, 2024, p. 15).
        </blockquote>
      `}
      placeholder="Digite seu trabalho acadêmico..."
      pageFormat="A4"
    />
  )
}
```

## Roadmap

### Próximas Funcionalidades
- [ ] **Cabeçalho e Rodapé** personalizáveis
- [ ] **Numeração automática** de páginas, seções
- [ ] **Índice automático** baseado em títulos
- [ ] **Referências bibliográficas** automáticas
- [ ] **Comentários** e revisões
- [ ] **Colaboração** em tempo real
- [ ] **Exportação** para PDF/DOCX
- [ ] **Templates** pré-definidos

### Melhorias Planejadas
- [ ] **Performance** para documentos grandes
- [ ] **Undo/Redo** avançado
- [ ] **Busca e substituição**
- [ ] **Corretor ortográfico**
- [ ] **Inserção de tabelas**
- [ ] **Gráficos e diagramas**

## Suporte

Para dúvidas ou problemas:
1. Consulte esta documentação
2. Verifique os logs do console
3. Teste em ambiente isolado
4. Reporte issues específicas

---

**Versão**: 1.0.0  
**Última atualização**: Dezembro 2024  
**Compatibilidade**: React 18+, Next.js 13+ 