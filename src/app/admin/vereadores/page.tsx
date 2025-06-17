'use client'

import React, { useState, useEffect, useRef } from 'react'
import AdministradorLayout from '../layout'
import { PageTitle } from '../../../_metronic/layout/core'

interface Partido {
  id: string
  sigla: string
  nome: string
  numero: number
}

interface Vereador {
  id: string
  nome: string
  partidoId: string
  partido: Partido
  uf: string
  matricula: string
  mandatoInicio: string
  mandatoFim?: string
  ativo: boolean
  presidenteCamara: boolean
  dataEleiçaoPresidencia?: string
  mandatoPresidenciaFim?: string
  telefone?: string
  endereco?: string
  profissao?: string
  biografia?: string
  foto?: string
  user: {
    id: string
    email: string
    name: string
    ativo: boolean
  }
}

interface NovoVereador {
  nome: string
  email: string
  partidoId: string
  uf: string
  mandatoInicio: string
  mandatoFim?: string
  telefone?: string
  endereco?: string
  profissao?: string
  biografia?: string
  foto?: string
  presidenteCamara: boolean
  dataEleiçaoPresidencia?: string
  mandatoPresidenciaFim?: string
}

/**
 * Página de Gerenciamento de Vereadores
 */
export default function AdminVereadoresPage() {
  const [vereadores, setVereadores] = useState<Vereador[]>([])
  const [partidos, setPartidos] = useState<Partido[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingVereador, setEditingVereador] = useState<Vereador | null>(null)
  const [presidente, setPresidente] = useState<Vereador | null>(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [filters, setFilters] = useState({
    search: '',
    partido: '',
    ativo: '',
    presidenteCamara: ''
  })

  const [novoVereador, setNovoVereador] = useState<NovoVereador>({
    nome: '',
    email: '',
    partidoId: '',
    uf: '',
    mandatoInicio: '',
    mandatoFim: '',
    telefone: '',
    endereco: '',
    profissao: '',
    biografia: '',
    foto: '',
    presidenteCamara: false,
    dataEleiçaoPresidencia: '',
    mandatoPresidenciaFim: ''
  })

  const ufs = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
    'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
    'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ]

  // Carregar partidos
  const carregarPartidos = async () => {
    try {
      const response = await fetch('/api/v1/admin/partidos?limit=50&ativo=true')
      const data = await response.json()
      if (data.partidos) {
        setPartidos(data.partidos)
      }
    } catch (error) {
      console.error('Erro ao carregar partidos:', error)
    }
  }

  // Carregar vereadores
  const carregarVereadores = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...filters
      })

      const response = await fetch(`/api/v1/admin/vereadores?${params}`)
      const data = await response.json()

      if (data.success) {
        setVereadores(data.data)
        setTotalPages(data.pagination.pages)
      }
    } catch (error) {
      console.error('Erro ao carregar vereadores:', error)
    } finally {
      setLoading(false)
    }
  }

  // Carregar presidente atual
  const carregarPresidente = async () => {
    try {
      const response = await fetch('/api/v1/admin/vereadores/presidente')
      const data = await response.json()
      if (data.success && data.data) {
        setPresidente(data.data)
      }
    } catch (error) {
      console.error('Erro ao carregar presidente:', error)
    }
  }

  // Upload de foto
  const handlePhotoUpload = async (file: File) => {
    try {
      setUploadingPhoto(true)
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', 'vereadores')

      const response = await fetch('/api/v1/upload', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (data.success) {
        setNovoVereador(prev => ({ ...prev, foto: data.url }))
        alert('Foto enviada com sucesso!')
      } else {
        alert('Erro ao enviar foto: ' + data.error)
      }
    } catch (error) {
      console.error('Erro no upload:', error)
      alert('Erro ao enviar foto')
    } finally {
      setUploadingPhoto(false)
    }
  }

  useEffect(() => {
    carregarVereadores()
    carregarPresidente()
    carregarPartidos()
  }, [page, filters])

  // Criar/editar vereador
  const salvarVereador = async () => {
    try {
      const url = editingVereador 
        ? `/api/v1/admin/vereadores/${editingVereador.id}`
        : '/api/v1/admin/vereadores'
      
      const method = editingVereador ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novoVereador)
      })

      const data = await response.json()

      if (data.success) {
        setShowModal(false)
        setEditingVereador(null)
        resetForm()
        carregarVereadores()
        carregarPresidente()
        alert(data.message)
      } else {
        alert('Erro: ' + data.message)
      }
    } catch (error) {
      console.error('Erro ao salvar vereador:', error)
      alert('Erro interno')
    }
  }

  // Definir presidente
  const definirPresidente = async (vereadorId: string) => {
    try {
      const dataEleicao = prompt('Data da eleição (YYYY-MM-DD):', new Date().toISOString().split('T')[0])
      const mandatoFim = prompt('Fim do mandato presidencial (YYYY-MM-DD) - opcional:')

      const response = await fetch('/api/v1/admin/vereadores/presidente', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vereadorId,
          dataEleicao,
          mandatoFim
        })
      })

      const data = await response.json()

      if (data.success) {
        carregarVereadores()
        carregarPresidente()
        alert(data.message)
      } else {
        alert('Erro: ' + data.message)
      }
    } catch (error) {
      console.error('Erro ao definir presidente:', error)
    }
  }

  // Remover presidente
  const removerPresidente = async () => {
    if (!confirm('Deseja remover a presidência atual?')) return

    try {
      const response = await fetch('/api/v1/admin/vereadores/presidente', {
        method: 'DELETE'
      })

      const data = await response.json()

      if (data.success) {
        carregarVereadores()
        carregarPresidente()
        alert(data.message)
      } else {
        alert('Erro: ' + data.message)
      }
    } catch (error) {
      console.error('Erro ao remover presidente:', error)
    }
  }

  const resetForm = () => {
    setNovoVereador({
      nome: '',
      email: '',
      partidoId: '',
      uf: '',
      mandatoInicio: '',
      mandatoFim: '',
      telefone: '',
      endereco: '',
      profissao: '',
      biografia: '',
      foto: '',
      presidenteCamara: false,
      dataEleiçaoPresidencia: '',
      mandatoPresidenciaFim: ''
    })
  }

  const editarVereador = (vereador: Vereador) => {
    setEditingVereador(vereador)
    setNovoVereador({
      nome: vereador.nome,
      email: vereador.user.email,
      partidoId: vereador.partidoId,
      uf: vereador.uf,
      mandatoInicio: vereador.mandatoInicio.split('T')[0],
      mandatoFim: vereador.mandatoFim ? vereador.mandatoFim.split('T')[0] : '',
      telefone: vereador.telefone || '',
      endereco: vereador.endereco || '',
      profissao: vereador.profissao || '',
      biografia: vereador.biografia || '',
      foto: vereador.foto || '',
      presidenteCamara: vereador.presidenteCamara,
      dataEleiçaoPresidencia: vereador.dataEleiçaoPresidencia ? vereador.dataEleiçaoPresidencia.split('T')[0] : '',
      mandatoPresidenciaFim: vereador.mandatoPresidenciaFim ? vereador.mandatoPresidenciaFim.split('T')[0] : ''
    })
    setShowModal(true)
  }

  return (
    <AdministradorLayout>
      <PageTitle breadcrumbs={[]}>Gerenciamento de Vereadores</PageTitle>
      
      <div className="row g-5 g-xl-8">
        {/* Card do Presidente */}
        {presidente && (
          <div className="col-xl-3">
            <div className="card card-xl-stretch mb-xl-8">
              <div className="card-body d-flex flex-column">
                <div className="d-flex align-items-center">
                  <div className="symbol symbol-50px me-5">
                    <div className="symbol-label fs-1 fw-bold bg-light-primary text-primary">
                      👑
                    </div>
                  </div>
                  <div className="flex-grow-1">
                    <div className="text-gray-900 fw-bold fs-4">Presidente da Câmara</div>
                    <div className="text-muted fw-semibold fs-6">{presidente.nome}</div>
                    <div className="text-muted fs-7">{presidente.partido.sigla}</div>
                  </div>
                </div>
                <div className="d-flex justify-content-between mt-4">
                  <button 
                    className="btn btn-sm btn-light-danger"
                    onClick={removerPresidente}
                  >
                    Remover
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Lista de Vereadores */}
        <div className={presidente ? "col-xl-9" : "col-12"}>
          <div className="card">
            <div className="card-header border-0 pt-6">
              <div className="card-title">
                <div className="d-flex align-items-center position-relative my-1">
                  <span className="svg-icon svg-icon-1 position-absolute ms-6">🔍</span>
                  <input
                    type="text"
                    className="form-control form-control-solid w-250px ps-15"
                    placeholder="Buscar vereadores..."
                    value={filters.search}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  />
                </div>
              </div>
              <div className="card-toolbar">
                <div className="d-flex justify-content-end">
                  <select
                    className="form-select form-select-solid w-150px me-3"
                    value={filters.partido}
                    onChange={(e) => setFilters(prev => ({ ...prev, partido: e.target.value }))}
                  >
                    <option value="">Todos os partidos</option>
                    {partidos.map(partido => (
                      <option key={partido.id} value={partido.sigla}>{partido.sigla}</option>
                    ))}
                  </select>
                  <button
                    className="btn btn-primary"
                    onClick={() => setShowModal(true)}
                  >
                    + Novo Vereador
                  </button>
                </div>
              </div>
            </div>

            <div className="card-body pt-0">
              {loading ? (
                <div className="text-center py-10">
                  <div className="spinner-border" role="status">
                    <span className="visually-hidden">Carregando...</span>
                  </div>
                </div>
              ) : (
                <>
                  <div className="table-responsive">
                    <table className="table align-middle table-row-dashed fs-6 gy-5">
                      <thead>
                        <tr className="text-start text-muted fw-bold fs-7 text-uppercase gs-0">
                          <th>Foto</th>
                          <th>Vereador</th>
                          <th>Partido</th>
                          <th>UF</th>
                          <th>Status</th>
                          <th>Ações</th>
                        </tr>
                      </thead>
                      <tbody className="text-gray-600 fw-semibold">
                        {vereadores.map((vereador) => (
                          <tr key={vereador.id}>
                            <td>
                              <div className="symbol symbol-circle symbol-50px overflow-hidden me-3">
                                {vereador.foto ? (
                                  <div className="symbol-label">
                                    <img src={vereador.foto} alt={vereador.nome} className="w-100" />
                                  </div>
                                ) : (
                                  <div className="symbol-label fs-3 bg-light-primary text-primary">
                                    {vereador.nome.charAt(0)}
                                  </div>
                                )}
                              </div>
                            </td>
                            <td>
                              <div className="d-flex flex-column">
                                <span className="text-gray-900 fw-bold text-hover-primary fs-6">
                                  {vereador.nome}
                                  {vereador.presidenteCamara && (
                                    <span className="badge badge-light-warning ms-2">
                                      Presidente
                                    </span>
                                  )}
                                </span>
                                <span className="text-muted fw-semibold text-muted d-block fs-7">
                                  {vereador.matricula}
                                </span>
                              </div>
                            </td>
                            <td>
                              <span className="badge badge-light-info">
                                {vereador.partido.sigla}
                              </span>
                            </td>
                            <td>{vereador.uf}</td>
                            <td>
                              <span className={`badge ${vereador.ativo ? 'badge-light-success' : 'badge-light-danger'}`}>
                                {vereador.ativo ? 'Ativo' : 'Inativo'}
                              </span>
                            </td>
                            <td>
                              <div className="d-flex">
                                <button
                                  className="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1"
                                  onClick={() => editarVereador(vereador)}
                                >
                                  ✏️
                                </button>
                                {!vereador.presidenteCamara && (
                                  <button
                                    className="btn btn-icon btn-bg-light btn-active-color-warning btn-sm"
                                    onClick={() => definirPresidente(vereador.id)}
                                    title="Definir como Presidente"
                                  >
                                    👑
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Paginação */}
                  <div className="d-flex flex-stack flex-wrap pt-10">
                    <div className="fs-6 fw-semibold text-gray-700">
                      Página {page} de {totalPages}
                    </div>
                    <ul className="pagination">
                      <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                        <button
                          className="page-link"
                          onClick={() => setPage(page - 1)}
                          disabled={page === 1}
                        >
                          Anterior
                        </button>
                      </li>
                      <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
                        <button
                          className="page-link"
                          onClick={() => setPage(page + 1)}
                          disabled={page === totalPages}
                        >
                          Próxima
                        </button>
                      </li>
                    </ul>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal para criar/editar vereador */}
      {showModal && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex={-1}>
          <div className="modal-dialog modal-dialog-centered modal-xl">
            <div className="modal-content">
              <div className="modal-header">
                <h2 className="fw-bold">
                  {editingVereador ? 'Editar Vereador' : 'Novo Vereador'}
                </h2>
                <div
                  className="btn btn-icon btn-sm btn-active-icon-primary"
                  onClick={() => {
                    setShowModal(false)
                    setEditingVereador(null)
                    resetForm()
                  }}
                >
                  ❌
                </div>
              </div>
              <div className="modal-body py-10 px-lg-17">
                <div className="row">
                  {/* Foto */}
                  <div className="col-md-12 mb-7">
                    <label className="fw-semibold fs-6 mb-2">Foto do Vereador</label>
                    <div className="d-flex align-items-center">
                      <div className="symbol symbol-circle symbol-100px overflow-hidden me-5">
                        {novoVereador.foto ? (
                          <div className="symbol-label">
                            <img src={novoVereador.foto} alt="Foto" className="w-100" />
                          </div>
                        ) : (
                          <div className="symbol-label fs-1 bg-light-primary text-primary">
                            📷
                          </div>
                        )}
                      </div>
                      <div>
                        <input
                          type="file"
                          ref={fileInputRef}
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                              handlePhotoUpload(file)
                            }
                          }}
                          style={{ display: 'none' }}
                        />
                        <button
                          type="button"
                          className="btn btn-light-primary btn-sm me-2"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={uploadingPhoto}
                        >
                          {uploadingPhoto ? 'Enviando...' : 'Escolher Foto'}
                        </button>
                        {novoVereador.foto && (
                          <button
                            type="button"
                            className="btn btn-light-danger btn-sm"
                            onClick={() => setNovoVereador(prev => ({ ...prev, foto: '' }))}
                          >
                            Remover
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Dados básicos */}
                  <div className="col-md-6">
                    <div className="fv-row mb-7">
                      <label className="fw-semibold fs-6 mb-2">Nome Completo *</label>
                      <input
                        type="text"
                        className="form-control form-control-solid"
                        placeholder="Nome do vereador"
                        value={novoVereador.nome}
                        onChange={(e) => setNovoVereador(prev => ({ ...prev, nome: e.target.value }))}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="fv-row mb-7">
                      <label className="fw-semibold fs-6 mb-2">Email *</label>
                      <input
                        type="email"
                        className="form-control form-control-solid"
                        placeholder="email@exemplo.com"
                        value={novoVereador.email}
                        onChange={(e) => setNovoVereador(prev => ({ ...prev, email: e.target.value }))}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="fv-row mb-7">
                      <label className="fw-semibold fs-6 mb-2">Partido *</label>
                      <select
                        className="form-select form-select-solid"
                        value={novoVereador.partidoId}
                        onChange={(e) => setNovoVereador(prev => ({ ...prev, partidoId: e.target.value }))}
                        required
                      >
                        <option value="">Selecione um partido</option>
                        {partidos.map(partido => (
                          <option key={partido.id} value={partido.id}>
                            {partido.sigla} - {partido.nome}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="fv-row mb-7">
                      <label className="fw-semibold fs-6 mb-2">UF *</label>
                      <select
                        className="form-select form-select-solid"
                        value={novoVereador.uf}
                        onChange={(e) => setNovoVereador(prev => ({ ...prev, uf: e.target.value }))}
                        required
                      >
                        <option value="">Selecione</option>
                        {ufs.map(uf => (
                          <option key={uf} value={uf}>{uf}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Mandato */}
                  <div className="col-md-6">
                    <div className="fv-row mb-7">
                      <label className="fw-semibold fs-6 mb-2">Início do Mandato *</label>
                      <input
                        type="date"
                        className="form-control form-control-solid"
                        value={novoVereador.mandatoInicio}
                        onChange={(e) => setNovoVereador(prev => ({ ...prev, mandatoInicio: e.target.value }))}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="fv-row mb-7">
                      <label className="fw-semibold fs-6 mb-2">Fim do Mandato</label>
                      <input
                        type="date"
                        className="form-control form-control-solid"
                        value={novoVereador.mandatoFim}
                        onChange={(e) => setNovoVereador(prev => ({ ...prev, mandatoFim: e.target.value }))}
                      />
                    </div>
                  </div>

                  {/* Dados complementares */}
                  <div className="col-md-6">
                    <div className="fv-row mb-7">
                      <label className="fw-semibold fs-6 mb-2">Telefone</label>
                      <input
                        type="tel"
                        className="form-control form-control-solid"
                        placeholder="(11) 99999-9999"
                        value={novoVereador.telefone}
                        onChange={(e) => setNovoVereador(prev => ({ ...prev, telefone: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="fv-row mb-7">
                      <label className="fw-semibold fs-6 mb-2">Profissão</label>
                      <input
                        type="text"
                        className="form-control form-control-solid"
                        placeholder="Ex: Advogado"
                        value={novoVereador.profissao}
                        onChange={(e) => setNovoVereador(prev => ({ ...prev, profissao: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="fv-row mb-7">
                      <label className="fw-semibold fs-6 mb-2">Endereço</label>
                      <input
                        type="text"
                        className="form-control form-control-solid"
                        placeholder="Endereço completo"
                        value={novoVereador.endereco}
                        onChange={(e) => setNovoVereador(prev => ({ ...prev, endereco: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="fv-row mb-7">
                      <label className="fw-semibold fs-6 mb-2">Biografia</label>
                      <textarea
                        className="form-control form-control-solid"
                        rows={3}
                        placeholder="Biografia do vereador..."
                        value={novoVereador.biografia}
                        onChange={(e) => setNovoVereador(prev => ({ ...prev, biografia: e.target.value }))}
                      />
                    </div>
                  </div>

                  {/* Presidência da Câmara */}
                  <div className="col-12">
                    <div className="separator separator-dashed my-5"></div>
                    <h4 className="text-dark fw-bold mb-3">Presidência da Câmara</h4>
                  </div>

                  <div className="col-12">
                    <div className="form-check form-switch mb-5">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={novoVereador.presidenteCamara}
                        onChange={(e) => setNovoVereador(prev => ({ ...prev, presidenteCamara: e.target.checked }))}
                      />
                      <label className="form-check-label fw-semibold fs-6">
                        É Presidente da Câmara
                      </label>
                    </div>
                  </div>

                  {novoVereador.presidenteCamara && (
                    <>
                      <div className="col-md-6">
                        <div className="fv-row mb-7">
                          <label className="fw-semibold fs-6 mb-2">Data da Eleição</label>
                          <input
                            type="date"
                            className="form-control form-control-solid"
                            value={novoVereador.dataEleiçaoPresidencia}
                            onChange={(e) => setNovoVereador(prev => ({ ...prev, dataEleiçaoPresidencia: e.target.value }))}
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="fv-row mb-7">
                          <label className="fw-semibold fs-6 mb-2">Fim do Mandato Presidencial</label>
                          <input
                            type="date"
                            className="form-control form-control-solid"
                            value={novoVereador.mandatoPresidenciaFim}
                            onChange={(e) => setNovoVereador(prev => ({ ...prev, mandatoPresidenciaFim: e.target.value }))}
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-light"
                  onClick={() => {
                    setShowModal(false)
                    setEditingVereador(null)
                    resetForm()
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={salvarVereador}
                >
                  {editingVereador ? 'Atualizar' : 'Criar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showModal && <div className="modal-backdrop fade show"></div>}
    </AdministradorLayout>
  )
} 