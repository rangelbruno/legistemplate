import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient, CargoParlamentar } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

/**
 * GET /api/v1/admin/vereadores/[id]
 * Busca um vereador específico por ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const vereador = await prisma.parlamentar.findUnique({
      where: { 
        id: params.id,
        cargo: CargoParlamentar.VEREADOR
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            ativo: true
          }
        },
        proposicoes: {
          select: {
            id: true,
            numero: true,
            ano: true,
            tipo: true,
            ementa: true,
            estadoAtual: true,
            dataApresentacao: true
          },
          orderBy: { dataApresentacao: 'desc' },
          take: 10
        },
        presencas: {
          select: {
            id: true,
            dataSessao: true,
            presente: true,
            tipoSessao: true
          },
          orderBy: { dataSessao: 'desc' },
          take: 10
        },
        votos: {
          select: {
            id: true,
            tipoVoto: true,
            votacao: {
              select: {
                dataVotacao: true,
                proposicao: {
                  select: {
                    numero: true,
                    ano: true,
                    ementa: true
                  }
                }
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      }
    })

    if (!vereador) {
      return NextResponse.json(
        { success: false, message: 'Vereador não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: vereador
    })

  } catch (error) {
    console.error('Erro ao buscar vereador:', error)
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/v1/admin/vereadores/[id]
 * Atualiza um vereador específico
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const {
      nome,
      email,
      partido,
      uf,
      mandatoInicio,
      mandatoFim,
      telefone,
      endereco,
      profissao,
      biografia,
      presidenteCamara,
      dataEleiçaoPresidencia,
      mandatoPresidenciaFim,
      ativo,
      password
    } = body

    // Verificar se vereador existe
    const vereadorExistente = await prisma.parlamentar.findUnique({
      where: { 
        id: params.id,
        cargo: CargoParlamentar.VEREADOR
      },
      include: { user: true }
    })

    if (!vereadorExistente) {
      return NextResponse.json(
        { success: false, message: 'Vereador não encontrado' },
        { status: 404 }
      )
    }

    // Verificar se email já existe (exceto para o próprio usuário)
    if (email && email !== vereadorExistente.user.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email }
      })

      if (existingUser) {
        return NextResponse.json(
          { success: false, message: 'Email já está em uso' },
          { status: 400 }
        )
      }
    }

    // Se está sendo definido como presidente, remover presidência de outros
    if (presidenteCamara && !vereadorExistente.presidenteCamara) {
      await prisma.parlamentar.updateMany({
        where: { 
          presidenteCamara: true,
          cargo: CargoParlamentar.VEREADOR,
          id: { not: params.id }
        },
        data: { 
          presidenteCamara: false,
          mandatoPresidenciaFim: new Date()
        }
      })
    }

    // Preparar dados para atualização
    const userData: any = {}
    const parlamentarData: any = {}

    if (nome) {
      userData.name = nome
      parlamentarData.nome = nome
    }
    if (email) userData.email = email
    if (ativo !== undefined) userData.ativo = ativo

    if (password) {
      userData.password = await bcrypt.hash(password, 10)
    }

    if (partido) parlamentarData.partido = partido
    if (uf) parlamentarData.uf = uf
    if (mandatoInicio) parlamentarData.mandatoInicio = new Date(mandatoInicio)
    if (mandatoFim) parlamentarData.mandatoFim = new Date(mandatoFim)
    if (telefone !== undefined) parlamentarData.telefone = telefone
    if (endereco !== undefined) parlamentarData.endereco = endereco
    if (profissao !== undefined) parlamentarData.profissao = profissao
    if (biografia !== undefined) parlamentarData.biografia = biografia
    if (ativo !== undefined) parlamentarData.ativo = ativo

    if (presidenteCamara !== undefined) {
      parlamentarData.presidenteCamara = presidenteCamara
      if (presidenteCamara) {
        if (dataEleiçaoPresidencia) {
          parlamentarData.dataEleiçaoPresidencia = new Date(dataEleiçaoPresidencia)
        }
        if (mandatoPresidenciaFim) {
          parlamentarData.mandatoPresidenciaFim = new Date(mandatoPresidenciaFim)
        }
      } else {
        parlamentarData.dataEleiçaoPresidencia = null
        parlamentarData.mandatoPresidenciaFim = new Date()
      }
    }

    // Atualizar em transação
    const vereadorAtualizado = await prisma.$transaction(async (tx) => {
      // Atualizar usuário se necessário
      if (Object.keys(userData).length > 0) {
        await tx.user.update({
          where: { id: vereadorExistente.userId },
          data: userData
        })
      }

      // Atualizar parlamentar
      const parlamentar = await tx.parlamentar.update({
        where: { id: params.id },
        data: parlamentarData,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
              ativo: true
            }
          }
        }
      })

      return parlamentar
    })

    return NextResponse.json({
      success: true,
      data: vereadorAtualizado,
      message: 'Vereador atualizado com sucesso'
    })

  } catch (error) {
    console.error('Erro ao atualizar vereador:', error)
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/v1/admin/vereadores/[id]
 * Remove um vereador (soft delete)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verificar se vereador existe
    const vereadorExistente = await prisma.parlamentar.findUnique({
      where: { 
        id: params.id,
        cargo: CargoParlamentar.VEREADOR
      },
      include: { user: true }
    })

    if (!vereadorExistente) {
      return NextResponse.json(
        { success: false, message: 'Vereador não encontrado' },
        { status: 404 }
      )
    }

    // Verificar se tem proposições ativas
    const proposicoesAtivas = await prisma.proposicao.count({
      where: {
        autorId: params.id,
        estadoAtual: {
          notIn: ['ARCHIVED', 'WITHDRAWN', 'PUBLISHED_ACTIVE']
        }
      }
    })

    if (proposicoesAtivas > 0) {
      return NextResponse.json(
        { success: false, message: 'Não é possível remover vereador com proposições em tramitação' },
        { status: 400 }
      )
    }

    // Soft delete - desativar usuário e parlamentar
    const vereadorDesativado = await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: vereadorExistente.userId },
        data: { ativo: false }
      })

      const parlamentar = await tx.parlamentar.update({
        where: { id: params.id },
        data: { 
          ativo: false,
          presidenteCamara: false,
          mandatoPresidenciaFim: vereadorExistente.presidenteCamara ? new Date() : null
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
              ativo: true
            }
          }
        }
      })

      return parlamentar
    })

    return NextResponse.json({
      success: true,
      data: vereadorDesativado,
      message: 'Vereador desativado com sucesso'
    })

  } catch (error) {
    console.error('Erro ao remover vereador:', error)
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 