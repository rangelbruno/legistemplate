import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

/**
 * GET /api/v1/admin/vereadores
 * Lista todos os vereadores com paginação e filtros
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const partido = searchParams.get('partido') || ''
    const ativo = searchParams.get('ativo')
    const presidenteCamara = searchParams.get('presidenteCamara')

    const skip = (page - 1) * limit

    // Construir filtros
    const where: any = {}

    if (search) {
      where.OR = [
        { nome: { contains: search, mode: 'insensitive' } },
        { user: { email: { contains: search, mode: 'insensitive' } } },
        { matricula: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (partido) {
      where.partido = {
        sigla: partido
      }
    }

    if (ativo !== null && ativo !== undefined) {
      where.ativo = ativo === 'true'
    }

    if (presidenteCamara !== null && presidenteCamara !== undefined) {
      where.presidenteCamara = presidenteCamara === 'true'
    }

    // Buscar vereadores
    const [vereadores, total] = await Promise.all([
      prisma.parlamentar.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
              ativo: true
            }
          },
          partido: {
            select: {
              id: true,
              sigla: true,
              nome: true,
              numero: true
            }
          }
        },
        skip,
        take: limit,
        orderBy: [
          { presidenteCamara: 'desc' }, // Presidente primeiro
          { nome: 'asc' }
        ]
      }),
      prisma.parlamentar.count({ where })
    ])

    return NextResponse.json({
      success: true,
      data: vereadores,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Erro ao buscar vereadores:', error)
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/v1/admin/vereadores
 * Cria um novo vereador
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      nome,
      email,
      partidoId,
      uf,
      mandatoInicio,
      mandatoFim,
      telefone,
      endereco,
      profissao,
      biografia,
      foto,
      presidenteCamara = false,
      dataEleiçaoPresidencia,
      mandatoPresidenciaFim,
      password = '123456' // Senha padrão
    } = body

    // Validações básicas
    if (!nome || !email || !partidoId || !uf || !mandatoInicio) {
      return NextResponse.json(
        { success: false, message: 'Campos obrigatórios: nome, email, partidoId, uf, mandatoInicio' },
        { status: 400 }
      )
    }

    // Verificar se email já existe
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'Email já está em uso' },
        { status: 400 }
      )
    }

    // Verificar se partido existe
    const partidoExists = await prisma.partido.findUnique({
      where: { id: partidoId }
    })

    if (!partidoExists) {
      return NextResponse.json(
        { success: false, message: 'Partido não encontrado' },
        { status: 400 }
      )
    }

    // Se está sendo definido como presidente, remover presidência de outros
    if (presidenteCamara) {
      await prisma.parlamentar.updateMany({
        where: { 
          presidenteCamara: true
        },
        data: { 
          presidenteCamara: false,
          mandatoPresidenciaFim: new Date()
        }
      })
    }

    // Gerar matrícula
    const ultimaMatricula = await prisma.parlamentar.findFirst({
      where: {
        matricula: {
          startsWith: 'VER'
        }
      },
      orderBy: { matricula: 'desc' }
    })

    let proximoNumero = 1
    if (ultimaMatricula) {
      const numeroAtual = parseInt(ultimaMatricula.matricula.substring(3))
      proximoNumero = numeroAtual + 1
    }

    const matricula = `VER${proximoNumero.toString().padStart(4, '0')}`

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10)

    // Criar usuário e vereador em transação
    const novoVereador = await prisma.$transaction(async (tx) => {
      // Criar usuário
      const user = await tx.user.create({
        data: {
          email,
          name: nome,
          password: hashedPassword,
          role: 'PARLAMENTAR'
        }
      })

      // Criar parlamentar
      const parlamentar = await tx.parlamentar.create({
        data: {
          userId: user.id,
          nome,
          matricula,
          partidoId,
          uf,
          mandatoInicio: new Date(mandatoInicio),
          mandatoFim: mandatoFim ? new Date(mandatoFim) : null,
          telefone,
          endereco,
          profissao,
          biografia,
          foto,
          presidenteCamara,
          dataEleiçaoPresidencia: dataEleiçaoPresidencia ? new Date(dataEleiçaoPresidencia) : null,
          mandatoPresidenciaFim: mandatoPresidenciaFim ? new Date(mandatoPresidenciaFim) : null
        },
        include: {
          user: {
            select: { id: true, email: true, name: true }
          },
          partido: {
            select: { id: true, sigla: true, nome: true }
          }
        }
      })

      return parlamentar
    })

    return NextResponse.json({
      success: true,
      message: 'Vereador criado com sucesso',
      data: novoVereador
    }, { status: 201 })

  } catch (error) {
    console.error('Erro ao criar vereador:', error)
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 