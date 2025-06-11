-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'PUBLIC',
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
