import { Schema, Node } from 'prosemirror-model'

interface TemplateData {
  header?: {
    logoUrl?: string
    camaraInfo?: {
      nome: string
      endereco: string
      telefone: string
      email: string
      site: string
    }
  }
  footer?: {
    logoUrl?: string
    camaraInfo?: {
      nome: string
      endereco: string
      telefone: string
      email: string
      site: string
    }
  }
}

export function createDocumentTemplate(templateId: string, schema: Schema, data?: TemplateData): Node {
  const { header, footer } = data || {}
  
  // Criar header simples usando nodes básicos
  const createHeader = () => {
    const logoText = header?.logoUrl 
      ? `[LOGO: ${header.logoUrl}]`
      : '[LOGO DA CÂMARA]'
    
    const infoText = header?.camaraInfo 
      ? `${header.camaraInfo.nome}\n${header.camaraInfo.endereco}\n${header.camaraInfo.telefone} | ${header.camaraInfo.email}\n${header.camaraInfo.site}`
      : 'CÂMARA MUNICIPAL\nEndereço da Câmara\nTelefone | Email\nSite'

    return [
      schema.nodes.paragraph.create({}, schema.text(logoText)),
      schema.nodes.paragraph.create({}, schema.text(infoText))
    ]
  }

  // Criar footer simples usando nodes básicos
  const createFooter = () => {
    const infoText = footer?.camaraInfo 
      ? `${footer.camaraInfo.nome} | ${footer.camaraInfo.telefone} | ${footer.camaraInfo.email} | ${footer.camaraInfo.site}`
      : 'CÂMARA MUNICIPAL | Telefone | Email | Site'

    return [
      schema.nodes.paragraph.create({}, schema.text(infoText))
    ]
  }

  const headerNodes = createHeader()
  const footerNodes = createFooter()

  switch (templateId) {
    case 'ata-sessao':
      return createAtaSessaoTemplate(schema, headerNodes, footerNodes)
    
    case 'projeto-lei':
      return createProjetoLeiTemplate(schema, headerNodes, footerNodes)
    
    case 'requerimento':
      return createRequerimentoTemplate(schema, headerNodes, footerNodes)
    
    case 'decreto':
      return createDecretoTemplate(schema, headerNodes, footerNodes)
    
    case 'oficio':
      return createOficioTemplate(schema, headerNodes, footerNodes)
    
    case 'relatorio':
      return createRelatorioTemplate(schema, headerNodes, footerNodes)
    
    default:
      return createBlankTemplate(schema, headerNodes, footerNodes)
  }
}

function createAtaSessaoTemplate(schema: Schema, headerNodes: Node[], footerNodes: Node[]): Node {
  const content = [
    ...headerNodes,
    schema.nodes.heading.create({ level: 1 }, schema.text('ATA DA [NÚMERO]ª SESSÃO [TIPO]')),
    schema.nodes.paragraph.create({}, schema.text('Data: [DATA]')),
    schema.nodes.paragraph.create({}, schema.text('Horário: [HORÁRIO INÍCIO] às [HORÁRIO FIM]')),
    schema.nodes.paragraph.create({}, schema.text('Local: [LOCAL]')),
    
    schema.nodes.heading.create({ level: 2 }, schema.text('PRESENTES')),
    schema.nodes.paragraph.create({}, schema.text('[LISTA DE PRESENTES]')),
    
    schema.nodes.heading.create({ level: 2 }, schema.text('ORDEM DO DIA')),
    schema.nodes.paragraph.create({}, schema.text('[CONTEÚDO DA ORDEM DO DIA]')),
    
    schema.nodes.heading.create({ level: 2 }, schema.text('EXPEDIENTE')),
    schema.nodes.paragraph.create({}, schema.text('[CONTEÚDO DO EXPEDIENTE]')),
    
    schema.nodes.heading.create({ level: 2 }, schema.text('DELIBERAÇÕES')),
    schema.nodes.paragraph.create({}, schema.text('[DELIBERAÇÕES DA SESSÃO]')),
    
    ...footerNodes
  ]

  return schema.nodes.doc.create({}, content)
}

function createProjetoLeiTemplate(schema: Schema, headerNodes: Node[], footerNodes: Node[]): Node {
  const content = [
    ...headerNodes,
    schema.nodes.heading.create({ level: 1 }, schema.text('PROJETO DE LEI Nº [NÚMERO]/[ANO]')),
    
    schema.nodes.paragraph.create({}, [
      schema.text('EMENTA: '),
      schema.text('[EMENTA DO PROJETO]').mark([schema.marks.em.create()])
    ]),
    
    schema.nodes.paragraph.create({}, schema.text('O Prefeito Municipal de [MUNICÍPIO], Estado de [ESTADO], no uso de suas atribuições legais,')),
    
    schema.nodes.heading.create({ level: 2 }, schema.text('DECRETA:')),
    
    schema.nodes.paragraph.create({}, [
      schema.text('Art. 1º ').mark([schema.marks.strong.create()]),
      schema.text('[CAPUT DO ARTIGO]')
    ]),
    
    schema.nodes.paragraph.create({}, [
      schema.text('Art. 2º ').mark([schema.marks.strong.create()]),
      schema.text('Esta Lei entra em vigor na data de sua publicação.')
    ]),
    
    schema.nodes.paragraph.create({}, schema.text('[LOCAL], [DATA]')),
    
    schema.nodes.paragraph.create({}, schema.text('_________________________________')),
    schema.nodes.paragraph.create({}, schema.text('[NOME DO PREFEITO]')),
    schema.nodes.paragraph.create({}, schema.text('Prefeito Municipal')),
    
    ...footerNodes
  ]

  return schema.nodes.doc.create({}, content)
}

function createRequerimentoTemplate(schema: Schema, headerNodes: Node[], footerNodes: Node[]): Node {
  const content = [
    ...headerNodes,
    schema.nodes.heading.create({ level: 1 }, schema.text('REQUERIMENTO Nº [NÚMERO]/[ANO]')),
    
    schema.nodes.paragraph.create({}, schema.text('Senhor Presidente,')),
    
    schema.nodes.paragraph.create({}, schema.text('O(A) Vereador(a) que este subscreve, no uso de suas atribuições legais, vem respeitosamente à presença de Vossa Excelência requerer:')),
    
    schema.nodes.paragraph.create({}, schema.text('[OBJETO DO REQUERIMENTO]')),
    
    schema.nodes.paragraph.create({}, [
      schema.text('Justificativa: ').mark([schema.marks.strong.create()]),
      schema.text('[JUSTIFICATIVA DO REQUERIMENTO]')
    ]),
    
    schema.nodes.paragraph.create({}, schema.text('Diante do exposto, aguardo o deferimento.')),
    
    schema.nodes.paragraph.create({}, schema.text('[LOCAL], [DATA]')),
    
    schema.nodes.paragraph.create({}, schema.text('_________________________________')),
    schema.nodes.paragraph.create({}, schema.text('[NOME DO VEREADOR]')),
    schema.nodes.paragraph.create({}, schema.text('Vereador(a)')),
    
    ...footerNodes
  ]

  return schema.nodes.doc.create({}, content)
}

function createDecretoTemplate(schema: Schema, headerNodes: Node[], footerNodes: Node[]): Node {
  const content = [
    ...headerNodes,
    schema.nodes.heading.create({ level: 1 }, schema.text('DECRETO LEGISLATIVO Nº [NÚMERO]/[ANO]')),
    
    schema.nodes.paragraph.create({}, [
      schema.text('EMENTA: '),
      schema.text('[EMENTA DO DECRETO]').mark([schema.marks.em.create()])
    ]),
    
    schema.nodes.paragraph.create({}, schema.text('A Câmara Municipal de [MUNICÍPIO], Estado de [ESTADO], no uso de suas atribuições constitucionais e legais,')),
    
    schema.nodes.heading.create({ level: 2 }, schema.text('DECRETA:')),
    
    schema.nodes.paragraph.create({}, [
      schema.text('Art. 1º ').mark([schema.marks.strong.create()]),
      schema.text('[ARTIGO PRINCIPAL]')
    ]),
    
    schema.nodes.paragraph.create({}, [
      schema.text('Art. 2º ').mark([schema.marks.strong.create()]),
      schema.text('Este Decreto Legislativo entra em vigor na data de sua publicação.')
    ]),
    
    schema.nodes.paragraph.create({}, schema.text('[LOCAL], [DATA]')),
    
    schema.nodes.paragraph.create({}, schema.text('_________________________________')),
    schema.nodes.paragraph.create({}, schema.text('[NOME DO PRESIDENTE]')),
    schema.nodes.paragraph.create({}, schema.text('Presidente da Câmara Municipal')),
    
    ...footerNodes
  ]

  return schema.nodes.doc.create({}, content)
}

function createOficioTemplate(schema: Schema, headerNodes: Node[], footerNodes: Node[]): Node {
  const content = [
    ...headerNodes,
    schema.nodes.heading.create({ level: 1 }, schema.text('OFÍCIO Nº [NÚMERO]/[ANO]')),
    
    schema.nodes.paragraph.create({}, schema.text('[DESTINATÁRIO]')),
    schema.nodes.paragraph.create({}, schema.text('[ENDEREÇO]')),
    
    schema.nodes.paragraph.create({}, [
      schema.text('Assunto: ').mark([schema.marks.strong.create()]),
      schema.text('[ASSUNTO DO OFÍCIO]')
    ]),
    
    schema.nodes.paragraph.create({}, schema.text('Senhor(a) [CARGO],')),
    
    schema.nodes.paragraph.create({}, schema.text('[CONTEÚDO DO OFÍCIO]')),
    
    schema.nodes.paragraph.create({}, schema.text('Atenciosamente,')),
    
    schema.nodes.paragraph.create({}, schema.text('[LOCAL], [DATA]')),
    
    schema.nodes.paragraph.create({}, schema.text('_________________________________')),
    schema.nodes.paragraph.create({}, schema.text('[NOME DO REMETENTE]')),
    schema.nodes.paragraph.create({}, schema.text('[CARGO DO REMETENTE]')),
    
    ...footerNodes
  ]

  return schema.nodes.doc.create({}, content)
}

function createRelatorioTemplate(schema: Schema, headerNodes: Node[], footerNodes: Node[]): Node {
  const content = [
    ...headerNodes,
    schema.nodes.heading.create({ level: 1 }, schema.text('RELATÓRIO DA COMISSÃO DE [NOME DA COMISSÃO]')),
    
    schema.nodes.paragraph.create({}, [
      schema.text('Projeto: ').mark([schema.marks.strong.create()]),
      schema.text('[IDENTIFICAÇÃO DO PROJETO]')
    ]),
    
    schema.nodes.paragraph.create({}, [
      schema.text('Autor: ').mark([schema.marks.strong.create()]),
      schema.text('[NOME DO AUTOR]')
    ]),
    
    schema.nodes.paragraph.create({}, [
      schema.text('Relator: ').mark([schema.marks.strong.create()]),
      schema.text('[NOME DO RELATOR]')
    ]),
    
    schema.nodes.heading.create({ level: 2 }, schema.text('I - RELATÓRIO')),
    schema.nodes.paragraph.create({}, schema.text('[ANÁLISE DO PROJETO]')),
    
    schema.nodes.heading.create({ level: 2 }, schema.text('II - PARECER')),
    schema.nodes.paragraph.create({}, schema.text('[PARECER DA COMISSÃO]')),
    
    schema.nodes.paragraph.create({}, schema.text('[LOCAL], [DATA]')),
    
    schema.nodes.paragraph.create({}, schema.text('_________________________________')),
    schema.nodes.paragraph.create({}, schema.text('[NOME DO RELATOR]')),
    schema.nodes.paragraph.create({}, schema.text('Relator')),
    
    ...footerNodes
  ]

  return schema.nodes.doc.create({}, content)
}

function createBlankTemplate(schema: Schema, headerNodes: Node[], footerNodes: Node[]): Node {
  const content = [
    ...headerNodes,
    schema.nodes.heading.create({ level: 1 }, schema.text('DOCUMENTO')),
    schema.nodes.paragraph.create({}, schema.text('Digite seu conteúdo aqui...')),
    ...footerNodes
  ]

  return schema.nodes.doc.create({}, content)
} 