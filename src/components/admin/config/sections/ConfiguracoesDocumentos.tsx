'use client'

import React from 'react'

interface ConfiguracoesDocumentosProps {
  config: any
  onChange: () => void
}

export function ConfiguracoesDocumentos({ config, onChange }: ConfiguracoesDocumentosProps) {
  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">
          <h3 className="fw-bold text-gray-800">
            <i className="bi bi-file-text text-primary me-2"></i>
            Tipos de Documentos
          </h3>
        </div>
      </div>
      <div className="card-body">
        <div className="text-center py-10">
          <div className="symbol symbol-100px symbol-circle mx-auto mb-7 bg-light-primary">
            <div className="symbol-label">
              <i className="bi bi-files fs-1 text-primary"></i>
            </div>
          </div>
          <h3 className="text-gray-800 mb-3">Gestão de Documentos</h3>
          <p className="text-muted mb-0">
            Configurações de tipos de documentos e templates
          </p>
        </div>
      </div>
    </div>
  )
} 