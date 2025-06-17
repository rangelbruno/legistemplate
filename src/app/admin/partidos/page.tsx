'use client'

import React, { useState, useEffect } from 'react'
import { KTIcon } from '../../../_metronic/helpers'
import AdministradorLayout from '../layout'
import { PageTitle } from '../../../_metronic/layout/core'

interface Partido {
  id: string
  sigla: string
  nome: string
  numero: number
  fundacao?: string
  presidente?: string
  website?: string
  logo?: string
  ativo: boolean
  createdAt: string
  updatedAt: string
  _count?: {
    parlamentares: number
  }
}

interface PartidoFormData {
  sigla: string
  nome: string
  numero: string
  fundacao?: string
  presidente?: string
  website?: string
  logo?: string
  ativo: boolean
}

export default function AdminPartidosPage() {
  const [partidos, setPartidos] = useState<Partido[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingPartido, setEditingPartido] = useState<Partido | null>(null)
  const [formData, setFormData] = useState<PartidoFormData>({
    sigla: '',
    nome: '',
    numero: '',
    fundacao: '',
    presidente: '',
    website: '',
    logo: '',
    ativo: true
  })

  // Filtros e busca
  const [search, setSearch] = useState('')
  const [ativo, setAtivo] = useState<string>('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const fetchPartidos = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...(search && { search }),
        ...(ativo && { ativo })
      })

      const response = await fetch(`/api/v1/admin/partidos?${params}`)
      const data = await response.json()

      if (response.ok) {
        setPartidos(data.partidos)
        setTotalPages(data.pagination.totalPages)
      } else {
        console.error('Erro ao carregar partidos:', data.error)
      }
    } catch (error) {
      console.error('Erro ao carregar partidos:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPartidos()
  }, [page, search, ativo])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = editingPartido 
        ? `/api/v1/admin/partidos/${editingPartido.id}`
        : '/api/v1/admin/partidos'
      
      const method = editingPartido ? 'PUT' : 'POST'
      
      const body = {
        ...formData,
        numero: parseInt(formData.numero),
        fundacao: formData.fundacao || null
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      })

      const data = await response.json()

      if (response.ok) {
        alert(editingPartido ? 'Partido atualizado com sucesso!' : 'Partido criado com sucesso!')
        setShowModal(false)
        setEditingPartido(null)
        resetForm()
        fetchPartidos()
      } else {
        alert(`Erro: ${data.error}`)
      }
    } catch (error) {
      console.error('Erro ao salvar partido:', error)
      alert('Erro ao salvar partido')
    }
  }

  const handleEdit = (partido: Partido) => {
    setEditingPartido(partido)
    setFormData({
      sigla: partido.sigla,
      nome: partido.nome,
      numero: partido.numero.toString(),
      fundacao: partido.fundacao ? partido.fundacao.split('T')[0] : '',
      presidente: partido.presidente || '',
      website: partido.website || '',
      logo: partido.logo || '',
      ativo: partido.ativo
    })
    setShowModal(true)
  }

  const handleDelete = async (partido: Partido) => {
    if (!confirm(`Deseja realmente excluir o partido ${partido.sigla}?`)) {
      return
    }

    try {
      const response = await fetch(`/api/v1/admin/partidos/${partido.id}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (response.ok) {
        alert('Partido excluído com sucesso!')
        fetchPartidos()
      } else {
        alert(`Erro: ${data.error}`)
      }
    } catch (error) {
      console.error('Erro ao excluir partido:', error)
      alert('Erro ao excluir partido')
    }
  }

  const resetForm = () => {
    setFormData({
      sigla: '',
      nome: '',
      numero: '',
      fundacao: '',
      presidente: '',
      website: '',
      logo: '',
      ativo: true
    })
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingPartido(null)
    resetForm()
  }

  return (
    <AdministradorLayout>
      <PageTitle breadcrumbs={[]}>Gestão de Partidos</PageTitle>
      
      <div className="card">
        <div className="card-header border-0 pt-6">
          <div className="card-title">
            <div className="d-flex align-items-center position-relative my-1">
              <KTIcon iconName="magnifier" className="fs-3 position-absolute ms-5" />
              <input
                type="text"
                className="form-control form-control-solid w-250px ps-13"
                placeholder="Buscar partidos..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="card-toolbar">
            <div className="d-flex justify-content-end" data-kt-user-table-toolbar="base">
              <div className="me-3">
                <select
                  className="form-select form-select-solid w-150px"
                  value={ativo}
                  onChange={(e) => setAtivo(e.target.value)}
                >
                  <option value="">Todos</option>
                  <option value="true">Ativos</option>
                  <option value="false">Inativos</option>
                </select>
              </div>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setShowModal(true)}
              >
                <KTIcon iconName="plus" className="fs-2" />
                Novo Partido
              </button>
            </div>
          </div>
        </div>
        <div className="card-body pt-0">
          {loading ? (
            <div className="text-center py-5">
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
                      <th>Sigla</th>
                      <th>Nome</th>
                      <th>Número</th>
                      <th>Parlamentares</th>
                      <th>Status</th>
                      <th className="text-end min-w-100px">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-600 fw-semibold">
                    {partidos.map((partido) => (
                      <tr key={partido.id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <span className="badge badge-light-primary fs-7 fw-bold">
                              {partido.sigla}
                            </span>
                          </div>
                        </td>
                        <td>{partido.nome}</td>
                        <td>
                          <span className="badge badge-light-info">
                            {partido.numero}
                          </span>
                        </td>
                        <td>
                          <span className="badge badge-light-success">
                            {partido._count?.parlamentares || 0}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${partido.ativo ? 'badge-light-success' : 'badge-light-danger'}`}>
                            {partido.ativo ? 'Ativo' : 'Inativo'}
                          </span>
                        </td>
                        <td className="text-end">
                          <button
                            type="button"
                            className="btn btn-light btn-active-light-primary btn-sm me-2"
                            onClick={() => handleEdit(partido)}
                          >
                            Editar
                          </button>
                          <button
                            type="button"
                            className="btn btn-light btn-active-light-danger btn-sm"
                            onClick={() => handleDelete(partido)}
                          >
                            Excluir
                          </button>
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

      {/* Modal para criar/editar partido */}
      {showModal && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex={-1}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h2 className="fw-bold">
                  {editingPartido ? 'Editar Partido' : 'Novo Partido'}
                </h2>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseModal}
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body py-10 px-lg-17">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="fv-row mb-7">
                        <label className="fw-semibold fs-6 mb-2">Sigla *</label>
                        <input
                          type="text"
                          className="form-control form-control-solid"
                          placeholder="Ex: PT, PSDB"
                          value={formData.sigla}
                          onChange={(e) => setFormData({...formData, sigla: e.target.value.toUpperCase()})}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="fv-row mb-7">
                        <label className="fw-semibold fs-6 mb-2">Número *</label>
                        <input
                          type="number"
                          className="form-control form-control-solid"
                          placeholder="Ex: 13"
                          value={formData.numero}
                          onChange={(e) => setFormData({...formData, numero: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="fv-row mb-7">
                    <label className="fw-semibold fs-6 mb-2">Nome do Partido *</label>
                    <input
                      type="text"
                      className="form-control form-control-solid"
                      placeholder="Ex: Partido dos Trabalhadores"
                      value={formData.nome}
                      onChange={(e) => setFormData({...formData, nome: e.target.value})}
                      required
                    />
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="fv-row mb-7">
                        <label className="fw-semibold fs-6 mb-2">Data de Fundação</label>
                        <input
                          type="date"
                          className="form-control form-control-solid"
                          value={formData.fundacao}
                          onChange={(e) => setFormData({...formData, fundacao: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="fv-row mb-7">
                        <label className="fw-semibold fs-6 mb-2">Presidente Nacional</label>
                        <input
                          type="text"
                          className="form-control form-control-solid"
                          placeholder="Nome do presidente"
                          value={formData.presidente}
                          onChange={(e) => setFormData({...formData, presidente: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="fv-row mb-7">
                    <label className="fw-semibold fs-6 mb-2">Website</label>
                    <input
                      type="url"
                      className="form-control form-control-solid"
                      placeholder="https://www.partido.com.br"
                      value={formData.website}
                      onChange={(e) => setFormData({...formData, website: e.target.value})}
                    />
                  </div>

                  <div className="fv-row mb-7">
                    <label className="fw-semibold fs-6 mb-2">Logo (URL)</label>
                    <input
                      type="url"
                      className="form-control form-control-solid"
                      placeholder="https://exemplo.com/logo.png"
                      value={formData.logo}
                      onChange={(e) => setFormData({...formData, logo: e.target.value})}
                    />
                  </div>

                  <div className="fv-row">
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={formData.ativo}
                        onChange={(e) => setFormData({...formData, ativo: e.target.checked})}
                      />
                      <label className="form-check-label fw-semibold fs-6">
                        Partido Ativo
                      </label>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-light"
                    onClick={handleCloseModal}
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingPartido ? 'Atualizar' : 'Criar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {showModal && <div className="modal-backdrop fade show"></div>}
    </AdministradorLayout>
  )
} 