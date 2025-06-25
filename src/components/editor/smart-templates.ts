/**
 * Templates Inteligentes com Campos Editáveis
 * Baseado na estrutura de documentos legislativos reais
 */

export interface EditableField {
  id: string
  label: string
  type: 'text' | 'textarea' | 'select' | 'date' | 'number' | 'list'
  placeholder: string
  required: boolean
  options?: string[] // Para campos select
  defaultValue?: string
}

export interface SmartTemplate {
  id: string
  nome: string
  descricao: string
  categoria: string
  fields: EditableField[]
  htmlTemplate: string // Template HTML com placeholders
}

// Template de Ata de Sessão baseado na imagem
export const ataSessionTemplate: SmartTemplate = {
  id: 'ata-sessao-inteligente',
  nome: 'Ata de Sessão (Inteligente)',
  descricao: 'Template de ata com campos editáveis pré-configurados',
  categoria: 'Sessões',
  fields: [
    {
      id: 'num_sessao_plen',
      label: 'Número da Sessão Plenária',
      type: 'number',
      placeholder: 'Ex: 15',
      required: true,
      defaultValue: '1'
    },
    {
      id: 'nom_sessao',
      label: 'Nome da Sessão',
      type: 'select',
      placeholder: 'Selecione o tipo de sessão',
      required: true,
      options: ['ORDINÁRIA', 'EXTRAORDINÁRIA', 'SOLENE', 'ESPECIAL'],
      defaultValue: 'ORDINÁRIA'
    },
    {
      id: 'dia_sessao',
      label: 'Data da Sessão',
      type: 'date',
      placeholder: 'dd/mm/aaaa',
      required: true,
      defaultValue: new Date().toISOString().split('T')[0]
    },
    {
      id: 'presidente',
      label: 'Presidente da Sessão',
      type: 'text',
      placeholder: 'Nome do presidente',
      required: true,
      defaultValue: 'lst_presidente'
    },
    {
      id: 'secretario_1',
      label: '1º Secretário',
      type: 'text',
      placeholder: 'Nome do 1º secretário',
      required: true,
      defaultValue: 'lst_secretario'
    },
    {
      id: 'secretario_2',
      label: '2º Secretário',
      type: 'text',
      placeholder: 'Nome do 2º secretário',
      required: true,
      defaultValue: 'lst_secretario'
    },
    {
      id: 'vereadores_presentes',
      label: 'Vereadores Presentes',
      type: 'list',
      placeholder: 'Digite o nome e pressione Enter para adicionar',
      required: true,
      defaultValue: ''
    },
    {
      id: 'vereadores_ausentes',
      label: 'Vereadores Ausentes',
      type: 'list',
      placeholder: 'Digite o nome e pressione Enter para adicionar',
      required: false,
      defaultValue: ''
    },
    {
      id: 'hora_inicio',
      label: 'Horário de Início',
      type: 'text',
      placeholder: 'Ex: 09h00min',
      required: true,
      defaultValue: '09h00min'
    },
    {
      id: 'expediente_materias',
      label: 'Matérias do Expediente',
      type: 'textarea',
      placeholder: 'Descreva as matérias apresentadas no expediente...',
      required: false,
      defaultValue: ''
    },
    {
      id: 'requerimentos',
      label: 'Requerimentos Apresentados',
      type: 'textarea',
      placeholder: 'Liste os requerimentos apresentados...',
      required: false,
      defaultValue: ''
    },
    {
      id: 'indicacoes',
      label: 'Indicações Despachadas',
      type: 'textarea',
      placeholder: 'Descreva as indicações despachadas...',
      required: false,
      defaultValue: ''
    },
    {
      id: 'observacoes_presidente',
      label: 'Observações do Presidente',
      type: 'textarea',
      placeholder: 'Observações adicionais do presidente...',
      required: false,
      defaultValue: ''
    }
  ],
  htmlTemplate: `
    <div class="document-header">
      <h1>ATA DA {{num_sessao_plen}}ª SESSÃO {{nom_sessao}}</h1>
      <h2>INF_BASICAS_DIC["NOM_SESSAO"], EM {{dia_sessao}}</h2>
    </div>

    <div class="document-body">
      <p><strong>Presidência:</strong> {{presidente}}</p>
      <p><strong>1º Secretaria:</strong> {{secretario_1}}</p>
      <p><strong>2º Secretaria:</strong> {{secretario_2}}</p>

      <p><strong>Vereadores presentes:</strong></p>
      <div class="vereadores-presentes">
        {{vereadores_presentes_list}}
      </div>

      <p><strong>Vereadores ausentes:</strong></p>
      <div class="vereadores-ausentes">
        {{vereadores_ausentes_list}}
      </div>

      <p><strong>ABERTURA</strong> – Às {{hora_inicio}} horas do dia {{dia_sessao}}, iniciou-se a {{num_sessao_plen}}ª Sessão {{nom_sessao}} da Câmara Municipal, no Plenário do Legislativo. O Presidente, {{presidente}}, secretariado pelos Vereadores {{secretario_1}} e {{secretario_2}}, solicitou aos Edis que registrassem presença para o início dos trabalhos. Registraram a presença os Edis:</p>
      
      <div class="presencas">
        {{vereadores_presentes_detalhado}}
      </div>

      <p><strong>Ausentes:</strong></p>
      <div class="ausentes-detalhado">
        {{vereadores_ausentes_detalhado}}
      </div>

      <p>Com Vereadores presentes, a Presidência declarou aberta a sessão, "sob a proteção de Deus".</p>

      <h3>PEQUENO EXPEDIENTE –</h3>
      
      <h4>a) MATÉRIA APRESENTADA:</h4>
      <div class="materia-apresentada">
        {{expediente_materias}}
      </div>

      <h4>b) REQUERIMENTOS APRESENTADOS:</h4>
      <div class="requerimentos-apresentados">
        {{requerimentos}}
      </div>

      <h4>c) INDICAÇÕES DESPACHADAS:</h4>
      <div class="indicacoes-despachadas">
        {{indicacoes}}
      </div>

      <div class="observacoes-presidente">
        {{observacoes_presidente}}
      </div>
    </div>

    <div class="document-footer">
      <p>Ata lavrada por mim, {{secretario_1}}, e por mim revista e aprovada.</p>
      <div class="assinaturas">
        <div class="assinatura">
          <p>_________________________________</p>
          <p>{{presidente}}</p>
          <p>Presidente</p>
        </div>
        <div class="assinatura">
          <p>_________________________________</p>
          <p>{{secretario_1}}</p>
          <p>1º Secretário</p>
        </div>
      </div>
    </div>
  `
}

// Template de Projeto de Lei Inteligente
export const projetoLeiTemplate: SmartTemplate = {
  id: 'projeto-lei-inteligente',
  nome: 'Projeto de Lei (Inteligente)',
  descricao: 'Template de projeto de lei com campos editáveis',
  categoria: 'Proposições',
  fields: [
    {
      id: 'numero_projeto',
      label: 'Número do Projeto',
      type: 'text',
      placeholder: 'Ex: 001/2025',
      required: true,
      defaultValue: '001/2025'
    },
    {
      id: 'autor',
      label: 'Autor do Projeto',
      type: 'text',
      placeholder: 'Nome do vereador autor',
      required: true,
      defaultValue: ''
    },
    {
      id: 'ementa',
      label: 'Ementa',
      type: 'textarea',
      placeholder: 'Descreva brevemente o que o projeto dispõe...',
      required: true,
      defaultValue: ''
    },
    {
      id: 'justificativa',
      label: 'Justificativa',
      type: 'textarea',
      placeholder: 'Justifique a necessidade e importância do projeto...',
      required: true,
      defaultValue: ''
    },
    {
      id: 'artigos',
      label: 'Artigos da Lei',
      type: 'textarea',
      placeholder: 'Art. 1º - Esta lei...\nArt. 2º - ...',
      required: true,
      defaultValue: 'Art. 1º - \n\nArt. 2º - Esta lei entra em vigor na data de sua publicação.'
    }
  ],
  htmlTemplate: `
    <div class="document-header">
      <h1>PROJETO DE LEI Nº {{numero_projeto}}</h1>
      <p><strong>Autor:</strong> {{autor}}</p>
    </div>

    <div class="document-body">
      <h3>EMENTA</h3>
      <p>{{ementa}}</p>

      <h3>A CÂMARA MUNICIPAL DECRETA:</h3>
      
      <div class="artigos-lei">
        {{artigos}}
      </div>

      <h3>JUSTIFICATIVA</h3>
      <div class="justificativa">
        {{justificativa}}
      </div>
    </div>

    <div class="document-footer">
      <div class="assinatura">
        <p>{{autor}}</p>
        <p>Vereador</p>
      </div>
    </div>
  `
}

// Lista de todos os templates inteligentes
export const smartTemplates: SmartTemplate[] = [
  ataSessionTemplate,
  projetoLeiTemplate
]

/**
 * Processa o template substituindo os placeholders pelos valores
 */
export function processTemplate(template: SmartTemplate, values: Record<string, any>): string {
  let html = template.htmlTemplate

  // Substituir placeholders simples
  template.fields.forEach(field => {
    const value = values[field.id] || field.defaultValue || ''
    const placeholder = `{{${field.id}}}`
    html = html.replace(new RegExp(placeholder, 'g'), value)
  })

  // Processar listas especiais
  if (values.vereadores_presentes && Array.isArray(values.vereadores_presentes)) {
    const listaPresentes = values.vereadores_presentes
      .map((nome: string) => `<p>${nome}</p>`)
      .join('')
    html = html.replace('{{vereadores_presentes_list}}', listaPresentes)
    html = html.replace('{{vereadores_presentes_detalhado}}', listaPresentes)
  }

  if (values.vereadores_ausentes && Array.isArray(values.vereadores_ausentes)) {
    const listaAusentes = values.vereadores_ausentes
      .map((nome: string) => `<p>${nome}</p>`)
      .join('')
    html = html.replace('{{vereadores_ausentes_list}}', listaAusentes)
    html = html.replace('{{vereadores_ausentes_detalhado}}', listaAusentes)
  }

  return html
}

/**
 * Obtém um template por ID
 */
export function getSmartTemplate(id: string): SmartTemplate | undefined {
  return smartTemplates.find(template => template.id === id)
} 