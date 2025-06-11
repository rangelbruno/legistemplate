'use client'

import React, { useState, useEffect } from 'react'
import { MOCK_DASHBOARD_DATA, MOCK_PROPOSICOES, calcularEstatisticas } from '../../../data/mock-proposicoes'
import { ESTADO_LABELS, ESTADO_CORES, workflowEngine } from '../../../lib/workflow/tramitacao-workflow'
import type { DashboardData, Proposicao, EstadoTramitacao } from '../../../types/tramitacao'

/**
 * Dashboard Principal do Desenvolvedor - Sistema de Tramitação Parlamentar
 * 
 * Mostra visão geral do sistema com métricas, gráficos e proposições em destaque
 * Implementa todos os requisitos do Sprint 1
 */
export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<DashboardData>(MOCK_DASHBOARD_DATA)
  const [proposicoesDestaque, setProposicoesDestaque] = useState<Proposicao[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simula carregamento de dados
    const loadDashboardData = async () => {
      setLoading(true)
      
      // Simula delay de API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Carrega estatísticas
      const stats = calcularEstatisticas()
      
      // Filtra proposições em destaque (urgentes + vencidas + ações pendentes)
      const urgentes = MOCK_PROPOSICOES.filter(p => p.urgencia !== 'NORMAL')
      const vencidas = MOCK_PROPOSICOES.filter(p => {
        if (!p.prazo) return false
        return p.prazo < new Date()
      })
      const acoesPendentes = MOCK_PROPOSICOES.filter(p => p.proximaAcao)
      
      const destaque = [...urgentes, ...vencidas, ...acoesPendentes]
        .filter((prop, index, arr) => arr.findIndex(p => p.id === prop.id) === index)
        .slice(0, 5)
      
      setProposicoesDestaque(destaque)
      setDashboardData(MOCK_DASHBOARD_DATA)
      setLoading(false)
    }

    loadDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="desenvolvedor-dashboard">
      {/* Header do Dashboard */}
      <div className="d-flex justify-content-between align-items-center mb-7">
        <div>
          <h1 className="page-heading d-flex text-dark fw-bold fs-3 mb-0">
            Dashboard do Desenvolvedor
          </h1>
          <span className="text-muted fs-7">
            Sistema de Tramitação Parlamentar - Sprint 1
          </span>
        </div>
        <div className="d-flex align-items-center gap-2">
          <span className="badge badge-light-success fs-7">
            ✅ Sprint 1 Implementado
          </span>
        </div>
      </div>

      {/* Cards de Estatísticas Principais */}
      <div className="row g-6 g-xl-9 mb-6">
        <div className="col-md-6 col-xl-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="symbol symbol-45px me-5">
                  <div className="symbol-label bg-light-primary">
                    <i className="bi bi-files fs-1 text-primary"></i>
                  </div>
                </div>
                <div className="flex-grow-1">
                  <a href="#" className="text-gray-800 fw-bold text-hover-primary fs-6">
                    Total de Proposições
                  </a>
                  <span className="text-muted fw-semibold d-block fs-7">
                    Em tramitação
                  </span>
                </div>
                <div className="fw-bold text-end">
                  <span className="text-dark fs-2">{dashboardData.totalProposicoes}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-xl-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="symbol symbol-45px me-5">
                  <div className="symbol-label bg-light-warning">
                    <i className="bi bi-clock-history fs-1 text-warning"></i>
                  </div>
                </div>
                <div className="flex-grow-1">
                  <a href="#" className="text-gray-800 fw-bold text-hover-primary fs-6">
                    Proposições Urgentes
                  </a>
                  <span className="text-muted fw-semibold d-block fs-7">
                    Requerem atenção
                  </span>
                </div>
                <div className="fw-bold text-end">
                  <span className="text-warning fs-2">{dashboardData.proposicoesUrgentes}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-xl-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="symbol symbol-45px me-5">
                  <div className="symbol-label bg-light-danger">
                    <i className="bi bi-exclamation-triangle fs-1 text-danger"></i>
                  </div>
                </div>
                <div className="flex-grow-1">
                  <a href="#" className="text-gray-800 fw-bold text-hover-primary fs-6">
                    Proposições Vencidas
                  </a>
                  <span className="text-muted fw-semibold d-block fs-7">
                    Fora do prazo
                  </span>
                </div>
                <div className="fw-bold text-end">
                  <span className="text-danger fs-2">{dashboardData.proposicoesVencidas}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-xl-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="symbol symbol-45px me-5">
                  <div className="symbol-label bg-light-info">
                    <i className="bi bi-speedometer fs-1 text-info"></i>
                  </div>
                </div>
                <div className="flex-grow-1">
                  <a href="#" className="text-gray-800 fw-bold text-hover-primary fs-6">
                    Tempo Médio
                  </a>
                  <span className="text-muted fw-semibold d-block fs-7">
                    De tramitação
                  </span>
                </div>
                <div className="fw-bold text-end">
                  <span className="text-info fs-2">{dashboardData.tempoMedioTramitacao}</span>
                  <span className="text-muted fs-7">dias</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-6 g-xl-9">
        {/* Estados de Tramitação */}
        <div className="col-xl-8">
          <div className="card card-flush h-xl-100">
            <div className="card-header pt-7">
              <h3 className="card-title text-gray-800 fw-bold">
                Estados de Tramitação
              </h3>
              <div className="card-toolbar">
                <span className="badge badge-light-primary">
                  {Object.keys(ESTADO_LABELS).length} Estados Mapeados
                </span>
              </div>
            </div>
            <div className="card-body pt-3">
              <div className="row g-3">
                {Object.entries(dashboardData.proposicoesPorEstado)
                  .filter(([_, quantidade]) => quantidade > 0)
                  .map(([estado, quantidade]) => (
                    <div key={estado} className="col-md-6 col-lg-4">
                      <div className="border border-gray-300 border-dashed rounded p-4">
                        <div className="d-flex align-items-center mb-2">
                          <span className={`badge badge-light-${ESTADO_CORES[estado as EstadoTramitacao]} fs-8 me-2`}>
                            {quantidade}
                          </span>
                          <span className="text-gray-700 fw-semibold fs-7">
                            {ESTADO_LABELS[estado as EstadoTramitacao]}
                          </span>
                        </div>
                        <div className="text-muted fs-8">
                          {workflowEngine.obterResponsavel(estado as EstadoTramitacao)}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>

        {/* Proposições em Destaque */}
        <div className="col-xl-4">
          <div className="card card-flush h-xl-100">
            <div className="card-header pt-7">
              <h3 className="card-title text-gray-800 fw-bold">
                Proposições em Destaque
              </h3>
              <div className="card-toolbar">
                <a href="/desenvolvedor/proposicoes" className="btn btn-sm btn-light">
                  Ver Todas
                </a>
              </div>
            </div>
            <div className="card-body pt-3">
              <div className="timeline-container">
                {proposicoesDestaque.map((proposicao, index) => (
                  <div key={proposicao.id} className="timeline-item">
                    <div className="timeline-line w-40px"></div>
                    <div className="timeline-icon symbol symbol-circle symbol-40px">
                      <div className={`symbol-label bg-light-${ESTADO_CORES[proposicao.estadoAtual]}`}>
                        <i className={`bi bi-file-earmark-text fs-4 text-${ESTADO_CORES[proposicao.estadoAtual]}`}></i>
                      </div>
                    </div>
                    <div className="timeline-content m-0">
                      <div className="pe-3 mb-5">
                        <div className="fs-7 text-gray-800 fw-bold">
                          {proposicao.numero}/{proposicao.ano}
                        </div>
                        <div className="d-flex align-items-center mt-1 fs-8">
                          <div className="text-muted me-2 fs-8">
                            {proposicao.ementa.substring(0, 80)}...
                          </div>
                        </div>
                        <div className="d-flex align-items-center mt-2">
                          <span className={`badge badge-light-${ESTADO_CORES[proposicao.estadoAtual]} fs-8 me-2`}>
                            {ESTADO_LABELS[proposicao.estadoAtual]}
                          </span>
                          {proposicao.urgencia !== 'NORMAL' && (
                            <span className="badge badge-light-warning fs-8">
                              {proposicao.urgencia}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Comissões com Mais Trabalho */}
      <div className="row g-6 g-xl-9 mt-6">
        <div className="col-12">
          <div className="card card-flush">
            <div className="card-header pt-7">
              <h3 className="card-title text-gray-800 fw-bold">
                Comissões com Mais Trabalho
              </h3>
              <div className="card-toolbar">
                <span className="text-muted fs-7">
                  Distribuição de proposições por comissão
                </span>
              </div>
            </div>
            <div className="card-body pt-3">
              <div className="row g-3">
                {dashboardData.comissoesComMaisTrabalho
                  .filter(item => item.quantidade > 0)
                  .map((item) => (
                    <div key={item.comissao} className="col-md-6 col-lg-3">
                      <div className="border border-gray-300 border-dashed rounded p-4 text-center">
                        <div className="fs-2 fw-bold text-gray-800 mb-2">
                          {item.quantidade}
                        </div>
                        <div className="fs-7 text-gray-600 fw-semibold">
                          {item.comissao}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sistema de Workflow - Sprint 1 Status */}
      <div className="row g-6 g-xl-9 mt-6">
        <div className="col-12">
          <div className="card card-flush border-success">
            <div className="card-header pt-7 bg-light-success">
              <h3 className="card-title text-success fw-bold">
                ✅ Sprint 1 - Sistema de Tramitação Implementado
              </h3>
            </div>
            <div className="card-body pt-3">
              <div className="row g-3">
                <div className="col-md-3">
                  <div className="d-flex align-items-center">
                    <i className="bi bi-check-circle-fill text-success fs-1 me-3"></i>
                    <div>
                      <div className="fs-6 fw-bold text-gray-800">Template Mapeado</div>
                      <div className="fs-7 text-muted">Estados e transições definidos</div>
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="d-flex align-items-center">
                    <i className="bi bi-check-circle-fill text-success fs-1 me-3"></i>
                    <div>
                      <div className="fs-6 fw-bold text-gray-800">Workflow Engine</div>
                      <div className="fs-7 text-muted">{Object.keys(ESTADO_LABELS).length} estados implementados</div>
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="d-flex align-items-center">
                    <i className="bi bi-check-circle-fill text-success fs-1 me-3"></i>
                    <div>
                      <div className="fs-6 fw-bold text-gray-800">Mock Data</div>
                      <div className="fs-7 text-muted">{MOCK_PROPOSICOES.length} proposições de exemplo</div>
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="d-flex align-items-center">
                    <i className="bi bi-check-circle-fill text-success fs-1 me-3"></i>
                    <div>
                      <div className="fs-6 fw-bold text-gray-800">Rotas Básicas</div>
                      <div className="fs-7 text-muted">Estrutura de navegação</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 