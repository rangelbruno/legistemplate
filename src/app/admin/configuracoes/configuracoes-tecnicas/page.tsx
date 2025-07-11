'use client'

import { Link } from 'react-router-dom'
import AdministradorLayout from '../../layout'
import { PageTitle } from '../../../../_metronic/layout/core'

export default function ConfiguracoesTecnicas() {
  return (
    <AdministradorLayout>
      <PageTitle 
        breadcrumbs={[
          { title: 'Administração', path: '/admin', isSeparator: false, isActive: false },
          { title: 'Configurações', path: '/admin/configuracoes', isSeparator: false, isActive: false },
          { title: 'Configurações Técnicas', path: '/admin/configuracoes/configuracoes-tecnicas', isSeparator: false, isActive: true }
        ]}
      >
        Configurações Técnicas
      </PageTitle>
      
      <div className="configuracoes-tecnicas-config">
        {/* Header da página */}
        <div className="card mb-7">
          <div className="card-body">
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center">
                <Link to="/admin/configuracoes" className="btn btn-icon btn-sm btn-light me-3">
                  <i className="bi bi-arrow-left fs-3"></i>
                </Link>
                <div className="symbol symbol-50px symbol-circle bg-light-secondary me-4">
                  <div className="symbol-label">
                    <i className="bi bi-gear text-secondary fs-2"></i>
                  </div>
                </div>
                <div>
                  <h1 className="text-gray-800 fw-bold mb-1">
                    Configurações Técnicas
                  </h1>
                  <p className="text-muted mb-0">
                    Configure backup, segurança, performance e transparência do sistema
                  </p>
                </div>
              </div>
              <div>
                <button className="btn btn-secondary">
                  <i className="bi bi-check2 me-2"></i>
                  Em Desenvolvimento
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Card de desenvolvimento */}
        <div className="card">
          <div className="card-body text-center py-15">
            <div className="symbol symbol-100px symbol-circle mx-auto mb-7 bg-light-secondary">
              <div className="symbol-label">
                <i className="bi bi-tools fs-1 text-secondary"></i>
              </div>
            </div>
            <h3 className="text-gray-800 mb-3">Funcionalidade em Desenvolvimento</h3>
            <p className="text-muted mb-7">
              Esta página de configuração está em desenvolvimento e será implementada em breve.<br/>
              Aqui você poderá configurar backup, segurança, performance e portal de transparência.
            </p>
            <div className="d-flex flex-wrap gap-3 justify-content-center">
              <span className="badge badge-light-warning fs-7">
                🚧 Em Construção
              </span>
              <span className="badge badge-light-info fs-7">
                📋 Próxima Sprint
              </span>
            </div>
          </div>
        </div>
      </div>
    </AdministradorLayout>
  )
} 