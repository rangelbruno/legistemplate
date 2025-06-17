'use client'

import React from 'react'

interface ConfiguracoesAutenticacaoProps {
  config: any
  onChange: () => void
}

export function ConfiguracoesAutenticacao({ config, onChange }: ConfiguracoesAutenticacaoProps) {
  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">
          <h3 className="fw-bold text-gray-800">
            <i className="bi bi-shield-check text-primary me-2"></i>
            Autenticação e Segurança
          </h3>
        </div>
      </div>
      <div className="card-body">
        <div className="text-center py-10">
          <div className="symbol symbol-100px symbol-circle mx-auto mb-7 bg-light-success">
            <div className="symbol-label">
              <i className="bi bi-lock fs-1 text-success"></i>
            </div>
          </div>
          <h3 className="text-gray-800 mb-3">Configurações de Segurança</h3>
          <p className="text-muted mb-0">
            Configurações de autenticação, senhas e políticas de segurança
          </p>
        </div>
      </div>
    </div>
  )
} 