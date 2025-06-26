# Documentação da API - Sistema de Tramitação Parlamentar

## Visão Geral

Esta é a documentação completa da API REST do Sistema de Tramitação Parlamentar. A API fornece endpoints para gerenciar todos os aspectos do sistema legislativo, incluindo proposições, parlamentares, comissões, tramitação, votações e documentos.

## Arquivos de Documentação

- **`api-documentation.json`** - Especificação OpenAPI 3.0.3 completa
- **`api-examples.json`** - Exemplos de uso da API
- **`api-endpoints-extensions.json`** - Endpoints adicionais para funcionalidades específicas

## Estrutura da API

### Autenticação
- **Bearer Token JWT** - Todas as rotas protegidas requerem autenticação
- **Login**: `POST /api/v1/auth/login`
- **Refresh Token**: `POST /api/v1/auth/refresh`

### Principais Recursos

#### 🏛️ **Públicos** (Sem autenticação)
- `GET /api/v1/publico/proposicoes` - Lista proposições públicas
- `GET /api/v1/publico/proposicoes/{id}` - Detalhes de uma proposição
- `GET /api/v1/publico/parlamentares` - Lista parlamentares ativos

#### 📋 **Proposições** (Autenticado)
- `GET /api/v1/proposicoes` - Lista todas as proposições
- `POST /api/v1/proposicoes` - Criar nova proposição
- `GET /api/v1/proposicoes/{id}` - Detalhes de uma proposição
- `PUT /api/v1/proposicoes/{id}` - Atualizar proposição
- `DELETE /api/v1/proposicoes/{id}` - Excluir proposição

#### 🔄 **Tramitação** (Autenticado)
- `GET /api/v1/tramitacao/{proposicaoId}/eventos` - Histórico de tramitação
- `POST /api/v1/tramitacao/{proposicaoId}/eventos` - Adicionar evento de tramitação

#### 👥 **Parlamentar** (Autenticado)
- `GET /api/v1/parlamentar/proposicoes` - Proposições do parlamentar
- `GET /api/v1/parlamentar/relatorias` - Relatorias do parlamentar
- `GET /api/v1/parlamentar/votacoes` - Votações disponíveis
- `POST /api/v1/parlamentar/votos` - Registrar voto

#### 📝 **Emendas** (Autenticado)
- `GET /api/v1/emendas` - Lista emendas
- `POST /api/v1/emendas` - Criar emenda

#### ⚙️ **Administração** (Admin)
- `GET /api/v1/admin/configuracoes` - Configurações do sistema
- `PUT /api/v1/admin/configuracoes` - Atualizar configurações
- `GET /api/v1/admin/usuarios` - Lista usuários
- `POST /api/v1/admin/usuarios` - Criar usuário

#### 📄 **Documentos** (Autenticado)
- `GET /api/v1/admin/documentos/templates` - Lista templates
- `POST /api/v1/admin/documentos/templates` - Criar template
- `POST /api/v1/docs/gerar/{tipo}` - Gerar documento

#### 📤 **Upload** (Autenticado)
- `POST /api/v1/upload/documento` - Upload de documento

## Estados de Tramitação

### Fase 1: Criação e Recepção
- `DRAFT_INITIATED` - Minuta criada
- `UNDER_FORMAL_REVIEW` - Em análise formal
- `PENDING_CORRECTIONS` - Aguardando correções
- `REJECTED_PRELIMINARY` - Rejeitada preliminarmente

### Fase 2: Comissões
- `COMMITTEE_ASSIGNED` - Distribuída para comissão
- `IN_COMMITTEE_REVIEW` - Em análise na comissão
- `UNDER_RAPPORTEUR_ANALYSIS` - Com relator
- `AMENDMENT_PERIOD_OPEN` - Período de emendas aberto
- `AMENDMENT_PERIOD_CLOSED` - Período de emendas fechado
- `COMMITTEE_DISCUSSION` - Em discussão na comissão
- `COMMITTEE_VOTING` - Em votação na comissão
- `COMMITTEE_APPROVED` - Aprovada na comissão
- `COMMITTEE_REJECTED` - Rejeitada na comissão
- `READY_FOR_PLENARY` - Pronta para plenário

### Fase 3: Plenário
- `IN_PLENARY_DISCUSSION` - Em discussão no plenário
- `IN_VOTING` - Em votação
- `APPROVED_PLENARY` - Aprovada no plenário
- `REJECTED_PLENARY` - Rejeitada no plenário

### Fase 4: Casa Revisora
- `IN_REVIEWING_HOUSE` - Na casa revisora

### Fase 5: Executivo
- `SENT_TO_EXECUTIVE` - Enviada ao executivo
- `UNDER_EXECUTIVE_REVIEW` - Em análise no executivo
- `SANCTIONED` - Sancionada
- `PARTIALLY_VETOED` - Parcialmente vetada
- `TOTALLY_VETOED` - Totalmente vetada

### Fase 6: Finalização
- `PROMULGATED` - Promulgada
- `PUBLISHED_ACTIVE` - Publicada e ativa

## Tipos de Proposição

- **PL** - Projeto de Lei
- **PLP** - Projeto de Lei Complementar
- **PEC** - Proposta de Emenda Constitucional
- **PDC** - Projeto de Decreto Legislativo
- **PRC** - Projeto de Resolução
- **MSC** - Medida Provisória
- **PLV** - Projeto de Lei de Conversão

## Tipos de Comissão

- **CCJ** - Constituição e Justiça
- **CDHM** - Direitos Humanos
- **CFT** - Finanças e Tributação
- **CEDU** - Educação
- **CSAUDE** - Saúde
- **CMEIO** - Meio Ambiente
- **CTASP** - Trabalho, Administração e Serviço Público
- **CAPADR** - Agricultura, Pecuária, Abastecimento e Desenvolvimento Rural

## Roles de Usuário

- **PUBLIC** - Usuário público (acesso limitado)
- **PARLAMENTAR** - Parlamentar (acesso a funcionalidades legislativas)
- **ADMIN** - Administrador (acesso completo ao sistema)

## Formatos de Resposta

### Paginação
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### Erro Padrão
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Dados inválidos",
    "details": [
      "Campo 'ementa' é obrigatório",
      "Campo 'tipo' deve ser um dos valores válidos"
    ]
  }
}
```

## Como Usar

### 1. Importar no Swagger/Postman
- Importe o arquivo `api-documentation.json` no Swagger UI ou Postman
- Configure a URL base para seu ambiente

### 2. Autenticação
```bash
# Login
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "usuario@exemplo.com", "password": "senha123"}'

# Usar o token nas requisições
curl -X GET http://localhost:3000/api/v1/proposicoes \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

### 3. Exemplos de Uso
Veja o arquivo `api-examples.json` para exemplos completos de uso da API.

## Ambientes

### Desenvolvimento
- **URL**: `http://localhost:3000/api/v1`
- **Banco**: SQLite local
- **Logs**: Console

### Produção
- **URL**: `https://api.sistemaparlamentar.com/v1`
- **Banco**: PostgreSQL
- **Logs**: Arquivo + Sentry

## Observações Importantes

1. **Rate Limiting**: 100 requisições por minuto por IP
2. **Tamanho de Upload**: Máximo 10MB por arquivo
3. **Timeout**: 30 segundos para requisições
4. **Versionamento**: API versionada com prefixo `/v1`
5. **CORS**: Configurado para aceitar origens específicas

## Suporte

Para dúvidas ou problemas com a API, entre em contato:
- **Email**: dev@sistemaparlamentar.com
- **Documentação**: Consulte esta documentação e os exemplos
- **Issues**: Reporte problemas no sistema de tickets

---

*Documentação atualizada em: Janeiro 2025* 