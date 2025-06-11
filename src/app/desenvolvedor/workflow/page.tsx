'use client'

import React, { useState } from 'react'
import { WORKFLOW_CONFIG, ESTADO_LABELS, ESTADO_CORES, workflowEngine } from '../../../lib/workflow/tramitacao-workflow'
import type { EstadoTramitacao, AcaoTramitacao, TransicaoEstado } from '../../../types/tramitacao'

/**
 * Tela de Visualização do Workflow - Sistema de Tramitação Parlamentar
 * 
 * Mostra o diagrama completo do workflow com estados, transições e regras
 * Implementa visualização interativa do Sprint 1
 */
export default function WorkflowPage() {
  const [estadoSelecionado, setEstadoSelecionado] = useState<EstadoTramitacao | null>(null)
  const [filtroFase, setFiltroFase] = useState<'TODAS' | 'CRIACAO' | 'COMISSOES' | 'PLENARIO' | 'EXECUTIVO'>('TODAS')

  // Agrupar estados por fase
  const fases = {
    'CRIACAO': ['DRAFT_INITIATED', 'UNDER_FORMAL_REVIEW', 'PENDING_CORRECTIONS', 'REJECTED_PRELIMINARY'],
    'COMISSOES': [
      'COMMITTEE_ASSIGNED', 'IN_COMMITTEE_REVIEW', 'UNDER_RAPPORTEUR_ANALYSIS',
      'AMENDMENT_PERIOD_OPEN', 'AMENDMENT_PERIOD_CLOSED', 'COMMITTEE_DISCUSSION',
      'COMMITTEE_VOTING', 'COMMITTEE_APPROVED', 'COMMITTEE_REJECTED', 'READY_FOR_PLENARY'
    ],
    'PLENARIO': [
      'IN_PLENARY_DISCUSSION', 'IN_VOTING', 'APPROVED_PLENARY', 'REJECTED_PLENARY', 'IN_REVIEWING_HOUSE'
    ],
    'EXECUTIVO': [
      'SENT_TO_EXECUTIVE', 'UNDER_EXECUTIVE_REVIEW', 'SANCTIONED',
      'PARTIALLY_VETOED', 'TOTALLY_VETOED', 'PROMULGATED', 'PUBLISHED_ACTIVE'
    ]
  }

  const estadosFiltrados = filtroFase === 'TODAS' 
    ? WORKFLOW_CONFIG.estadosValidos 
    : fases[filtroFase] as EstadoTramitacao[]

  const obterTransicoesDeEstado = (estado: EstadoTramitacao): TransicaoEstado[] => {
    return WORKFLOW_CONFIG.transicoesPermitidas.filter(t => t.de === estado)
  }

  const obterTransicoesParaEstado = (estado: EstadoTramitacao): TransicaoEstado[] => {
    return WORKFLOW_CONFIG.transicoesPermitidas.filter(t => t.para === estado)
  }

  const renderizarEstado = (estado: EstadoTramitacao, index: number) => {
    const transicoesDe = obterTransicoesDeEstado(estado)
    const transicoesPara = obterTransicoesParaEstado(estado)
    const acoesDisponiveis = workflowEngine.obterAcoesDisponiveis(estado)
    const responsavel = workflowEngine.obterResponsavel(estado)
    const prazo = WORKFLOW_CONFIG.prazos[estado]
    
    return (
      <div key={estado} className="col-md-6 col-lg-4 col-xl-3 mb-4">
        <div 
          className={`card border border-2 h-100 cursor-pointer ${
            estadoSelecionado === estado ? `border-${ESTADO_CORES[estado]}` : 'border-gray-300'
          }`}
          onClick={() => setEstadoSelecionado(estadoSelecionado === estado ? null : estado)}
        >
          <div className="card-body p-4">
            {/* Header do Estado */}
            <div className="d-flex align-items-center mb-3">
              <div className={`symbol symbol-40px me-3`}>
                <div className={`symbol-label bg-light-${ESTADO_CORES[estado]}`}>
                  <i className={`bi bi-circle-fill fs-6 text-${ESTADO_CORES[estado]}`}></i>
                </div>
              </div>
              <div className="flex-grow-1">
                <span className={`badge badge-light-${ESTADO_CORES[estado]} fs-8 mb-1`}>
                  {estado}
                </span>
                <div className="fw-semibold fs-7 text-gray-800">
                  {ESTADO_LABELS[estado]}
                </div>
              </div>
            </div>

            {/* Informações do Estado */}
            <div className="mb-3">
              <div className="text-muted fs-8 mb-1">
                <i className="bi bi-person-circle me-1"></i>
                {responsavel}
              </div>
              {prazo > 0 && (
                <div className="text-muted fs-8 mb-1">
                  <i className="bi bi-clock me-1"></i>
                  {prazo} dias
                </div>
              )}
              <div className="text-muted fs-8">
                <i className="bi bi-arrow-right-circle me-1"></i>
                {transicoesDe.length} saídas
              </div>
            </div>

            {/* Ações Disponíveis */}
            {acoesDisponiveis.length > 0 && (
              <div className="mb-3">
                <div className="fs-8 text-gray-600 mb-1">Ações:</div>
                <div className="d-flex flex-wrap gap-1">
                  {acoesDisponiveis.slice(0, 2).map((acao) => (
                    <span key={acao} className="badge badge-light fs-9">
                      {acao.replace(/_/g, ' ').substring(0, 10)}
                    </span>
                  ))}
                  {acoesDisponiveis.length > 2 && (
                    <span className="badge badge-light fs-9">
                      +{acoesDisponiveis.length - 2}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Indicadores */}
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex gap-1">
                {transicoesPara.length > 0 && (
                  <span className="badge badge-light-info fs-9" title="Entradas">
                    {transicoesPara.length} ←
                  </span>
                )}
                {transicoesDe.length > 0 && (
                  <span className="badge badge-light-warning fs-9" title="Saídas">
                    → {transicoesDe.length}
                  </span>
                )}
              </div>
              <div className="text-muted fs-9">
                #{index + 1}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="workflow-page">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-7">
        <div>
          <h1 className="page-heading d-flex text-dark fw-bold fs-3 mb-0">
            Workflow de Tramitação
          </h1>
          <span className="text-muted fs-7">
            Visualização completa do sistema de estados e transições - Sprint 1
          </span>
        </div>
        <div className="d-flex align-items-center gap-2">
          <span className="badge badge-light-success">
            {WORKFLOW_CONFIG.estadosValidos.length} Estados
          </span>
          <span className="badge badge-light-info">
            {WORKFLOW_CONFIG.transicoesPermitidas.length} Transições
          </span>
        </div>
      </div>

      {/* Filtros */}
      <div className="card card-flush mb-6">
        <div className="card-header pt-7">
          <h3 className="card-title text-gray-800 fw-bold">
            Filtros por Fase
          </h3>
        </div>
        <div className="card-body pt-3">
          <div className="d-flex flex-wrap gap-2">
            {(['TODAS', 'CRIACAO', 'COMISSOES', 'PLENARIO', 'EXECUTIVO'] as const).map((fase) => (
              <button
                key={fase}
                className={`btn btn-sm ${filtroFase === fase ? 'btn-primary' : 'btn-light'}`}
                onClick={() => setFiltroFase(fase)}
              >
                {fase === 'TODAS' ? 'Todas as Fases' :
                 fase === 'CRIACAO' ? 'Criação e Recepção' :
                 fase === 'COMISSOES' ? 'Comissões' :
                 fase === 'PLENARIO' ? 'Plenário' :
                 'Executivo'}
                <span className="ms-1 badge badge-light-dark fs-9">
                  {fase === 'TODAS' ? WORKFLOW_CONFIG.estadosValidos.length : fases[fase]?.length || 0}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid de Estados */}
      <div className="card card-flush mb-6">
        <div className="card-header pt-7">
          <h3 className="card-title text-gray-800 fw-bold">
            Estados de Tramitação
          </h3>
          <div className="card-toolbar">
            <span className="text-muted fs-7">
              Clique em um estado para ver detalhes
            </span>
          </div>
        </div>
        <div className="card-body pt-3">
          <div className="row">
            {estadosFiltrados.map(renderizarEstado)}
          </div>
        </div>
      </div>

      {/* Detalhes do Estado Selecionado */}
      {estadoSelecionado && (
        <div className="card card-flush border-primary">
          <div className="card-header pt-7 bg-light-primary">
            <h3 className="card-title text-primary fw-bold">
              <i className="bi bi-info-circle me-2"></i>
              Detalhes: {ESTADO_LABELS[estadoSelecionado]}
            </h3>
            <div className="card-toolbar">
              <button
                className="btn btn-sm btn-icon btn-light-primary"
                onClick={() => setEstadoSelecionado(null)}
              >
                <i className="bi bi-x"></i>
              </button>
            </div>
          </div>
          <div className="card-body pt-3">
            <div className="row g-6">
              {/* Informações Gerais */}
              <div className="col-md-4">
                <h6 className="fw-bold mb-3">Informações Gerais</h6>
                <div className="d-flex flex-column gap-2">
                  <div className="d-flex justify-content-between">
                    <span className="text-muted fs-7">ID Técnico:</span>
                    <span className="fs-7">{estadoSelecionado}</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="text-muted fs-7">Responsável:</span>
                    <span className="fs-7">{workflowEngine.obterResponsavel(estadoSelecionado)}</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="text-muted fs-7">Prazo:</span>
                    <span className="fs-7">
                      {WORKFLOW_CONFIG.prazos[estadoSelecionado] || 0} dias
                    </span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="text-muted fs-7">Cor:</span>
                    <span className={`badge badge-${ESTADO_CORES[estadoSelecionado]} fs-8`}>
                      {ESTADO_CORES[estadoSelecionado]}
                    </span>
                  </div>
                </div>
              </div>

              {/* Transições de Saída */}
              <div className="col-md-4">
                <h6 className="fw-bold mb-3">Transições de Saída ({obterTransicoesDeEstado(estadoSelecionado).length})</h6>
                <div className="d-flex flex-column gap-2">
                  {obterTransicoesDeEstado(estadoSelecionado).map((transicao, index) => (
                    <div key={index} className="border border-gray-300 rounded p-2">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <span className={`badge badge-light-${ESTADO_CORES[transicao.para]} fs-8`}>
                          {ESTADO_LABELS[transicao.para]}
                        </span>
                        {transicao.automatica && (
                          <span className="badge badge-success fs-9">AUTO</span>
                        )}
                      </div>
                      <div className="fs-8 text-muted">
                        Ação: {transicao.acao.replace(/_/g, ' ')}
                      </div>
                      {transicao.tempoLimite && (
                        <div className="fs-8 text-muted">
                          Limite: {transicao.tempoLimite} dias
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Ações Disponíveis */}
              <div className="col-md-4">
                <h6 className="fw-bold mb-3">Ações Disponíveis ({workflowEngine.obterAcoesDisponiveis(estadoSelecionado).length})</h6>
                <div className="d-flex flex-column gap-2">
                  {workflowEngine.obterAcoesDisponiveis(estadoSelecionado).map((acao) => (
                    <div key={acao} className="border border-gray-300 rounded p-2">
                      <div className="fw-semibold fs-7">
                        {acao.replace(/_/g, ' ')}
                      </div>
                      <div className="fs-8 text-muted">
                        {workflowEngine.obterProximoEstado(estadoSelecionado, acao) && (
                          <>→ {ESTADO_LABELS[workflowEngine.obterProximoEstado(estadoSelecionado, acao)!]}</>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notificações */}
              <div className="col-12">
                <h6 className="fw-bold mb-3">Notificações</h6>
                <div className="d-flex flex-wrap gap-2">
                  {workflowEngine.obterNotificacoes(estadoSelecionado).map((notificacao) => (
                    <span key={notificacao} className="badge badge-light-info fs-8">
                      {notificacao.replace(/_/g, ' ')}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Estatísticas do Workflow */}
      <div className="row g-6 g-xl-9 mt-6">
        <div className="col-md-3">
          <div className="card card-flush text-center">
            <div className="card-body">
              <div className="fs-2 fw-bold text-primary mb-2">
                {WORKFLOW_CONFIG.estadosValidos.length}
              </div>
              <div className="fs-7 text-gray-600">
                Estados Mapeados
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-3">
          <div className="card card-flush text-center">
            <div className="card-body">
              <div className="fs-2 fw-bold text-success mb-2">
                {WORKFLOW_CONFIG.transicoesPermitidas.length}
              </div>
              <div className="fs-7 text-gray-600">
                Transições Definidas
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-3">
          <div className="card card-flush text-center">
            <div className="card-body">
              <div className="fs-2 fw-bold text-warning mb-2">
                {WORKFLOW_CONFIG.transicoesPermitidas.filter(t => t.automatica).length}
              </div>
              <div className="fs-7 text-gray-600">
                Transições Automáticas
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-3">
          <div className="card card-flush text-center">
            <div className="card-body">
              <div className="fs-2 fw-bold text-info mb-2">
                {Object.values(WORKFLOW_CONFIG.acoesDisponiveis).flat().length}
              </div>
              <div className="fs-7 text-gray-600">
                Ações Implementadas
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sprint 1 Completion Status */}
      <div className="card card-flush border-success mt-6">
        <div className="card-header pt-7 bg-light-success">
          <h3 className="card-title text-success fw-bold">
            ✅ Sprint 1 - Workflow Engine Completo
          </h3>
        </div>
        <div className="card-body pt-3">
          <div className="row g-3">
            <div className="col-md-6">
              <div className="d-flex align-items-center">
                <i className="bi bi-check-circle-fill text-success fs-1 me-3"></i>
                <div>
                  <div className="fs-6 fw-bold text-gray-800">Estados de Tramitação</div>
                  <div className="fs-7 text-muted">
                    {WORKFLOW_CONFIG.estadosValidos.length} estados completamente mapeados
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="d-flex align-items-center">
                <i className="bi bi-check-circle-fill text-success fs-1 me-3"></i>
                <div>
                  <div className="fs-6 fw-bold text-gray-800">Regras de Transição</div>
                  <div className="fs-7 text-muted">
                    {WORKFLOW_CONFIG.transicoesPermitidas.length} transições especificadas
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