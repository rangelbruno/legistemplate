import { prisma } from './database'
import { LocalProposicaoService } from './services/local/local-proposicao.service'
import type { DataLayer } from './services/data-service.interface'

// Future: External services will be implemented here
// import { ExternalProposicaoService } from './services/external/external-proposicao.service'

function createDataLayer(): DataLayer {
  const useExternalAPI = process.env.USE_EXTERNAL_API === 'true'
  
  if (useExternalAPI) {
    // TODO: Implement external services
    throw new Error('External API services not yet implemented')
  }
  
  // Development with SQLite
  return {
    proposicoes: new LocalProposicaoService(prisma),
    parlamentares: {} as any, // TODO: Implement LocalParlamentarService
    tramitacao: {} as any     // TODO: Implement LocalTramitacaoService
  }
}

export const dataLayer = createDataLayer()

// Health check function
export async function checkDataLayerHealth() {
  try {
    const useExternal = process.env.USE_EXTERNAL_API === 'true'
    return {
      status: 'healthy',
      provider: useExternal ? 'external-api' : 'sqlite',
      timestamp: new Date().toISOString()
    }
  } catch (error) {
    return {
      status: 'error',
      provider: 'unknown',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }
  }
} 