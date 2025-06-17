'use client'

import React from 'react'

interface ConfiguracoesSessaoProps {
  config: any
  onChange: () => void
}

export function ConfiguracoesSessao({ config, onChange }: ConfiguracoesSessaoProps) {
  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">
          <h3 className="fw-bold text-gray-800">
            <i className="bi bi-calendar-event text-primary me-2"></i>
            Configurações de Sessão Legislativa
          </h3>
        </div>
      </div>
      <div className="card-body">
        <div className="text-center py-10">
          <div className="symbol symbol-100px symbol-circle mx-auto mb-7 bg-light-info">
            <div className="symbol-label">
              <i className="bi bi-calendar-week fs-1 text-info"></i>
            </div>
          </div>
          <h3 className="text-gray-800 mb-3">Configurações de Sessão</h3>
          <p className="text-muted mb-0">
            Configurações específicas das sessões legislativas serão implementadas aqui
          </p>
        </div>
      </div>
    </div>
  )
} 