'use client'

import { ReactNode } from 'react'

interface DesenvolvedorLayoutProps {
  children: ReactNode
}

/**
 * Layout da Área do Desenvolvedor - Sistema de Tramitação Parlamentar
 * 
 * Layout específico para usuários com role DESENVOLVEDOR
 * Inclui navegação entre as telas do Sprint 1
 */
export default function DesenvolvedorLayout({ children }: DesenvolvedorLayoutProps) {

  return (
    <div className="desenvolvedor-area">
      {/* Header da Área do Desenvolvedor */}
      <div className="d-flex justify-content-between align-items-center mb-6 border-bottom pb-4">
        <div>
          <h2 className="text-dark fw-bold fs-4 mb-1">
            <i className="bi bi-code-slash text-primary me-2"></i>
            Área do Desenvolvedor
          </h2>
          <p className="text-muted fs-7 mb-0">
            Sistema de Tramitação Parlamentar - Sprint 1
          </p>
        </div>
        <div className="d-flex align-items-center gap-2">
          <span className="badge badge-light-success fs-7">
            Sprint 1 Completo
          </span>
          <span className="badge badge-light-primary fs-7">
            Desenvolvedor
          </span>
        </div>
      </div>


      {/* Conteúdo principal */}
      <main className="desenvolvedor-content">
        {children}
      </main>
    </div>
  )
} 