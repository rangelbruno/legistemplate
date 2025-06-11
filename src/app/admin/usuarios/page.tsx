'use client'

import AdministradorLayout from '../layout'

/**
 * Página de Gerenciamento de Usuários - Administrador
 * 
 * Página placeholder para futura implementação
 * do gerenciamento de usuários do sistema
 */
export default function AdminUsuariosPage() {
  return (
    <AdministradorLayout>
      <div className="admin-usuarios">
        {/* Header da página */}
        <div className="d-flex justify-content-between align-items-center mb-7">
          <div>
            <h1 className="page-heading d-flex text-dark fw-bold fs-3 mb-0">
              Gerenciamento de Usuários
            </h1>
            <span className="text-muted fs-7">
              Administrar usuários e permissões do sistema
            </span>
          </div>
          <button className="btn btn-primary">
            <i className="bi bi-person-plus fs-4 me-2"></i>
            Novo Usuário
          </button>
        </div>

        {/* Conteúdo placeholder */}
        <div className="card">
          <div className="card-body text-center py-15">
            <div className="symbol symbol-100px symbol-circle mx-auto mb-7">
              <div className="symbol-label bg-light-primary">
                <i className="bi bi-people fs-1 text-primary"></i>
              </div>
            </div>
            <h3 className="text-dark mb-3">Gerenciamento de Usuários</h3>
            <p className="text-muted mb-7">
              Esta funcionalidade será implementada em sprints futuros.<br/>
              Aqui será possível gerenciar usuários, permissões e roles do sistema.
            </p>
            <div className="d-flex flex-wrap gap-3 justify-content-center">
              <span className="badge badge-light-info fs-7">
                🔮 Funcionalidade Futura
              </span>
              <span className="badge badge-light-primary fs-7">
                👥 Gestão de Usuários
              </span>
              <span className="badge badge-light-success fs-7">
                🔐 Controle de Permissões
              </span>
            </div>
          </div>
        </div>
      </div>
    </AdministradorLayout>
  )
} 