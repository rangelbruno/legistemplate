'use client'

import React from 'react'

interface ConfiguracoesPerfilProps {
  config: any
  onChange: () => void
}

export function ConfiguracoesPerfis({ config, onChange }: ConfiguracoesPerfilProps) {
  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">
          <h3 className="fw-bold text-gray-800">
            <i className="bi bi-people text-primary me-2"></i>
            Perfis e Permissões
          </h3>
        </div>
      </div>
      <div className="card-body">
        <div className="text-center py-10">
          <div className="symbol symbol-100px symbol-circle mx-auto mb-7 bg-light-warning">
            <div className="symbol-label">
              <i className="bi bi-person-gear fs-1 text-warning"></i>
            </div>
          </div>
          <h3 className="text-gray-800 mb-3">Gestão de Perfis</h3>
          <p className="text-muted mb-0">
            Configurações de perfis de usuário e permissões serão implementadas aqui
          </p>
        </div>
      </div>
    </div>
  )
} 