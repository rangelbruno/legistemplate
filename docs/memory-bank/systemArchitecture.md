# 🏗️ System Architecture - Sistema de Tramitação Parlamentar

## 📁 **Convenções de Pastas Next.js**

### 🎯 **App Router (Next.js 14+) - Estrutura Principal**

```
src/app/                           # App Router - Roteamento baseado em arquivos
├── layout.tsx                    # Root Layout - aplicado a todas as páginas
├── page.tsx                      # Home page pública (/)
├── globals.css                   # Estilos globais CSS
├── loading.tsx                   # UI de loading global
├── error.tsx                     # Página de erro global
├── not-found.tsx                 # 404 customizado
│
├── (auth)/                       # Route Group - Não afeta URL
│   ├── layout.tsx                # Layout específico para auth
│   ├── login/
│   │   ├── page.tsx              # /login
│   │   └── loading.tsx           # Loading específico
│   └── register/
│       └── page.tsx              # /register
│
├── parlamentar/                  # Área do Parlamentar (/parlamentar/*)
│   ├── layout.tsx                # Layout com sidebar parlamentar
│   ├── @modal/                   # Parallel Route para modais
│   │   ├── default.tsx
│   │   └── (..)proposicoes/[id]/
│   │       └── page.tsx          # Modal interceptado
│   ├── dashboard/
│   │   ├── page.tsx              # /parlamentar/dashboard
│   │   ├── loading.tsx           # Skeleton do dashboard
│   │   └── error.tsx             # Error boundary
│   ├── proposicoes/
│   │   ├── page.tsx              # /parlamentar/proposicoes
│   │   ├── [id]/                 # Rota dinâmica
│   │   │   ├── page.tsx          # /parlamentar/proposicoes/[id]
│   │   │   ├── edit/
│   │   │   │   └── page.tsx      # /parlamentar/proposicoes/[id]/edit
│   │   │   └── @comments/        # Parallel Route para comentários
│   │   │       └── page.tsx
│   │   └── minhas/
│   │       └── page.tsx          # /parlamentar/proposicoes/minhas
│   ├── agenda/
│   │   └── page.tsx              # /parlamentar/agenda
│   └── relatorias/
│       └── page.tsx              # /parlamentar/relatorias
│
├── admin/                        # Área Administrativa (/admin/*)
│   ├── layout.tsx                # Layout com sidebar admin
│   ├── dashboard/
│   │   └── page.tsx              # /admin/dashboard
│   ├── usuarios/
│   │   ├── page.tsx              # /admin/usuarios
│   │   └── [id]/
│   │       ├── page.tsx          # /admin/usuarios/[id]
│   │       └── edit/
│   │           └── page.tsx      # /admin/usuarios/[id]/edit
│   └── tramitacao/
│       ├── page.tsx              # /admin/tramitacao
│       └── [proposicaoId]/
│           └── page.tsx          # /admin/tramitacao/[proposicaoId]
│
├── publico/                      # Área Pública (/publico/* ou /)
│   ├── layout.tsx                # Layout público simples
│   ├── proposicoes/
│   │   ├── page.tsx              # /publico/proposicoes (SSG)
│   │   ├── [id]/
│   │   │   └── page.tsx          # /publico/proposicoes/[id] (SSR)
│   │   └── busca/
│   │       └── page.tsx          # /publico/proposicoes/busca
│   ├── parlamentares/
│   │   ├── page.tsx              # /publico/parlamentares (SSG)
│   │   └── [id]/
│   │       └── page.tsx          # /publico/parlamentares/[id] (SSR)
│   └── transparencia/
│       └── page.tsx              # /publico/transparencia (SSG)
│
└── api/                          # API Routes
    ├── auth/
    │   └── route.ts              # /api/auth
    ├── v1/
    │   ├── parlamentar/
    │   │   ├── [id]/
    │   │   │   ├── dashboard/
    │   │   │   │   └── route.ts  # GET /api/v1/parlamentar/[id]/dashboard
    │   │   │   ├── proposicoes/
    │   │   │   │   └── route.ts  # GET /api/v1/parlamentar/[id]/proposicoes
    │   │   │   └── route.ts      # GET /api/v1/parlamentar/[id]
    │   │   └── route.ts          # GET/POST /api/v1/parlamentar
    │   ├── proposicoes/
    │   │   ├── route.ts          # GET/POST /api/v1/proposicoes
    │   │   └── [id]/
    │   │       ├── route.ts      # GET/PUT/DELETE /api/v1/proposicoes/[id]
    │   │       └── tramitacao/
    │   │           └── route.ts  # POST /api/v1/proposicoes/[id]/tramitacao
    │   └── admin/
    │       └── route.ts          # Admin APIs
    └── webhooks/
        └── route.ts              # External webhooks
```

### 📂 **Organização de Componentes**

```
src/components/
├── layouts/                      # Layouts Reutilizáveis
│   ├── AppLayout.tsx            # Layout base universal
│   ├── ParlamentarLayout.tsx    # Layout área parlamentar
│   ├── AdminLayout.tsx          # Layout área admin
│   ├── PublicLayout.tsx         # Layout área pública
│   ├── Header.tsx               # Cabeçalho adaptável
│   ├── Sidebar.tsx              # Menu lateral contextual
│   └── Footer.tsx               # Rodapé institucional
│
├── parlamentar/                 # Componentes Específicos do Parlamentar
│   ├── DashboardStats.tsx       # Cards de KPIs parlamentares
│   ├── ProposicaoCard.tsx       # Card resumo de proposição
│   ├── AgendaCalendar.tsx       # Calendário de agenda legislativa
│   ├── AlertPanel.tsx           # Painel de alertas e prazos
│   ├── TramitacaoTimeline.tsx   # Timeline de tramitação
│   └── RelatoriaStatus.tsx      # Status de relatoria
│
├── admin/                       # Componentes Administrativos
│   ├── TramitacaoManager.tsx    # Gestão de tramitação
│   ├── UserTable.tsx            # Tabela de usuários
│   ├── SystemStats.tsx          # Estatísticas do sistema
│   ├── ComissaoManager.tsx      # Gestão de comissões
│   └── RelatorioBuilder.tsx     # Construtor de relatórios
│
├── publico/                     # Componentes Públicos
│   ├── SearchProposicoes.tsx    # Busca pública de proposições
│   ├── ParlamentarCard.tsx      # Card de parlamentar
│   ├── TransparenciaPanel.tsx   # Painel de transparência
│   ├── ProposicaoPublica.tsx    # Visualização pública
│   └── SessaoAoVivo.tsx         # Transmissão ao vivo
│
└── ui/                          # Componentes UI Base (do Template)
    ├── Button.tsx               # Botões customizados
    ├── Card.tsx                 # Cards base
    ├── Table.tsx                # Tabela base
    ├── Modal.tsx                # Modal base
    ├── Form/                    # Componentes de formulário
    │   ├── Input.tsx
    │   ├── Select.tsx
    │   ├── DatePicker.tsx
    │   ├── TextArea.tsx
    │   └── FileUpload.tsx
    └── Navigation/              # Navegação
        ├── Breadcrumb.tsx
        ├── Pagination.tsx
        ├── Tabs.tsx
        └── Stepper.tsx
```

## 🎨 **Layouts e Componentes Estruturais**

### 🏠 **Root Layout (app/layout.tsx)**

```tsx
// Aplicado a TODAS as páginas
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className="antialiased bg-gray-50">
        <Providers>
          <Toast />
          <PWAUpdater />
          {children}
        </Providers>
      </body>
    </html>
  )
}
```

### 🏛️ **Parlamentar Layout**

```tsx
// src/components/layouts/ParlamentarLayout.tsx
export default function ParlamentarLayout({
  children,
  modal, // Parallel Route
}: {
  children: React.ReactNode
  modal?: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-gray-100">
      <ParlamentarSidebar />
      <div className="flex-1 flex flex-col">
        <ParlamentarHeader />
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
      {modal} {/* Modal interceptado */}
    </div>
  )
}
```

### ⚙️ **Admin Layout**

```tsx
// src/components/layouts/AdminLayout.tsx
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-gray-900">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        <main className="flex-1 overflow-auto p-6 bg-white m-4 rounded-lg">
          {children}
        </main>
      </div>
    </div>
  )
}
```

### 🌐 **Public Layout**

```tsx
// src/components/layouts/PublicLayout.tsx
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-white">
      <PublicHeader />
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
      <PublicFooter />
    </div>
  )
}
```

## 🛣️ **Rotas Dinâmicas e Grupos de Rotas**

### 📊 **Rotas Dinâmicas**

```typescript
// Padrões de rota dinâmica
/parlamentar/proposicoes/[id]           // Proposição específica
/parlamentar/proposicoes/[id]/edit      // Edição de proposição
/admin/usuarios/[id]                    // Usuário específico
/publico/parlamentares/[id]             // Perfil público parlamentar
/publico/proposicoes/[tipo]/[id]        // Proposição por tipo
```

### 🎭 **Route Groups (não afetam URL)**

```typescript
// (auth) - Agrupa rotas de autenticação
/login          // app/(auth)/login/page.tsx
/register       // app/(auth)/register/page.tsx

// Compartilham o mesmo layout sem afetar a URL
```

### 🔄 **Parallel Routes (@modal)**

```typescript
// Intercepting Routes para modais
/parlamentar/proposicoes              // Lista normal
/parlamentar/proposicoes/123         // Modal interceptado
// Quando acessada diretamente, usa page.tsx normal
// Quando navegada via Link, usa modal
```

### 📑 **Catch-all Routes**

```typescript
// [...slug] para capturar múltiplos segmentos
/publico/documentos/[...slug]         // /documentos/2024/01/projeto-lei
// params.slug = ['2024', '01', 'projeto-lei']
```

## 🔌 **Integrações Externas**

### 🔐 **Autenticação (NextAuth.js)**

```typescript
// src/lib/auth.ts
export const authConfig: NextAuthConfig = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        // Validação custom com sistema legado
        const user = await validateUser(credentials)
        return user ? { id: user.id, email: user.email, role: user.role } : null
      }
    }),
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID!,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
      tenantId: process.env.AZURE_AD_TENANT_ID!,
    })
  ],
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/login',
    error: '/auth/error',
  }
}
```

### 🗄️ **Banco de Dados (SQLite + Abstraction Layer)**

```typescript
// src/lib/database.ts
export const prisma = new PrismaClient({
  log: ['query', 'error', 'warn'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL // file:./dev.db
    }
  }
})

// src/lib/data-layer.ts - Abstraction Layer
export interface DataLayer {
  proposicoes: ProposicaoService
  parlamentares: ParlamentarService
  tramitacao: TramitacaoService
}

export const dataLayer: DataLayer = {
  proposicoes: process.env.USE_EXTERNAL_API === 'true' 
    ? new ExternalProposicaoService() 
    : new LocalProposicaoService(),
  parlamentares: process.env.USE_EXTERNAL_API === 'true'
    ? new ExternalParlamentarService()
    : new LocalParlamentarService(),
  tramitacao: process.env.USE_EXTERNAL_API === 'true'
    ? new ExternalTramitacaoService()
    : new LocalTramitacaoService()
}
```

### 🌐 **APIs REST/GraphQL**

```typescript
// src/lib/api.ts
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
})

// GraphQL Client para sistemas externos
export const graphqlClient = new GraphQLClient(
  process.env.GRAPHQL_ENDPOINT!,
  {
    headers: {
      authorization: `Bearer ${process.env.GRAPHQL_TOKEN}`,
    }
  }
)
```

### 🖼️ **CDN de Imagens (Vercel Image)**

```typescript
// next.config.js
module.exports = {
  images: {
    domains: ['cdn.parlamentar.gov.br', 'avatars.githubusercontent.com'],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['@heroicons/react', 'lucide-react'],
  }
}
```

### 🔗 **Webhooks e Integrações**

```typescript
// app/api/webhooks/route.ts
export async function POST(request: Request) {
  const signature = request.headers.get('x-signature')
  const payload = await request.text()
  
  // Validar assinatura do webhook
  const isValid = validateWebhookSignature(payload, signature)
  if (!isValid) return new Response('Unauthorized', { status: 401 })
  
  // Processar eventos
  const event = JSON.parse(payload)
  switch (event.type) {
    case 'proposicao.tramitacao':
      await handleTramitacao(event.data)
      break
    case 'sessao.iniciada':
      await handleSessaoIniciada(event.data)
      break
  }
  
  return new Response('OK')
}
```

### 📧 **Notificações (Email/Push)**

```typescript
// src/lib/notifications.ts
export class NotificationService {
  async sendEmail(to: string, template: string, data: any) {
    return await sendgrid.send({
      to,
      from: process.env.FROM_EMAIL,
      templateId: template,
      dynamicTemplateData: data
    })
  }
  
  async sendPush(userId: string, message: string) {
    const subscription = await getUserPushSubscription(userId)
    return await webpush.sendNotification(subscription, message)
  }
}
```

---

**Arquitetura**: 🏗️ Next.js 14 App Router + TypeScript  
**Estratégia**: 🔄 SSR/SSG/CSR híbrido por contexto  
**Integração**: 🔌 APIs externas + sistemas legados  
**Performance**: ⚡ Edge Functions + Image Optimization 