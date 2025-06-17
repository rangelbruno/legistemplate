import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

/**
 * GET /api/v1/admin/vereadores/presidente
 * Busca o presidente atual da câmara
 */
export async function GET() {
  try {
    const presidente = await prisma.parlamentar.findFirst({
      where: { 
        presidenteCamara: true,
        ativo: true
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

    return NextResponse.json({
      success: true,
      data: presidente
    })

  } catch (error) {
    console.error('Erro ao buscar presidente:', error)
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/v1/admin/vereadores/presidente
 * Define um novo presidente da câmara
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { vereadorId, dataEleicao, mandatoFim } = body

    if (!vereadorId) {
      return NextResponse.json(
        { success: false, message: 'ID do vereador é obrigatório' },
        { status: 400 }
      )
    }

    // Verificar se o vereador existe
    const vereador = await prisma.parlamentar.findUnique({
      where: { id: vereadorId },
      include: { user: true }
    })

    if (!vereador || !vereador.ativo) {
      return NextResponse.json(
        { success: false, message: 'Vereador não encontrado ou inativo' },
        { status: 404 }
      )
    }

    // Remover presidência de outros vereadores
    await prisma.parlamentar.updateMany({
      where: { 
        presidenteCamara: true,
        id: { not: vereadorId }
      },
      data: { 
        presidenteCamara: false,
        mandatoPresidenciaFim: new Date()
      }
    })

    // Definir novo presidente
    const novoPresidente = await prisma.parlamentar.update({
      where: { id: vereadorId },
      data: {
        presidenteCamara: true,
        dataEleiçaoPresidencia: dataEleicao ? new Date(dataEleicao) : new Date(),
        mandatoPresidenciaFim: mandatoFim ? new Date(mandatoFim) : null
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

    return NextResponse.json({
      success: true,
      data: novoPresidente,
      message: `${vereador.nome} foi definido como presidente da câmara`
    })

  } catch (error) {
    console.error('Erro ao definir presidente:', error)
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/v1/admin/vereadores/presidente
 * Remove o presidente atual (finaliza mandato)
 */
export async function DELETE() {
  try {
    const presidenteAtual = await prisma.parlamentar.findFirst({
      where: { presidenteCamara: true },
      include: { user: true }
    })

    if (!presidenteAtual) {
      return NextResponse.json(
        { success: false, message: 'Nenhum presidente ativo encontrado' },
        { status: 404 }
      )
    }

    const expresidente = await prisma.parlamentar.update({
      where: { id: presidenteAtual.id },
      data: {
        presidenteCamara: false,
        mandatoPresidenciaFim: new Date()
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

    return NextResponse.json({
      success: true,
      data: expresidente,
      message: `Mandato de ${presidenteAtual.nome} como presidente foi finalizado`
    })

  } catch (error) {
    console.error('Erro ao remover presidente:', error)
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 