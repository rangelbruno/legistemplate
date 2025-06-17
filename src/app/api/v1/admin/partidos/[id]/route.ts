import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface RouteParams {
  params: {
    id: string
  }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params

    const partido = await prisma.partido.findUnique({
      where: { id },
      include: {
        parlamentares: {
          select: {
            id: true,
            nome: true,
            matricula: true,
            ativo: true
          }
        },
        _count: {
          select: { parlamentares: true }
        }
      }
    })

    if (!partido) {
      return NextResponse.json(
        { error: 'Partido não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(partido)

  } catch (error) {
    console.error('Erro ao buscar partido:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params
    const body = await request.json()
    
    const { sigla, nome, numero, fundacao, presidente, website, logo, ativo } = body

    // Verificar se o partido existe
    const partidoExistente = await prisma.partido.findUnique({
      where: { id }
    })

    if (!partidoExistente) {
      return NextResponse.json(
        { error: 'Partido não encontrado' },
        { status: 404 }
      )
    }

    // Verificar se sigla já existe (exceto o próprio)
    if (sigla && sigla !== partidoExistente.sigla) {
      const siglaExistente = await prisma.partido.findUnique({
        where: { sigla }
      })

      if (siglaExistente) {
        return NextResponse.json(
          { error: 'Sigla já existe' },
          { status: 400 }
        )
      }
    }

    // Verificar se número já existe (exceto o próprio)
    if (numero && numero !== partidoExistente.numero) {
      const numeroExistente = await prisma.partido.findUnique({
        where: { numero }
      })

      if (numeroExistente) {
        return NextResponse.json(
          { error: 'Número já existe' },
          { status: 400 }
        )
      }
    }

    // Atualizar partido
    const partido = await prisma.partido.update({
      where: { id },
      data: {
        ...(sigla && { sigla }),
        ...(nome && { nome }),
        ...(numero && { numero }),
        ...(fundacao !== undefined && { fundacao: fundacao ? new Date(fundacao) : null }),
        ...(presidente !== undefined && { presidente }),
        ...(website !== undefined && { website }),
        ...(logo !== undefined && { logo }),
        ...(ativo !== undefined && { ativo })
      }
    })

    return NextResponse.json(partido)

  } catch (error) {
    console.error('Erro ao atualizar partido:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params

    // Verificar se o partido existe
    const partidoExistente = await prisma.partido.findUnique({
      where: { id },
      include: {
        _count: {
          select: { parlamentares: true }
        }
      }
    })

    if (!partidoExistente) {
      return NextResponse.json(
        { error: 'Partido não encontrado' },
        { status: 404 }
      )
    }

    // Verificar se há parlamentares vinculados
    if (partidoExistente._count.parlamentares > 0) {
      return NextResponse.json(
        { error: 'Não é possível excluir partido com parlamentares vinculados' },
        { status: 400 }
      )
    }

    // Excluir partido
    await prisma.partido.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Partido excluído com sucesso' })

  } catch (error) {
    console.error('Erro ao excluir partido:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 