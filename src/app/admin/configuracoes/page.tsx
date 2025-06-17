'use client'

import { Link } from 'react-router-dom'
import AdministradorLayout from '../layout'
import { PageTitle } from '../../../_metronic/layout/core'

/**
 * Página Principal de Configurações do Sistema
 * 
 * Interface com cards de atalhos para diferentes áreas de configuração.
 * Cada card direciona para uma página específica de configuração.
 */
export default function AdminConfiguracoes() {
  // Configurações organizadas por categoria com suas respectivas páginas
  const configSections = [
    {
      id: 'sistema-basico',
      title: 'Sistema Básico',
      icon: 'bi-sliders',
      description: 'Configurações gerais da instituição e parâmetros básicos do sistema',
      path: '/admin/configuracoes/sistema-basico',
      color: 'primary'
    },
    {
      id: 'usuarios-permissoes',
      title: 'Usuários e Permissões',
      icon: 'bi-people',
      description: 'Gestão de perfis de usuário e controle de acesso ao sistema',
      path: '/admin/configuracoes/usuarios-permissoes',
      color: 'success'
    },
    {
      id: 'documentos-templates',
      title: 'Documentos e Templates',
      icon: 'bi-file-text',
      description: 'Configuração de tipos de documentos e templates do sistema',
      path: '/admin/configuracoes/documentos-templates',
      color: 'info'
    },
    {
      id: 'estrutura-parlamentar',
      title: 'Estrutura Parlamentar',
      icon: 'bi-building',
      description: 'Gestão de parlamentares, comissões e mesa diretora',
      path: '/admin/configuracoes/estrutura-parlamentar',
      color: 'warning'
    },
    {
      id: 'processos-prazos',
      title: 'Processos e Prazos',
      icon: 'bi-clock',
      description: 'Configuração de prazos processuais e calendário legislativo',
      path: '/admin/configuracoes/processos-prazos',
      color: 'danger'
    },
    {
      id: 'calendario-sessoes',
      title: 'Calendário de Sessões',
      icon: 'bi-calendar-event',
      description: 'Agendamento de sessões ordinárias e extraordinárias',
      path: '/admin/configuracoes/calendario-sessoes',
      color: 'dark'
    },
    {
      id: 'integracoes',
      title: 'Integrações',
      icon: 'bi-link-45deg',
      description: 'Configuração de APIs externas e sincronizações',
      path: '/admin/configuracoes/integracoes',
      color: 'primary'
    },
    {
      id: 'configuracoes-tecnicas',
      title: 'Configurações Técnicas',
      icon: 'bi-gear',
      description: 'Backup, segurança, performance e transparência',
      path: '/admin/configuracoes/configuracoes-tecnicas',
      color: 'secondary'
    }
  ]

  return (
    <AdministradorLayout>
      <PageTitle 
        breadcrumbs={[
          { title: 'Administração', path: '/admin', isSeparator: false, isActive: false },
          { title: 'Configurações', path: '/admin/configuracoes', isSeparator: false, isActive: true }
        ]}
      >
        Configurações do Sistema
      </PageTitle>
      
      <div className="configuracoes-overview">
        {/* Header da página */}
        <div className="card mb-7">
          <div className="card-body">
            <div className="d-flex align-items-center">
              <div className="symbol symbol-60px symbol-circle bg-light-primary me-4">
                <div className="symbol-label">
                  <i className="bi bi-gear-fill text-primary fs-1"></i>
                </div>
              </div>
              <div className="flex-grow-1">
                <h1 className="text-gray-800 fw-bold mb-1">
                  Configurações do Sistema
                </h1>
                <p className="text-muted mb-0">
                  Gerencie todas as configurações do sistema parlamentar. Selecione uma área para começar.
                </p>
              </div>
              <div className="d-flex align-items-center">
                <span className="badge badge-light-success fs-7">
                  <i className="bi bi-check-circle me-1"></i>
                  Sistema Ativo
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Grid de cards de configuração */}
        <div className="row g-6 g-xl-9">
          {configSections.map((section) => (
            <div key={section.id} className="col-md-6 col-xl-4">
                             <Link to={section.path} className="text-decoration-none">
                <div className={`card card-hover card-flush h-100 config-card border-hover-${section.color}`}>
                  <div className="card-body d-flex flex-column justify-content-between">
                    <div>
                      <div className="d-flex align-items-center mb-4">
                        <div className={`symbol symbol-50px symbol-circle bg-light-${section.color} me-3`}>
                          <div className="symbol-label">
                            <i className={`${section.icon} text-${section.color} fs-2`}></i>
                          </div>
                        </div>
                        <div className="flex-grow-1">
                          <h3 className="text-gray-800 fw-bold mb-1 fs-5">
                            {section.title}
                          </h3>
                        </div>
                      </div>
                      
                      <p className="text-muted mb-4 fs-6">
                        {section.description}
                      </p>
                    </div>
                    
                    <div className="d-flex align-items-center justify-content-between">
                      <span className={`badge badge-light-${section.color} fs-8`}>
                        Configurar
                      </span>
                      <i className={`bi bi-arrow-right text-${section.color} fs-3`}></i>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* Card de informações adicionais */}
        <div className="card mt-7">
          <div className="card-body">
            <div className="row align-items-center">
              <div className="col-lg-8">
                <div className="d-flex align-items-center">
                  <div className="symbol symbol-40px symbol-circle bg-light-info me-3">
                    <div className="symbol-label">
                      <i className="bi bi-info-circle text-info fs-3"></i>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-gray-800 fw-bold mb-1">
                      Dicas importantes
                    </h4>
                    <p className="text-muted mb-0">
                      Sempre faça backup das configurações antes de realizar alterações importantes.
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 text-lg-end">
                <div className="d-flex flex-wrap gap-2 justify-content-lg-end">
                  <button className="btn btn-light btn-sm">
                    <i className="bi bi-download me-1"></i>
                    Exportar
                  </button>
                  <button className="btn btn-light btn-sm">
                    <i className="bi bi-upload me-1"></i>
                    Importar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Estilos customizados */}
      <style>{`
        .configuracoes-overview {
          min-height: 100vh;
        }

        .config-card {
          transition: all 0.3s ease;
          cursor: pointer;
          border: 2px solid transparent;
        }

        .config-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }

        .border-hover-primary:hover {
          border-color: var(--bs-primary) !important;
        }

        .border-hover-success:hover {
          border-color: var(--bs-success) !important;
        }

        .border-hover-info:hover {
          border-color: var(--bs-info) !important;
        }

        .border-hover-warning:hover {
          border-color: var(--bs-warning) !important;
        }

        .border-hover-danger:hover {
          border-color: var(--bs-danger) !important;
        }

        .border-hover-dark:hover {
          border-color: var(--bs-dark) !important;
        }

        .border-hover-secondary:hover {
          border-color: var(--bs-secondary) !important;
        }

        .card-hover {
          transition: all 0.15s ease-in-out;
        }

        .card-hover:hover {
          transform: translateY(-1px);
        }
      `}</style>
    </AdministradorLayout>
  )
} 