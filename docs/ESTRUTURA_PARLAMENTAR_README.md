# 🏛️ Estrutura Parlamentar - Sistema de Tramitação

## 📋 Visão Geral

A funcionalidade **Estrutura Parlamentar** permite visualizar a composição completa da Câmara Municipal, incluindo informações sobre vereadores, mesa diretora, partidos representados e legislatura atual.

## 🎯 Funcionalidades Implementadas

### ✅ **Página Principal da Estrutura Parlamentar**
- **Rota**: `/admin/configuracoes/estrutura-parlamentar`
- **Componente**: `src/app/admin/configuracoes/estrutura-parlamentar/page.tsx`
- **Layout**: `src/app/admin/layout.tsx` (AdministradorLayout)

### 📊 **Cards Estatísticos**
- **Total de Vereadores**: Contagem de parlamentares ativos
- **Partidos Representados**: Número de partidos com representação
- **Mesa Diretora**: Informações do presidente da câmara
- **Legislatura Atual**: Período vigente (2021-2024)

### 👥 **Lista de Vereadores**
- **Cards Individuais**: Cada vereador tem seu card com:
  - Nome completo e foto (ou iniciais)
  - Partido político com sigla
  - Badge especial para presidente da câmara
  - Profissão e biografia
  - Período do mandato
  - Informações de contato
  
### 🔍 **Funcionalidades de Filtro**
- **Busca por Nome**: Campo de pesquisa (preparado para implementação)
- **Filtro por Partido**: Dropdown com todos os partidos representados
- **Estado Responsivo**: Interface adaptável para mobile

## 🏗️ **Arquitetura Técnica**

### 📁 **Estrutura de Arquivos**
```
src/
├── app/admin/configuracoes/
│   └── estrutura-parlamentar/
│       └── page.tsx          # Página principal da estrutura
├── services/
│   └── estrutura-parlamentar.service.ts  # Service com dados mock
└── app/routing/
    └── PrivateRoutes.tsx     # Configuração das rotas
```

### 🔧 **Tecnologias Utilizadas**
- **React 18** com TypeScript
- **React Router DOM** para navegação
- **Bootstrap 5** + **Keen Icons** para UI
- **Service Pattern** para gerenciamento de dados
- **Mock Data** com dados realistas de 9 vereadores

## 📊 **Service de Dados**

### 🔄 **Principais Funções**
```typescript
// Buscar estrutura completa
buscarEstruturaParlamentar(): Promise<EstruturaParlamentar>

// Filtrar por partido
buscarVereadoresPorPartido(sigla: string): Promise<ParlamentarInfo[]>

// Buscar vereador específico
buscarVereadorPorId(id: string): Promise<ParlamentarInfo | null>

// Obter partidos representados
obterPartidosRepresentados(): string[]
```

### 🎭 **Dados Mock Incluídos**
- **9 Vereadores** com dados completos
- **7 Partidos** representados (PT, PSDB, MDB, PSOL, PP, PDT, PL, REDE, PODE)
- **1 Presidente** da câmara definido
- **Profissões Diversas**: Advogado, Professora, Empresário, etc.
- **Biografias Realistas** para cada parlamentar

## 🎨 **Interface de Usuário**

### 📱 **Layout Responsivo**
- **Desktop**: Cards em grid 3 colunas (col-xl-4)
- **Tablet**: Cards em grid 2 colunas (col-lg-6)
- **Mobile**: Cards em coluna única (col-md-6)

### 🏷️ **Sistema de Badges**
- **Badge do Partido**: Cor primária com sigla
- **Badge de Presidente**: Cor warning com ícone de coroa
- **Estados Visuais**: Loading, empty state, error handling

### 🎭 **Avatares e Fotos**
- **Foto do Vereador**: Se disponível, exibe imagem
- **Fallback**: Iniciais do nome em círculo colorido
- **Tamanho Padrão**: 50px nos cards

## 🔮 **Próximas Implementações**

### 🔄 **Integração com APIs Reais**
- [ ] Conectar com endpoint `/api/v1/admin/vereadores`
- [ ] Implementar cache de dados
- [ ] Sistema de refresh automático

### 🔍 **Funcionalidades de Busca**
- [ ] Busca em tempo real por nome
- [ ] Filtros avançados (profissão, mandato)
- [ ] Ordenação personalizada

### 📄 **Páginas Detalhadas**
- [ ] Perfil completo do vereador
- [ ] Histórico de proposições
- [ ] Agenda e presenças

### 🏛️ **Mesa Diretora Completa**
- [ ] Vice-presidente e secretários
- [ ] Histórico de presidências
- [ ] Comissões e relatores

## 🔧 **Como Usar**

### 🚀 **Acessar a Página**
1. Fazer login no sistema como **Administrador**
2. Navegar para **Administração > Configurações > Estrutura Parlamentar**
3. Ou acessar diretamente `/admin/configuracoes/estrutura-parlamentar`

### 🎛️ **Interações Disponíveis**
- **Filtrar por Partido**: Usar dropdown no canto superior direito
- **Ver Detalhes**: Clicar em "Ver Perfil Completo" (preparado para implementação)
- **Buscar**: Campo de busca preparado para funcionalidade futura

## 🐛 **Resolução de Problemas**

### ❌ **Dados Não Carregam**
- Verificar se o service está importado corretamente
- Confirmar se as rotas estão configuradas
- Conferir console do navegador para erros

### 🎨 **Estilos Não Aplicados**
- Confirmar que Bootstrap 5 está carregado
- Verificar se Keen Icons estão disponíveis
- Validar classes CSS personalizadas

### 🔄 **Navegação Não Funciona**
- Confirmar configuração no `PrivateRoutes.tsx`
- Verificar se React Router está funcionando
- Testar outras rotas do sistema

## 📈 **Métricas e Performance**

### ⚡ **Otimizações Implementadas**
- **Simulação de Delay**: 800ms para demonstrar loading
- **Estados de Loading**: Spinners e skeleton screens
- **Error Boundaries**: Tratamento de erros gracioso
- **Responsive Design**: Otimizado para todos os dispositivos

### 📊 **Dados de Performance**
- **Tempo de Carregamento**: ~800ms (simulado)
- **Componentes**: Reutilização máxima de UI
- **Bundle Size**: Otimizado com lazy loading preparado

---

## 👨‍💻 **Desenvolvido Por**
Sistema de Tramitação Parlamentar - Estrutura Parlamentar Module
Data: Dezembro 2024 