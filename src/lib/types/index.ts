// Import and re-export Prisma types
import type {
  User,
  Parlamentar,
  Proposicao,
  TramitacaoEvento,
  Comissao,
  Relatoria,
  Votacao,
  Voto,
  Emenda,
  Presenca,
  Admin,
  Role,
  AdminLevel,
  TipoProposicao,
  EstadoTramitacao,
  TipoComissao,
  StatusRelatoria,
  TipoVotacao,
  ResultadoVotacao,
  TipoVoto,
  TipoEmenda,
  StatusEmenda,
  TipoSessao
} from '@prisma/client'

export type {
  User,
  Parlamentar,
  Proposicao,
  TramitacaoEvento,
  Comissao,
  Relatoria,
  Votacao,
  Voto,
  Emenda,
  Presenca,
  Admin,
  Role,
  AdminLevel,
  TipoProposicao,
  EstadoTramitacao,
  TipoComissao,
  StatusRelatoria,
  TipoVotacao,
  ResultadoVotacao,
  TipoVoto,
  TipoEmenda,
  StatusEmenda,
  TipoSessao
}

// Query parameters for API calls
export interface QueryParams {
  page?: number
  limit?: number
  filters?: Record<string, any>
  sort?: string
  order?: 'asc' | 'desc'
}

// API Response wrapper
export interface ApiResponse<T> {
  data: T
  pagination?: {
    page: number
    limit: number
    total: number
    pages: number
  }
  meta?: Record<string, any>
}

// Create/Update input types
export type CreateInput<T> = Omit<T, 'id' | 'createdAt' | 'updatedAt'>
export type UpdateInput<T> = Partial<CreateInput<T>>

// Proposicao with includes
export interface ProposicaoWithDetails extends Proposicao {
  autor: Parlamentar & { user: User }
  tramitacoes: TramitacaoEvento[]
  relatorias?: (Relatoria & { parlamentar: Parlamentar })[]
  emendas?: Emenda[]
}

// Parlamentar with includes  
export interface ParlamentarWithDetails extends Parlamentar {
  user: User
  proposicoes?: Proposicao[]
  relatorias?: Relatoria[]
  presencas?: Presenca[]
}

// Error types
export interface ApiError {
  code: string
  message: string
  details?: any
}

// Authentication types
export interface AuthUser {
  id: string
  email: string
  name: string
  role: Role
  parlamentar?: Parlamentar
  admin?: Admin
}

// Dashboard KPIs
export interface DashboardKPIs {
  totalProposicoes: number
  proposicoesEmTramitacao: number
  proposicoesAprovadas: number
  proposicoesRejeitadas: number
  totalParlamentares: number
  parlamentaresAtivos: number
  sessoesMes: number
  presencaMedia: number
}

// Filtros para busca
export interface ProposicaoFilters {
  tipo?: TipoProposicao[]
  estado?: EstadoTramitacao[]
  autor?: string
  comissao?: string
  ano?: number
  dataInicio?: Date
  dataFim?: Date
  search?: string
}

export interface ParlamentarFilters {
  partido?: string[]
  uf?: string[]
  ativo?: boolean
  search?: string
}

// Tramitação workflow
export interface TramitacaoAction {
  estadoNovo: EstadoTramitacao
  comissaoId?: string
  responsavelId?: string
  observacoes?: string
  anexos?: string[]
}

export interface WorkflowTransition {
  from: EstadoTramitacao
  to: EstadoTramitacao
  conditions?: string[]
  requiredRole?: Role[]
  description: string
} 