import { PrismaClient, EstadoTramitacao, TipoProposicao, Role, AdminLevel, TipoComissao } from '@prisma/client'
import { faker } from '@faker-js/faker'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...')
  
  // Hash padrão para desenvolvimento - senha: "123456"
  const defaultPasswordHash = await bcrypt.hash('123456', 12)
  
  // 1. Limpar dados existentes
  console.log('🧹 Limpando dados existentes...')
  await prisma.tramitacaoEvento.deleteMany()
  await prisma.voto.deleteMany()
  await prisma.votacao.deleteMany()
  await prisma.emenda.deleteMany()
  await prisma.relatoria.deleteMany()
  await prisma.presenca.deleteMany()
  await prisma.proposicao.deleteMany()
  await prisma.comissao.deleteMany()
  await prisma.parlamentar.deleteMany()
  await prisma.admin.deleteMany()
  await prisma.user.deleteMany()
  
  // 2. Criar usuário administrador
  console.log('👤 Criando usuário administrador...')
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@parlamentar.gov.br',
      name: 'Administrador Sistema',
      password: defaultPasswordHash,
      role: Role.ADMIN,
      ativo: true
    }
  })
  
  await prisma.admin.create({
    data: {
      userId: adminUser.id,
      nivel: AdminLevel.SUPER_ADMIN,
      departamento: 'TI',
      ativo: true
    }
  })

  // 2.1. Criar usuário desenvolvedor
  console.log('👨‍💻 Criando usuário desenvolvedor...')
  const devUser = await prisma.user.create({
    data: {
      email: 'dev@parlamentar.gov.br',
      name: 'Desenvolvedor Sistema',
      password: defaultPasswordHash,
      role: Role.DESENVOLVEDOR,
      ativo: true
    }
  })
  
  // 3. Criar comissões
  console.log('🏛️ Criando comissões...')
  const comissoes: any[] = []
  const comissoesData = [
    { nome: 'Comissão de Constituição e Justiça', sigla: 'CCJ', tipo: TipoComissao.PERMANENTE },
    { nome: 'Comissão de Finanças e Tributação', sigla: 'CFT', tipo: TipoComissao.PERMANENTE },
    { nome: 'Comissão de Educação', sigla: 'CE', tipo: TipoComissao.PERMANENTE },
    { nome: 'Comissão de Saúde', sigla: 'CS', tipo: TipoComissao.PERMANENTE },
    { nome: 'Comissão de Meio Ambiente', sigla: 'CMA', tipo: TipoComissao.PERMANENTE }
  ]
  
  for (const comissaoData of comissoesData) {
    const comissao = await prisma.comissao.create({
      data: comissaoData
    })
    comissoes.push(comissao)
  }
  
  // 4. Criar parlamentares
  console.log('🏛️ Criando parlamentares...')
  const parlamentares: any[] = []
  const partidos = ['PT', 'PSDB', 'MDB', 'PP', 'PSL', 'PDT', 'PSB', 'PODE', 'PL', 'UNIÃO']
  const ufs = ['SP', 'RJ', 'MG', 'RS', 'PR', 'SC', 'BA', 'GO', 'PE', 'CE']
  
  for (let i = 0; i < 30; i++) {
    const user = await prisma.user.create({
      data: {
        email: faker.internet.email(),
        name: faker.person.fullName(),
        password: defaultPasswordHash,
        role: Role.PARLAMENTAR,
        ativo: true
      }
    })
    
    const parlamentar = await prisma.parlamentar.create({
      data: {
        userId: user.id,
        matricula: `PAR${String(i + 1).padStart(4, '0')}`,
        nome: user.name,
        partido: faker.helpers.arrayElement(partidos),
        uf: faker.helpers.arrayElement(ufs),
        mandatoInicio: faker.date.past({ years: 2 }),
        ativo: faker.datatype.boolean({ probability: 0.9 })
      }
    })
    
    parlamentares.push(parlamentar)
  }
  
  // 5. Criar proposições com tramitação
  console.log('📄 Criando proposições...')
  const tiposProposicao = Object.values(TipoProposicao)
  const estadosPossiveis = [
    EstadoTramitacao.DRAFT_INITIATED,
    EstadoTramitacao.SUBMITTED_FOR_REVIEW,
    EstadoTramitacao.COMMITTEE_ASSIGNED,
    EstadoTramitacao.IN_COMMITTEE_REVIEW,
    EstadoTramitacao.COMMITTEE_APPROVED,
    EstadoTramitacao.READY_FOR_PLENARY
  ]
  
  for (let i = 0; i < 50; i++) {
    const autor = faker.helpers.arrayElement(parlamentares)
    const tipo = faker.helpers.arrayElement(tiposProposicao)
    const ano = new Date().getFullYear()
    
    const proposicao = await prisma.proposicao.create({
      data: {
        numero: String(i + 1).padStart(4, '0'),
        ano: ano,
        tipo: tipo,
        ementa: faker.lorem.paragraph(),
        justificacao: faker.lorem.paragraphs(2),
        autorId: autor.id,
        estadoAtual: faker.helpers.arrayElement(estadosPossiveis),
        dataApresentacao: faker.date.recent({ days: 180 })
      }
    })
    
    // 6. Criar alguns eventos de tramitação
    const numEventos = faker.number.int({ min: 1, max: 4 })
    let estadoAtual: EstadoTramitacao = EstadoTramitacao.DRAFT_INITIATED
    
    for (let j = 0; j < numEventos; j++) {
      const proximosEstados = getProximosEstadosValidos(estadoAtual)
      const novoEstado = j === numEventos - 1 
        ? proposicao.estadoAtual 
        : faker.helpers.arrayElement(proximosEstados)
      
      await prisma.tramitacaoEvento.create({
        data: {
          proposicaoId: proposicao.id,
          estadoAnterior: j === 0 ? null : estadoAtual,
          estadoNovo: novoEstado,
          comissaoId: faker.helpers.maybe(() => faker.helpers.arrayElement(comissoes).id, { probability: 0.6 }),
          observacoes: faker.lorem.sentence(),
          dataEvento: faker.date.recent({ days: 30 })
        }
      })
      
      estadoAtual = novoEstado
    }
  }
  
  // 7. Criar usuários públicos de exemplo
  console.log('👥 Criando usuários públicos...')
  for (let i = 0; i < 10; i++) {
    await prisma.user.create({
      data: {
        email: faker.internet.email(),
        name: faker.person.fullName(),
        role: Role.PUBLIC
      }
    })
  }
  
  console.log('✅ Seed concluído com sucesso!')
  console.log(`📊 Dados criados:`)
  console.log(`   👤 ${await prisma.user.count()} usuários`)
  console.log(`   🏛️ ${await prisma.parlamentar.count()} parlamentares`) 
  console.log(`   📄 ${await prisma.proposicao.count()} proposições`)
  console.log(`   🔄 ${await prisma.tramitacaoEvento.count()} eventos de tramitação`)
  console.log(`   🏛️ ${await prisma.comissao.count()} comissões`)
}

function getProximosEstadosValidos(estadoAtual: EstadoTramitacao): EstadoTramitacao[] {
  // Simplificado para o seed inicial - apenas principais transições
  switch (estadoAtual) {
    case EstadoTramitacao.DRAFT_INITIATED:
      return [EstadoTramitacao.SUBMITTED_FOR_REVIEW]
    case EstadoTramitacao.SUBMITTED_FOR_REVIEW:
      return [EstadoTramitacao.COMMITTEE_ASSIGNED]
    case EstadoTramitacao.COMMITTEE_ASSIGNED:
      return [EstadoTramitacao.IN_COMMITTEE_REVIEW]
    case EstadoTramitacao.IN_COMMITTEE_REVIEW:
      return [EstadoTramitacao.COMMITTEE_APPROVED]
    case EstadoTramitacao.COMMITTEE_APPROVED:
      return [EstadoTramitacao.READY_FOR_PLENARY]
    default:
      return [estadoAtual]
  }
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o seed:')
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 