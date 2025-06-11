# 🗄️ Database Strategy - SQLite First com API Abstraction

## 🎯 **Estratégia Geral: SQLite → APIs Externas**

### 📋 **Motivação**
- **Desenvolvimento Rápido**: SQLite não requer setup de servidor
- **Prototipagem Ágil**: Mudanças rápidas no schema durante desenvolvimento
- **API Simulation**: Endpoints internos simulam comportamento de APIs externas
- **Migração Transparente**: Switch simples via environment variable

## 🏗️ **Arquitetura de Abstração**

### 🔄 **Data Layer Pattern**

```typescript
// src/lib/data-layer.ts
export interface DataService<T> {
  findMany(params?: QueryParams): Promise<T[]>
  findById(id: string): Promise<T | null>
  create(data: CreateInput<T>): Promise<T>
  update(id: string, data: UpdateInput<T>): Promise<T>
  delete(id: string): Promise<void>
}

// Implementações específicas
export class LocalProposicaoService implements DataService<Proposicao> {
  // Implementação usando Prisma + SQLite
}

export class ExternalProposicaoService implements DataService<Proposicao> {
  // Implementação usando fetch() para APIs externas
}
```

### 🎛️ **Environment Toggle**

```bash
# .env.local
DATABASE_URL="file:./dev.db"
USE_EXTERNAL_API="false"  # true para APIs externas

# Para produção
DATABASE_URL="postgresql://..."
USE_EXTERNAL_API="true"
EXTERNAL_API_BASE_URL="https://api.parlamentar.gov.br"
EXTERNAL_API_TOKEN="your-token"
```

## 📊 **Schema SQLite (Desenvolvimento)**

### 🗃️ **Prisma Schema**

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String
  role      Role     @default(PUBLIC)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relacionamentos específicos por role
  parlamentar Parlamentar?
  admin       Admin?

  @@map("users")
}

model Parlamentar {
  id            String    @id @default(cuid())
  userId        String    @unique
  user          User      @relation(fields: [userId], references: [id])
  
  // Dados do parlamentar
  matricula     String    @unique
  nome          String
  partido       String
  uf            String
  mandatoInicio DateTime
  mandatoFim    DateTime?
  ativo         Boolean   @default(true)
  
  // Relacionamentos
  proposicoes   Proposicao[]
  relatorias    Relatoria[]
  presencas     Presenca[]
  
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  @@map("parlamentares")
}

model Proposicao {
  id          String            @id @default(cuid())
  numero      String
  ano         Int
  tipo        TipoProposicao
  ementa      String
  autorId     String
  autor       Parlamentar       @relation(fields: [autorId], references: [id])
  
  // Estado de tramitação
  estadoAtual EstadoTramitacao  @default(DRAFT_INITIATED)
  
  // Timestamps
  dataApresentacao DateTime
  createdAt        DateTime      @default(now())
  updatedAt        DateTime      @updatedAt
  
  // Relacionamentos
  tramitacoes      TramitacaoEvento[]
  relatorias       Relatoria[]
  emendas          Emenda[]
  
  @@unique([numero, ano, tipo])
  @@map("proposicoes")
}

model TramitacaoEvento {
  id            String           @id @default(cuid())
  proposicaoId  String
  proposicao    Proposicao       @relation(fields: [proposicaoId], references: [id])
  
  // Estado da tramitação
  estadoAnterior EstadoTramitacao?
  estadoNovo     EstadoTramitacao
  
  // Contexto do evento
  comissaoId     String?
  responsavelId  String?
  observacoes    String?
  
  // Timestamps
  dataEvento     DateTime
  createdAt      DateTime         @default(now())
  
  @@map("tramitacao_eventos")
}

// Enums para controle de estado
enum Role {
  PUBLIC
  PARLAMENTAR  
  ADMIN
}

enum TipoProposicao {
  PL    // Projeto de Lei
  PLC   // Projeto de Lei Complementar
  PLO   // Projeto de Lei Orçamentária
  MP    // Medida Provisória
  PEC   // Proposta de Emenda Constitucional
  REQ   // Requerimento
  INC   // Indicação
}

enum EstadoTramitacao {
  // Fase 1: Criação e Recepção
  DRAFT_INITIATED
  SUBMITTED_FOR_REVIEW
  UNDER_FORMAL_REVIEW
  FORMAL_REVIEW_APPROVED
  
  // Fase 2: Revisão em Comissão
  COMMITTEE_ASSIGNED
  IN_COMMITTEE_REVIEW
  COMMITTEE_ANALYZING
  PENDING_RAPPORTEUR_OPINION
  RAPPORTEUR_OPINION_ISSUED
  IN_COMMITTEE_VOTING
  COMMITTEE_APPROVED
  COMMITTEE_REJECTED
  RETURNED_TO_COMMITTEE
  
  // Fase 3: Sessão Plenária
  READY_FOR_PLENARY
  IN_PLENARY_DISCUSSION
  PENDING_AMENDMENTS
  IN_VOTING
  PLENARY_APPROVED
  PLENARY_REJECTED
  
  // Fase 4: Processo Bicameral
  IN_REVIEWING_HOUSE
  REVIEWING_HOUSE_APPROVED
  REVIEWING_HOUSE_MODIFIED
  IN_BICAMERAL_CONFLICT_RESOLUTION
  
  // Fase 5: Revisão Executiva
  SENT_TO_EXECUTIVE
  UNDER_EXECUTIVE_REVIEW
  EXECUTIVE_SANCTIONED
  EXECUTIVE_VETOED
  VETO_OVERRIDE_VOTING
  
  // Fase 6: Finalização
  PROMULGATED
  PUBLISHED_ACTIVE
  
  // Estados Especiais
  ARCHIVED
  WITHDRAWN
  EXPIRED
}
```

## 🌐 **APIs Internas (Mock External APIs)**

### 📡 **API Routes Structure**

```typescript
// src/app/api/v1/proposicoes/route.ts
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '10')
  
  // Usa o data layer (SQLite ou External API)
  const proposicoes = await dataLayer.proposicoes.findMany({
    page,
    limit,
    filters: {
      estado: searchParams.get('estado'),
      tipo: searchParams.get('tipo'),
      autor: searchParams.get('autor')
    }
  })
  
  return Response.json({
    data: proposicoes,
    pagination: {
      page,
      limit,
      total: proposicoes.length
    }
  })
}

// src/app/api/v1/proposicoes/[id]/tramitacao/route.ts
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const body = await request.json()
  
  // Valida transição de estado
  const isValidTransition = await validateStateTransition(
    params.id,
    body.novoEstado
  )
  
  if (!isValidTransition) {
    return Response.json(
      { error: 'Transição de estado inválida' },
      { status: 400 }
    )
  }
  
  // Executa tramitação
  const evento = await dataLayer.tramitacao.create({
    proposicaoId: params.id,
    estadoNovo: body.novoEstado,
    responsavelId: body.responsavelId,
    observacoes: body.observacoes
  })
  
  // Dispara evento no Event Bus
  await eventBus.publish('state_transition', {
    proposicaoId: params.id,
    estadoAnterior: body.estadoAnterior,
    estadoNovo: body.novoEstado,
    timestamp: new Date()
  })
  
  return Response.json(evento, { status: 201 })
}
```

### 🔄 **Data Layer Implementation**

```typescript
// src/lib/services/local/local-proposicao.service.ts
export class LocalProposicaoService implements DataService<Proposicao> {
  constructor(private prisma: PrismaClient) {}
  
  async findMany(params?: QueryParams): Promise<Proposicao[]> {
    return this.prisma.proposicao.findMany({
      skip: (params?.page - 1) * params?.limit,
      take: params?.limit,
      where: {
        estadoAtual: params?.filters?.estado,
        tipo: params?.filters?.tipo,
        autor: {
          nome: {
            contains: params?.filters?.autor
          }
        }
      },
      include: {
        autor: true,
        tramitacoes: {
          orderBy: { dataEvento: 'desc' },
          take: 5
        }
      }
    })
  }
  
  async findById(id: string): Promise<Proposicao | null> {
    return this.prisma.proposicao.findUnique({
      where: { id },
      include: {
        autor: true,
        tramitacoes: {
          orderBy: { dataEvento: 'desc' }
        },
        relatorias: {
          include: { parlamentar: true }
        }
      }
    })
  }
  
  // ... outros métodos
}

// src/lib/services/external/external-proposicao.service.ts  
export class ExternalProposicaoService implements DataService<Proposicao> {
  constructor(
    private baseUrl: string,
    private apiToken: string
  ) {}
  
  async findMany(params?: QueryParams): Promise<Proposicao[]> {
    const url = new URL(`${this.baseUrl}/proposicoes`)
    
    if (params?.page) url.searchParams.set('page', params.page.toString())
    if (params?.limit) url.searchParams.set('limit', params.limit.toString())
    if (params?.filters?.estado) {
      url.searchParams.set('estado', params.filters.estado)
    }
    
    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': `Bearer ${this.apiToken}`,
        'Content-Type': 'application/json'
      }
    })
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`)
    }
    
    const result = await response.json()
    return result.data
  }
  
  // ... outros métodos usando fetch()
}
```

## 🚀 **Data Layer Factory**

```typescript
// src/lib/data-layer.factory.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

function createDataLayer(): DataLayer {
  const useExternalAPI = process.env.USE_EXTERNAL_API === 'true'
  
  if (useExternalAPI) {
    const baseUrl = process.env.EXTERNAL_API_BASE_URL!
    const token = process.env.EXTERNAL_API_TOKEN!
    
    return {
      proposicoes: new ExternalProposicaoService(baseUrl, token),
      parlamentares: new ExternalParlamentarService(baseUrl, token),
      tramitacao: new ExternalTramitacaoService(baseUrl, token)
    }
  }
  
  // Desenvolvimento com SQLite
  return {
    proposicoes: new LocalProposicaoService(prisma),
    parlamentares: new LocalParlamentarService(prisma),
    tramitacao: new LocalTramitacaoService(prisma)
  }
}

export const dataLayer = createDataLayer()
```

## 📊 **Mock Data & Seeding**

### 🎭 **Seed Script**

```typescript
// prisma/seed.ts
import { PrismaClient, EstadoTramitacao, TipoProposicao } from '@prisma/client'
import { faker } from '@faker-js/faker'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')
  
  // 1. Criar usuários base
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@parlamentar.gov.br',
      name: 'Administrador Sistema',
      role: 'ADMIN'
    }
  })
  
  // 2. Criar parlamentares
  const parlamentares = []
  for (let i = 0; i < 50; i++) {
    const user = await prisma.user.create({
      data: {
        email: faker.internet.email(),
        name: faker.person.fullName(),
        role: 'PARLAMENTAR'
      }
    })
    
    const parlamentar = await prisma.parlamentar.create({
      data: {
        userId: user.id,
        matricula: `PAR${String(i + 1).padStart(4, '0')}`,
        nome: user.name,
        partido: faker.helpers.arrayElement(['PT', 'PSDB', 'MDB', 'PP', 'PSL']),
        uf: faker.location.state({ abbreviated: true }),
        mandatoInicio: faker.date.past({ years: 2 }),
        ativo: faker.datatype.boolean({ probability: 0.9 })
      }
    })
    
    parlamentares.push(parlamentar)
  }
  
  // 3. Criar proposições com estados realistas
  for (let i = 0; i < 200; i++) {
    const autor = faker.helpers.arrayElement(parlamentares)
    const tipo = faker.helpers.arrayElement(Object.values(TipoProposicao))
    
    const proposicao = await prisma.proposicao.create({
      data: {
        numero: String(i + 1),
        ano: faker.date.recent({ days: 365 }).getFullYear(),
        tipo: tipo,
        ementa: faker.lorem.paragraph(),
        autorId: autor.id,
        estadoAtual: faker.helpers.arrayElement(Object.values(EstadoTramitacao)),
        dataApresentacao: faker.date.recent({ days: 180 })
      }
    })
    
    // 4. Criar eventos de tramitação
    const numEventos = faker.number.int({ min: 1, max: 8 })
    let estadoAtual = EstadoTramitacao.DRAFT_INITIATED
    
    for (let j = 0; j < numEventos; j++) {
      const estadoNovo = getNextValidState(estadoAtual)
      
      await prisma.tramitacaoEvento.create({
        data: {
          proposicaoId: proposicao.id,
          estadoAnterior: j === 0 ? null : estadoAtual,
          estadoNovo: estadoNovo,
          dataEvento: faker.date.recent({ days: 90 }),
          observacoes: faker.lorem.sentence()
        }
      })
      
      estadoAtual = estadoNovo
    }
    
    // Atualiza estado atual da proposição
    await prisma.proposicao.update({
      where: { id: proposicao.id },
      data: { estadoAtual }
    })
  }
  
  console.log('✅ Database seeded successfully!')
}

function getNextValidState(current: EstadoTramitacao): EstadoTramitacao {
  // Lógica de transição de estados válida
  const transitions: Record<EstadoTramitacao, EstadoTramitacao[]> = {
    [EstadoTramitacao.DRAFT_INITIATED]: [EstadoTramitacao.SUBMITTED_FOR_REVIEW],
    [EstadoTramitacao.SUBMITTED_FOR_REVIEW]: [EstadoTramitacao.UNDER_FORMAL_REVIEW],
    // ... mapeamento completo
  }
  
  const validNext = transitions[current] || [current]
  return faker.helpers.arrayElement(validNext)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```

## 🔄 **Migration Strategy**

### 📋 **Roadmap de Migração**

#### **Fase 1: SQLite Development (Sprint 1-2)**
- ✅ Schema design e validação
- ✅ Mock data completo
- ✅ APIs internas funcionais
- ✅ Interface working com dados locais

#### **Fase 2: API Simulation (Sprint 3-4)**
- 🔄 Implementar External services (mock)
- 🔄 Testing da alternância SQLite ↔ External
- 🔄 Performance comparison
- 🔄 Error handling para ambos os cenários

#### **Fase 3: Production Migration (Sprint 5+)**
- 🔄 Integração com APIs reais
- 🔄 Data migration scripts
- 🔄 Monitoring e observability
- 🔄 Rollback strategy

### 🎛️ **Environment Management**

```bash
# Desenvolvimento Local
DATABASE_URL="file:./dev.db"
USE_EXTERNAL_API="false"

# Staging (Hybrid)
DATABASE_URL="file:./staging.db"
USE_EXTERNAL_API="true"
EXTERNAL_API_BASE_URL="https://staging-api.parlamentar.gov.br"

# Produção
DATABASE_URL="postgresql://prod-db-url"
USE_EXTERNAL_API="true"
EXTERNAL_API_BASE_URL="https://api.parlamentar.gov.br"
```

## 📊 **Vantagens desta Estratégia**

### ⚡ **Desenvolvimento**
- **Zero Setup**: SQLite funciona imediatamente
- **Rapid Prototyping**: Mudanças de schema instantâneas
- **Offline Development**: Não depende de APIs externas
- **Easy Testing**: Database isolation para testes

### 🔄 **Flexibilidade**
- **Seamless Migration**: Troca transparente via env var
- **Hybrid Mode**: Alguns dados local, outros external
- **Rollback Safety**: Volta para SQLite se APIs falharem
- **Development Speed**: Time não blockeado por APIs externas

### 🚀 **Produção**
- **API Ready**: Transição suave para produção
- **Performance Testing**: Comparação SQLite vs APIs
- **Gradual Migration**: Migração progressiva por módulo
- **Monitoring**: Métricas para ambas as abordagens

---

**Status**: 🎯 Estratégia Definida - Ready for Implementation  
**Next Step**: 🏗️ Prisma Schema Setup + Data Layer Implementation  
**Timeline**: 📅 Sprint 2 (Database Infrastructure)  
**Benefits**: ⚡ Zero Setup + 🔄 Easy Migration + �� Production Ready 