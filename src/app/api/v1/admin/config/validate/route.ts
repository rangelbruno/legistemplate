import { NextRequest, NextResponse } from 'next/server'

/**
 * PUT /api/v1/admin/config/validate
 * Valida configurações antes de salvar
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { categoria, dados } = body

    if (!categoria || !dados) {
      return NextResponse.json(
        { success: false, error: 'Categoria e dados são obrigatórios' },
        { status: 400 }
      )
    }

    const validationResult = await validarConfiguracaoPorCategoria(categoria, dados)

    return NextResponse.json({
      success: validationResult.valid,
      errors: validationResult.errors,
      warnings: validationResult.warnings
    })

  } catch (error) {
    console.error('Erro ao validar configurações:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// Função para validar configuração por categoria
async function validarConfiguracaoPorCategoria(categoria: string, dados: any) {
  const errors: string[] = []
  const warnings: string[] = []

  switch (categoria) {
    case 'geral':
      if (!dados.nomeInstituicao || dados.nomeInstituicao.trim().length < 3) {
        errors.push('Nome da instituição deve ter pelo menos 3 caracteres')
      }
      
      if (dados.email && !isValidEmail(dados.email)) {
        errors.push('Email inválido')
      }
      
      if (dados.cnpj && !isValidCNPJ(dados.cnpj)) {
        errors.push('CNPJ inválido')
      }
      
      if (dados.corPrimaria && !isValidHexColor(dados.corPrimaria)) {
        errors.push('Cor primária deve ser um código hexadecimal válido')
      }
      break

    case 'autenticacao':
      if (dados.senhaMinLength && (dados.senhaMinLength < 6 || dados.senhaMinLength > 50)) {
        errors.push('Tamanho mínimo da senha deve estar entre 6 e 50 caracteres')
      }
      
      if (dados.sessaoTimeoutMinutos && (dados.sessaoTimeoutMinutos < 5 || dados.sessaoTimeoutMinutos > 1440)) {
        errors.push('Timeout da sessão deve estar entre 5 e 1440 minutos')
      }
      
      if (dados.senhaExpiraDias && dados.senhaExpiraDias < 30) {
        warnings.push('Recomenda-se que a senha expire em pelo menos 30 dias')
      }
      break

    case 'sessao-legislativa':
      if (!dados.nome || dados.nome.trim().length < 3) {
        errors.push('Nome da sessão deve ter pelo menos 3 caracteres')
      }
      
      if (!dados.dataInicio || !dados.dataFim) {
        errors.push('Data de início e fim são obrigatórias')
      }
      
      if (dados.dataInicio && dados.dataFim && new Date(dados.dataInicio) >= new Date(dados.dataFim)) {
        errors.push('Data de início deve ser anterior à data de fim')
      }
      
      if (dados.quorumMinimo && (dados.quorumMinimo < 1 || dados.quorumMinimo > 100)) {
        errors.push('Quórum mínimo deve estar entre 1 e 100')
      }
      break

    case 'perfis':
      if (!dados.nome || dados.nome.trim().length < 3) {
        errors.push('Nome do perfil deve ter pelo menos 3 caracteres')
      }
      
      if (dados.nivelAcesso && (dados.nivelAcesso < 1 || dados.nivelAcesso > 5)) {
        errors.push('Nível de acesso deve estar entre 1 e 5')
      }
      break

    case 'integracoes':
      if (dados.endpointUrl && !isValidURL(dados.endpointUrl)) {
        errors.push('URL do endpoint inválida')
      }
      
      if (dados.ativa && !dados.apiKey && dados.metodoAuth === 'API_KEY') {
        errors.push('Chave de API é obrigatória quando método de autenticação é API_KEY')
      }
      break

    case 'transparencia':
      if (dados.emailOuvidoria && !isValidEmail(dados.emailOuvidoria)) {
        errors.push('Email da ouvidoria inválido')
      }
      
      if (dados.prazoRespostaDias && (dados.prazoRespostaDias < 1 || dados.prazoRespostaDias > 365)) {
        errors.push('Prazo de resposta deve estar entre 1 e 365 dias')
      }
      break

    case 'backup':
      if (dados.retencaoDias && (dados.retencaoDias < 1 || dados.retencaoDias > 3650)) {
        errors.push('Retenção de backup deve estar entre 1 e 3650 dias')
      }
      
      if (dados.horarioBackup && !isValidTime(dados.horarioBackup)) {
        errors.push('Horário de backup deve estar no formato HH:mm')
      }
      break

    default:
      warnings.push(`Validação específica não implementada para categoria: ${categoria}`)
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  }
}

// Funções utilitárias de validação
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

function isValidCNPJ(cnpj: string): boolean {
  // Remove caracteres não numéricos
  const cleaned = cnpj.replace(/\D/g, '')
  
  // Verifica se tem 14 dígitos
  if (cleaned.length !== 14) return false
  
  // Verifica se não são todos dígitos iguais
  if (/^(\d)\1+$/.test(cleaned)) return false
  
  // Validação dos dígitos verificadores
  const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
  const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
  
  const sum1 = cleaned.slice(0, 12).split('').reduce((sum, digit, index) => 
    sum + parseInt(digit) * weights1[index], 0)
  
  const remainder1 = sum1 % 11
  const digit1 = remainder1 < 2 ? 0 : 11 - remainder1
  
  if (parseInt(cleaned[12]) !== digit1) return false
  
  const sum2 = cleaned.slice(0, 13).split('').reduce((sum, digit, index) => 
    sum + parseInt(digit) * weights2[index], 0)
  
  const remainder2 = sum2 % 11
  const digit2 = remainder2 < 2 ? 0 : 11 - remainder2
  
  return parseInt(cleaned[13]) === digit2
}

function isValidHexColor(color: string): boolean {
  const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
  return hexRegex.test(color)
}

function isValidURL(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

function isValidTime(time: string): boolean {
  const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/
  return timeRegex.test(time)
} 