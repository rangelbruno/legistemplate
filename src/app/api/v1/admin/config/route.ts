import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

/**
 * GET /api/v1/admin/config
 * Busca todas as configurações do sistema
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const categoria = searchParams.get('categoria')

    // Se categoria específica foi solicitada
    if (categoria) {
      const config = await buscarConfiguracaoPorCategoria(categoria)
      return NextResponse.json({ success: true, data: config })
    }

    // Buscar todas as configurações organizadas por categoria
    const configuracoes = {
      geral: await prisma.sistemaConfiguracaoGeral.findFirst(),
      sessaoLegislativa: await prisma.sessaoLegislativaConfig.findMany({
        orderBy: { dataInicio: 'desc' }
      }),
      perfis: await prisma.sistemaPerfis.findMany({
        include: { perfilPermissoes: true },
        orderBy: { nivelAcesso: 'asc' }
      }),
      autenticacao: await prisma.sistemaAutenticacaoConfig.findFirst(),
      documentoTipos: await prisma.documentoTipos.findMany({
        include: { 
          templates: true,
          workflow: {
            include: { etapasWorkflow: true }
          }
        },
        where: { ativo: true }
      }),
      workflows: await prisma.workflows.findMany({
        include: { etapasWorkflow: { orderBy: { ordem: 'asc' } } },
        where: { ativo: true }
      }),
      prazos: await prisma.sistemaPrazosConfig.findMany(),
      feriados: await prisma.feriadosMunicipais.findMany({
        orderBy: { data: 'asc' }
      }),
      numeracao: await prisma.sistemaNumeracaoConfig.findMany(),
      notificacoes: await prisma.sistemaNotificacoesConfig.findMany(),
      integracoes: await prisma.sistemaIntegracoesConfig.findMany(),
      transparencia: await prisma.transparenciaConfig.findFirst(),
      backup: await prisma.sistemaBackupConfig.findFirst()
    }

    return NextResponse.json({ 
      success: true, 
      data: configuracoes 
    })

  } catch (error) {
    console.error('Erro ao buscar configurações:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/v1/admin/config
 * Salva configurações do sistema
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { categoria, dados, usuarioId } = body

    if (!categoria || !dados) {
      return NextResponse.json(
        { success: false, error: 'Categoria e dados são obrigatórios' },
        { status: 400 }
      )
    }

    // Salvar histórico antes da alteração
    if (usuarioId) {
      await salvarHistoricoConfiguracao(categoria, dados, usuarioId)
    }

    const resultado = await salvarConfiguracaoPorCategoria(categoria, dados)

    return NextResponse.json({ 
      success: true, 
      data: resultado,
      message: 'Configurações salvas com sucesso' 
    })

  } catch (error) {
    console.error('Erro ao salvar configurações:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// Função auxiliar para buscar configuração por categoria
async function buscarConfiguracaoPorCategoria(categoria: string) {
  switch (categoria) {
    case 'geral':
      return await prisma.sistemaConfiguracaoGeral.findFirst()
    
    case 'sessao-legislativa':
      return await prisma.sessaoLegislativaConfig.findMany({
        orderBy: { dataInicio: 'desc' }
      })
    
    case 'perfis':
      return await prisma.sistemaPerfis.findMany({
        include: { perfilPermissoes: true },
        orderBy: { nivelAcesso: 'asc' }
      })
    
    case 'autenticacao':
      return await prisma.sistemaAutenticacaoConfig.findFirst()
    
    case 'documento-tipos':
      return await prisma.documentoTipos.findMany({
        include: { 
          templates: true,
          workflow: {
            include: { etapasWorkflow: true }
          }
        },
        where: { ativo: true }
      })
    
    case 'workflows':
      return await prisma.workflows.findMany({
        include: { etapasWorkflow: { orderBy: { ordem: 'asc' } } },
        where: { ativo: true }
      })
    
    case 'prazos':
      return await prisma.sistemaPrazosConfig.findMany()
    
    case 'feriados':
      return await prisma.feriadosMunicipais.findMany({
        orderBy: { data: 'asc' }
      })
    
    case 'numeracao':
      return await prisma.sistemaNumeracaoConfig.findMany()
    
    case 'notificacoes':
      return await prisma.sistemaNotificacoesConfig.findMany()
    
    case 'integracoes':
      return await prisma.sistemaIntegracoesConfig.findMany()
    
    case 'transparencia':
      return await prisma.transparenciaConfig.findFirst()
    
    case 'backup':
      return await prisma.sistemaBackupConfig.findFirst()
    
    default:
      throw new Error(`Categoria não encontrada: ${categoria}`)
  }
}

// Função auxiliar para salvar configuração por categoria
async function salvarConfiguracaoPorCategoria(categoria: string, dados: any) {
  switch (categoria) {
    case 'geral':
      return await prisma.sistemaConfiguracaoGeral.upsert({
        where: { id: dados.id || 'default' },
        update: dados,
        create: { ...dados, id: dados.id || 'default' }
      })
    
    case 'autenticacao':
      return await prisma.sistemaAutenticacaoConfig.upsert({
        where: { id: dados.id || 'default' },
        update: dados,
        create: { ...dados, id: dados.id || 'default' }
      })
    
    case 'transparencia':
      return await prisma.transparenciaConfig.upsert({
        where: { id: dados.id || 'default' },
        update: dados,
        create: { ...dados, id: dados.id || 'default' }
      })
    
    case 'backup':
      return await prisma.sistemaBackupConfig.upsert({
        where: { id: dados.id || 'default' },
        update: dados,
        create: { ...dados, id: dados.id || 'default' }
      })
    
    case 'sessao-legislativa':
      if (dados.id) {
        return await prisma.sessaoLegislativaConfig.update({
          where: { id: dados.id },
          data: dados
        })
      } else {
        return await prisma.sessaoLegislativaConfig.create({
          data: dados
        })
      }
    
    case 'perfis':
      if (dados.id) {
        return await prisma.sistemaPerfis.update({
          where: { id: dados.id },
          data: dados
        })
      } else {
        return await prisma.sistemaPerfis.create({
          data: dados
        })
      }
    
    // Adicionar outros casos conforme necessário
    default:
      throw new Error(`Categoria não suportada para salvamento: ${categoria}`)
  }
}

// Função para salvar histórico de configurações
async function salvarHistoricoConfiguracao(categoria: string, dados: any, usuarioId: string) {
  try {
    const configAtual = await buscarConfiguracaoPorCategoria(categoria)
    
    await prisma.configHistorico.create({
      data: {
        tabela: categoria,
        registroId: dados.id || 'default',
        usuarioId,
        valoresAntes: JSON.stringify(configAtual),
        valoresDepois: JSON.stringify(dados),
        observacoes: `Alteração de configuração: ${categoria}`
      }
    })
  } catch (error) {
    console.error('Erro ao salvar histórico:', error)
    // Não interrompe o processo principal
  }
} 