# 📚 Documentação da API - Sistema de Tramitação Parlamentar

## 🎯 Resumo da Implementação

Foi criada uma página completa de documentação da API seguindo o padrão de layout do sistema, localizada em `/desenvolvedor/api-docs`.

## 🗂️ Estrutura de Arquivos Criados

```
src/app/desenvolvedor/api-docs/
└── page.tsx                    # Página principal da documentação
```

## 🔧 Modificações Realizadas

### 1. Menu Principal (`src/_metronic/layout/components/aside/AsideMenuMain.tsx`)
- ✅ Link "Documentação da API" adicionado na seção de DESENVOLVEDOR  
- ✅ Link "Documentação da API" adicionado na seção de ADMIN
- ✅ Visibilidade restrita apenas para roles ADMIN e DESENVOLVEDOR

### 2. Rotas (`src/app/routing/PrivateRoutes.tsx`)
- ✅ Importação do componente `DesenvolvedorApiDocs`
- ✅ Rota `/desenvolvedor/api-docs` configurada

### 3. Página de Documentação (`src/app/desenvolvedor/api-docs/page.tsx`)
- ✅ Layout responsivo com sidebar e conteúdo principal
- ✅ Categorias interativas de documentação
- ✅ Sistema de busca funcional
- ✅ FAQ expansível/recolhível
- ✅ Exemplos de código com syntax highlighting
- ✅ Informações técnicas da API
- ✅ Links úteis (Swagger, Postman, Status)

## 📋 Funcionalidades Implementadas

### 🎨 Interface
- **Design Responsivo**: Adapta-se a desktop e mobile
- **Sidebar Navegável**: Categorias com ícones e descrições
- **Busca Inteligente**: Filtra perguntas e respostas
- **Acordeão Interativo**: FAQ expansível com Bootstrap

### 📖 Conteúdo
- **6 Categorias Principais**:
  - 🔐 Autenticação (JWT, login, renovação de tokens)
  - 📄 Proposições (CRUD, tipos, campos obrigatórios)
  - 🔄 Tramitação (workflow, estados, ações)
  - 👥 Usuários (gestão, permissões, roles)
  - 📊 Relatórios (geração, formatos, agendamento)
  - 🔗 Webhooks (configuração, validação, retry)

### 💻 Exemplos de Código
- **JSON Examples**: Requisições e respostas formatadas
- **Syntax Highlighting**: Código destacado com cores
- **Headers HTTP**: Exemplos de autenticação
- **Payloads Completos**: Estruturas de dados reais

### 🔧 Informações Técnicas
- **Base URL**: https://api.sistema-tramitacao.gov.br/v1
- **Formatos**: JSON, multipart/form-data
- **Rate Limiting**: Configurado por tipo de usuário
- **Autenticação**: JWT Bearer tokens

## 🎯 Categorias e FAQ

### 1. **Autenticação** 🔐
- Como funciona a autenticação
- Obter token de acesso (com exemplo)
- Validade dos tokens
- Renovação de tokens expirados

### 2. **Proposições** 📄
- Listar proposições
- Criar nova proposição (com exemplo)
- Atualizar proposições
- Tipos disponíveis

### 3. **Tramitação** 🔄
- Workflow state machine
- Avançar no workflow
- Histórico de tramitação
- Ações permitidas por estado

### 4. **Usuários** 👥
- Listar usuários (paginação)
- Criar usuários (roles)
- Atualizar perfis
- Gerenciar permissões

### 5. **Relatórios** 📊
- Tipos disponíveis
- Geração em PDF/Excel/CSV
- Agendamento automático
- Limites e background processing

### 6. **Webhooks** 🔗
- Configuração de endpoints
- Formato de payloads
- Validação HMAC-SHA256
- Política de retry

## 🚀 Como Acessar

### Para Desenvolvedores:
1. **Login** no sistema como DESENVOLVEDOR
2. **No menu lateral** → Sistema de Tramitação → Documentação da API

### Para Administradores:
1. **Login** no sistema como ADMIN  
2. **No menu lateral** → Painel Administrativo → Documentação da API

### Navegação na Página:
3. **Explore** as categorias no sidebar
4. **Use** a busca para encontrar informações específicas
5. **Expanda** as perguntas para ver exemplos de código

## 🎨 Padrão de Design

A página segue rigorosamente o padrão visual estabelecido:
- ✅ Classes Bootstrap/Metronic consistentes
- ✅ Cores e ícones padronizados
- ✅ Layout responsivo
- ✅ Integração com DesenvolvedorLayout
- ✅ Navegação consistente

## 🔄 Navegação

```
/desenvolvedor/dashboard     → Dashboard principal
/desenvolvedor/proposicoes   → Gestão de proposições  
/desenvolvedor/workflow      → Visualização do workflow
/desenvolvedor/api-docs      → 📚 Documentação da API (NOVO)
```

## 💡 Melhorias Futuras

- [ ] Integração com Swagger UI embebido
- [ ] Testador de API interativo
- [ ] Geração automática de SDKs
- [ ] Exemplos em múltiplas linguagens
- [ ] Versionamento da documentação
- [ ] Métricas de uso da API 