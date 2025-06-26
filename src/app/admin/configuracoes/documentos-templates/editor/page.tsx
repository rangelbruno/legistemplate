'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import TiptapEditor from '../../../../../components/editor/TiptapEditor'
import './EditorPage.css'

// Templates de documentos
const templates = {
  'blank': '',
  'requerimento': `
    <h1 style="text-align: center;">REQUERIMENTO Nº ___/2025</h1>
    
    <p><strong>Senhor Presidente,</strong></p>
    
    <p style="text-align: justify;">Nos termos do Regimento Interno desta Casa de Leis, venho respeitosamente requerer a Vossa Excelência que se digne submeter ao Plenário desta Câmara Municipal o seguinte requerimento:</p>
    
    <p style="text-align: justify;">[Texto do requerimento]</p>
    
    <p><strong>Justificativa:</strong></p>
    
    <p style="text-align: justify;">[Justificativa do requerimento]</p>
    
    <p>Nestes termos, pede deferimento.</p>
    
    <p style="margin-top: 3rem;">
      <strong>Município, ___ de _______ de 2025.</strong>
    </p>
    
    <div style="text-align: center; margin-top: 3rem;">
      <p>_________________________________</p>
      <p><strong>[Nome do Vereador]</strong></p>
      <p>Vereador</p>
    </div>
  `,
  'projeto-lei': `
    <h1 style="text-align: center;">PROJETO DE LEI Nº ___/2025</h1>
    
    <p><strong>EMENTA:</strong> [Descreva brevemente o que a lei dispõe]</p>
    
    <p><strong>A CÂMARA MUNICIPAL DECRETA:</strong></p>
    
    <p><strong>Art. 1º</strong> - [Artigo principal da lei]</p>
    
    <p><strong>Parágrafo único.</strong> [Se houver parágrafo único]</p>
    
    <p><strong>Art. 2º</strong> - [Segundo artigo]</p>
    
    <p><strong>Art. 3º</strong> - Esta lei entra em vigor na data de sua publicação.</p>
    
    <h3>JUSTIFICATIVA</h3>
    
    <p style="text-align: justify;">[Justificativa detalhada do projeto de lei]</p>
    
    <p style="margin-top: 3rem;">
      <strong>Município, ___ de _______ de 2025.</strong>
    </p>
    
    <div style="text-align: center; margin-top: 3rem;">
      <p>_________________________________</p>
      <p><strong>[Nome do Vereador]</strong></p>
      <p>Vereador</p>
    </div>
  `,
  'decreto': `
    <h1 style="text-align: center;">DECRETO Nº ___/2025</h1>
    
    <p><strong>EMENTA:</strong> [Descreva brevemente o que o decreto dispõe]</p>
    
    <p><strong>O PREFEITO MUNICIPAL</strong>, no uso das atribuições que lhe confere a Lei Orgânica do Município,</p>
    
    <p><strong>DECRETA:</strong></p>
    
    <p><strong>Art. 1º</strong> - [Artigo principal do decreto]</p>
    
    <p><strong>Art. 2º</strong> - [Segundo artigo]</p>
    
    <p><strong>Art. 3º</strong> - Este decreto entra em vigor na data de sua publicação.</p>
    
    <p style="margin-top: 3rem;">
      <strong>Município, ___ de _______ de 2025.</strong>
    </p>
    
    <div style="text-align: center; margin-top: 3rem;">
      <p>_________________________________</p>
      <p><strong>[Nome do Prefeito]</strong></p>
      <p>Prefeito Municipal</p>
    </div>
  `,
  'oficio': `
    <div style="text-align: right; margin-bottom: 2rem;">
      <p><strong>OFÍCIO Nº ___/2025</strong></p>
      <p>Município, ___ de _______ de 2025.</p>
    </div>
    
    <p><strong>Para:</strong> [Destinatário]<br>
    <strong>De:</strong> [Remetente]<br>
    <strong>Assunto:</strong> [Assunto do ofício]</p>
    
    <p><strong>Senhor(a) [Cargo do Destinatário],</strong></p>
    
    <p style="text-align: justify;">[Conteúdo do ofício]</p>
    
    <p>Atenciosamente,</p>
    
    <div style="text-align: center; margin-top: 3rem;">
      <p>_________________________________</p>
      <p><strong>[Nome do Remetente]</strong></p>
      <p>[Cargo do Remetente]</p>
    </div>
  `,
  'relatorio': `
    <h1 style="text-align: center;">RELATÓRIO</h1>
    <h2 style="text-align: center;">[Título do Relatório]</h2>
    
    <p><strong>Período:</strong> [Período do relatório]</p>
    <p><strong>Responsável:</strong> [Nome do responsável]</p>
    <p><strong>Data:</strong> [Data de elaboração]</p>
    
    <h3>1. INTRODUÇÃO</h3>
    <p style="text-align: justify;">[Introdução do relatório]</p>
    
    <h3>2. DESENVOLVIMENTO</h3>
    <p style="text-align: justify;">[Desenvolvimento do relatório]</p>
    
    <h3>3. CONCLUSÃO</h3>
    <p style="text-align: justify;">[Conclusão do relatório]</p>
    
    <div style="text-align: center; margin-top: 3rem;">
      <p>_________________________________</p>
      <p><strong>[Nome do Responsável]</strong></p>
      <p>[Cargo]</p>
    </div>
  `,
  'ata-sessao': `
    <h1 style="text-align: center;">ATA DA ___ª SESSÃO ORDINÁRIA</h1>
    <h2 style="text-align: center;">DA CÂMARA MUNICIPAL</h2>
    
    <p><strong>Data:</strong> ___ de _______ de 2025</p>
    <p><strong>Horário de Início:</strong> ___h___min</p>
    <p><strong>Horário de Encerramento:</strong> ___h___min</p>
    <p><strong>Presidente:</strong> [Nome do Presidente]</p>
    <p><strong>Secretário:</strong> [Nome do Secretário]</p>
    
    <h3>VEREADORES PRESENTES:</h3>
    <ul>
      <li>[Nome do Vereador 1]</li>
      <li>[Nome do Vereador 2]</li>
      <li>[Nome do Vereador 3]</li>
    </ul>
    
    <h3>ORDEM DO DIA:</h3>
    <p style="text-align: justify;">[Desenvolvimento da sessão]</p>
    
    <h3>ENCERRAMENTO:</h3>
    <p style="text-align: justify;">Nada mais havendo a tratar, o Senhor Presidente encerrou a sessão às ___h___min, do que para constar, eu, [Nome do Secretário], lavrei a presente ata que vai assinada por mim e pelo Senhor Presidente.</p>
    
    <div style="display: flex; justify-content: space-between; margin-top: 4rem;">
      <div style="text-align: center;">
        <p>_________________________________</p>
        <p><strong>[Nome do Presidente]</strong></p>
        <p>Presidente</p>
      </div>
      <div style="text-align: center;">
        <p>_________________________________</p>
        <p><strong>[Nome do Secretário]</strong></p>
        <p>Secretário</p>
      </div>
    </div>
  `,
  'indicacao': `
    <h1 style="text-align: center;">INDICAÇÃO Nº ___/2025</h1>
    
    <p><strong>Senhor Presidente,</strong></p>
    
    <p style="text-align: justify;">Nos termos do Regimento Interno desta Casa Legislativa, venho respeitosamente indicar ao Poder Executivo Municipal:</p>
    
    <p style="text-align: justify;">[Texto da indicação]</p>
    
    <p><strong>Justificativa:</strong></p>
    
    <p style="text-align: justify;">[Justificativa da indicação]</p>
    
    <p>É o que tenho a indicar.</p>
    
    <p style="margin-top: 3rem;">
      <strong>Município, ___ de _______ de 2025.</strong>
    </p>
    
    <div style="text-align: center; margin-top: 3rem;">
      <p>_________________________________</p>
      <p><strong>[Nome do Vereador]</strong></p>
      <p>Vereador</p>
    </div>
  `
}

const EditorPage: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [content, setContent] = useState('')
  const [, setTitle] = useState('')
  const [saving, setSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [documentTitle, setDocumentTitle] = useState('Novo Documento')

  // Obter parâmetros da URL
  const searchParams = new URLSearchParams(location.search)
  const templateId = searchParams.get('template') || 'blank'
  const documentId = searchParams.get('id')
  const isNew = searchParams.get('novo') === 'true'
  const initialContent = searchParams.get('content')

  // Inicializar conteúdo
  useEffect(() => {
    if (initialContent) {
      setContent(decodeURIComponent(initialContent))
    } else if (templateId && templates[templateId as keyof typeof templates]) {
      setContent(templates[templateId as keyof typeof templates])
    }
    
    // Definir título baseado no template
    const templateNames = {
      'blank': 'Documento em Branco',
      'requerimento': 'Requerimento',
      'projeto-lei': 'Projeto de Lei',
      'decreto': 'Decreto',
      'oficio': 'Ofício',
      'relatorio': 'Relatório',
      'ata-sessao': 'Ata de Sessão',
      'indicacao': 'Indicação'
    }
    setTitle(templateNames[templateId as keyof typeof templateNames] || 'Documento')
  }, [templateId, initialContent])

  // Função para salvar documento
  const handleSave = useCallback(async (content: string, html: string) => {
    setSaving(true)
    try {
      console.log('Salvando documento...', { content, html })
      
      // Aqui você pode implementar a lógica de salvamento
      // Por exemplo, enviar para uma API
      const response = await fetch('/api/admin/documentos-templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: documentTitle,
          content,
          html,
          updatedAt: new Date().toISOString(),
        }),
      })

      if (response.ok) {
        setLastSaved(new Date())
        console.log('Documento salvo com sucesso!')
      } else {
        throw new Error('Erro ao salvar documento')
      }
    } catch (error) {
      console.error('Erro ao salvar:', error)
      alert('Erro ao salvar o documento. Tente novamente.')
    } finally {
      setSaving(false)
    }
  }, [documentTitle])

  // Função para atualizar conteúdo em tempo real
  const handleUpdate = useCallback((content: string, html: string) => {
    // Callback para atualizações em tempo real (opcional)
    // console.log('Documento atualizado:', { content, html })
  }, [])

  // Função para voltar
  const handleBack = useCallback(() => {
    if (content.trim() && !lastSaved) {
      if (confirm('Você tem alterações não salvas. Deseja realmente sair?')) {
        navigate(-1)
      }
    } else {
      navigate(-1)
    }
  }, [content, lastSaved, navigate])

  // Função para toggle fullscreen
  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(!isFullscreen)
  }, [isFullscreen])

  // Função para imprimir
  const handlePrint = useCallback(() => {
    window.print()
  }, [])

  // Função para exportar PDF (placeholder)
  const handleExportPDF = useCallback(() => {
    alert('Função de export PDF será implementada em breve!')
  }, [])

  // Auto-save a cada 30 segundos
  useEffect(() => {
    if (!content.trim()) return

    const interval = setInterval(() => {
      // Auto-save será implementado dentro do LexicalEditor
      handleSave(content, content)
    }, 30000) // 30 segundos

    return () => clearInterval(interval)
  }, [content, handleSave])

  return (
    <div className="editor-page">
      <TiptapEditor
        initialContent="<h1>Bem-vindo ao Editor de Documentos Legislativos</h1><p>Comece a escrever seu documento aqui. Use a barra de ferramentas acima e os elementos legislativos na lateral direita para criar documentos profissionais.</p><p><strong>Dicas:</strong></p><ul><li>Use <strong>Ctrl+S</strong> para salvar</li><li>Use <strong>F11</strong> para tela cheia</li><li>Use os botões de zoom para ajustar a visualização</li><li>Clique nos elementos legislativos para inserir estruturas pré-definidas</li></ul>"
        onSave={handleSave}
        onUpdate={handleUpdate}
        className="document-editor"
      />
    </div>
  )
}

export default EditorPage 