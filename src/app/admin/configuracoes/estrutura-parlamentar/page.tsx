'use client'

import { Link } from 'react-router-dom'
import AdministradorLayout from '../../layout'
import { PageTitle } from '../../../../_metronic/layout/core'

export default function EstruturaParlamentar() {
  return (
    <AdministradorLayout>
      <PageTitle 
        breadcrumbs={[
          { title: 'Administração', path: '/admin', isSeparator: false, isActive: false },
          { title: 'Configurações', path: '/admin/configuracoes', isSeparator: false, isActive: false },
          { title: 'Estrutura Parlamentar', path: '/admin/configuracoes/estrutura-parlamentar', isSeparator: false, isActive: true }
        ]}
      >
        Estrutura Parlamentar
      </PageTitle>
      
      <div className="estrutura-parlamentar-config">
        {/* Header da página */}
        <div className="card mb-7">
          <div className="card-body">
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center">
                <Link to="/admin/configuracoes" className="btn btn-icon btn-sm btn-light me-3">
                  <i className="bi bi-arrow-left fs-3"></i>
                </Link>
                <div className="symbol symbol-50px symbol-circle bg-light-warning me-4">
                  <div className="symbol-label">
                    <i className="bi bi-building text-warning fs-2"></i>
                  </div>
                </div>
                <div>
                  <h1 className="text-gray-800 fw-bold mb-1">
                    Estrutura Parlamentar
                  </h1>
                  <p className="text-muted mb-0">
                    Configure a estrutura de parlamentares, comissões e mesa diretora
                  </p>
                </div>
              </div>
              <div>
                <button className="btn btn-warning">
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
            <div className="symbol symbol-100px symbol-circle mx-auto mb-7 bg-light-warning">
              <div className="symbol-label">
                <i className="bi bi-tools fs-1 text-warning"></i>
              </div>
            </div>
            <h3 className="text-gray-800 mb-3">Funcionalidade em Desenvolvimento</h3>
            <p className="text-muted mb-7">
              Esta página de configuração está em desenvolvimento e será implementada em breve.<br/>
              Aqui você poderá configurar comissões, mesa diretora e estrutura parlamentar.
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