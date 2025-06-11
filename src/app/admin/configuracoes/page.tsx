'use client'

import AdministradorLayout from '../layout'

/**
 * Página de Configurações do Sistema - Administrador
 * 
 * Página placeholder para futura implementação
 * das configurações globais do sistema
 */
export default function AdminConfiguracoes() {
  return (
    <AdministradorLayout>
      <div className="admin-configuracoes">
        {/* Header da página */}
        <div className="d-flex justify-content-between align-items-center mb-7">
          <div>
            <h1 className="page-heading d-flex text-dark fw-bold fs-3 mb-0">
              Configurações do Sistema
            </h1>
            <span className="text-muted fs-7">
              Gerenciar configurações globais e parâmetros do sistema
            </span>
          </div>
          <button className="btn btn-primary">
            <i className="bi bi-gear fs-4 me-2"></i>
            Salvar Configurações
          </button>
        </div>

        {/* Grid de configurações */}
        <div className="row g-6 g-xl-9">
          {/* Configurações Gerais */}
          <div className="col-lg-6">
            <div className="card h-100">
              <div className="card-header">
                <div className="card-title">
                  <h3 className="fw-bold text-gray-800">
                    <i className="bi bi-sliders text-primary me-2"></i>
                    Configurações Gerais
                  </h3>
                </div>
              </div>
              <div className="card-body">
                <p className="text-muted mb-7">
                  Configurações básicas do sistema de tramitação parlamentar.
                </p>
                <div className="d-flex flex-wrap gap-2">
                  <span className="badge badge-light-info">Nome da Instituição</span>
                  <span className="badge badge-light-info">Logo do Sistema</span>
                  <span className="badge badge-light-info">Timezone</span>
                  <span className="badge badge-light-info">Idioma Padrão</span>
                </div>
              </div>
            </div>
          </div>

          {/* Configurações de Workflow */}
          <div className="col-lg-6">
            <div className="card h-100">
              <div className="card-header">
                <div className="card-title">
                  <h3 className="fw-bold text-gray-800">
                    <i className="bi bi-diagram-3 text-success me-2"></i>
                    Workflow e Tramitação
                  </h3>
                </div>
              </div>
              <div className="card-body">
                <p className="text-muted mb-7">
                  Configurações específicas do fluxo de tramitação.
                </p>
                <div className="d-flex flex-wrap gap-2">
                  <span className="badge badge-light-success">Estados Personalizados</span>
                  <span className="badge badge-light-success">Prazos Padrão</span>
                  <span className="badge badge-light-success">Notificações</span>
                  <span className="badge badge-light-success">Aprovações</span>
                </div>
              </div>
            </div>
          </div>

          {/* Configurações de Segurança */}
          <div className="col-lg-6">
            <div className="card h-100">
              <div className="card-header">
                <div className="card-title">
                  <h3 className="fw-bold text-gray-800">
                    <i className="bi bi-shield-check text-warning me-2"></i>
                    Segurança e Acesso
                  </h3>
                </div>
              </div>
              <div className="card-body">
                <p className="text-muted mb-7">
                  Configurações de segurança e controle de acesso.
                </p>
                <div className="d-flex flex-wrap gap-2">
                  <span className="badge badge-light-warning">Políticas de Senha</span>
                  <span className="badge badge-light-warning">2FA</span>
                  <span className="badge badge-light-warning">Sessões</span>
                  <span className="badge badge-light-warning">Logs de Auditoria</span>
                </div>
              </div>
            </div>
          </div>

          {/* Configurações de Integração */}
          <div className="col-lg-6">
            <div className="card h-100">
              <div className="card-header">
                <div className="card-title">
                  <h3 className="fw-bold text-gray-800">
                    <i className="bi bi-link-45deg text-danger me-2"></i>
                    Integrações Externas
                  </h3>
                </div>
              </div>
              <div className="card-body">
                <p className="text-muted mb-7">
                  Configurações de APIs e serviços externos.
                </p>
                <div className="d-flex flex-wrap gap-2">
                  <span className="badge badge-light-danger">APIs Terceiros</span>
                  <span className="badge badge-light-danger">Webhooks</span>
                  <span className="badge badge-light-danger">Sincronização</span>
                  <span className="badge badge-light-danger">Backup</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Status de Implementação */}
        <div className="card mt-7">
          <div className="card-body text-center py-15">
            <div className="symbol symbol-100px symbol-circle mx-auto mb-7">
              <div className="symbol-label bg-light-warning">
                <i className="bi bi-gear fs-1 text-warning"></i>
              </div>
            </div>
            <h3 className="text-dark mb-3">Configurações do Sistema</h3>
            <p className="text-muted mb-7">
              Esta funcionalidade será implementada em sprints futuros.<br/>
              Aqui será possível configurar todos os aspectos do sistema.
            </p>
            <div className="d-flex flex-wrap gap-3 justify-content-center">
              <span className="badge badge-light-info fs-7">
                🔮 Funcionalidade Futura
              </span>
              <span className="badge badge-light-warning fs-7">
                ⚙️ Configurações Avançadas
              </span>
              <span className="badge badge-light-success fs-7">
                🔧 Personalização
              </span>
            </div>
          </div>
        </div>
      </div>
    </AdministradorLayout>
  )
} 