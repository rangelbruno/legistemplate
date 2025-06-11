// Tipos do Sistema de Tramitação Parlamentar - Sprint 1

/**
 * Estados Principais do Sistema de Tramitação
 * Baseado no fluxo completo mapeado em docs/memory-bank/fluxos-tramitacao.md
 */
export type EstadoTramitacao = 
  // FASE 1: Criação e Recepção
  | 'DRAFT_INITIATED'              // Minuta criada
  | 'UNDER_FORMAL_REVIEW'          // Em análise formal
  | 'PENDING_CORRECTIONS'          // Aguardando correções
  | 'REJECTED_PRELIMINARY'         // Rejeitada preliminarmente
  
  // FASE 2: Comissões
  | 'COMMITTEE_ASSIGNED'           // Distribuída para comissão
  | 'IN_COMMITTEE_REVIEW'          // Em análise na comissão
  | 'UNDER_RAPPORTEUR_ANALYSIS'    // Com relator
  | 'AMENDMENT_PERIOD_OPEN'        // Período de emendas aberto
  | 'AMENDMENT_PERIOD_CLOSED'      // Período de emendas fechado
  | 'COMMITTEE_DISCUSSION'         // Em discussão na comissão
  | 'COMMITTEE_VOTING'             // Em votação na comissão
  | 'COMMITTEE_APPROVED'           // Aprovada na comissão
  | 'COMMITTEE_REJECTED'           // Rejeitada na comissão
  | 'READY_FOR_PLENARY'           // Pronta para plenário
  
  // FASE 3: Plenário
  | 'IN_PLENARY_DISCUSSION'        // Em discussão no plenário
  | 'IN_VOTING'                    // Em votação
  | 'APPROVED_PLENARY'             // Aprovada no plenário
  | 'REJECTED_PLENARY'             // Rejeitada no plenário
  
  // FASE 4: Casa Revisora
  | 'IN_REVIEWING_HOUSE'           // Na casa revisora
  
  // FASE 5: Executivo
  | 'SENT_TO_EXECUTIVE'            // Enviada ao executivo
  | 'UNDER_EXECUTIVE_REVIEW'       // Em análise no executivo
  | 'SANCTIONED'                   // Sancionada
  | 'PARTIALLY_VETOED'             // Parcialmente vetada
  | 'TOTALLY_VETOED'               // Totalmente vetada
  
  // FASE 6: Finalização
  | 'PROMULGATED'                  // Promulgada
  | 'PUBLISHED_ACTIVE'             // Publicada e ativa

/**
 * Tipos de Proposição
 */
export type TipoProposicao = 
  | 'PL'     // Projeto de Lei
  | 'PLP'    // Projeto de Lei Complementar
  | 'PEC'    // Proposta de Emenda Constitucional
  | 'PDC'    // Projeto de Decreto Legislativo
  | 'PRC'    // Projeto de Resolução
  | 'MSC'    // Medida Provisória
  | 'PLV'    // Projeto de Lei de Conversão

/**
 * Comissões do Sistema
 */
export type TipoComissao = 
  | 'CCJ'     // Constituição e Justiça
  | 'CDHM'    // Direitos Humanos
  | 'CFT'     // Finanças e Tributação
  | 'CEDU'    // Educação
  | 'CSAUDE'  // Saúde
  | 'CMEIO'   // Meio Ambiente
  | 'CTASP'   // Trabalho, Administração e Serviço Público
  | 'CAPADR'  // Agricultura, Pecuária, Abastecimento e Desenvolvimento Rural

/**
 * Ações possíveis por estado
 */
export type AcaoTramitacao = 
  | 'ENVIAR_PARA_REVISAO'
  | 'APROVAR'
  | 'REJEITAR'
  | 'SOLICITAR_CORRECOES'
  | 'DISTRIBUIR_COMISSAO'
  | 'DESIGNAR_RELATOR'
  | 'ABRIR_EMENDAS'
  | 'FECHAR_EMENDAS'
  | 'AGENDAR_DISCUSSAO'
  | 'VOTAR'
  | 'ENVIAR_PLENARIO'
  | 'ENVIAR_CASA_REVISORA'
  | 'ENVIAR_EXECUTIVO'
  | 'SANCIONAR'
  | 'VETAR'
  | 'PROMULGAR'
  | 'PUBLICAR'

/**
 * Transição de Estado
 */
export interface TransicaoEstado {
  de: EstadoTramitacao
  para: EstadoTramitacao
  acao: AcaoTramitacao
  condicoes?: string[]
  responsavel: 'PARLAMENTAR' | 'COMISSAO' | 'MESA' | 'EXECUTIVO' | 'SISTEMA'
  automatica: boolean
  tempoLimite?: number // em dias
}

/**
 * Proposição Base
 */
export interface Proposicao {
  id: string
  numero: string
  ano: number
  tipo: TipoProposicao
  ementa: string
  explicacao?: string
  autor: {
    id: string
    nome: string
    partido: string
    uf: string
  }
  estadoAtual: EstadoTramitacao
  dataApresentacao: Date
  dataUltimaAtualizacao: Date
  urgencia: 'NORMAL' | 'URGENTE' | 'URGENTISSIMA'
  comissoes: TipoComissao[]
  relator?: {
    id: string
    nome: string
    comissao: TipoComissao
  }
  prazo?: Date
  proximaAcao?: AcaoTramitacao
}

/**
 * Histórico de Tramitação
 */
export interface HistoricoTramitacao {
  id: string
  proposicaoId: string
  estadoAnterior?: EstadoTramitacao
  estadoNovo: EstadoTramitacao
  acao: AcaoTramitacao
  data: Date
  responsavel: {
    id: string
    nome: string
    tipo: 'PARLAMENTAR' | 'FUNCIONARIO' | 'SISTEMA'
  }
  observacoes?: string
  documentos?: string[]
}

/**
 * Emenda
 */
export interface Emenda {
  id: string
  proposicaoId: string
  numero: number
  tipo: 'SUPRESSIVA' | 'SUBSTITUTIVA' | 'ADITIVA' | 'MODIFICATIVA' | 'AGLUTINATIVA'
  autor: {
    id: string
    nome: string
    partido: string
  }
  texto: string
  justificativa: string
  dataApresentacao: Date
  situacao: 'APRESENTADA' | 'APROVADA' | 'REJEITADA' | 'PREJUDICADA'
}

/**
 * Configuração de Workflow
 */
export interface WorkflowConfig {
  estadosValidos: EstadoTramitacao[]
  transicoesPermitidas: TransicaoEstado[]
  acoesDisponiveis: Record<EstadoTramitacao, AcaoTramitacao[]>
  notificacoes: Record<EstadoTramitacao, string[]>
  prazos: Record<EstadoTramitacao, number>
}

/**
 * Métricas de Performance
 */
export interface MetricasTramitacao {
  proposicaoId: string
  tempoTotalTramitacao: number // em dias
  tempoMedioComissao: number
  tempoPlenario: number
  numeroEmendas: number
  numeroRejeicoesComissao: number
  numeroRejeicoesJuridica: number
  score: number // 0-100 eficiência
}

/**
 * Dashboard Data
 */
export interface DashboardData {
  totalProposicoes: number
  proposicoesPorEstado: Record<EstadoTramitacao, number>
  proposicoesPorTipo: Record<TipoProposicao, number>
  tempoMedioTramitacao: number
  proposicoesUrgentes: number
  proposicoesVencidas: number
  comissoesComMaisTrabalho: Array<{
    comissao: TipoComissao
    quantidade: number
  }>
  parlamentaresMaisAtivos: Array<{
    id: string
    nome: string
    proposicoes: number
    emendas: number
  }>
  timelineTramitacao: Array<{
    data: Date
    quantidade: number
    estado: EstadoTramitacao
  }>
} 