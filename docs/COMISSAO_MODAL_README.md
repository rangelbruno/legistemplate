# Modal de Comissões - Documentação Técnica

## Visão Geral

O **ComissaoModal** é um componente React responsável pela criação e edição de comissões na página de Estrutura Parlamentar. Permite gerenciar comissões permanentes, temporárias, especiais e CPIs com validações robustas e interface intuitiva.

## Localização dos Arquivos

```
src/app/admin/configuracoes/estrutura-parlamentar/
├── components/
│   └── ComissaoModal.tsx          # Componente principal do modal
├── page.tsx                       # Página que utiliza o modal
└── docs/
    └── COMISSAO_MODAL_README.md   # Esta documentação
```

## Funcionalidades Principais

### 1. **Tipos de Comissão**
- **PERMANENTE**: Comissões que funcionam durante toda a legislatura
- **TEMPORÁRIA**: Comissões com prazo determinado
- **ESPECIAL**: Comissões para assuntos específicos
- **CPI**: Comissões Parlamentares de Inquérito

### 2. **Status de Comissão**
- **ATIVA**: Comissão funcionando normalmente
- **INATIVA**: Comissão temporariamente suspensa
- **SUSPENSA**: Comissão com atividades pausadas

### 3. **Composição da Comissão**
- **Presidente** (obrigatório)
- **Vice-Presidente** (opcional)
- **Relator** (opcional)
- **Membros** (mínimo 3, incluindo os cargos acima)

## Interface do Componente

### Props

```typescript
interface ComissaoModalProps {
  isOpen: boolean                                    // Controla abertura do modal
  onClose: () => void                                // Função para fechar modal
  onSave: (comissao: Omit<Comissao, 'id'>) => Promise<void>  // Função para salvar
  comissaoAtual?: Comissao | null                    // Comissão para edição (null = nova)
  vereadores: ParlamentarInfo[]                      // Lista de vereadores disponíveis
}
```

### Estrutura do Formulário

```typescript
interface ComissaoForm {
  nome: string                    // Nome da comissão
  tipo: Comissao['tipo']         // Tipo da comissão
  descricao: string              // Descrição das responsabilidades
  finalidade: string             // Finalidade específica (opcional)
  presidenteId: string           // ID do presidente
  vicePresidenteId: string       // ID do vice-presidente
  relatorId: string              // ID do relator
  membrosIds: string[]           // IDs dos membros
  dataConstituicao: string       // Data de constituição
  mandatoInicio: string          // Data início (temporárias/CPIs)
  mandatoFim: string             // Data fim (temporárias/CPIs)
  status: Comissao['status']     // Status atual
}
```

## Validações Implementadas

### 1. **Campos Obrigatórios**
- Nome da comissão
- Descrição
- Presidente
- Data de constituição

### 2. **Validações de Data**
- Para comissões **TEMPORÁRIA** e **CPI**:
  - Data de início obrigatória
  - Data de fim obrigatória
  - Data de fim deve ser posterior ao início

### 3. **Validações de Membros**
- Mínimo de 3 membros na comissão
- Não é possível ter o mesmo vereador em múltiplos cargos
- Presidente, Vice-Presidente e Relator devem estar incluídos nos membros

### 4. **Validações de Integridade**
- Verificação de duplicação de vereadores nos cargos
- Validação de existência dos vereadores selecionados

## Seções do Modal

### 1. **Informações Básicas**
```tsx
// Campos principais
- Nome da Comissão (obrigatório)
- Tipo (seleção entre PERMANENTE, TEMPORÁRIA, ESPECIAL, CPI)
- Descrição (obrigatório)
- Finalidade (opcional)
```

### 2. **Composição da Comissão**
```tsx
// Cargos da comissão
- Presidente (obrigatório, com ícone de coroa)
- Vice-Presidente (opcional, com ícone de usuário)
- Relator (opcional, com ícone de documento)

// Seleção de membros
- Grid interativo de vereadores
- Checkboxes para seleção múltipla
- Badges indicando cargos dos membros
- Highlight visual para membros selecionados
```

### 3. **Datas e Status**
```tsx
// Campos de data
- Data de Constituição (obrigatório)
- Início do Mandato (condicional para temporárias/CPIs)
- Fim do Mandato (condicional para temporárias/CPIs)
- Status (seleção entre ATIVA, INATIVA, SUSPENSA)
```

## Estados e Comportamentos

### 1. **Estado de Loading**
```tsx
const [loading, setLoading] = useState(false)

// Durante salvamento:
- Botões desabilitados
- Spinner no botão de salvar
- Texto "Salvando..."
```

### 2. **Estado de Erro**
```tsx
const [errors, setErrors] = useState<Partial<ComissaoForm>>({})

// Exibição de erros:
- Classes CSS `is-invalid` nos campos
- Mensagens de erro específicas
- Alertas para erros de validação de membros
```

### 3. **Preenchimento Automático**
```tsx
// Para nova comissão:
- Data atual como padrão
- Data fim = data atual + 2 anos
- Status = ATIVA
- Tipo = PERMANENTE

// Para edição:
- Todos os campos preenchidos com dados existentes
- Conversão de datas ISO para formato input
- Mapeamento de membros para IDs
```

## Integração com Services

### Funções Utilizadas

```typescript
// Buscar dados
const vereadores = await buscarEstruturaParlamentar()

// Salvar comissão
await salvarComissao(dadosComissao, comissaoId?)

// Excluir comissão
await excluirComissao(comissaoId)
```

### Tratamento de Erros

```typescript
try {
  await onSave(comissaoDados)
  onClose()
} catch (error) {
  console.error('Erro ao salvar comissão:', error)
  alert('Erro ao salvar comissão. Tente novamente.')
}
```

## Uso na Página Principal

### 1. **Estados Necessários**
```typescript
const [modalComissao, setModalComissao] = useState(false)
const [comissaoEditando, setComissaoEditando] = useState<Comissao | null>(null)
```

### 2. **Funções de Controle**
```typescript
// Abrir modal para nova comissão
const handleNovaComissao = () => {
  setComissaoEditando(null)
  setModalComissao(true)
}

// Abrir modal para editar comissão
const handleEditarComissao = (comissao: Comissao) => {
  setComissaoEditando(comissao)
  setModalComissao(true)
}

// Salvar comissão
const handleSalvarComissao = async (dadosComissao: Omit<Comissao, 'id'>) => {
  const comissaoSalva = await salvarComissao(dadosComissao, comissaoEditando?.id)
  await carregarEstruturaParlamentar() // Recarregar dados
}
```

### 3. **Renderização do Modal**
```tsx
<ComissaoModal
  isOpen={modalComissao}
  onClose={() => setModalComissao(false)}
  onSave={handleSalvarComissao}
  comissaoAtual={comissaoEditando}
  vereadores={estrutura?.vereadores || []}
/>
```

## Design e UX

### 1. **Layout Responsivo**
- Modal extra large (`modal-xl`)
- Grid responsivo para seleção de membros
- Cards adaptáveis para diferentes tamanhos de tela

### 2. **Iconografia Semântica**
- **Presidente**: Coroa (warning/dourado)
- **Vice-Presidente**: Usuário com check (primary/azul)
- **Relator**: Documento (info/azul claro)
- **Informações**: Info circle (primary)
- **Membros**: People group (success/verde)
- **Datas**: Calendar (info)

### 3. **Cores por Tipo**
```scss
PERMANENTE: primary (azul)
TEMPORÁRIA: info (azul claro)
ESPECIAL: warning (amarelo)
CPI: danger (vermelho)
```

### 4. **Feedback Visual**
- Highlight de membros selecionados
- Badges para identificar cargos
- Estados de loading e erro
- Transições suaves

## Exemplos de Uso

### 1. **Criar Nova Comissão Permanente**
```typescript
// Dados mínimos necessários
{
  nome: "Comissão de Educação e Cultura",
  tipo: "PERMANENTE",
  descricao: "Responsável por analisar projetos de educação e cultura",
  presidenteId: "vereador-002",
  membrosIds: ["vereador-002", "vereador-007", "vereador-003"],
  dataConstituicao: "2024-01-15",
  status: "ATIVA"
}
```

### 2. **Criar CPI Temporária**
```typescript
// Dados com datas obrigatórias
{
  nome: "CPI do Transporte Público",
  tipo: "CPI",
  descricao: "Investigar irregularidades no transporte público",
  finalidade: "Apurar denúncias de superfaturamento",
  presidenteId: "vereador-001",
  vicePresidenteId: "vereador-002",
  relatorId: "vereador-004",
  membrosIds: ["vereador-001", "vereador-002", "vereador-004", "vereador-006", "vereador-008"],
  dataConstituicao: "2024-06-01",
  mandatoInicio: "2024-06-01",
  mandatoFim: "2025-06-01",
  status: "ATIVA"
}
```

## Performance e Otimizações

### 1. **Cleanup Functions**
- useEffect com cleanup para evitar memory leaks
- Verificação de componente montado antes de updates

### 2. **Validação Otimizada**
- Validação apenas quando necessário
- Limpeza de erros ao alterar campos
- Debounce implícito na validação

### 3. **Renderização Condicional**
- Campos de data apenas para tipos específicos
- Modal renderizado apenas quando aberto
- Loading states para melhor UX

## Testes Recomendados

### 1. **Cenários de Sucesso**
- [ ] Criar comissão permanente com dados mínimos
- [ ] Criar CPI com todos os campos preenchidos
- [ ] Editar comissão existente
- [ ] Salvar com diferentes tipos de comissão

### 2. **Cenários de Erro**
- [ ] Tentar salvar sem campos obrigatórios
- [ ] Selecionar mesmo vereador em múltiplos cargos
- [ ] Definir data fim anterior ao início
- [ ] Selecionar menos de 3 membros

### 3. **Cenários de UX**
- [ ] Fechar modal durante loading
- [ ] Alternar entre tipos de comissão
- [ ] Selecionar/deselecionar membros
- [ ] Validação em tempo real

## Próximos Passos

### 1. **Melhorias Futuras**
- [ ] Integração com banco de dados real
- [ ] Upload de documentos da comissão
- [ ] Histórico de alterações
- [ ] Notificações por email

### 2. **Funcionalidades Avançadas**
- [ ] Agendamento de reuniões
- [ ] Pauta das comissões
- [ ] Relatórios de atividades
- [ ] Integração com sistema de proposições

### 3. **Otimizações**
- [ ] Lazy loading de vereadores
- [ ] Cache de dados
- [ ] Paginação para muitos vereadores
- [ ] Busca/filtro de vereadores no modal

---

**Desenvolvido para**: Sistema de Gestão Legislativa
**Versão**: 1.0.0
**Última atualização**: Dezembro 2024 