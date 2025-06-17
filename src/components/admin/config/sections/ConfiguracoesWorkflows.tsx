'use client'

import React from 'react'

interface ConfiguracoesWorkflowsProps {
  config: any
  onChange: () => void
}

export function ConfiguracoesWorkflows({ config, onChange }: ConfiguracoesWorkflowsProps) {
  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">
          <h3 className="fw-bold text-gray-800">
            <i className="bi bi-diagram-3 text-primary me-2"></i>
            Fluxos de Trabalho
          </h3>
        </div>
      </div>
      <div className="card-body">
        <div className="text-center py-10">
          <div className="symbol symbol-100px symbol-circle mx-auto mb-7 bg-light-success">
            <div className="symbol-label">
              <i className="bi bi-arrow-right-circle fs-1 text-success"></i>
            </div>
          </div>
          <h3 className="text-gray-800 mb-3">Workflows</h3>
          <p className="text-muted mb-0">
            Configuração de fluxos de tramitação e aprovação
          </p>
        </div>
      </div>
    </div>
  )
} 