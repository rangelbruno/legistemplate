# 🎯 Active Context - Sistema de Tramitação Parlamentar

## 📍 **Foco Atual de Desenvolvimento**

### 🚀 **Fase Atual: Estruturação e Foundation**

**Status**: 🏗️ **Criando Memory Bank System e Estrutura Base**

#### 🎯 **Objetivos Imediatos**
1. ✅ **Memory Bank System** - Documentação estrutural completa
2. 🔄 **Estrutura de Pastas** - Organização Next.js App Router
3. 📋 **Template Analysis** - Mapeamento completo do template existente
4. 🏗️ **Layouts Base** - Implementação dos layouts principais

### 📊 **Progresso Atual (Week 1)**

```
┌─────────────────────────────────────────┐
│ Memory Bank System             [✅ 100%]│
├─────────────────────────────────────────┤
│ ├── projectbrief.md           [✅ Done] │
│ ├── productContext.md         [✅ Done] │
│ ├── systemArchitecture.md     [✅ Done] │
│ ├── techStack.md              [✅ Done] │
│ ├── activeContext.md          [🔄 Now]  │
│ └── progress.md               [⏳ Next] │
├─────────────────────────────────────────┤
│ Template Analysis              [⏳ 0%]  │
│ Next.js App Router Setup      [⏳ 0%]  │
│ Layouts Implementation        [⏳ 0%]  │
└─────────────────────────────────────────┘
```

## 🔧 **Decisões Técnicas Recentes**

### ✅ **Arquitetura Confirmada**

#### 🏗️ **Next.js 14 App Router**
- **Escolha**: App Router ao invés de Pages Router
- **Razão**: Melhor performance, Server Components, layouts aninhados
- **Impacto**: Estrutura mais moderna e escalável

#### 🎨 **Estratégia de Template**
- **Escolha**: Reutilização total do template React existente
- **Razão**: Acelerar desenvolvimento, manter consistência visual
- **Impacto**: Zero criação de CSS/JS novo, foco na lógica de negócio

#### 🔄 **Renderização Híbrida**
- **Público**: SSG (Static Site Generation) para SEO máximo
- **Parlamentar**: SSR (Server-Side Rendering) para dados em tempo real
- **Admin**: CSR (Client-Side Rendering) para interatividade
- **Benefício**: Performance otimizada por tipo de usuário

### 📂 **Estrutura de Pastas Definida**

#### 🎯 **Route Groups Strategy**
```typescript
app/
├── (auth)/          // Não afeta URL: /login, /register
├── parlamentar/     // Área protegida: /parlamentar/*
├── admin/           // Área admin: /admin/*
├── publico/         // Área pública: /publico/*
└── api/             // APIs: /api/v1/*
```

#### 🧩 **Component Architecture**
- **layouts/**: Reutilização máxima entre áreas
- **[area]/**: Componentes específicos por domínio
- **ui/**: Componentes base do template
- **Vantagem**: Separação clara, fácil manutenção

### 🔐 **Autenticação e Autorização**

#### 🛡️ **NextAuth.js Strategy**
- **Providers**: Credentials + Azure AD
- **Session**: JWT para performance
- **Roles**: 'parlamentar', 'admin', 'public'
- **Middleware**: Proteção automática de rotas

## 🎯 **Próximos Passos Imediatos**

### 📅 **Sprint 1 (Próximos 7 dias)**

#### 🔍 **1. Template Analysis e Inventory**
```bash
├── 📋 Mapear componentes UI existentes
├── 🎨 Documentar design system (cores, tipografia)
├── 🧩 Listar layouts e grids disponíveis
├── 📱 Testar responsividade atual
└── 🔗 Identificar dependências e assets
```

#### 🏗️ **2. Next.js App Router Setup**
```bash
├── 🏠 Configurar root layout
├── 🎭 Implementar route groups
├── 📄 Criar páginas básicas (placeholder)
├── 🔄 Setup de layouts por área
└── ⚡ Configurar loading/error boundaries
```

#### 🎨 **3. Layouts Base Implementation**
```bash
├── 🏛️ ParlamentarLayout (sidebar + header)
├── ⚙️ AdminLayout (dark theme + advanced sidebar)
├── 🌐 PublicLayout (simple header + footer)
├── 🔐 AuthLayout (centered forms)
└── 📱 Mobile responsive para todos
```

### 📅 **Sprint 2 (Semana 2)**

#### 🗄️ **Database & API Setup**
- Prisma schema para entidades parlamentares
- API routes base para cada área
- Mock data para desenvolvimento
- NextAuth.js configuração completa

#### 🧩 **Core Components**
- Cards de proposição (adaptados do template)
- Tabelas de dados (com paginação)
- Formulários base (validação Zod)
- Modais e dropdowns

#### 🎭 **Dashboard Parlamentar**
- KPIs cards (template stats components)
- Lista de proposições prioritárias
- Calendar widget para agenda
- Panel de alertas

## 🚧 **Desafios e Considerações**

### ⚠️ **Possíveis Bloqueadores**

#### 🔍 **Template Compatibility**
- **Risco**: Componentes podem não ser facilmente adaptáveis
- **Mitigação**: Análise detalhada antes da implementação
- **Contingência**: Usar biblioteca UI como fallback (Radix UI)

#### 📱 **Mobile Responsiveness**
- **Risco**: Template pode não ser totalmente responsivo
- **Mitigação**: Testes extensivos em dispositivos
- **Contingência**: CSS custom para mobile específico

#### 🔄 **Next.js App Router Learning Curve**
- **Risco**: Time pode ter dificuldades com novos conceitos
- **Mitigação**: Documentação detalhada e exemplos
- **Contingência**: Fallback para Pages Router se necessário

### 💡 **Oportunidades de Otimização**

#### ⚡ **Performance**
- **Image Optimization**: Vercel Image para avatars/documentos
- **Code Splitting**: Lazy loading de componentes pesados
- **Edge Functions**: APIs geográficamente distribuídas

#### 🔍 **SEO Enhancement**
- **Structured Data**: JSON-LD para proposições
- **Sitemap Dinâmico**: Atualização automática
- **Meta Tags**: Dinâmicas por página/proposição

## 📊 **Métricas de Acompanhamento**

### 🎯 **KPIs de Desenvolvimento**

#### ⏱️ **Velocidade**
- **Target**: Setup completo em 2 sprints
- **Medição**: Páginas funcionais por semana
- **Meta**: 5 páginas/sprint

#### 🎨 **Reaproveitamento**
- **Target**: >80% de componentes do template
- **Medição**: Novos componentes criados vs. reutilizados
- **Meta**: Máximo 20% de código novo

#### 🐛 **Qualidade**
- **Target**: Zero bugs críticos
- **Medição**: Issues abertas vs. fechadas
- **Meta**: 100% de cobertura de testes críticos

### 📱 **UX Metrics**

#### ⚡ **Performance**
- **LCP**: < 2.5s (target < 1.5s)
- **FID**: < 100ms (target < 50ms)
- **CLS**: < 0.1 (target < 0.05)

---

**Fase Atual**: 🏗️ Foundation & Structure  
**Próximo Marco**: 🎨 Template Integration Complete  
**Timeline**: 📅 2 sprints (14 dias)  
**Prioridade**: 🔥 Template Analysis & Basic Layouts 