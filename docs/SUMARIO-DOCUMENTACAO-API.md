# 📚 Sumário - Documentação Completa da API

## 📋 Visão Geral

Esta documentação completa fornece todos os recursos necessários para desenvolver e integrar com o **Sistema de Tramitação Parlamentar**. A API REST foi projetada seguindo os padrões OpenAPI 3.0.3 e oferece funcionalidades completas para gestão legislativa.

---

## 📁 Estrutura da Documentação

### 🔧 **Arquivos Principais**

| Arquivo | Descrição | Uso |
|---------|-----------|-----|
| `api-documentation.json` | Especificação OpenAPI 3.0.3 completa | Importar no Swagger UI/Postman |
| `README-API.md` | Guia de uso e visão geral | Consulta rápida e orientações |
| `api-examples.json` | Exemplos práticos de uso | Referência para implementação |
| `api-endpoints-extensions.json` | Endpoints adicionais | Funcionalidades específicas |

---

## 🔗 **Endpoints Principais por Categoria**

### 🏛️ **1. Endpoints Públicos** 
*Sem necessidade de autenticação*

```
GET  /api/v1/publico/proposicoes           # Lista proposições públicas
GET  /api/v1/publico/proposicoes/{id}      # Detalhes de proposição
GET  /api/v1/publico/parlamentares         # Lista parlamentares
GET  /api/v1/publico/dashboard             # Estatísticas públicas
GET  /api/v1/publico/calendario            # Calendário de sessões
GET  /api/v1/publico/pesquisa              # Pesquisa textual
```

### 🔐 **2. Autenticação**

```
POST /api/v1/auth/login                    # Login de usuário
POST /api/v1/auth/refresh                  # Renovar token JWT
```

### 📋 **3. Proposições** 
*Requer autenticação*

```
GET    /api/v1/proposicoes                 # Lista proposições
POST   /api/v1/proposicoes                 # Criar proposição
GET    /api/v1/proposicoes/{id}            # Detalhes da proposição
PUT    /api/v1/proposicoes/{id}            # Atualizar proposição
DELETE /api/v1/proposicoes/{id}            # Excluir proposição
GET    /api/v1/proposicoes/{id}/historico-completo  # Histórico completo
GET    /api/v1/proposicoes/{id}/anexos     # Lista anexos
POST   /api/v1/proposicoes/{id}/anexos     # Adicionar anexo
```

### 🔄 **4. Tramitação**

```
GET  /api/v1/tramitacao/{proposicaoId}/eventos      # Histórico de tramitação
POST /api/v1/tramitacao/{proposicaoId}/eventos      # Adicionar evento
```

### 👥 **5. Área Parlamentar**

```
GET  /api/v1/parlamentar/proposicoes       # Proposições do parlamentar
GET  /api/v1/parlamentar/relatorias        # Relatorias
GET  /api/v1/parlamentar/votacoes          # Votações disponíveis
POST /api/v1/parlamentar/votos             # Registrar voto
```

### 📝 **6. Emendas**

```
GET  /api/v1/emendas                       # Lista emendas
POST /api/v1/emendas                       # Criar emenda
```

### 🏛️ **7. Comissões**

```
GET  /api/v1/comissoes                     # Lista comissões
POST /api/v1/comissoes                     # Criar comissão
GET  /api/v1/comissoes/{id}/membros        # Membros da comissão
POST /api/v1/comissoes/{id}/membros        # Adicionar membro
```

### 🗳️ **8. Votações**

```
GET  /api/v1/votacoes                      # Lista votações
POST /api/v1/votacoes                      # Criar votação
POST /api/v1/votacoes/{id}/iniciar         # Iniciar votação
POST /api/v1/votacoes/{id}/finalizar       # Finalizar votação
```

### 🏛️ **9. Sessões**

```
GET  /api/v1/sessoes                       # Lista sessões
POST /api/v1/sessoes                       # Criar sessão
GET  /api/v1/sessoes/{id}/presencas        # Lista presenças
POST /api/v1/sessoes/{id}/presencas        # Registrar presença
```

### ⚙️ **10. Administração**

```
GET  /api/v1/admin/configuracoes           # Configurações do sistema
PUT  /api/v1/admin/configuracoes           # Atualizar configurações
GET  /api/v1/admin/usuarios                # Lista usuários
POST /api/v1/admin/usuarios                # Criar usuário
GET  /api/v1/admin/documentos/templates    # Templates de documentos
POST /api/v1/admin/documentos/templates    # Criar template
```

### 📄 **11. Documentos**

```
POST /api/v1/docs/gerar/{tipo}             # Gerar documento
```

### 📤 **12. Upload**

```
POST /api/v1/upload/documento              # Upload de arquivo
```

### 📊 **13. Relatórios**

```
GET  /api/v1/relatorios/dashboard          # Dashboard administrativo
GET  /api/v1/relatorios/proposicoes        # Relatório de proposições
GET  /api/v1/relatorios/parlamentares      # Relatório parlamentar
```

### 🔔 **14. Notificações**

```
GET  /api/v1/notificacoes                  # Lista notificações
PUT  /api/v1/notificacoes/{id}/marcar-lida # Marcar como lida
```

### 💾 **15. Backup**

```
POST /api/v1/backup/exportar               # Exportar dados
GET  /api/v1/backup/status/{taskId}        # Status do backup
```

---

## 📊 **Tipos de Dados Principais**

### 🏛️ **Proposições**
- **Tipos**: PL, PLP, PEC, PDC, PRC, MSC, PLV
- **Estados**: 24 estados diferentes desde DRAFT_INITIATED até PUBLISHED_ACTIVE
- **Campos**: numero, ano, tipo, ementa, justificacao, autor, estadoAtual

### 👥 **Parlamentares**
- **Roles**: PUBLIC, PARLAMENTAR, ADMIN
- **Dados**: nome, partido, uf, mandato, cargo
- **Relacionamentos**: proposições, votos, relatorias, presenças

### 🏛️ **Comissões**
- **Tipos**: CCJ, CDHM, CFT, CEDU, CSAUDE, CMEIO, CTASP, CAPADR
- **Membros**: PRESIDENTE, VICE_PRESIDENTE, RELATOR, MEMBRO

### 🗳️ **Votações**
- **Tipos**: SIMBOLICA, NOMINAL, SECRETA
- **Resultados**: APROVADO, REJEITADO, PREJUDICADO, ADIADO
- **Votos**: FAVORAVEL, CONTRARIO, ABSTENCAO

### 📝 **Emendas**
- **Tipos**: SUPRESSIVA, SUBSTITUTIVA, ADITIVA, MODIFICATIVA, AGLUTINATIVA
- **Status**: APRESENTADA, APROVADA, REJEITADA, PREJUDICADA

---

## 🔧 **Como Usar a Documentação**

### 1️⃣ **Para Desenvolvedores Frontend**
- Use `api-documentation.json` para gerar SDK automaticamente
- Consulte `api-examples.json` para ver exemplos práticos
- Siga os padrões de autenticação JWT Bearer Token

### 2️⃣ **Para Desenvolvedores Backend**
- Implemente os endpoints seguindo a especificação OpenAPI
- Use os schemas para validação de dados
- Implemente os códigos de erro padronizados

### 3️⃣ **Para Testes**
- Importe `api-documentation.json` no Postman
- Use os exemplos em `api-examples.json` como base
- Configure variáveis de ambiente para diferentes ambientes

### 4️⃣ **Para DevOps**
- Use a documentação para configurar gateways de API
- Configure rate limiting conforme especificado
- Implemente monitoramento baseado nos endpoints

---

## 🚀 **Início Rápido**

### **1. Autenticação**
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@exemplo.com", "password": "senha123"}'
```

### **2. Listar Proposições Públicas**
```bash
curl -X GET "http://localhost:3000/api/v1/publico/proposicoes?tipo=PL&ano=2024"
```

### **3. Criar Proposição (Autenticado)**
```bash
curl -X POST http://localhost:3000/api/v1/proposicoes \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"numero": "001", "ano": 2024, "tipo": "PL", "ementa": "Proposição de exemplo"}'
```

---

## 📱 **Ambientes**

| Ambiente | URL Base | Descrição |
|----------|----------|-----------|
| **Desenvolvimento** | `http://localhost:3000/api/v1` | Para desenvolvimento local |
| **Produção** | `https://api.sistemaparlamentar.com/v1` | Ambiente de produção |

---

## ⚠️ **Limitações e Observações**

- **Rate Limiting**: 100 requisições/minuto por IP
- **Upload**: Máximo 10MB por arquivo
- **Timeout**: 30 segundos por requisição
- **Autenticação**: JWT com expiração configurável
- **Paginação**: Máximo 100 itens por página

---

## 📞 **Suporte e Contato**

- **Email**: dev@sistemaparlamentar.com
- **Documentação**: Consulte os arquivos desta pasta
- **Issues**: Sistema de tickets interno

---

## 🔄 **Versionamento**

- **Versão Atual**: 1.0.0
- **Padrão**: Semantic Versioning (SemVer)
- **URL**: Versionada com prefixo `/v1`

---

## 📝 **Licença e Uso**

Esta documentação é parte do Sistema de Tramitação Parlamentar e deve ser utilizada conforme as diretrizes internas do projeto.

*Documentação criada em Janeiro de 2025*

---

## 🎯 **Próximos Passos**

1. **Importar** `api-documentation.json` no seu ambiente de desenvolvimento
2. **Estudar** os exemplos em `api-examples.json`
3. **Implementar** autenticação JWT
4. **Testar** endpoints básicos
5. **Consultar** documentação específica conforme necessário

✅ **Documentação completa e pronta para uso!** 