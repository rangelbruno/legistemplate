'use client'

import React from 'react'

interface ConfiguracoesIntegracoesProps {
  config: any
  onChange: () => void
}

export function ConfiguracoesIntegracoes({ config, onChange }: ConfiguracoesIntegracoesProps) {
  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">
          <h3 className="fw-bold text-gray-800">
            <i className="bi bi-link-45deg text-primary me-2"></i>
            Integrações Externas
          </h3>
        </div>
      </div>
      <div className="card-body">
        <div className="text-center py-10">
          <div className="symbol symbol-100px symbol-circle mx-auto mb-7 bg-light-danger">
            <div className="symbol-label">
              <i className="bi bi-cloud-arrow-up fs-1 text-danger"></i>
            </div>
          </div>
          <h3 className="text-gray-800 mb-3">APIs e Integrações</h3>
          <p className="text-muted mb-0">
            Configuração de APIs externas e sincronizações
          </p>
        </div>
      </div>
    </div>
  )
} 