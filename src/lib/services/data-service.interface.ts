import type { 
  QueryParams, 
  CreateInput, 
  UpdateInput,
  ProposicaoWithDetails,
  ParlamentarWithDetails 
} from '../types'

// Generic data service interface
export interface DataService<T> {
  findMany(params?: QueryParams): Promise<T[]>
  findById(id: string): Promise<T | null>
  create(data: CreateInput<T>): Promise<T>
  update(id: string, data: UpdateInput<T>): Promise<T>
  delete(id: string): Promise<void>
  count(filters?: Record<string, any>): Promise<number>
}

// Specific service interfaces
export interface ProposicaoService extends DataService<ProposicaoWithDetails> {
  findByAutor(autorId: string, params?: QueryParams): Promise<ProposicaoWithDetails[]>
  findByEstado(estado: string, params?: QueryParams): Promise<ProposicaoWithDetails[]>
  findByTipo(tipo: string, params?: QueryParams): Promise<ProposicaoWithDetails[]>
  search(query: string, params?: QueryParams): Promise<ProposicaoWithDetails[]>
}

export interface ParlamentarService extends DataService<ParlamentarWithDetails> {
  findByPartido(partido: string, params?: QueryParams): Promise<ParlamentarWithDetails[]>
  findByUF(uf: string, params?: QueryParams): Promise<ParlamentarWithDetails[]>
  findAtivos(params?: QueryParams): Promise<ParlamentarWithDetails[]>
  search(query: string, params?: QueryParams): Promise<ParlamentarWithDetails[]>
}

export interface TramitacaoService {
  findByProposicao(proposicaoId: string): Promise<any[]>
  criarEvento(proposicaoId: string, evento: any): Promise<any>
  validarTransicao(proposicaoId: string, novoEstado: string): Promise<boolean>
  obterProximosEstados(estadoAtual: string): Promise<string[]>
}

// Main data layer interface
export interface DataLayer {
  proposicoes: ProposicaoService
  parlamentares: ParlamentarService
  tramitacao: TramitacaoService
} 