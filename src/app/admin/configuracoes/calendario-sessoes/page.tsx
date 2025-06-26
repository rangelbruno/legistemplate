'use client'

import { useState } from 'react'
import { Link } from 'react-router-dom'
import AdministradorLayout from '../../layout'
import { PageTitle } from '../../../../_metronic/layout/core'
import { CalendarioSessoes } from '../../../../components/admin/config/sections/CalendarioSessoes'
import ListaSessoes from '../../../../components/admin/config/sections/ListaSessoes'

export default function CalendarioSessoesPage() {
  const [activeView, setActiveView] = useState<'calendario' | 'agenda'>('calendario')
  const [isLoading, setIsLoading] = useState(false)
  const [configurations] = useState<Record<string, unknown>>({})

  const handleConfigChange = () => {
    // Callback para quando as configurações mudarem
    console.log('Configurações de sessões atualizadas')
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      console.log('Configurações de sessões salvas')
    } catch (error) {
      console.error('Erro ao salvar:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AdministradorLayout>
      <PageTitle 
        breadcrumbs={[
          { title: 'Administração', path: '/admin', isSeparator: false, isActive: false },
          { title: 'Configurações', path: '/admin/configuracoes', isSeparator: false, isActive: false },
          { title: 'Calendário de Sessões', path: '/admin/configuracoes/calendario-sessoes', isSeparator: false, isActive: true }
        ]}
      >
        Calendário de Sessões
      </PageTitle>
      
      <div className="calendario-sessoes-config">
        {/* Header da página */}
        <div className="card mb-7">
          <div className="card-body">
            {/* Layout responsivo do cabeçalho */}
            <div className="row g-4">
              {/* Informações principais - sempre no topo */}
              <div className="col-12">
                <div className="d-flex align-items-center">
                  <Link to="/admin/configuracoes" className="btn btn-icon btn-sm btn-light me-3">
                    <i className="bi bi-arrow-left fs-3"></i>
                  </Link>
                  <div className="symbol symbol-50px symbol-circle bg-light-primary me-4 d-none d-md-flex">
                    <div className="symbol-label">
                      <i className="bi bi-calendar-event text-primary fs-2"></i>
                    </div>
                  </div>
                  <div className="flex-grow-1">
                    <h1 className="text-gray-800 fw-bold mb-1 fs-4 fs-md-2">
                      Calendário de Sessões Legislativas
                    </h1>
                    <p className="text-muted mb-0 fs-7 fs-md-6 d-none d-sm-block">
                      Gerencie sessões legislativas através do calendário visual ou lista detalhada
                    </p>
                  </div>
                </div>
              </div>

              {/* Controles de navegação e ações */}
              <div className="col-12">
                <div className="d-flex flex-column flex-lg-row align-items-stretch align-items-lg-center justify-content-between gap-3">
                  
                  {/* Navegação de visualizações - responsiva */}
                  <div className="btn-group-responsive">
                    <div className="btn-group d-none d-md-flex" role="group">
                      <button
                        type="button"
                        className={`btn btn-sm ${activeView === 'calendario' ? 'btn-primary' : 'btn-light'}`}
                        onClick={() => setActiveView('calendario')}
                      >
                        <i className="bi bi-calendar3 me-1"></i>
                        Calendário
                      </button>
                      <button
                        type="button"
                        className={`btn btn-sm ${activeView === 'agenda' ? 'btn-primary' : 'btn-light'}`}
                        onClick={() => setActiveView('agenda')}
                      >
                        <i className="bi bi-list-ul me-1"></i>
                        Lista
                      </button>

                    </div>

                    {/* Versão mobile - botões empilhados */}
                    <div className="d-flex d-md-none flex-wrap gap-2">
                      <button
                        type="button"
                        className={`btn btn-sm flex-fill ${activeView === 'calendario' ? 'btn-primary' : 'btn-light'}`}
                        onClick={() => setActiveView('calendario')}
                      >
                        <i className="bi bi-calendar3 me-1"></i>
                        <span className="d-none d-sm-inline">Calendário</span>
                        <span className="d-sm-none">Cal</span>
                      </button>
                      <button
                        type="button"
                        className={`btn btn-sm flex-fill ${activeView === 'agenda' ? 'btn-primary' : 'btn-light'}`}
                        onClick={() => setActiveView('agenda')}
                      >
                        <i className="bi bi-list-ul me-1"></i>
                        <span className="d-none d-sm-inline">Lista</span>
                        <span className="d-sm-none">List</span>
                      </button>

                    </div>
                  </div>

                  {/* Separador - apenas em desktop */}
                  <div className="separator separator-dashed h-30px d-none d-lg-block"></div>
                  
                  {/* Botão de salvar - responsivo */}
                  <div className="save-button-container">
                    <button 
                      className="btn btn-success btn-sm w-100 w-lg-auto"
                      onClick={handleSave}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          <span className="d-none d-sm-inline">Salvando...</span>
                          <span className="d-sm-none">...</span>
                        </>
                      ) : (
                        <>
                          <i className="bi bi-check2 me-2"></i>
                          <span className="d-none d-sm-inline">Salvar Alterações</span>
                          <span className="d-sm-none">Salvar</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Conteúdo principal */}
        <div className="row g-7">
          <div className="col-12">
            {activeView === 'calendario' && (
              <CalendarioSessoes 
                config={configurations} 
                onChange={handleConfigChange}
              />
            )}

            {activeView === 'agenda' && (
              <ListaSessoes 
                onEdit={(sessao) => console.log('Editar sessão:', sessao)}
                onDelete={(id) => console.log('Excluir sessão:', id)}
                onView={(sessao) => console.log('Visualizar sessão:', sessao)}
              />
            )}


          </div>
        </div>
      </div>

      {/* Estilos customizados para responsividade */}
      <style>{`
        /* Melhorias gerais de responsividade */
        .btn-group-responsive {
          width: 100%;
        }

        @media (max-width: 767.98px) {
          /* Mobile: Botões de navegação ocupam toda a largura */
          .btn-group-responsive .d-flex {
            width: 100%;
          }
          
          .btn-group-responsive .btn {
            min-height: 44px; /* Altura mínima para touch targets */
            font-size: 0.875rem;
          }

          /* Título menor em mobile */
          .fs-4 {
            font-size: 1.125rem !important;
          }

          /* Esconder descrição em telas muito pequenas */
          .card-body p.text-muted {
            font-size: 0.75rem;
          }
        }

        @media (max-width: 575.98px) {
          /* Extra small: Textos ainda mais compactos */
          .btn-group-responsive .btn {
            padding: 0.5rem 0.75rem;
            font-size: 0.8rem;
          }

          .save-button-container .btn {
            font-size: 0.875rem;
            padding: 0.625rem 1rem;
          }

          /* Ícone menor no cabeçalho em telas muito pequenas */
          .symbol.symbol-50px {
            width: 40px !important;
            height: 40px !important;
          }
        }

        @media (min-width: 768px) and (max-width: 991.98px) {
          /* Tablet: Layout intermediário */
          .btn-group .btn {
            font-size: 0.875rem;
            padding: 0.5rem 0.875rem;
          }
        }

        @media (min-width: 992px) {
          /* Desktop: Layout completo */
          .save-button-container {
            min-width: 200px;
          }
          
          .btn-group .btn {
            min-width: 120px;
          }
        }

        /* Animações suaves para transições */
        .btn-group-responsive .btn,
        .save-button-container .btn {
          transition: all 0.3s ease;
        }

        .btn-group-responsive .btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        /* Estados dos botões ativos com melhor contraste */
        .btn-primary {
          box-shadow: 0 2px 4px rgba(0,123,255,0.3);
        }

        .btn-success {
          box-shadow: 0 2px 4px rgba(40,167,69,0.3);
        }

        /* Melhoria do alinhamento dos ícones */
        .btn i {
          vertical-align: middle;
        }

        /* Separador responsivo */
        .separator.h-30px {
          align-self: stretch;
          height: auto !important;
          min-height: 30px;
        }

        /* Layout flexível melhorado */
        .d-flex.flex-column.flex-lg-row {
          align-items: stretch;
        }

        @media (min-width: 992px) {
          .d-flex.flex-column.flex-lg-row {
            align-items: center;
          }
        }

        /* Spinner responsivo */
        .spinner-border-sm {
          width: 0.875rem;
          height: 0.875rem;
        }

        /* Cores e contrastes melhorados */
        .btn-light {
          background-color: #f8f9fa;
          border-color: #e9ecef;
          color: #495057;
        }

        .btn-light:hover {
          background-color: #e9ecef;
          border-color: #dee2e6;
          color: #343a40;
        }

        .btn-light:focus {
          box-shadow: 0 0 0 0.2rem rgba(248,249,250,0.5);
        }

        /* Melhor espaçamento em dispositivos touch */
        @media (max-width: 767.98px) {
          .gap-2 {
            gap: 0.75rem !important;
          }
          
          .gap-3 {
            gap: 1rem !important;
          }
        }
      `}</style>
    </AdministradorLayout>
  )
} 