# Guia de Implementação da API - Sistema de Tramitação Parlamentar

## 🎯 Objetivo

Este documento é o guia definitivo para implementação da API REST do Sistema de Tramitação Parlamentar. Cada endpoint listado aqui deve ser implementado com os campos e validações especificados.

## 🏗️ Arquitetura e Estrutura de Pastas

### Organização dos Endpoints
```
src/app/api/
├── auth/                    # 🔐 Autenticação
│   ├── login/route.ts      # POST - Login do usuário
│   ├── refresh/route.ts    # POST - Renovar token
│   └── logout/route.ts     # POST - Logout
├── v1/                     # 📋 API Principal v1
│   ├── proposicoes/        # Proposições legislativas
│   │   ├── route.ts        # GET/POST - Listar/Criar
│   │   └── [id]/           
│   │       ├── route.ts    # GET/PUT/DELETE - CRUD individual
│   │       └── tramitacao/ # Tramitação específica
│   ├── parlamentares/      # Dados parlamentares
│   │   ├── route.ts        # GET/POST - Listar/Criar
│   │   └── [id]/
│   │       ├── route.ts    # GET/PUT/DELETE
│   │       └── proposicoes/route.ts # GET - Proposições do parlamentar
│   ├── comissoes/          # Gestão de comissões
│   ├── votacoes/           # Sistema de votações
│   ├── emendas/            # Emendas legislativas
│   └── documentos/         # Gestão de documentos
├── admin/                  # 👑 Área Administrativa
│   ├── users/route.ts      # Gestão de usuários
│   ├── config/route.ts     # Configurações sistema
│   └── stats/route.ts      # Estatísticas detalhadas
├── public/                 # 🌐 Endpoints Públicos
│   ├── proposicoes/route.ts    # Consulta pública
│   ├── parlamentares/route.ts  # Lista pública
│   └── dashboard/route.ts      # Dashboard público
└── upload/                 # 📎 Upload de Arquivos
    ├── documentos/route.ts # Upload documentos
    └── imagens/route.ts    # Upload imagens
```

## 🔐 Sistema de Autenticação - IMPLEMENTAR PRIMEIRO

### 1. POST /api/auth/login
```typescript
// Request Body
{
  email: string,     // Obrigatório
  senha: string      // Obrigatório
}

// Response Success (200)
{
  success: true,
  data: {
    user: {
      id: string,
      nome: string,
      email: string,
      role: 'ADMIN' | 'PARLAMENTAR' | 'SECRETARIO' | 'VISITANTE'
    },
    token: string,        // JWT Token (24h)
    refreshToken: string  // Refresh Token (7d)
  }
}
```

### 2. POST /api/auth/refresh
```typescript
// Request Body
{
  refreshToken: string  // Obrigatório
}

// Response Success (200)
{
  success: true,
  data: {
    token: string,
    refreshToken: string
  }
}
```

### 3. POST /api/auth/logout
```typescript
// Headers: Authorization: Bearer <token>
// Request Body: {} (vazio)

// Response Success (200)
{
  success: true,
  message: "Logout realizado com sucesso"
}
```

## 📋 Padrões de Implementação

### Headers Obrigatórios
```typescript
// Para endpoints autenticados
Authorization: "Bearer <jwt_token>"
Content-Type: "application/json"

// Para uploads
Content-Type: "multipart/form-data"
```

### Estrutura de Response Padrão
```typescript
// Sucesso
{
  success: true,
  data: any,
  message?: string
}

// Erro
{
  success: false,
  error: {
    code: string,
    message: string,
    details?: any
  }
}

// Lista Paginada
{
  success: true,
  data: {
    items: any[],
    pagination: {
      page: number,
      limit: number,
      total: number,
      totalPages: number,
      hasNext: boolean,
      hasPrev: boolean
    }
  }
}
```

## 🌐 Endpoints Públicos - SEM AUTENTICAÇÃO

### 1. GET /api/public/proposicoes
```typescript
// Query Parameters
{
  page?: number,        // Padrão: 1
  limit?: number,       // Padrão: 20, Max: 100
  search?: string,      // Busca no título/ementa
  tipo?: 'PL' | 'PLP' | 'PEC' | 'PDC' | 'PRL' | 'PRS' | 'PLN',
  status?: string,      // Status de tramitação
  ano?: number
}

// Response Success (200)
{
  success: true,
  data: {
    items: [
      {
        id: string,
        numero: string,        // Ex: "PL 001/2025"
        titulo: string,
        ementa: string,
        tipo: string,
        status: string,
        statusDescricao: string,
        dataApresentacao: string,
        autor: {
          id: string,
          nome: string,
          partido: string
        }
      }
    ],
    pagination: { /* objeto paginação */ }
  }
}
```

### 2. GET /api/public/proposicoes/[id]
```typescript
// Response Success (200)
{
  success: true,
  data: {
    id: string,
    numero: string,
    titulo: string,
    ementa: string,
    tipo: string,
    status: string,
    statusDescricao: string,
    dataApresentacao: string,
    ultimaAtualizacao: string,
    justificativa?: string,
    autor: {
      id: string,
      nome: string,
      partido: string,
      cargo: string
    },
    tramitacao: [
      {
        id: string,
        status: string,
        descricao: string,
        data: string,
        responsavel: string
      }
    ]
  }
}
```

### 3. GET /api/public/parlamentares
```typescript
// Query Parameters
{
  page?: number,
  limit?: number,
  search?: string,      // Busca no nome
  partido?: string,
  ativo?: boolean,
  cargo?: 'VEREADOR'
}

// Response Success (200)
{
  success: true,
  data: {
    items: [
      {
        id: string,
        nomeCompleto: string,
        partido: string,
        cargo: 'VEREADOR',
        email?: string,
        telefone?: string,
        ativo: boolean,
        totalProposicoes: number,
        totalVotosRegistrados: number
      }
    ],
    pagination: { /* objeto paginação */ }
  }
}
```

### 4. GET /api/public/dashboard
```typescript
// Response Success (200)
{
  success: true,
  data: {
    estatisticas: {
      totalProposicoes: number,
      proposicoesAtivas: number,
      proposicoesAprovadas: number,
      proposicoesRejeitadas: number,
      totalParlamentares: number,
      parlamentaresAtivos: number
    },
    proposicoesRecentes: [
      {
        id: string,
        numero: string,
        titulo: string,
        status: string,
        dataApresentacao: string,
        autor: string
      }
    ],
    tramitacaoRecente: [
      {
        proposicaoNumero: string,
        status: string,
        descricao: string,
        data: string
      }
    ]
  }
}
```

## 📋 API V1 - Proposições (COM AUTENTICAÇÃO)

### 1. GET /api/v1/proposicoes
```typescript
// Headers: Authorization: Bearer <token>
// Query Parameters (mesmos do endpoint público + campos extras)
{
  page?: number,
  limit?: number,
  search?: string,
  tipo?: string,
  status?: string,
  ano?: number,
  autorId?: string,     // Filtrar por autor
  relatorId?: string,   // Filtrar por relator
  comissaoId?: string   // Filtrar por comissão
}

// Response Success (200) - Inclui campos extras para usuários autenticados
{
  success: true,
  data: {
    items: [
      {
        id: string,
        numero: string,
        titulo: string,
        ementa: string,
        tipo: string,
        status: string,
        statusDescricao: string,
        dataApresentacao: string,
        ultimaAtualizacao: string,
        justificativa?: string,
        textoCompleto?: string,    // Apenas para autenticados
        observacoes?: string,      // Apenas para autenticados
        autor: { /* dados completos */ },
        relator?: { /* dados do relator */ },
        comissao?: { /* dados da comissão */ },
        canEdit: boolean,          // Permissão de edição
        canDelete: boolean         // Permissão de exclusão
      }
    ],
    pagination: { /* objeto paginação */ }
  }
}
```

### 2. POST /api/v1/proposicoes
```typescript
// Headers: Authorization: Bearer <token>
// Request Body
{
  titulo: string,           // Obrigatório, min: 10, max: 200
  ementa: string,           // Obrigatório, min: 50
  tipo: 'PL' | 'PLP' | 'PEC' | 'PDC' | 'PRL' | 'PRS' | 'PLN', // Obrigatório
  justificativa?: string,   // Opcional
  textoCompleto?: string,   // Opcional
  observacoes?: string,     // Opcional
  comissaoId?: string,      // Opcional
  documentos?: string[]     // Array de IDs de documentos anexos
}

// Response Success (201)
{
  success: true,
  data: {
    id: string,
    numero: string,         // Gerado automaticamente
    titulo: string,
    ementa: string,
    tipo: string,
    status: "DRAFT_INITIATED",  // Status inicial
    dataApresentacao: string,
    autorId: string,        // ID do usuário autenticado
    // ... outros campos
  },
  message: "Proposição criada com sucesso"
}
```

### 3. GET /api/v1/proposicoes/[id]
```typescript
// Headers: Authorization: Bearer <token>
// Response Success (200) - Dados completos
{
  success: true,
  data: {
    id: string,
    numero: string,
    titulo: string,
    ementa: string,
    tipo: string,
    status: string,
    statusDescricao: string,
    dataApresentacao: string,
    ultimaAtualizacao: string,
    justificativa?: string,
    textoCompleto?: string,
    observacoes?: string,
    autor: {
      id: string,
      nome: string,
      partido: string,
      cargo: string,
      email: string
    },
    relator?: { /* dados completos */ },
    comissao?: { /* dados completos */ },
    tramitacao: [
      {
        id: string,
        status: string,
        descricao: string,
        data: string,
        responsavel: {
          id: string,
          nome: string,
          cargo: string
        },
        observacoes?: string
      }
    ],
    emendas: [
      {
        id: string,
        numero: string,
        descricao: string,
        autor: string,
        data: string,
        status: string
      }
    ],
    votacoes: [
      {
        id: string,
        descricao: string,
        data: string,
        resultado: string,
        votos: {
          favoraveis: number,
          contrarios: number,
          abstencoes: number
        }
      }
    ],
    documentos: [
      {
        id: string,
        nome: string,
        tipo: string,
        tamanho: number,
        url: string,
        dataUpload: string
      }
    ],
    permissions: {
      canEdit: boolean,
      canDelete: boolean,
      canTramitar: boolean,
      canAddEmenda: boolean,
      canVote: boolean
    }
  }
}
```

### 4. PUT /api/v1/proposicoes/[id]
```typescript
// Headers: Authorization: Bearer <token>
// Request Body (campos editáveis)
{
  titulo?: string,
  ementa?: string,
  justificativa?: string,
  textoCompleto?: string,
  observacoes?: string,
  comissaoId?: string
}

// Response Success (200)
{
  success: true,
  data: { /* proposição atualizada */ },
  message: "Proposição atualizada com sucesso"
}
```

### 5. DELETE /api/v1/proposicoes/[id]
```typescript
// Headers: Authorization: Bearer <token>
// Response Success (200)
{
  success: true,
  message: "Proposição excluída com sucesso"
}
```

## 🔄 API V1 - Tramitação (COM AUTENTICAÇÃO)

### 1. GET /api/v1/proposicoes/[id]/tramitacao
```typescript
// Headers: Authorization: Bearer <token>
// Response Success (200)
{
  success: true,
  data: {
    proposicaoId: string,
    statusAtual: string,
    dataUltimaAtualizacao: string,
    historico: [
      {
        id: string,
        status: string,
        statusDescricao: string,
        descricao: string,
        data: string,
        responsavel: {
          id: string,
          nome: string,
          cargo: string
        },
        observacoes?: string,
        documentos?: [
          {
            id: string,
            nome: string,
            url: string
          }
        ]
      }
    ]
  }
}
```

### 2. POST /api/v1/proposicoes/[id]/tramitacao
```typescript
// Headers: Authorization: Bearer <token>
// Request Body
{
  status: string,           // Obrigatório - Novo status
  descricao: string,        // Obrigatório, min: 10
  observacoes?: string,     // Opcional
  documentos?: string[]     // Array de IDs de documentos
}

// Response Success (201)
{
  success: true,
  data: {
    id: string,
    proposicaoId: string,
    status: string,
    descricao: string,
    data: string,
    responsavelId: string,
    observacoes?: string
  },
  message: "Evento de tramitação adicionado com sucesso"
}
```

## 👥 API V1 - Parlamentares (COM AUTENTICAÇÃO)

### 1. GET /api/v1/parlamentares
```typescript
// Headers: Authorization: Bearer <token>
// Query Parameters
{
  page?: number,
  limit?: number,
  search?: string,
  partido?: string,
  ativo?: boolean,
  cargo?: 'VEREADOR'
}

// Response Success (200)
{
  success: true,
  data: {
    items: [
      {
        id: string,
        nome: string,
        partido: string,
        cargo: 'VEREADOR',
        email: string,
        telefone?: string,
        ativo: boolean,
        dataPosse: string,
        mandato: {
          inicio: string,
          fim: string
        },
        estatisticas: {
          totalProposicoes: number,
          proposicoesAtivas: number,
          relatorias: number
        }
      }
    ],
    pagination: { /* objeto paginação */ }
  }
}
```

### 2. POST /api/v1/parlamentares
```typescript
// Headers: Authorization: Bearer <token>
// Request Body
{
  nome: string,             // Obrigatório
  partido: string,          // Obrigatório
  cargo: 'VEREADOR',         // Obrigatório
  email: string,            // Obrigatório
  telefone?: string,        // Opcional
  dataPosse: string,        // Obrigatório
  mandatoInicio: string,    // Obrigatório
  mandatoFim: string        // Obrigatório
}

// Response Success (201)
{
  success: true,
  data: { /* parlamentar criado */ },
  message: "Parlamentar cadastrado com sucesso"
}
```

### 3. GET /api/v1/parlamentares/[id]/proposicoes
```typescript
// Headers: Authorization: Bearer <token>
// Query Parameters
{
  page?: number,
  limit?: number,
  status?: string,
  tipo?: string,
  ano?: number
}

// Response Success (200)
{
  success: true,
  data: {
    parlamentar: {
      id: string,
      nome: string,
      partido: string,
      cargo: 'VEREADOR'
    },
    items: [ /* array de proposições */ ],
    pagination: { /* objeto paginação */ }
  }
}
```

## 🏛️ API V1 - Comissões (COM AUTENTICAÇÃO)

### 1. GET /api/v1/comissoes
```typescript
// Headers: Authorization: Bearer <token>
// Response Success (200)
{
  success: true,
  data: {
    items: [
      {
        id: string,
        nome: string,
        sigla: string,
        tipo: string,
        descricao: string,
        ativa: boolean,
        presidente?: {
          id: string,
          nome: string,
          partido: string
        },
        membros: [
          {
            parlamentarId: string,
            nome: string,
            partido: string,
            funcao: 'PRESIDENTE' | 'VICE_PRESIDENTE' | 'RELATOR' | 'MEMBRO'
          }
        ],
        proposicoesAnalise: number
      }
    ]
  }
}
```

### 2. POST /api/v1/comissoes
```typescript
// Headers: Authorization: Bearer <token>
// Request Body
{
  nome: string,             // Obrigatório
  sigla: string,            // Obrigatório
  tipo: string,             // Obrigatório
  descricao?: string,       // Opcional
  presidenteId?: string,    // Opcional
  membros?: [
    {
      parlamentarId: string,
      funcao: string
    }
  ]
}

// Response Success (201)
{
  success: true,
  data: { /* comissão criada */ },
  message: "Comissão criada com sucesso"
}
```

## 👑 Área Administrativa (COM AUTENTICAÇÃO ADMIN)

### 1. GET /api/admin/users
```typescript
// Headers: Authorization: Bearer <token>
// Permissão: ADMIN
// Query Parameters
{
  page?: number,
  limit?: number,
  search?: string,
  role?: 'ADMIN' | 'PARLAMENTAR' | 'SECRETARIO' | 'VISITANTE',
  ativo?: boolean
}

// Response Success (200)
{
  success: true,
  data: {
    items: [
      {
        id: string,
        nome: string,
        email: string,
        role: string,
        ativo: boolean,
        ultimoLogin?: string,
        dataCriacao: string,
        parlamentar?: {
          id: string,
          nome: string,
          partido: string
        }
      }
    ],
    pagination: { /* objeto paginação */ }
  }
}
```

### 2. POST /api/admin/users
```typescript
// Headers: Authorization: Bearer <token>
// Permissão: ADMIN
// Request Body
{
  nome: string,             // Obrigatório
  email: string,            // Obrigatório, único
  senha: string,            // Obrigatório, min: 8
  role: 'ADMIN' | 'PARLAMENTAR' | 'SECRETARIO' | 'VISITANTE', // Obrigatório
  parlamentarId?: string,   // Obrigatório se role = PARLAMENTAR
  ativo?: boolean           // Padrão: true
}

// Response Success (201)
{
  success: true,
  data: { /* usuário criado */ },
  message: "Usuário criado com sucesso"
}
```

### 3. GET /api/admin/stats
```typescript
// Headers: Authorization: Bearer <token>
// Permissão: ADMIN
// Response Success (200)
{
  success: true,
  data: {
    usuarios: {
      total: number,
      ativos: number,
      porRole: {
        ADMIN: number,
        PARLAMENTAR: number,
        SECRETARIO: number,
        VISITANTE: number
      }
    },
    proposicoes: {
      total: number,
      porStatus: { [status: string]: number },
      porTipo: { [tipo: string]: number },
      porMes: [
        {
          mes: string,
          total: number
        }
      ]
    },
    tramitacao: {
      eventosHoje: number,
      eventosSemana: number,
      eventosMes: number
    },
    sistema: {
      versaoAPI: string,
      uptimeHoras: number,
      totalRequests: number,
      requestsUltimaHora: number
    }
  }
}
```

## 📎 Upload de Arquivos

### 1. POST /api/upload/documentos
```typescript
// Headers: Authorization: Bearer <token>
// Content-Type: multipart/form-data
// Request Body (FormData)
{
  file: File,               // Obrigatório, max: 10MB
  descricao?: string,       // Opcional
  categoria?: string        // Opcional
}

// Response Success (201)
{
  success: true,
  data: {
    id: string,
    nome: string,
    nomeOriginal: string,
    tamanho: number,
    tipo: string,
    url: string,
    categoria?: string,
    descricao?: string,
    dataUpload: string,
    uploadedBy: string
  },
  message: "Documento enviado com sucesso"
}
```

### 2. POST /api/upload/imagens
```typescript
// Headers: Authorization: Bearer <token>
// Content-Type: multipart/form-data
// Request Body (FormData)
{
  file: File,               // Obrigatório, max: 5MB, jpg/png/gif
  alt?: string,             // Texto alternativo
  categoria?: string        // Opcional
}

// Response Success (201)
{
  success: true,
  data: {
    id: string,
    nome: string,
    nomeOriginal: string,
    tamanho: number,
    tipo: string,
    url: string,
    thumbnail?: string,       // URL da miniatura
    dimensoes: {
      width: number,
      height: number
    },
    alt?: string,
    categoria?: string,
    dataUpload: string,
    uploadedBy: string
  },
  message: "Imagem enviada com sucesso"
}
```

## 📈 Estados de Tramitação - IMPLEMENTAR

```typescript
// Enum que deve ser implementado no backend
enum TramitacaoStatus {
  // Fase de Criação
  DRAFT_INITIATED = 'DRAFT_INITIATED',
  DRAFT_IN_PROGRESS = 'DRAFT_IN_PROGRESS', 
  DRAFT_REVIEWING = 'DRAFT_REVIEWING',
  
  // Fase de Análise
  COMMITTEE_ASSIGNED = 'COMMITTEE_ASSIGNED',
  COMMITTEE_ANALYSIS = 'COMMITTEE_ANALYSIS',
  COMMITTEE_VOTING = 'COMMITTEE_VOTING',
  
  // Fase de Discussão
  PLENARY_DISCUSSION = 'PLENARY_DISCUSSION',
  PLENARY_VOTING = 'PLENARY_VOTING',
  
  // Fase de Aprovação
  APPROVED_AWAITING_SANCTION = 'APPROVED_AWAITING_SANCTION',
  APPROVED_SANCTIONED = 'APPROVED_SANCTIONED',
  
  // Fase de Rejeição
  REJECTED_COMMITTEE = 'REJECTED_COMMITTEE',
  REJECTED_PLENARY = 'REJECTED_PLENARY',
  REJECTED_ARCHIVED = 'REJECTED_ARCHIVED',
  
  // Fase de Finalização
  PUBLISHED_ACTIVE = 'PUBLISHED_ACTIVE',
  WITHDRAWN = 'WITHDRAWN'
}

// Tipos de proposição
enum ProposicaoTipo {
  PL = 'PL',      // Projeto de Lei
  PLP = 'PLP',    // Projeto de Lei Complementar
  PEC = 'PEC',    // Proposta de Emenda Constitucional
  PDC = 'PDC',    // Projeto de Decreto Legislativo
  PRL = 'PRL',    // Projeto de Resolução Legislativa
  PRS = 'PRS',    // Projeto de Resolução do Senado
  PLN = 'PLN'     // Projeto de Lei do Orçamento
}

// Roles de usuário
enum UserRole {
  ADMIN = 'ADMIN',
  PARLAMENTAR = 'PARLAMENTAR',
  SECRETARIO = 'SECRETARIO',
  VISITANTE = 'VISITANTE'
}
```

## ⚡ Especificações Técnicas

### Rate Limiting
- **Geral**: 100 req/min por IP
- **Upload**: 10 req/min por usuário  
- **Admin**: 500 req/min

### Validações de Upload
- **Documentos**: PDF, DOC, DOCX (max: 10MB)
- **Imagens**: JPG, PNG, GIF (max: 5MB)

### Headers Obrigatórios
```typescript
// Todos os endpoints autenticados
Authorization: "Bearer <jwt_token>"
Content-Type: "application/json"

// Endpoints de upload
Content-Type: "multipart/form-data"
```

### Códigos de Status HTTP
- `200` - Sucesso
- `201` - Criado com sucesso
- `400` - Dados inválidos
- `401` - Não autenticado
- `403` - Sem permissão
- `404` - Não encontrado
- `422` - Erro de validação
- `429` - Muitas requisições
- `500` - Erro interno

## 🔧 Variáveis de Ambiente Necessárias

```env
# Database
DATABASE_URL="file:./dev.db"

# JWT
JWT_SECRET="your-secret-key-here"
JWT_EXPIRES_IN="24h"
REFRESH_TOKEN_EXPIRES_IN="7d"

# Upload
UPLOAD_DIR="./uploads"
MAX_FILE_SIZE_DOCS="10485760"    # 10MB
MAX_FILE_SIZE_IMAGES="5242880"   # 5MB

# API
API_VERSION="v1"
RATE_LIMIT_WINDOW="60000"        # 1 minuto
RATE_LIMIT_MAX="100"

# URLs
FRONTEND_URL="http://localhost:3000"
API_BASE_URL="http://localhost:3000/api"
```

---

**Última Atualização**: 26 de junho de 2025  
**Versão da API**: v1.0.0  
**Status**: �� Em Implementação 