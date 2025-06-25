# Modal de Visualização de Comissões

## Visão Geral

O `ComissaoViewModal` é um componente React que exibe os detalhes completos de uma comissão legislativa em formato somente leitura. Fornece uma interface elegante e organizada para visualizar todas as informações da comissão, incluindo composição, membros, estatísticas e dados administrativos.

## Localização

- **Arquivo**: `src/app/admin/configuracoes/estrutura-parlamentar/components/ComissaoViewModal.tsx`
- **Rota**: Utilizado na página `/admin/configuracoes/estrutura-parlamentar`

## Características Principais

### ✅ Design e Interface
- **Layout Responsivo**: Adaptado para diferentes tamanhos de tela
- **Modal Full-Screen**: Utiliza modal-xl com scroll independente
- **Iconografia Semântica**: Ícones específicos para cada tipo de comissão
- **Sistema de Cores**: Cores diferenciadas por tipo e status
- **Cards Organizados**: Informações agrupadas logicamente

### ✅ Seções de Informações

#### 1. **Informações Gerais**
- Nome da comissão
- Tipo (Permanente, Temporária, Especial, CPI)
- Status (Ativa, Inativa, Suspensa)
- Data de constituição
- Período do mandato (para temporárias)
- Descrição e finalidade

#### 2. **Mesa Diretora**
- Presidente (obrigatório)
- Vice-Presidente (opcional)
- Relator (opcional)
- Cards destacados para cada cargo

#### 3. **Membros da Comissão**
- Lista completa de todos os membros
- Indicação visual dos cargos
- Avatars com iniciais
- Informações de partido

#### 4. **Composição Partidária**
- Estatísticas por partido
- Quantidade de membros por partido
- Percentual de representação
- Cards com cores diferenciadas

## Tipos de Dados

### Interface Principal
```typescript
interface ComissaoViewModalProps {
  isOpen: boolean
  onClose: () => void
  onEdit?: (comissao: Comissao) => void
  comissao: Comissao | null
}
```

### Configurações de Tipos
```typescript
const TIPOS_COMISSAO = [
  { value: 'PERMANENTE', label: 'Permanente', color: 'primary', icon: 'ki-setting-3' },
  { value: 'TEMPORARIA', label: 'Temporária', color: 'warning', icon: 'ki-time' },
  { value: 'ESPECIAL', label: 'Especial', color: 'info', icon: 'ki-star' },
  { value: 'CPI', label: 'CPI', color: 'danger', icon: 'ki-search-list' }
]
```

### Configurações de Status
```typescript
const STATUS_COMISSAO = [
  { value: 'ATIVA', label: 'Ativa', color: 'success', icon: 'ki-check-circle' },
  { value: 'INATIVA', label: 'Inativa', color: 'secondary', icon: 'ki-pause' },
  { value: 'SUSPENSA', label: 'Suspensa', color: 'warning', icon: 'ki-warning' }
]
```

## Funcionalidades

### 🎯 Visualização Detalhada
- **Informações Completas**: Todos os dados da comissão organizados
- **Formatação de Datas**: Datas em formato brasileiro (DD/MM/AAAA)
- **Badges Dinâmicas**: Tipo e status com cores identificadoras
- **Hierarquia Visual**: Mesa diretora destacada dos demais membros

### 🔧 Integração e Navegação
- **Botão Editar**: Abre modal de edição (opcional)
- **Botão Fechar**: Fecha o modal
- **Scroll Independente**: Conteúdo com scroll próprio
- **Escape Key**: Fecha modal com tecla ESC

### 📊 Estatísticas Automáticas
- **Contagem de Membros**: Total de membros da comissão
- **Composição Partidária**: Distribuição por partido
- **Percentuais**: Representação percentual de cada partido
- **Validação de Cargos**: Identificação automática de cargos especiais

## Exemplo de Uso

### Integração na Página Principal
```typescript
// Estados necessários
const [modalComissaoView, setModalComissaoView] = useState(false)
const [comissaoVisualizando, setComissaoVisualizando] = useState<Comissao | null>(null)

// Função para abrir modal
const handleVisualizarComissao = (comissao: Comissao) => {
  setComissaoVisualizando(comissao)
  setModalComissaoView(true)
}

// Função para editar a partir da visualização
const handleEditarComissaoFromView = (comissao: Comissao) => {
  setModalComissaoView(false)
  setComissaoEditando(comissao)
  setModalComissao(true)
}

// Renderização do modal
<ComissaoViewModal
  isOpen={modalComissaoView}
  onClose={() => setModalComissaoView(false)}
  onEdit={handleEditarComissaoFromView}
  comissao={comissaoVisualizando}
/>
```

### Botão de Ação
```typescript
<button 
  className="btn btn-sm btn-light-primary me-2"
  onClick={() => handleVisualizarComissao(comissao)}
>
  <i className="ki-duotone ki-eye fs-4">
    <span className="path1"></span>
    <span className="path2"></span>
    <span className="path3"></span>
  </i>
  Visualizar
</button>
```

## Funcionalidades Técnicas

### 🎨 Sistema de Cores por Tipo
- **Permanente**: Azul (`primary`)
- **Temporária**: Amarelo (`warning`)
- **Especial**: Ciano (`info`)
- **CPI**: Vermelho (`danger`)

### 🚦 Sistema de Cores por Status
- **Ativa**: Verde (`success`)
- **Inativa**: Cinza (`secondary`)
- **Suspensa**: Amarelo (`warning`)

### 📱 Responsividade
- **Desktop**: 3 colunas para membros, 4 para estatísticas
- **Tablet**: 2 colunas para membros, 3 para estatísticas
- **Mobile**: 1 coluna para membros, 2 para estatísticas

## Validações e Tratamentos

### ✅ Validações Implementadas
- **Comissão Obrigatória**: Não renderiza se comissão for null
- **Modal Fechado**: Não renderiza se isOpen for false
- **Campos Opcionais**: Tratamento para vice-presidente e relator
- **Datas Válidas**: Formatação segura de datas
- **Membros Vazios**: Tratamento para comissões sem membros

### 🛡️ Tratamento de Erros
- **Datas Inválidas**: Exibe "Não definido"
- **Membros Ausentes**: Exibe lista vazia
- **Avatars**: Fallback para iniciais do nome
- **Partidos**: Agrupamento seguro por sigla

## Performance e Otimizações

### ⚡ Otimizações Implementadas
- **Renderização Condicional**: Só renderiza quando necessário
- **Memoização**: Cálculos de estatísticas otimizados
- **Scroll Virtual**: Scroll independente do body
- **Lazy Loading**: Carregamento sob demanda

### 🔧 Melhorias Futuras
- **Cache de Dados**: Cache local para melhor performance
- **Lazy Images**: Carregamento preguiçoso de avatars
- **Infinite Scroll**: Para comissões com muitos membros
- **Export PDF**: Exportar visualização para PDF

## Testes Recomendados

### 🧪 Cenários de Teste
1. **Visualização Completa**: Comissão com todos os campos preenchidos
2. **Campos Opcionais**: Comissão sem vice-presidente ou relator
3. **Comissão Temporária**: Validar exibição de datas de mandato
4. **Muitos Membros**: Comissão com 10+ membros
5. **Partido Único**: Comissão com membros de um só partido
6. **Responsividade**: Teste em diferentes tamanhos de tela
7. **Navegação**: Fluxo visualizar → editar → salvar
8. **Performance**: Tempo de carregamento e scroll

### 🎯 Casos Extremos
- Comissão com 1 membro (só presidente)
- Comissão com 20+ membros
- Nomes muito longos
- Descrições extensas
- Múltiplos partidos (8+)

## Estrutura de Layout

```
┌─────────────────────────────────────────────┐
│                 MODAL HEADER                │
│     [Ícone] Nome da Comissão      [X]      │
├─────────────────────────────────────────────┤
│                 MODAL BODY                  │
│  ┌─────────────────────────────────────────┐ │
│  │         INFORMAÇÕES GERAIS              │ │
│  │  • Tipo e Status (badges)               │ │
│  │  • Nome, Data, Descrição                │ │
│  └─────────────────────────────────────────┘ │
│  ┌─────────────────────────────────────────┐ │
│  │         MESA DIRETORA                   │ │
│  │  [Presidente] [Vice] [Relator]          │ │
│  └─────────────────────────────────────────┘ │
│  ┌─────────────────────────────────────────┐ │
│  │         MEMBROS (Grid)                  │ │
│  │  [Membro 1] [Membro 2] [Membro 3]       │ │
│  │  [Membro 4] [Membro 5] [Membro 6]       │ │
│  └─────────────────────────────────────────┘ │
│  ┌─────────────────────────────────────────┐ │
│  │         COMPOSIÇÃO PARTIDÁRIA           │ │
│  │  [PT: 3] [PSDB: 2] [MDB: 1]            │ │
│  └─────────────────────────────────────────┘ │
├─────────────────────────────────────────────┤
│                MODAL FOOTER                 │
│           [Fechar]    [Editar]             │
└─────────────────────────────────────────────┘
```

## Conclusão

O `ComissaoViewModal` oferece uma experiência rica e completa para visualização de comissões legislativas. Com design profissional, informações organizadas e navegação intuitiva, facilita a consulta e gestão das comissões parlamentares.

**Próximos Passos:**
1. Implementar filtros por tipo/status
2. Adicionar histórico de alterações
3. Incluir funcionalidades de export
4. Melhorar acessibilidade (ARIA)
5. Adicionar suporte a temas dark/light 