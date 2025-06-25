# 📁 Estrutura de Pastas - Sistema de Tramitação Parlamentar

## 🏗️ **Arquitetura Geral do Projeto**

```
legistemplate/
├── docs/                                 # Documentação e Memory Bank
│   ├── memory-bank/                      # Sistema de Memory Bank
│   │   ├── projectbrief.md              # Objetivo e escopo
│   │   ├── productContext.md            # Problemas e experiência
│   │   ├── systemArchitecture.md        # Convenções e arquitetura
│   │   ├── techStack.md                 # Tecnologias e dependências
│   │   ├── activeContext.md             # Foco atual de desenvolvimento
│   │   └── progress.md                  # Status e funcionalidades
│   ├── telas-react-template.md          # Template existente ✅
│   ├── api-endpoints.md                 # Documentação das APIs
│   └── fluxos-tramitacao.md            # Fluxos legislativos
│
├── src/
│   ├── app/                             # Next.js App Router (v14+)
│   │   ├── layout.tsx                   # Layout raiz
│   │   ├── page.tsx                     # Página inicial pública
│   │   ├── globals.css                  # Estilos globais
│   │   │
│   │   ├── (auth)/                      # Route Group - Autenticação
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── register/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   │
│   │   ├── parlamentar/                 # Área do Parlamentar
│   │   │   ├── layout.tsx               # Layout específico
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx             # Dashboard parlamentar
│   │   │   ├── proposicoes/
│   │   │   │   ├── page.tsx             # Lista geral
│   │   │   │   ├── [id]/                # Proposição específica
│   │   │   │   │   └── page.tsx
│   │   │   │   └── minhas/
│   │   │   │       └── page.tsx         # Proposições do parlamentar
│   │   │   ├── agenda/
│   │   │   │   └── page.tsx
│   │   │   ├── comissoes/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx
│   │   │   └── relatorias/
│   │   │       └── page.tsx
│   │   │
│   │   ├── admin/                       # Área Administrativa
│   │   │   ├── layout.tsx
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx
│   │   │   ├── usuarios/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx
│   │   │   ├── tramitacao/
│   │   │   │   ├── page.tsx             # Gestão de tramitação
│   │   │   │   └── [proposicaoId]/
│   │   │   │       └── page.tsx
│   │   │   ├── comissoes/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx
│   │   │   └── relatorios/
│   │   │       └── page.tsx
│   │   │
│   │   ├── publico/                     # Área Pública
│   │   │   ├── layout.tsx
│   │   │   ├── proposicoes/
│   │   │   │   ├── page.tsx             # Busca pública
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx         # Detalhes públicos
│   │   │   ├── parlamentares/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx
│   │   │   ├── sessoes/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx
│   │   │   └── transparencia/
│   │   │       └── page.tsx
│   │   │
│   │   └── api/                         # API Routes do Next.js
│   │       ├── auth/
│   │       │   └── route.ts
│   │       ├── v1/
│   │       │   ├── parlamentar/
│   │       │   │   ├── [id]/
│   │       │   │   │   ├── dashboard/
│   │       │   │   │   │   └── route.ts
│   │       │   │   │   ├── proposicoes/
│   │       │   │   │   │   └── route.ts
│   │       │   │   │   └── agenda/
│   │       │   │   │       └── route.ts
│   │       │   │   └── route.ts
│   │       │   ├── proposicoes/
│   │       │   │   ├── route.ts
│   │       │   │   └── [id]/
│   │       │   │       ├── route.ts
│   │       │   │       └── tramitacao/
│   │       │   │           └── route.ts
│   │       │   ├── comissoes/
│   │       │   │   └── route.ts
│   │       │   └── admin/
│   │       │       └── route.ts
│   │       └── webhooks/
│   │           └── route.ts
│   │
│   ├── components/                      # Componentes React
│   │   ├── layouts/                     # Layouts reutilizáveis
│   │   │   ├── AppLayout.tsx           # Layout base do sistema
│   │   │   ├── ParlamentarLayout.tsx   # Layout área parlamentar
│   │   │   ├── AdminLayout.tsx         # Layout área admin
│   │   │   ├── PublicLayout.tsx        # Layout área pública
│   │   │   ├── Header.tsx              # Cabeçalho
│   │   │   ├── Sidebar.tsx             # Menu lateral
│   │   │   └── Footer.tsx              # Rodapé
│   │   │
│   │   ├── parlamentar/                # Componentes específicos
│   │   │   ├── DashboardStats.tsx      # KPIs parlamentar
│   │   │   ├── ProposicaoCard.tsx      # Card de proposição
│   │   │   ├── AgendaCalendar.tsx      # Calendário de agenda
│   │   │   ├── AlertPanel.tsx          # Painel de alertas
│   │   │   └── TramitacaoTimeline.tsx  # Timeline de tramitação
│   │   │
│   │   ├── admin/                      # Componentes admin
│   │   │   ├── TramitacaoManager.tsx   # Gestão de tramitação
│   │   │   ├── UserTable.tsx           # Tabela de usuários
│   │   │   └── SystemStats.tsx         # Estatísticas do sistema
│   │   │
│   │   ├── publico/                    # Componentes públicos
│   │   │   ├── SearchProposicoes.tsx   # Busca pública
│   │   │   ├── ParlamentarCard.tsx     # Card parlamentar
│   │   │   └── TransparenciaPanel.tsx  # Painel transparência
│   │   │
│   │   └── ui/                         # Componentes UI base
│   │       ├── Button.tsx              # Botão customizado
│   │       ├── Card.tsx                # Card base
│   │       ├── Table.tsx               # Tabela base
│   │       ├── Modal.tsx               # Modal base
│   │       ├── Form/                   # Componentes de formulário
│   │       │   ├── Input.tsx
│   │       │   ├── Select.tsx
│   │       │   ├── DatePicker.tsx
│   │       │   └── TextArea.tsx
│   │       └── Navigation/             # Componentes navegação
│   │           ├── Breadcrumb.tsx
│   │           ├── Pagination.tsx
│   │           └── Tabs.tsx
│   │
│   ├── lib/                            # Utilitários e configurações
│   │   ├── auth.ts                     # Configuração autenticação
│   │   ├── database.ts                 # Configuração banco de dados
│   │   ├── api.ts                      # Cliente API
│   │   ├── utils.ts                    # Funções utilitárias
│   │   ├── constants.ts                # Constantes do sistema
│   │   ├── validations.ts              # Esquemas de validação
│   │   └── types.ts                    # TypeScript types
│   │
│   ├── hooks/                          # Custom Hooks
│   │   ├── useAuth.ts                  # Hook de autenticação
│   │   ├── useParlamentar.ts           # Hook dados parlamentar
│   │   ├── useProposicoes.ts           # Hook proposições
│   │   ├── useTramitacao.ts            # Hook tramitação
│   │   └── useApi.ts                   # Hook genérico API
│   │
│   ├── context/                        # Context Providers
│   │   ├── AuthContext.tsx             # Contexto autenticação
│   │   ├── ThemeContext.tsx            # Contexto tema
│   │   └── NotificationContext.tsx     # Contexto notificações
│   │
│   ├── styles/                         # Estilos e temas
│   │   ├── globals.css                 # Estilos globais
│   │   ├── components.css              # Estilos componentes
│   │   ├── parlamentar.css             # Estilos área parlamentar
│   │   ├── admin.css                   # Estilos área admin
│   │   └── publico.css                 # Estilos área pública
│   │
│   └── data/                           # Dados estáticos e mocks
│       ├── mock-parlamentares.ts       # Mock dados parlamentares
│       ├── mock-proposicoes.ts         # Mock proposições
│       ├── tipos-proposicao.ts         # Tipos de proposição
│       └── status-tramitacao.ts        # Status de tramitação
│
├── public/                             # Assets estáticos
│   ├── images/
│   │   ├── logos/                      # Logos institucionais
│   │   ├── avatars/                    # Avatars parlamentares
│   │   └── icons/                      # Ícones do sistema
│   ├── documents/                      # Documentos exemplo
│   └── favicon.ico
│
├── .env.local                          # Variáveis ambiente local
├── .env.example                        # Exemplo variáveis
├── next.config.js                      # Configuração Next.js
├── tailwind.config.js                  # Configuração Tailwind
├── package.json                        # Dependências
├── tsconfig.json                       # Configuração TypeScript
└── README.md                           # Documentação projeto
```

## 🎯 **Princípios da Estrutura**

### 📂 **Organização por Domínio**
- **Parlamentar**: Área específica para deputados/senadores
- **Admin**: Gestão administrativa e configurações
- **Publico**: Interface pública para transparência
- **Auth**: Autenticação e autorização

### 🔄 **Reutilização Máxima**
- Template React existente como base
- Componentes UI reutilizáveis
- Layouts específicos por área
- Hooks customizados para lógica

### 🏗️ **Arquitetura Escalável**
- Next.js App Router para performance
- TypeScript para type safety
- Separação clara de responsabilidades
- APIs organizadas por versão

### 📱 **Experiência do Usuário**
- SSR/SSG para SEO e performance
- Interface responsiva
- Navegação intuitiva
- Feedback visual consistente

---

**Status**: ✅ Estrutura definida e documentada
**Próximo**: 🏗️ Implementar Memory Bank System 