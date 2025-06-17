'use client'

import React from 'react'

interface ConfigSection {
  id: string
  title: string
  icon: string
  description: string
  categories: string[]
}

interface ConfigSidebarProps {
  sections: ConfigSection[]
  activeSection: string
  onSectionChange: (sectionId: string) => void
}

export function ConfigSidebar({ sections, activeSection, onSectionChange }: ConfigSidebarProps) {
  return (
    <div className="config-sidebar">
      <div className="card">
        <div className="card-header">
          <h3 className="card-title fw-bold">
            <i className="bi bi-list-ul me-2"></i>
            Seções de Configuração
          </h3>
        </div>
        <div className="card-body p-0">
          <div className="list-group list-group-flush">
            {sections.map((section) => (
              <button
                key={section.id}
                type="button"
                className={`list-group-item list-group-item-action d-flex align-items-start py-4 px-5 ${
                  activeSection === section.id ? 'active' : ''
                }`}
                onClick={() => onSectionChange(section.id)}
              >
                <div className="me-3">
                  <div className={`symbol symbol-40px symbol-circle ${
                    activeSection === section.id ? 'bg-primary' : 'bg-light-primary'
                  }`}>
                    <div className="symbol-label">
                      <i className={`${section.icon} ${
                        activeSection === section.id ? 'text-white' : 'text-primary'
                      } fs-4`}></i>
                    </div>
                  </div>
                </div>
                <div className="flex-grow-1">
                  <div className="fw-bold text-gray-800 mb-1">
                    {section.title}
                  </div>
                  <div className="text-muted fs-7 mb-2">
                    {section.description}
                  </div>
                  <div className="d-flex flex-wrap gap-1">
                    {section.categories.slice(0, 3).map((category) => (
                      <span
                        key={category}
                        className={`badge badge-sm ${
                          activeSection === section.id 
                            ? 'badge-light-primary' 
                            : 'badge-light'
                        }`}
                      >
                        {getCategoryLabel(category)}
                      </span>
                    ))}
                    {section.categories.length > 3 && (
                      <span className="badge badge-sm badge-light">
                        +{section.categories.length - 3}
                      </span>
                    )}
                  </div>
                </div>
                <div className="ms-2">
                  <i className={`bi bi-chevron-right text-muted ${
                    activeSection === section.id ? 'rotate-90' : ''
                  } transition-all`}></i>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Indicador de Status */}
      <div className="card mt-5">
        <div className="card-body text-center py-5">
          <div className="symbol symbol-50px symbol-circle mx-auto mb-3 bg-light-success">
            <div className="symbol-label">
              <i className="bi bi-check-circle text-success fs-3"></i>
            </div>
          </div>
          <h5 className="text-gray-800 mb-1">Sistema Configurado</h5>
          <p className="text-muted fs-7 mb-0">
            Todas as seções estão funcionais
          </p>
        </div>
      </div>

      <style>{`
        .config-sidebar .list-group-item {
          border: none;
          border-bottom: 1px solid #f1f1f2;
        }
        
        .config-sidebar .list-group-item:hover {
          background-color: #f8f9fa;
        }
        
        .config-sidebar .list-group-item.active {
          background-color: #f1f8ff;
          border-color: #009ef7;
        }
        
        .transition-all {
          transition: all 0.3s ease;
        }
        
        .rotate-90 {
          transform: rotate(90deg);
        }
      `}</style>
    </div>
  )
}

// Função auxiliar para converter categoria em label legível
function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    'geral': 'Geral',
    'sessao-legislativa': 'Sessões',
    'perfis': 'Perfis',
    'autenticacao': 'Auth',
    'documento-tipos': 'Docs',
    'workflows': 'Fluxos',
    'parlamentares': 'Parlamentares',
    'comissoes': 'Comissões',
    'mesa-diretora': 'Mesa',
    'prazos': 'Prazos',
    'feriados': 'Feriados',
    'numeracao': 'Numeração',
    'integracoes': 'APIs',
    'notificacoes': 'Notifs',
    'transparencia': 'Portal',
    'backup': 'Backup',
    'sessoes-ordinarias': 'Ordinárias',
    'sessoes-extraordinarias': 'Extraordinárias',
    'calendario': 'Calendário'
  }
  
  return labels[category] || category
} 