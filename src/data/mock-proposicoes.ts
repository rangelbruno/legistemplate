// Mock Data para Sistema de Tramitação Parlamentar - Sprint 1

import type {
  Proposicao,
  HistoricoTramitacao,
  Emenda,
  DashboardData,
  EstadoTramitacao,
  TipoProposicao,
  TipoComissao
} from '../types/tramitacao'

/**
 * Proposições Mock - Representam diferentes estados do workflow
 */
export const MOCK_PROPOSICOES: Proposicao[] = [
  {
    id: 'prop-001',
    numero: 'PL 1234',
    ano: 2024,
    tipo: 'PL',
    ementa: 'Dispõe sobre a criação do Programa Nacional de Digitalização do Ensino Público e dá outras providências.',
    explicacao: 'Este projeto visa modernizar a educação pública brasileira através da implementação de tecnologias digitais nas escolas.',
    autor: {
      id: 'dep-001',
      nome: 'Ana Silva',
      partido: 'PT',
      uf: 'SP'
    },
    estadoAtual: 'IN_COMMITTEE_REVIEW',
    dataApresentacao: new Date('2024-01-15'),
    dataUltimaAtualizacao: new Date('2024-02-10'),
    urgencia: 'NORMAL',
    comissoes: ['CEDU', 'CFT'],
    relator: {
      id: 'dep-010',
      nome: 'Carlos Mendes',
      comissao: 'CEDU'
    },
    prazo: new Date('2024-02-25')
  },
  {
    id: 'prop-002',
    numero: 'PLP 567',
    ano: 2024,
    tipo: 'PLP',
    ementa: 'Altera a Lei Complementar nº 101, de 2000, para incluir dispositivos sobre transparência digital nos municípios.',
    explicacao: 'Projeto que obriga municípios a disponibilizar dados públicos em formato digital aberto.',
    autor: {
      id: 'dep-002',
      nome: 'João Santos',
      partido: 'PSDB',
      uf: 'MG'
    },
    estadoAtual: 'READY_FOR_PLENARY',
    dataApresentacao: new Date('2023-11-20'),
    dataUltimaAtualizacao: new Date('2024-01-25'),
    urgencia: 'URGENTE',
    comissoes: ['CCJ', 'CFT'],
    proximaAcao: 'AGENDAR_DISCUSSAO'
  },
  {
    id: 'prop-003',
    numero: 'PEC 12',
    ano: 2024,
    tipo: 'PEC',
    ementa: 'Acrescenta § 4º ao art. 6º da Constituição Federal para incluir o acesso à internet como direito social.',
    explicacao: 'Proposta de Emenda Constitucional que inclui o acesso à internet banda larga como direito social fundamental.',
    autor: {
      id: 'dep-003',
      nome: 'Maria Costa',
      partido: 'PDT',
      uf: 'RJ'
    },
    estadoAtual: 'AMENDMENT_PERIOD_OPEN',
    dataApresentacao: new Date('2024-01-08'),
    dataUltimaAtualizacao: new Date('2024-02-05'),
    urgencia: 'URGENTISSIMA',
    comissoes: ['CCJ'],
    relator: {
      id: 'dep-011',
      nome: 'Roberto Lima',
      comissao: 'CCJ'
    },
    prazo: new Date('2024-02-15')
  },
  {
    id: 'prop-004',
    numero: 'PDC 89',
    ano: 2024,
    tipo: 'PDC',
    ementa: 'Susta os efeitos do Decreto nº 99.999, de 2023, que regulamenta o uso de inteligência artificial na administração pública.',
    autor: {
      id: 'dep-004',
      nome: 'Pedro Oliveira',
      partido: 'PL',
      uf: 'RS'
    },
    estadoAtual: 'UNDER_FORMAL_REVIEW',
    dataApresentacao: new Date('2024-02-01'),
    dataUltimaAtualizacao: new Date('2024-02-01'),
    urgencia: 'NORMAL',
    comissoes: ['CCJ', 'CTASP']
  },
  {
    id: 'prop-005',
    numero: 'PL 5678',
    ano: 2023,
    tipo: 'PL',
    ementa: 'Institui a Política Nacional de Proteção de Dados Pessoais na Saúde Pública.',
    explicacao: 'Estabelece diretrizes para o tratamento de dados pessoais no Sistema Único de Saúde.',
    autor: {
      id: 'dep-005',
      nome: 'Luiza Fernandes',
      partido: 'PSOL',
      uf: 'BA'
    },
    estadoAtual: 'IN_VOTING',
    dataApresentacao: new Date('2023-09-10'),
    dataUltimaAtualizacao: new Date('2024-02-08'),
    urgencia: 'URGENTE',
    comissoes: ['CSAUDE', 'CCJ'],
    proximaAcao: 'VOTAR'
  },
  {
    id: 'prop-006',
    numero: 'PL 9012',
    ano: 2024,
    tipo: 'PL',
    ementa: 'Dispõe sobre a criação de cadastro nacional de agrotóxicos e dá outras providências.',
    autor: {
      id: 'dep-006',
      nome: 'Fernando Barros',
      partido: 'PP',
      uf: 'MT'
    },
    estadoAtual: 'COMMITTEE_REJECTED',
    dataApresentacao: new Date('2024-01-05'),
    dataUltimaAtualizacao: new Date('2024-01-30'),
    urgencia: 'NORMAL',
    comissoes: ['CMEIO', 'CAPADR']
  },
  {
    id: 'prop-007',
    numero: 'PL 3456',
    ano: 2023,
    tipo: 'PL',
    ementa: 'Altera a legislação trabalhista para regular o trabalho remoto no setor público.',
    autor: {
      id: 'dep-007',
      nome: 'Sandra Ribeiro',
      partido: 'PODE',
      uf: 'GO'
    },
    estadoAtual: 'UNDER_EXECUTIVE_REVIEW',
    dataApresentacao: new Date('2023-08-15'),
    dataUltimaAtualizacao: new Date('2024-01-20'),
    urgencia: 'NORMAL',
    comissoes: ['CTASP'],
    prazo: new Date('2024-02-20')
  },
  {
    id: 'prop-008',
    numero: 'PL 7890',
    ano: 2024,
    tipo: 'PL',
    ementa: 'Institui o Marco Legal da Economia Circular no Brasil.',
    explicacao: 'Estabelece princípios, diretrizes e instrumentos para a transição para a economia circular.',
    autor: {
      id: 'dep-008',
      nome: 'Ricardo Alves',
      partido: 'REDE',
      uf: 'PR'
    },
    estadoAtual: 'DRAFT_INITIATED',
    dataApresentacao: new Date('2024-02-12'),
    dataUltimaAtualizacao: new Date('2024-02-12'),
    urgencia: 'NORMAL',
    comissoes: [],
    proximaAcao: 'ENVIAR_PARA_REVISAO'
  },
  {
    id: 'prop-009',
    numero: 'PL 1111',
    ano: 2023,
    tipo: 'PL',
    ementa: 'Dispõe sobre a criação do Sistema Nacional de Combate às Fake News.',
    autor: {
      id: 'dep-009',
      nome: 'Monica Pereira',
      partido: 'CIDADANIA',
      uf: 'PE'
    },
    estadoAtual: 'PUBLISHED_ACTIVE',
    dataApresentacao: new Date('2023-03-10'),
    dataUltimaAtualizacao: new Date('2023-12-15'),
    urgencia: 'URGENTE',
    comissoes: ['CCJ', 'CDHM']
  },
  {
    id: 'prop-010',
    numero: 'PL 2222',
    ano: 2024,
    tipo: 'PL',
    ementa: 'Altera o Código de Defesa do Consumidor para incluir proteções no comércio eletrônico.',
    autor: {
      id: 'dep-010',
      nome: 'Carlos Mendes',
      partido: 'MDB',
      uf: 'SC'
    },
    estadoAtual: 'PENDING_CORRECTIONS',
    dataApresentacao: new Date('2024-01-22'),
    dataUltimaAtualizacao: new Date('2024-02-05'),
    urgencia: 'NORMAL',
    comissoes: [],
    prazo: new Date('2024-02-20'),
    proximaAcao: 'ENVIAR_PARA_REVISAO'
  }
]

/**
 * Histórico de Tramitação Mock
 */
export const MOCK_HISTORICO_TRAMITACAO: HistoricoTramitacao[] = [
  {
    id: 'hist-001',
    proposicaoId: 'prop-001',
    estadoAnterior: 'COMMITTEE_ASSIGNED',
    estadoNovo: 'IN_COMMITTEE_REVIEW',
    acao: 'DISTRIBUIR_COMISSAO',
    data: new Date('2024-01-20'),
    responsavel: {
      id: 'func-001',
      nome: 'Sistema Automatizado',
      tipo: 'SISTEMA'
    },
    observacoes: 'Distribuição automática para Comissão de Educação'
  },
  {
    id: 'hist-002',
    proposicaoId: 'prop-001',
    estadoAnterior: 'IN_COMMITTEE_REVIEW',
    estadoNovo: 'UNDER_RAPPORTEUR_ANALYSIS',
    acao: 'DESIGNAR_RELATOR',
    data: new Date('2024-01-25'),
    responsavel: {
      id: 'dep-010',
      nome: 'Carlos Mendes',
      tipo: 'PARLAMENTAR'
    },
    observacoes: 'Designação do relator por indicação da presidência da comissão'
  },
  {
    id: 'hist-003',
    proposicaoId: 'prop-003',
    estadoAnterior: 'UNDER_RAPPORTEUR_ANALYSIS',
    estadoNovo: 'AMENDMENT_PERIOD_OPEN',
    acao: 'ABRIR_EMENDAS',
    data: new Date('2024-02-05'),
    responsavel: {
      id: 'dep-011',
      nome: 'Roberto Lima',
      tipo: 'PARLAMENTAR'
    },
    observacoes: 'Abertura do período de emendas conforme cronograma da CCJ'
  },
  {
    id: 'hist-004',
    proposicaoId: 'prop-002',
    estadoAnterior: 'COMMITTEE_APPROVED',
    estadoNovo: 'READY_FOR_PLENARY',
    acao: 'ENVIAR_PLENARIO',
    data: new Date('2024-01-25'),
    responsavel: {
      id: 'func-002',
      nome: 'Sistema Automatizado',
      tipo: 'SISTEMA'
    },
    observacoes: 'Envio automático após aprovação na CFT'
  }
]

/**
 * Emendas Mock
 */
export const MOCK_EMENDAS: Emenda[] = [
  {
    id: 'em-001',
    proposicaoId: 'prop-003',
    numero: 1,
    tipo: 'ADITIVA',
    autor: {
      id: 'dep-015',
      nome: 'Julia Rodrigues',
      partido: 'PSDB'
    },
    texto: 'Acrescente-se onde couber: "O acesso à internet banda larga deve ser garantido prioritariamente em escolas públicas e unidades de saúde."',
    justificativa: 'É fundamental priorizar o acesso em equipamentos públicos essenciais.',
    dataApresentacao: new Date('2024-02-06'),
    situacao: 'APRESENTADA'
  },
  {
    id: 'em-002',
    proposicaoId: 'prop-003',
    numero: 2,
    tipo: 'MODIFICATIVA',
    autor: {
      id: 'dep-016',
      nome: 'Alberto Nascimento',
      partido: 'PL'
    },
    texto: 'Substitua-se "acesso à internet" por "acesso universal à internet banda larga".',
    justificativa: 'Especificar que se trata de acesso universal e banda larga.',
    dataApresentacao: new Date('2024-02-07'),
    situacao: 'APRESENTADA'
  },
  {
    id: 'em-003',
    proposicaoId: 'prop-001',
    numero: 1,
    tipo: 'SUBSTITUTIVA',
    autor: {
      id: 'dep-017',
      nome: 'Beatriz Carvalho',
      partido: 'PT'
    },
    texto: 'Substitua o art. 3º por: "O programa será implementado gradualmente, priorizando regiões de menor IDH."',
    justificativa: 'Garantir que a digitalização chegue primeiro às regiões mais carentes.',
    dataApresentacao: new Date('2024-02-08'),
    situacao: 'APROVADA'
  }
]

/**
 * Dados do Dashboard Mock
 */
export const MOCK_DASHBOARD_DATA: DashboardData = {
  totalProposicoes: 10,
  proposicoesPorEstado: {
    'DRAFT_INITIATED': 1,
    'UNDER_FORMAL_REVIEW': 1,
    'PENDING_CORRECTIONS': 1,
    'REJECTED_PRELIMINARY': 0,
    'COMMITTEE_ASSIGNED': 0,
    'IN_COMMITTEE_REVIEW': 1,
    'UNDER_RAPPORTEUR_ANALYSIS': 0,
    'AMENDMENT_PERIOD_OPEN': 1,
    'AMENDMENT_PERIOD_CLOSED': 0,
    'COMMITTEE_DISCUSSION': 0,
    'COMMITTEE_VOTING': 0,
    'COMMITTEE_APPROVED': 0,
    'COMMITTEE_REJECTED': 1,
    'READY_FOR_PLENARY': 1,
    'IN_PLENARY_DISCUSSION': 0,
    'IN_VOTING': 1,
    'APPROVED_PLENARY': 0,
    'REJECTED_PLENARY': 0,
    'IN_REVIEWING_HOUSE': 0,
    'SENT_TO_EXECUTIVE': 0,
    'UNDER_EXECUTIVE_REVIEW': 1,
    'SANCTIONED': 0,
    'PARTIALLY_VETOED': 0,
    'TOTALLY_VETOED': 0,
    'PROMULGATED': 0,
    'PUBLISHED_ACTIVE': 1
  },
  proposicoesPorTipo: {
    'PL': 7,
    'PLP': 1,
    'PEC': 1,
    'PDC': 1,
    'PRC': 0,
    'MSC': 0,
    'PLV': 0
  },
  tempoMedioTramitacao: 185, // em dias
  proposicoesUrgentes: 3,
  proposicoesVencidas: 1,
  comissoesComMaisTrabalho: [
    { comissao: 'CCJ', quantidade: 4 },
    { comissao: 'CFT', quantidade: 3 },
    { comissao: 'CEDU', quantidade: 2 },
    { comissao: 'CSAUDE', quantidade: 1 },
    { comissao: 'CMEIO', quantidade: 1 },
    { comissao: 'CAPADR', quantidade: 1 },
    { comissao: 'CTASP', quantidade: 2 },
    { comissao: 'CDHM', quantidade: 1 }
  ],
  parlamentaresMaisAtivos: [
    { id: 'dep-001', nome: 'Ana Silva', proposicoes: 2, emendas: 1 },
    { id: 'dep-002', nome: 'João Santos', proposicoes: 1, emendas: 0 },
    { id: 'dep-003', nome: 'Maria Costa', proposicoes: 1, emendas: 0 },
    { id: 'dep-010', nome: 'Carlos Mendes', proposicoes: 1, emendas: 0 },
    { id: 'dep-015', nome: 'Julia Rodrigues', proposicoes: 0, emendas: 1 }
  ],
  timelineTramitacao: [
    { data: new Date('2024-01-01'), quantidade: 2, estado: 'DRAFT_INITIATED' },
    { data: new Date('2024-01-15'), quantidade: 3, estado: 'UNDER_FORMAL_REVIEW' },
    { data: new Date('2024-02-01'), quantidade: 2, estado: 'IN_COMMITTEE_REVIEW' },
    { data: new Date('2024-02-05'), quantidade: 1, estado: 'AMENDMENT_PERIOD_OPEN' },
    { data: new Date('2024-02-10'), quantidade: 1, estado: 'READY_FOR_PLENARY' }
  ]
}

/**
 * Simulação de delay para APIs
 */
export const simulateApiDelay = (ms: number = 1000): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Filtros para Mock Data
 */
export const filtrarProposicoesPorEstado = (estado: EstadoTramitacao): Proposicao[] => {
  return MOCK_PROPOSICOES.filter(prop => prop.estadoAtual === estado)
}

export const filtrarProposicoesPorUrgencia = (urgencia: 'NORMAL' | 'URGENTE' | 'URGENTISSIMA'): Proposicao[] => {
  return MOCK_PROPOSICOES.filter(prop => prop.urgencia === urgencia)
}

export const filtrarProposicoesVencidas = (): Proposicao[] => {
  const hoje = new Date()
  return MOCK_PROPOSICOES.filter(prop => {
    if (!prop.prazo) return false
    return prop.prazo < hoje
  })
}

export const obterProposicaoPorId = (id: string): Proposicao | undefined => {
  return MOCK_PROPOSICOES.find(prop => prop.id === id)
}

export const obterHistoricoPorProposicao = (proposicaoId: string): HistoricoTramitacao[] => {
  return MOCK_HISTORICO_TRAMITACAO.filter(hist => hist.proposicaoId === proposicaoId)
}

export const obterEmendasPorProposicao = (proposicaoId: string): Emenda[] => {
  return MOCK_EMENDAS.filter(emenda => emenda.proposicaoId === proposicaoId)
}

/**
 * Estatísticas calculadas
 */
export const calcularEstatisticas = () => {
  const total = MOCK_PROPOSICOES.length
  const urgentes = filtrarProposicoesPorUrgencia('URGENTE').length + filtrarProposicoesPorUrgencia('URGENTISSIMA').length
  const vencidas = filtrarProposicoesVencidas().length
  
  const porTipo: Record<TipoProposicao, number> = {
    'PL': 0, 'PLP': 0, 'PEC': 0, 'PDC': 0, 'PRC': 0, 'MSC': 0, 'PLV': 0
  }
  
  const porComissao: Record<TipoComissao, number> = {
    'CCJ': 0, 'CDHM': 0, 'CFT': 0, 'CEDU': 0, 'CSAUDE': 0, 'CMEIO': 0, 'CTASP': 0, 'CAPADR': 0
  }
  
  MOCK_PROPOSICOES.forEach(prop => {
    porTipo[prop.tipo]++
    prop.comissoes.forEach(com => {
      if (com in porComissao) {
        porComissao[com]++
      }
    })
  })
  
  return {
    total,
    urgentes,
    vencidas,
    porTipo,
    porComissao,
    tempoMedio: 185
  }
} 