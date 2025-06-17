import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function seedConfiguracoes() {
  console.log('🔧 Iniciando seed das configurações do sistema...')

  try {
    // 1. Configurações Gerais
    await prisma.sistemaConfiguracaoGeral.upsert({
      where: { id: 'default' },
      update: {},
      create: {
        id: 'default',
        nomeInstituicao: 'Câmara Municipal de Exemplo',
        sigla: 'CME',
        corPrimaria: '#009ef7',
        corSecundaria: '#50cd89',
        corDestaque: '#f1416c',
        enderecoCompleto: 'Praça da Democracia, 100 - Centro - Cidade Exemplo/UF',
        telefone: '(11) 3000-0000',
        email: 'contato@camara.exemplo.gov.br',
        website: 'https://www.camara.exemplo.gov.br',
        cnpj: '12.345.678/0001-90',
        timezone: 'America/Sao_Paulo',
        idiomapadrao: 'pt-BR'
      }
    })

    // 2. Configurações de Autenticação
    await prisma.sistemaAutenticacaoConfig.upsert({
      where: { id: 'default' },
      update: {},
      create: {
        id: 'default',
        senhaMinLength: 8,
        senhaRequereNumeros: true,
        senhaRequereEspeciais: true,
        senhaExpiraDias: 90,
        oauth2Google: false,
        oauth2Microsoft: false,
        oauth2GovBr: false,
        certificadoDigital: false,
        sessaoTimeoutMinutos: 60,
        mfaObrigatorio: false,
        ipWhitelistAtivo: false
      }
    })

    // 3. Configurações de Transparência
    await prisma.transparenciaConfig.upsert({
      where: { id: 'default' },
      update: {},
      create: {
        id: 'default',
        mostrarVotacoesNominais: true,
        mostrarPresencas: true,
        mostrarSalarios: true,
        mostrarGastosGabinete: true,
        permitirDownloadDocumentos: true,
        textoLeiAcessoInformacao: 'Em conformidade com a Lei de Acesso à Informação (Lei nº 12.527/2011)',
        emailOuvidoria: 'ouvidoria@camara.exemplo.gov.br',
        prazoRespostaDias: 20
      }
    })

    // 4. Configurações de Backup
    await prisma.sistemaBackupConfig.upsert({
      where: { id: 'default' },
      update: {},
      create: {
        id: 'default',
        frequenciaBackup: 'DIARIO',
        horarioBackup: '02:00',
        localArmazenamento: 'local',
        retencaoDias: 90,
        criptografiaAtiva: true,
        notificarFalhas: true
      }
    })

    // 5. Sessão Legislativa Padrão
    const sessaoAtual = await prisma.sessaoLegislativaConfig.findFirst({
      where: { ativa: true }
    })

    if (!sessaoAtual) {
      await prisma.sessaoLegislativaConfig.create({
        data: {
          nome: '1ª Sessão Legislativa 2024',
          dataInicio: new Date('2024-01-01'),
          dataFim: new Date('2024-12-31'),
          tipo: 'ORDINARIA',
          ativa: true,
          calendarioSessoes: JSON.stringify(['segunda', 'quinta']),
          horarioPadraoInicio: '14:00',
          horarioPadraoFim: '18:00',
          quorumMinimo: 50
        }
      })
    }

    // 6. Perfis de Sistema Padrão
    const perfis = [
      {
        nome: 'Administrador',
        descricao: 'Acesso total ao sistema',
        nivelAcesso: 5,
        ativo: true
      },
      {
        nome: 'Parlamentar',
        descricao: 'Acesso para parlamentares',
        nivelAcesso: 4,
        ativo: true
      },
      {
        nome: 'Servidor',
        descricao: 'Acesso para servidores da casa',
        nivelAcesso: 3,
        ativo: true
      },
      {
        nome: 'Assessor',
        descricao: 'Acesso para assessores',
        nivelAcesso: 2,
        ativo: true
      },
      {
        nome: 'Público',
        descricao: 'Acesso público básico',
        nivelAcesso: 1,
        ativo: true
      }
    ]

    for (const perfil of perfis) {
      const existingPerfil = await prisma.sistemaPerfis.findFirst({
        where: { nome: perfil.nome }
      })
      
      if (!existingPerfil) {
        await prisma.sistemaPerfis.create({
          data: perfil
        })
      }
    }

    // 7. Tipos de Documentos Padrão
    const tiposDocumento = [
      {
        nome: 'Projeto de Lei',
        sigla: 'PL',
        numeracaoFormato: 'PL {numero}/{ano}',
        ativo: true
      },
      {
        nome: 'Projeto de Lei Complementar',
        sigla: 'PLC',
        numeracaoFormato: 'PLC {numero}/{ano}',
        ativo: true
      },
      {
        nome: 'Requerimento',
        sigla: 'REQ',
        numeracaoFormato: 'REQ {numero}/{ano}',
        ativo: true
      },
      {
        nome: 'Indicação',
        sigla: 'IND',
        numeracaoFormato: 'IND {numero}/{ano}',
        ativo: true
      },
      {
        nome: 'Moção',
        sigla: 'MOC',
        numeracaoFormato: 'MOC {numero}/{ano}',
        ativo: true
      }
    ]

    for (const tipo of tiposDocumento) {
      const existingTipo = await prisma.documentoTipos.findFirst({
        where: { sigla: tipo.sigla }
      })
      
      if (!existingTipo) {
        await prisma.documentoTipos.create({
          data: tipo
        })
      }
    }

    // 8. Configurações de Prazos Padrão
    const prazos = [
      {
        tipoPrazo: 'relatoria',
        diasUteis: 15,
        permiteProrrogacao: true,
        maximoProrrogacoes: 2,
        notificarDiasAntes: 3,
        escalonarAposVencimento: true
      },
      {
        tipoPrazo: 'emenda',
        diasUteis: 5,
        permiteProrrogacao: false,
        maximoProrrogacoes: 0,
        notificarDiasAntes: 1,
        escalonarAposVencimento: false
      },
      {
        tipoPrazo: 'votacao',
        diasUteis: 30,
        permiteProrrogacao: true,
        maximoProrrogacoes: 1,
        notificarDiasAntes: 5,
        escalonarAposVencimento: true
      }
    ]

    for (const prazo of prazos) {
      const existingPrazo = await prisma.sistemaPrazosConfig.findFirst({
        where: { tipoPrazo: prazo.tipoPrazo }
      })
      
      if (!existingPrazo) {
        await prisma.sistemaPrazosConfig.create({
          data: prazo
        })
      }
    }

    // 9. Configurações de Numeração
    const configuracoes = tiposDocumento.map(tipo => ({
      tipoDocumento: tipo.sigla!,
      formato: tipo.numeracaoFormato,
      contadorAtual: 0,
      reiniciaAnualmente: true,
      digitosMinimos: 3
    }))

    for (const config of configuracoes) {
      const existingConfig = await prisma.sistemaNumeracaoConfig.findFirst({
        where: { tipoDocumento: config.tipoDocumento }
      })
      
      if (!existingConfig) {
        await prisma.sistemaNumeracaoConfig.create({
          data: config
        })
      }
    }

    // 10. Feriados Nacionais Padrão
    const feriados = [
      { data: new Date('2024-01-01'), descricao: 'Confraternização Universal', tipo: 'NACIONAL' as const, recorrente: true },
      { data: new Date('2024-04-21'), descricao: 'Tiradentes', tipo: 'NACIONAL' as const, recorrente: true },
      { data: new Date('2024-05-01'), descricao: 'Dia do Trabalhador', tipo: 'NACIONAL' as const, recorrente: true },
      { data: new Date('2024-09-07'), descricao: 'Independência do Brasil', tipo: 'NACIONAL' as const, recorrente: true },
      { data: new Date('2024-10-12'), descricao: 'Nossa Senhora Aparecida', tipo: 'NACIONAL' as const, recorrente: true },
      { data: new Date('2024-11-02'), descricao: 'Finados', tipo: 'NACIONAL' as const, recorrente: true },
      { data: new Date('2024-11-15'), descricao: 'Proclamação da República', tipo: 'NACIONAL' as const, recorrente: true },
      { data: new Date('2024-12-25'), descricao: 'Natal', tipo: 'NACIONAL' as const, recorrente: true }
    ]

    for (const feriado of feriados) {
      const existingFeriado = await prisma.feriadosMunicipais.findFirst({
        where: { 
          data: feriado.data,
          descricao: feriado.descricao
        }
      })
      
      if (!existingFeriado) {
        await prisma.feriadosMunicipais.create({
          data: feriado
        })
      }
    }

    console.log('✅ Seed das configurações concluído com sucesso!')

  } catch (error) {
    console.error('❌ Erro durante o seed das configurações:', error)
    throw error
  }
} 