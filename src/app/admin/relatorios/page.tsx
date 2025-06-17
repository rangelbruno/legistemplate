'use client'

import AdministradorLayout from '../layout'
import { PageTitle } from '../../../_metronic/layout/core'

/**
 * Página de Relatórios e Estatísticas - Administrador
 * 
 * Página placeholder para futura implementação
 * de relatórios gerenciais e estatísticas do sistema
 */
export default function AdminRelatorios() {
  return (
    <AdministradorLayout>
      <PageTitle 
        breadcrumbs={[
          { title: 'Administração', path: '/admin', isSeparator: false, isActive: false },
          { title: 'Relatórios', path: '/admin/relatorios', isSeparator: false, isActive: false }
        ]}
      >
        Relatórios e Estatísticas
      </PageTitle>
      
      <div className="admin-relatorios">
        {/* Botões de ação */}
        <div className="d-flex justify-content-end gap-2 mb-7">
          <button className="btn btn-light">
            <i className="bi bi-funnel fs-4 me-2"></i>
            Filtros
          </button>
          <button className="btn btn-primary">
            <i className="bi bi-download fs-4 me-2"></i>
            Exportar
          </button>
        </div>

        {/* Grid de tipos de relatórios */}
        <div className="row g-6 g-xl-9">
          {/* Relatórios de Performance */}
          <div className="col-lg-4">
            <div className="card h-100">
              <div className="card-header">
                <div className="card-title">
                  <h3 className="fw-bold text-gray-800">
                    <i className="bi bi-graph-up text-success me-2"></i>
                    Performance
                  </h3>
                </div>
              </div>
              <div className="card-body">
                <div className="symbol symbol-50px symbol-circle mx-auto mb-5">
                  <div className="symbol-label bg-light-success">
                    <i className="bi bi-speedometer2 fs-2 text-success"></i>
                  </div>
                </div>
                <div className="text-center">
                  <h4 className="fw-bold text-gray-800 mb-3">Métricas de Performance</h4>
                  <p className="text-muted fs-7 mb-5">
                    Tempo médio de tramitação, gargalos e eficiência.
                  </p>
                  <div className="d-flex flex-wrap gap-2 justify-content-center">
                    <span className="badge badge-light-success">Tempo Médio</span>
                    <span className="badge badge-light-success">Gargalos</span>
                    <span className="badge badge-light-success">SLA</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Relatórios de Volume */}
          <div className="col-lg-4">
            <div className="card h-100">
              <div className="card-header">
                <div className="card-title">
                  <h3 className="fw-bold text-gray-800">
                    <i className="bi bi-bar-chart text-primary me-2"></i>
                    Volume
                  </h3>
                </div>
              </div>
              <div className="card-body">
                <div className="symbol symbol-50px symbol-circle mx-auto mb-5">
                  <div className="symbol-label bg-light-primary">
                    <i className="bi bi-stack fs-2 text-primary"></i>
                  </div>
                </div>
                <div className="text-center">
                  <h4 className="fw-bold text-gray-800 mb-3">Relatórios de Volume</h4>
                  <p className="text-muted fs-7 mb-5">
                    Quantidade de proposições por período e status.
                  </p>
                  <div className="d-flex flex-wrap gap-2 justify-content-center">
                    <span className="badge badge-light-primary">Por Período</span>
                    <span className="badge badge-light-primary">Por Status</span>
                    <span className="badge badge-light-primary">Tendências</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Relatórios de Usuários */}
          <div className="col-lg-4">
            <div className="card h-100">
              <div className="card-header">
                <div className="card-title">
                  <h3 className="fw-bold text-gray-800">
                    <i className="bi bi-people text-info me-2"></i>
                    Usuários
                  </h3>
                </div>
              </div>
              <div className="card-body">
                <div className="symbol symbol-50px symbol-circle mx-auto mb-5">
                  <div className="symbol-label bg-light-info">
                    <i className="bi bi-person-check fs-2 text-info"></i>
                  </div>
                </div>
                <div className="text-center">
                  <h4 className="fw-bold text-gray-800 mb-3">Atividade de Usuários</h4>
                  <p className="text-muted fs-7 mb-5">
                    Acessos, ações realizadas e produtividade.
                  </p>
                  <div className="d-flex flex-wrap gap-2 justify-content-center">
                    <span className="badge badge-light-info">Acessos</span>
                    <span className="badge badge-light-info">Ações</span>
                    <span className="badge badge-light-info">Produtividade</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Relatórios de Auditoria */}
          <div className="col-lg-4">
            <div className="card h-100">
              <div className="card-header">
                <div className="card-title">
                  <h3 className="fw-bold text-gray-800">
                    <i className="bi bi-shield-check text-warning me-2"></i>
                    Auditoria
                  </h3>
                </div>
              </div>
              <div className="card-body">
                <div className="symbol symbol-50px symbol-circle mx-auto mb-5">
                  <div className="symbol-label bg-light-warning">
                    <i className="bi bi-search fs-2 text-warning"></i>
                  </div>
                </div>
                <div className="text-center">
                  <h4 className="fw-bold text-gray-800 mb-3">Logs de Auditoria</h4>
                  <p className="text-muted fs-7 mb-5">
                    Rastros de ações, alterações e conformidade.
                  </p>
                  <div className="d-flex flex-wrap gap-2 justify-content-center">
                    <span className="badge badge-light-warning">Logs</span>
                    <span className="badge badge-light-warning">Alterações</span>
                    <span className="badge badge-light-warning">Compliance</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Relatórios Customizados */}
          <div className="col-lg-4">
            <div className="card h-100">
              <div className="card-header">
                <div className="card-title">
                  <h3 className="fw-bold text-gray-800">
                    <i className="bi bi-gear text-secondary me-2"></i>
                    Customizados
                  </h3>
                </div>
              </div>
              <div className="card-body">
                <div className="symbol symbol-50px symbol-circle mx-auto mb-5">
                  <div className="symbol-label bg-light-secondary">
                    <i className="bi bi-tools fs-2 text-secondary"></i>
                  </div>
                </div>
                <div className="text-center">
                  <h4 className="fw-bold text-gray-800 mb-3">Relatórios Customizados</h4>
                  <p className="text-muted fs-7 mb-5">
                    Crie relatórios específicos conforme necessidade.
                  </p>
                  <div className="d-flex flex-wrap gap-2 justify-content-center">
                    <span className="badge badge-light-secondary">Builder</span>
                    <span className="badge badge-light-secondary">Templates</span>
                    <span className="badge badge-light-secondary">Agendados</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Dashboards Executivos */}
          <div className="col-lg-4">
            <div className="card h-100">
              <div className="card-header">
                <div className="card-title">
                  <h3 className="fw-bold text-gray-800">
                    <i className="bi bi-display text-danger me-2"></i>
                    Executivos
                  </h3>
                </div>
              </div>
              <div className="card-body">
                <div className="symbol symbol-50px symbol-circle mx-auto mb-5">
                  <div className="symbol-label bg-light-danger">
                    <i className="bi bi-graph-up-arrow fs-2 text-danger"></i>
                  </div>
                </div>
                <div className="text-center">
                  <h4 className="fw-bold text-gray-800 mb-3">Dashboards Executivos</h4>
                  <p className="text-muted fs-7 mb-5">
                    Visão executiva com KPIs e métricas estratégicas.
                  </p>
                  <div className="d-flex flex-wrap gap-2 justify-content-center">
                    <span className="badge badge-light-danger">KPIs</span>
                    <span className="badge badge-light-danger">Estratégicos</span>
                    <span className="badge badge-light-danger">Executivo</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Status de Implementação */}
        <div className="card mt-7">
          <div className="card-body text-center py-15">
            <div className="symbol symbol-100px symbol-circle mx-auto mb-7">
              <div className="symbol-label bg-light-primary">
                <i className="bi bi-graph-up fs-1 text-primary"></i>
              </div>
            </div>
            <h3 className="text-dark mb-3">Relatórios e Analytics</h3>
            <p className="text-muted mb-7">
              Esta funcionalidade será implementada em sprints futuros.<br/>
              Aqui serão disponibilizados relatórios gerenciais e dashboards analíticos.
            </p>
            <div className="d-flex flex-wrap gap-3 justify-content-center">
              <span className="badge badge-light-info fs-7">
                🔮 Funcionalidade Futura
              </span>
              <span className="badge badge-light-primary fs-7">
                📊 Analytics Avançado
              </span>
              <span className="badge badge-light-success fs-7">
                📈 BI Integrado
              </span>
            </div>
          </div>
        </div>
      </div>
    </AdministradorLayout>
  )
} 