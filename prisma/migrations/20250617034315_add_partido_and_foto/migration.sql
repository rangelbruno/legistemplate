/*
  Warnings:

  - You are about to drop the column `partido` on the `parlamentares` table. All the data in the column will be lost.
  - Added the required column `partidoId` to the `parlamentares` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "partidos" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sigla" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "numero" INTEGER NOT NULL,
    "fundacao" DATETIME,
    "presidente" TEXT,
    "website" TEXT,
    "logo" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- Inserir partidos padrão baseados nos dados existentes
INSERT INTO "partidos" ("id", "sigla", "nome", "numero", "createdAt", "updatedAt") VALUES
('pt001', 'PT', 'Partido dos Trabalhadores', 13, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('psdb001', 'PSDB', 'Partido da Social Democracia Brasileira', 45, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('mdb001', 'MDB', 'Movimento Democrático Brasileiro', 15, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('psd001', 'PSD', 'Partido Social Democrático', 55, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('pp001', 'PP', 'Progressistas', 11, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('pdt001', 'PDT', 'Partido Democrático Trabalhista', 12, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('pl001', 'PL', 'Partido Liberal', 22, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('psol001', 'PSOL', 'Partido Socialismo e Liberdade', 50, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('republicanos001', 'REPUBLICANOS', 'Republicanos', 10, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('pode001', 'PODE', 'Podemos', 19, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('psl001', 'PSL', 'Partido Social Liberal', 17, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('ptb001', 'PTB', 'Partido Trabalhista Brasileiro', 14, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('psb001', 'PSB', 'Partido Socialista Brasileiro', 40, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('pcdob001', 'PCdoB', 'Partido Comunista do Brasil', 65, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('avante001', 'AVANTE', 'Avante', 70, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('pv001', 'PV', 'Partido Verde', 43, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('rede001', 'REDE', 'Rede Sustentabilidade', 18, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('cidadania001', 'CIDADANIA', 'Cidadania', 23, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('solidariedade001', 'SOLIDARIEDADE', 'Solidariedade', 77, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('prtb001', 'PRTB', 'Partido Renovador Trabalhista Brasileiro', 28, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_parlamentares" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "matricula" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "partidoId" TEXT NOT NULL,
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
    "foto" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "parlamentares_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "parlamentares_partidoId_fkey" FOREIGN KEY ("partidoId") REFERENCES "partidos" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Migrar dados existentes fazendo o mapeamento do partido string para partidoId
INSERT INTO "new_parlamentares" ("id", "userId", "matricula", "nome", "partidoId", "uf", "mandatoInicio", "mandatoFim", "ativo", "cargo", "presidenteCamara", "dataEleiçaoPresidencia", "mandatoPresidenciaFim", "telefone", "endereco", "profissao", "biografia", "createdAt", "updatedAt")
SELECT 
    p."id", 
    p."userId", 
    p."matricula", 
    p."nome", 
    CASE 
        WHEN p."partido" = 'PT' THEN 'pt001'
        WHEN p."partido" = 'PSDB' THEN 'psdb001'
        WHEN p."partido" = 'MDB' THEN 'mdb001'
        WHEN p."partido" = 'PSD' THEN 'psd001'
        WHEN p."partido" = 'PP' THEN 'pp001'
        WHEN p."partido" = 'PDT' THEN 'pdt001'
        WHEN p."partido" = 'PL' THEN 'pl001'
        WHEN p."partido" = 'PSOL' THEN 'psol001'
        WHEN p."partido" = 'REPUBLICANOS' THEN 'republicanos001'
        WHEN p."partido" = 'PODE' THEN 'pode001'
        WHEN p."partido" = 'PSL' THEN 'psl001'
        WHEN p."partido" = 'PTB' THEN 'ptb001'
        WHEN p."partido" = 'PSB' THEN 'psb001'
        WHEN p."partido" = 'PCdoB' THEN 'pcdob001'
        WHEN p."partido" = 'AVANTE' THEN 'avante001'
        WHEN p."partido" = 'PV' THEN 'pv001'
        WHEN p."partido" = 'REDE' THEN 'rede001'
        WHEN p."partido" = 'CIDADANIA' THEN 'cidadania001'
        WHEN p."partido" = 'SOLIDARIEDADE' THEN 'solidariedade001'
        WHEN p."partido" = 'PRTB' THEN 'prtb001'
        ELSE 'pt001' -- Default para PT caso não encontre
    END,
    p."uf", 
    p."mandatoInicio", 
    p."mandatoFim", 
    p."ativo", 
    p."cargo", 
    p."presidenteCamara", 
    p."dataEleiçaoPresidencia", 
    p."mandatoPresidenciaFim", 
    p."telefone", 
    p."endereco", 
    p."profissao", 
    p."biografia", 
    p."createdAt", 
    p."updatedAt"
FROM "parlamentares" AS p;

DROP TABLE "parlamentares";
ALTER TABLE "new_parlamentares" RENAME TO "parlamentares";
CREATE UNIQUE INDEX "parlamentares_userId_key" ON "parlamentares"("userId");
CREATE UNIQUE INDEX "parlamentares_matricula_key" ON "parlamentares"("matricula");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "partidos_sigla_key" ON "partidos"("sigla");

-- CreateIndex
CREATE UNIQUE INDEX "partidos_numero_key" ON "partidos"("numero");
