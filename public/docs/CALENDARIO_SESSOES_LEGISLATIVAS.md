# Calendário de Sessões Legislativas

## Visão Geral

O sistema de **Calendário de Sessões Legislativas** permite agendar, visualizar e gerenciar as datas das sessões ordinárias e extraordinárias da câmara ou assembleia legislativa. Esta funcionalidade está integrada ao sistema de configurações administrativas e oferece uma interface visual intuitiva baseada em calendário.

## Funcionalidades Principais

### 1. Visualização em Calendário
- **Interface calendário mensal**: Navegação fácil entre meses e anos
- **Indicadores visuais**: Pontos coloridos indicando sessões agendadas
- **Legenda visual**: Diferenciação clara entre sessões ordinárias (azul) e extraordinárias (amarelo)
- **Destaque do dia atual**: Identificação visual do dia presente

### 2. Tipos de Sessões

#### Sessões Ordinárias
- **Cor identificadora**: Azul (#009ef7)
- **Descrição**: Sessões regulares conforme cronograma legislativo
- **Periodicidade**: Geralmente semanais ou quinzenais

#### Sessões Extraordinárias
- **Cor identificadora**: Amarelo (#f1c40f)
- **Descrição**: Sessões especiais para assuntos urgentes
- **Convocação**: Sob demanda conforme necessidade

### 3. Gerenciamento de Sessões

#### Criação de Nova Sessão
- **Data**: Seleção através de date picker
- **Horário**: Definição do horário de início (formato 24h)
- **Tipo**: Escolha entre ordinária ou extraordinária
- **Local**: Campo para definir o local (padrão: "Plenário Principal")
- **Descrição**: Campo opcional para observações ou agenda específica

#### Edição de Sessões
- **Clique na sessão**: Acesso rápido aos dados para edição
- **Atualização em tempo real**: Mudanças refletidas imediatamente no calendário
- **Validação de dados**: Campos obrigatórios (data e horário)

#### Exclusão de Sessões
- **Confirmação de segurança**: Modal de confirmação antes da exclusão
- **Acesso direto**: Botão de exclusão na listagem e no modal de edição

## Interface do Usuário

### Componentes Visuais

#### 1. Cabeçalho do Calendário
```
┌─────────────────────────────────────────┐
│ 🗓️ Calendário de Sessões Legislativas    │
│                              [Nova Sessão] │
└─────────────────────────────────────────┘
```

#### 2. Navegação Mensal
```
┌─────────────────────────────────────────┐
│     [<]      Janeiro 2024      [>]      │
└─────────────────────────────────────────┘
```

#### 3. Grid do Calendário
```
┌─────┬─────┬─────┬─────┬─────┬─────┬─────┐
│ Dom │ Seg │ Ter │ Qua │ Qui │ Sex │ Sáb │
├─────┼─────┼─────┼─────┼─────┼─────┼─────┤
│  1  │  2  │  3  │  4  │  5● │  6  │  7  │
│     │     │     │     │ 09h │     │     │
│     │     │     │     │  O  │     │     │
├─────┼─────┼─────┼─────┼─────┼─────┼─────┤
│  8  │  9  │ 10● │ 11  │ 12  │ 13  │ 14  │
│     │     │ 14h │     │     │     │     │
│     │     │  E  │     │     │     │     │
└─────┴─────┴─────┴─────┴─────┴─────┴─────┘

● = Sessão agendada
O = Ordinária (azul)
E = Extraordinária (amarelo)
```

#### 4. Lista de Sessões do Mês
```
┌─────────────────────────────────────────────────────────┐
│ 🔵 15/01/2024 - 09:00     [Ordinária]        [🗑️]      │
│    Sessão ordinária de abertura do ano legislativo      │
│    📍 Plenário Principal                                │
├─────────────────────────────────────────────────────────┤
│ 🟡 20/01/2024 - 14:00     [Extraordinária]   [🗑️]      │
│    Sessão extraordinária para análise do orçamento      │
│    📍 Plenário Principal                                │
└─────────────────────────────────────────────────────────┘
```

### Modal de Criação/Edição

```
┌─────────────────────────────────────────┐
│ ✨ Nova Sessão                    [X]   │
├─────────────────────────────────────────┤
│                                         │
│ Data *        [📅 15/01/2024]          │
│ Horário *     [🕘 09:00]               │
│                                         │
│ Tipo de Sessão *                        │
│ [🔽 Sessão Ordinária ▼]                │
│                                         │
│ Local                                   │
│ [Plenário Principal                  ]  │
│                                         │
│ Descrição/Observações                   │
│ [─────────────────────────────────────] │
│ [                                     ] │
│ [                                     ] │
│                                         │
├─────────────────────────────────────────┤
│           [Cancelar] [🗑️ Excluir] [✅ Salvar] │
└─────────────────────────────────────────┘
```

## Estrutura de Dados

### Interface Sessao
```typescript
interface Sessao {
  id: string                              // ID único da sessão
  data: string                           // Data no formato YYYY-MM-DD
  tipo: 'ordinaria' | 'extraordinaria'   // Tipo da sessão
  horario: string                        // Horário no formato HH:MM
  descricao?: string                     // Descrição opcional
  local?: string                         // Local da sessão
}
```

### Exemplo de Dados
```typescript
const sessaoExemplo: Sessao = {
  id: "1642147200000",
  data: "2024-01-15",
  tipo: "ordinaria",
  horario: "09:00",
  descricao: "Sessão ordinária de abertura do ano legislativo",
  local: "Plenário Principal"
}
```

## Funcionalidades Técnicas

### 1. Navegação Temporal
- **Mudança de mês**: Botões de navegação anterior/próximo
- **Cálculo automático**: Dias do mês, primeiro dia da semana
- **Responsividade**: Adaptação para diferentes tamanhos de tela

### 2. Interações do Usuário
- **Clique no dia**: Abre modal para criar nova sessão
- **Clique na sessão**: Abre modal para editar sessão existente
- **Hover nos pontos**: Tooltip com informações da sessão

### 3. Validações
- **Campos obrigatórios**: Data e horário são requeridos
- **Formato de data**: Validação automática do formato
- **Conflito de horários**: (Futura implementação)

### 4. Estados da Interface
- **Loading**: Indicador de carregamento durante operações
- **Erro**: Tratamento de erros com mensagens amigáveis
- **Sucesso**: Feedback visual para operações completadas

## Integração com Sistema

### 1. Localização no Sistema
```
Administração → Configurações → Calendário de Sessões
```

### 2. Contexto de Configuração
- Integrado ao `ConfigContext` para persistência
- Sincronização automática com outras configurações
- Callback `onChange` para notificar mudanças

### 3. Persistência de Dados
- Armazenamento no contexto de configuração
- Sincronização com backend (quando implementado)
- Estado local para operações em tempo real

## Padrões de Design

### 1. Consistência Visual
- **Cores**: Seguindo paleta do Metronic
- **Ícones**: Bootstrap Icons consistentes
- **Tipografia**: Hierarquias de texto padrão

### 2. Acessibilidade
- **Contraste**: Cores com contraste adequado
- **Navegação por teclado**: Suporte futuro
- **Labels**: Identificação clara de campos

### 3. Responsividade
- **Mobile first**: Design adaptável
- **Breakpoints**: Pontos de quebra consistentes
- **Touch targets**: Áreas de toque adequadas

## Benefícios da Implementação

### 1. Gestão Eficiente
- **Visualização clara**: Calendário intuitivo para planejamento
- **Organização temporal**: Melhor controle das datas das sessões
- **Diferenciação de tipos**: Identificação rápida entre tipos de sessão

### 2. Experiência do Usuário
- **Interface familiar**: Padrão de calendário conhecido
- **Interação direta**: Clique para criar/editar
- **Feedback visual**: Indicadores claros de estado

### 3. Integração Sistêmica
- **Dados centralizados**: Integração com outras funcionalidades
- **Configuração flexível**: Adaptável a diferentes legislativos
- **Escalabilidade**: Base para funcionalidades futuras

## Possíveis Extensões Futuras

### 1. Funcionalidades Avançadas
- **Recorrência**: Sessões que se repetem automaticamente
- **Notificações**: Lembretes e alertas de sessões
- **Integração com agenda**: Sincronização com calendários externos

### 2. Relatórios e Analytics
- **Estatísticas**: Frequência de sessões por tipo
- **Relatórios**: Exportação de cronogramas
- **Dashboards**: Visualizações gerenciais

### 3. Integrações Externas
- **API pública**: Disponibilização de dados de sessões
- **Calendário Google**: Sincronização bidirecional
- **Sistema de votação**: Integração com pauta das sessões

## Conclusão

O Calendário de Sessões Legislativas representa uma melhoria significativa na gestão temporal das atividades legislativas, proporcionando uma interface visual intuitiva e funcionalidades robustas para o agendamento e controle das sessões ordinárias e extraordinárias.

A implementação segue os padrões de design do sistema, mantém consistência com a arquitetura existente e oferece uma base sólida para futuras expansões da funcionalidade. 