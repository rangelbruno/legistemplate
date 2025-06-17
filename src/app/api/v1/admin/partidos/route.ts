import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const ativo = searchParams.get('ativo')

    const skip = (page - 1) * limit

    // Filtros
    const where: any = {}
    
    if (search) {
      where.OR = [
        { sigla: { contains: search, mode: 'insensitive' } },
        { nome: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (ativo !== null && ativo !== '') {
      where.ativo = ativo === 'true'
    }

    // Buscar partidos com paginação
    const [partidos, total] = await Promise.all([
      prisma.partido.findMany({
        where,
        skip,
        take: limit,
        orderBy: { sigla: 'asc' },
        include: {
          _count: {
            select: { parlamentares: true }
          }
        }
      }),
      prisma.partido.count({ where })
    ])

    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      partidos,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    })

  } catch (error) {
    console.error('Erro ao buscar partidos:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const { sigla, nome, numero, fundacao, presidente, website, logo } = body

    // Validações
    if (!sigla || !nome || !numero) {
      return NextResponse.json(
        { error: 'Sigla, nome e número são obrigatórios' },
        { status: 400 }
      )
    }

    // Verificar se sigla já existe
    const siglaExistente = await prisma.partido.findUnique({
      where: { sigla }
    })

    if (siglaExistente) {
      return NextResponse.json(
        { error: 'Sigla já existe' },
        { status: 400 }
      )
    }

    // Verificar se número já existe
    const numeroExistente = await prisma.partido.findUnique({
      where: { numero }
    })

    if (numeroExistente) {
      return NextResponse.json(
        { error: 'Número já existe' },
        { status: 400 }
      )
    }

    // Criar partido
    const partido = await prisma.partido.create({
      data: {
        sigla,
        nome,
        numero,
        fundacao: fundacao ? new Date(fundacao) : null,
        presidente,
        website,
        logo
      }
    })

    return NextResponse.json(partido, { status: 201 })

  } catch (error) {
    console.error('Erro ao criar partido:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 