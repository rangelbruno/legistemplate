import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

/**
 * GET /api/v1/admin/config/export
 * Exporta todas as configurações do sistema
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const format = searchParams.get('format') || 'json'
    const categorias = searchParams.get('categorias')?.split(',')

    // Buscar todas as configurações
    const configuracoes = await buscarTodasConfiguracoes(categorias)

    // Preparar dados para exportação
    const exportData = {
      metadata: {
        exportedAt: new Date().toISOString(),
        version: '1.0',
        system: 'Sistema Parlamentar',
        categories: categorias || 'all'
      },
      configurations: configuracoes
    }

    if (format === 'json') {
      return NextResponse.json(exportData, {
        headers: {
          'Content-Disposition': `attachment; filename="config-export-${new Date().toISOString().split('T')[0]}.json"`
        }
      })
    }

    return NextResponse.json({
      success: false,
      error: 'Formato não suportado'
    }, { status: 400 })

  } catch (error) {
    console.error('Erro ao exportar configurações:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

async function buscarTodasConfiguracoes(categoriasFiltro?: string[]) {
  const todasCategorias = [
    'geral', 'sessao-legislativa', 'perfis', 'autenticacao',
    'documento-tipos', 'workflows', 'prazos', 'feriados',
    'numeracao', 'notificacoes', 'integracoes', 'transparencia', 'backup'
  ]

  const categorias = categoriasFiltro || todasCategorias
  const configuracoes: any = {}

  for (const categoria of categorias) {
    try {
      configuracoes[categoria] = await buscarConfiguracaoPorCategoria(categoria)
    } catch (error) {
      console.error(`Erro ao buscar categoria ${categoria}:`, error)
      configuracoes[categoria] = null
    }
  }

  return configuracoes
}

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