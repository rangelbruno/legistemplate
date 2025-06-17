import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

/**
 * POST /api/v1/admin/config/import
 * Importa configurações do sistema
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { configurations, usuarioId, validarAntes = true } = body

    if (!configurations) {
      return NextResponse.json(
        { success: false, error: 'Dados de configuração não fornecidos' },
        { status: 400 }
      )
    }

    const resultados = {
      importadas: 0,
      erros: [] as string[],
      avisos: [] as string[]
    }

    // Validar configurações se solicitado
    if (validarAntes) {
      for (const [categoria, dados] of Object.entries(configurations)) {
        if (dados) {
          const validacao = await validarConfiguracoes(categoria, dados as any)
          if (!validacao.valid) {
            resultados.erros.push(`${categoria}: ${validacao.errors.join(', ')}`)
          }
          if (validacao.warnings.length > 0) {
            resultados.avisos.push(`${categoria}: ${validacao.warnings.join(', ')}`)
          }
        }
      }
    }

    // Se há erros de validação, não importar
    if (resultados.erros.length > 0) {
      return NextResponse.json({
        success: false,
        error: 'Erros de validação encontrados',
        details: resultados
      }, { status: 400 })
    }

    // Importar configurações
    for (const [categoria, dados] of Object.entries(configurations)) {
      if (dados) {
        try {
          await importarConfiguracaoCategoria(categoria, dados as any, usuarioId)
          resultados.importadas++
        } catch (error) {
          console.error(`Erro ao importar ${categoria}:`, error)
          resultados.erros.push(`${categoria}: Erro na importação`)
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Importação concluída',
      data: resultados
    })

  } catch (error) {
    console.error('Erro ao importar configurações:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

async function importarConfiguracaoCategoria(categoria: string, dados: any, usuarioId?: string) {
  // Salvar histórico antes da importação
  if (usuarioId) {
    try {
      const configAtual = await buscarConfiguracaoPorCategoria(categoria)
      await prisma.configHistorico.create({
        data: {
          tabela: categoria,
          registroId: 'import',
          usuarioId,
          valoresAntes: JSON.stringify(configAtual),
          valoresDepois: JSON.stringify(dados),
          observacoes: `Importação de configuração: ${categoria}`
        }
      })
    } catch (error) {
      console.error('Erro ao salvar histórico de importação:', error)
    }
  }

  // Importar baseado na categoria
  switch (categoria) {
    case 'geral':
      await prisma.sistemaConfiguracaoGeral.upsert({
        where: { id: dados.id || 'default' },
        update: { ...dados, updatedAt: new Date() },
        create: { ...dados, id: dados.id || 'default' }
      })
      break

    case 'autenticacao':
      await prisma.sistemaAutenticacaoConfig.upsert({
        where: { id: dados.id || 'default' },
        update: { ...dados, updatedAt: new Date() },
        create: { ...dados, id: dados.id || 'default' }
      })
      break

    case 'transparencia':
      await prisma.transparenciaConfig.upsert({
        where: { id: dados.id || 'default' },
        update: { ...dados, updatedAt: new Date() },
        create: { ...dados, id: dados.id || 'default' }
      })
      break

    case 'backup':
      await prisma.sistemaBackupConfig.upsert({
        where: { id: dados.id || 'default' },
        update: { ...dados, updatedAt: new Date() },
        create: { ...dados, id: dados.id || 'default' }
      })
      break

    case 'sessao-legislativa':
      if (Array.isArray(dados)) {
        for (const sessao of dados) {
          await prisma.sessaoLegislativaConfig.upsert({
            where: { id: sessao.id || 'new' },
            update: { ...sessao, updatedAt: new Date() },
            create: { ...sessao, id: undefined }
          })
        }
      } else {
        await prisma.sessaoLegislativaConfig.upsert({
          where: { id: dados.id || 'new' },
          update: { ...dados, updatedAt: new Date() },
          create: { ...dados, id: undefined }
        })
      }
      break

    case 'perfis':
      if (Array.isArray(dados)) {
        for (const perfil of dados) {
          const { perfilPermissoes, ...perfilData } = perfil
          
          const perfilCriado = await prisma.sistemaPerfis.upsert({
            where: { id: perfil.id || 'new' },
            update: { ...perfilData, updatedAt: new Date() },
            create: { ...perfilData, id: undefined }
          })

          // Importar permissões do perfil
          if (perfilPermissoes && Array.isArray(perfilPermissoes)) {
            // Limpar permissões existentes
            await prisma.perfilPermissoes.deleteMany({
              where: { perfilId: perfilCriado.id }
            })

            // Criar novas permissões
            for (const permissao of perfilPermissoes) {
              await prisma.perfilPermissoes.create({
                data: {
                  ...permissao,
                  perfilId: perfilCriado.id,
                  id: undefined
                }
              })
            }
          }
        }
      }
      break

    // Adicionar outros casos conforme necessário
    default:
      throw new Error(`Importação não implementada para categoria: ${categoria}`)
  }
}

async function buscarConfiguracaoPorCategoria(categoria: string) {
  // Reutilizar função de busca (copiar da API principal)
  switch (categoria) {
    case 'geral':
      return await prisma.sistemaConfiguracaoGeral.findFirst()
    case 'autenticacao':
      return await prisma.sistemaAutenticacaoConfig.findFirst()
    case 'transparencia':
      return await prisma.transparenciaConfig.findFirst()
    case 'backup':
      return await prisma.sistemaBackupConfig.findFirst()
    default:
      return null
  }
}

async function validarConfiguracoes(categoria: string, dados: any) {
  // Implementar validação básica
  const errors: string[] = []
  const warnings: string[] = []

  switch (categoria) {
    case 'geral':
      if (!dados.nomeInstituicao) {
        errors.push('Nome da instituição é obrigatório')
      }
      break
    
    case 'autenticacao':
      if (dados.senhaMinLength && (dados.senhaMinLength < 6 || dados.senhaMinLength > 50)) {
        errors.push('Tamanho mínimo da senha inválido')
      }
      break
    
    // Adicionar outras validações conforme necessário
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  }
} 