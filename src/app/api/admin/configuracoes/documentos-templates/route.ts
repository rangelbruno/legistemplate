// Mock de dados - substituir por banco de dados real
let documentos = [
  {
    id: '1',
    titulo: 'Ata da 15ª Sessão Ordinária',
    template: 'ata-sessao',
    conteudo: '{"type":"doc","content":[]}',
    html: '<h1>Ata da 15ª Sessão Ordinária</h1>',
    criadoEm: '2025-01-15T10:00:00Z',
    atualizadoEm: '2025-01-15T10:00:00Z',
    status: 'finalizado',
    autor: 'Secretário'
  },
  {
    id: '2',
    titulo: 'Projeto de Lei nº 001/2025',
    template: 'projeto-lei',
    conteudo: '{"type":"doc","content":[]}',
    html: '<h1>Projeto de Lei nº 001/2025</h1>',
    criadoEm: '2025-01-14T14:30:00Z',
    atualizadoEm: '2025-01-14T14:30:00Z',
    status: 'rascunho',
    autor: 'Vereador João'
  }
]

export async function GET() {
  try {
    return Response.json(documentos)
  } catch (error) {
    return Response.json(
      { error: 'Erro ao buscar documentos' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    const novoDocumento = {
      id: (documentos.length + 1).toString(),
      ...data,
      criadoEm: new Date().toISOString(),
      atualizadoEm: new Date().toISOString()
    }
    
    documentos.push(novoDocumento)
    
    return Response.json(novoDocumento, { status: 201 })
  } catch (error) {
    return Response.json(
      { error: 'Erro ao criar documento' },
      { status: 500 }
    )
  }
} 