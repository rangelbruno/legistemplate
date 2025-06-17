# Sistema de Configurações Administrativas

## 📋 Visão Geral

Sistema completo de configurações administrativas para plataforma legislativa, incluindo interface de usuário moderna, API robusta e estrutura de banco de dados flexível.

## 🏗️ Arquitetura

### Estrutura do Banco de Dados
- **19 tabelas de configuração** organizadas por contexto
- **Relacionamentos consistentes** com auditoria automática
- **Dados seed pré-configurados** para início rápido

### Componentes Frontend
- **Interface modular** com sidebar de navegação
- **Componentes reutilizáveis** seguindo padrões do Metronic
- **Seções organizadas** por categoria funcional

### API Backend
- **5 endpoints RESTful** completos
- **Validação robusta** de dados
- **Sistema de auditoria** integrado

## 🎨 Interface de Usuário

### Página Principal (`/admin/configuracoes`)
- Layout responsivo com sidebar fixa
- Navegação por abas dinâmica
- Barra de ações flutuante
- Indicadores visuais de seções

### Componentes Principais

#### ConfigSidebar
```tsx
- Menu hierárquico com categorias
- Estados ativos/inativos
- Ícones Bootstrap Icons
- Scroll suave entre seções
```

#### ConfigContent
```tsx
- Renderização dinâmica de seções
- Estado de loading integrado
- Tratamento de erros
- Transições suaves
```

#### FixedActionBar
```tsx
- Botões de ação flutuantes
- Feedback visual de operações
- Estados de loading
- Confirmações de ação
```

## 📊 Seções de Configuração

### 1. Configurações Gerais
- **Dados da Instituição**: Nome, sigla, endereço
- **Identidade Visual**: Cores primárias e secundárias
- **Contatos**: Telefone, email, website
- **Localização**: Timezone e idioma padrão

### 2. Sessão Legislativa
- **Calendário**: Sessões ordinárias e extraordinárias
- **Horários**: Início e fim das sessões
- **Quórum**: Configuração de presença mínima
- **Períodos**: Gestão de mandatos

### 3. Perfis e Permissões
- **Níveis de Acesso**: 5 níveis hierárquicos
- **Permissões**: Granulares por módulo
- **Grupos**: Organização por departamento
- **Auditoria**: Log de alterações

### 4. Autenticação e Segurança
- **Políticas de Senha**: Complexidade e expiração
- **OAuth2**: Google, Microsoft, Gov.br
- **MFA**: Autenticação multifator
- **Sessões**: Timeout automático

### 5. Tipos de Documentos
- **Templates**: Modelos pré-definidos
- **Numeração**: Formatos automáticos
- **Categorias**: Organização hierárquica
- **Workflow**: Fluxos de aprovação

### 6. Fluxos de Trabalho
- **Estados**: Definição de tramitação
- **Transições**: Regras de mudança
- **Prazos**: Configuração automática
- **Notificações**: Alertas por prazo

### 7. Integrações Externas
- **APIs**: Configuração de endpoints
- **Webhooks**: Notificações automáticas
- **Sincronização**: Dados externos
- **Logs**: Monitoramento de integrações

### 8. Portal de Transparência
- **Visibilidade**: Dados públicos
- **LAI**: Lei de Acesso à Informação
- **Downloads**: Documentos disponíveis
- **Ouvidoria**: Canais de contato

## 🔧 API Endpoints

### GET `/api/v1/admin/config`
```json
{
  "configuracoes": {
    "gerais": { ... },
    "sessao": { ... },
    "perfis": [ ... ],
    "autenticacao": { ... },
    // ... demais seções
  }
}
```

### POST `/api/v1/admin/config`
```json
{
  "secao": "gerais",
  "dados": {
    "nomeInstituicao": "Nova Câmara",
    "corPrimaria": "#ff0000"
  }
}
```

### POST `/api/v1/admin/config/validate`
```json
{
  "secao": "autenticacao",
  "campo": "senhaMinLength",
  "valor": 12
}
```

### GET `/api/v1/admin/config/history`
```json
{
  "historico": [
    {
      "usuario": "admin",
      "acao": "UPDATE",
      "secao": "gerais",
      "dataHora": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### POST `/api/v1/admin/config/export`
```json
{
  "formato": "json", // ou "yaml"
  "secoes": ["gerais", "autenticacao"]
}
```

### POST `/api/v1/admin/config/import`
```json
{
  "arquivo": "configuracoes.json",
  "sobrescrever": true
}
```

## 🗄️ Estrutura do Banco

### Tabelas de Configuração

1. **SistemaConfiguracaoGeral** - Dados institucionais básicos
2. **SessaoLegislativaConfig** - Configurações de sessão
3. **SistemaPerfis** - Perfis de usuário
4. **SistemaAutenticacaoConfig** - Políticas de segurança
5. **DocumentoTipos** - Tipos de documentos
6. **SistemaWorkflowConfig** - Fluxos de trabalho
7. **SistemaIntegracaoConfig** - APIs externas
8. **TransparenciaConfig** - Portal público
9. **SistemaBackupConfig** - Configurações de backup
10. **SistemaPrazosConfig** - Prazos automáticos
11. **SistemaNumeracaoConfig** - Numeração de documentos
12. **SistemaNotificacaoConfig** - Notificações
13. **SistemaRelatorioConfig** - Relatórios automáticos
14. **FeriadosMunicipais** - Calendário de feriados
15. **SistemaAuditoriaConfig** - Auditoria do sistema
16. **DocumentoTemplates** - Templates de documentos
17. **PerfilPermissoes** - Permissões detalhadas
18. **SistemaLogConfig** - Configurações de log
19. **SistemaMigracaoConfig** - Controle de migrações

### Relacionamentos
```sql
-- Perfis e Permissões
SistemaPerfis 1-N PerfilPermissoes

-- Documentos e Templates  
DocumentoTipos 1-N DocumentoTemplates

-- Auditoria
Todas as tabelas têm campos de auditoria:
- createdAt, updatedAt
- createdBy, updatedBy
```

## 🚀 Como Usar

### 1. Acesso
```
http://localhost:3000/admin/configuracoes
```

### 2. Navegação
- Use a sidebar para navegar entre seções
- Clique nas categorias para expandir/recolher
- Indicadores visuais mostram seções ativas

### 3. Edição
- Formulários dinâmicos por seção
- Validação em tempo real
- Auto-save opcional

### 4. Operações
- **Salvar**: Barra de ação fixa
- **Validar**: Verificação prévia
- **Exportar**: Backup das configurações
- **Importar**: Restauração de backup

## 🔄 Fluxo de Dados

1. **Carregamento inicial**: API busca todas as configurações
2. **Navegação**: Context mantém estado global
3. **Edição**: Validação local + remota
4. **Salvamento**: API + atualização do contexto
5. **Auditoria**: Log automático de mudanças

## 🛠️ Tecnologias Utilizadas

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Node.js, Prisma ORM
- **Banco**: SQLite (dev) / PostgreSQL (prod)
- **Icons**: Bootstrap Icons
- **Styling**: Metronic Theme System

## 📈 Próximos Passos

1. **Validações avançadas** por seção
2. **Import/Export** de configurações
3. **Histórico detalhado** de mudanças
4. **Notificações em tempo real**
5. **Backup automático** das configurações
6. **API de sincronização** entre ambientes

## 🔐 Segurança

- **Autenticação obrigatória** para acesso
- **Autorização por nível** de usuário
- **Validação robusta** de entrada
- **Auditoria completa** de operações
- **Sanitização** de dados

## 📝 Manutenção

### Adicionando Nova Seção
1. Criar tabela no schema Prisma
2. Executar migração
3. Atualizar API endpoints
4. Criar componente de seção
5. Registrar na navegação

### Modificando Configuração Existente
1. Alterar schema se necessário
2. Atualizar validações da API
3. Ajustar componente frontend
4. Testar fluxo completo

## 🧪 Testes

```bash
# Executar seed com dados de teste
npm run db:seed

# Verificar estrutura do banco
npx prisma studio

# Testar API
npm run test:api

# Executar desenvolvimento
npm run dev
```

---

*Sistema desenvolvido seguindo as melhores práticas de arquitetura de software e experiência do usuário.* 