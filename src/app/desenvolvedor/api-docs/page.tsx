'use client'

import React, { useState } from 'react'
import { PageTitle } from '../../../_metronic/layout/core'

interface CodeExampleProps {
  title: string
  code: string
  language?: string
}

interface FaqItem {
  id: string
  question: string
  answer: string
  example?: {
    title: string
    code: string
    language?: string
  }
}

const CodeExample: React.FC<CodeExampleProps> = ({ title, code, language = 'json' }) => (
  <div className="bg-light-dark rounded p-4 mt-3">
    <h6 className="text-dark fw-bold mb-3">{title}</h6>
    <pre className="bg-dark text-light p-3 rounded overflow-auto" style={{ fontSize: '0.875rem' }}>
      <code className={`language-${language}`}>{code}</code>
    </pre>
  </div>
)

/**
 * Página de Documentação da API - Sistema de Tramitação Parlamentar
 * 
 * Documentação completa da API REST do sistema
 * Implementa FAQ interativo com seções organizadas
 */
export default function ApiDocsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [activeCategory, setActiveCategory] = useState('autenticacao')
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set(['auth_1'])) // Primeiro item expandido por padrão

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev)
      if (newSet.has(itemId)) {
        newSet.delete(itemId)
      } else {
        newSet.add(itemId)
      }
      return newSet
    })
  }

  // Limpa itens expandidos quando muda de categoria
  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId)
    setExpandedItems(new Set()) // Limpa todos os itens expandidos
  }

  const categorias = [
    { id: 'autenticacao', label: 'Autenticação', icon: 'bi-shield-lock' },
    { id: 'proposicoes', label: 'Proposições', icon: 'bi-files' },
    { id: 'tramitacao', label: 'Tramitação', icon: 'bi-arrow-repeat' },
    { id: 'usuarios', label: 'Usuários', icon: 'bi-people' },
    { id: 'relatorios', label: 'Relatórios', icon: 'bi-graph-up' },
    { id: 'webhooks', label: 'Webhooks', icon: 'bi-broadcast' }
  ]

  const faqSections = [
    {
      id: 'autenticacao',
      title: 'Autenticação',
      items: [
        {
          id: 'auth_1',
          question: 'Como funciona a autenticação da API?',
          answer: 'A API utiliza JWT (JSON Web Tokens) para autenticação. Você deve incluir o token no header Authorization: Bearer {token} em todas as requisições autenticadas.'
        },
        {
          id: 'auth_2',
          question: 'Como obter um token de acesso?',
          answer: 'Faça uma requisição POST para /api/auth/login com suas credenciais (email e senha). O token será retornado no campo "accessToken" da resposta.',
          example: {
            title: 'Exemplo de Login',
            code: `// POST /api/auth/login
{
  "email": "string",
  "password": "string"
}

// Resposta
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tokenType": "Bearer",
  "expiresIn": 86400,
  "user": {
    "id": 1,
    "nome": "João Silva",
    "email": "usuario@exemplo.com",
    "role": "DESENVOLVEDOR"
  }
}`
          }
        },
        {
          id: 'auth_3',
          question: 'Qual é a validade do token?',
          answer: 'Os tokens JWT têm validade de 24 horas. Após esse período, você deve renovar o token fazendo uma nova requisição de login.'
        },
        {
          id: 'auth_4',
          question: 'Como renovar um token expirado?',
          answer: 'Quando receber uma resposta 401 (Unauthorized), faça uma nova requisição de login para obter um novo token válido.'
        }
      ]
    },
    {
      id: 'proposicoes',
      title: 'Proposições',
      items: [
        {
          id: 'prop_1',
          question: '🔍 GET /api/proposicoes - Listar Proposições',
          answer: 'Lista todas as proposições com suporte a filtros avançados, paginação e ordenação.',
          example: {
            title: 'Endpoint e Parâmetros',
            code: `// GET /api/proposicoes
// Parâmetros de Query (opcionais):
// - page: número da página (padrão: 1)
// - limit: itens por página (padrão: 20, máximo: 100)
// - tipo: filtrar por tipo (PROJETO_LEI, PROJETO_RESOLUCAO, etc.)
// - estado: filtrar por estado (RASCUNHO, PROTOCOLADA, EM_ANALISE, etc.)
// - autorId: filtrar por ID do autor
// - urgencia: filtrar por urgência (NORMAL, URGENTE, URGENTISSIMA)
// - search: buscar no título, ementa ou número
// - dataInicio: filtrar por data de criação (YYYY-MM-DD)
// - dataFim: filtrar por data de criação (YYYY-MM-DD)
// - sort: ordenar por campo (createdAt, titulo, numero)
// - order: direção da ordenação (asc, desc)

// Exemplo de Requisição:
GET /api/proposicoes?tipo=PROJETO_LEI&estado=EM_ANALISE&page=1&limit=10&sort=createdAt&order=desc

// Resposta (200 OK):
{
  "data": [
    {
      "id": 12345,
      "numero": "PL 001/2024",
      "titulo": "Projeto de Lei para Digitalização de Processos",
      "tipo": "PROJETO_LEI",
      "estado": "EM_ANALISE",
      "urgencia": "NORMAL",
      "ementa": "Estabelece diretrizes para digitalização dos processos legislativos...",
      "autor": {
        "id": 42,
        "nome": "Maria Santos",
        "role": "PARLAMENTAR"
      },
      "tags": ["tecnologia", "modernização", "processos"],
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-18T14:22:00Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "perPage": 10,
    "total": 156,
    "totalPages": 16
  },
  "filters": {
    "tipo": "PROJETO_LEI",
    "estado": "EM_ANALISE"
  }
}`
          }
        },
        {
          id: 'prop_2',
          question: '📄 GET /api/proposicoes/{id} - Buscar Proposição',
          answer: 'Retorna os dados completos de uma proposição específica, incluindo histórico de tramitação.',
          example: {
            title: 'Endpoint e Resposta',
            code: `// GET /api/proposicoes/12345
// Parâmetros de Rota:
// - id: identificador único da proposição (obrigatório)

// Resposta (200 OK):
{
  "id": 12345,
  "numero": "PL 001/2024",
  "titulo": "Projeto de Lei para Digitalização de Processos",
  "tipo": "PROJETO_LEI",
  "estado": "EM_ANALISE",
  "urgencia": "NORMAL",
  "ementa": "Estabelece diretrizes para digitalização dos processos legislativos...",
  "textoCompleto": "Art. 1º Esta lei estabelece...",
  "justificativa": "A digitalização dos processos é fundamental...",
  "autor": {
    "id": 42,
    "nome": "Maria Santos",
    "role": "PARLAMENTAR",
    "partido": "PARTIDO_A"
  },
  "relator": {
    "id": 15,
    "nome": "João Oliveira",
    "comissao": "Comissão de Tecnologia"
  },
  "tags": ["tecnologia", "modernização", "processos"],
  "anexos": [
    {
      "id": 1,
      "nome": "estudo_impacto.pdf",
      "url": "/api/anexos/1/download",
      "tamanho": 2048576,
      "tipo": "application/pdf"
    }
  ],
  "tramitacao": [
    {
      "id": 1,
      "acao": "CRIACAO",
      "estadoAnterior": null,
      "estadoAtual": "RASCUNHO",
      "usuario": "Maria Santos",
      "data": "2024-01-15T10:30:00Z",
      "observacoes": "Proposição criada"
    },
    {
      "id": 2,
      "acao": "PROTOCOLO",
      "estadoAnterior": "RASCUNHO",
      "estadoAtual": "PROTOCOLADA",
      "usuario": "Sistema",
      "data": "2024-01-16T09:15:00Z",
      "observacoes": "Protocolada automaticamente"
    }
  ],
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-18T14:22:00Z"
}`
          }
        },
        {
          id: 'prop_3',
          question: '➕ POST /api/proposicoes - Criar Proposição',
          answer: 'Cria uma nova proposição no sistema. Requer permissões de PARLAMENTAR ou superior.',
          example: {
            title: 'Requisição e Resposta',
            code: `// POST /api/proposicoes
// Content-Type: application/json
// Authorization: Bearer {token}

// Corpo da Requisição:
{
  "titulo": "string",
  "tipo": "string",
  "ementa": "string",
  "textoCompleto": "string",
  "justificativa": "string",
  "urgencia": "string",
  "tags": ["string"],
  "anexos": [
    {
      "nome": "string",
      "conteudoBase64": "string",
      "tipo": "string"
    }
  ]
}

// Resposta (201 Created):
{
  "id": 12346,
  "numero": "PL 002/2024",
  "titulo": "Projeto de Lei para Digitalização de Processos",
  "tipo": "PROJETO_LEI",
  "estado": "RASCUNHO",
  "urgencia": "NORMAL",
  "ementa": "Estabelece diretrizes para digitalização dos processos legislativos municipais...",
  "autor": {
    "id": 42,
    "nome": "Maria Santos",
    "role": "PARLAMENTAR"
  },
  "tags": ["tecnologia", "modernização", "processos", "transparência"],
  "anexos": [
    {
      "id": 2,
      "nome": "estudo_impacto.pdf",
      "url": "/api/anexos/2/download",
      "tamanho": 2048576,
      "tipo": "application/pdf"
    }
  ],
  "createdAt": "2024-01-20T16:30:00Z"
}

// Resposta de Erro (422 Validation Error):
{
  "error": "Validation failed",
  "message": "Dados inválidos fornecidos",
  "errors": {
    "titulo": ["Título é obrigatório"],
    "ementa": ["Ementa deve ter pelo menos 50 caracteres"],
    "tipo": ["Tipo deve ser um dos valores válidos"]
  }
}`
          }
        },
        {
          id: 'prop_4',
          question: '🔁 PUT /api/proposicoes/{id} - Atualizar Proposição',
          answer: 'Atualiza uma proposição existente. Apenas o autor ou usuários com permissão podem editar proposições em estado RASCUNHO.',
          example: {
            title: 'Requisição e Resposta',
            code: `// PUT /api/proposicoes/12346
// Content-Type: application/json
// Authorization: Bearer {token}

// Corpo da Requisição:
{
  "titulo": "string",
  "ementa": "string",
  "textoCompleto": "string",
  "justificativa": "string",
  "urgencia": "string",
  "tags": ["string"]
}

// Resposta (200 OK):
{
  "id": 12346,
  "numero": "PL 002/2024",
  "titulo": "Projeto de Lei para Digitalização Completa de Processos",
  "tipo": "PROJETO_LEI",
  "estado": "RASCUNHO",
  "urgencia": "URGENTE",
  "ementa": "Estabelece diretrizes abrangentes para digitalização dos processos legislativos municipais...",
  "tags": ["tecnologia", "modernização", "processos", "transparência", "assinatura-digital"],
  "updatedAt": "2024-01-20T17:15:00Z"
}

// Resposta de Erro (403 Forbidden):
{
  "error": "Forbidden",
  "message": "Proposição não pode ser editada no estado atual",
  "code": "INVALID_STATE_FOR_EDIT"
}`
          }
        },
        {
          id: 'prop_5',
          question: '🛠️ Tipos e Estados de Proposições',
          answer: 'Especificação completa dos tipos de proposições e fluxo de estados no sistema.',
          example: {
            title: 'Tipos e Fluxo de Estados',
            code: `// Tipos de Proposições:
{
  "PROJETO_LEI": "Projeto de Lei",
  "PROJETO_RESOLUCAO": "Projeto de Resolução",
  "PROJETO_DECRETO": "Projeto de Decreto Legislativo",
  "REQUERIMENTO": "Requerimento",
  "INDICACAO": "Indicação",
  "MOCAO": "Moção",
  "EMENDA": "Emenda",
  "SUBSTITUTIVO": "Substitutivo"
}

// Estados e Fluxo de Tramitação:
RASCUNHO → PROTOCOLADA → EM_ANALISE → RELATORIA → VOTACAO → APROVADA/REJEITADA/ARQUIVADA

// Estados Detalhados:
{
  "RASCUNHO": "Proposição em elaboração pelo autor",
  "PROTOCOLADA": "Proposição protocolada e numerada",
  "EM_ANALISE": "Em análise pela comissão competente",
  "RELATORIA": "Designado relator, aguardando parecer",
  "VOTACAO": "Pronta para votação em plenário",
  "APROVADA": "Aprovada pelo plenário",
  "REJEITADA": "Rejeitada pelo plenário",
  "ARQUIVADA": "Arquivada por decisão ou prazo",
  "RETIRADA": "Retirada pelo autor",
  "SOBRESTADA": "Sobrestada por questão de ordem"
}

// Níveis de Urgência:
{
  "NORMAL": "Tramitação normal (padrão)",
  "URGENTE": "Tramitação urgente (prazo reduzido)",
  "URGENTISSIMA": "Tramitação urgentíssima (prioridade máxima)"
}

// Campos Obrigatórios por Tipo:
PROJETO_LEI: titulo, ementa, textoCompleto, justificativa
REQUERIMENTO: titulo, ementa, justificativa
INDICACAO: titulo, ementa
MOCAO: titulo, ementa, textoCompleto

// Validações:
- titulo: 10-200 caracteres
- ementa: 50-500 caracteres
- textoCompleto: mínimo 100 caracteres (quando obrigatório)
- tags: máximo 10 tags, cada uma com 2-30 caracteres
- anexos: máximo 10 arquivos, 10MB cada`
          }
        }
      ]
    },
    {
      id: 'tramitacao',
      title: 'Tramitação',
      items: [
        {
          id: 'tram_1',
          question: 'Como funciona o workflow de tramitação?',
          answer: 'O sistema implementa um workflow state machine com estados predefinidos: RASCUNHO → PROTOCOLADA → EM_ANALISE → RELATORIA → VOTACAO → APROVADA/REJEITADA/ARQUIVADA.'
        },
        {
          id: 'tram_2',
          question: 'Como avançar uma proposição no workflow?',
          answer: 'Use POST /api/proposicoes/{id}/tramitacao com a ação desejada no body: {"acao": "string", "observacoes": "string"}'
        },
        {
          id: 'tram_3',
          question: 'Como consultar o histórico de tramitação?',
          answer: 'Faça GET /api/proposicoes/{id}/historico para ver todas as movimentações, incluindo timestamps, usuários responsáveis e observações.'
        },
        {
          id: 'tram_4',
          question: 'Quais ações são permitidas em cada estado?',
          answer: 'Cada estado tem ações específicas. Use GET /api/proposicoes/{id}/acoes-disponiveis para ver as ações permitidas no estado atual.'
        }
      ]
    },
    {
      id: 'usuarios',
      title: 'Usuários',
      items: [
        {
          id: 'user_1',
          question: '🔍 GET /api/usuarios - Listar Usuários',
          answer: 'Lista todos os usuários cadastrados no sistema com suporte a paginação e filtros.',
          example: {
            title: 'Endpoint e Parâmetros',
            code: `// GET /api/usuarios
// Parâmetros de Query (opcionais):
// - page: número da página (padrão: 1)
// - limit: itens por página (padrão: 20, máximo: 100)
// - role: filtrar por função (ADMIN, PARLAMENTAR, DESENVOLVEDOR, PUBLICO)
// - status: filtrar por status (ATIVO, INATIVO, SUSPENSO)
// - search: buscar por nome ou email

// Exemplo de Requisição:
GET /api/usuarios?page=1&limit=10&role=DESENVOLVEDOR&status=ATIVO

// Resposta (200 OK):
{
  "data": [
    {
      "id": 1,
      "nome": "João da Silva",
      "email": "joao@sistema.gov.br",
      "role": "DESENVOLVEDOR",
      "status": "ATIVO",
      "createdAt": "2024-01-15T10:30:00Z",
      "lastLogin": "2024-01-20T14:22:00Z"
    },
    {
      "id": 2,
      "nome": "Maria Souza",
      "email": "maria@sistema.gov.br",
      "role": "ADMIN",
      "status": "ATIVO",
      "createdAt": "2024-01-10T08:15:00Z",
      "lastLogin": "2024-01-20T16:45:00Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "perPage": 10,
    "total": 25,
    "totalPages": 3
  }
}`
          }
        },
        {
          id: 'user_2',
          question: '📄 GET /api/usuarios/{id} - Buscar Usuário',
          answer: 'Retorna os dados detalhados de um usuário específico pelo ID.',
          example: {
            title: 'Endpoint e Resposta',
            code: `// GET /api/usuarios/1
// Parâmetros de Rota:
// - id: identificador único do usuário (obrigatório)

// Resposta (200 OK):
{
  "id": 1,
  "nome": "João da Silva",
  "email": "joao@sistema.gov.br",
  "role": "DESENVOLVEDOR",
  "status": "ATIVO",
  "permissoes": [
    "api.read",
    "api.write",
    "proposicoes.create"
  ],
  "profile": {
    "telefone": "+55 11 99999-9999",
    "departamento": "Tecnologia da Informação",
    "cargo": "Analista de Sistemas"
  },
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-20T14:22:00Z",
  "lastLogin": "2024-01-20T14:22:00Z"
}

// Resposta de Erro (404 Not Found):
{
  "error": "User not found",
  "message": "Usuário com ID 999 não encontrado",
  "code": "USER_NOT_FOUND"
}`
          }
        },
        {
          id: 'user_3',
          question: '➕ POST /api/usuarios - Criar Usuário',
          answer: 'Cria um novo usuário no sistema. Requer permissões de ADMIN.',
          example: {
            title: 'Requisição e Resposta',
            code: `// POST /api/usuarios
// Content-Type: application/json
// Authorization: Bearer {token}

// Corpo da Requisição:
{
  "nome": "string",
  "email": "string",
  "password": "string",
  "role": "string",
  "profile": {
    "telefone": "string",
    "departamento": "string",
    "cargo": "string"
  },
  "permissoes": ["string"]
}

// Resposta (201 Created):
{
  "id": 3,
  "nome": "Carlos Martins",
  "email": "carlos@sistema.gov.br",
  "role": "DESENVOLVEDOR",
  "status": "ATIVO",
  "profile": {
    "telefone": "+55 11 88888-8888",
    "departamento": "Desenvolvimento",
    "cargo": "Desenvolvedor Backend"
  },
  "permissoes": [
    "api.read",
    "proposicoes.read"
  ],
  "createdAt": "2024-01-20T16:30:00Z"
}

// Resposta de Erro (422 Validation Error):
{
  "error": "Validation failed",
  "message": "Dados inválidos fornecidos",
  "errors": {
    "email": ["Email já está em uso"],
    "password": ["Senha deve ter pelo menos 8 caracteres"]
  }
}`
          }
        },
        {
          id: 'user_4',
          question: '🔁 PUT /api/usuarios/{id} - Atualizar Usuário',
          answer: 'Atualiza os dados completos de um usuário existente. Usuários podem atualizar apenas seu próprio perfil, exceto ADMINs.',
          example: {
            title: 'Requisição e Resposta',
            code: `// PUT /api/usuarios/3
// Content-Type: application/json
// Authorization: Bearer {token}

// Corpo da Requisição:
{
  "nome": "string",
  "email": "string",
  "role": "string",
  "status": "string",
  "profile": {
    "telefone": "string",
    "departamento": "string",
    "cargo": "string"
  },
  "permissoes": ["string"]
}

// Resposta (200 OK):
{
  "id": 3,
  "nome": "Carlos Martins Junior",
  "email": "carlos.junior@sistema.gov.br",
  "role": "DESENVOLVEDOR",
  "status": "ATIVO",
  "profile": {
    "telefone": "+55 11 77777-7777",
    "departamento": "Arquitetura",
    "cargo": "Arquiteto de Software"
  },
  "permissoes": [
    "api.read",
    "api.write",
    "proposicoes.read",
    "proposicoes.create"
  ],
  "updatedAt": "2024-01-20T17:15:00Z"
}`
          }
        },
        {
          id: 'user_5',
          question: '❌ DELETE /api/usuarios/{id} - Remover Usuário',
          answer: 'Remove um usuário do sistema. Apenas ADMINs podem executar esta operação.',
          example: {
            title: 'Endpoint e Resposta',
            code: `// DELETE /api/usuarios/3
// Authorization: Bearer {token}

// Resposta (204 No Content):
// Sem corpo na resposta

// Resposta de Erro (403 Forbidden):
{
  "error": "Forbidden",
  "message": "Você não tem permissão para remover usuários",
  "code": "INSUFFICIENT_PERMISSIONS"
}

// Resposta de Erro (409 Conflict):
{
  "error": "Conflict",
  "message": "Usuário não pode ser removido pois possui proposições ativas",
  "code": "USER_HAS_DEPENDENCIES"
}`
          }
        },
        {
          id: 'user_6',
          question: '🛠️ Resumo dos Campos e Validações',
          answer: 'Especificação completa dos campos do modelo de usuário e suas validações.',
          example: {
            title: 'Modelo de Dados',
            code: `// Campos do Usuário:
{
  "id": "integer (auto-increment, read-only)",
  "nome": "string (obrigatório, 2-100 caracteres)",
  "email": "string (obrigatório, único, formato email válido)",
  "password": "string (obrigatório no POST, 8-50 caracteres, hash bcrypt)",
  "role": "enum (obrigatório: ADMIN, PARLAMENTAR, DESENVOLVEDOR, PUBLICO)",
  "status": "enum (padrão: ATIVO, valores: ATIVO, INATIVO, SUSPENSO)",
  "profile": {
    "telefone": "string (opcional, formato: +55 XX XXXXX-XXXX)",
    "departamento": "string (opcional, 2-50 caracteres)",
    "cargo": "string (opcional, 2-50 caracteres)"
  },
  "permissoes": "array (opcional, lista de strings)",
  "createdAt": "datetime (auto, ISO 8601)",
  "updatedAt": "datetime (auto, ISO 8601)",
  "lastLogin": "datetime (auto, ISO 8601)"
}

// Roles e Permissões:
ADMIN: Acesso total ao sistema
PARLAMENTAR: Criar/editar proposições, votar
DESENVOLVEDOR: Acesso à API, documentação
PUBLICO: Apenas leitura de proposições públicas

// Códigos de Status HTTP:
200 OK - Operação bem-sucedida
201 Created - Usuário criado com sucesso
204 No Content - Usuário removido
400 Bad Request - Dados inválidos
401 Unauthorized - Token inválido/expirado
403 Forbidden - Sem permissão
404 Not Found - Usuário não encontrado
409 Conflict - Email já existe ou dependências
422 Unprocessable Entity - Erro de validação`
          }
        }
      ]
    },
    {
      id: 'relatorios',
      title: 'Relatórios',
      items: [
        {
          id: 'rel_1',
          question: '📊 GET /api/relatorios/estatisticas - Estatísticas Gerais',
          answer: 'Retorna estatísticas gerais do sistema com métricas de proposições, usuários e tramitação.',
          example: {
            title: 'Endpoint e Resposta',
            code: `// GET /api/relatorios/estatisticas
// Parâmetros de Query (opcionais):
// - periodo: filtrar por período (MENSAL, TRIMESTRAL, ANUAL)
// - dataInicio: data inicial (YYYY-MM-DD)
// - dataFim: data final (YYYY-MM-DD)
// - format: formato de saída (json, pdf, excel, csv)

// Exemplo de Requisição:
GET /api/relatorios/estatisticas?periodo=MENSAL&dataInicio=2024-01-01&dataFim=2024-01-31&format=json

// Resposta (200 OK):
{
  "periodo": {
    "inicio": "2024-01-01",
    "fim": "2024-01-31",
    "tipo": "MENSAL"
  },
  "proposicoes": {
    "total": 156,
    "porTipo": {
      "PROJETO_LEI": 89,
      "PROJETO_RESOLUCAO": 34,
      "REQUERIMENTO": 23,
      "INDICACAO": 10
    },
    "porEstado": {
      "RASCUNHO": 12,
      "PROTOCOLADA": 45,
      "EM_ANALISE": 67,
      "APROVADA": 28,
      "REJEITADA": 4
    },
    "porUrgencia": {
      "NORMAL": 134,
      "URGENTE": 18,
      "URGENTISSIMA": 4
    }
  },
  "tramitacao": {
    "tempoMedio": {
      "protocoloAnalise": 3.2,
      "analiseVotacao": 15.7,
      "tramitacaoCompleta": 28.4
    },
    "eficiencia": {
      "proposicoesFinalizadas": 32,
      "percentualAprovacao": 87.5,
      "tempoMedioAprovacao": 24.1
    }
  },
  "usuarios": {
    "totalAtivos": 45,
    "porRole": {
      "PARLAMENTAR": 21,
      "ADMIN": 3,
      "DESENVOLVEDOR": 8,
      "PUBLICO": 13
    },
    "produtividade": {
      "proposicoesPorAutor": [
        {
          "autorId": 42,
          "nome": "Maria Santos",
          "totalProposicoes": 12,
          "aprovadas": 8,
          "rejeitadas": 1,
          "emTramitacao": 3
        }
      ]
    }
  },
  "geradoEm": "2024-01-31T23:59:59Z",
  "geradoPor": "Sistema Automático"
}`
          }
        },
        {
          id: 'rel_2',
          question: '📈 GET /api/relatorios/produtividade - Produtividade Parlamentar',
          answer: 'Relatório detalhado da produtividade dos parlamentares com métricas individuais e comparativas.',
          example: {
            title: 'Endpoint e Resposta',
            code: `// GET /api/relatorios/produtividade
// Parâmetros de Query (opcionais):
// - parlamentarId: filtrar por parlamentar específico
// - periodo: período de análise (MENSAL, TRIMESTRAL, ANUAL)
// - ordenacao: ordenar por (proposicoes, aprovacoes, eficiencia)
// - limit: limite de resultados (padrão: 50)

// Resposta (200 OK):
{
  "periodo": {
    "inicio": "2024-01-01",
    "fim": "2024-01-31",
    "tipo": "MENSAL"
  },
  "ranking": [
    {
      "posicao": 1,
      "parlamentar": {
        "id": 42,
        "nome": "Maria Santos",
        "partido": "PARTIDO_A",
        "comissoes": ["Tecnologia", "Educação"]
      },
      "metricas": {
        "proposicoesApresentadas": 12,
        "proposicoesAprovadas": 8,
        "proposicoesRejeitadas": 1,
        "emTramitacao": 3,
        "percentualAprovacao": 88.9,
        "tempoMedioTramitacao": 22.5,
        "pontuacaoEficiencia": 94.2
      },
      "detalhamento": {
        "porTipo": {
          "PROJETO_LEI": 7,
          "REQUERIMENTO": 3,
          "INDICACAO": 2
        },
        "porUrgencia": {
          "NORMAL": 9,
          "URGENTE": 2,
          "URGENTISSIMA": 1
        }
      }
    }
  ],
  "estatisticasGerais": {
    "mediaProposicoesPorParlamentar": 7.4,
    "mediaAprovacao": 76.3,
    "parlamentarMaisAtivo": "Maria Santos",
    "parlamentarMaiorAprovacao": "João Oliveira"
  }
}`
          }
        },
        {
          id: 'rel_3',
          question: '⏱️ POST /api/relatorios/agendamentos - Agendar Relatórios',
          answer: 'Cria agendamento para geração automática de relatórios com envio por email.',
          example: {
            title: 'Requisição e Resposta',
            code: `// POST /api/relatorios/agendamentos
// Content-Type: application/json
// Authorization: Bearer {token}

// Corpo da Requisição:
{
  "nome": "string",
  "tipoRelatorio": "string",
  "frequencia": "string",
  "diaExecucao": "number",
  "horaExecucao": "string",
  "formato": "string",
  "parametros": {
    "periodo": "string",
    "incluirGraficos": "boolean",
    "incluirDetalhamento": "boolean"
  },
  "destinatarios": [
    {
      "email": "string",
      "nome": "string"
    }
  ],
  "ativo": "boolean"
}

// Resposta (201 Created):
{
  "id": 15,
  "nome": "Relatório Mensal de Estatísticas",
  "tipoRelatorio": "ESTATISTICAS",
  "frequencia": "MENSAL",
  "diaExecucao": 1,
  "horaExecucao": "08:00",
  "formato": "PDF",
  "proximaExecucao": "2024-02-01T08:00:00Z",
  "status": "ATIVO",
  "destinatarios": [
    {
      "email": "presidente@camara.gov.br",
      "nome": "Presidente da Câmara"
    }
  ],
  "createdAt": "2024-01-15T10:30:00Z",
  "createdBy": "admin@sistema.gov.br"
}

// Frequências Disponíveis:
// DIARIO, SEMANAL, MENSAL, TRIMESTRAL, ANUAL

// Tipos de Relatório:
// ESTATISTICAS, PRODUTIVIDADE, TRAMITACAO, VOTACOES, FINANCEIRO`
          }
        },
        {
          id: 'rel_4',
          question: '📋 GET /api/relatorios/historico - Histórico de Relatórios',
          answer: 'Lista o histórico de relatórios gerados com status de processamento e links para download.',
          example: {
            title: 'Endpoint e Resposta',
            code: `// GET /api/relatorios/historico
// Parâmetros de Query (opcionais):
// - page: número da página (padrão: 1)
// - limit: itens por página (padrão: 20)
// - tipo: filtrar por tipo de relatório
// - status: filtrar por status (PROCESSANDO, CONCLUIDO, ERRO)
// - usuarioId: filtrar por usuário que solicitou

// Resposta (200 OK):
{
  "data": [
    {
      "id": 1234,
      "nome": "Estatísticas Janeiro 2024",
      "tipo": "ESTATISTICAS",
      "formato": "PDF",
      "status": "CONCLUIDO",
      "tamanhoArquivo": 2048576,
      "parametros": {
        "periodo": "MENSAL",
        "dataInicio": "2024-01-01",
        "dataFim": "2024-01-31"
      },
      "solicitadoPor": {
        "id": 1,
        "nome": "Admin Sistema",
        "email": "admin@sistema.gov.br"
      },
      "tempoProcessamento": 45.2,
      "downloadUrl": "/api/relatorios/download/1234",
      "expiresAt": "2024-02-15T00:00:00Z",
      "createdAt": "2024-01-31T08:00:00Z",
      "completedAt": "2024-01-31T08:00:45Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "perPage": 20,
    "total": 89,
    "totalPages": 5
  },
  "estatisticas": {
    "totalRelatorios": 89,
    "concluidos": 85,
    "processando": 2,
    "comErro": 2,
    "tamanhoTotalArquivos": 156789123
  }
}

// Status dos Relatórios:
// SOLICITADO: Relatório foi solicitado
// PROCESSANDO: Em processamento
// CONCLUIDO: Processamento concluído, disponível para download
// ERRO: Erro durante processamento
// EXPIRADO: Arquivo expirou e foi removido`
          }
        }
      ]
    },
    {
      id: 'webhooks',
      title: 'Webhooks',
      items: [
        {
          id: 'hook_1',
          question: '🔗 POST /api/webhooks - Configurar Webhook',
          answer: 'Cria um novo webhook para receber notificações em tempo real sobre eventos do sistema.',
          example: {
            title: 'Requisição e Resposta',
            code: `// POST /api/webhooks
// Content-Type: application/json
// Authorization: Bearer {token}

// Corpo da Requisição:
{
  "nome": "string",
  "url": "string",
  "eventos": ["string"],
  "ativo": "boolean",
  "secret": "string",
  "filtros": {
    "tipos": ["string"],
    "urgencia": ["string"]
  },
  "configuracoes": {
    "timeoutSegundos": "number",
    "tentativasMaximas": "number",
    "incluirPayloadCompleto": "boolean"
  }
}

// Resposta (201 Created):
{
  "id": 25,
  "nome": "Webhook Proposições",
  "url": "https://meuapp.com/api/webhooks/proposicoes",
  "eventos": [
    "proposicao.criada",
    "proposicao.tramitada",
    "proposicao.aprovada",
    "proposicao.rejeitada"
  ],
  "status": "ATIVO",
  "filtros": {
    "tipos": ["PROJETO_LEI", "PROJETO_RESOLUCAO"],
    "urgencia": ["URGENTE", "URGENTISSIMA"]
  },
  "estatisticas": {
    "totalEnvios": 0,
    "sucessos": 0,
    "falhas": 0,
    "ultimoEnvio": null
  },
  "createdAt": "2024-01-20T10:30:00Z",
  "updatedAt": "2024-01-20T10:30:00Z"
}

// Eventos Disponíveis:
// proposicao.criada, proposicao.atualizada, proposicao.tramitada
// proposicao.aprovada, proposicao.rejeitada, proposicao.arquivada
// usuario.criado, usuario.atualizado, usuario.removido
// votacao.iniciada, votacao.finalizada, relatorio.gerado`
          }
        },
        {
          id: 'hook_2',
          question: '📦 Formato dos Payloads de Webhook',
          answer: 'Estrutura padrão dos payloads enviados pelos webhooks com dados do evento e assinatura de segurança.',
          example: {
            title: 'Exemplo de Payload',
            code: `// Headers HTTP enviados:
// Content-Type: application/json
// X-Webhook-Event: proposicao.criada
// X-Webhook-Signature: sha256=a8b7c6d5e4f3g2h1...
// X-Webhook-Timestamp: 1642694400
// X-Webhook-ID: webhook_25
// User-Agent: Sistema-Webhook/1.0

// Payload JSON:
{
  "id": "evt_1234567890",
  "evento": "proposicao.criada",
  "timestamp": "2024-01-20T15:30:00Z",
  "webhookId": 25,
  "tentativa": 1,
  "data": {
    "proposicao": {
      "id": 12347,
      "numero": "PL 003/2024",
      "titulo": "Projeto de Lei sobre Sustentabilidade",
      "tipo": "PROJETO_LEI",
      "estado": "RASCUNHO",
      "urgencia": "URGENTE",
      "ementa": "Estabelece diretrizes para sustentabilidade ambiental...",
      "autor": {
        "id": 42,
        "nome": "Maria Santos",
        "role": "PARLAMENTAR",
        "partido": "PARTIDO_A"
      },
      "tags": ["sustentabilidade", "meio-ambiente", "legislacao"],
      "createdAt": "2024-01-20T15:30:00Z"
    },
    "contexto": {
      "usuarioAcao": {
        "id": 42,
        "nome": "Maria Santos",
        "email": "maria@sistema.gov.br"
      },
      "ipOrigem": "192.168.1.100",
      "userAgent": "Mozilla/5.0..."
    }
  },
  "metadata": {
    "ambiente": "producao",
    "versaoApi": "1.0",
    "sistemaOrigem": "tramitacao-parlamentar"
  }
}

// Validação da Assinatura (HMAC-SHA256):
// 1. Concatene: timestamp + '.' + payload_json
// 2. Gere HMAC-SHA256 usando seu secret
// 3. Compare com X-Webhook-Signature (formato: sha256=hash)

// Exemplo em Node.js:
const crypto = require('crypto');
const expectedSignature = 'sha256=' + crypto
  .createHmac('sha256', webhookSecret)
  .update(timestamp + '.' + JSON.stringify(payload))
  .digest('hex');`
          }
        },
        {
          id: 'hook_3',
          question: '🔐 Validação de Segurança dos Webhooks',
          answer: 'Como validar a autenticidade dos webhooks usando HMAC-SHA256 para garantir que vieram do sistema.',
          example: {
            title: 'Implementação de Validação',
            code: `// Exemplo em Node.js/Express:
const crypto = require('crypto');

function validarWebhook(req, res, next) {
  const signature = req.headers['x-webhook-signature'];
  const timestamp = req.headers['x-webhook-timestamp'];
  const payload = JSON.stringify(req.body);
  const secret = process.env.WEBHOOK_SECRET;
  
  // Verificar se timestamp não é muito antigo (5 minutos)
  const timestampAtual = Math.floor(Date.now() / 1000);
  if (Math.abs(timestampAtual - parseInt(timestamp)) > 300) {
    return res.status(400).json({ error: 'Timestamp muito antigo' });
  }
  
  // Gerar assinatura esperada
  const expectedSignature = 'sha256=' + crypto
    .createHmac('sha256', secret)
    .update(timestamp + '.' + payload)
    .digest('hex');
  
  // Comparação segura contra timing attacks
  if (!crypto.timingSafeEqual(
    Buffer.from(signature, 'utf8'),
    Buffer.from(expectedSignature, 'utf8')
  )) {
    return res.status(401).json({ error: 'Assinatura inválida' });
  }
  
  next();
}

// Exemplo em Python/Flask:
import hmac
import hashlib
import time
from flask import request, abort

def validar_webhook():
    signature = request.headers.get('X-Webhook-Signature')
    timestamp = request.headers.get('X-Webhook-Timestamp')
    payload = request.get_data()
    secret = os.environ['WEBHOOK_SECRET']
    
    # Verificar timestamp
    if abs(time.time() - int(timestamp)) > 300:
        abort(400, 'Timestamp muito antigo')
    
    # Gerar assinatura esperada
    expected_signature = 'sha256=' + hmac.new(
        secret.encode('utf-8'),
        f"{timestamp}.{payload.decode('utf-8')}".encode('utf-8'),
        hashlib.sha256
    ).hexdigest()
    
    # Comparar assinaturas
    if not hmac.compare_digest(signature, expected_signature):
        abort(401, 'Assinatura inválida')

// Exemplo em PHP:
function validarWebhook($headers, $payload, $secret) {
    $signature = $headers['X-Webhook-Signature'] ?? '';
    $timestamp = $headers['X-Webhook-Timestamp'] ?? '';
    
    // Verificar timestamp
    if (abs(time() - intval($timestamp)) > 300) {
        throw new Exception('Timestamp muito antigo');
    }
    
    // Gerar assinatura esperada
    $expectedSignature = 'sha256=' . hash_hmac(
        'sha256',
        $timestamp . '.' . $payload,
        $secret
    );
    
    // Comparar assinaturas
    if (!hash_equals($signature, $expectedSignature)) {
        throw new Exception('Assinatura inválida');
    }
    
    return true;
}`
          }
        },
        {
          id: 'hook_4',
          question: '🔄 Política de Retry e Monitoramento',
          answer: 'Sistema de tentativas automáticas e monitoramento de webhooks com estatísticas detalhadas.',
          example: {
            title: 'Política de Retry e Logs',
            code: `// GET /api/webhooks/{id}/logs - Logs de um Webhook
// Resposta (200 OK):
{
  "webhook": {
    "id": 25,
    "nome": "Webhook Proposições",
    "url": "https://meuapp.com/api/webhooks/proposicoes",
    "status": "ATIVO"
  },
  "estatisticas": {
    "totalEnvios": 1247,
    "sucessos": 1198,
    "falhas": 49,
    "taxaSucesso": 96.1,
    "tempoMedioResposta": 245,
    "ultimoEnvio": "2024-01-20T15:45:00Z",
    "ultimoSucesso": "2024-01-20T15:45:00Z",
    "ultimaFalha": "2024-01-20T12:30:00Z"
  },
  "logs": [
    {
      "id": "log_789123",
      "eventoId": "evt_1234567890",
      "evento": "proposicao.criada",
      "tentativa": 1,
      "status": "SUCESSO",
      "codigoHttp": 200,
      "tempoResposta": 234,
      "timestampEnvio": "2024-01-20T15:45:00Z",
      "timestampResposta": "2024-01-20T15:45:00Z",
      "headers": {
        "content-type": "application/json",
        "x-response-time": "234ms"
      },
      "resposta": "OK"
    },
    {
      "id": "log_789124",
      "eventoId": "evt_1234567891",
      "evento": "proposicao.tramitada",
      "tentativa": 3,
      "status": "FALHA",
      "codigoHttp": 500,
      "tempoResposta": 30000,
      "timestampEnvio": "2024-01-20T12:30:00Z",
      "timestampResposta": "2024-01-20T12:30:30Z",
      "erro": "Internal Server Error",
      "proximaTentativa": "2024-01-20T12:45:00Z"
    }
  ]
}

// Política de Retry:
// Tentativa 1: Imediata
// Tentativa 2: Após 1 minuto
// Tentativa 3: Após 5 minutos  
// Tentativa 4: Após 15 minutos
// Tentativa 5: Após 1 hora
// Tentativa 6: Após 6 horas
// Após 6 falhas: Webhook marcado como FALHA_PERSISTENTE

// Códigos de Status considerados Sucesso:
// 200, 201, 202, 204

// Códigos que NÃO geram retry:
// 400, 401, 403, 404, 410, 422 (erros do cliente)

// Códigos que geram retry:
// 408, 429, 500, 502, 503, 504, timeout

// Configurações de Timeout:
// Timeout padrão: 30 segundos
// Timeout máximo: 60 segundos
// Timeout mínimo: 5 segundos

// Monitoramento e Alertas:
// - Webhook com taxa de falha > 10% em 1 hora
// - Webhook sem sucesso há mais de 24 horas  
// - Webhook com tempo de resposta > 10 segundos
// - Webhook desabilitado automaticamente após 100 falhas consecutivas`
          }
        }
      ]
    }
  ]

  const filteredSections = faqSections.filter(section => {
    // Se há termo de busca, filtra por busca em qualquer seção
    if (searchTerm) {
      return section.items.some(item => 
        item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    // Se não há busca, mostra apenas a categoria ativa
    return section.id === activeCategory
  })

  return (
    <>
      <PageTitle 
        breadcrumbs={[
          { title: 'Sistema', path: '/dashboard', isSeparator: false, isActive: false },
          { title: 'API', path: '/desenvolvedor', isSeparator: false, isActive: false }
        ]}
      >
        Documentação da API
      </PageTitle>
      
      <div className="card card-flush mb-6">
          <div className="card-body p-lg-15">
            <div className="d-flex flex-column flex-lg-row">
              {/* Sidebar */}
              <div className="flex-column flex-lg-row-auto w-100 w-lg-275px mb-10 me-lg-20">
                {/* Categorias */}
                <div className="mb-15">
                  <h4 className="text-gray-900 mb-7">Categorias</h4>
                  <div className="menu menu-rounded menu-column menu-title-gray-700 menu-state-title-primary menu-active-bg-light-primary fw-semibold">
                    {categorias.map((categoria) => (
                      <div key={categoria.id} className="menu-item mb-1">
                        <button
                          onClick={() => handleCategoryChange(categoria.id)}
                          className={`menu-link py-3 w-100 text-start border-0 ${
                            activeCategory === categoria.id 
                              ? 'active bg-light-primary text-primary' 
                              : 'bg-transparent text-gray-700'
                          }`}
                          style={{
                            transition: 'all 0.15s ease',
                            ...(activeCategory !== categoria.id && {
                              ':hover': {
                                backgroundColor: 'var(--bs-primary-bg-subtle)',
                                color: 'var(--bs-primary)'
                              }
                            })
                          }}
                          onMouseEnter={(e) => {
                            if (activeCategory !== categoria.id) {
                              e.currentTarget.style.backgroundColor = 'var(--bs-primary-bg-subtle)'
                              e.currentTarget.style.color = 'var(--bs-primary)'
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (activeCategory !== categoria.id) {
                              e.currentTarget.style.backgroundColor = 'transparent'
                              e.currentTarget.style.color = 'var(--bs-gray-700)'
                            }
                          }}
                        >
                          <i className={`${categoria.icon} me-2 ${
                            activeCategory === categoria.id ? 'text-primary' : ''
                          }`}></i>
                          {categoria.label}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Busca */}
                <div className="mb-16">
                  <h4 className="text-gray-900 mb-7">Buscar na Documentação</h4>
                  <div className="position-relative">
                    <i className="ki-duotone ki-magnifier fs-3 text-gray-500 position-absolute top-50 translate-middle ms-6">
                      <span className="path1"></span>
                      <span className="path2"></span>
                    </i>
                    <input
                      type="text"
                      className="form-control form-control-solid ps-10"
                      name="search"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Buscar endpoints, métodos..."
                    />
                  </div>
                </div>

                {/* Links Úteis */}
                <div className="mb-16">
                  <h4 className="text-gray-900 mb-7">Links Úteis</h4>
                  <div className="d-flex flex-column gap-3">
                    <a href="/api/swagger" className="btn btn-outline btn-outline-primary btn-sm">
                      <i className="bi bi-file-earmark-code me-2"></i>
                      Swagger/OpenAPI
                    </a>
                    <a href="/api/postman" className="btn btn-outline btn-outline-info btn-sm">
                      <i className="bi bi-collection me-2"></i>
                      Collection Postman
                    </a>
                    <a href="/api/status" className="btn btn-outline btn-outline-success btn-sm">
                      <i className="bi bi-activity me-2"></i>
                      Status da API
                    </a>
                  </div>
                </div>
              </div>

              {/* Conteúdo Principal */}
              <div className="flex-lg-row-fluid">
                <div className="mb-13">
                  {/* Header */}
                  <div className="mb-15">
                    <p className="fw-semibold fs-4 text-gray-600 mb-2">
                      Documentação completa da API REST do Sistema de Tramitação Parlamentar. 
                      Aqui você encontra todos os endpoints, métodos de autenticação, 
                      exemplos de requisições e respostas.
                    </p>
                    <div className="d-flex gap-2 mt-4">
                      <span className="badge badge-light-primary">API v1.0</span>
                      <span className="badge badge-light-success">REST</span>
                      <span className="badge badge-light-info">JSON</span>
                    </div>
                  </div>

                  {/* FAQ Sections */}
                  {filteredSections.map((section) => (
                    <div key={section.id} className="mb-15">
                      <h3 className="text-gray-800 w-bolder mb-4">
                        <i className={`${categorias.find(c => c.id === section.id)?.icon || 'bi-question-circle'} me-2`}></i>
                        {section.title}
                      </h3>
                      
                      {section.items.map((item, index) => (
                        <div key={item.id} className="m-0">
                          <div 
                            className="d-flex align-items-center collapsible py-3 toggle mb-0" 
                            data-bs-toggle="collapse" 
                            data-bs-target={`#${item.id}`}
                            onClick={() => toggleExpanded(item.id)}
                            style={{ 
                              cursor: 'pointer',
                              transition: 'all 0.15s ease'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = 'var(--bs-gray-100)'
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'transparent'
                            }}
                          >
                            <div className="btn btn-sm btn-icon mw-20px btn-active-color-primary me-5">
                              {expandedItems.has(item.id) ? (
                                <i className="bi bi-dash-circle text-primary fs-4"></i>
                              ) : (
                                <i className="bi bi-plus-circle text-gray-500 fs-4"></i>
                              )}
                            </div>
                            <h4 className="text-gray-700 fw-bold cursor-pointer mb-0">
                              {item.question}
                            </h4>
                          </div>
                          
                          <div id={item.id} className={`collapse ${expandedItems.has(item.id) ? 'show' : ''} fs-6 ms-1`}>
                            <div className="mb-4 text-gray-600 fw-semibold fs-6 ps-10">
                              {item.answer}
                              {item.example && (
                                <CodeExample 
                                  title={item.example.title}
                                  code={item.example.code}
                                />
                              )}
                            </div>
                          </div>
                          
                          {index < section.items.length - 1 && (
                            <div className="separator separator-dashed"></div>
                          )}
                        </div>
                      ))}
                    </div>
                  ))}

                  {/* Base URL e Informações Técnicas */}
                  <div className="mb-15">
                    <h3 className="text-gray-800 w-bolder mb-4">
                      <i className="bi bi-server me-2"></i>
                      Informações Técnicas
                    </h3>
                    
                    <div className="card bg-light-primary">
                      <div className="card-body p-6">
                        <h5 className="text-primary fw-bold mb-3">Base URL</h5>
                        <code className="bg-white p-2 rounded d-block mb-4">
                          https://api.sistema-tramitacao.gov.br/v1
                        </code>
                        
                        <h5 className="text-primary fw-bold mb-3">Formatos Suportados</h5>
                        <ul className="mb-4">
                          <li><strong>Request:</strong> application/json</li>
                          <li><strong>Response:</strong> application/json</li>
                          <li><strong>Upload:</strong> multipart/form-data</li>
                        </ul>
                        
                        <h5 className="text-primary fw-bold mb-3">Rate Limiting</h5>
                        <ul className="mb-0">
                          <li><strong>Usuários autenticados:</strong> 1000 req/hora</li>
                          <li><strong>Endpoints públicos:</strong> 100 req/hora</li>
                          <li><strong>Upload de arquivos:</strong> 10 req/hora</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer com redes sociais */}
                <div className="card mb-4 bg-light text-center">
                  <div className="card-body py-12">
                    <h5 className="text-gray-800 fw-bold mb-6">Precisa de Ajuda?</h5>
                    <div className="d-flex justify-content-center gap-4">
                      <a href="mailto:api@sistema-tramitacao.gov.br" className="btn btn-outline btn-outline-primary">
                        <i className="bi bi-envelope me-2"></i>
                        Suporte por Email
                      </a>
                      <a href="/developer/chat" className="btn btn-outline btn-outline-info">
                        <i className="bi bi-chat-dots me-2"></i>
                        Chat do Desenvolvedor
                      </a>
                      <a href="https://github.com/sistema-tramitacao/api" className="btn btn-outline btn-outline-dark">
                        <i className="bi bi-github me-2"></i>
                        GitHub
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    </>
  )
} 