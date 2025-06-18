/**
 * Service para Estrutura Parlamentar
 * Gerencia dados da composição da câmara, vereadores e mesa diretora
 */

export interface ParlamentarInfo {
  id: string
  nome: string
  partido: {
    sigla: string
    nome: string
    numero: number
    logo?: string
  }
  cargo: string
  presidenteCamara: boolean
  telefone?: string
  endereco?: string
  profissao?: string
  biografia?: string
  foto?: string
  mandatoInicio: string
  mandatoFim?: string
}

export interface MesaDiretora {
  id: string
  presidente: ParlamentarInfo
  vicePrimeiro?: ParlamentarInfo
  viceSegundo?: ParlamentarInfo
  primeiroSecretario?: ParlamentarInfo
  segundoSecretario?: ParlamentarInfo
  terceiroSecretario?: ParlamentarInfo
  quartoSecretario?: ParlamentarInfo
  dataPosse: string
  mandatoInicio: string
  mandatoFim: string
}

export interface Comissao {
  id: string
  nome: string
  tipo: 'PERMANENTE' | 'TEMPORARIA' | 'ESPECIAL' | 'CPI'
  descricao: string
  presidente: ParlamentarInfo
  vicePressidente?: ParlamentarInfo
  relator?: ParlamentarInfo
  membros: ParlamentarInfo[]
  dataConstituicao: string
  status: 'ATIVA' | 'INATIVA' | 'SUSPENSA'
  mandatoInicio?: string
  mandatoFim?: string
  finalidade?: string
}

export interface EstruturaParlamentar {
  totalVereadores: number
  totalPartidos: number
  presidente: ParlamentarInfo | null
  vereadores: ParlamentarInfo[]
  legislaturaAtual: string
  mesaDiretora?: MesaDiretora
  comissoes: Comissao[]
  totalComissoes: number
}

/**
 * Mock de dados da estrutura parlamentar
 * Em produção, estes dados viriam de uma API ou banco de dados
 */
const MOCK_VEREADORES: ParlamentarInfo[] = [
  {
    id: 'vereador-001',
    nome: 'João Silva Santos',
    partido: {
      sigla: 'PT',
      nome: 'Partido dos Trabalhadores',
      numero: 13
    },
    cargo: 'VEREADOR',
    presidenteCamara: true,
    telefone: '(11) 99999-1111',
    profissao: 'Advogado',
    biografia: 'Advogado especializado em direito municipal, com 15 anos de experiência em gestão pública. Atua há 8 anos como vereador, focando em projetos de educação e saúde.',
    mandatoInicio: '2021-01-01',
    mandatoFim: '2024-12-31'
  },
  {
    id: 'vereador-002',
    nome: 'Maria Oliveira Costa',
    partido: {
      sigla: 'PSDB',
      nome: 'Partido da Social Democracia Brasileira',
      numero: 45
    },
    cargo: 'VEREADOR',
    presidenteCamara: false,
    telefone: '(11) 99999-2222',
    profissao: 'Professora',
    biografia: 'Educadora há 20 anos, especialista em políticas públicas educacionais. Dedica seu mandato às causas da educação infantil e inclusão social.',
    mandatoInicio: '2021-01-01',
    mandatoFim: '2024-12-31'
  },
  {
    id: 'vereador-003',
    nome: 'Carlos Eduardo Mendes',
    partido: {
      sigla: 'MDB',
      nome: 'Movimento Democrático Brasileiro',
      numero: 15
    },
    cargo: 'VEREADOR',
    presidenteCamara: false,
    telefone: '(11) 99999-3333',
    profissao: 'Empresário',
    biografia: 'Empresário do setor de construção civil, focado no desenvolvimento urbano sustentável e geração de empregos no município.',
    mandatoInicio: '2021-01-01',
    mandatoFim: '2024-12-31'
  },
  {
    id: 'vereador-004',
    nome: 'Ana Paula Rodrigues',
    partido: {
      sigla: 'PSOL',
      nome: 'Partido Socialismo e Liberdade',
      numero: 50
    },
    cargo: 'VEREADOR',
    presidenteCamara: false,
    telefone: '(11) 99999-4444',
    profissao: 'Assistente Social',
    biografia: 'Assistente social com atuação em movimentos populares. Trabalha por políticas de habitação e direitos das mulheres.',
    mandatoInicio: '2021-01-01',
    mandatoFim: '2024-12-31'
  },
  {
    id: 'vereador-005',
    nome: 'Roberto Lima Ferreira',
    partido: {
      sigla: 'PP',
      nome: 'Progressistas',
      numero: 11
    },
    cargo: 'VEREADOR',
    presidenteCamara: false,
    telefone: '(11) 99999-5555',
    profissao: 'Médico',
    biografia: 'Médico especialista em saúde pública, com foco em políticas de prevenção e melhoria do sistema de saúde municipal.',
    mandatoInicio: '2021-01-01',
    mandatoFim: '2024-12-31'
  },
  {
    id: 'vereador-006',
    nome: 'Sandra Regina Alves',
    partido: {
      sigla: 'PDT',
      nome: 'Partido Democrático Trabalhista',
      numero: 12
    },
    cargo: 'VEREADOR',
    presidenteCamara: false,
    telefone: '(11) 99999-6666',
    profissao: 'Enfermeira',
    biografia: 'Enfermeira com 18 anos de experiência em hospitais públicos. Luta por melhorias na saúde pública e valorização dos profissionais de enfermagem.',
    mandatoInicio: '2021-01-01',
    mandatoFim: '2024-12-31'
  },
  {
    id: 'vereador-007',
    nome: 'José Carlos Pereira',
    partido: {
      sigla: 'PL',
      nome: 'Partido Liberal',
      numero: 22
    },
    cargo: 'VEREADOR',
    presidenteCamara: false,
    telefone: '(11) 99999-7777',
    profissao: 'Comerciante',
    biografia: 'Comerciante há 25 anos, representa os interesses dos pequenos empresários e trabalha pelo desenvolvimento do comércio local.',
    mandatoInicio: '2021-01-01',
    mandatoFim: '2024-12-31'
  },
  {
    id: 'vereador-008',
    nome: 'Luiza Fernandes Silva',
    partido: {
      sigla: 'REDE',
      nome: 'Rede Sustentabilidade',
      numero: 18
    },
    cargo: 'VEREADOR',
    presidenteCamara: false,
    telefone: '(11) 99999-8888',
    profissao: 'Ambientalista',
    biografia: 'Bióloga e ativista ambiental, dedica seu mandato às causas ecológicas e desenvolvimento sustentável do município.',
    mandatoInicio: '2021-01-01',
    mandatoFim: '2024-12-31'
  },
  {
    id: 'vereador-009',
    nome: 'Fernando Barbosa',
    partido: {
      sigla: 'PODE',
      nome: 'Podemos',
      numero: 19
    },
    cargo: 'VEREADOR',
    presidenteCamara: false,
    telefone: '(11) 99999-9999',
    profissao: 'Engenheiro',
    biografia: 'Engenheiro civil especializado em infraestrutura urbana. Trabalha por melhorias no saneamento e mobilidade urbana.',
    mandatoInicio: '2021-01-01',
    mandatoFim: '2024-12-31'
  }
]

/**
 * Dados mock da Mesa Diretora
 */
let MOCK_MESA_DIRETORA: MesaDiretora = {
  id: 'mesa-diretora-2021-2024',
  presidente: MOCK_VEREADORES[0], // João Silva Santos
  vicePrimeiro: MOCK_VEREADORES[1], // Maria Oliveira Costa
  viceSegundo: MOCK_VEREADORES[2], // Carlos Eduardo Mendes
  primeiroSecretario: MOCK_VEREADORES[3], // Ana Paula Rodrigues
  segundoSecretario: MOCK_VEREADORES[4], // Roberto Lima Ferreira
  terceiroSecretario: MOCK_VEREADORES[5], // Sandra Regina Alves
  quartoSecretario: MOCK_VEREADORES[6], // José Carlos Pereira
  dataPosse: '2021-01-01',
  mandatoInicio: '2021-01-01',
  mandatoFim: '2024-12-31'
}

/**
 * Dados mock das Comissões
 */
let MOCK_COMISSOES: Comissao[] = [
  {
    id: 'comissao-educacao',
    nome: 'Comissão de Educação, Cultura e Esporte',
    tipo: 'PERMANENTE',
    descricao: 'Responsável por analisar projetos relacionados à educação, cultura e esporte do município',
    presidente: MOCK_VEREADORES[1], // Maria Oliveira Costa (Professora)
    vicePressidente: MOCK_VEREADORES[7], // Luiza Fernandes Silva
    relator: MOCK_VEREADORES[3], // Ana Paula Rodrigues
    membros: [MOCK_VEREADORES[1], MOCK_VEREADORES[7], MOCK_VEREADORES[3]],
    dataConstituicao: '2021-02-01',
    status: 'ATIVA',
    mandatoInicio: '2021-02-01',
    mandatoFim: '2024-12-31',
    finalidade: 'Análise de projetos educacionais e culturais'
  },
  {
    id: 'comissao-saude',
    nome: 'Comissão de Saúde e Assistência Social',
    tipo: 'PERMANENTE',
    descricao: 'Analisa projetos relacionados à saúde pública e assistência social',
    presidente: MOCK_VEREADORES[4], // Roberto Lima Ferreira (Médico)
    vicePressidente: MOCK_VEREADORES[5], // Sandra Regina Alves (Enfermeira)
    relator: MOCK_VEREADORES[3], // Ana Paula Rodrigues (Assistente Social)
    membros: [MOCK_VEREADORES[4], MOCK_VEREADORES[5], MOCK_VEREADORES[3]],
    dataConstituicao: '2021-02-01',
    status: 'ATIVA',
    mandatoInicio: '2021-02-01',
    mandatoFim: '2024-12-31',
    finalidade: 'Análise de projetos de saúde pública'
  },
  {
    id: 'comissao-infraestrutura',
    nome: 'Comissão de Infraestrutura e Desenvolvimento Urbano',
    tipo: 'PERMANENTE',
    descricao: 'Responsável por projetos de infraestrutura, obras públicas e desenvolvimento urbano',
    presidente: MOCK_VEREADORES[8], // Fernando Barbosa (Engenheiro)
    vicePressidente: MOCK_VEREADORES[2], // Carlos Eduardo Mendes (Empresário)
    relator: MOCK_VEREADORES[6], // José Carlos Pereira
    membros: [MOCK_VEREADORES[8], MOCK_VEREADORES[2], MOCK_VEREADORES[6]],
    dataConstituicao: '2021-02-01',
    status: 'ATIVA',
    mandatoInicio: '2021-02-01',
    mandatoFim: '2024-12-31',
    finalidade: 'Análise de projetos de infraestrutura urbana'
  },
  {
    id: 'comissao-meio-ambiente',
    nome: 'Comissão de Meio Ambiente e Sustentabilidade',
    tipo: 'PERMANENTE',
    descricao: 'Analisa projetos relacionados ao meio ambiente e sustentabilidade',
    presidente: MOCK_VEREADORES[7], // Luiza Fernandes Silva (Ambientalista)
    vicePressidente: MOCK_VEREADORES[8], // Fernando Barbosa
    relator: MOCK_VEREADORES[1], // Maria Oliveira Costa
    membros: [MOCK_VEREADORES[7], MOCK_VEREADORES[8], MOCK_VEREADORES[1]],
    dataConstituicao: '2021-02-01',
    status: 'ATIVA',
    mandatoInicio: '2021-02-01',
    mandatoFim: '2024-12-31',
    finalidade: 'Análise de projetos ambientais'
  },
  {
    id: 'cpi-transporte',
    nome: 'CPI do Transporte Público',
    tipo: 'CPI',
    descricao: 'Comissão Parlamentar de Inquérito para investigar irregularidades no transporte público',
    presidente: MOCK_VEREADORES[0], // João Silva Santos
    vicePressidente: MOCK_VEREADORES[2], // Carlos Eduardo Mendes  
    relator: MOCK_VEREADORES[4], // Roberto Lima Ferreira
    membros: [MOCK_VEREADORES[0], MOCK_VEREADORES[2], MOCK_VEREADORES[4], MOCK_VEREADORES[6], MOCK_VEREADORES[8]],
    dataConstituicao: '2023-06-15',
    status: 'ATIVA',
    mandatoInicio: '2023-06-15',
    mandatoFim: '2024-06-15',
    finalidade: 'Investigar irregularidades no sistema de transporte público municipal'
  }
]

/**
 * Simula delay de API para demonstração
 */
const simulateApiDelay = (ms: number = 500): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, ms)
  })
}

/**
 * Busca a estrutura parlamentar completa
 */
export const buscarEstruturaParlamentar = async (): Promise<EstruturaParlamentar> => {
  try {
    // Simular delay de API
    await simulateApiDelay(200)

    // Encontrar presidente
    const presidente = MOCK_VEREADORES.find(v => v.presidenteCamara) || null

    // Contar partidos únicos
    const partidosUnicos = new Set(MOCK_VEREADORES.map(v => v.partido.sigla))

      const estrutura: EstruturaParlamentar = {
    totalVereadores: MOCK_VEREADORES.length,
    totalPartidos: partidosUnicos.size,
    presidente,
    vereadores: MOCK_VEREADORES,
    legislaturaAtual: '2021-2024',
    mesaDiretora: MOCK_MESA_DIRETORA,
    comissoes: MOCK_COMISSOES,
    totalComissoes: MOCK_COMISSOES.length
  }

    return estrutura
  } catch (error) {
    console.error('Erro no service buscarEstruturaParlamentar:', error)
    throw new Error('Falha ao carregar estrutura parlamentar')
  }
}

/**
 * Busca vereadores por partido
 */
export const buscarVereadoresPorPartido = async (partidoSigla: string): Promise<ParlamentarInfo[]> => {
  try {
    await simulateApiDelay(300)
    
    if (partidoSigla === 'TODOS') {
      return MOCK_VEREADORES
    }

    return MOCK_VEREADORES.filter(v => v.partido.sigla === partidoSigla)
  } catch (error) {
    console.error('Erro no service buscarVereadoresPorPartido:', error)
    throw new Error('Falha ao filtrar vereadores por partido')
  }
}

/**
 * Busca um vereador específico por ID
 */
export const buscarVereadorPorId = async (id: string): Promise<ParlamentarInfo | null> => {
  try {
    await simulateApiDelay(300)
    
    return MOCK_VEREADORES.find(v => v.id === id) || null
  } catch (error) {
    console.error('Erro no service buscarVereadorPorId:', error)
    throw new Error('Falha ao buscar vereador')
  }
}

/**
 * Obter lista de partidos representados
 */
export const obterPartidosRepresentados = (): string[] => {
  const partidos = Array.from(new Set(MOCK_VEREADORES.map(v => v.partido.sigla)))
  return partidos.sort()
}

/**
 * Buscar dados da Mesa Diretora
 */
export const buscarMesaDiretora = async (): Promise<MesaDiretora | null> => {
  try {
    await simulateApiDelay(300)
    return MOCK_MESA_DIRETORA
  } catch (error) {
    console.error('Erro no service buscarMesaDiretora:', error)
    throw new Error('Falha ao buscar Mesa Diretora')
  }
}

/**
 * Buscar todas as comissões
 */
export const buscarComissoes = async (): Promise<Comissao[]> => {
  try {
    await simulateApiDelay(400)
    return MOCK_COMISSOES
  } catch (error) {
    console.error('Erro no service buscarComissoes:', error)
    throw new Error('Falha ao buscar comissões')
  }
}

/**
 * Buscar comissões por tipo
 */
export const buscarComissoesPorTipo = async (tipo: Comissao['tipo']): Promise<Comissao[]> => {
  try {
    await simulateApiDelay(300)
    return MOCK_COMISSOES.filter(c => c.tipo === tipo)
  } catch (error) {
    console.error('Erro no service buscarComissoesPorTipo:', error)
    throw new Error('Falha ao filtrar comissões por tipo')
  }
}

/**
 * Buscar comissão por ID
 */
export const buscarComissaoPorId = async (id: string): Promise<Comissao | null> => {
  try {
    await simulateApiDelay(200)
    return MOCK_COMISSOES.find(c => c.id === id) || null
  } catch (error) {
    console.error('Erro no service buscarComissaoPorId:', error)
    throw new Error('Falha ao buscar comissão')
  }
}

/**
 * Salvar Mesa Diretora
 */
export const salvarMesaDiretora = async (dados: Omit<MesaDiretora, 'id'>): Promise<MesaDiretora> => {
  try {
    await simulateApiDelay(800)
    
    // Simular salvamento - em uma aplicação real, seria uma chamada à API
    const novaMesaDiretora: MesaDiretora = {
      id: 'mesa-diretora-1',
      ...dados
    }
    
    // Atualizar dados mock (simular persistência)
    MOCK_MESA_DIRETORA = novaMesaDiretora
    
    return novaMesaDiretora
  } catch (error) {
    console.error('Erro no service salvarMesaDiretora:', error)
    throw new Error('Falha ao salvar Mesa Diretora')
  }
}

/**
 * Salvar Comissão (criar ou editar)
 */
export const salvarComissao = async (
  comissao: Omit<Comissao, 'id'>, 
  comissaoId?: string
): Promise<Comissao> => {
  try {
    await simulateApiDelay(800)
    
    const novaComissao: Comissao = {
      id: comissaoId || `comissao-${Date.now()}`,
      ...comissao
    }
    
    if (comissaoId) {
      // Editar comissão existente
      const index = MOCK_COMISSOES.findIndex(c => c.id === comissaoId)
      if (index !== -1) {
        MOCK_COMISSOES[index] = novaComissao
      } else {
        throw new Error('Comissão não encontrada')
      }
    } else {
      // Criar nova comissão
      MOCK_COMISSOES.push(novaComissao)
    }
    
    return novaComissao
  } catch (error) {
    console.error('Erro no service salvarComissao:', error)
    throw new Error('Falha ao salvar comissão')
  }
}

/**
 * Excluir Comissão
 */
export const excluirComissao = async (comissaoId: string): Promise<void> => {
  try {
    await simulateApiDelay(400)
    
    const index = MOCK_COMISSOES.findIndex(c => c.id === comissaoId)
    if (index !== -1) {
      MOCK_COMISSOES.splice(index, 1)
    } else {
      throw new Error('Comissão não encontrada')
    }
  } catch (error) {
    console.error('Erro no service excluirComissao:', error)
    throw new Error('Falha ao excluir comissão')
  }
} 