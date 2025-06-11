// Sistema de Workflow de Tramitação Parlamentar - Sprint 1

import type {
  EstadoTramitacao,
  AcaoTramitacao,
  TransicaoEstado,
  WorkflowConfig,
  Proposicao
} from '../../types/tramitacao'

/**
 * Configuração completa do workflow de tramitação
 * Baseada nos fluxos mapeados em docs/memory-bank/fluxos-tramitacao.md
 */
export const WORKFLOW_CONFIG: WorkflowConfig = {
  estadosValidos: [
    // FASE 1: Criação e Recepção
    'DRAFT_INITIATED',
    'UNDER_FORMAL_REVIEW',
    'PENDING_CORRECTIONS',
    'REJECTED_PRELIMINARY',
    
    // FASE 2: Comissões
    'COMMITTEE_ASSIGNED',
    'IN_COMMITTEE_REVIEW',
    'UNDER_RAPPORTEUR_ANALYSIS',
    'AMENDMENT_PERIOD_OPEN',
    'AMENDMENT_PERIOD_CLOSED',
    'COMMITTEE_DISCUSSION',
    'COMMITTEE_VOTING',
    'COMMITTEE_APPROVED',
    'COMMITTEE_REJECTED',
    'READY_FOR_PLENARY',
    
    // FASE 3: Plenário
    'IN_PLENARY_DISCUSSION',
    'IN_VOTING',
    'APPROVED_PLENARY',
    'REJECTED_PLENARY',
    
    // FASE 4: Casa Revisora
    'IN_REVIEWING_HOUSE',
    
    // FASE 5: Executivo
    'SENT_TO_EXECUTIVE',
    'UNDER_EXECUTIVE_REVIEW',
    'SANCTIONED',
    'PARTIALLY_VETOED',
    'TOTALLY_VETOED',
    
    // FASE 6: Finalização
    'PROMULGATED',
    'PUBLISHED_ACTIVE'
  ],

  transicoesPermitidas: [
    // FASE 1: Criação e Recepção
    {
      de: 'DRAFT_INITIATED',
      para: 'UNDER_FORMAL_REVIEW',
      acao: 'ENVIAR_PARA_REVISAO',
      responsavel: 'PARLAMENTAR',
      automatica: false,
      tempoLimite: 30
    },
    {
      de: 'UNDER_FORMAL_REVIEW',
      para: 'COMMITTEE_ASSIGNED',
      acao: 'APROVAR',
      responsavel: 'MESA',
      automatica: false,
      tempoLimite: 15
    },
    {
      de: 'UNDER_FORMAL_REVIEW',
      para: 'PENDING_CORRECTIONS',
      acao: 'SOLICITAR_CORRECOES',
      responsavel: 'MESA',
      automatica: false
    },
    {
      de: 'UNDER_FORMAL_REVIEW',
      para: 'REJECTED_PRELIMINARY',
      acao: 'REJEITAR',
      responsavel: 'MESA',
      automatica: false
    },
    {
      de: 'PENDING_CORRECTIONS',
      para: 'UNDER_FORMAL_REVIEW',
      acao: 'ENVIAR_PARA_REVISAO',
      responsavel: 'PARLAMENTAR',
      automatica: false,
      tempoLimite: 15
    },

    // FASE 2: Comissões
    {
      de: 'COMMITTEE_ASSIGNED',
      para: 'IN_COMMITTEE_REVIEW',
      acao: 'DISTRIBUIR_COMISSAO',
      responsavel: 'MESA',
      automatica: true,
      tempoLimite: 5
    },
    {
      de: 'IN_COMMITTEE_REVIEW',
      para: 'UNDER_RAPPORTEUR_ANALYSIS',
      acao: 'DESIGNAR_RELATOR',
      responsavel: 'COMISSAO',
      automatica: false,
      tempoLimite: 7
    },
    {
      de: 'UNDER_RAPPORTEUR_ANALYSIS',
      para: 'AMENDMENT_PERIOD_OPEN',
      acao: 'ABRIR_EMENDAS',
      responsavel: 'COMISSAO',
      automatica: false,
      tempoLimite: 10
    },
    {
      de: 'AMENDMENT_PERIOD_OPEN',
      para: 'AMENDMENT_PERIOD_CLOSED',
      acao: 'FECHAR_EMENDAS',
      responsavel: 'SISTEMA',
      automatica: true,
      tempoLimite: 5
    },
    {
      de: 'AMENDMENT_PERIOD_CLOSED',
      para: 'COMMITTEE_DISCUSSION',
      acao: 'AGENDAR_DISCUSSAO',
      responsavel: 'COMISSAO',
      automatica: false,
      tempoLimite: 7
    },
    {
      de: 'COMMITTEE_DISCUSSION',
      para: 'COMMITTEE_VOTING',
      acao: 'VOTAR',
      responsavel: 'COMISSAO',
      automatica: false
    },
    {
      de: 'COMMITTEE_VOTING',
      para: 'COMMITTEE_APPROVED',
      acao: 'APROVAR',
      responsavel: 'COMISSAO',
      automatica: false
    },
    {
      de: 'COMMITTEE_VOTING',
      para: 'COMMITTEE_REJECTED',
      acao: 'REJEITAR',
      responsavel: 'COMISSAO',
      automatica: false
    },
    {
      de: 'COMMITTEE_APPROVED',
      para: 'READY_FOR_PLENARY',
      acao: 'ENVIAR_PLENARIO',
      responsavel: 'COMISSAO',
      automatica: true,
      tempoLimite: 3
    },

    // FASE 3: Plenário
    {
      de: 'READY_FOR_PLENARY',
      para: 'IN_PLENARY_DISCUSSION',
      acao: 'AGENDAR_DISCUSSAO',
      responsavel: 'MESA',
      automatica: false,
      tempoLimite: 30
    },
    {
      de: 'IN_PLENARY_DISCUSSION',
      para: 'IN_VOTING',
      acao: 'VOTAR',
      responsavel: 'MESA',
      automatica: false
    },
    {
      de: 'IN_VOTING',
      para: 'APPROVED_PLENARY',
      acao: 'APROVAR',
      responsavel: 'MESA',
      automatica: false
    },
    {
      de: 'IN_VOTING',
      para: 'REJECTED_PLENARY',
      acao: 'REJEITAR',
      responsavel: 'MESA',
      automatica: false
    },

    // FASE 4: Casa Revisora
    {
      de: 'APPROVED_PLENARY',
      para: 'IN_REVIEWING_HOUSE',
      acao: 'ENVIAR_CASA_REVISORA',
      responsavel: 'MESA',
      automatica: true,
      tempoLimite: 5,
      condicoes: ['bicameral']
    },
    {
      de: 'APPROVED_PLENARY',
      para: 'SENT_TO_EXECUTIVE',
      acao: 'ENVIAR_EXECUTIVO',
      responsavel: 'MESA',
      automatica: true,
      tempoLimite: 5,
      condicoes: ['unicameral']
    },
    {
      de: 'IN_REVIEWING_HOUSE',
      para: 'SENT_TO_EXECUTIVE',
      acao: 'ENVIAR_EXECUTIVO',
      responsavel: 'MESA',
      automatica: true,
      tempoLimite: 5
    },

    // FASE 5: Executivo
    {
      de: 'SENT_TO_EXECUTIVE',
      para: 'UNDER_EXECUTIVE_REVIEW',
      acao: 'ENVIAR_EXECUTIVO',
      responsavel: 'SISTEMA',
      automatica: true,
      tempoLimite: 1
    },
    {
      de: 'UNDER_EXECUTIVE_REVIEW',
      para: 'SANCTIONED',
      acao: 'SANCIONAR',
      responsavel: 'EXECUTIVO',
      automatica: false,
      tempoLimite: 15
    },
    {
      de: 'UNDER_EXECUTIVE_REVIEW',
      para: 'PARTIALLY_VETOED',
      acao: 'VETAR',
      responsavel: 'EXECUTIVO',
      automatica: false,
      tempoLimite: 15
    },
    {
      de: 'UNDER_EXECUTIVE_REVIEW',
      para: 'TOTALLY_VETOED',
      acao: 'VETAR',
      responsavel: 'EXECUTIVO',
      automatica: false,
      tempoLimite: 15
    },

    // FASE 6: Finalização
    {
      de: 'SANCTIONED',
      para: 'PROMULGATED',
      acao: 'PROMULGAR',
      responsavel: 'EXECUTIVO',
      automatica: true,
      tempoLimite: 2
    },
    {
      de: 'PROMULGATED',
      para: 'PUBLISHED_ACTIVE',
      acao: 'PUBLICAR',
      responsavel: 'SISTEMA',
      automatica: true,
      tempoLimite: 1
    }
  ],

  acoesDisponiveis: {
    // FASE 1
    'DRAFT_INITIATED': ['ENVIAR_PARA_REVISAO'],
    'UNDER_FORMAL_REVIEW': ['APROVAR', 'REJEITAR', 'SOLICITAR_CORRECOES'],
    'PENDING_CORRECTIONS': ['ENVIAR_PARA_REVISAO'],
    'REJECTED_PRELIMINARY': [],
    
    // FASE 2
    'COMMITTEE_ASSIGNED': ['DISTRIBUIR_COMISSAO'],
    'IN_COMMITTEE_REVIEW': ['DESIGNAR_RELATOR'],
    'UNDER_RAPPORTEUR_ANALYSIS': ['ABRIR_EMENDAS'],
    'AMENDMENT_PERIOD_OPEN': ['FECHAR_EMENDAS'],
    'AMENDMENT_PERIOD_CLOSED': ['AGENDAR_DISCUSSAO'],
    'COMMITTEE_DISCUSSION': ['VOTAR'],
    'COMMITTEE_VOTING': ['APROVAR', 'REJEITAR'],
    'COMMITTEE_APPROVED': ['ENVIAR_PLENARIO'],
    'COMMITTEE_REJECTED': [],
    'READY_FOR_PLENARY': ['AGENDAR_DISCUSSAO'],
    
    // FASE 3
    'IN_PLENARY_DISCUSSION': ['VOTAR'],
    'IN_VOTING': ['APROVAR', 'REJEITAR'],
    'APPROVED_PLENARY': ['ENVIAR_CASA_REVISORA', 'ENVIAR_EXECUTIVO'],
    'REJECTED_PLENARY': [],
    
    // FASE 4
    'IN_REVIEWING_HOUSE': ['ENVIAR_EXECUTIVO'],
    
    // FASE 5
    'SENT_TO_EXECUTIVE': [],
    'UNDER_EXECUTIVE_REVIEW': ['SANCIONAR', 'VETAR'],
    'SANCTIONED': ['PROMULGAR'],
    'PARTIALLY_VETOED': [],
    'TOTALLY_VETOED': [],
    
    // FASE 6
    'PROMULGATED': ['PUBLICAR'],
    'PUBLISHED_ACTIVE': []
  },

  notificacoes: {
    'DRAFT_INITIATED': ['autor'],
    'UNDER_FORMAL_REVIEW': ['mesa_diretora', 'consultoria_juridica'],
    'PENDING_CORRECTIONS': ['autor'],
    'REJECTED_PRELIMINARY': ['autor'],
    'COMMITTEE_ASSIGNED': ['presidente_comissao', 'secretaria_comissao'],
    'IN_COMMITTEE_REVIEW': ['membros_comissao'],
    'UNDER_RAPPORTEUR_ANALYSIS': ['relator'],
    'AMENDMENT_PERIOD_OPEN': ['todos_parlamentares'],
    'AMENDMENT_PERIOD_CLOSED': ['relator', 'presidente_comissao'],
    'COMMITTEE_DISCUSSION': ['membros_comissao'],
    'COMMITTEE_VOTING': ['membros_comissao'],
    'COMMITTEE_APPROVED': ['mesa_diretora'],
    'COMMITTEE_REJECTED': ['autor'],
    'READY_FOR_PLENARY': ['mesa_diretora', 'liderancas'],
    'IN_PLENARY_DISCUSSION': ['todos_parlamentares'],
    'IN_VOTING': ['todos_parlamentares'],
    'APPROVED_PLENARY': ['casa_revisora', 'executivo'],
    'REJECTED_PLENARY': ['autor'],
    'IN_REVIEWING_HOUSE': ['casa_revisora'],
    'SENT_TO_EXECUTIVE': ['presidencia_republica'],
    'UNDER_EXECUTIVE_REVIEW': ['ministros'],
    'SANCTIONED': ['congresso', 'imprensa'],
    'PARTIALLY_VETOED': ['congresso'],
    'TOTALLY_VETOED': ['congresso'],
    'PROMULGATED': ['imprensa', 'diario_oficial'],
    'PUBLISHED_ACTIVE': ['todos']
  },

  prazos: {
    'DRAFT_INITIATED': 30,
    'UNDER_FORMAL_REVIEW': 15,
    'PENDING_CORRECTIONS': 15,
    'REJECTED_PRELIMINARY': 0,
    'COMMITTEE_ASSIGNED': 5,
    'IN_COMMITTEE_REVIEW': 7,
    'UNDER_RAPPORTEUR_ANALYSIS': 10,
    'AMENDMENT_PERIOD_OPEN': 5,
    'AMENDMENT_PERIOD_CLOSED': 7,
    'COMMITTEE_DISCUSSION': 30,
    'COMMITTEE_VOTING': 1,
    'COMMITTEE_APPROVED': 3,
    'COMMITTEE_REJECTED': 0,
    'READY_FOR_PLENARY': 30,
    'IN_PLENARY_DISCUSSION': 30,
    'IN_VOTING': 1,
    'APPROVED_PLENARY': 5,
    'REJECTED_PLENARY': 0,
    'IN_REVIEWING_HOUSE': 90,
    'SENT_TO_EXECUTIVE': 1,
    'UNDER_EXECUTIVE_REVIEW': 15,
    'SANCTIONED': 2,
    'PARTIALLY_VETOED': 30,
    'TOTALLY_VETOED': 30,
    'PROMULGATED': 1,
    'PUBLISHED_ACTIVE': 0
  }
}

/**
 * Engine de Workflow para controlar transições
 */
export class TramitacaoWorkflowEngine {
  private config: WorkflowConfig

  constructor(config: WorkflowConfig = WORKFLOW_CONFIG) {
    this.config = config
  }

  /**
   * Verifica se uma transição é válida
   */
  podeTransicionar(estadoAtual: EstadoTramitacao, acao: AcaoTramitacao): boolean {
    const acoesPermitidas = this.config.acoesDisponiveis[estadoAtual] || []
    return acoesPermitidas.includes(acao)
  }

  /**
   * Obtém o próximo estado baseado na ação
   */
  obterProximoEstado(estadoAtual: EstadoTramitacao, acao: AcaoTramitacao): EstadoTramitacao | null {
    const transicao = this.config.transicoesPermitidas.find(
      t => t.de === estadoAtual && t.acao === acao
    )
    return transicao?.para || null
  }

  /**
   * Obtém todas as ações disponíveis para um estado
   */
  obterAcoesDisponiveis(estado: EstadoTramitacao): AcaoTramitacao[] {
    return this.config.acoesDisponiveis[estado] || []
  }

  /**
   * Verifica se uma proposição está em prazo
   */
  estaEmPrazo(proposicao: Proposicao): boolean {
    const prazoEstado = this.config.prazos[proposicao.estadoAtual]
    if (!prazoEstado) return true

    const diasTramitacao = Math.floor(
      (Date.now() - proposicao.dataUltimaAtualizacao.getTime()) / (1000 * 60 * 60 * 24)
    )
    
    return diasTramitacao <= prazoEstado
  }

  /**
   * Calcula dias restantes no prazo
   */
  diasRestantesPrazo(proposicao: Proposicao): number {
    const prazoEstado = this.config.prazos[proposicao.estadoAtual]
    if (!prazoEstado) return Infinity

    const diasTramitacao = Math.floor(
      (Date.now() - proposicao.dataUltimaAtualizacao.getTime()) / (1000 * 60 * 60 * 24)
    )
    
    return Math.max(0, prazoEstado - diasTramitacao)
  }

  /**
   * Obtém responsável por um estado
   */
  obterResponsavel(estado: EstadoTramitacao): string {
    const transicoes = this.config.transicoesPermitidas.filter(t => t.de === estado)
    return transicoes[0]?.responsavel || 'SISTEMA'
  }

  /**
   * Verifica se uma transição é automática
   */
  ehTransicaoAutomatica(estadoAtual: EstadoTramitacao, acao: AcaoTramitacao): boolean {
    const transicao = this.config.transicoesPermitidas.find(
      t => t.de === estadoAtual && t.acao === acao
    )
    return transicao?.automatica || false
  }

  /**
   * Obtém lista de notificações para um estado
   */
  obterNotificacoes(estado: EstadoTramitacao): string[] {
    return this.config.notificacoes[estado] || []
  }
}

/**
 * Instance única do engine de workflow
 */
export const workflowEngine = new TramitacaoWorkflowEngine()

/**
 * Helpers para labels dos estados
 */
export const ESTADO_LABELS: Record<EstadoTramitacao, string> = {
  'DRAFT_INITIATED': 'Minuta Criada',
  'UNDER_FORMAL_REVIEW': 'Em Análise Formal',
  'PENDING_CORRECTIONS': 'Aguardando Correções',
  'REJECTED_PRELIMINARY': 'Rejeitada Preliminarmente',
  'COMMITTEE_ASSIGNED': 'Distribuída para Comissão',
  'IN_COMMITTEE_REVIEW': 'Em Análise na Comissão',
  'UNDER_RAPPORTEUR_ANALYSIS': 'Com Relator',
  'AMENDMENT_PERIOD_OPEN': 'Período de Emendas Aberto',
  'AMENDMENT_PERIOD_CLOSED': 'Período de Emendas Fechado',
  'COMMITTEE_DISCUSSION': 'Em Discussão na Comissão',
  'COMMITTEE_VOTING': 'Em Votação na Comissão',
  'COMMITTEE_APPROVED': 'Aprovada na Comissão',
  'COMMITTEE_REJECTED': 'Rejeitada na Comissão',
  'READY_FOR_PLENARY': 'Pronta para Plenário',
  'IN_PLENARY_DISCUSSION': 'Em Discussão no Plenário',
  'IN_VOTING': 'Em Votação',
  'APPROVED_PLENARY': 'Aprovada no Plenário',
  'REJECTED_PLENARY': 'Rejeitada no Plenário',
  'IN_REVIEWING_HOUSE': 'Na Casa Revisora',
  'SENT_TO_EXECUTIVE': 'Enviada ao Executivo',
  'UNDER_EXECUTIVE_REVIEW': 'Em Análise no Executivo',
  'SANCTIONED': 'Sancionada',
  'PARTIALLY_VETOED': 'Parcialmente Vetada',
  'TOTALLY_VETOED': 'Totalmente Vetada',
  'PROMULGATED': 'Promulgada',
  'PUBLISHED_ACTIVE': 'Publicada e Ativa'
}

/**
 * Cores para estados (baseadas no template)
 */
export const ESTADO_CORES: Record<EstadoTramitacao, string> = {
  'DRAFT_INITIATED': 'primary',
  'UNDER_FORMAL_REVIEW': 'warning',
  'PENDING_CORRECTIONS': 'warning',
  'REJECTED_PRELIMINARY': 'danger',
  'COMMITTEE_ASSIGNED': 'info',
  'IN_COMMITTEE_REVIEW': 'info',
  'UNDER_RAPPORTEUR_ANALYSIS': 'warning',
  'AMENDMENT_PERIOD_OPEN': 'success',
  'AMENDMENT_PERIOD_CLOSED': 'warning',
  'COMMITTEE_DISCUSSION': 'info',
  'COMMITTEE_VOTING': 'warning',
  'COMMITTEE_APPROVED': 'success',
  'COMMITTEE_REJECTED': 'danger',
  'READY_FOR_PLENARY': 'success',
  'IN_PLENARY_DISCUSSION': 'info',
  'IN_VOTING': 'warning',
  'APPROVED_PLENARY': 'success',
  'REJECTED_PLENARY': 'danger',
  'IN_REVIEWING_HOUSE': 'info',
  'SENT_TO_EXECUTIVE': 'info',
  'UNDER_EXECUTIVE_REVIEW': 'warning',
  'SANCTIONED': 'success',
  'PARTIALLY_VETOED': 'warning',
  'TOTALLY_VETOED': 'danger',
  'PROMULGATED': 'success',
  'PUBLISHED_ACTIVE': 'success'
} 