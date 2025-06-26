"use client"

import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AdministradorLayout from '../../layout'
import { PageTitle } from '../../../../_metronic/layout/core'
import { DocumentUrls } from '../../../../lib/utils/url-helpers'
import WordLikeEditor from '../../../../components/editor/WordLikeEditor'
import { usePageTitle } from '../../../../hooks/usePageTitle'
// import { smartTemplates, getSmartTemplate } from '../../../../components/editor/smart-templates'
// import SmartTemplateForm from '../../../../components/editor/SmartTemplateForm'

interface Documento {
  id: string
  titulo: string
  template: string
  conteudo?: string
  criadoEm: string
  atualizadoEm: string
  status: 'rascunho' | 'finalizado' | 'publicado'
  autor: string
}

interface Template {
  id: string
  nome: string
  descricao: string
  categoria: string
  previewUrl?: string
}

// Templates simples (mantidos para compatibilidade)
const templates: Template[] = [
  {
    id: 'blank',
    nome: 'Documento em Branco',
    descricao: 'Comece do zero com um documento completamente vazio',
    categoria: 'Básico'
  },
  {
    id: 'requerimento',
    nome: 'Requerimento',
    descricao: 'Template para requerimentos diversos',
    categoria: 'Proposições'
  },
  {
    id: 'decreto',
    nome: 'Decreto',
    descricao: 'Template para decretos legislativos',
    categoria: 'Normas'
  },
  {
    id: 'oficio',
    nome: 'Ofício',
    descricao: 'Template para ofícios e comunicações oficiais',
    categoria: 'Comunicações'
  },
  {
    id: 'relatorio',
    nome: 'Relatório',
    descricao: 'Template para relatórios de comissão',
    categoria: 'Relatórios'
  },
  {
    id: 'projeto-lei',
    nome: 'Projeto de Lei',
    descricao: 'Template para projetos de lei municipal',
    categoria: 'Proposições'
  },
  {
    id: 'ata-sessao',
    nome: 'Ata de Sessão',
    descricao: 'Template para atas de sessões ordinárias',
    categoria: 'Administrativo'
  },
  {
    id: 'indicacao',
    nome: 'Indicação',
    descricao: 'Template para indicações ao Executivo',
    categoria: 'Proposições'
  }
]

// Função para obter ícone por categoria
const getCategoryIcon = (categoria: string) => {
  switch (categoria) {
    case 'Básico':
      return 'ki-document'
    case 'Proposições':
      return 'ki-bill'
    case 'Normas':
      return 'ki-law'
    case 'Comunicações':
      return 'ki-message-text-2'
    case 'Relatórios':
      return 'ki-chart-simple'
    case 'Administrativo':
      return 'ki-folder'
    default:
      return 'ki-document'
  }
}

// Função para obter cor por categoria
const getCategoryColor = (categoria: string) => {
  switch (categoria) {
    case 'Básico':
      return 'primary'
    case 'Proposições':
      return 'success'
    case 'Normas':
      return 'warning'
    case 'Comunicações':
      return 'info'
    case 'Relatórios':
      return 'danger'
    case 'Administrativo':
      return 'secondary'
    default:
      return 'primary'
  }
}

export default function DocumentosTemplatesPage() {
  const [documentos, setDocumentos] = useState<Documento[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('documentos')
  const [showSmartForm, setShowSmartForm] = useState(false)
  const [selectedSmartTemplate, setSelectedSmartTemplate] = useState<any>(null)
  const navigate = useNavigate()

  // Definir título da página
  usePageTitle('Documentos e Templates')

  useEffect(() => {
    // Simular carregamento de documentos (substituir por API real)
    setTimeout(() => {
      setDocumentos([
        {
          id: '1',
          titulo: 'Ata da 15ª Sessão Ordinária',
          template: 'ata-sessao',
          criadoEm: '2025-01-15',
          atualizadoEm: '2025-01-15',
          status: 'finalizado',
          autor: 'Secretário'
        },
        {
          id: '2',
          titulo: 'Projeto de Lei nº 001/2025',
          template: 'projeto-lei',
          criadoEm: '2025-01-14',
          atualizadoEm: '2025-01-14',
          status: 'rascunho',
          autor: 'Vereador João'
        }
      ])
      setLoading(false)
    }, 1000)
  }, [])

  const handleNovoDocumento = (templateId: string) => {
    // Navegar para o editor clean com o template selecionado
    const params = new URLSearchParams()
    params.set('template', templateId)
    params.set('novo', 'true')
    
    const baseUrl = '/metronic8/react/demo3'
    const editorUrl = `${baseUrl}/admin/configuracoes/documentos-templates/editor?${params.toString()}`
    window.open(editorUrl, '_blank')
  }

  const handleSmartTemplateComplete = (html: string, values: Record<string, any>) => {
    // Criar documento com o HTML gerado e abrir em nova aba
    const params = new URLSearchParams()
    params.set('template', selectedSmartTemplate?.id || 'blank')
    params.set('novo', 'true')
    params.set('content', encodeURIComponent(html))
    
    // Construir URL completa com base URL do Vite
    const baseUrl = window.location.origin + '/metronic8/react/demo3'
    const editorUrl = `${baseUrl}/admin/configuracoes/documentos-templates/editor?${params.toString()}`
    
    window.open(editorUrl, '_blank')
    setShowSmartForm(false)
    setSelectedSmartTemplate(null)
  }

  const handleSmartTemplateCancel = () => {
    setShowSmartForm(false)
    setSelectedSmartTemplate(null)
  }

  const handleEditarDocumento = (documentoId: string) => {
    // Abrir documento existente em nova aba
    const params = new URLSearchParams()
    params.set('id', documentoId)
    
    // Construir URL completa com base URL do Vite
    const baseUrl = window.location.origin + '/metronic8/react/demo3'
    const editorUrl = `${baseUrl}/admin/configuracoes/documentos-templates/editor?${params.toString()}`
    
    window.open(editorUrl, '_blank')
  }

  const getStatusBadge = (status: string) => {
    const badges = {
      'rascunho': 'badge-light-warning',
      'finalizado': 'badge-light-success',
      'publicado': 'badge-light-primary'
    }
    return badges[status as keyof typeof badges] || 'badge-light-secondary'
  }

  const getStatusText = (status: string) => {
    const texts = {
      'rascunho': 'Rascunho',
      'finalizado': 'Finalizado',
      'publicado': 'Publicado'
    }
    return texts[status as keyof typeof texts] || status
  }

  return (
    <AdministradorLayout>
      <PageTitle 
        breadcrumbs={[
          { title: 'Administração', path: '/admin', isSeparator: false, isActive: false },
          { title: 'Configurações', path: '/admin/configuracoes', isSeparator: false, isActive: false },
          { title: 'Documentos e Templates', path: '/admin/configuracoes/documentos-templates', isSeparator: false, isActive: true }
        ]}
      >
        Documentos e Templates
      </PageTitle>
      
      <div className="container-xxl px-4 px-md-6 px-lg-8">


        {/* Navigation Tabs */}
        <div className="row g-4 g-md-6 g-xl-9 mb-5">
          <div className="col-12">
            <ul className="nav nav-stretch nav-line-tabs nav-line-tabs-2x border-transparent fs-6 fs-md-5 fw-bold flex-nowrap overflow-auto">
              <li className="nav-item flex-shrink-0">
                <a
                  className={`nav-link text-active-primary cursor-pointer d-flex align-items-center ${activeTab === 'documentos' ? 'active' : ''}`}
                  onClick={() => setActiveTab('documentos')}
                >
                  <i className="ki-duotone ki-document fs-3 fs-md-2 me-2">
                    <span className="path1"></span>
                    <span className="path2"></span>
                  </i>
                  <span className="d-none d-sm-inline">Meus Documentos</span>
                  <span className="d-inline d-sm-none">Documentos</span>
                </a>
              </li>
              <li className="nav-item flex-shrink-0">
                <a
                  className={`nav-link text-active-primary cursor-pointer d-flex align-items-center ${activeTab === 'templates' ? 'active' : ''}`}
                  onClick={() => setActiveTab('templates')}
                >
                  <i className="ki-duotone ki-setting-2 fs-3 fs-md-2 me-2">
                    <span className="path1"></span>
                    <span className="path2"></span>
                  </i>
                  <span className="d-none d-sm-inline">Templates Disponíveis</span>
                  <span className="d-inline d-sm-none">Templates</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Content */}
        <div className="tab-content">
          {/* Tab Documentos */}
          {activeTab === 'documentos' && (
            <div className="tab-pane fade show active">
              <div className="card">
                <div className="card-header border-0 pt-6">
                  <div className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center justify-content-between w-100 gap-3">
                    <div className="card-title mb-0">
                      <div className="d-flex align-items-center position-relative">
                        <i className="ki-duotone ki-magnifier fs-3 position-absolute ms-5">
                          <span className="path1"></span>
                          <span className="path2"></span>
                        </i>
                        <input
                          type="text"
                          className="form-control form-control-solid w-100 w-sm-250px ps-13"
                          placeholder="Buscar documentos..."
                        />
                      </div>
                    </div>
                    <div className="card-toolbar">
                      <button
                        className="btn btn-light-primary btn-sm d-flex align-items-center"
                        onClick={() => setActiveTab('templates')}
                      >
                        <i className="ki-duotone ki-plus fs-3 me-2">
                          <span className="path1"></span>
                          <span className="path2"></span>
                          <span className="path3"></span>
                        </i>
                        <span className="d-none d-sm-inline">Novo Documento</span>
                        <span className="d-inline d-sm-none">Novo</span>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="card-body py-4">
                  {loading ? (
                    <div className="d-flex justify-content-center">
                      <div className="spinner-border" role="status">
                        <span className="visually-hidden">Carregando...</span>
                      </div>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table align-middle table-row-dashed fs-6 gy-5">
                        <thead>
                          <tr className="text-start text-muted fw-bold fs-7 text-uppercase gs-0">
                            <th className="min-w-125px">Título</th>
                            <th className="min-w-100px d-none d-md-table-cell">Template</th>
                            <th className="min-w-100px">Status</th>
                            <th className="min-w-100px d-none d-lg-table-cell">Autor</th>
                            <th className="min-w-100px d-none d-xl-table-cell">Atualizado</th>
                            <th className="text-end min-w-100px">Ações</th>
                          </tr>
                        </thead>
                        <tbody className="text-gray-600 fw-semibold">
                          {documentos.map((documento) => (
                            <tr key={documento.id}>
                              <td>
                                <div className="d-flex flex-column">
                                  <a 
                                    href="#" 
                                    className="text-gray-800 text-hover-primary mb-1 fw-bold"
                                    onClick={(e) => {
                                      e.preventDefault()
                                      handleEditarDocumento(documento.id)
                                    }}
                                  >
                                    {documento.titulo}
                                  </a>
                                  <div className="d-flex d-md-none gap-2 mt-1">
                                    <span className="badge badge-light-info fs-8">
                                      {templates.find(t => t.id === documento.template)?.nome || documento.template}
                                    </span>
                                    <span className="d-lg-none badge badge-light fs-8">
                                      {documento.autor}
                                    </span>
                                  </div>
                                  <small className="text-muted d-xl-none">
                                    {new Date(documento.atualizadoEm).toLocaleDateString('pt-BR')}
                                  </small>
                                </div>
                              </td>
                              <td className="d-none d-md-table-cell">
                                <span className="badge badge-light-info">
                                  {templates.find(t => t.id === documento.template)?.nome || documento.template}
                                </span>
                              </td>
                              <td>
                                <span className={`badge ${getStatusBadge(documento.status)}`}>
                                  {getStatusText(documento.status)}
                                </span>
                              </td>
                              <td className="d-none d-lg-table-cell">{documento.autor}</td>
                              <td className="d-none d-xl-table-cell">{new Date(documento.atualizadoEm).toLocaleDateString('pt-BR')}</td>
                              <td className="text-end">
                                <a
                                  href="#"
                                  className="btn btn-light btn-active-light-primary btn-sm"
                                  onClick={(e) => {
                                    e.preventDefault()
                                    handleEditarDocumento(documento.id)
                                  }}
                                >
                                  <span className="d-none d-sm-inline">Editar</span>
                                  <i className="ki-duotone ki-pencil d-inline d-sm-none fs-4">
                                    <span className="path1"></span>
                                    <span className="path2"></span>
                                  </i>
                                </a>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Tab Templates */}
          {activeTab === 'templates' && (
            <div className="tab-pane fade show active">
              {/* Templates Inteligentes - Temporariamente desabilitado */}
              {/*
              <div className="mb-10">
                <h3 className="fw-bold mb-5">
                  <i className="ki-duotone ki-setting-3 fs-2 me-2">
                    <span className="path1"></span>
                    <span className="path2"></span>
                    <span className="path3"></span>
                    <span className="path4"></span>
                    <span className="path5"></span>
                  </i>
                  Templates Inteligentes
                </h3>
                <p className="text-muted mb-5">
                  Templates com formulários pré-configurados. Preencha apenas os campos necessários e o documento será gerado automaticamente.
                </p>
                
                <div className="row g-6 g-xl-9">
                  {smartTemplates.map((template) => (
                    <div key={template.id} className="col-md-6 col-lg-4 col-xl-3">
                      <div className="card h-100 border-2 border-primary">
                        <div className="card-body d-flex flex-column">
                          <div className="flex-grow-1">
                            <div className="d-flex align-items-center mb-5">
                              <div className="symbol symbol-40px me-4">
                                <div className="symbol-label bg-primary">
                                  <i className="ki-duotone ki-setting-3 fs-2 text-white">
                                    <span className="path1"></span>
                                    <span className="path2"></span>
                                    <span className="path3"></span>
                                    <span className="path4"></span>
                                    <span className="path5"></span>
                                  </i>
                                </div>
                              </div>
                              <div className="flex-grow-1">
                                <h5 className="fw-bold text-gray-900 mb-1">{template.nome}</h5>
                                <div className="d-flex align-items-center gap-2">
                                  <span className="badge badge-primary fs-8">{template.categoria}</span>
                                  <span className="badge badge-light-success fs-8">
                                    <i className="ki-duotone ki-check fs-4 me-1">
                                      <span className="path1"></span>
                                      <span className="path2"></span>
                                    </i>
                                    Inteligente
                                  </span>
                                </div>
                              </div>
                            </div>
                            <p className="text-gray-600 fs-6 mb-4">
                              {template.descricao}
                            </p>
                            <div className="text-muted fs-7">
                              <i className="ki-duotone ki-information-4 fs-6 me-1">
                                <span className="path1"></span>
                                <span className="path2"></span>
                                <span className="path3"></span>
                              </i>
                              {template.fields.length} campos editáveis
                            </div>
                          </div>
                          <div className="mt-auto">
                            <button
                              className="btn btn-primary w-100"
                              onClick={() => handleNovoDocumento(template.id)}
                            >
                              <i className="ki-duotone ki-setting-3 fs-2 me-2">
                                <span className="path1"></span>
                                <span className="path2"></span>
                                <span className="path3"></span>
                                <span className="path4"></span>
                                <span className="path5"></span>
                              </i>
                              Configurar e Criar
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Separador */}
              {/* <div className="separator border-2 my-10"></div> */}

              {/* Templates Simples */}
              <div className="mb-10">
                <h3 className="fw-bold mb-5">
                  <i className="ki-duotone ki-document fs-2 me-2">
                    <span className="path1"></span>
                    <span className="path2"></span>
                  </i>
                  Templates Simples
                </h3>
                <p className="text-muted mb-5">
                  Templates básicos que abrem diretamente no editor para edição livre.
                </p>
                
                <div className="row g-4 g-md-6 g-xl-9">
                  {templates.map((template) => {
                    const categoryColor = getCategoryColor(template.categoria)
                    const categoryIcon = getCategoryIcon(template.categoria)
                    const isBlank = template.id === 'blank'
                    
                    return (
                      <div key={template.id} className="col-12 col-sm-6 col-lg-4 col-xl-3">
                        <div className={`card h-100 ${isBlank ? 'border-2 border-primary bg-light-primary' : 'card-hover'}`}>
                          <div className="card-body d-flex flex-column text-center">
                            <div className="flex-grow-1">
                              <div className="mb-5">
                                <div className={`symbol symbol-60px mx-auto mb-4 ${isBlank ? 'symbol-circle' : ''}`}>
                                  <div className={`symbol-label bg-${isBlank ? 'primary' : `light-${categoryColor}`}`}>
                                    <i className={`ki-duotone ${categoryIcon} fs-1 ${isBlank ? 'text-white' : `text-${categoryColor}`}`}>
                                      <span className="path1"></span>
                                      <span className="path2"></span>
                                      {categoryIcon === 'ki-bill' && <span className="path3"></span>}
                                    </i>
                                  </div>
                                </div>
                                <h4 className={`fw-bold mb-2 ${isBlank ? 'text-primary' : 'text-gray-900'}`}>
                                  {template.nome}
                                </h4>
                                <span className={`badge badge-${isBlank ? 'primary' : `light-${categoryColor}`} fs-7 mb-3`}>
                                  {template.categoria}
                                </span>
                              </div>
                              <p className="text-gray-600 fs-6 mb-4">
                                {template.descricao}
                              </p>
                            </div>
                            <div className="mt-auto">
                              <button
                                className={`btn btn-${isBlank ? 'primary' : 'light-primary'} w-100 btn-sm`}
                                onClick={() => handleNovoDocumento(template.id)}
                              >
                                <i className={`ki-duotone ${isBlank ? 'ki-plus' : 'ki-copy'} fs-4 me-2`}>
                                  <span className="path1"></span>
                                  <span className="path2"></span>
                                  {!isBlank && <span className="path3"></span>}
                                </i>
                                {isBlank ? 'Criar Documento' : 'Usar Template'}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Seção de Configuração de Templates */}
              <div className="card mt-6 mt-md-10">
                <div className="card-header">
                  <div className="card-title">
                    <h3 className="fw-bold fs-4 fs-md-3">Configuração de Templates</h3>
                  </div>
                </div>
                <div className="card-body">
                  <div className="row g-4 g-md-6 g-lg-10">
                    <div className="col-12 col-lg-6">
                      <div className="mb-6 mb-lg-10">
                        <label className="form-label fw-semibold fs-6">Informações da Câmara</label>
                        <div className="form-text mb-5">Configure as informações que aparecerão no header e footer dos documentos</div>
                        
                        <div className="mb-4 mb-md-5">
                          <label className="form-label">Nome da Câmara</label>
                          <input type="text" className="form-control" placeholder="CÂMARA MUNICIPAL DE [MUNICÍPIO]" />
                        </div>
                        
                        <div className="mb-4 mb-md-5">
                          <label className="form-label">Endereço</label>
                          <input type="text" className="form-control" placeholder="Rua [Nome da Rua], nº [Número] - Centro" />
                        </div>
                        
                        <div className="row g-3 g-md-4">
                          <div className="col-12 col-sm-6">
                            <div className="mb-4 mb-md-5">
                              <label className="form-label">Telefone</label>
                              <input type="text" className="form-control" placeholder="(xx) xxxx-xxxx" />
                            </div>
                          </div>
                          <div className="col-12 col-sm-6">
                            <div className="mb-4 mb-md-5">
                              <label className="form-label">Email</label>
                              <input type="email" className="form-control" placeholder="contato@camaramunicipal.gov.br" />
                            </div>
                          </div>
                        </div>
                        
                        <div className="mb-4 mb-md-5">
                          <label className="form-label">Site</label>
                          <input type="text" className="form-control" placeholder="www.camaramunicipal.gov.br" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="col-12 col-lg-6">
                      <div className="mb-6 mb-lg-10">
                        <label className="form-label fw-semibold fs-6">Logo da Câmara</label>
                        <div className="form-text mb-5">Faça upload do logo que aparecerá nos documentos</div>
                        
                        <div className="d-flex flex-column align-items-center">
                          <div className="image-input image-input-outline mb-5" data-kt-image-input="true">
                            <div className="image-input-wrapper w-100px w-sm-125px h-100px h-sm-125px" style={{ backgroundImage: "url('/media/logos/custom-1.png')" }}></div>
                            <label className="btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow" data-kt-image-input-action="change" data-bs-toggle="tooltip" title="Alterar logo">
                              <i className="ki-duotone ki-pencil fs-7">
                                <span className="path1"></span>
                                <span className="path2"></span>
                              </i>
                              <input type="file" name="logo" accept=".png, .jpg, .jpeg" />
                              <input type="hidden" name="logo_remove" />
                            </label>
                            <span className="btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow" data-kt-image-input-action="cancel" data-bs-toggle="tooltip" title="Cancelar logo">
                              <i className="ki-duotone ki-cross fs-2">
                                <span className="path1"></span>
                                <span className="path2"></span>
                              </i>
                            </span>
                            <span className="btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow" data-kt-image-input-action="remove" data-bs-toggle="tooltip" title="Remover logo">
                              <i className="ki-duotone ki-cross fs-2">
                                <span className="path1"></span>
                                <span className="path2"></span>
                              </i>
                            </span>
                          </div>
                          <div className="form-text text-center">Tipos permitidos: png, jpg, jpeg. Tamanho máximo: 2MB</div>
                        </div>
                      </div>
                      
                      <div className="d-flex justify-content-center justify-content-lg-end">
                        <button className="btn btn-primary btn-sm btn-md-primary d-flex align-items-center">
                          <i className="ki-duotone ki-check fs-3 fs-md-2 me-2">
                            <span className="path1"></span>
                            <span className="path2"></span>
                          </i>
                          <span className="d-none d-sm-inline">Salvar Configurações</span>
                          <span className="d-inline d-sm-none">Salvar</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal do Formulário Inteligente - Temporariamente desabilitado */}
      {/*
      {showSmartForm && selectedSmartTemplate && (
        <SmartTemplateForm
          template={selectedSmartTemplate}
          onComplete={handleSmartTemplateComplete}
          onCancel={handleSmartTemplateCancel}
        />
      )}
      */}
    </AdministradorLayout>
  )
} 