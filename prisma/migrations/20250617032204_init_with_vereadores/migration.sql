-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT,
    "role" TEXT NOT NULL DEFAULT 'PUBLIC',
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "admins" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "nivel" TEXT NOT NULL DEFAULT 'OPERADOR',
    "departamento" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "admins_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "parlamentares" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "matricula" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "partido" TEXT NOT NULL,
    "uf" TEXT NOT NULL,
    "mandatoInicio" DATETIME NOT NULL,
    "mandatoFim" DATETIME,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "cargo" TEXT DEFAULT 'VEREADOR',
    "presidenteCamara" BOOLEAN NOT NULL DEFAULT false,
    "dataEleiçaoPresidencia" DATETIME,
    "mandatoPresidenciaFim" DATETIME,
    "telefone" TEXT,
    "endereco" TEXT,
    "profissao" TEXT,
    "biografia" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "parlamentares_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "proposicoes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "numero" TEXT NOT NULL,
    "ano" INTEGER NOT NULL,
    "tipo" TEXT NOT NULL,
    "ementa" TEXT NOT NULL,
    "justificacao" TEXT,
    "autorId" TEXT NOT NULL,
    "estadoAtual" TEXT NOT NULL DEFAULT 'DRAFT_INITIATED',
    "dataApresentacao" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "proposicoes_autorId_fkey" FOREIGN KEY ("autorId") REFERENCES "parlamentares" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "tramitacao_eventos" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "proposicaoId" TEXT NOT NULL,
    "estadoAnterior" TEXT,
    "estadoNovo" TEXT NOT NULL,
    "comissaoId" TEXT,
    "responsavelId" TEXT,
    "observacoes" TEXT,
    "dataEvento" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "tramitacao_eventos_proposicaoId_fkey" FOREIGN KEY ("proposicaoId") REFERENCES "proposicoes" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "tramitacao_eventos_comissaoId_fkey" FOREIGN KEY ("comissaoId") REFERENCES "comissoes" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "comissoes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "sigla" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "ativa" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "relatorias" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "proposicaoId" TEXT NOT NULL,
    "parlamentarId" TEXT NOT NULL,
    "comissaoId" TEXT NOT NULL,
    "parecer" TEXT,
    "dataDesignacao" DATETIME NOT NULL,
    "dataEntrega" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'DESIGNADO',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "relatorias_proposicaoId_fkey" FOREIGN KEY ("proposicaoId") REFERENCES "proposicoes" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "relatorias_parlamentarId_fkey" FOREIGN KEY ("parlamentarId") REFERENCES "parlamentares" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "relatorias_comissaoId_fkey" FOREIGN KEY ("comissaoId") REFERENCES "comissoes" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "votacoes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "proposicaoId" TEXT NOT NULL,
    "comissaoId" TEXT,
    "tipo" TEXT NOT NULL,
    "dataVotacao" DATETIME NOT NULL,
    "resultado" TEXT,
    "votosFavor" INTEGER NOT NULL DEFAULT 0,
    "votosContra" INTEGER NOT NULL DEFAULT 0,
    "abstencoes" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "votacoes_proposicaoId_fkey" FOREIGN KEY ("proposicaoId") REFERENCES "proposicoes" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "votacoes_comissaoId_fkey" FOREIGN KEY ("comissaoId") REFERENCES "comissoes" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "votos" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "votacaoId" TEXT NOT NULL,
    "parlamentarId" TEXT NOT NULL,
    "tipoVoto" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "votos_votacaoId_fkey" FOREIGN KEY ("votacaoId") REFERENCES "votacoes" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "votos_parlamentarId_fkey" FOREIGN KEY ("parlamentarId") REFERENCES "parlamentares" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "emendas" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "proposicaoId" TEXT NOT NULL,
    "autorId" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "texto" TEXT NOT NULL,
    "justificativa" TEXT,
    "status" TEXT NOT NULL DEFAULT 'APRESENTADA',
    "dataApresentacao" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "emendas_proposicaoId_fkey" FOREIGN KEY ("proposicaoId") REFERENCES "proposicoes" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "emendas_autorId_fkey" FOREIGN KEY ("autorId") REFERENCES "parlamentares" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "presencas" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "parlamentarId" TEXT NOT NULL,
    "tipoSessao" TEXT NOT NULL,
    "dataSessao" DATETIME NOT NULL,
    "presente" BOOLEAN NOT NULL,
    "justificativa" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "presencas_parlamentarId_fkey" FOREIGN KEY ("parlamentarId") REFERENCES "parlamentares" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "sistema_configuracao_geral" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nomeInstituicao" TEXT NOT NULL,
    "sigla" TEXT,
    "logoPrincipal" TEXT,
    "logoSecundario" TEXT,
    "favicon" TEXT,
    "corPrimaria" TEXT,
    "corSecundaria" TEXT,
    "corDestaque" TEXT,
    "enderecoCompleto" TEXT,
    "telefone" TEXT,
    "email" TEXT,
    "website" TEXT,
    "cnpj" TEXT,
    "timezone" TEXT NOT NULL DEFAULT 'America/Sao_Paulo',
    "idiomapadrao" TEXT NOT NULL DEFAULT 'pt-BR',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "sessao_legislativa_config" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "dataInicio" DATETIME NOT NULL,
    "dataFim" DATETIME NOT NULL,
    "tipo" TEXT NOT NULL,
    "ativa" BOOLEAN NOT NULL DEFAULT false,
    "calendarioSessoes" TEXT,
    "horarioPadraoInicio" TEXT,
    "horarioPadraoFim" TEXT,
    "quorumMinimo" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "sistema_perfis" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "nivelAcesso" INTEGER NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "permissoes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "perfil_permissoes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "perfilId" TEXT NOT NULL,
    "modulo" TEXT NOT NULL,
    "funcionalidade" TEXT NOT NULL,
    "podeVisualizar" BOOLEAN NOT NULL DEFAULT false,
    "podeCriar" BOOLEAN NOT NULL DEFAULT false,
    "podeEditar" BOOLEAN NOT NULL DEFAULT false,
    "podeExcluir" BOOLEAN NOT NULL DEFAULT false,
    "podeAprovar" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "perfil_permissoes_perfilId_fkey" FOREIGN KEY ("perfilId") REFERENCES "sistema_perfis" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "sistema_autenticacao_config" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "senhaMinLength" INTEGER NOT NULL DEFAULT 8,
    "senhaRequereNumeros" BOOLEAN NOT NULL DEFAULT true,
    "senhaRequereEspeciais" BOOLEAN NOT NULL DEFAULT true,
    "senhaExpiraDias" INTEGER DEFAULT 90,
    "oauth2Google" BOOLEAN NOT NULL DEFAULT false,
    "oauth2Microsoft" BOOLEAN NOT NULL DEFAULT false,
    "oauth2GovBr" BOOLEAN NOT NULL DEFAULT false,
    "certificadoDigital" BOOLEAN NOT NULL DEFAULT false,
    "sessaoTimeoutMinutos" INTEGER NOT NULL DEFAULT 60,
    "mfaObrigatorio" BOOLEAN NOT NULL DEFAULT false,
    "ipWhitelistAtivo" BOOLEAN NOT NULL DEFAULT false,
    "ipWhitelist" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "documento_tipos" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "sigla" TEXT,
    "numeracaoFormato" TEXT NOT NULL,
    "workflowId" TEXT,
    "templateConteudo" TEXT,
    "camposObrigatorios" TEXT,
    "validacoes" TEXT,
    "prazoTramitacao" INTEGER,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "documento_tipos_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "workflows" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "documento_templates" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "tipoDocumentoId" TEXT NOT NULL,
    "conteudoHtml" TEXT NOT NULL,
    "variaveis" TEXT,
    "cabecalho" TEXT,
    "rodape" TEXT,
    "margens" TEXT,
    "versao" INTEGER NOT NULL DEFAULT 1,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "documento_templates_tipoDocumentoId_fkey" FOREIGN KEY ("tipoDocumentoId") REFERENCES "documento_tipos" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "workflows" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "etapas" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "workflow_etapas" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "workflowId" TEXT NOT NULL,
    "ordem" INTEGER NOT NULL,
    "nome" TEXT NOT NULL,
    "responsavelPerfilId" TEXT,
    "prazoDias" INTEGER,
    "obrigatoria" BOOLEAN NOT NULL DEFAULT true,
    "paralela" BOOLEAN NOT NULL DEFAULT false,
    "condicoes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "workflow_etapas_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "workflows" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "sistema_prazos_config" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tipoPrazo" TEXT NOT NULL,
    "diasUteis" INTEGER NOT NULL,
    "permiteProrrogacao" BOOLEAN NOT NULL DEFAULT false,
    "maximoProrrogacoes" INTEGER,
    "notificarDiasAntes" INTEGER,
    "escalonarAposVencimento" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "feriados_municipais" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "data" DATETIME NOT NULL,
    "descricao" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "recorrente" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "sistema_numeracao_config" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tipoDocumento" TEXT NOT NULL,
    "formato" TEXT NOT NULL,
    "contadorAtual" INTEGER NOT NULL DEFAULT 0,
    "reiniciaAnualmente" BOOLEAN NOT NULL DEFAULT true,
    "prefixo" TEXT,
    "sufixo" TEXT,
    "digitosMinimos" INTEGER NOT NULL DEFAULT 3,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "sistema_notificacoes_config" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tipoEvento" TEXT NOT NULL,
    "enviarEmail" BOOLEAN NOT NULL DEFAULT true,
    "enviarSms" BOOLEAN NOT NULL DEFAULT false,
    "enviarPush" BOOLEAN NOT NULL DEFAULT true,
    "templateEmail" TEXT,
    "templateSms" TEXT,
    "destinatariosAutomaticos" TEXT,
    "diasAntecedencia" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "sistema_integracoes_config" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nomeIntegracao" TEXT NOT NULL,
    "endpointUrl" TEXT,
    "apiKey" TEXT,
    "metodoAuth" TEXT,
    "ativa" BOOLEAN NOT NULL DEFAULT true,
    "configuracoesExtras" TEXT,
    "ultimaSincronizacao" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "transparencia_config" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "mostrarVotacoesNominais" BOOLEAN NOT NULL DEFAULT true,
    "mostrarPresencas" BOOLEAN NOT NULL DEFAULT true,
    "mostrarSalarios" BOOLEAN NOT NULL DEFAULT true,
    "mostrarGastosGabinete" BOOLEAN NOT NULL DEFAULT true,
    "permitirDownloadDocumentos" BOOLEAN NOT NULL DEFAULT true,
    "textoLeiAcessoInformacao" TEXT,
    "emailOuvidoria" TEXT,
    "prazoRespostaDias" INTEGER NOT NULL DEFAULT 20,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "sistema_backup_config" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "frequenciaBackup" TEXT NOT NULL,
    "horarioBackup" TEXT,
    "localArmazenamento" TEXT,
    "retencaoDias" INTEGER NOT NULL DEFAULT 90,
    "criptografiaAtiva" BOOLEAN NOT NULL DEFAULT true,
    "notificarFalhas" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "config_historico" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tabela" TEXT NOT NULL,
    "registroId" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "valoresAntes" TEXT,
    "valoresDepois" TEXT,
    "observacoes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "admins_userId_key" ON "admins"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "parlamentares_userId_key" ON "parlamentares"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "parlamentares_matricula_key" ON "parlamentares"("matricula");

-- CreateIndex
CREATE UNIQUE INDEX "proposicoes_numero_ano_tipo_key" ON "proposicoes"("numero", "ano", "tipo");

-- CreateIndex
CREATE UNIQUE INDEX "comissoes_sigla_key" ON "comissoes"("sigla");

-- CreateIndex
CREATE UNIQUE INDEX "votos_votacaoId_parlamentarId_key" ON "votos"("votacaoId", "parlamentarId");

-- CreateIndex
CREATE UNIQUE INDEX "emendas_proposicaoId_numero_key" ON "emendas"("proposicaoId", "numero");

-- CreateIndex
CREATE UNIQUE INDEX "presencas_parlamentarId_dataSessao_tipoSessao_key" ON "presencas"("parlamentarId", "dataSessao", "tipoSessao");
