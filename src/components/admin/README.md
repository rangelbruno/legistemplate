# Dashboard Administrativo Parlamentar

## Visão Geral

O Dashboard Administrativo foi especialmente desenvolvido para o sistema de tramitação parlamentar, oferecendo uma visão completa e em tempo real das atividades legislativas. Ele reutiliza os componentes existentes do Metronic, adaptando-os para o contexto parlamentar.

## Estrutura do Dashboard

### 1. Métricas Principais (Cards com Gráficos)

#### Usuários Ativos
- **Componente**: `UsersStatsWidget`
- **Dados**: Contagem de usuários ativos no sistema
- **Gráfico**: Área chart mostrando crescimento ao longo do tempo
- **Métricas**: Total de usuários e percentual de crescimento

#### Proposições Ativas
- **Componente**: `PropositionStatsWidget`
- **Dados**: Proposições em tramitação no sistema
- **Gráfico**: Bar chart com proposições por período
- **Métricas**: Total ativo e novas proposições no período

#### Sessões Plenárias
- **Componente**: `SessionStatsWidget`
- **Dados**: Sessões realizadas no período
- **Gráfico**: Line chart com histórico de sessões
- **Métricas**: Total de sessões no mês

### 2. Tabela de Proposições

#### Proposições Recentes
- **Componente**: `PropositionsTable`
- **Funcionalidades**:
  - Listagem das últimas proposições cadastradas
  - Filtros por tipo, status e autor
  - Ações para visualizar, editar e tramitar
  - Seleção múltipla para ações em lote

#### Tipos de Proposições Suportados:
- **PL** - Projetos de Lei
- **REQ** - Requerimentos
- **IND** - Indicações
- **MOC** - Moções

#### Status Disponíveis:
- Em Tramitação
- Aprovada
- Rejeitada
- Arquivada
- Pendente

### 3. Widgets Laterais

#### Atividades Recentes
- Feed em tempo real das últimas ações no sistema
- Categorização por tipo de atividade
- Timestamp das ações

#### Proposições por Tipo
- Distribuição atual das proposições por categoria
- Contadores por tipo de documento
- Indicadores de status

## Tecnologias Utilizadas

### Frontend
- **React 18+** com TypeScript
- **Metronic 8** - Framework de componentes UI
- **ApexCharts** - Gráficos interativos
- **Bootstrap 5** - Estilização responsiva

### Gráficos e Visualizações
- **Area Charts** - Para tendências de usuários
- **Bar Charts** - Para volume de proposições
- **Line Charts** - Para histórico de sessões
- **Sparklines** - Para widgets compactos

## Estrutura de Arquivos

```
src/components/admin/
├── widgets/
│   ├── ParliamentaryWidget.tsx    # Widgets com gráficos
│   ├── PropositionsTable.tsx      # Tabela de proposições
│   └── index.ts                   # Exportações
├── dashboard/
│   └── page.tsx                   # Página principal
└── README.md                      # Esta documentação
```

## Como Usar

### Importação dos Componentes

```typescript
import {
  UsersStatsWidget,
  PropositionStatsWidget,
  SessionStatsWidget,
  PropositionsTable
} from '../../../components/admin/widgets'
```

### Exemplo de Uso

```typescript
// Widget de usuários com dados reais
<UsersStatsWidget
  className="card-xl-stretch mb-xl-10"
  userCount={1247}
  growthPercentage={18}
  period="este mês"
  chartHeight="100px"
/>

// Tabela de proposições
<PropositionsTable 
  className="mb-5 mb-xl-10"
  propositions={propositionData}
/>
```

## Personalização

### Cores dos Widgets
- **Usuários**: `#F7D9E3` (Rosa)
- **Proposições**: `#CBF0F4` (Azul claro)
- **Sessões**: `#CBD4F4` (Azul lavanda)

### Configuração de Gráficos
Os gráficos podem ser personalizados através das funções:
- `getUsersChartOptions()`
- `getPropositionsChartOptions()`
- `getSessionsChartOptions()`

## Responsividade

O dashboard é totalmente responsivo, utilizando:
- **Grid Bootstrap**: Sistema de colunas flexível
- **Cards adaptativos**: Ajustam ao tamanho da tela
- **Tabelas responsivas**: Scroll horizontal em telas menores

## Dados Mockados

Para demonstração, os componentes incluem dados fictícios que podem ser substituídos por dados reais da API:

```typescript
// Exemplo de dados de proposição
const mockPropositions: Proposition[] = [
  {
    id: '1',
    number: '001',
    year: 2024,
    type: 'PL',
    title: 'Dispõe sobre...',
    author: 'Vereador João Silva',
    status: 'Em Tramitação',
    createdAt: '2024-12-12',
    lastUpdate: '2024-12-15'
  }
]
```

## Integração com API

Para conectar com dados reais, substitua os dados mockados por chamadas à API:

```typescript
// hooks/usePropositions.ts
const { data: propositions } = useQuery({
  queryKey: ['propositions'],
  queryFn: () => api.get('/admin/propositions')
})
```

## Melhorias Futuras

1. **Filtros Avançados**: Filtros por data, comissão, urgência
2. **Exportação**: PDF/Excel das tabelas
3. **Notificações**: Alertas em tempo real
4. **Dashboard Customizável**: Widgets configuráveis pelo usuário
5. **Analytics Avançados**: Métricas de performance legislativa

## Suporte

Para dúvidas ou melhorias, consulte:
- Documentação do Metronic
- Guia de componentes React
- API Reference do sistema 