// Widgets específicos para sistema parlamentar
export * from './ParliamentaryWidget'
export * from './PropositionsTable'

// Tipos úteis para o sistema
export type PropositionStatus = 'Em Tramitação' | 'Aprovada' | 'Rejeitada' | 'Arquivada' | 'Pendente'
export type PropositionType = 'PL' | 'REQ' | 'IND' | 'MOC'

export interface Proposition {
  id: string
  number: string
  year: number
  type: PropositionType
  title: string
  author: string
  status: PropositionStatus
  createdAt: string
  lastUpdate: string
}

export interface DashboardStats {
  totalUsers: number
  activePropositions: number
  monthlySessions: number
  userGrowth: number
  propositionGrowth: number
} 