'use client'

import React, { useState } from 'react'

interface FixedActionBarProps {
  hasUnsavedChanges: boolean
  isLoading: boolean
  onSave: () => void
  onCancel: () => void
  onExport: () => void
  onImport: () => void
}

export function FixedActionBar({ 
  hasUnsavedChanges, 
  isLoading, 
  onSave, 
  onCancel, 
  onExport, 
  onImport 
}: FixedActionBarProps) {
  const [showDropdown, setShowDropdown] = useState(false)

  return (
    <div className="fixed-action-bar">
      <div className="container-fluid">
        <div className="row align-items-center">
          {/* Status e indicadores */}
          <div className="col-lg-6">
            <div className="d-flex align-items-center">
              {hasUnsavedChanges && (
                <div className="alert alert-warning d-flex align-items-center mb-0 me-4">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  <span className="fw-bold">Alterações não salvas</span>
                </div>
              )}
              
              {isLoading && (
                <div className="d-flex align-items-center text-muted">
                  <div className="spinner-border spinner-border-sm me-2" role="status">
                    <span className="visually-hidden">Salvando...</span>
                  </div>
                  <span>Salvando configurações...</span>
                </div>
              )}
              
              {!hasUnsavedChanges && !isLoading && (
                <div className="d-flex align-items-center text-success">
                  <i className="bi bi-check-circle me-2"></i>
                  <span>Todas as alterações salvas</span>
                </div>
              )}
            </div>
          </div>

          {/* Botões de ação */}
          <div className="col-lg-6">
            <div className="d-flex justify-content-end gap-3">
              {/* Botão Cancelar */}
              <button
                type="button"
                className="btn btn-light"
                onClick={onCancel}
                disabled={isLoading || !hasUnsavedChanges}
              >
                <i className="bi bi-x-circle me-2"></i>
                Cancelar
              </button>

              {/* Dropdown de ações */}
              <div className="dropdown">
                <button
                  type="button"
                  className="btn btn-secondary dropdown-toggle"
                  onClick={() => setShowDropdown(!showDropdown)}
                  disabled={isLoading}
                >
                  <i className="bi bi-gear me-2"></i>
                  Ações
                </button>
                {showDropdown && (
                  <div className="dropdown-menu show">
                    <button
                      className="dropdown-item"
                      onClick={() => {
                        onExport()
                        setShowDropdown(false)
                      }}
                    >
                      <i className="bi bi-download me-2"></i>
                      Exportar Configurações
                    </button>
                    <button
                      className="dropdown-item"
                      onClick={() => {
                        const input = document.createElement('input')
                        input.type = 'file'
                        input.accept = '.json'
                        input.onchange = (e) => {
                          const file = (e.target as HTMLInputElement).files?.[0]
                          if (file) {
                            onImport()
                          }
                        }
                        input.click()
                        setShowDropdown(false)
                      }}
                    >
                      <i className="bi bi-upload me-2"></i>
                      Importar Configurações
                    </button>
                    <div className="dropdown-divider"></div>
                    <button
                      className="dropdown-item text-warning"
                      onClick={() => {
                        if (confirm('Esta ação irá restaurar todas as configurações para os valores padrão. Continuar?')) {
                          // TODO: Implementar restauração para padrão
                          console.log('Restaurar para padrão')
                        }
                        setShowDropdown(false)
                      }}
                    >
                      <i className="bi bi-arrow-clockwise me-2"></i>
                      Restaurar Padrão
                    </button>
                  </div>
                )}
              </div>

              {/* Botão Salvar principal */}
              <button
                type="button"
                className="btn btn-primary"
                onClick={onSave}
                disabled={isLoading || !hasUnsavedChanges}
              >
                {isLoading ? (
                  <>
                    <div className="spinner-border spinner-border-sm me-2" role="status">
                      <span className="visually-hidden">Salvando...</span>
                    </div>
                    Salvando...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check-lg me-2"></i>
                    Salvar Configurações
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .fixed-action-bar {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: white;
          border-top: 1px solid #e4e6ea;
          padding: 1rem 0;
          z-index: 1040;
          box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
        }

        .alert {
          padding: 0.5rem 1rem;
          border-radius: 0.375rem;
          font-size: 0.875rem;
        }

        .dropdown-menu.show {
          display: block;
          position: absolute;
          bottom: 100%;
          right: 0;
          margin-bottom: 0.5rem;
        }

        .btn:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        @media (max-width: 991.98px) {
          .fixed-action-bar .row {
            flex-direction: column;
            gap: 1rem;
          }
          
          .fixed-action-bar .col-lg-6 {
            width: 100%;
          }
          
          .fixed-action-bar .d-flex.justify-content-end {
            justify-content: center !important;
          }
        }
      `}</style>
    </div>
  )
} 