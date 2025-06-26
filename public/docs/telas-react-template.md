# Guia de Adaptação de Template React - Sistema Parlamentar

## 🎯 Objetivo e Metodologia

Este documento detalha a construção de todas as telas do sistema parlamentar através da **adaptação exclusiva** de um template React existente. Nenhum novo CSS, JavaScript ou componente será criado - apenas **reutilização e combinação** dos elementos já presentes no template.

## ⚙️ Princípios de Adaptação

### 🔒 Restrições Fundamentais
- **PROIBIDO**: Criar novos componentes, CSS ou JavaScript
- **OBRIGATÓRIO**: Usar apenas elementos existentes no template
- **METODOLOGIA**: Combinação e adaptação de componentes prontos
- **IDENTIDADE**: Manter design system e arquitetura original

### 🎨 Estratégia de Reutilização
- **Layout Base**: Utilizar grids, containers e estruturas existentes
- **Componentes UI**: Adaptar cards, tabelas, formulários e botões presentes
- **Navegação**: Reaproveitar sidebars, headers e breadcrumbs
- **Dados**: Conectar componentes existentes com novos endpoints

---

## 👤 TIPO DE USUÁRIO 1: PARLAMENTAR

### 🏠 Dashboard Parlamentar

**Rota**: `/parlamentar/dashboard`

#### 📋 Finalidade da Tela
Dashboard principal para parlamentares com visão consolidada de:
- Atividade legislativa pessoal
- Projetos em tramitação
- Agenda de sessões e compromissos
- Alertas de prazos e urgências

#### 📊 Dados Exibidos
1. **Indicadores Pessoais** (KPIs em cards)
   - Projetos apresentados no período
   - Projetos em relatoria
   - Percentual de presença em sessões
   - Emendas aprovadas

2. **Projetos em Andamento** (lista priorizada)
   - Projetos onde é autor ou relator
   - Status atual de tramitação
   - Prazos de relatoria
   - Próximas ações necessárias

3. **Agenda Legislativa** (calendário/timeline)
   - Sessões plenárias do dia
   - Reuniões de comissão
   - Compromissos externos
   - Prazos legislativos

4. **Alertas e Notificações** (painel de urgência)
   - Prazos de relatoria vencendo
   - Sessões com presença obrigatória
   - Documentos aguardando assinatura
   - Chamados de assessoria

#### 🧩 Componentes do Template Utilizados

**Estrutura Principal**:
```jsx
// Layout base existente no template
<DashboardLayout>
  <PageHeader /> {/* Header com nome parlamentar */}
  <StatsGrid />   {/* Grid 4 colunas para KPIs */}
  <ContentGrid /> {/* Grid 3 colunas para seções principais */}
</DashboardLayout>
```

**Componentes Específicos**:
- **StatCard** (4x) - Para KPIs parlamentares
- **DataTable** - Lista de projetos em andamento
- **CalendarWidget** - Agenda legislativa
- **AlertPanel** - Painel de notificações urgentes
- **TimelineComponent** - Atividades recentes
- **ProgressBar** - Andamento de projetos
- **BadgeStatus** - Status de tramitação
- **IconButton** - Ações rápidas

#### 🎨 Estrutura Visual (Layout)

```
┌─────────────────────────────────────────────────────┐
│ PageHeader: "Dashboard - [Nome Parlamentar]"       │
├─────────────────────────────────────────────────────┤
│ StatsGrid (4 colunas):                             │
│ [Projetos]  [Relatoria]  [Presença]  [Emendas]     │
├─────────────────────────────────────────────────────┤
│ ContentGrid (3 colunas):                           │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐    │
│ │ Projetos em │ │ Agenda      │ │ Alertas e   │    │
│ │ Andamento   │ │ Legislativa │ │ Prazos      │    │
│ │             │ │             │ │             │    │
│ │ DataTable   │ │ Calendar    │ │ AlertPanel  │    │
│ │ +           │ │ Widget      │ │ +           │    │
│ │ ActionBtns  │ │             │ │ Timeline    │    │
│ └─────────────┘ └─────────────┘ └─────────────┘    │
└─────────────────────────────────────────────────────┘
```

#### 💾 Integração com APIs
- **GET** `/api/v1/parlamentar/{id}/dashboard` - Dados consolidados
- **GET** `/api/v1/parlamentar/{id}/projetos/ativos` - Projetos em andamento
- **GET** `/api/v1/parlamentar/{id}/agenda` - Agenda do parlamentar
- **GET** `/api/v1/parlamentar/{id}/alertas` - Notificações urgentes

#### 🎛️ Funcionalidades Interativas
- **Click em KPI**: Navegar para tela detalhada
- **Filtro de projetos**: Por status, prazo, tipo
- **Ações rápidas**: "Ver detalhes", "Elaborar relatório"
- **Navegação de agenda**: Visualização semanal/mensal
- **Dismissal de alertas**: Marcar como lido/resolvido

---

### 📄 Proposições em Tramitação

**Rota**: `/parlamentar/proposicoes`

#### 📋 Finalidade da Tela
Visualização detalhada de todas as proposições que estão tramitando e que são de interesse do parlamentar, seja como autor, relator ou membro de comissão.

#### 📊 Dados Exibidos
1. **Lista Master de Proposições**
   - Número da proposição
   - Título e ementa
   - Autor principal
   - Status atual de tramitação
   - Órgão onde se encontra
   - Relator atual
   - Prazos vigentes

2. **Filtros e Busca**
   - Por tipo de proposição
   - Por status de tramitação
   - Por comissão
   - Por período
   - Por relevância/interesse

3. **Detalhes da Proposição** (painel lateral)
   - Texto integral
   - Histórico de tramitação
   - Documentos anexos
   - Pareceres emitidos

#### 🧩 Componentes do Template Utilizados

**Estrutura Principal**:
```jsx
<MainLayout>
  <PageHeader />
  <FilterSidebar />
  <ContentArea>
    <DataTable />
    <DetailPanel />
  </ContentArea>
</MainLayout>
```

**Componentes Específicos**:
- **SearchBar** - Busca textual
- **FilterPanel** - Filtros facetados
- **DataTable** (paginada) - Lista principal
- **SidePanel** - Detalhes da proposição
- **StatusBadge** - Status visual
- **DatePicker** - Filtro por período
- **ExportButton** - Exportação de dados
- **Pagination** - Navegação de páginas

#### 🎨 Estrutura Visual (Layout)

```
┌─────────────────────────────────────────────────────┐
│ PageHeader: "Proposições em Tramitação"            │
├──────────┬──────────────────────────────────────────┤
│ Filter   │ ContentArea:                             │
│ Sidebar  │ ┌─────────────────────────────────────┐  │
│          │ │ SearchBar + FilterTags              │  │
│ [Tipo]   │ ├─────────────────────────────────────┤  │
│ [Status] │ │ DataTable:                          │  │
│ [Órgão]  │ │ [Nº] [Título] [Autor] [Status] [...] │  │
│ [Prazo]  │ │ PL   Projeto   Dep.A   Tramit. [...] │  │
│          │ │ [...] [...] [...] [...] [...] [...] │  │
│ [Buscar] │ ├─────────────────────────────────────┤  │
│ [Limpar] │ │ Pagination                          │  │
│          │ └─────────────────────────────────────┘  │
├──────────┼──────────────────────────────────────────┤
│          │ DetailPanel (quando item selecionado):  │
│          │ [Texto] [Histórico] [Documentos]         │
└──────────┴──────────────────────────────────────────┘
```

#### 💾 Integração com APIs
- **GET** `/api/v1/proposicoes` - Lista paginada com filtros
- **GET** `/api/v1/proposicoes/{id}/detalhes` - Detalhes completos
- **GET** `/api/v1/proposicoes/filtros` - Opções de filtro

---

**✅ Posso prosseguir para a próxima tela do Parlamentar: "Minhas Proposições"?**

Esta tela mostrará especificamente os projetos de autoria do parlamentar logado, com funcionalidades de edição, acompanhamento e gestão de emendas. Aguardo sua confirmação para continuar com o detalhamento.