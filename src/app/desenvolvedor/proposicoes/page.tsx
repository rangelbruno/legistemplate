'use client'

import React, { useState, useMemo } from 'react'
import { MOCK_PROPOSICOES } from '../../../data/mock-proposicoes'
import { ESTADO_LABELS, ESTADO_CORES, workflowEngine } from '../../../lib/workflow/tramitacao-workflow'
import type { Proposicao, EstadoTramitacao, TipoProposicao } from '../../../types/tramitacao'

/**
 * Tela de Listagem de Proposições - Sistema de Tramitação Parlamentar
 * 
 * Permite visualizar, filtrar e gerenciar todas as proposições do sistema
 * Implementa visualização do workflow completo
 */
export default function ProposicoesPage() {
  const [filtroEstado, setFiltroEstado] = useState<EstadoTramitacao | 'TODOS'>('TODOS')
  const [filtroTipo, setFiltroTipo] = useState<TipoProposicao | 'TODOS'>('TODOS')
  const [filtroUrgencia, setFiltroUrgencia] = useState<'NORMAL' | 'URGENTE' | 'URGENTISSIMA' | 'TODOS'>('TODOS')
  const [termoBusca, setTermoBusca] = useState('')
  const [proposicaoSelecionada, setProposicaoSelecionada] = useState<Proposicao | null>(null)

  // Filtragem das proposições
  const proposicoesFiltradas = useMemo(() => {
    return MOCK_PROPOSICOES.filter(proposicao => {
      const matchEstado = filtroEstado === 'TODOS' || proposicao.estadoAtual === filtroEstado
      const matchTipo = filtroTipo === 'TODOS' || proposicao.tipo === filtroTipo
      const matchUrgencia = filtroUrgencia === 'TODOS' || proposicao.urgencia === filtroUrgencia
      const matchBusca = termoBusca === '' || 
        proposicao.numero.toLowerCase().includes(termoBusca.toLowerCase()) ||
        proposicao.ementa.toLowerCase().includes(termoBusca.toLowerCase()) ||
        proposicao.autor.nome.toLowerCase().includes(termoBusca.toLowerCase())
      
      return matchEstado && matchTipo && matchUrgencia && matchBusca
    })
  }, [filtroEstado, filtroTipo, filtroUrgencia, termoBusca])

  const formatarData = (data: Date) => {
    return data.toLocaleDateString('pt-BR')
  }

  const obterDiasRestantes = (proposicao: Proposicao) => {
    return workflowEngine.diasRestantesPrazo(proposicao)
  }

  const obterAcoesDisponiveis = (proposicao: Proposicao) => {
    return workflowEngine.obterAcoesDisponiveis(proposicao.estadoAtual)
  }

  return (
    <div className="proposicoes-page">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-7">
        <div>
          <h1 className="page-heading d-flex text-dark fw-bold fs-3 mb-0">
            Proposições Parlamentares
          </h1>
          <span className="text-muted fs-7">
            Gerenciamento completo do workflow de tramitação
          </span>
        </div>
        <div className="d-flex align-items-center gap-2">
          <span className="badge badge-light-primary">
            {proposicoesFiltradas.length} de {MOCK_PROPOSICOES.length} proposições
          </span>
        </div>
      </div>

      {/* Filtros */}
      <div className="card card-flush mb-6">
        <div className="card-header pt-7">
          <h3 className="card-title text-gray-800 fw-bold">
            Filtros e Busca
          </h3>
        </div>
        <div className="card-body pt-3">
          <div className="row g-4">
            {/* Busca */}
            <div className="col-md-4">
              <label className="form-label fs-6 fw-semibold">Buscar</label>
              <input
                type="text"
                className="form-control"
                placeholder="Número, ementa ou autor..."
                value={termoBusca}
                onChange={(e) => setTermoBusca(e.target.value)}
              />
            </div>

            {/* Filtro por Estado */}
            <div className="col-md-3">
              <label className="form-label fs-6 fw-semibold">Estado de Tramitação</label>
              <select
                className="form-select"
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value as EstadoTramitacao | 'TODOS')}
              >
                <option value="TODOS">Todos os Estados</option>
                {Object.entries(ESTADO_LABELS).map(([estado, label]) => (
                  <option key={estado} value={estado}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtro por Tipo */}
            <div className="col-md-2">
              <label className="form-label fs-6 fw-semibold">Tipo</label>
              <select
                className="form-select"
                value={filtroTipo}
                onChange={(e) => setFiltroTipo(e.target.value as TipoProposicao | 'TODOS')}
              >
                <option value="TODOS">Todos</option>
                <option value="PL">PL</option>
                <option value="PLP">PLP</option>
                <option value="PEC">PEC</option>
                <option value="PDC">PDC</option>
                <option value="PRC">PRC</option>
                <option value="MSC">MSC</option>
                <option value="PLV">PLV</option>
              </select>
            </div>

            {/* Filtro por Urgência */}
            <div className="col-md-3">
              <label className="form-label fs-6 fw-semibold">Urgência</label>
              <select
                className="form-select"
                value={filtroUrgencia}
                onChange={(e) => setFiltroUrgencia(e.target.value as 'NORMAL' | 'URGENTE' | 'URGENTISSIMA' | 'TODOS')}
              >
                <option value="TODOS">Todas</option>
                <option value="NORMAL">Normal</option>
                <option value="URGENTE">Urgente</option>
                <option value="URGENTISSIMA">Urgentíssima</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Proposições */}
      <div className="card card-flush">
        <div className="card-body pt-0">
          <div className="table-responsive">
            <table className="table table-striped table-row-bordered gy-4 gs-9">
              <thead>
                <tr className="fw-semibold fs-6 text-gray-800 border-bottom-2 border-gray-200">
                  <th>Proposição</th>
                  <th>Ementa</th>
                  <th>Autor</th>
                  <th>Estado Atual</th>
                  <th>Urgência</th>
                  <th>Prazo</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {proposicoesFiltradas.map((proposicao) => {
                  const diasRestantes = obterDiasRestantes(proposicao)
                  const acoesDisponiveis = obterAcoesDisponiveis(proposicao)
                  const estaVencida = proposicao.prazo && proposicao.prazo < new Date()

                  return (
                    <tr key={proposicao.id}>
                      {/* Proposição */}
                      <td>
                        <div className="d-flex flex-column">
                          <span className="text-gray-800 fw-bold fs-6">
                            {proposicao.numero}
                          </span>
                          <span className="text-muted fs-7">
                            {proposicao.ano}
                          </span>
                        </div>
                      </td>

                      {/* Ementa */}
                      <td>
                        <div className="text-gray-700 fs-7" style={{ maxWidth: '300px' }}>
                          {proposicao.ementa.length > 100 
                            ? `${proposicao.ementa.substring(0, 100)}...`
                            : proposicao.ementa
                          }
                        </div>
                      </td>

                      {/* Autor */}
                      <td>
                        <div className="d-flex flex-column">
                          <span className="text-gray-800 fw-semibold fs-7">
                            {proposicao.autor.nome}
                          </span>
                          <span className="text-muted fs-8">
                            {proposicao.autor.partido}/{proposicao.autor.uf}
                          </span>
                        </div>
                      </td>

                      {/* Estado Atual */}
                      <td>
                        <span className={`badge badge-light-${ESTADO_CORES[proposicao.estadoAtual]} fs-8`}>
                          {ESTADO_LABELS[proposicao.estadoAtual]}
                        </span>
                      </td>

                      {/* Urgência */}
                      <td>
                        <span className={`badge ${
                          proposicao.urgencia === 'URGENTISSIMA' ? 'badge-danger' :
                          proposicao.urgencia === 'URGENTE' ? 'badge-warning' :
                          'badge-light'
                        } fs-8`}>
                          {proposicao.urgencia}
                        </span>
                      </td>

                      {/* Prazo */}
                      <td>
                        {proposicao.prazo ? (
                          <div className="d-flex flex-column">
                            <span className={`fs-7 ${estaVencida ? 'text-danger fw-bold' : 'text-gray-700'}`}>
                              {formatarData(proposicao.prazo)}
                            </span>
                            <span className={`fs-8 ${estaVencida ? 'text-danger' : 'text-muted'}`}>
                              {estaVencida ? 'Vencida' : `${Math.floor(diasRestantes)} dias`}
                            </span>
                          </div>
                        ) : (
                          <span className="text-muted fs-8">Sem prazo</span>
                        )}
                      </td>

                      {/* Ações */}
                      <td>
                        <div className="d-flex gap-1">
                          <button
                            className="btn btn-sm btn-icon btn-light-primary"
                            onClick={() => setProposicaoSelecionada(proposicao)}
                            title="Ver detalhes"
                          >
                            <i className="bi bi-eye fs-5"></i>
                          </button>
                          
                          {acoesDisponiveis.length > 0 && (
                            <div className="dropdown">
                              <button
                                className="btn btn-sm btn-icon btn-light-warning dropdown-toggle"
                                type="button"
                                data-bs-toggle="dropdown"
                                title="Ações disponíveis"
                              >
                                <i className="bi bi-lightning fs-5"></i>
                              </button>
                              <ul className="dropdown-menu">
                                {acoesDisponiveis.map((acao) => (
                                  <li key={acao}>
                                    <a className="dropdown-item fs-7" href="#">
                                      {acao.replace(/_/g, ' ')}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal de Detalhes */}
      {proposicaoSelecionada && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Detalhes - {proposicaoSelecionada.numero}/{proposicaoSelecionada.ano}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setProposicaoSelecionada(null)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row g-4">
                  <div className="col-12">
                    <h6 className="fw-bold">Ementa</h6>
                    <p className="text-gray-700 fs-6">
                      {proposicaoSelecionada.ementa}
                    </p>
                  </div>
                  
                  {proposicaoSelecionada.explicacao && (
                    <div className="col-12">
                      <h6 className="fw-bold">Explicação</h6>
                      <p className="text-gray-600 fs-7">
                        {proposicaoSelecionada.explicacao}
                      </p>
                    </div>
                  )}

                  <div className="col-md-6">
                    <h6 className="fw-bold">Autor</h6>
                    <div className="d-flex align-items-center">
                      <div className="symbol symbol-35px me-3">
                        <div className="symbol-label bg-light-primary">
                          <i className="bi bi-person fs-4 text-primary"></i>
                        </div>
                      </div>
                      <div>
                        <div className="fw-semibold fs-6">{proposicaoSelecionada.autor.nome}</div>
                        <div className="text-muted fs-7">
                          {proposicaoSelecionada.autor.partido}/{proposicaoSelecionada.autor.uf}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <h6 className="fw-bold">Estado Atual</h6>
                    <span className={`badge badge-light-${ESTADO_CORES[proposicaoSelecionada.estadoAtual]} fs-6`}>
                      {ESTADO_LABELS[proposicaoSelecionada.estadoAtual]}
                    </span>
                  </div>

                  <div className="col-md-6">
                    <h6 className="fw-bold">Datas</h6>
                    <div className="text-gray-700 fs-7">
                      <div>Apresentação: {formatarData(proposicaoSelecionada.dataApresentacao)}</div>
                      <div>Última Atualização: {formatarData(proposicaoSelecionada.dataUltimaAtualizacao)}</div>
                      {proposicaoSelecionada.prazo && (
                        <div>Prazo: {formatarData(proposicaoSelecionada.prazo)}</div>
                      )}
                    </div>
                  </div>

                  <div className="col-md-6">
                    <h6 className="fw-bold">Comissões</h6>
                    <div className="d-flex flex-wrap gap-1">
                      {proposicaoSelecionada.comissoes.map((comissao) => (
                        <span key={comissao} className="badge badge-light-info fs-8">
                          {comissao}
                        </span>
                      ))}
                    </div>
                  </div>

                  {proposicaoSelecionada.relator && (
                    <div className="col-12">
                      <h6 className="fw-bold">Relator</h6>
                      <div className="text-gray-700 fs-7">
                        {proposicaoSelecionada.relator.nome} - {proposicaoSelecionada.relator.comissao}
                      </div>
                    </div>
                  )}

                  <div className="col-12">
                    <h6 className="fw-bold">Ações Disponíveis</h6>
                    <div className="d-flex flex-wrap gap-2">
                      {obterAcoesDisponiveis(proposicaoSelecionada).map((acao) => (
                        <button key={acao} className="btn btn-sm btn-light-primary">
                          {acao.replace(/_/g, ' ')}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-light"
                  onClick={() => setProposicaoSelecionada(null)}
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 