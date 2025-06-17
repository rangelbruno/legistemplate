'use client'

import React from 'react'

interface ConfiguracoesTransparenciaProps {
  config: any
  onChange: () => void
}

export function ConfiguracoesTransparencia({ config, onChange }: ConfiguracoesTransparenciaProps) {
  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">
          <h3 className="fw-bold text-gray-800">
            <i className="bi bi-eye text-primary me-2"></i>
            Portal de Transparência
          </h3>
        </div>
      </div>
      <div className="card-body">
        <div className="text-center py-10">
          <div className="symbol symbol-100px symbol-circle mx-auto mb-7 bg-light-info">
            <div className="symbol-label">
              <i className="bi bi-globe fs-1 text-info"></i>
            </div>
          </div>
          <h3 className="text-gray-800 mb-3">Transparência Pública</h3>
          <p className="text-muted mb-0">
            Configurações do portal de transparência e acesso à informação
          </p>
        </div>
      </div>
    </div>
  )
} 